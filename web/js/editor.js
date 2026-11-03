// Map editor: countries (polygons), cities, labels. Everything is stored in lon/lat; edges are great-circle
// arcs, so a feature drawn in one projection is correct in all of them. Rendering and hit-testing share one
// projected cache per feature.
import { project, unproject, DEG, wrapLon } from './projections.js';
import { densify, toVec, fromVec, ringAreaKm2 } from './spherical.js';
import { clipRing, moveEps } from './clip.js';
import { visibleRings } from './vectors.js';
import { spineOf, thicknessPx, layoutName, NAME_VARIANTS } from './labelspine.js';
import { createPlacer, glyphsHit, glyphsAdd } from './textplace.js';
import { createLru } from './perf.js';
import { createLandClip } from './landclip.js';
import { createShoreClip } from './shoreclip.js';
import { union, unionRings, subtract, intersect, overlaps, planarArea, weld } from './polyops.js';
import { createLandArea } from './landarea.js';
import { THEMES } from './themes.js';
import { plog } from './perflog.js';
import { createSpriteCache, bucketOf, scaleOfBucket, makeCanvas } from './namesprites.js';
import { strokeRing } from './brush.js';
import { flattenRing, splitSegment, curveMid, defaultHandle, hasHandle, hasOut, segmentCurved } from './pen.js';
import { boxOf, boxesTouch, shapeArea, shapeAdd, shapeSubtract, shapeIntersect, shapesOverlap } from './multiring.js';
import { COUNTRY_PALETTE, CLASH_DE, pickCountryColor, nearestDistance, ringsNear } from './countrycolors.js';
import { TIER_BY_ID, DRAW_ORDER, roadWidthPx, tierShown } from './roads.js';

export const PALETTE = COUNTRY_PALETTE;                                    // 36 colours; a new country's colour is picked by chooseCountryColor() below
const ACCENT = '#2f6f94', INK = '#34485a', SNAP_PX = 9, HANDLE_PX = 9, CLICK_PX = 4;

export const RANGE_COLOR = '#8a6d4b';
const wrapDeg = (d) => ((d + 540) % 360 + 360) % 360 - 180;
const isPoly = (f) => f.kind === 'country' || f.kind === 'subdivision';
const isArea = (f) => isPoly(f) || f.kind === 'range';
const isRoad = (f) => f.kind === 'road';
const isLine = (f) => f.kind === 'river' || f.kind === 'road';                 // open lines: one ring, never closed, no fill
const isLineTool = (t) => t === 'river' || t === 'road';
const isShape = (f) => isArea(f) || isLine(f);
const MAX_LEVELS = 5;
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a) => { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; };
const mix = (h, h2, t) => { const a = hexToRgb(h), b = hexToRgb(h2); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; };

// ---- country colours: boosted saturation + a baked noise tile (one pattern fill per colour: same cost as a flat fill) ----
const toHex = (r, g, b) => '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
const mixHex = (h, h2, t) => { const a = hexToRgb(h), b = hexToRgb(h2); return toHex(...a.map((v, i) => v + (b[i] - v) * t)); };
function popHex(h, sat, light) {
  const [r, g, b] = hexToRgb(h).map((x) => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  let hh = 0; if (d) hh = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  const s2 = Math.min(1, (d ? d / (1 - Math.abs(2 * l - 1)) : 0) * sat), l2 = Math.min(0.9, l * light), c = (1 - Math.abs(2 * l2 - 1)) * s2, x = c * (1 - Math.abs((hh % 2) - 1)), m = l2 - c / 2;
  const [r2, g2, b2] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(hh) % 6];
  return toHex((r2 + m) * 255, (g2 + m) * 255, (b2 + m) * 255);
}
const hash = (n) => { let h = (n ^ 0x9e3779b9) >>> 0; h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const tiles = new Map(), pops = new Map();
const bordCache = new Map();      // border colour per country colour + theme: the string used to be rebuilt for every country on every repaint
const borderOf = (base, M, sub) => {
  const t = sub ? M.borderMix * 0.7 : M.borderMix, k = base + '|' + M.border + '|' + t;
  let s = bordCache.get(k);
  if (s === undefined) { if (bordCache.size > 600) bordCache.clear(); s = mix(base, M.border, t); bordCache.set(k, s); }
  return s;
};
let pm = null;
function tileFor(hex, alpha, amp) {
  const key = hex + '|' + alpha + '|' + amp; let t = tiles.get(key); if (t !== undefined) return t;
  if (tiles.size > 300) tiles.clear();
  t = null;
  if (amp > 0 && typeof document !== 'undefined' && document.createElement) {
    const N = 128, G = 8, cv = document.createElement('canvas'); cv.width = cv.height = N;
    const g = cv.getContext('2d');
    if (g && g.createImageData) {
      const img = g.createImageData(N, N), d = img.data, base = hexToRgb(hex), coarse = Array.from({ length: G * G }, (_, i) => hash(i * 7 + 3));
      const sm = (u) => u * u * (3 - 2 * u), cg = (x, y) => coarse[(y % G) * G + (x % G)];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {                     // wrapped low-frequency blotches + per-pixel grain: the tile repeats seamlessly
        const fx = (x / N) * G, fy = (y / N) * G, x0 = Math.floor(fx), y0 = Math.floor(fy), u = sm(fx - x0), w = sm(fy - y0);
        const lo = (cg(x0, y0) * (1 - u) + cg(x0 + 1, y0) * u) * (1 - w) + (cg(x0, y0 + 1) * (1 - u) + cg(x0 + 1, y0 + 1) * u) * w;
        const n = 0.6 * lo + 0.4 * hash(y * N + x + 99991), f = 1 + (n - 0.5) * 2 * amp, o = (y * N + x) * 4;
        d[o] = base[0] * f; d[o + 1] = base[1] * f; d[o + 2] = base[2] * f; d[o + 3] = Math.min(255, alpha * 255 * (1 + (n - 0.5) * amp));
      }
      g.putImageData(img, 0, 0); t = { cv, pat: null };
    }
  }
  tiles.set(key, t); return t;
}
/** fill style for an area: the noise pattern, anchored to the map, grain size fixed on screen (px = projected units per css pixel; dpr0 = device pixel ratio) */
let fillScale = 1;
function areaFill(ctx, hex, alpha, amp, px, dpr0) {
  alpha = Math.min(1, alpha * fillScale);
  const t = tileFor(hex, alpha, amp); if (!t) return rgba(hex, alpha);
  const pat = t.pat || (t.pat = ctx.createPattern(t.cv, 'repeat')); if (!pat) return rgba(hex, alpha);
  if (pat.setTransform && typeof DOMMatrix !== 'undefined') { pm = pm || new DOMMatrix(); pm.a = pm.d = px / dpr0; pat.setTransform(pm); }
  return pat;
}

// City markers: the zoom (relative to the fitted whole-world view) from which each kind is drawn and can be picked. Zoomed out further, no dot is drawn at all.
const CITY_MIN_Z = { capital: 1.4, subcap: 1.8, city: 1.8, town: 3.5 };
const cityShown = (f, isSubCap, z, isNat) => z >= (f.rank === 'capital' || isNat ? CITY_MIN_Z.capital : isSubCap ? CITY_MIN_Z.subcap : f.rank === 'city' ? CITY_MIN_Z.city : CITY_MIN_Z.town);
const MERGE_TOL = 0.05;                                                 // degrees (~5 km): borders this close to each other join on merge
export function createEditor({ store, getView, getCoast, requestRender, onContent = () => {}, onSelect, onTool, onHint, onPick, isVisible: isVisibleBase = () => true }) {
  // layer switches (Layers panel): hidden kinds are neither drawn nor hit-tested
  let layers = { countries: true, cities: true, other: true };
  let roadOpts = { on: true, all: false, tiers: {} }, roadTier = 'highway';       // Roads panel: master switch, "every tier at every zoom", per-tier switches (a missing tier = on); roadTier = the tier the Road tool draws
  const isVisible = (f) => isVisibleBase(f) && (f.kind === 'city' ? layers.cities : isPoly(f) ? layers.countries : f.kind === 'road' ? roadOpts.on && roadOpts.tiers[f.tier] !== false : layers.other);
  /** a road's tier is drawn at the view's zoom (finer tiers appear as you zoom in); hidden tiers are not picked or snapped to either */
  const roadZoomOk = (f, v) => { const t = TIER_BY_ID.get(f.tier); return !t || tierShown(t, v.zoomRel || 1, roadOpts.all); };
  /** the Road tool, or dragging a point of the selected road, joins other roads */
  const roadSnapOn = () => { if (tool === 'road') return true; const s = sel && store.find(sel.id); return !!s && s.kind === 'road'; };
  let relocating = null;                                                                      // id of the city waiting for its new position (next map click)
  let spot = null;                                                                          // spot: id of the area the info card / "Show on map" points at (its border shimmers; nothing is selected, no handles)
  let hl = null, cityHintText = '', cityHintAt = 0;                                           // hl: id of the area / city the pointer is over in a list (drawn softly on the map); the city tool's "placing in ..." hint
  let tool = 'pan', parentOverride = null, sel = null, drawing = null, hover = null, drag = null, snapOn = true, clipOn = true;
  let level = 0, brushR = 14, brushErase = false, stroke = null, brushAt = null;   // level: 0 = automatic (sub tool) / country (brush), else the level new areas are drawn at; brushR: brush radius in screen px
  const projCache = new WeakMap(), spines = new WeakMap(), revs = new WeakMap(), rects = new WeakMap();
  let contentRev = 0;
  const bump = (f) => { revs.set(f, (revs.get(f) || 0) + 1); contentRev++; onContent(); };
  const isBrush = () => tool === 'brush';
  const isPen = () => ['country', 'range', 'sub', 'river', 'road', 'expand', 'cut'].includes(tool);
  const segCount = (f, ri = 0) => (isLine(f) ? f.rings[0].length - 1 : f.rings[ri].length);
  /** which ring of the selected feature is being edited (its points are shown); 0 for a feature that is not selected */
  const activeRing = (f) => { const k = sel && sel.id === f.id ? sel.ring | 0 : 0; return k > 0 && k < f.rings.length ? k : 0; };
  let frameIdx = null;                                                   // id -> feature, built per draw() so the parent walks below are O(1) instead of O(n)
  const byId = (id) => (frameIdx && frameIdx.get(id)) || store.features.find((x) => x.id === id);
  const depthOf = (f) => { let d = 0, p = f; while (p && p.kind === 'subdivision' && d < 60) { p = byId(p.parent); d++; } return d; };
  const rootOf = (f) => { let p = f, n = 0; while (p && p.kind === 'subdivision' && n++ < 60) p = byId(p.parent); return p; };
  /** countries drawn inside country f: f has a hole where they are (they are kept as their own countries) */
  let frameEnc = null;                                                   // per-draw index (built in drawBase)
  const enclavesOf = (f) => (f && f.kind === 'country' ? (frameEnc ? frameEnc.get(f.id) || [] : store.features.filter((g) => g.enclaveOf === f.id && isVisible(g))) : []);
  const inHostPair = (a, b) => a.enclaveOf === b.id || b.enclaveOf === a.id;
  const childrenOf = (id) => store.features.filter((x) => x.kind === 'subdivision' && x.parent === id);
  const descendants = (id) => { const out = []; for (const c of childrenOf(id)) out.push(c, ...descendants(c.id)); return out; };
  const curved = (f) => !!f.handles && f.handles.some(hasHandle);
  const shapes = new WeakMap();
  /** the outline pieces of a feature with curves sampled: an array of rings ([lon, lat] points). Ring 0 is the one that carries the curve handles.
   *  READ-ONLY: never change the array or its rings. Cached per revision. */
  const shapeOf = (f) => {
    const rev = revs.get(f) || 0, h = shapes.get(f);
    if (h && h.rev === rev) return h.rings;
    const rings = curved(f) ? [flattenRing(f.rings[0], f.handles, !isLine(f)), ...f.rings.slice(1)] : f.rings;
    shapes.set(f, { rev, rings }); return rings;
  };
  const flatOf = (f) => shapeOf(f)[0];                                    // ONLY for rivers and ranges (always one ring)
  const partCount = (f) => Math.max(0, shapeOf(f).length - 1);            // separate parts besides the first
  const boxList = new WeakMap();
  const boxesOf = (f) => {                                                // one box per ring, cached per revision
    const rev = revs.get(f) || 0, h = boxList.get(f);
    if (h && h.rev === rev) return h.b;
    const b = shapeOf(f).map(boxOf); boxList.set(f, { rev, b }); return b;
  };
  /** a ring is only edited through these two: they keep the curve handles (ring 0 only) valid.
   *  Call inside the store.edit / store.live that changes the border. `ring0` = the old shapeOf(f)[0], or null when ring 0 is gone/changed. */
  const setRings = (f, rings, ring0) => {
    if (f.handles && ring0 && rings[0] === ring0) rings[0] = f.rings[0]; else delete f.handles;
    f.rings = rings; bump(f);
  };
  const midOf = (f, i, ri = 0) => {                                       // middle of segment i -> i+1 (great circle, or the curve; curves exist on ring 0 only)
    const ring = f.rings[ri], j = (i + 1) % ring.length, hs = ri === 0 ? f.handles : null;
    if (hs && segmentCurved(hs, i, j)) return curveMid(ring[i], hs[i], ring[j], hs[j]);
    const m = fromVec((() => { const a = toVec(...ring[i]), b = toVec(...ring[j]); return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; })());
    return [m[0] / DEG, m[1] / DEG];
  };
  function insertVertex(f, i, ri = 0) {                                   // keeps the curve shape when the segment is curved
    const ring = f.rings[ri], n = ring.length, j = (i + 1) % n;
    if (ri !== 0) { ring.splice(i + 1, 0, midOf(f, i, ri)); return; }     // only ring 0 has curves
    const hs = f.handles || (f.handles = ring.map(() => null));
    if (segmentCurved(hs, i, j)) {
      const r = splitSegment(ring[i], hs[i], ring[j], hs[j]);
      ring.splice(i + 1, 0, r.pt); hs.splice(i + 1, 0, r.mid); hs[i] = r.a; hs[j === 0 ? 0 : i + 2] = r.b;
    } else { ring.splice(i + 1, 0, midOf(f, i)); hs.splice(i + 1, 0, null); }
    if (!hs.some(hasHandle)) delete f.handles;
  }
  /** "Base N": the first N from count + 1 on that no other name in `taken` already uses, so a new area never repeats a name after something was deleted */
  const freshName = (base, taken, count) => { const used = new Set(taken); let n = count + 1; while (used.has(`${base} ${n}`) && n < count + 100000) n++; return `${base} ${n}`; };
  const hints = {
    pan: 'Navigate: drag to pan, wheel to zoom. Nothing is added or changed in this mode. Pick a tool (V select, C country, S subdivision, R range, I river, O road, P city, T label) to edit.',
    river: 'River: click to add points along the river (Shift+drag for a curve) · drag to pan, wheel to zoom · Enter or double-click to finish · Delete removes the last point · Esc cancels',
    road: 'Road: click to add points along the road (Shift+drag for a curve) · points join other roads and borders (hold Alt to bypass) · keys 1-5 pick the tier · drag to pan, wheel to zoom · Enter or double-click to finish · Delete removes the last point · Esc cancels',
    expand: 'Expand: draw an area on the selected border; if it touches the border it is added to it, if it is somewhere else it becomes a separate part (a separate part of the same country: an island or exclave) · drag to pan · Enter or double-click to finish · Esc cancels · Brush (B) paints it on instead',
    cut: 'Cut: draw an area over the part of the selected border to remove · drag to pan · Enter or double-click to finish · Esc cancels · Brush (B) erases it instead',
    merge: 'Merge: click the neighbouring country (or same-level subdivision) to join with the selected one · Esc cancels',
    sub: 'Subdivision: start the outline inside a country or subdivision (it becomes a child of it, at most 5 levels) · click for corners, Shift+drag for curves · drag to pan · borders snap to the parent and neighbours, are clipped to the parent and never overlap same-level subdivisions · Enter or double-click to finish · Esc cancels',
    select: 'Click a country, city or label to edit it · drag empty map to pan · drag points to reshape · double-click an edge to add a point · double-click a point to switch corner / curve · Alt while dragging a curve handle moves it alone · click another part of the selected country to edit its points',
    country: 'Pen tool: click for a corner, Shift+drag for a curve, plain drag pans · points attach to neighbouring borders · the finished border is cut to the coast, so draw freely over the sea (hold Alt while clicking to disable) · click the first point, Enter or double-click to finish · Delete removes the last point · Esc cancels',
    brush: 'Brush: drag to paint a border - it adds to the selected country / subdivision (or starts a new one) · Shift = erase while painting · Ctrl+click picks the area to paint on · Space+drag or wheel to move around · Esc deselects, then leaves',
    city: 'Click to place a city · Esc when done',
    label: 'Click to place a text label · Esc when done',
    range: 'Draw a mountain range area with the pen tool: click for corners, click-and-drag for curves · Enter or double-click to finish · Delete removes the last point · Esc cancels',
  };
  const setHint = () => onHint && onHint(hints[tool]);

  // ---------- view helpers ----------
  const lat0 = (v) => (v.def.globe ? v.lat0 : 0);
  const toScreen = (v, lon, lat) => {
    const p = project(v.def, lon * DEG, lat * DEG, v.lon0, lat0(v));
    return p ? [v.w / 2 + (p[0] - v.cx) * v.scale, v.h / 2 - (p[1] - v.cy) * v.scale] : null;
  };
  const fromScreen = (v, sx, sy) => {
    const r = unproject(v.def, v.cx + (sx - v.w / 2) / v.scale, v.cy - (sy - v.h / 2) / v.scale, v.lon0, lat0(v));
    return r ? [r[0] / DEG, r[1] / DEG] : null;
  };

  /** the densified outline (great-circle samples every 0.5 degrees, radians). It does not depend on the view, so it is built once per
   *  geometry revision instead of on every frame of a globe rotation / central-meridian change (that was the dominant per-frame cost). */
  const dens = new WeakMap();
  const densOf = (f, closed) => {                                          // one densified outline per ring
    const rev = revs.get(f) || 0, h = dens.get(f);
    if (h && h.rev === rev && h.closed === closed) return h.d;
    const d = shapeOf(f).map((r) => densify(r, closed, 0.5)); dens.set(f, { rev, closed, d }); return d;
  };
  /** densified, projected outline of a country (cached until geometry or view orientation changes) */
  function projRing(f, v, eps = 0) {                                             // eps > 0: coarser outline for a globe being rotated
    const lo = Math.round(v.lon0 * 1e5), la = v.def.globe ? Math.round(v.lat0 * 1e5) : 0, rev = revs.get(f) || 0, hit = projCache.get(f);          // plain numbers: no key string per feature per call
    if (hit && hit.def === v.def.id && hit.lo === lo && hit.la === la && hit.rev === rev && hit.eps === eps) return hit;
    const closed = !isLine(f), pts = [], rings = [], bb = [Infinity, Infinity, -Infinity, -Infinity];
    let whole = true;
    for (const d of densOf(f, closed)) {                                  // every land part of the feature, cut at the seam / horizon on its own
      const r = clipRing(v.def, d, closed, v.lon0, lat0(v), eps);
      if (!r.whole) whole = false;
      for (const ch of r.chains) { if (pts.length) pts.push(null); for (const p of ch) pts.push(p); }
      for (const ring of r.rings) { rings.push(ring); for (const p of ring) { if (p[0] < bb[0]) bb[0] = p[0]; if (p[1] < bb[1]) bb[1] = p[1]; if (p[0] > bb[2]) bb[2] = p[0]; if (p[1] > bb[3]) bb[3] = p[1]; } }
    }
    if (!closed) for (const p of pts) if (p) { if (p[0] < bb[0]) bb[0] = p[0]; if (p[1] < bb[1]) bb[1] = p[1]; if (p[0] > bb[2]) bb[2] = p[0]; if (p[1] > bb[3]) bb[3] = p[1]; }      // open lines (rivers, roads): bounds from their pieces, so culling, picking and snapping can reject a far line without any per-point work
    const c = { def: v.def.id, lo, la, rev, eps, pts, rings, ok: rings.length > 0, closed: closed && whole, bb: rings.length || bb[0] <= bb[2] ? bb : null };
    projCache.set(f, c);
    return c;
  }
  /** the shape's projected bounds reach the area being painted (a margin covers strokes and halos); off-screen shapes are skipped */
  const reachesView = (c, v) => {
    const b = c.bb; if (!b) return true;
    const m = 40, hw = v.w / 2, hh = v.h / 2, s = v.scale;
    return hw + (b[2] - v.cx) * s >= -m && hw + (b[0] - v.cx) * s <= v.w + m && hh - (b[3] - v.cy) * s <= v.h + m && hh - (b[1] - v.cy) * s >= -m;
  };
  const screenPts = (c, v) => c.pts.map((p) => (p ? [v.w / 2 + (p[0] - v.cx) * v.scale, v.h / 2 - (p[1] - v.cy) * v.scale] : null));
  /** the projected outline as one Path2D in projected units, built once per cache entry (drawn through a transform, so a pan or zoom does no per-point work) */
  function unitPath(c) {
    if (c.path) return c.path;
    const path = new Path2D();
    for (const r of c.rings) { if (r.length < 3) continue; path.moveTo(r[0][0], r[0][1]); for (let i = 1; i < r.length; i++) path.lineTo(r[i][0], r[i][1]); path.closePath(); }
    return (c.path = path);
  }
  /** the border only (what to stroke): open pieces that stop at the seam / horizon instead of running along it */
  function strokePath(c) {
    if (c.spath) return c.spath;
    if (c.closed) return (c.spath = unitPath(c));
    const path = new Path2D(); let started = false;
    for (const p of c.pts) { if (!p) { started = false; continue; } if (started) path.lineTo(p[0], p[1]); else { path.moveTo(p[0], p[1]); started = true; } }
    return (c.spath = path);
  }
  /** runs fn(px) with the context mapped to projected units; px is one screen pixel in those units (use it for line widths and dashes) */
  function inUnits(ctx, v, fn) {
    const T = ctx.getTransform(), k = v.scale * T.a;
    ctx.save();
    ctx.setTransform(k, 0, 0, -k, T.a * (v.w / 2 - v.cx * v.scale), T.a * (v.h / 2 + v.cy * v.scale));
    fn(1 / v.scale);
    ctx.restore();
  }
  /** centre line + thickness of an area, in lon/lat (view independent, recomputed only when the shape changes) */
  const spineFor = (f) => {
    const rev = revs.get(f) || 0, h = spines.get(f);
    if (h && h.rev === rev) return h.sp;
    const sh = shapeOf(f); let big = sh[0], ba = -1;
    if (sh.length > 1) for (const r of sh) { const a = planarArea(r); if (a > ba) { ba = a; big = r; } }     // the name goes on the largest land part
    const sp = spineOf(big); spines.set(f, { rev, sp }); return sp;
  };
  const advCache = createLru(4000);                                        // glyph advances per font + text (a map with hundreds of names used to evict and re-measure them on every repaint)
  const nameSprites = createSpriteCache(), NO_SPRITE = { none: true, sb: 1, px: 0 }, SPRITE_BUILD_MS = 12;      // name pictures for the pan bitmap (namesprites.js); at most SPRITE_BUILD_MS of new ones per rebuild while the view moves
  let subCapCache = null;
  const nameLayouts = new WeakMap();      // feature -> last name layout (see drawFrame)
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const timings = { polys: 0, ranges: 0, names: 0, rest: 0, total: 0 };      // ms of the last draw() (names includes user rivers); shown by the F3 readout

  // ---------- snapping ----------
  let grid = null;
  function coastGrid() {
    if (grid) return grid;
    const coast = getCoast && getCoast(); if (!coast) return null;
    grid = new Map();
    for (const p of coast) for (let i = 0; i < p.length; i += 2) {
      const lo = p[i] / DEG, la = p[i + 1] / DEG, k = Math.floor(lo) + ',' + Math.floor(la);
      let a = grid.get(k); if (!a) grid.set(k, (a = [])); a.push(lo, la);
    }
    return grid;
  }
  let clipper = null;
  const getClip = () => { if (clipper) return clipper; const c = getCoast && getCoast(); return c ? (clipper = createLandClip(c)) : null; };
  let shore = null;                                                          // shoreclip.js engine, built on first use, dropped when the coast changes
  const getShore = () => { if (shore) return shore; const c = getCoast && getCoast(); return c ? (shore = createShoreClip(c)) : null; };
  /** nearest point on any visible country's outline within `max` px (screen space on the densified arcs) */
  function edgeSnap(v, sx, sy, max, exclude, pred = isPoly) {
    let best = null, bd = max;
    for (const f of store.features) {
      if (!pred(f) || !isVisible(f) || (exclude && exclude.id === f.id)) continue;
      const c = projRing(f, v);
      if (c.bb) { const b = c.bb, s = v.scale, m = max; if (sx < v.w / 2 + (b[0] - v.cx) * s - m || sx > v.w / 2 + (b[2] - v.cx) * s + m || sy < v.h / 2 - (b[3] - v.cy) * s - m || sy > v.h / 2 - (b[1] - v.cy) * s + m) continue; }   // far from the pointer: no per-point work
      const pts = screenPts(c, v);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]; if (!a || !b) continue;
        const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
        const t = L ? Math.max(0, Math.min(1, ((sx - a[0]) * dx + (sy - a[1]) * dy) / L)) : 0;
        const px = a[0] + t * dx, py = a[1] + t * dy, d = Math.hypot(sx - px, sy - py);
        if (d < bd) { bd = d; best = [px, py]; }
      }
    }
    if (!best) return null;
    const ll = fromScreen(v, best[0], best[1]);
    return ll ? { ll, d: bd } : null;
  }
  function snapAt(sx, sy, alt, exclude) {
    const v = getView(), ll = fromScreen(v, sx, sy);
    if (!ll) return null;
    const out = { ll, snapped: false };
    if (!snapOn || alt) return out;
    let best = null, bd = SNAP_PX;
    const consider = (lo, la) => {
      const s = toScreen(v, lo, la); if (!s) return;
      const d = Math.hypot(s[0] - sx, s[1] - sy); if (d < bd) { bd = d; best = [lo, la]; }
    };
    const s2 = fromScreen(v, sx + SNAP_PX, sy);
    let r = s2 ? Math.hypot(wrapLon((s2[0] - ll[0]) * DEG) / DEG * Math.cos(ll[1] * DEG), s2[1] - ll[1]) : 1;
    r = Math.min(6, Math.max(0.05, r));
    const rl = Math.min(25, r / Math.max(Math.cos(ll[1] * DEG), 0.1));
    const near = (b) => ll[1] >= b[1] - r && ll[1] <= b[3] + r && (ll[0] >= b[0] - rl && ll[0] <= b[2] + rl || ll[0] + 360 >= b[0] - rl && ll[0] + 360 <= b[2] + rl || ll[0] - 360 >= b[0] - rl && ll[0] - 360 <= b[2] + rl);
    for (const f of store.features) {
      if (!isPoly(f) || !isVisible(f)) continue;
      const bs = boxesOf(f);
      f.rings.forEach((ring, ri) => {
        if (!near(bs[ri])) return;                                       // this land part is nowhere near the pointer
        ring.forEach((p, i) => { if (exclude && exclude.id === f.id && exclude.idx === i && (exclude.ri || 0) === ri) return; consider(p[0], p[1]); });
      });
    }
    if (drawing) drawing.pts.forEach((p) => consider(p[0], p[1]));
    if (roadSnapOn()) for (const f of store.features) {                              // roads join other roads: their points here, their lines below. The box test keeps this at one comparison per far road
      if (!isRoad(f) || !isVisible(f) || !roadZoomOk(f, v)) continue;
      if (!near(boxesOf(f)[0])) continue;
      f.rings[0].forEach((p, i) => { if (exclude && exclude.id === f.id && exclude.idx === i && (exclude.ri || 0) === 0) return; consider(p[0], p[1]); });
    }
    const g = coastGrid();
    if (g) {
      for (let cy = Math.floor(ll[1] - r); cy <= Math.floor(ll[1] + r); cy++)
        for (let cx = Math.floor(ll[0] - rl); cx <= Math.floor(ll[0] + rl); cx++) {
          const a = g.get((((cx + 180) % 360 + 360) % 360 - 180) + ',' + cy);
          if (a) for (let i = 0; i < a.length; i += 2) consider(a[i], a[i + 1]);
        }
    }
    if (best) { out.ll = [best[0], best[1]]; out.snapped = true; }
    else {
      const e = (roadSnapOn() && edgeSnap(v, sx, sy, SNAP_PX, exclude, isRoad)) || edgeSnap(v, sx, sy, SNAP_PX, exclude);          // attach to the middle of another road (road tools only), else of a neighbour's border
      if (e) { out.ll = e.ll; out.snapped = true; return out; }
    }
    if (clipOn && !out.snapped && tool !== 'country') {                                          // over water: pull the point onto the coast
      const lc = getClip(), t = lc && lc.toLand(out.ll);
      if (t && t.moved) { out.ll = t.ll; out.snapped = true; }
    }
    return out;
  }

  // ---------- selection / tools ----------
  function select(id, vertex = null, opts = {}) {
    sel = id ? { id, vertex, ring: opts.ring | 0 } : null;
    onSelect && onSelect(id ? store.find(id) : null, opts);
    requestRender();
  }
  function setTool(t, parent = null) {
    const from = tool, border = t === 'expand' || t === 'cut', sameBorder = t === 'brush' || border;
    if (t === 'brush' && (from === 'expand' || from === 'cut')) { if (!parent) parent = parentOverride; brushErase = from === 'cut'; }   // Expand/Cut -> Brush keeps the same border; Cut -> Brush erases
    tool = t; drawing = null; hover = null; stroke = null; brushAt = null; parentOverride = parent; cityHintText = '';
    const keep = sameBorder && (parent || (sel && isPoly(store.find(sel.id) || {})));          // brush / expand / cut work on the selected area, so they keep (or take) the selection
    if (t !== 'select' && !keep) select(null);
    if (sameBorder && parent) select(parent);
    onTool && onTool(t); setHint(); requestRender();
  }
  // ---------- subdivision rules: inside the parent, never overlapping a same-level sibling ----------
  const say = (m) => onHint && onHint(m);
  /** clips subdivision f to its parent and away from same-level siblings; false when nothing is left */
  function fit(f) {
    const par = byId(f.parent); if (!par) return true;
    const shape = shapeOf(f), before = shapeArea(shape);
    let out = shapeIntersect(shape, shapeOf(par), boxesOf(par));                                 // inside the parent (any of its land parts)
    const me = store.features.indexOf(f), mine = me < 0 ? Infinity : me;                          // the older sibling keeps its border line
    if (out.length && par.kind === 'country') for (const e of enclavesOf(par)) if (out.length) out = shapeSubtract(out, shapeOf(e), boxesOf(e));   // subdivisions keep out of the enclaves
    store.features.forEach((s, i) => { if (out.length && s.parent === par.id && s.kind === 'subdivision' && s !== f && i < mine) out = shapeSubtract(out, shapeOf(s), boxesOf(s)); });
    if (!out.length) return false;
    if (Math.abs(shapeArea(out) - before) > 1e-9 * Math.max(1, before)) setRings(f, out, shape[0]);
    return true;
  }
  /** a country never overlaps an older one: the overlap is cut away, so both share the older border line */
  function fitCountry(f, shape = shapeOf(f)) {
    const me = store.features.indexOf(f), mine = me < 0 ? Infinity : me;
    let out = shape;
    store.features.forEach((g, i) => { if (out.length && g.kind === 'country' && g !== f && !inHostPair(g, f) && i < mine) out = shapeSubtract(out, shapeOf(g), boxesOf(g)); });
    return out.length ? out : null;
  }
  // ---------- country colours: a new country never wears a colour close to one of its neighbours (countrycolors.js) ----------
  const autoColors = new Map();                                              // country id -> the colour picked for it in this session; a colour the user changed no longer matches, so it is left alone
  /** the colours of the countries whose outline touches / nearly touches one of `rings` (the group of `self` is skipped; `host` = the country an enclave lies in) */
  function neighbourColors(rings, self, host) {
    const out = new Set();
    if (host && host.color) out.add(host.color);
    for (const g of store.features) {
      if (g.kind !== 'country' || g === self) continue;
      const col = g.color; if (!col || out.has(col)) continue;
      if (shapeOf(g).some((gr) => rings.some((r) => ringsNear(r, gr)))) out.add(col);
    }
    return [...out];
  }
  const colorsInUse = (self) => store.features.filter((g) => g.kind === 'country' && g !== self && g.color).map((g) => g.color);
  /** the colour for the new country `f` whose final (flat) outline is `ring` */
  function chooseCountryColor(f, rings, host) {
    const c = pickCountryColor({ neighbours: neighbourColors(rings, null, host), used: colorsInUse(f) });
    autoColors.set(f.id, c); return c;
  }
  /** after a country grew (brush, expand): if it now touches a country whose colour is too close to its own, it gets a new one. Only for colours picked in this session: a colour set by hand stays. Call inside the store.edit that changed the border. */
  function recolorIfClash(main) {
    if (!main || main.kind !== 'country' || autoColors.get(main.id) !== main.color) return;
    const host = main.enclaveOf ? byId(main.enclaveOf) : null, nb = neighbourColors(shapeOf(main), main, host);
    if (!nb.length || nearestDistance(main.color, nb) >= CLASH_DE) return;
    const c = pickCountryColor({ neighbours: nb, used: colorsInUse(main) });
    main.color = c; autoColors.set(main.id, c);
  }
  /** after f's border changed: re-fit its descendants (they vanish when nothing is left inside) */
  function cascade(f, gone) {
    for (const c of childrenOf(f.id)) { if (!fit(c)) { gone.add(c.id); for (const d of descendants(c.id)) gone.add(d.id); } else cascade(c, gone); }
  }
  const settle = (f) => {                                                  // fit + cascade inside the current undo step
    const gone = new Set(); let ok = true; bump(f);
    if (f.kind === 'subdivision') ok = fit(f);
    if (f.kind === 'country') {
      const cur = shapeOf(f), r = fitCountry(f, cur);
      if (r && Math.abs(shapeArea(r) - shapeArea(cur)) > 1e-9 * Math.max(1, shapeArea(r))) setRings(f, r, cur[0]);
    }
    const idx = store.features.indexOf(f);                                  // younger neighbours of the same level give way to f
    if (ok && (f.kind === 'country' || f.kind === 'subdivision')) store.features.forEach((g, i) => {
      if (i <= idx || g === f || inHostPair(g, f) || g.kind !== f.kind || (f.kind === 'subdivision' && g.parent !== f.parent)) return;
      const cur = shapeOf(g), r = shapeSubtract(cur, shapeOf(f), boxesOf(f));
      if (!r.length) { gone.add(g.id); for (const d of descendants(g.id)) gone.add(d.id); }
      else if (Math.abs(shapeArea(r) - shapeArea(cur)) > 1e-9 * Math.max(1, shapeArea(r))) { setRings(g, r, cur[0]); cascade(g, gone); }
    });
    if (ok) cascade(f, gone);
    if (gone.size) store.live((all) => { for (let i = all.length - 1; i >= 0; i--) if (gone.has(all[i].id)) all.splice(i, 1); });
    return ok;
  };
  const ancestorAt = (f, depth) => { let p = f; while (p && depthOf(p) > depth) p = byId(p.parent); return p; };

  /** Adds the area `add` to the border of `tgt`. If it overlaps or touches the border (or one of its separate parts) it is joined to it.
   *  If it touches none of them it becomes a separate part (an exclave / island) of the same country or subdivision.
   *  Returns 'joined' | 'part' | 'inside' (nothing new) | 'outside' (a subdivision part would fall outside its parent). */
  /** `ring` without the land other countries already hold (the host of an enclave is not subtracted from the enclave's own growth, as before). Returns a shape. */
  function freeOfCountries(tgt, ring) {
    let out = [ring];
    if (tgt.kind === 'country') for (const g of store.features) {
      if (!out.length) break;
      if (g.kind !== 'country' || g === tgt || g.id === tgt.enclaveOf) continue;
      out = shapeSubtract(out, shapeOf(g), boxesOf(g));
    }
    return out;
  }
  /** Adds the pieces `adds` (flat rings) to the border of `tgt`: a piece that overlaps or touches one of its land parts is joined to it, a piece that
   *  touches none becomes a NEW separate part (island / exclave) of the same country or subdivision.
   *  Returns 'joined' | 'part' | 'inside' (nothing new) | 'outside' (a subdivision may not take it) | 'enclave' (an enclave cannot grow away from its host). */
  function expandBorder(tgt, adds) {
    const shape = shapeOf(tgt), before = shapeArea(shape);
    let rings = shape, joined = false, parted = false;
    for (const a of adds) { const r = shapeAdd(rings, a); rings = r.rings; if (r.merged) joined = true; else parted = true; }
    if (shapeArea(rings) - before < 1e-9) return 'inside';
    if (tgt.enclaveOf && parted) return 'enclave';
    if (tgt.kind === 'subdivision') {                                       // the new area must lie inside its parent and keep clear of same-level siblings: try it first
      const keepRings = tgt.rings, keepHandles = tgt.handles;
      tgt.rings = rings; delete tgt.handles; bump(tgt);
      const ok = fit(tgt), grew = ok && shapeArea(shapeOf(tgt)) - before > 1e-9;
      tgt.rings = keepRings; if (keepHandles) tgt.handles = keepHandles; bump(tgt);
      if (!grew) return 'outside';
    }
    store.edit(() => { setRings(tgt, rings, shape[0]); settle(tgt); recolorIfClash(tgt); });
    return joined ? 'joined' : 'part';
  }
  const expandSay = (res, tgt, what) => {
    if (res === 'inside') say(`${what} is already inside the border.`);
    else if (res === 'outside') say('A subdivision must lie inside its parent and cannot overlap a subdivision of the same level.');
    else if (res === 'enclave') say('An enclave stays inside the country around it, so it cannot get a separate part somewhere else.');
    else if (res === 'part') say(`Added as a separate part of ${tgt.name || 'the area'} (it does not touch the border). Click it on the map to reshape its points, or use "Detach part" to make it its own ${tgt.kind === 'country' ? 'country' : 'subdivision'}.`);
  };

  function finishDrawing() {
    if (!drawing) return;
    const pts = drawing.pts.slice(), hs = drawing.hs.slice(), noClip = drawing.noClip, parentId = drawing.parent, target = byId(parentOverride), t = tool, line = isLineTool(t);
    if (pts.length > 1) {
      const a = pts[pts.length - 1], b = pts[pts.length - 2];
      if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) { pts.pop(); hs.pop(); }      // double-click duplicate
    }
    drawing = null;
    if (pts.length < (line ? 2 : 3)) { setHint(); requestRender(); return; }
    const lc = !line && clipOn && !noClip && t !== 'country' && getClip();
    if (lc && !hasHandle(hs[0]) && !hasHandle(hs[hs.length - 1])) { const e = lc.clipSegment(pts[pts.length - 1], pts[0]); pts.push(...e); hs.push(...e.map(() => null)); }   // the closing edge follows the coast too
    if (t === 'expand' || t === 'cut') {                                   // change the selected border instead of creating a feature
      if (!target) { setTool('pan'); return; }
      const ring = flattenRing(pts, hs, true), back = () => { setTool('select'); select(target.id); };
      if (t === 'expand') {
        const adds = freeOfCountries(target, ring);
        if (!adds.length) { say('That area lies inside other countries.'); back(); return; }
        expandSay(expandBorder(target, adds), target, 'The new area'); back(); return;
      }
      const cur = shapeOf(target), r = shapeSubtract(cur, [ring]);
      if (!r.length) { say('Nothing would be left of the border.'); back(); return; }
      if (Math.abs(shapeArea(r) - shapeArea(cur)) < 1e-9) { say('The cut area does not overlap the border.'); back(); return; }
      store.edit(() => { setRings(target, r, cur[0]); settle(target); });
      back(); return;
    }
    buildArea(t === 'range' ? 'range' : t === 'sub' ? 'subdivision' : line ? (t === 'road' ? 'road' : 'river') : 'country', pts, hs, parentId, false, { shore: t === 'country' && clipOn && !noClip });
  }
  /** the country that wholly contains `ring` (a new enclave goes inside it), or null */
  function enclaveHost(ring) {
    const A = planarArea(ring), rb = boxOf(ring);
    for (const g of store.features) {
      if (g.kind !== 'country' || !isVisible(g)) continue;
      const sh = shapeOf(g), bs = boxesOf(g);
      for (let k = 0; k < sh.length; k++) {
        if (!boxesTouch(rb, bs[k])) continue;
        const r = intersect(ring, sh[k]);
        if (r && Math.abs(planarArea(r) - A) <= 1e-6 * Math.max(1, A)) return g;
      }
    }
    return null;
  }
  /** creates a country / subdivision / range / river from a finished outline and selects it. `brush`: stay in the brush tool (so the next stroke adds to it) instead of switching to select. Returns the feature or null. */
  function buildArea(kind, pts, hs, parentId, brush, opts = {}) {
    const bail = () => { if (!brush) setTool('pan'); return null; };
    const n = store.features.filter((f) => f.kind === kind).length;
    let f;
    if (kind === 'subdivision') {
      const par = byId(parentId);
      if (!par) return bail();
      const root = rootOf(par), d = depthOf(par) + 1;
      if (d > MAX_LEVELS) { say(`Subdivisions go at most ${MAX_LEVELS} levels deep.`); return bail(); }
      if (!root.levels) root.levels = [];
      const lname = (root.levels[d - 1]) || 'Level ' + d, sibsList = childrenOf(par.id);
      f = { id: store.newId('sub'), kind, name: freshName(lname, sibsList.map((x) => x.name), sibsList.length), color: PALETTE[(n + 3) % PALETTE.length], parent: par.id, rings: [pts], life: { from: null, to: null }, notes: '', facts: {} };
      if (hs.some(hasHandle)) f.handles = hs;
      store.features.push(f); const ok = fit(f); store.features.pop();          // trial fit, the real insert is below
      if (!ok) { say('A subdivision must lie inside its parent and cannot overlap a subdivision of the same level.'); bump(f); return bail(); }
    } else f = kind === 'range'
      ? { id: store.newId('range'), kind, name: freshName('Range', store.features.filter((x) => x.kind === 'range').map((x) => x.name), n), color: RANGE_COLOR, density: 1, rings: [pts], life: { from: null, to: null }, notes: '' }
      : kind === 'road'
        ? { id: store.newId('road'), kind, tier: roadTier, name: freshName(TIER_BY_ID.get(roadTier).label, store.features.filter((x) => x.kind === 'road' && x.tier === roadTier).map((x) => x.name), store.features.filter((x) => x.kind === 'road' && x.tier === roadTier).length), rings: [pts], life: { from: null, to: null }, notes: '' }
      : kind === 'river'
        ? { id: store.newId('river'), kind, name: freshName('River', store.features.filter((x) => x.kind === 'river').map((x) => x.name), n), color: '#4a86b8', width: 1, rings: [pts], life: { from: null, to: null }, notes: '' }
        : { id: store.newId('country'), kind, name: freshName('Country', store.features.filter((x) => x.kind === 'country').map((x) => x.name), n), color: PALETTE[n % PALETTE.length], rings: [pts], life: { from: null, to: null }, notes: '' };
    if (kind === 'country') {
      const ringNow = flattenRing(pts, hs, true), host = enclaveHost(ringNow);
      if (host) {
        if (enclavesOf(host).some((e) => shapeOf(e).some((r) => overlaps(ringNow, r)))) { say('An enclave cannot overlap another enclave of the same country.'); return bail(); }
        f.enclaveOf = host.id;                                                  // drawn inside host: host gets a hole, this stays its own country
      } else {
        const r = fitCountry(f, [ringNow]);
        if (!r) { say('That area lies entirely inside existing countries.'); return bail(); }
        if (r.length !== 1 || Math.abs(shapeArea(r) - planarArea(ringNow)) > 1e-9) { f.rings = r; hs.length = 0; }
      }
    }
    let shoreRes = null;                                                       // the outline cut to land: every land piece becomes a ring of THIS country
    if (kind === 'country' && opts.shore && !brush && !f.enclaveOf) {
      const sc = getShore();
      if (sc) {
        shoreRes = clipShape(sc, hs.some(hasHandle) ? [flattenRing(pts, hs, true)] : f.rings);
        if (shoreRes.status === 'ok') { f.rings = shoreRes.rings; hs.length = 0; }       // curves are replaced by the clipped polylines
      }
    }
    if (kind === 'country') f.color = chooseCountryColor(f, hs.some(hasHandle) ? [flattenRing(pts, hs, true)] : f.rings, f.enclaveOf ? byId(f.enclaveOf) : null);
    if (kind !== 'subdivision' && hs.some(hasHandle)) f.handles = hs;
    if (kind === 'subdivision' && !f.rings[0].length) return null;
    store.edit((all) => {
      if (f.kind === 'subdivision') {
        const par = byId(f.parent), root = rootOf(par), d = depthOf(par) + 1;
        if (!root.levels) root.levels = [];
        while (root.levels.length < d) root.levels.push('Level ' + (root.levels.length + 1));
      }
      all.push(f);
    });
    if (brush) select(f.id); else { setTool('select'); select(f.id, null, { focusName: true }); }
    { const m = shoreSay(shoreRes, f.rings.length); if (m) say(m); }       // after setTool, which would otherwise overwrite the hint
    if (f.kind === 'road') { const rt = TIER_BY_ID.get(f.tier); if (rt && !tierShown(rt, getView().zoomRel || 1, roadOpts.all)) say(`${rt.plural} are drawn from zoom \u00d7${rt.minZ}: zoom in, or switch on "Every tier at every zoom" in the Roads panel, to see this road.`); }
    return f;
  }
  /** merge `b` into `a` (countries, or subdivisions of the same parent). Touching/overlapping borders become one outline;
   *  a far island (nothing touching) becomes a separate part of `a` that stays editable on its own. */
  function mergeInto(a, b) {
    if (a === b) return;
    if (a.enclaveOf || b.enclaveOf || inHostPair(a, b)) { say('An enclave cannot be merged. Its outline is the hole in the country around it.'); return; }
    const aShape = shapeOf(a); let rings = aShape, joined = false;
    for (const rb of shapeOf(b)) {
      let w = rb;
      for (const ra of rings) if (boxesTouch(boxOf(w), boxOf(ra), MERGE_TOL)) w = weld(w, ra, MERGE_TOL);      // borders drawn separately share their edge exactly, so they join
      const res = shapeAdd(rings, w); rings = res.rings; if (res.merged) joined = true;
    }
    store.edit((all) => {
      for (const g of all) if (g.enclaveOf === b.id) g.enclaveOf = a.id;
      for (const c of all) if (c.kind === 'subdivision' && c.parent === b.id) c.parent = a.id;
      setRings(a, rings, aShape[0]);
      if (a.kind === 'country' && b.levels && (a.levels || []).length < b.levels.length) a.levels = (a.levels || []).concat(b.levels.slice((a.levels || []).length));
      all.splice(all.indexOf(b), 1);
      const gone = new Set(); cascade(a, gone); if (a.kind === 'subdivision') fit(a);
      for (let i = all.length - 1; i >= 0; i--) if (gone.has(all[i].id)) all.splice(i, 1);
    });
    setTool('select'); select(a.id);
    if (!joined) say(`${b.name || 'It'} was added to ${a.name || 'the area'} as a separate part (it does not touch the border). Click it on the map to reshape it, or use "Detach part" to split it off again.`);
  }
  /** Splits land part k off `f`: it becomes its own country (or its own subdivision of the same parent). One undo step. Returns the new feature or null. */
  function detachRing(f, k) {
    if (!f || !isPoly(f)) return null;
    const shape = shapeOf(f); if (shape.length < 2 || !(k >= 0 && k < shape.length)) return null;
    const ring = shape[k], rest = shape.filter((_, i) => i !== k), ring0 = shape[0];
    const name = freshName(f.name || (f.kind === 'country' ? 'Country' : 'Area'), store.features.filter((x) => x.kind === f.kind).map((x) => x.name), 1);
    const nf = f.kind === 'country'
      ? { id: store.newId('country'), kind: 'country', name, color: f.color, rings: [ring], life: { from: null, to: null }, notes: '', levels: (f.levels || []).slice() }
      : { id: store.newId('sub'), kind: 'subdivision', name, color: f.color, parent: f.parent, rings: [ring], life: { from: null, to: null }, notes: '', facts: {} };
    store.edit((all) => {
      setRings(f, rest, k === 0 ? null : ring0);
      all.push(nf);
      if (nf.kind === 'country') nf.color = chooseCountryColor(nf, [ring], null);
      for (const c of childrenOf(f.id)) { const cs = shapeOf(c), tot = shapeArea(cs); if (tot > 0 && shapeArea(shapeIntersect(cs, [ring])) > 0.5 * tot) c.parent = nf.id; }   // subdivisions that mostly lie on that part go with it
      for (const g of all) if (g.enclaveOf === f.id) { const e0 = shapeOf(g)[0]; if (e0 && e0.length && pip(e0[0], ring)) g.enclaveOf = nf.id; }
      const gone = new Set(); cascade(f, gone); cascade(nf, gone);
      for (let i = all.length - 1; i >= 0; i--) if (gone.has(all[i].id)) all.splice(i, 1);
    });
    select(nf.id); return nf;
  }
  /** a separate part (island) of country `main`: the same shape expandBorder makes for a far-away area */
  /** the sentence shown after a clip ('' = nothing to say) */
  /** the sentence shown after a clip ('' = nothing to say). nRings = land parts the country has now */
  function shoreSay(res, nRings = 1) {
    if (!res) return '';
    if (res.status === 'ok') {
      const extra = nRings - 1;
      return 'Border clipped to the shores.' + (extra > 0 ? ` The country now has ${extra} separate part${extra === 1 ? '' : 's'} (islands).` : '')
        + (res.dropped ? ` ${res.dropped} tiny islet${res.dropped === 1 ? ' was' : 's were'} left out.` : '')
        + (res.removed ? ` ${res.removed} part${res.removed === 1 ? '' : 's'} lying over the sea ${res.removed === 1 ? 'was' : 'were'} removed.` : '');
    }
    if (res.status === 'unchanged') return '';
    if (res.status === 'empty') return 'There is no land inside that outline, so it was kept as drawn.';
    return res.msg || '';
  }
  /** shoreclip every land part of a shape. { status: 'ok' | 'unchanged' | 'empty' | 'error', rings, dropped, removed, msg }. Nothing is changed unless every part could be clipped. */
  function clipShape(sc, shape) {
    const out = []; let changed = false, dropped = 0, removed = 0;
    for (const ring of shape) {
      const r = sc.clipRing(ring);
      if (r.status === 'unchanged') { out.push(ring); continue; }
      if (r.status === 'ok') { for (const p of r.pieces) out.push(p); dropped += r.dropped || 0; changed = true; continue; }
      if (r.status === 'empty') { removed++; changed = true; continue; }       // a part that lies wholly over the sea
      return { status: 'error', msg: r.msg, rings: [] };                         // unsupported / too large / error
    }
    if (!out.length) return { status: 'empty', rings: [] };
    return { status: changed ? 'ok' : 'unchanged', rings: out, dropped, removed };
  }
  /** Cuts the border of country `f` (and its separate parts) to the land. One undo step. Returns { ok, msg } for the caller to show. */
  function clipToShores(f) {
    if (!f || f.kind !== 'country') return { ok: false, msg: 'Only countries can be clipped to the shores.' };
    if (f.enclaveOf) return { ok: false, msg: 'An enclave follows the outline of the country around it, so it is not clipped.' };
    const sc = getShore(); if (!sc) return { ok: false, msg: 'The coastline is not loaded yet.' };
    const res = clipShape(sc, shapeOf(f));
    if (res.status === 'error') return { ok: false, msg: res.msg };
    if (res.status === 'empty') return { ok: false, msg: 'This country lies entirely over the sea, so nothing was changed.' };
    if (res.status === 'unchanged') return { ok: true, msg: 'The border already follows the shores.' };
    if (sel && sel.id === f.id) sel = { id: sel.id, vertex: null, ring: 0 };       // point numbers change with the new rings
    store.edit((all) => {
      setRings(f, res.rings, null);
      const gone = new Set(); cascade(f, gone);                                    // subdivisions drawn over the sea are re-fitted (or vanish when nothing is left)
      for (let i = all.length - 1; i >= 0; i--) if (gone.has(all[i].id)) all.splice(i, 1);
    });
    requestRender();
    return { ok: true, msg: shoreSay(res, res.rings.length) };
  }
  function createPoint(kind, ll) {
    const n = store.features.filter((f) => f.kind === kind).length;
    const f = kind === 'city'
      ? { id: store.newId('city'), kind, name: freshName('City', store.features.filter((x) => x.kind === 'city').map((x) => x.name), n), lon: ll[0], lat: ll[1], rank: 'city', life: { from: null, to: null }, notes: '' }
      : { id: store.newId('label'), kind, text: 'Label', lon: ll[0], lat: ll[1], size: 18, rotation: 0, spacing: 4, life: { from: null, to: null } };
    store.edit((all) => all.push(f));
    select(f.id, null, { focusName: true });
  }
  function deleteSelection() {
    if (!sel) return;
    const f = store.find(sel.id); if (!f) return;
    const ri = isShape(f) ? activeRing(f) : 0;
    if (isShape(f) && sel.vertex != null && f.rings[ri].length > (isLine(f) ? 2 : 3)) {
      const i = sel.vertex, ring = f.rings[ri];
      store.edit(() => { ring.splice(i, 1); if (ri === 0 && f.handles) { f.handles.splice(i, 1); if (!f.handles.some(hasHandle)) delete f.handles; } bump(f); });
      sel.vertex = null; requestRender(); return;
    }
    const id = sel.id, gone = new Set([id, ...descendants(id).map((x) => x.id)]);
    store.edit((all) => { for (const g of all) { if (g.enclaveOf === id) delete g.enclaveOf; } for (let i = all.length - 1; i >= 0; i--) if (gone.has(all[i].id)) all.splice(i, 1); });
    select(null);
  }

  // ---------- drawing at a chosen level ----------
  /** the area a level-L subdivision drawn at `ll` belongs to: the level L-1 area under the point (the country for level 1); null (with a hint) when there is none */
  function parentForLevel(ll, L) {
    const hit = containing(ll);
    if (!hit) { say(`A level ${L} area goes inside ${L === 1 ? 'a country' : 'a level ' + (L - 1) + ' area'}: start inside one.`); return null; }
    if (depthOf(hit) < L - 1) { say(`There is no level ${L - 1 || 'country'} area here yet (this spot only goes down to level ${depthOf(hit)}): draw that first, or pick a lower level.`); return null; }
    return ancestorAt(hit, L - 1);
  }
  /** moves subdivision f UP to level L (L < its level): it becomes a child of its level L-1 ancestor and cuts its footprint out of the areas it was inside (they keep the rest).
   *  Moving down is not possible - a lower level has to lie inside a same-level area, which cannot overlap - so draw it at that level instead.
   *  Returns an error message, or null when done. */
  function changeLevel(f, L) {
    if (!f || f.kind !== 'subdivision') return 'Only subdivisions have a level.';
    const cur = depthOf(f); if (L === cur) return null;
    if (!(L >= 1 && L <= MAX_LEVELS)) return `Levels go from 1 to ${MAX_LEVELS}.`;
    if (L > cur) return `A subdivision can only move up a level. A level ${L} area has to lie inside another level ${L - 1} area: draw it at level ${L} (Subdivision tool or Brush, "Draw at").`;
    const np = ancestorAt(f, L - 1), oldParent = f.parent, n0 = store.features.length;
    if (!np) return 'Could not find the area above it.';
    store.edit((all) => {
      f.parent = np.id; all.splice(all.indexOf(f), 1); all.unshift(f);                 // oldest = it keeps its whole outline, the areas it overlaps give way
      const root = rootOf(f); if (!root.levels) root.levels = [];
      while (root.levels.length < L) root.levels.push('Level ' + (root.levels.length + 1));
      settle(f);
    });
    if (store.features.length < n0) { store.undo(); f.parent = oldParent; return 'That would remove another subdivision that lies entirely inside this one.'; }
    const clash = store.features.find((g) => g !== f && g.kind === 'subdivision' && g.parent === np.id && g !== f && shapesOverlap(shapeOf(g), shapeOf(f)));
    if (clash) { store.undo(); f.parent = oldParent; return `It lies completely inside ${clash.name}, and cutting it out would leave a hole, which borders cannot have. Move or reshape it so it touches ${clash.name}'s edge first.`; }
    return null;
  }

  // ---------- brush ----------
  function brushDown(sx, sy, alt, shift, ctrl) {
    const v = getView(), ll = fromScreen(v, sx, sy);
    if (!ll) return true;
    if (ctrl) { const hit = containing(ll); if (hit) select(hit.id); return true; }                      // Ctrl+click: choose the area to paint on
    stroke = { px: [[sx, sy]], start: ll, erase: brushErase !== !!shift, last: [sx, sy] };
    brushAt = [sx, sy]; requestRender(); return true;
  }
  function brushMove(sx, sy) {
    brushAt = [sx, sy];
    if (stroke) { const l = stroke.last; if (Math.hypot(sx - l[0], sy - l[1]) >= Math.max(2, brushR * 0.3)) { stroke.px.push([sx, sy]); stroke.last = [sx, sy]; } }
    requestRender(); return true;
  }
  /** the stroke ends: it is added to / erased from the selected area, or (nothing selected) becomes a new country / level-L subdivision */
  function commitBrush() {
    const s = stroke; stroke = null; requestRender();
    if (!s) return;
    const v = getView(), pts = s.px.slice();
    if (brushAt && (pts.length < 2 || Math.hypot(brushAt[0] - s.last[0], brushAt[1] - s.last[1]) > 1)) pts.push(brushAt);
    const ring = strokeRing(pts, brushR, v.w, v.h);
    if (!ring) return;
    const mine = []; for (const p of ring) { const ll = fromScreen(v, p[0], p[1]); if (ll) mine.push(ll); }
    if (mine.length < 3) { say('That stroke is off the map.'); return; }
    const t = sel && store.find(sel.id), tgt = t && isPoly(t) && isVisible(t) ? t : null;
    if (tgt) {
      const cur = shapeOf(tgt);
      if (!s.erase) {
        const add = freeOfCountries(tgt, mine);
        if (!add.length) { say('That stroke lies inside other countries.'); return; }
        expandSay(expandBorder(tgt, add), tgt, 'The stroke');
        return;
      }
      const r = shapeSubtract(cur, [mine]);
      if (!r.length) { say('Nothing would be left of the border: delete it instead.'); return; }
      if (Math.abs(shapeArea(r) - shapeArea(cur)) < 1e-9) { say('The stroke did not touch the border.'); return; }
      store.edit(() => { setRings(tgt, r, cur[0]); settle(tgt); });
      return;
    }
    if (s.erase) { say('Select a country or subdivision first (Ctrl+click it), then erase from it.'); return; }
    if (!level) { buildArea('country', mine, mine.map(() => null), null, true); return; }
    const par = parentForLevel(s.start, level);
    if (par) buildArea('subdivision', mine, mine.map(() => null), par.id, true);
  }

  // ---------- hit testing ----------
  const contains = (f, ll) => {
    const sh = shapeOf(f), bs = boxesOf(f); let hit = false;
    for (let i = 0; i < sh.length && !hit; i++) { const b = bs[i]; hit = ll[0] >= b[0] && ll[0] <= b[2] && ll[1] >= b[1] && ll[1] <= b[3] && pip(ll, sh[i]); }
    return hit && !enclavesOf(f).some((e) => shapeOf(e).some((r) => pip(ll, r)));
  };
  /** which land part of `f` a click at screen (sx, sy) is in (the nearest one when the click is on a border) */
  function ringAt(f, sx, sy) {
    const sh = shapeOf(f); if (sh.length < 2) return 0;
    const ll = fromScreen(getView(), sx, sy); if (!ll) return 0;
    const bs = boxesOf(f);
    for (let i = 0; i < sh.length; i++) { const b = bs[i]; if (ll[0] >= b[0] && ll[0] <= b[2] && ll[1] >= b[1] && ll[1] <= b[3] && pip(ll, sh[i])) return i; }
    let best = 0, bd = Infinity;
    for (let i = 0; i < sh.length; i++) { const d = edgeDist(ll, sh[i]); if (d < bd) { bd = d; best = i; } }
    return best;
  }
  const containing = (ll) => { let best = null, bd = -1; for (const f of store.features) if (isPoly(f) && isVisible(f) && contains(f, ll)) { const d = depthOf(f); if (d >= bd) { bd = d; best = f; } } return best; };
  const pip = (pt, poly) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if (a && b && a[1] > pt[1] !== b[1] > pt[1] && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  };
  const edgeDist = (pt, poly) => {
    let best = 1e9;
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1], b = poly[i]; if (!a || !b) continue;
      const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
      const t = L ? Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / L)) : 0;
      best = Math.min(best, Math.hypot(pt[0] - (a[0] + t * dx), pt[1] - (a[1] + t * dy)));
    }
    return best;
  };
  function pickPoint(sx, sy) {
    const v = getView(), fs = store.features;
    for (let i = fs.length - 1; i >= 0; i--) {
      const f = fs[i]; if (!isVisible(f)) continue;
      if (f.kind === 'city') {
        const s = toScreen(v, f.lon, f.lat); if (!s || Math.hypot(s[0] - sx, s[1] - sy) > 12) continue;                 // the cheap distance test first: the capital checks below scan every feature
        if (!(sel && sel.id === f.id) && !cityShown(f, isSubCapital(f), Math.max(v.zoomRel || 1, 1), isNatCapital(f))) continue;            // a city whose dot is hidden at this zoom cannot be hit either
        return f;
      }
      else if (f.kind === 'label') {
        const r = rects.get(f); if (!r) continue;
        const dx = sx - r.cx, dy = sy - r.cy, c = Math.cos(-r.rot), s = Math.sin(-r.rot);
        const lx = dx * c - dy * s, ly = dx * s + dy * c;
        if (Math.abs(lx) <= r.w / 2 + 4 && Math.abs(ly) <= r.h / 2 + 4) return f;
      }
    }
    return null;
  }
  function pickCountry(sx, sy) {
    const v = getView(), fs = store.features;
    for (const kind of ['road', 'river', 'range', 'subdivision', 'country']) for (let i = fs.length - 1; i >= 0; i--) {      // rivers and ranges are drawn above countries
      const f = fs[i]; if (f.kind !== kind || !isVisible(f)) continue;
      if (kind === 'road' && !roadZoomOk(f, v)) continue;
      const c = projRing(f, v);
      if (c.bb) { const b = c.bb, s = v.scale, m = 8; if (sx < v.w / 2 + (b[0] - v.cx) * s - m || sx > v.w / 2 + (b[2] - v.cx) * s + m || sy < v.h / 2 - (b[3] - v.cy) * s - m || sy > v.h / 2 - (b[1] - v.cy) * s + m) continue; }      // the click is outside the shape's bounds: no per-point work
      const pts = screenPts(c, v);
      if (kind === 'river' || kind === 'road') { if (edgeDist([sx, sy], pts) <= 6) return f; continue; }
      let inside = false;
      for (const r of c.rings) if (pip([sx, sy], r.map((p) => [v.w / 2 + (p[0] - v.cx) * v.scale, v.h / 2 - (p[1] - v.cy) * v.scale]))) inside = !inside;
      if (inside || edgeDist([sx, sy], pts) <= 6) return f;
    }
    return null;
  }

  // ---------- pointer API (called by app.js) ----------
  /** pen tool: a press places a point; dragging before release pulls out symmetric Bezier handles */
  function penPlace(sx, sy, alt, curve) {
    const v = getView();
    if (!isLineTool(tool) && drawing && drawing.pts.length >= 3) {                                // pressing the first point closes the shape
      const f0 = toScreen(v, drawing.pts[0][0], drawing.pts[0][1]);
      if (f0 && Math.hypot(f0[0] - sx, f0[1] - sy) <= 10) { finishDrawing(); return true; }
    }
    const s = snapAt(sx, sy, alt); if (!s) return true;
    let subPar = null;
    if (!drawing && tool === 'sub') {
      subPar = parentOverride ? byId(parentOverride) : level ? parentForLevel(s.ll, level) : containing(s.ll);   // an explicit parent (from the list / inspector) wins, then the chosen level, then whatever lies under the click
      if (!subPar) { if (!level || parentOverride) say('Start a subdivision inside a country or another subdivision (or select one and use its "+ Subdivision" button).'); return true; }
      if (depthOf(subPar) + 1 > MAX_LEVELS) { say(`Subdivisions go at most ${MAX_LEVELS} levels deep.`); return true; }
    }
    if (!drawing) drawing = { pts: [], hs: [], groups: [], noClip: false, parent: subPar ? subPar.id : null };
    const last = drawing.pts[drawing.pts.length - 1], lastH = drawing.hs[drawing.hs.length - 1];
    const lc = !isLineTool(tool) && tool !== 'country' && clipOn && !alt && last && !hasOut(lastH) && getClip();         // curved segments are never clipped
    const extra = lc ? lc.clipSegment(last, s.ll) : [];
    if (alt || !clipOn) drawing.noClip = true;
    drawing.pts.push(...extra, s.ll); drawing.hs.push(...extra.map(() => null), null); drawing.groups.push(extra.length + 1);
    if (curve) drag = { type: 'pen', x: sx, y: sy, started: false, extra: extra.length };
    hover = null; requestRender(); return true;
  }
  function pointerDown(sx, sy, alt, shift, ctrl) {
    if (isBrush()) return brushDown(sx, sy, alt, shift, ctrl);
    if (isPen()) return shift ? penPlace(sx, sy, alt, true) : false;           // plain press: the map pans, a click places the point; Shift+drag pulls a curve
    if (tool !== 'select') return false;                                      // pan / merge: the map itself handles the drag
    const v = getView(), f = sel && store.find(sel.id);
    if (f && isShape(f) && isVisible(f)) {
      const ri = activeRing(f), ring = f.rings[ri];
      if (f.handles && ri === 0) for (let i = 0; i < ring.length; i++) for (const w of ['o', 'i']) {            // curve handles first (ring 0 only)
        const h = f.handles[i]; if (!h || !hasHandle({ [w]: h[w] })) continue;
        const s = toScreen(v, ring[i][0] + h[w][0], ring[i][1] + h[w][1]);
        if (s && Math.hypot(s[0] - sx, s[1] - sy) <= HANDLE_PX) {
          sel.vertex = i; drag = { type: 'handle', id: f.id, idx: i, which: w, x: sx, y: sy, started: false };
          onSelect(f, {}); requestRender(); return true;
        }
      }
      for (let i = 0; i < ring.length; i++) {
        const s = toScreen(v, ring[i][0], ring[i][1]);
        if (s && Math.hypot(s[0] - sx, s[1] - sy) <= HANDLE_PX) {
          sel.vertex = i; drag = { type: 'vertex', id: f.id, ri, idx: i, x: sx, y: sy, started: false };
          onSelect(f, {}); requestRender(); return true;
        }
      }
      for (let i = 0; i < segCount(f, ri); i++) {                                   // midpoints insert a vertex
        const ll = midOf(f, i, ri), s = toScreen(v, ll[0], ll[1]);
        if (s && Math.hypot(s[0] - sx, s[1] - sy) <= 7) {
          store.begin(); store.live(() => insertVertex(f, i, ri)); bump(f);
          sel.vertex = i + 1; drag = { type: 'vertex', id: f.id, ri, idx: i + 1, x: sx, y: sy, started: true };
          requestRender(); return true;
        }
      }
    }
    const p = pickPoint(sx, sy);
    if (p) { select(p.id); drag = { type: 'point', id: p.id, x: sx, y: sy, started: false }; return true; }
    return false;
  }
  function pointerMove(sx, sy, alt) {
    if (isBrush()) return brushMove(sx, sy);
    if (drag && drag.type === 'pen') {
      if (!drag.started) {
        if (Math.hypot(sx - drag.x, sy - drag.y) < CLICK_PX) return true;
        drag.started = true;
        if (drag.extra) {                                                       // a curved segment is not clipped: drop the coast detail
          const m = drawing.pts.length; drawing.pts.splice(m - 1 - drag.extra, drag.extra); drawing.hs.splice(m - 1 - drag.extra, drag.extra);
          drawing.groups[drawing.groups.length - 1] = 1; drag.extra = 0;
        }
      }
      const k = drawing.pts.length - 1, p = drawing.pts[k], ll = fromScreen(getView(), sx, sy);
      if (ll) { const o = [wrapDeg(ll[0] - p[0]), ll[1] - p[1]]; drawing.hs[k] = { i: [-o[0], -o[1]], o }; }
      requestRender(); return true;
    }
    if (drag) {
      if (!drag.started) { if (Math.hypot(sx - drag.x, sy - drag.y) < CLICK_PX) return true; store.begin(); drag.started = true; }
      const f = store.find(drag.id); if (!f) return true;
      if (drag.type === 'handle') {
        const p = f.rings[0][drag.idx], ll = fromScreen(getView(), sx, sy);
        if (ll) store.live(() => {
          const d = [wrapDeg(ll[0] - p[0]), ll[1] - p[1]], h = f.handles[drag.idx], other = drag.which === 'o' ? 'i' : 'o';
          h[drag.which] = d; if (!alt) h[other] = [-d[0], -d[1]];             // smooth point: the opposite handle mirrors (Alt = move alone)
          bump(f);
        });
      } else if (drag.type === 'vertex') {
        const s = snapAt(sx, sy, alt, { id: f.id, ri: drag.ri, idx: drag.idx });
        if (s) { store.live(() => { f.rings[drag.ri][drag.idx] = s.ll; bump(f); }); hover = { sx, sy, snapped: s.snapped, ll: s.ll }; }
      } else {
        const ll = fromScreen(getView(), sx, sy);
        if (ll) store.live(() => { f.lon = ll[0]; f.lat = ll[1]; bump(f); });
      }
      requestRender(); return true;
    }
    if (tool === 'city' || tool === 'label') {                              // a point goes exactly where you click: no snapping, and the city tool says which area it lands in
      const ll = fromScreen(getView(), sx, sy);
      hover = ll ? { sx, sy, snapped: false, ll, point: tool } : null;
      if (tool === 'city') cityHint(ll);
      requestRender(); return false;
    }
    if (tool !== 'select' && tool !== 'pan') {
      const s = snapAt(sx, sy, alt);
      hover = s ? { sx, sy, snapped: s.snapped, ll: s.ll } : null;
      if (hover && drawing && clipOn && !alt && tool !== 'country' && drawing.pts.length && !hasOut(drawing.hs[drawing.hs.length - 1])) { const lc = getClip(); hover.path = lc ? lc.clipSegment(drawing.pts[drawing.pts.length - 1], s.ll) : null; }
      requestRender();
    }
    return false;
  }
  function pointerUp() {
    if (stroke) { commitBrush(); return true; }
    if (!drag) return false;
    const d = drag; drag = null; hover = null;
    const f = d.started && (d.type === 'vertex' || d.type === 'handle') && store.find(d.id);
    if (f && isPoly(f)) store.live(() => { settle(f); bump(f); });         // keep subdivisions inside their parent / apart from siblings
    requestRender(); return true;
  }

  /** the country and the subdivisions (outermost first) whose area contains this city */
  function belongsTo(c) {
    const ll = [c.lon, c.lat]; let hit = null, bd = -1;
    for (const f of store.features) if (isPoly(f) && isVisibleBase(f) && contains(f, ll)) { const d = depthOf(f); if (d >= bd) { bd = d; hit = f; } }
    const chain = []; for (let g = hit; g && chain.length < 12; g = g.parent ? byId(g.parent) : null) chain.unshift(g);
    return chain.map((g, i) => ({ id: g.id, name: g.name, kind: g.kind, level: i }));
  }
  /** the next click on the map puts this city there (Esc cancels) */
  function relocate(id) {
    const f = store.find(id); if (!f || f.kind !== 'city') return;
    relocating = id; tool = 'select'; onTool && onTool('select'); select(id);
    say(`Click the new position of ${f.name} on the map · Esc cancels`); requestRender();
  }
  /** while the city tool hovers the map: "Click to place a city in Country › Province" (only said again when the answer changes) */
  function cityHint(ll) {
    const t = now(); if (t - cityHintAt < 70) return; cityHintAt = t;
    let text = hints.city;
    if (ll) {
      const chain = belongsTo({ lon: ll[0], lat: ll[1] });
      text = chain.length ? `Click to place a city in ${chain.map((g) => g.name || (g.kind === 'country' ? 'an unnamed country' : 'an unnamed area')).join(' › ')} · Esc when done` : 'Click to place a city outside every country · Esc when done';
    }
    if (text !== cityHintText) { cityHintText = text; say(text); }
  }
  function click(sx, sy, e) {
    const alt = e && e.altKey;
    if (relocating) {
      const f = store.find(relocating), ll = fromScreen(getView(), sx, sy); relocating = null;
      if (f && ll) { store.edit(() => { f.lon = ll[0]; f.lat = ll[1]; }); bump(f); select(f.id); }
      setHint(); requestRender(); return;
    }
    if (tool === 'select') {
      const p = pickPoint(sx, sy) || pickCountry(sx, sy);
      if (p) select(p.id, null, isPoly(p) ? { ring: ringAt(p, sx, sy) } : {}); else select(null);
    } else if (isPen()) {
      penPlace(sx, sy, alt, false);
    } else if (tool === 'merge') {
      const a = byId(parentOverride), ll = fromScreen(getView(), sx, sy), hit = ll && containing(ll), b = hit && a && ancestorAt(hit, depthOf(a));
      if (!a || !b || a === b) return;
      if (b.kind !== a.kind || (a.kind === 'subdivision' && byId(b.parent) !== byId(a.parent))) { say('Merge needs two countries, or two subdivisions of the same parent.'); return; }
      mergeInto(a, b);
    } else if (tool === 'pan') {
      // Pan never edits: a click on a country reports it (the info card); a click on a city opens that city's properties; empty map = nothing
      const city = pickPoint(sx, sy);
      if (city && city.kind === 'city') { setTool('select'); select(city.id); return; }
      const p = pickCountry(sx, sy), area = p && (p.kind === 'country' || p.kind === 'subdivision') ? p : null, root = area ? rootOf(p) : null;
      onPick && onPick(root, area);
    } else if (tool === 'brush') {
      // the brush paints on press / drag (see brushDown)
    } else {
      const ll = fromScreen(getView(), sx, sy); if (ll) createPoint(tool, ll);
    }
  }
  function dblclick(sx, sy) {
    if ((isPen()) && drawing && drawing.pts.length >= (isLineTool(tool) ? 2 : 3)) { finishDrawing(); return true; }
    const f = sel && store.find(sel.id);
    if (tool === 'select' && f && isShape(f) && sx != null) {
      const v = getView(), ri = activeRing(f), ring = f.rings[ri];
      let onVertex = false;
      for (let i = 0; i < ring.length; i++) { const s = toScreen(v, ring[i][0], ring[i][1]); if (s && Math.hypot(s[0] - sx, s[1] - sy) <= HANDLE_PX) onVertex = true; }
      if (!onVertex) for (let i = 0; i < segCount(f, ri); i++) {                // double-click an edge: add a point there
        const a = toScreen(v, ring[i][0], ring[i][1]), b = toScreen(v, ring[(i + 1) % ring.length][0], ring[(i + 1) % ring.length][1]); if (!a || !b) continue;
        const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((sx - a[0]) * dx + (sy - a[1]) * dy) / L)) : 0;
        if (Math.hypot(sx - a[0] - t * dx, sy - a[1] - t * dy) > 6) continue;
        const ll = fromScreen(v, sx, sy); if (!ll) continue;
        store.edit(() => {
          const hs = ri === 0 ? f.handles : null;
          if (hs && segmentCurved(hs, i, (i + 1) % ring.length)) insertVertex(f, i, ri);
          else { ring.splice(i + 1, 0, ll); if (hs) hs.splice(i + 1, 0, null); }
          bump(f);
        });
        sel.vertex = i + 1; requestRender(); return true;
      }
    }
    if (tool === 'select' && f && isShape(f) && sx != null && activeRing(f) === 0) {   // double-click a point: corner <-> smooth curve (ring 0 only)
      const v = getView(), ring = f.rings[0];
      for (let i = 0; i < ring.length; i++) {
        const s = toScreen(v, ring[i][0], ring[i][1]);
        if (!s || Math.hypot(s[0] - sx, s[1] - sy) > HANDLE_PX) continue;
        store.edit(() => {
          if (!f.handles) f.handles = ring.map(() => null);
          f.handles[i] = hasHandle(f.handles[i]) ? null : defaultHandle(ring, i);
          if (!f.handles.some(hasHandle)) delete f.handles;
          bump(f);
        });
        sel.vertex = i; requestRender(); return true;
      }
    }
    return false;
  }

  function keydown(e) {
    if (e.key === 'Escape') {
      if (relocating) { relocating = null; setHint(); requestRender(); } else if (stroke) { stroke = null; requestRender(); } else if (drawing) { drawing = null; requestRender(); } else if ((tool === 'select' || tool === 'brush') && sel) select(null); else if (tool !== 'pan') setTool('pan');
      return true;
    }
    if (e.key === 'Enter' && drawing) { finishDrawing(); return true; }
    if ((e.key === 'Backspace' || e.key === 'Delete') && drawing) { const k = drawing.groups.pop() || 1; drawing.pts.length -= k; drawing.hs.length = drawing.pts.length; if (!drawing.pts.length) drawing = null; requestRender(); return true; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { deleteSelection(); return true; }
    return false;
  }

  // ---------- drawing ----------
  function spaced(ctx, text, x, y, spacing, halo) {
    const adv = [...text].map((ch) => ctx.measureText(ch).width);
    const total = adv.reduce((a, b) => a + b, 0) + spacing * (adv.length - 1);
    let cx = x - total / 2; ctx.textAlign = 'left';
    [...text].forEach((ch, i) => {
      if (halo) ctx.strokeText(ch, cx, y);
      ctx.fillText(ch, cx, y); cx += adv[i] + spacing;
    });
    return total;
  }

  // ---------- land mask: area fills are clipped to land (coast contours, even-odd so lakes are holes) ----------
  let landKey = '', landPath = null;
  function landMask(v, eps = 0) {                                                             // per-ring paths + projected bounds (view independent)
    const coast = getCoast && getCoast(); if (!coast) return null;
    const key = v.def.id + '|' + v.lon0.toFixed(5) + '|' + (v.def.globe ? v.lat0.toFixed(5) : 0) + '|' + eps;
    if (key === landKey) return landPath;
    const rings = [], la0 = lat0(v);
    for (const p of coast) {                                                         // every coast ring is cut exactly at the seam / horizon and closed along it
      for (const ring of clipRing(v.def, p, true, v.lon0, la0, eps).rings) {
        if (ring.length < 3) continue;
        const path = new Path2D(), bb = [Infinity, Infinity, -Infinity, -Infinity];
        path.moveTo(ring[0][0], ring[0][1]);
        for (let i = 0; i < ring.length; i++) { const q = ring[i]; if (i) path.lineTo(q[0], q[1]); if (q[0] < bb[0]) bb[0] = q[0]; if (q[1] < bb[1]) bb[1] = q[1]; if (q[0] > bb[2]) bb[2] = q[0]; if (q[1] > bb[3]) bb[3] = q[1]; }
        path.closePath(); rings.push({ path, bb });
      }
    }
    landKey = key; landPath = rings; return rings;
  }
  /** runs fn with the canvas clipped to land (a no-op when clipping is off or the coast is not loaded) */
  function onLand(ctx, v, fn, eps = 0) {
    const rings = clipOn ? landMask(v, eps) : null;           // eps > 0: the coarser mask of a globe being rotated (the fills are still clipped to land, borders never run over the sea)
    if (!rings) { fn(); return; }
    const m = visibleRings(rings, v, 0.5) || new Path2D();   // only the land rings that reach the painted area: a clip over the whole coast is what made every repaint slow (even-odd, so a ring outside the view cannot matter)
    const T = ctx.getTransform(), k = v.scale * T.a;
    ctx.save();
    ctx.setTransform(k, 0, 0, -k, T.a * (v.w / 2 - v.cx * v.scale), T.a * (v.h / 2 + v.cy * v.scale));
    ctx.clip(m, 'evenodd');
    ctx.setTransform(T);
    fn(); ctx.restore();
  }

  // ---------- mountain ranges: tinted area + procedurally placed peak glyphs (no height data, just an area) ----------
  const seedOf = (id) => { let h = 7; for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0; return h; };
  const peaks = new WeakMap();
  function peaksFor(f) {                                                    // [lon, lat, size 0.75..1.15, tone] cached until the shape or density changes
    const key = (revs.get(f) || 0) + '|' + (f.density || 1), hit = peaks.get(f);
    if (hit && hit.key === key) return hit;
    const ring = flatOf(f), seed = seedOf(f.id);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of ring) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const w = x1 - x0, h = y1 - y0, dens = Math.min(3, Math.max(0.4, f.density || 1)), list = [];
    let step = Math.min(4, Math.max(0.1, Math.sqrt(w * h) / 24)) / dens;
    if (w > 0 && h > 0 && w < 180) {
      while ((w / step) * (h / step) > 2600) step *= 1.25;                  // cap the glyph count
      let row = 0;
      for (let la = y1 - step / 2; la > y0; la -= step * 0.8, row++)       // north to south, so southern peaks overlap northern ones
        for (let lo = x0 + (row % 2 ? step / 2 : 0); lo < x1; lo += step) {
          const k = (row * 7919 + Math.round((lo - x0) / step) * 104729) ^ seed;
          const px = lo + (hash(k) - 0.5) * step * 0.7, py = la + (hash(k + 1) - 0.5) * step * 0.5;
          if (pip([px, py], ring)) list.push([px, py, 0.75 + hash(k + 2) * 0.4, hash(k + 3)]);
        }
    }
    const c = { key, list, step }; peaks.set(f, c); return c;
  }
  /** one hand-drawn style peak: kinked slopes, a shaded east face with hatching and a soft base */
  function mountain(ctx, x, y, w, h, tone, dark, light) {
    const bx0 = x - w / 2, bx1 = x + w / 2, by = y + h / 2, px = x + (tone - 0.5) * w * 0.2, py = y - h / 2;
    const m1x = bx0 + (px - bx0) * 0.55 - w * 0.04, m1y = by - (by - py) * 0.5, m2x = px + (bx1 - px) * 0.45 + w * 0.03, m2y = by - (by - py) * 0.42;
    ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(m1x, m1y); ctx.lineTo(px, py); ctx.lineTo(m2x, m2y); ctx.lineTo(bx1, by);
    ctx.quadraticCurveTo(x, by + h * 0.1, bx0, by); ctx.closePath();
    ctx.fillStyle = light; ctx.fill();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(m2x, m2y); ctx.lineTo(bx1, by); ctx.quadraticCurveTo(x + w * 0.2, by + h * 0.07, px - w * 0.04, by - h * 0.05); ctx.closePath();
    ctx.globalAlpha = 0.5; ctx.fillStyle = dark; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(m1x, m1y); ctx.lineTo(px, py); ctx.lineTo(m2x, m2y); ctx.lineTo(bx1, by);
    ctx.strokeStyle = dark; ctx.lineWidth = 0.9; ctx.stroke();
    if (h > 12) {                                                              // hatching on the shaded face
      ctx.beginPath();
      for (let j = 1; j <= 3; j++) { const t = j / 4; ctx.moveTo(px + (m2x - px) * t * 0.9, py + (m2y - py) * t * 0.9 + (by - py) * t * 0.35); ctx.lineTo(px + (bx1 - px) * t * 0.7 - w * 0.02, by - h * 0.04 * (4 - j)); }
      ctx.globalAlpha = 0.4; ctx.lineWidth = 0.7; ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
  /** Mountain areas, map-app style: a soft tan wash with feathered edges (two blurred fills, no per-peak glyphs).
   *  While the view is being dragged or zoomed (v.interacting) the blur is skipped - a blurred fill costs far more than a flat one -
   *  and the full-quality wash is drawn again as soon as the view rests. */
  function drawRanges(ctx, v, L) {
    const ranges = L.filter((f) => f.kind === 'range'); if (!ranges.length) return;
    const dpr = ctx.getTransform().a, FAR = 20000;
    const meps = v.def.globe && (v.interacting || v.cheap) ? moveEps(v.scale) : 0;
    const items = ranges.map((f) => { const c = projRing(f, v, meps); return [f, c, unitPath(c), strokePath(c)]; });
    const blur = Math.min(14, Math.max(4, 6 + 2 * Math.log2(Math.max(v.zoomRel || 1, 1))));
    onLand(ctx, v, () => inUnits(ctx, v, (px) => {
      for (const [f, c, path] of items) {
        if (!c.ok || !reachesView(c, v)) continue;
        const k = Math.min(3, Math.max(0.4, f.density || 1));
        if (v.interacting || v.cheap) { ctx.fillStyle = rgba(f.color, Math.min(0.9, 0.62 * k)); ctx.fill(path); continue; }
        ctx.save(); ctx.translate(-FAR * px, 0); ctx.fillStyle = '#000';
        ctx.shadowOffsetX = FAR * dpr; ctx.shadowOffsetY = 0;
        for (const [bl, al] of [[blur * 2.2, 0.4], [blur, 0.5]]) {              // wide faint halo, then a firmer core
          ctx.shadowBlur = bl * dpr; ctx.shadowColor = rgba(f.color, Math.min(0.9, al * k));
          ctx.fill(path);
        }
        ctx.restore();
      }
    }), meps);
    if (sel) for (const [f, , , path] of items) {
      if (sel.id !== f.id) continue;
      inUnits(ctx, v, (px) => {
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 4 * px; ctx.stroke(path);
        ctx.setLineDash([5 * px, 4 * px]); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2 * px; ctx.stroke(path); ctx.setLineDash([]);
      });
    }
  }

  // ---------- roads (see docs/ROADS.md) ----------
  // Cost model: a road's projected outline is the cached projRing entry of the feature and its stroke path is cached on that entry (unit space),
  // so a pan / zoom does no per-point work. Each tier keeps ONE array of { path, bb } that is rebuilt only when the projection, the features or the
  // visible set change; visibleRings() then culls it to the view and reuses the combined Path2D while the same roads are in view. A frame therefore
  // costs two strokes per drawn tier (halo, line), however many roads there are. Tiers finer than the zoom allows are not touched at all.
  const MOVE_ROAD_BUDGET = 400, NO_ROAD = { path: null, bb: null };
  const roadRings = new Map();                                              // tier id -> { key, rings }
  const roadEntry = new WeakMap();                                          // projRing entry -> { path, bb } (or NO_ROAD)
  const roadDayKey = () => (store.paused || !store.timeline.filterByLife ? 0 : store.timeline.current);   // the visible set only depends on the slider day when the history filter is on
  function drawRoads(ctx, v, L, moving) {
    const byTier = new Map();
    for (const f of L) { if (f.kind !== 'road') continue; const a = byTier.get(f.tier); if (a) a.push(f); else byTier.set(f.tier, [f]); }
    if (!byTier.size) return;
    const th = v.theme || THEMES.atlas, pal = th.road || THEMES.atlas.road, zr = v.zoomRel || 1, z = Math.max(zr, 1);
    const meps = moving ? moveEps(v.scale) : 0, lo = Math.round(v.lon0 * 1e5), la = v.def.globe ? Math.round(v.lat0 * 1e5) : 0, day = roadDayKey();
    for (const t of DRAW_ORDER) {
      let list = byTier.get(t.id);
      if (!list || !tierShown(t, zr, roadOpts.all)) continue;                // finer tiers wait until the zoom reaches them
      if (moving) { if (!t.moveKeep) continue; if (list.length > MOVE_ROAD_BUDGET) list = list.slice(0, MOVE_ROAD_BUDGET); }   // a globe being turned: only the main tiers, a bounded number
      const key = [v.def.id, lo, la, meps, store.ver, day, list.length].join('|');
      let slot = roadRings.get(t.id);
      if (!slot || slot.key !== key) {
        const rings = [];
        for (const f of list) {
          const c = projRing(f, v, meps); let e = roadEntry.get(c);
          if (!e) { e = c.bb && c.pts.length > 1 ? { path: strokePath(c), bb: c.bb } : NO_ROAD; roadEntry.set(c, e); }
          if (e !== NO_ROAD) rings.push(e);
        }
        slot = { key, rings }; roadRings.set(t.id, slot);
      }
      const vp = visibleRings(slot.rings, v, 1); if (!vp) continue;
      const w = roadWidthPx(t, z);
      inUnits(ctx, v, (px) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (t.casing && !moving) { ctx.strokeStyle = pal.casing; ctx.lineWidth = (w + 2 * t.casing) * px; ctx.stroke(vp); }
        ctx.strokeStyle = pal[t.id]; ctx.lineWidth = w * px;
        if (t.dash) { ctx.setLineDash([t.dash[0] * w * px, t.dash[1] * w * px]); ctx.stroke(vp); ctx.setLineDash([]); } else ctx.stroke(vp);
      });
    }
  }

  /** full picture (export / tools): the cached base layer + the interactive top layer (skipped when exporting) */
  function draw(ctx, v) { drawBase(ctx, v); if (!v.exporting) drawTop(ctx, v); }
  /** BASE layer: everything expensive (area fills, ranges, names, labels, cities). It never depends on selection, hover, tool or
   *  pointer state, so the overlay can cache it as a bitmap and reuse it until the view or the content really changes. */
  function drawBase(ctx, v) {
    frameIdx = new Map(store.features.map((x) => [x.id, x]));
    frameEnc = new Map();
    for (const g of store.features) if (g.enclaveOf && isVisible(g)) (frameEnc.get(g.enclaveOf) || frameEnc.set(g.enclaveOf, []).get(g.enclaveOf)).push(g);
    const keepSel = sel; sel = null;                                           // selection is drawn by drawTop
    try { baseFrame(ctx, v); } finally { sel = keepSel; frameIdx = null; frameEnc = null; }
  }
  let nameWeight = 600;                                                     // weight of upright (country) names; set from the theme at the start of every baseFrame (th.txt.nw)
  // italic names (ranges, subdivisions) ask for 500: only Archivo Italic 400 is bundled, so 600 would be faux-bolded (smeared strokes)
  const nameFont = (rg, dp, px) => `${rg || dp ? 'italic 500' : nameWeight} ${px}px Archivo, system-ui, "Segoe UI", sans-serif`;
  const haloPx = (th, size) => Math.max(1.6, size * (th.txt.haloW || 0.1));      // halo stroke width of a name (themes may set txt.haloW in em)
  const advancesOf = (ctx, rg, dp, text, chars) => advCache.get(nameFont(rg, dp, 100) + '|' + text, () => { ctx.font = nameFont(rg, dp, 100); return chars.map((ch) => ctx.measureText(ch).width / 100); });
  /** limits per kind of name. Countries: 10-30 px, letters spread up to 0.26 em. Ranges (italic capitals): up to 20 px, 0.2 em. Subdivisions (italic mixed case): 9-14 px (12, 10, ... deeper) with almost no spreading, because spread lower-case letters look broken. A name never takes more than ~30-34% of the thickness. */
  const nameOpts = (rg, dp) => ({ minSize: dp ? 9 : 10, maxSize: rg ? 20 : dp ? Math.max(9, 16 - 2 * dp) : 30, maxSpace: rg ? 0.2 : dp ? 0.07 : 0.26, baseSpace: rg ? 0.08 : dp ? 0.02 : 0.09, fill: dp ? 0.86 : 0.84, thickShare: dp ? 0.3 : 0.34 });
  const canonCache = createLru(6000);                                       // canonical layouts: cheap to make, but a pan-bitmap rebuild needs every visible name's, so they are kept per zoom bucket
  /** a name's layout in "canonical" screen space: laid out at the bucket's scale on a screen centred on the projection origin, so it does not depend on where the view is
   *  (the sprite of a name is painted from it, and the collision test uses its letters). variant: an index into NAME_VARIANTS. null = no name at this size (cached too). */
  function canonLayout(ctx, f, v, rg, dp, text, chars, lkey, b0, variant) {
    return canonCache.get(f.id + '|' + lkey + '|' + b0 + '|' + variant, () => {
      const sb = scaleOfBucket(b0), sp = spineFor(f); if (!sp) return null;
      const bv = { def: v.def, lon0: v.lon0, lat0: v.lat0, w: 0, h: 0, cx: 0, cy: 0, scale: sb }, jump = 0.5 * Math.max(v.def.xmax, v.def.ymax) * sb, sc = [];
      for (const q of sp.pts) {
        const s = toScreen(bv, q[0], q[1]);
        if (!s || (sc.length && Math.hypot(s[0] - sc[sc.length - 1][0], s[1] - sc[sc.length - 1][1]) > jump)) return null;     // hidden side / map seam
        sc.push(s);
      }
      const L2 = layoutName(sc, thicknessPx(sc, sp), chars, advancesOf(ctx, rg, dp, text, chars), { ...nameOpts(rg, dp), ...NAME_VARIANTS[variant] });
      return L2 && L2.glyphs.length ? { sb, L2 } : null;
    });
  }
  /** one name as a cached picture for the pan bitmap, painted once from its canonical layout; later rebuilds only place it. Returns { big: true } when it is too large to cache (drawn directly) */
  function makeSprite(lay, ds, rg, dp, th) {
    const { sb, L2 } = lay, pad = L2.size * 1.15 + 4;                         // a glyph's own size + its halo, round every glyph centre
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const g of L2.glyphs) { x0 = Math.min(x0, g.x); x1 = Math.max(x1, g.x); y0 = Math.min(y0, g.y); y1 = Math.max(y1, g.y); }
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    const w = x1 - x0, h = y1 - y0, pw = Math.max(1, Math.ceil(w * ds)), ph = Math.max(1, Math.ceil(h * ds));
    if (pw > 3000 || ph > 3000 || pw * ph > 3e6) return { big: true, sb, px: 0 };
    const cv = makeCanvas(pw, ph), g = cv.getContext('2d');
    if (!g) return { big: true, sb, px: 0 };
    g.textBaseline = 'middle'; g.textAlign = 'center'; g.lineJoin = 'round'; g.font = nameFont(rg, dp, L2.size);
    const glyphAt = (gl) => { const c = Math.cos(gl.a), s2 = Math.sin(gl.a); g.setTransform(ds * c, ds * s2, -ds * s2, ds * c, ds * (gl.x - x0), ds * (gl.y - y0)); };
    g.strokeStyle = th.txt.halo; g.lineWidth = haloPx(th, L2.size);          // the same two passes as the direct drawing: every halo, then every letter
    for (const gl of L2.glyphs) { glyphAt(gl); g.strokeText(gl.ch, 0, 0); }
    g.fillStyle = rg ? th.txt.range : th.txt.name;
    for (const gl of L2.glyphs) { glyphAt(gl); g.fillText(gl.ch, 0, 0); }
    return { cv, sb, w, h, X0: x0 / sb, Y0: -y0 / sb, size: L2.size, px: pw * ph };
  }
  /** a name as glyphs, painted straight on the context: every halo, then every letter (halo + fill per letter let the halo of one letter cut into the one before it).
   *  Glyph positions are mapped by x * kk + ox, y * kk + oy; T is the context's base transform. */
  function paintGlyphs(ctx, T, glyphs, size, kk, ox, oy, rg, dp, th) {
    const px = size * kk;
    ctx.font = nameFont(rg, dp, px); ctx.lineJoin = 'round';
    const at = (g) => {
      const c = Math.cos(g.a), s2 = Math.sin(g.a), x = g.x * kk + ox, y = g.y * kk + oy;
      ctx.setTransform(T.a * c + T.c * s2, T.b * c + T.d * s2, -T.a * s2 + T.c * c, -T.b * s2 + T.d * c, T.a * x + T.c * y + T.e, T.b * x + T.d * y + T.f);
    };
    ctx.strokeStyle = th.txt.halo; ctx.lineWidth = haloPx(th, px);
    for (const g of glyphs) { at(g); ctx.strokeText(g.ch, 0, 0); }
    ctx.fillStyle = rg ? th.txt.range : th.txt.name;
    for (const g of glyphs) { at(g); ctx.fillText(g.ch, 0, 0); }
    ctx.setTransform(T);
  }
  function baseFrame(ctx, v) {
    const L = store.features.filter(isVisible), z = Math.max(v.zoomRel || 1, 1);
    const sx = (x) => v.w / 2 + (x - v.cx) * v.scale, sy = (y) => v.h / 2 - (y - v.cy) * v.scale;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const th = v.theme || THEMES.atlas, fast = !!(v.interacting || v.cheap);
    nameWeight = th.txt.nw || 600;                                                                  // upright names follow the theme's weight (dark: 500)

    // countries and subdivisions (shallow first): fills + outlines clipped to land in ONE clip, drawn from cached unit paths
    const t0 = now();
    const polys = L.filter(isPoly).map((f) => [f, f.kind === 'country' ? 0 : depthOf(f)]).sort((p, q) => p[1] - q[1]);
    const peps = v.def.globe && fast ? moveEps(v.scale) : 0;
    const items = polys.map(([f, d]) => { const c = projRing(f, v, peps); return [f, d, c, unitPath(c), strokePath(c)]; });
    const pathOf = new Map(items.map(([f, , , p]) => [f.id, p])), holeOf = new Map();          // a host's fill gets its enclaves as holes
    for (const [f] of items) if (f.enclaveOf && pathOf.has(f.id) && pathOf.has(f.enclaveOf)) (holeOf.get(f.enclaveOf) || holeOf.set(f.enclaveOf, []).get(f.enclaveOf)).push(pathOf.get(f.id));
    const dpr0 = ctx.getTransform().a || 1, M = th.map, popOf = (h) => { const k = h + th.id; let r = pops.get(k); if (!r) pops.set(k, (r = popHex(h, M.sat, M.light))); return r; };
    const moveGlobe = fast && v.def.globe;            // a globe being rotated is repainted live every frame: cheap path: flat fills, no names, coarser outlines (still clipped to land)
    if (items.length) onLand(ctx, v, () => inUnits(ctx, v, (px) => {
      for (const [f, d, c, path, spath] of items) {
        if (!reachesView(c, v)) continue;
        const sub = d > 0, base = (sub ? rootOf(f) : f).color;                 // a subdivision wears its country's colour (a slightly lighter or darker shade), not one of its own
        let hex = popOf(base);
        if (sub) { const st = Math.floor(hash(seedOf(f.id)) * 5) - 2; hex = st > 0 ? mixHex(hex, '#ffffff', st * 0.1) : st < 0 ? mixHex(hex, '#000000', -st * 0.09) : hex; }
        if (c.ok) {
          ctx.fillStyle = (moveGlobe || v.snapshot) ? rgba(hex, Math.min(1, (sub ? M.subAlpha : M.alpha) * fillScale)) : areaFill(ctx, hex, sub ? M.subAlpha : M.alpha, M.grain * (sub ? 0.8 : 1), px, dpr0);
          const hs = holeOf.get(f.id);
          if (hs) { if (!c.fp || c.fpH.length !== hs.length || c.fpH.some((h, i) => h !== hs[i])) { const fp = new Path2D(path); for (const h of hs) fp.addPath(h); c.fp = fp; c.fpH = hs; } ctx.fill(c.fp, 'evenodd'); } else ctx.fill(path);
        }
        if (!sub && M.edge > 0 && !fast) { ctx.strokeStyle = rgba(popOf(base), M.edge); ctx.lineWidth = 9 * px; ctx.stroke(spath); }     // colour bleeding in from the border
        ctx.strokeStyle = borderOf(base, M, sub); ctx.lineWidth = (sub ? Math.max(0.8, 1.15 - 0.15 * d) : (M.bw || 1.9)) * px;
        ctx.setLineDash(d >= 2 ? [5 * px, 3 * px] : []); ctx.stroke(spath); ctx.setLineDash([]);
      }
    }), peps);
    const t1 = now();
    if (v.areasOnly) return;                                                   // the 3D globe's country texture: fills + borders only (no ranges, rivers, names, cities)
    drawRanges(ctx, v, L);
    const t2 = now();
    for (const f of L) {                                                       // user-drawn rivers (never clipped: they may end in the sea)
      if (f.kind !== 'river') continue;
      const c = projRing(f, v), path = new Path2D(); let st = false;
      for (const p of c.pts) { if (!p) { st = false; continue; } if (st) path.lineTo(sx(p[0]), sy(p[1])); else { path.moveTo(sx(p[0]), sy(p[1])); st = true; } }
      const w = Math.max(1, (0.7 + 0.9 * (f.width || 1)) * Math.min(2.5, Math.pow(z, 0.35)));
      if (sel && sel.id === f.id) { ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = w + 5; ctx.stroke(path); }
      ctx.strokeStyle = f.color || '#4a86b8'; ctx.lineWidth = w; ctx.stroke(path);
      if (sel && sel.id === f.id) { ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]); ctx.stroke(path); ctx.setLineDash([]); }
    }
    drawRoads(ctx, v, L, moveGlobe);                                           // roads: above rivers, below every name
    // ---- text: every kind of text on the map shares ONE collision grid, so no name ever lies on another ----
    // Placed in this order; a name that would cover text already placed is tried tighter / further along its spine / smaller (NAME_VARIANTS)
    // and is left out only when nothing fits:  1 text labels  2 city names  3 subdivision names (shallow first)  4 mountain ranges  5 country names
    const placer = createPlacer(48);
    // 1. text labels typed by the person: they only reserve their place here (they are drawn after the names, below)
    for (const f of L) {
      if (f.kind !== 'label') continue;
      const s = toScreen(v, f.lon, f.lat); if (!s || s[0] < -300 || s[0] > v.w + 300 || s[1] < -100 || s[1] > v.h + 100) continue;
      const size = f.size * Math.min(2.4, Math.max(0.8, Math.sqrt(z))), rot = (f.rotation || 0) * DEG, chars = [...(f.text || '')];
      ctx.font = `italic ${size}px Archivo, system-ui, "Segoe UI", sans-serif`;
      const total = chars.reduce((a, ch) => a + ctx.measureText(ch).width, 0) + (f.spacing || 0) * Math.max(chars.length - 1, 0);
      const c = Math.abs(Math.cos(rot)), sn = Math.abs(Math.sin(rot)), hw = (c * (total + 8) + sn * (size + 6)) / 2, hh = (sn * (total + 8) + c * (size + 6)) / 2;
      placer.add(s[0] - hw, s[1] - hh, s[0] + hw, s[1] + hh);
    }
    // 2. cities: dots by rank and zoom; names have a fixed size, stay hidden until zoomed in past NAME_Z (so not on the whole-world view), appear by rank (capitals first) and never sit on other text.
    //    Decided here (before the area names, which move around them); drawn after the labels, below.
    const NAME_Z = 1.6, PRI = { capital: 0, city: 1, town: 2 };
    const capKey = v.ver + '|' + contentRev + '|' + L.length;                                      // a city picked as the capital of a subdivision (only while it still lies inside it); depends on content only, not on the view
    let capCache = subCapCache && subCapCache.key === capKey ? subCapCache : null;
    if (!capCache) {
      const subSet = new Set(), natSet = new Set();
      const cityById = new Map(L.filter((c) => c.kind === 'city').map((c) => [c.id, c]));
      for (const g of L) {
        if (!g.facts || !g.facts.capital) continue;
        const c = cityById.get(g.facts.capital); if (!c) continue;
        if (g.kind === 'subdivision') { if (contains(g, [c.lon, c.lat])) subSet.add(c.id); }
        else if (g.kind === 'country' && contains(g, [c.lon, c.lat])) natSet.add(c.id);   // the capital chosen on the country counts like a city ranked "capital"
      }
      capCache = subCapCache = { key: capKey, set: subSet, nat: natSet };
    }
    const subCaps = capCache.set, natCaps = capCache.nat;
    const pri = (f) => (natCaps.has(f.id) ? 0 : Math.min(PRI[f.rank] ?? 3, subCaps.has(f.id) ? 0.5 : 9));
    const cities = capCache.cities || (capCache.cities = L.filter((f) => f.kind === 'city').sort((p, q) => pri(p) - pri(q)));       // sorted once per content version, not on every repaint
    const cityDraw = [];
    for (const f of cities) {
      const isSubCap = subCaps.has(f.id), isNat = f.rank === 'capital' || natCaps.has(f.id);
      if (!cityShown(f, isSubCap, z, isNat)) continue;                                        // zoomed out far enough: no dot
      const s = toScreen(v, f.lon, f.lat); if (!s || s[0] < -200 || s[0] > v.w + 200 || s[1] < -50 || s[1] > v.h + 50) continue;
      const r = isNat ? 5.5 : isSubCap ? 4.6 : f.rank === 'city' ? 4 : 2.8, fs = isNat ? 12.5 : f.rank === 'city' ? 11 : 10, c = { f, s, r, isNat, isSubCap, fs, bx: 0, name: false };
      if (z >= NAME_Z && !moveGlobe) {                                                        // zoomed out: dots only
        ctx.font = `${isNat || isSubCap ? 600 : 500} ${fs}px Archivo, system-ui, "Segoe UI", sans-serif`;
        const tw = ctx.measureText(f.name).width, bx = s[0] + r + 6, x0 = bx - 2, y0 = s[1] - fs * 0.6, x1 = bx + tw + 2, y1 = s[1] + fs * 0.6;
        if (!placer.hit(x0, y0, x1, y1)) { placer.add(x0, y0, x1, y1); c.name = true; c.bx = bx; }      // a name that would sit on other text is left out (the dot stays)
      }
      cityDraw.push(c);
    }
    // 3-5. area names, set along the long axis of each area, curved with it, letters spread to fill it
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const T = ctx.getTransform(), jump = 0.5 * Math.max(v.def.xmax, v.def.ymax) * v.scale;
    const useSprites = !!(v.snapshot && !v.exporting && !v.def.globe), spStart = now(), spEnd = v.idle ? Infinity : SPRITE_BUILD_MS;       // the pan bitmap places cached name pictures
    let spHit = 0, spBuilt = 0, spLate = 0;
    const named = [];                                                                          // [placement weight, area]: shallow subdivisions, deeper ones, ranges, countries last
    if (!moveGlobe) for (const f of L) if (isArea(f) && f.name && reachesView(projRing(f, v), v)) named.push([f.kind === 'subdivision' ? depthOf(f) : f.kind === 'range' ? 90 : 99, f]);
    named.sort((p, q) => p[0] - q[0]);
    for (const [, f] of named) {
      const rg = f.kind === 'range', dp = f.kind === 'subdivision' ? depthOf(f) : 0, text = dp ? f.name : f.name.toUpperCase(), chars = [...text];
      // The layout of a name is cached (per zoom bucket for the sprites, per exact view otherwise), so nothing is laid out again while the view only moves.
      const lkey = [v.def.id, v.lon0.toFixed(5), v.def.globe ? v.lat0.toFixed(5) : 0, revs.get(f) || 0, text, dp, rg, nameWeight].join('|');
      if (useSprites) {                      // pan bitmap: each name is a cached picture (laid out once per zoom bucket), so a rebuild only places it
        const ds = T.a, b0 = bucketOf(v.scale), ox = v.w / 2 - v.cx * v.scale, oy = v.h / 2 + v.cy * v.scale;      // canonical layout -> this bitmap: x * kk + ox, y * kk + oy
        for (let k = 0; k < NAME_VARIANTS.length; k++) {
          const lay = canonLayout(ctx, f, v, rg, dp, text, chars, lkey, b0, k);
          if (!lay) { if (k === 0) break; continue; }                                         // variant 0 has no legible size: nothing to move, nothing to hide
          const kk = v.scale / lay.sb, gl = lay.L2.glyphs, size = lay.L2.size;
          if (glyphsHit(placer, gl, size, kk, ox, oy)) continue;                              // on other text: the next variant
          glyphsAdd(placer, gl, size, kk, ox, oy);
          if (size * kk < 6) break;                                                           // too small to read (its place stays free)
          const vname = f.id + '|' + lkey + '|' + ds.toFixed(2) + '|' + th.id + '|' + k;
          let e = nameSprites.get(vname, b0);
          if (e) spHit++;
          else if (now() - spStart < spEnd) { e = nameSprites.put(vname, b0, makeSprite(lay, ds, rg, dp, th)); spBuilt++; }
          else { e = nameSprites.nearest(vname, b0, 6); spLate++; }      // out of time: the nearest size already made (the crisp repaint after the gesture sets it properly); none yet = it appears with the next rebuild
          if (!e) break;
          if (e.big) { paintGlyphs(ctx, T, gl, size, kk, ox, oy, rg, dp, th); break; }       // too large to cache: drawn directly
          const k2 = v.scale / e.sb, ax = v.w / 2 + (e.X0 - v.cx) * v.scale, ay = v.h / 2 - (e.Y0 - v.cy) * v.scale, dw = e.w * k2, dh = e.h * k2;
          if (e.size * k2 >= 6 && !(ax > v.w + 30 || ay > v.h + 30 || ax + dw < -30 || ay + dh < -30)) ctx.drawImage(e.cv, ax, ay, dw, dh);
          break;
        }
        continue;
      }
      // direct painting (at rest, export, globe): the layout is made in screen space and kept per name while the view does not change
      let ent = nameLayouts.get(f);
      if (!(!v.snapshot && ent && ent.key === lkey && ent.w === v.w && ent.h === v.h && ent.scale === v.scale && ent.cx === v.cx && ent.cy === v.cy)) {
        const sp = spineFor(f); if (!sp) continue;
        const sc = []; let ok = true, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for (const q of sp.pts) {
          const s = toScreen(v, q[0], q[1]);
          if (!s || (sc.length && Math.hypot(s[0] - sc[sc.length - 1][0], s[1] - sc[sc.length - 1][1]) > jump)) { ok = false; break; }     // hidden side of a globe / map seam
          sc.push(s); x0 = Math.min(x0, s[0]); x1 = Math.max(x1, s[0]); y0 = Math.min(y0, s[1]); y1 = Math.max(y1, s[1]);
        }
        if (!ok || x1 < -200 || x0 > v.w + 200 || y1 < -200 || y0 > v.h + 200) continue;                    // off screen: no layout work
        ent = { key: lkey, scale: v.scale, cx: v.cx, cy: v.cy, w: v.w, h: v.h, sc, thick: thicknessPx(sc, sp), m: advancesOf(ctx, rg, dp, text, chars), vars: [] };
        if (!v.snapshot) nameLayouts.set(f, ent);
      }
      const opts = nameOpts(rg, dp);
      for (let k = 0; k < NAME_VARIANTS.length; k++) {
        let L2 = ent.vars[k]; if (L2 === undefined) L2 = ent.vars[k] = layoutName(ent.sc, ent.thick, chars, ent.m, { ...opts, ...NAME_VARIANTS[k] });       // variants are only laid out when an earlier one collided
        if (!L2 || !L2.glyphs.length) { if (k === 0) break; continue; }
        if (glyphsHit(placer, L2.glyphs, L2.size)) continue;
        glyphsAdd(placer, L2.glyphs, L2.size);
        paintGlyphs(ctx, T, L2.glyphs, L2.size, 1, 0, 0, rg, dp, th);
        break;
      }
    }
    ctx.textAlign = 'left';
    const t3 = now();
    // labels
    for (const f of L) {
      if (f.kind !== 'label') continue;
      const s = toScreen(v, f.lon, f.lat); if (!s || s[0] < -300 || s[0] > v.w + 300 || s[1] < -100 || s[1] > v.h + 100) continue;
      const size = f.size * Math.min(2.4, Math.max(0.8, Math.sqrt(z))), rot = (f.rotation || 0) * DEG;
      ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(rot);
      ctx.font = `italic ${size}px Archivo, system-ui, "Segoe UI", sans-serif`;
      ctx.strokeStyle = th.txt.halo; ctx.lineWidth = 3.4; ctx.fillStyle = th.txt.label;
      const total = spaced(ctx, f.text, 0, 0, f.spacing || 0, true);
      ctx.restore();
      if (!v.snapshot) rects.set(f, { cx: s[0], cy: s[1], w: total, h: size, rot });   // hit-test boxes are in screen coordinates; the oversized snapshot canvas is offset
      if (sel && sel.id === f.id) {
        ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(rot); ctx.strokeStyle = ACCENT; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4;
        ctx.strokeRect(-total / 2 - 4, -size / 2 - 3, total + 8, size + 6); ctx.restore();
      }
    }
    // cities: dots always, names where the text pass above found room for them
    for (const c of cityDraw) {
      const { f, s, r, isNat, isSubCap, fs } = c;
      ctx.beginPath(); ctx.arc(s[0], s[1], r, 0, 7);
      ctx.fillStyle = th.txt.ink; ctx.fill(); ctx.strokeStyle = th.txt.paper; ctx.lineWidth = 1.6; ctx.stroke();
      if (isNat) { ctx.beginPath(); ctx.arc(s[0], s[1], r + 3, 0, 7); ctx.strokeStyle = th.txt.ink; ctx.lineWidth = 1.2; ctx.stroke(); }
      else if (isSubCap) { const d = r + 3.2; ctx.beginPath(); ctx.moveTo(s[0], s[1] - d); ctx.lineTo(s[0] + d, s[1]); ctx.lineTo(s[0], s[1] + d); ctx.lineTo(s[0] - d, s[1]); ctx.closePath(); ctx.strokeStyle = th.txt.ink; ctx.lineWidth = 1.1; ctx.stroke(); }     // regional capital: a diamond instead of the national double ring
      if (!c.name) continue;
      ctx.font = `${isNat || isSubCap ? 600 : 500} ${fs}px Archivo, system-ui, "Segoe UI", sans-serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = th.txt.halo; ctx.fillStyle = th.txt.ink;
      ctx.strokeText(f.name, c.bx, s[1] - 1); ctx.fillText(f.name, c.bx, s[1] - 1);
    }
    const t4 = now();
    if (!v.snapshot) { timings.polys = t1 - t0; timings.ranges = t2 - t1; timings.names = t3 - t2; timings.rest = t4 - t3; timings.total = t4 - t0; }
    else if (plog.on) plog.snap = { ...(plog.snap || {}), polys: t1 - t0, ranges: t2 - t1, names: t3 - t2, rest: t4 - t3, spH: spHit, spB: spBuilt, spL: spLate };       // F4 only: where a pan-bitmap rebuild spends its time (names = user rivers + country names, rest = labels + cities)
  }

  const isSubCapital = (c) => store.features.some((g) => g.kind === 'subdivision' && g.facts && g.facts.capital === c.id && isVisible(g) && contains(g, [c.lon, c.lat]));
  /** a city ranked "capital", or the one chosen as the capital of the country it lies in */
  const isNatCapital = (c) => c.rank === 'capital' || store.features.some((g) => g.kind === 'country' && g.facts && g.facts.capital === c.id && isVisible(g) && contains(g, [c.lon, c.lat]));
  /** highlight of the selected feature, drawn over the cached base layer */
  function drawSelection(ctx, v) {
    const f = sel && store.find(sel.id); if (!f || !isVisible(f)) return;
    const th = v.theme || THEMES.atlas, z = Math.max(v.zoomRel || 1, 1);
    if (isPoly(f)) {
      const path = strokePath(projRing(f, v));
      inUnits(ctx, v, (px) => { ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = 5 * px; ctx.stroke(path); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.2 * px; ctx.stroke(path); });
    } else if (f.kind === 'range') {
      const path = strokePath(projRing(f, v));
      inUnits(ctx, v, (px) => { ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 4 * px; ctx.stroke(path); ctx.setLineDash([5 * px, 4 * px]); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2 * px; ctx.stroke(path); ctx.setLineDash([]); });
    } else if (f.kind === 'river' || f.kind === 'road') {
      const c = projRing(f, v), path = new Path2D(); let st = false;
      const sx = (x) => v.w / 2 + (x - v.cx) * v.scale, sy = (y) => v.h / 2 - (y - v.cy) * v.scale;
      for (const p of c.pts) { if (!p) { st = false; continue; } if (st) path.lineTo(sx(p[0]), sy(p[1])); else { path.moveTo(sx(p[0]), sy(p[1])); st = true; } }
      const rt = f.kind === 'road' && (TIER_BY_ID.get(f.tier) || TIER_BY_ID.get('local'));
      const w = rt ? roadWidthPx(rt, z) : Math.max(1, (0.7 + 0.9 * (f.width || 1)) * Math.min(2.5, Math.pow(z, 0.35)));
      ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = w + 5; ctx.stroke(path);
      ctx.strokeStyle = rt ? (th.road || THEMES.atlas.road)[rt.id] : (f.color || '#4a86b8'); ctx.lineWidth = w; ctx.stroke(path);
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]); ctx.stroke(path); ctx.setLineDash([]);
    } else if (f.kind === 'label') {
      const s = toScreen(v, f.lon, f.lat); if (!s) return;
      const size = f.size * Math.min(2.4, Math.max(0.8, Math.sqrt(z))), rot = (f.rotation || 0) * DEG, chars = [...(f.text || '')];
      ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(rot);
      ctx.font = `italic ${size}px Archivo, system-ui, "Segoe UI", sans-serif`;
      const total = chars.reduce((a, ch) => a + ctx.measureText(ch).width, 0) + (f.spacing || 0) * Math.max(chars.length - 1, 0);
      ctx.strokeStyle = ACCENT; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4; ctx.strokeRect(-total / 2 - 4, -size / 2 - 3, total + 8, size + 6); ctx.restore();
    } else if (f.kind === 'city') {
      const s = toScreen(v, f.lon, f.lat); if (!s) return;
      const isSubCap = isSubCapital(f), isNat = isNatCapital(f), r = isNat ? 5.5 : isSubCap ? 4.6 : f.rank === 'city' ? 4 : 2.8;
      ctx.beginPath(); ctx.arc(s[0], s[1], r, 0, 7); ctx.fillStyle = th.txt.ink; ctx.fill(); ctx.strokeStyle = th.txt.paper; ctx.lineWidth = 1.6; ctx.stroke();
      if (isNat) { ctx.beginPath(); ctx.arc(s[0], s[1], r + 3, 0, 7); ctx.strokeStyle = th.txt.ink; ctx.lineWidth = 1.2; ctx.stroke(); }
      else if (isSubCap) { const d = r + 3.2; ctx.beginPath(); ctx.moveTo(s[0], s[1] - d); ctx.lineTo(s[0] + d, s[1]); ctx.lineTo(s[0], s[1] + d); ctx.lineTo(s[0] - d, s[1]); ctx.closePath(); ctx.strokeStyle = th.txt.ink; ctx.lineWidth = 1.1; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(s[0], s[1], r + 6, 0, 7); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
      const fs = isNat ? 12.5 : f.rank === 'city' ? 11 : 10;
      ctx.font = `${isNat || isSubCap ? 600 : 500} ${fs}px Archivo, system-ui, "Segoe UI", sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const bx = s[0] + r + 6; ctx.lineWidth = 3; ctx.strokeStyle = th.txt.halo; ctx.fillStyle = th.txt.ink;
      ctx.strokeText(f.name, bx, s[1] - 1); ctx.fillText(f.name, bx, s[1] - 1);
    }
  }
  /** a soft tint + outline over an area (with its separate parts), or a ring round a city: what the pointer is over in the Countries list */
  function drawHover(ctx, v, f) {
    if (!f || !isVisible(f)) return;
    if (isPoly(f)) {
      const c = projRing(f, v); if (!c.ok || !reachesView(c, v)) return;
      onLand(ctx, v, () => inUnits(ctx, v, () => { ctx.fillStyle = 'rgba(47,111,148,0.17)'; ctx.fill(unitPath(c)); }));
      inUnits(ctx, v, (px) => {
        const path = strokePath(c);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4 * px; ctx.stroke(path);
        ctx.strokeStyle = 'rgba(47,111,148,0.9)'; ctx.lineWidth = 2 * px; ctx.stroke(path);
      });
    } else if (f.kind === 'city') {
      const s = toScreen(v, f.lon, f.lat); if (!s) return;
      ctx.beginPath(); ctx.arc(s[0], s[1], 11, 0, 7); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.arc(s[0], s[1], 11, 0, 7); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
    }
  }
  /** the border pieces to shimmer: the area the info card points at, else the selected country / subdivision, with its separate parts.
   *  { paths: Path2D[] in projected units, pts } or null. Cheap: the outline comes from the same cache as the map's own drawing. */
  function shimmerOf(v, fast) {
    const id = spot || (sel && sel.id), f = id && store.find(id);
    if (!f || !isPoly(f) || !isVisible(f)) return null;
    const eps = fast && v.def.globe ? moveEps(v.scale) : 0, c = projRing(f, v, eps);          // the same coarser outline the map uses while a globe turns
    if (!c.ok || !reachesView(c, v)) return null;
    return { paths: [strokePath(c)], pts: c.pts.length };
  }
  /** TOP layer: cheap, redrawn every frame (selection, handles, rubber band, brush, hover marker) */
  function drawTop(ctx, v) {
    const sx = (x) => v.w / 2 + (x - v.cx) * v.scale, sy = (y) => v.h / 2 - (y - v.cy) * v.scale;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    drawSelection(ctx, v);
    if (hl && !(sel && sel.id === hl)) drawHover(ctx, v, store.find(hl));
    // handles for the selected country
    const sf = sel && store.find(sel.id); const sfVisible = sf && isVisible(sf);
    if (sfVisible && isShape(sf) && tool === 'select') {
      const ri = activeRing(sf), ring = sf.rings[ri], n = ring.length;
      for (let i = 0; i < segCount(sf, ri); i++) {                               // insert handles
        const a = ring[i], b = ring[(i + 1) % n], m = midOf(sf, i, ri), s = toScreen(v, m[0], m[1]);
        const sa = toScreen(v, a[0], a[1]), sb = toScreen(v, b[0], b[1]);
        if (!s || !sa || !sb || Math.hypot(sa[0] - sb[0], sa[1] - sb[1]) < 22) continue;
        ctx.beginPath(); ctx.arc(s[0], s[1], 3.2, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.2; ctx.stroke();
      }
      if (sf.handles && ri === 0) for (let i = 0; i < n; i++) {                              // curve handles: line + round knob
        const h = sf.handles[i], s = toScreen(v, ring[i][0], ring[i][1]); if (!h || !s) continue;
        for (const w of ['o', 'i']) {
          if (!hasHandle({ [w]: h[w] })) continue;
          const e = toScreen(v, ring[i][0] + h[w][0], ring[i][1] + h[w][1]); if (!e) continue;
          ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.strokeStyle = 'rgba(47,111,148,.75)'; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(e[0], e[1], 4, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.4; ctx.stroke();
        }
      }
      for (let i = 0; i < n; i++) {
        const s = toScreen(v, ring[i][0], ring[i][1]); if (!s) continue;
        const on = sel.vertex === i;
        ctx.beginPath(); ctx.rect(s[0] - 4.5, s[1] - 4.5, 9, 9);
        ctx.fillStyle = on ? ACCENT : '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.6; ctx.stroke();
      }
    }
    // rubber band while drawing + snap indicator
    if ((isPen()) && drawing) {
      const pts = drawing.pts.slice(), hs = drawing.hs.slice(); if (hover && hover.ll) { if (hover.path) { pts.push(...hover.path); hs.push(...hover.path.map(() => null)); } pts.push(hover.ll); hs.push(null); }
      if (pts.length > 1) {
        const d = densify(flattenRing(pts, hs, false), false, 0.5); ctx.beginPath(); let st = false;
        for (let i = 0; i < d.length; i += 2) {
          const p = project(v.def, d[i], d[i + 1], v.lon0, lat0(v)); if (!p) { st = false; continue; }
          if (st) ctx.lineTo(sx(p[0]), sy(p[1])); else { ctx.moveTo(sx(p[0]), sy(p[1])); st = true; }
        }
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
      const lk = drawing.pts.length - 1, lh = drawing.hs[lk];                      // handles of the newest point
      if (lh) for (const w of ['o', 'i']) {
        if (!hasHandle({ [w]: lh[w] })) continue;
        const a0 = toScreen(v, drawing.pts[lk][0], drawing.pts[lk][1]), e = toScreen(v, drawing.pts[lk][0] + lh[w][0], drawing.pts[lk][1] + lh[w][1]);
        if (!a0 || !e) continue;
        ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(e[0], e[1]); ctx.strokeStyle = 'rgba(47,111,148,.75)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(e[0], e[1], 3.5, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.4; ctx.stroke();
      }
      drawing.pts.forEach((p, i) => {
        const s = toScreen(v, p[0], p[1]); if (!s) return;
        ctx.beginPath(); ctx.arc(s[0], s[1], i === 0 && drawing.pts.length >= 3 ? 6.5 : 4, 0, 7);
        ctx.fillStyle = i === 0 ? ACCENT : '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
      });
    }
    if (isBrush()) {                              // live stroke + the brush outline under the cursor
      const r = brushR, er = stroke ? stroke.erase : brushErase;
      if (stroke) {
        const pts = stroke.px.concat(brushAt && Math.hypot(brushAt[0] - stroke.last[0], brushAt[1] - stroke.last[1]) > 0.5 ? [brushAt] : []);
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = r * 2;
        ctx.strokeStyle = er ? 'rgba(196,72,48,.38)' : 'rgba(47,111,148,.38)';
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); if (pts.length === 1) ctx.lineTo(pts[0][0] + 0.01, pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke(); ctx.restore();
      }
      if (brushAt) { ctx.beginPath(); ctx.arc(brushAt[0], brushAt[1], r, 0, 7); ctx.strokeStyle = er ? '#c44830' : ACCENT; ctx.lineWidth = 1.5; ctx.stroke(); }
    }
    if (hover && hover.ll && ((tool !== 'select' && tool !== 'pan' && tool !== 'brush') || drag)) {
      const s = toScreen(v, hover.ll[0], hover.ll[1]);
      if (s && hover.point === 'city') {                                        // the city that would be placed here
        const th = v.theme || THEMES.atlas;
        ctx.save(); ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(s[0], s[1], 4, 0, 7); ctx.fillStyle = th.txt.ink; ctx.fill(); ctx.strokeStyle = th.txt.paper; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.beginPath(); ctx.arc(s[0], s[1], 9, 0, 7); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
        ctx.restore();
      } else if (s) {
        ctx.beginPath(); ctx.arc(s[0], s[1], hover.snapped ? 7.5 : 3, 0, 7);
        ctx.strokeStyle = hover.snapped ? '#d0782c' : 'rgba(47,111,148,.7)'; ctx.lineWidth = hover.snapped ? 2.4 : 1.4; ctx.stroke();
      }
    }
  }

  // ---------- land-only area ----------
  let landArea = null, coastVer = 0; const areaCache = new WeakMap();
  /** { total, land } in km2 - `land` counts land, rivers and inner lakes only (not the sea inside an outline) */
  function areaKm2(f, R) {
    const key = [f, ...enclavesOf(f)].map((x) => (revs.get(x) || 0)).join(',') + '|' + R + '|' + !!getCoast() + '|' + coastVer, hit = areaCache.get(f);
    if (hit && hit.key === key) return hit.v;
    if (hit && drag) return hit.v;                                                  // while a point is being dragged keep the last figure; the exact one is computed once on release
    const coast = getCoast && getCoast(); if (coast && !landArea) landArea = createLandArea(coast);
    let total = 0, land = 0;
    for (const r of shapeOf(f)) { const t = ringAreaKm2(r, R); total += t; land += landArea && r.length >= 3 ? t * landArea.fraction(r) : t; }
    for (const e of enclavesOf(f)) { const h = areaKm2(e, R); total -= h.total; land -= h.land; }
    const v = { total, land };
    areaCache.set(f, { key, v }); return v;
  }

  setHint();
  return {
    get fillOpacity() { return fillScale; }, setFillOpacity(v) { fillScale = Math.max(0, Math.min(2, v)); onContent(); requestRender(); },
    containsGroup: (f, ll) => contains(f, ll),
    isShown: isVisible, spineOf: spineFor, areaKm2, enclavesOf, revOf: (f) => revs.get(f) || 0, detachRing, partCount, clipToShores, fit, settle, mergeInto, maxLevels: MAX_LEVELS,
    get selectedRing() { const f = sel && store.find(sel.id); return f ? activeRing(f) : 0; },
    draw, drawBase, drawTop, timings, depth: depthOf, root: rootOf, children: childrenOf, descendants, contains, pointerDown, pointerMove, pointerUp, click, dblclick, keydown, setTool, select, deleteSelection, bump, shape: shapeOf,
    changeLevel, parentForLevel, newArea() { select(null); }, belongsTo, relocate, get relocating() { return relocating; },
    get level() { return level; }, setLevel(n) { level = n | 0; if (tool === 'sub') parentOverride = null; requestRender(); },
    get brushSize() { return brushR * 2; }, setBrushSize(d) { brushR = Math.min(100, Math.max(3, d / 2)); requestRender(); },
    get brushErase() { return brushErase; }, setBrushErase(on) { brushErase = !!on; requestRender(); },
    cancelStroke() { if (stroke) { stroke = null; requestRender(); } }, leave() { brushAt = null; requestRender(); },
    get tool() { return tool; }, get selectedId() { return sel && sel.id; }, get drawing() { return !!drawing; }, get parentId() { return parentOverride; },
    setSnap(on) { snapOn = on; }, get snap() { return snapOn; },
    setClip(on) { clipOn = on; onContent(); },
    setLayers(l) { layers = { ...layers, ...l }; onContent(); }, get layers() { return layers; }, get clip() { return clipOn; },
    /** Roads panel: { on, all, tiers: { <tier id>: bool } }; merged into what is set */
    setRoads(o) { roadOpts = { ...roadOpts, ...o, tiers: { ...roadOpts.tiers, ...(o && o.tiers) } }; onContent(); requestRender(); }, get roads() { return roadOpts; },
    /** the tier the Road tool draws */
    get roadTier() { return roadTier; }, setRoadTier(id) { if (TIER_BY_ID.has(id)) { roadTier = id; requestRender(); } },
    touch(f) { bump(f); requestRender(); },
    /** soft highlight of an area or city (the pointer is over its row in a list); null clears it */
    highlight(id) { id = id || null; if (id === hl) return; hl = id; requestRender(); },
    /** the area the info card / "Show on map" points at: its border shimmers (no handles, no editing). null clears it */
    spotlight(id) { id = id || null; if (id === spot) return; spot = id; requestRender(); },
    get spotId() { return spot; },
    shimmerOf,
    isNatCapital,
    fromScreen: (sx, sy) => fromScreen(getView(), sx, sy),
    /** the vector coast was replaced (land editor): drop every cache built from it */
    /** builds the land mask now (once), so the first area figure does not have to */
    warmArea() { const coast = getCoast && getCoast(); if (coast && !landArea) landArea = createLandArea(coast); if (landArea) landArea.warm(); },
    coastChanged() { grid = null; clipper = null; shore = null; landArea = null; landKey = ''; landPath = null; coastVer++; onContent(); requestRender(); },
    touchAll() { for (const f of store.features) if (f.shapes) bump(f); requestRender(); },
  };
}