// Biome painter: paints a biome onto the land with a round brush, the way the Land editor paints land.
// The painted biomes live in one per-pixel delta at source-texture resolution (0 = untouched, 1..14 = index into BIOMES + 1) and
// are saved in a hidden label feature (BIOME_ID, run-length text in `notes`), so save / undo / redo / open / New map carry them.
// They reach the screen through landedit's patch(): `overlay` blends the painted colours into the baked biome texture there.
// That is the only place the biome texture is written, so a land stroke can never erase biome paint, and only the touched
// rectangle is re-uploaded.
import { BIOME_ID, BIOMES } from './biomes.js';

const MIN_SIZE = 4, MAX_SIZE = 120, START_SIZE = 18, START_BIOME = 2, KEY = 'cosmossi.biomeBrush';
const SOFT = 3;     // blur radius (px) that feathers the edge of a painted area
const WIN = 8;      // extra ring read around a patch so the blur sees painted pixels just outside it (must be >= SOFT)
const RGB = BIOMES.map(({ color }) => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// separable box blur of radius SOFT over a w x h window; the rectangle sits WIN px inside its window, so its blur never reads the clamped edge
function box(a, w, h) {
  const k = 1 / (2 * SOFT + 1), t = new Float32Array(a.length), o = new Float32Array(a.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0; for (let d = -SOFT; d <= SOFT; d++) s += a[y * w + clamp(x + d, 0, w - 1)];
    t[y * w + x] = s * k;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0; for (let d = -SOFT; d <= SOFT; d++) s += t[clamp(y + d, 0, h - 1) * w + x];
    o[y * w + x] = s * k;
  }
  return o;
}

/**
 * Creates the biome editor. app.js must build it before the land editor, because createLandEdit needs `overlay` at construction
 * and this editor needs the land editor's texture and repaint. The order is:
 *   const biome = createBiomeEdit({...});
 *   const land = createLandEdit({..., biomeOverlay: biome.overlay});
 *   biome.attach(land);
 * `overlay` uses no `this`, so it can be passed on its own.
 */
export function createBiomeEdit({ store, fromScreen, getRenderer, requestRender, say, onActive }) {
  let active = false, land = null, loading = null, W = 0, H = 0, biomeDelta = null, lastNotes = '';
  let biome = START_BIOME, erase = false, size = START_SIZE, cursor = null, stroke = null, dirty = null, raf = 0;
  const listeners = [];
  let optsBox = null;                                                    // the options panel (#biomeOpts), found by bindPanel()
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && Number.isInteger(s.biome) && s.biome >= 1 && s.biome <= BIOMES.length) biome = s.biome;
    if (s && Number.isFinite(s.size)) size = clamp(Math.round(s.size), MIN_SIZE, MAX_SIZE);
  } catch (_) { /* no storage, or a damaged value: keep the defaults */ }

  // ---------- base size, from the land editor's texture load (once) ----------
  async function ensure() {
    if (!land) throw new Error('The biome painter is not connected to the land layer yet.');
    if (!loading) loading = land.ready().then(({ W: w, H: h }) => { W = w; H = h; if (!biomeDelta) biomeDelta = new Uint8Array(W * H); }).catch((e) => { loading = null; throw e; });
    return loading;
  }

  // ---------- serialisation: "<value><run>" pairs, both base 36 (values 1..14 are the single chars 1..e) ----------
  const encode = () => {
    const out = []; let v = biomeDelta[0], n = 0;
    for (let i = 0; i < biomeDelta.length; i++) { if (biomeDelta[i] === v) n++; else { out.push(v.toString(36) + n.toString(36)); v = biomeDelta[i]; n = 1; } }
    out.push(v.toString(36) + n.toString(36));
    return out.length === 1 && v === 0 ? '' : out.join(',');
  };
  const decode = (s) => {
    const d = new Uint8Array(W * H); if (!s) return d;
    let i = 0;
    for (const t of s.split(',')) {
      const v = parseInt(t[0], 36), n = parseInt(t.slice(1), 36);
      if (!(n > 0)) continue;                                                // damaged run: skip it rather than throw
      if (v >= 1 && v <= BIOMES.length) d.fill(v, i, i + n);
      i += n;
    }
    return d;
  };
  const feature = () => store.features.find((f) => f.id === BIOME_ID);
  const wx = (x) => ((x % W) + W) % W;

  // ---------- painting: the same brush shape as the land editor (an ellipse on the map, cut by the seam and the poles) ----------
  function stamp(px, py, rx, ry, val) {
    const y0 = Math.max(0, Math.floor(py - ry)), y1 = Math.min(H - 1, Math.ceil(py + ry)), xa = Math.floor(px - rx), xb = Math.ceil(px + rx);
    for (let y = y0; y <= y1; y++) {
      const dy = (y + 0.5 - py) / ry, rem = 1 - dy * dy; if (rem < 0) continue; const hw = Math.sqrt(rem) * rx;
      for (let x = Math.ceil(px - hw - 0.5); x <= Math.floor(px + hw - 0.5); x++) biomeDelta[y * W + wx(x)] = val;
    }
    if (!dirty) dirty = { x0: xa, x1: xb + 1, y0, y1: y1 + 1 };
    else { dirty.x0 = Math.min(dirty.x0, xa); dirty.x1 = Math.max(dirty.x1, xb + 1); dirty.y0 = Math.min(dirty.y0, y0); dirty.y1 = Math.max(dirty.y1, y1 + 1); }
  }
  function stampAt(sx, sy, val) {
    const c = fromScreen(sx, sy), e = fromScreen(sx + size, sy), n = fromScreen(sx, sy - size); if (!c || !e || !n) return false;
    let px = (c[0] + 180) / 360 * W; if (stroke.px !== null) { while (px - stroke.px > W / 2) px -= W; while (stroke.px - px > W / 2) px += W; } stroke.px = px;
    const dl = Math.abs(((e[0] - c[0] + 540) % 360) - 180), rx = Math.max(1, dl / 360 * W), ry = Math.max(1, Math.abs(n[1] - c[1]) / 180 * H);
    stamp(px, (90 - c[1]) / 180 * H, rx, ry, val); return true;
  }
  // one repaint per animation frame, covering everything the stroke touched since the last one
  function flush() {
    raf = 0; if (!dirty) return; const d = dirty; dirty = null; land.repaint(d.x0, d.y0, d.x1, d.y1);
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(flush); };
  // painting starts only when the base size is known and the map can draw; until then say what is missing (the drag is still consumed)
  function prepare() {
    if (!land) { say('The biome painter is still starting up.'); return false; }
    if (!getRenderer()) { say('The map is still starting up.'); return false; }
    if (!biomeDelta) { ensure().then(() => say('Biome data ready - drag to paint.')).catch((e) => say(String(e.message || e))); say('Loading land data…'); return false; }
    return true;
  }

  function down(e) {
    if (!prepare()) return true;
    // one undo step per stroke; the label size is the label's, not the brush's
    store.edit((all) => { if (!all.some((f) => f.id === BIOME_ID)) all.push({ id: BIOME_ID, kind: 'label', text: 'biome', lon: 0, lat: 0, size: 18, rotation: 0, spacing: 4, life: { from: null, to: null }, notes: '' }); });
    stroke = { val: erase !== !!e.shiftKey ? 0 : biome, px: null, last: [e.clientX, e.clientY] };     // value 0 erases; Shift inverts the eraser
    if (stampAt(e.clientX, e.clientY, stroke.val)) queue();
    return true;
  }
  function move(e) {
    const sx = e.clientX, sy = e.clientY; cursor = [sx, sy]; requestRender();
    if (!stroke) return;
    const dx = sx - stroke.last[0], dy = sy - stroke.last[1], n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / Math.max(2, size / 3)));
    for (let i = 1; i <= n; i++) stampAt(stroke.last[0] + dx * i / n, stroke.last[1] + dy * i / n, stroke.val);
    stroke.last = [sx, sy]; queue();
  }
  function up() {
    if (!stroke) return; stroke = null; flush();
    const f = feature(), notes = encode(); lastNotes = notes;
    if (f) store.live(() => { f.notes = notes; });            // live: down() already made the undo step
  }

  // ---------- overlay: called by landedit's patch() with the rectangle's baked biome colours (RGBA, w x h) ----------
  // Normalised convolution, as in tools/bake_textures.py: blur(colour * painted) / blur(painted) is the colour of the painted
  // neighbourhood, and blur(painted) is how much of it is painted. The painted colour fades in where that coverage reaches 0.6.
  function overlay(bio, x0, y0, w, h) {
    if (!biomeDelta) return;                                               // not loaded yet: nothing painted to show
    const ww = w + 2 * WIN, wh = h + 2 * WIN, n = ww * wh;
    let m = null, cr = null, cg = null, cb = null;
    for (let y = 0; y < wh; y++) {
      const row = clamp(y0 + y - WIN, 0, H - 1) * W;                       // poles: the edge row repeats
      for (let x = 0; x < ww; x++) {
        const c = RGB[biomeDelta[row + wx(x0 + x - WIN)] - 1];            // value 0 gives index -1: untouched, no entry
        if (!c) continue;
        if (!m) { m = new Float32Array(n); cr = new Float32Array(n); cg = new Float32Array(n); cb = new Float32Array(n); }
        const i = y * ww + x; m[i] = 1; cr[i] = c[0]; cg[i] = c[1]; cb[i] = c[2];
      }
    }
    if (!m) return;                                                        // nothing painted near this rectangle
    const bm = box(m, ww, wh), P = [box(cr, ww, wh), box(cg, ww, wh), box(cb, ww, wh)];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y + WIN) * ww + x + WIN, den = bm[i];
      if (!(den > 0)) continue;
      const t = clamp(den / 0.6, 0, 1), a = t * t * (3 - 2 * t), k = (y * w + x) * 4;     // smoothstep(0, 0.6, coverage)
      for (let c = 0; c < 3; c++) bio[k + c] = Math.round(bio[k + c] + (P[c][i] / den - bio[k + c]) * a);
    }
  }

  // ---------- follow undo / redo / open / New map: the saved notes are the truth; repaint only the rectangle that changed ----------
  async function sync() {
    if (!land) return;
    const f = feature(), notes = f ? f.notes || '' : '';
    if (notes === lastNotes) return;
    if (!notes && !biomeDelta) { lastNotes = notes; return; }
    await ensure(); if (stroke) return;
    const next = decode(notes); let x0 = W, x1 = -1, y0 = H, y1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0, o = y * W; x < W; x++) if (next[o + x] !== biomeDelta[o + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    biomeDelta = next; lastNotes = notes; if (x1 < 0) return;
    land.repaint(x0, y0, x1 + 1, y1 + 1);
  }
  store.on((t) => { if (t === 'change') sync().catch((e) => console.warn('biome sync failed', e)); });
  function attach(l) { land = l; sync().catch((e) => console.warn('biome sync failed', e)); }

  // ---------- options: selected biome, eraser and brush size; the biome and size are remembered between sessions ----------
  const opts = () => ({ biome, erase, size });
  function changed() {
    try { localStorage.setItem(KEY, JSON.stringify({ biome, size })); } catch (_) { /* not remembered: nothing else depends on it */ }
    for (const fn of listeners) fn(opts());
    requestRender();
  }
  function onOptions(fn) { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }
  const getBiome = () => biome;
  function setBiome(i) { const v = Math.round(+i); if (!(v >= 1 && v <= BIOMES.length) || v === biome) return; biome = v; changed(); }
  const getErase = () => erase;
  function setErase(b) { const v = !!b; if (v === erase) return; erase = v; changed(); }
  const getSize = () => size;
  function setSize(n) { if (!Number.isFinite(+n)) return; const v = clamp(Math.round(+n), MIN_SIZE, MAX_SIZE); if (v === size) return; size = v; changed(); }

  // ---------- options panel (#biomeOpts): swatches, eraser, size readout and the biome's name; shown only while the tool is on ----------
  // Each element is looked up and skipped when missing, so the engine still runs without the panel markup.
  function bindPanel() {
    const $ = (s) => document.querySelector(s);
    const swatches = $('#biomeSwatches'), eraserBtn = $('#biomeEraser'), sizeOut = $('#biomeSize'), nameEl = $('#biomeName');
    optsBox = $('#biomeOpts'); if (optsBox) optsBox.hidden = !active;
    if (swatches) BIOMES.forEach((b, i) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'bo-sw'; btn.title = b.name; btn.setAttribute('aria-label', b.name);
      btn.style.background = b.color;
      btn.addEventListener('click', () => setBiome(i + 1));                  // biome values are 1-based (0 = untouched)
      swatches.appendChild(btn);
    });
    if (eraserBtn) eraserBtn.addEventListener('click', () => setErase(!getErase()));
    // the only place the panel is drawn: swatch, eraser, [ ], E, digit keys and a restored session all reach it through onOptions
    function render() {
      if (swatches) Array.from(swatches.children).forEach((b, i) => { const on = i + 1 === biome; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      if (eraserBtn) { eraserBtn.classList.toggle('on', erase); eraserBtn.setAttribute('aria-pressed', String(erase)); }
      if (sizeOut) sizeOut.textContent = size + ' px';                       // the ring's radius in screen pixels (draw() uses it that way)
      if (nameEl) nameEl.textContent = BIOMES[biome - 1].name;
    }
    onOptions(render);
    render();                                                                // shows the remembered biome and size straight away
  }

  // ---------- tool state and keys ----------
  function setActive(on) {
    on = !!on; if (on === active) return;
    if (!on && stroke) up();                                              // leaving mid-drag still saves the stroke: texture and notes must agree
    active = on; cursor = null; stroke = null;
    if (optsBox) optsBox.hidden = !on;                                    // the options panel follows the tool
    if (on) { ensure().catch((e) => say(String(e.message || e))); say('Biome: drag to paint, Shift or E to erase, [ ] sets the size, 1-9 and 0 pick a biome, Esc to leave.'); }
    onActive && onActive(on); requestRender();
  }
  // returns true when the key was used; nothing is taken while the tool is off or while typing in a field
  function key(e) {
    if (!active || e.ctrlKey || e.metaKey || (e.target && e.target.closest && e.target.closest('input,textarea,select'))) return false;
    const k = e.key;
    if (k === 'Escape') { setActive(false); return true; }
    if (k === '[' || k === ']') { setSize(size + (k === ']' ? 4 : -4)); return true; }
    if (k === 'e' || k === 'E') { setErase(!erase); say(erase ? 'Biome eraser: drag to clear biome paint (Shift paints).' : 'Biome brush: drag to paint (Shift erases).'); return true; }
    if (/^[0-9]$/.test(k)) { setBiome(k === '0' ? 10 : +k); say('Biome: ' + BIOMES[biome - 1].name); return true; }
    return false;
  }
  function leave() { cursor = null; requestRender(); }
  function draw(ctx) {
    if (!active || !cursor) return;
    const er = stroke ? stroke.val === 0 : erase, col = er ? '#c44830' : BIOMES[biome - 1].color;     // eraser: the land eraser's red
    ctx.save(); ctx.beginPath(); ctx.arc(cursor[0], cursor[1], size, 0, 7);
    ctx.globalAlpha = er ? 1 : .2; ctx.fillStyle = er ? 'rgba(196,72,48,.12)' : col; ctx.fill(); ctx.globalAlpha = 1;
    // a dark hairline under the ring keeps the pale biome colours (arctic, tundra) visible on the pale map
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.stroke(); ctx.restore();
  }

  bindPanel();
  return {
    overlay, attach, sync, get active() { return active; }, setActive, down, move, up, leave, draw, key,
    getBiome, setBiome, getErase, setErase, getSize, setSize, onOptions,
  };
}
