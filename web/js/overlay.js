// Vector overlay, in two layers:
//   BASE  - graticule, vector coast + rivers and the editor's expensive content (area fills, names, cities). It does not depend on
//           selection, hover or tool state, so it is painted into an offscreen bitmap and reused until the view or the content changes.
//   TOP   - selection, handles, rubber band, brush, measuring and the frame. Cheap, redrawn on top of the bitmap every frame.
// Moving the mouse over the map therefore never repaints the base. While the view is dragged or zoomed (flat projections) the base is
// shown from a bitmap that was painted with a margin, shifted / scaled to the current view; when the view leaves that margin a new
// one is painted centred on the current view (instead of falling back to a slow live paint every frame).
import { graticule, outline } from './projections.js';
import { buildPaths, visibleRings } from './vectors.js';
import { moveEps, lodEps } from './clip.js';
import { THEMES } from './themes.js';
import { plog, probeFlush } from './perflog.js';

const LOD_FLOOR = 2 ** -15;      // projected units (about 0.0017 deg): far below the coast data's point spacing, so a finer tolerance would only rebuild identical paths while zooming in deep
export function createOverlay(canvas) {
  const mainCtx = canvas.getContext('2d');
  let gKey = '', gGrat = [], gFrame = [];
  let vKey = '', vPaths = null, vec = null, baseDraw = null, topDraw = null;

  const COST_MS = 4, MARGIN = 0.32, MOVE_SD = 0.75, MOVE_SD_MIN = 0.4, MOVE_PX = 3.0e6, ZOOM = [0.6, 1.6];   // MOVE_SD: the pan bitmap is painted at <= 0.75 px per css px (about 45% fewer pixels than 1.0; the GL layer under it is at ~0.57 while moving). ZOOM: a zoom is shown by scaling the bitmap up to x4 before a rebuild is forced (was x2.2: a rebuild every ~2 wheel notches)
  let vx = 0, vy = 0, tPrev = 0;   // pan velocity (screen px / ms, y up), smoothed: a new pan bitmap is painted ahead of the movement
  let exactTimer = 0, exactDue = false, exact = null, moving = null, baseMs = 0, idleTimer = 0, lastV = null, lastBuild = 0, buildMs = 0, costPending = false;   // lastBuild / buildMs: when and how long the last pan bitmap took (rebuilds during a gesture are throttled by it)

  // everything the base picture depends on except the view position / zoom
  const sigOf = (v, dpr) => [v.def.id, v.lon0.toFixed(6), v.def.globe ? v.lat0.toFixed(6) : 0, v.graticuleStep, v.showCoast, v.showRivers, v.theme && v.theme.id, v.pole, v.ver, v.w, v.h, dpr].join('|');
  const drop = () => { clearTimeout(idleTimer); idleTimer = 0; clearTimeout(exactTimer); exactTimer = 0; exactDue = false; exact = null; moving = null; };

  const parts = { t0: 0, grat: 0, base: 0 };                // F4 only: time split of the last paintBase (graticule + coast + rivers / the editor's layer)
  let tiny = null;
  function paintBase(ctx, v, dpr) {
    if (plog.on) parts.t0 = performance.now();
    const OV = (v.theme || THEMES.atlas).ov;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, v.w, v.h);
    const orient = [v.lon0.toFixed(5), v.def.globe ? v.lat0.toFixed(5) : 0].join('|');
    const key = [v.def.id, v.graticuleStep, orient].join('|');
    if (key !== gKey) {
      gKey = key;
      gGrat = v.graticuleStep > 0 ? graticule(v.def, v.graticuleStep, v.lon0, v.lat0) : [];
      gFrame = outline(v.def, v.lon0, v.lat0);
    }
    const sx = (x) => v.w / 2 + (x - v.cx) * v.scale;
    const sy = (y) => v.h / 2 - (y - v.cy) * v.scale;
    if (gGrat.length) {
      ctx.strokeStyle = OV.grat; ctx.lineWidth = 0.8; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      for (const ln of gGrat) { ctx.moveTo(sx(ln[0][0]), sy(ln[0][1])); for (let i = 1; i < ln.length; i++) ctx.lineTo(sx(ln[i][0]), sy(ln[i][1])); }
      ctx.stroke();
    }
    const probe = plog.on && v.snapshot, fg = probe ? probeFlush(ctx.canvas) : 0;          // F4 only: the raster cost of the graticule, forced now
    if (vec && (v.showCoast || v.showRivers)) {
      const eps = v.def.globe ? (v.cheap || v.interacting ? moveEps(v.scale) : 0) : Math.max(lodEps(v.scale, 0.6), LOD_FLOOR);       // a rotating globe: fewer, coarser segments (what is rasterised every frame is what costs)
      const vk = v.def.id + '|' + orient + '|' + v.pole + '|' + eps;
      if (vk !== vKey) { vKey = vk; vPaths = buildPaths(v.def, vec, v.lon0, v.lat0, v.pole == null ? 4 : v.pole, eps); }
      const k = v.scale * dpr, grow = Math.min(1.6, Math.max(1, 1 + 0.12 * Math.log2(Math.max(v.zoomRel, 1))));
      ctx.setTransform(k, 0, 0, -k, dpr * (v.w / 2 - v.cx * v.scale), dpr * (v.h / 2 + v.cy * v.scale));
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      if (v.showRivers) {
        ctx.strokeStyle = OV.river;
        [0.75, 1.15, 1.6].forEach((px, i) => { ctx.lineWidth = (px * grow) / v.scale; ctx.stroke(vPaths.rivers[i]); });
      }
      if (v.showCoast) { ctx.strokeStyle = OV.coast; ctx.lineWidth = (1.1 * grow) / v.scale; const cp = visibleRings(vPaths.coastRings, v, 1.2); if (cp) ctx.stroke(cp); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const fc = probe ? probeFlush(ctx.canvas) : 0;                                 // F4 only: ... and of the coast + rivers
    const tb = plog.on ? performance.now() : 0;
    if (baseDraw) baseDraw(ctx, v);          // a rotating globe keeps its countries: the editor paints them in its cheap style (flat fills, no names) while v.interacting
    if (plog.on) { parts.grat = tb - parts.t0; parts.base = performance.now() - tb; }
    if (probe) { plog.snap = plog.snap || {}; plog.snap.fg = fg; plog.snap.fc = fc; }          // light: a globe being rotated paints graticule + coast + rivers only; the full picture returns at rest
  }
  function paintTop(ctx, v, interactive = true) {
    if (interactive && topDraw) topDraw(ctx, v);
    if (v.frame) {
      const OV = (v.theme || THEMES.atlas).ov, sx = (x) => v.w / 2 + (x - v.cx) * v.scale, sy = (y) => v.h / 2 - (y - v.cy) * v.scale;
      ctx.strokeStyle = OV.frame; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      if (gFrame.length) { ctx.moveTo(sx(gFrame[0][0]), sy(gFrame[0][1])); for (let i = 1; i < gFrame.length; i++) ctx.lineTo(sx(gFrame[i][0]), sy(gFrame[i][1])); ctx.closePath(); }
      ctx.stroke();
    }
  }

  /** the crisp base picture for exactly this view (full resolution), reused for hover / selection / tool changes */
  function ensureExact(v, dpr, sig) {
    if (exact && exact.sig === sig && exact.cx === v.cx && exact.cy === v.cy && exact.scale === v.scale) return;
    const cv = exact ? exact.cv : document.createElement('canvas'), w = canvas.width, h = canvas.height;
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const t0 = performance.now();
    paintBase(cv.getContext('2d'), { ...v, interacting: false, cheap: false, snapshot: false, exporting: false }, dpr);
    baseMs = performance.now() - t0;
    exact = { cv, sig, cx: v.cx, cy: v.cy, scale: v.scale };
  }
  /** the view a new pan bitmap is painted for: while a zoom eases, the view it is heading to (so the bitmap is already right when the ease ends and is not outdated again a moment later) */
  function buildView(v) {
    const T = v.target;
    if (v.zooming && T) { const r = T.scale / v.scale; return r > 0.62 && r < 1.7 ? { ...v, cx: T.cx, cy: T.cy, scale: T.scale, zoomRel: v.zoomRel * r } : v; }
    // panning: centre the bitmap ahead of the movement (up to 60% of the margin), so it lasts about twice as long before the view runs off its edge
    const capX = 0.6 * Math.round(MARGIN * v.w), capY = 0.6 * Math.round(MARGIN * v.h), ox = Math.max(-capX, Math.min(capX, vx * 450)), oy = Math.max(-capY, Math.min(capY, vy * 450));
    return ox || oy ? { ...v, cx: v.cx + ox / v.scale, cy: v.cy + oy / v.scale } : v;
  }
  /** a margin bitmap centred on this view, painted in the cheaper style (no blur) at <= MOVE_SD css px per pixel. The margin is a share of EACH axis (a wide window is not given a tall margin it never uses), and the resolution drops on very large windows so that the pixel count stays under MOVE_PX: the cost of a rebuild follows it. idle: built while nothing moves (no time limit for the name pictures) */
  function buildMoving(v, dpr, sig, idle = false) {
    const mx = Math.round(MARGIN * v.w), my = Math.round(MARGIN * v.h), w = v.w + 2 * mx, h = v.h + 2 * my;
    const sd = Math.max(MOVE_SD_MIN, Math.min(dpr, MOVE_SD, Math.sqrt(MOVE_PX / (w * h))));
    const cv = moving ? moving.cv : document.createElement('canvas'), pw = Math.round(w * sd), ph = Math.round(h * sd);
    if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }      // assigning the size (even the same one) re-allocates the backing store; paintBase clears it anyway
    if (plog.on) plog.snap = {};                                                     // F4 only: the stages below add their own figures
    paintBase(cv.getContext('2d'), { ...v, w, h, interacting: false, cheap: true, exporting: false, snapshot: true, idle }, sd);
    if (plog.on) {                                       // F4 only: draw the bitmap into a 1x1 canvas to force its pending drawing to run now, so that cost shows up as `flush` instead of as a stall in a later frame
      const tf = performance.now(); tiny = tiny || document.createElement('canvas'); tiny.width = tiny.height = 1; tiny.getContext('2d').drawImage(cv, 0, 0, 1, 1);
      plog.snap = { ...(plog.snap || {}), grat: parts.grat, base: parts.base, flush: performance.now() - tf };
    }
    moving = { cv, sig, cx: v.cx, cy: v.cy, scale: v.scale, w: v.w, h: v.h, mx, my };
  }
  /** the margin bitmap is usable and still roughly centred on this view (otherwise it is worth preparing a new one while idle) */
  const movingFresh = (v, sig) => { const k = moving && v.scale / moving.scale; return !!moving && moving.sig === sig && k > 0.8 && k < 1.25 && Math.abs(moving.cx - v.cx) * v.scale < 0.4 * moving.mx && Math.abs(moving.cy - v.cy) * v.scale < 0.4 * moving.my; };
  /** shifts / scales the margin bitmap onto the main canvas; false when it does not cover the view */
  function blitMoving(v, dpr, sig, stale = false) {
    if (!moving || moving.sig !== sig) return false;
    const k = v.scale / moving.scale;
    if (stale ? (k < (v.zooming ? 0.45 : 0.3) || k > 5) : (k < ZOOM[0] || k > ZOOM[1])) return false;
    const tx = v.w / 2 - (v.w / 2 + moving.mx) * k + (moving.cx - v.cx) * v.scale, ty = v.h / 2 - (v.h / 2 + moving.my) * k - (moving.cy - v.cy) * v.scale;
    const W = moving.w + 2 * moving.mx, H = moving.h + 2 * moving.my;
    if (!stale && (tx > 0 || ty > 0 || tx + W * k < v.w || ty + H * k < v.h)) return false;       // an edge would show: needs a new bitmap (stale: draw it anyway)
    mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    mainCtx.setTransform(dpr * k, 0, 0, dpr * k, dpr * tx, dpr * ty);
    mainCtx.drawImage(moving.cv, 0, 0, W, H);
    mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  const api = {
    onRequest: null,                                   // set by the app: asks for a redraw (the deferred crisp repaint after a gesture)
    invalidate() { drop(); },
    setVectors(v) { vec = v; vKey = ''; drop(); },
    /** fn(ctx, v): the editor's expensive content (goes into the cached base layer) */
    setExtraDraw(fn) { baseDraw = fn; drop(); },
    /** fn(ctx, v): the cheap interactive content drawn over the base layer every frame */
    setTopDraw(fn) { topDraw = fn; },
    resize(cssW, cssH, dpr) {
      drop();
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      this.dpr = dpr;
    },
    /** v: { def, cx, cy, scale, lon0, lat0, w, h, graticuleStep, frame, showCoast, showRivers, zoomRel, interacting, ver (content version: bumps when anything in the base layer changes except the view) } */
    info: { branch: '', ms: 0 },                       // what the last draw() did, for the F4 recorder
    draw(v) {
      const dpr = this.dpr || 1;
      let br = 'rest', hv = 0;                         // br: path taken this frame; hv: ms spent in a heavy repaint (recording time only)
      if (v.exporting) {                                                       // export: one direct, clean picture (no selection, no handles)
        paintBase(mainCtx, v, dpr);
        paintTop(mainCtx, v, false);
        return;
      }
      const sig = sigOf(v, dpr);
      { const tn = performance.now(), dt = tn - tPrev; tPrev = tn;
        if (costPending) { costPending = false; if (v.interacting && dt > 0 && dt < 600) buildMs = Math.max(buildMs, dt - 6); }          // the frame after a rebuild shows what it really cost (the raster work it queued is not in buildMs); rebuilds are spaced by it
        if (lastV && !v.def.globe && dt > 0 && dt < 200 && lastV.scale === v.scale) { vx = vx * 0.7 + 0.3 * (v.cx - lastV.cx) * v.scale / dt; vy = vy * 0.7 + 0.3 * (v.cy - lastV.cy) * v.scale / dt; } else { vx = vy = 0; } }
      lastV = v;
      if (v.interacting) { clearTimeout(exactTimer); exactTimer = 0; exactDue = false; }
      clearTimeout(idleTimer); idleTimer = 0;
      if (v.interacting && !v.def.globe) {                                     // flat map being moved: ALWAYS use the pan bitmap. (It used to depend on baseMs, the time spent issuing the draw calls; with GPU-rasterised canvases that is tiny while the real cost is paid later, so heavy scenes were judged cheap and repainted live every frame.)
        br = 'pan-blit';
        if (!blitMoving(v, dpr, sig)) {
          const t = performance.now();
          if (blitMoving(v, dpr, sig, true) && (t - lastBuild < Math.max(v.zooming ? 350 : 200, Math.min(900, 4 * buildMs)))) { br = 'pan-blit-STALE'; /* stale bitmap shown; while a zoom ease runs it is never rebuilt (the bitmap would be stale again a moment later and the crisp repaint follows the zoom anyway), otherwise the next rebuild is not due yet */ }
          else { buildMoving(buildView(v), dpr, sig); blitMoving(v, dpr, sig, true); lastBuild = performance.now(); buildMs = lastBuild - t; costPending = true; br = 'pan-REBUILD'; hv = buildMs; if (plog.on) plog.ev('pan-rebuild', { ms: buildMs, w: moving.cv.width, h: moving.cv.height, ...(plog.snap || {}), z: +v.zoomRel.toFixed(2) }); }
        }
      } else if (v.interacting && v.def.globe) {                               // a globe rotates, a bitmap cannot follow: live (and cheaper) painting
        const t0 = performance.now(); paintBase(mainCtx, { ...v, cheap: true, light: true }, dpr); baseMs = performance.now() - t0; br = 'globe-live';
      } else if (v.interacting) {                                              // cheap scene: live painting is fine
        const t0 = performance.now(); paintBase(mainCtx, v, dpr); baseMs = performance.now() - t0; br = 'live';
      } else if (!v.def.globe && !exactDue && !(exact && exact.sig === sig && exact.cx === v.cx && exact.cy === v.cy && exact.scale === v.scale) && blitMoving(v, dpr, sig, true)) {
        // the gesture just ended: keep showing the pan bitmap and paint the crisp picture a moment later, instead of in the very frame the finger lifts (that was the hitch at the end of every drag / zoom)
        br = 'deferred-blit';
        if (!exactTimer) exactTimer = setTimeout(() => { exactTimer = 0; exactDue = true; if (api.onRequest) api.onRequest(); }, 80);
      } else {                                                                 // at rest: crisp bitmap of exactly this view (a hover only redraws the top layer)
        exactDue = false;
        const hadExact = exact && exact.sig === sig && exact.cx === v.cx && exact.cy === v.cy && exact.scale === v.scale, te = performance.now();
        ensureExact(v, dpr, sig);
        br = hadExact ? 'exact-cached' : 'EXACT-PAINT'; if (!hadExact) { hv = performance.now() - te; if (plog.on) plog.ev('exact-paint', { ms: hv }); }
        mainCtx.setTransform(1, 0, 0, 1, 0, 0);
        mainCtx.clearRect(0, 0, canvas.width, canvas.height);
        mainCtx.drawImage(exact.cv, 0, 0);
        mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!v.def.globe && !movingFresh(v, sig)) {   // prepare the pan bitmap while nothing is happening, so the first drag is smooth
          idleTimer = setTimeout(() => { idleTimer = 0; if (lastV === v && !movingFresh(v, sig)) { const tb = performance.now(); buildMoving(v, dpr, sig, true); if (plog.on) plog.ev('idle-prebuild', { ms: performance.now() - tb }); } }, 400);
        }
      }
      mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintTop(mainCtx, v);
      api.info = { branch: br, ms: hv };
    },
  };
  return api;
}