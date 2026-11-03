// Land editor: paint new land / erase land on top of the baked world.
// Edits live in one exclusive per-pixel delta (0 none, 1 land, 2 water) at source-texture resolution and are saved in a hidden
// label feature ('land-delta', RLE text in `notes`) so they ride along with save / undo / redo. Only the touched rectangle of the GPU
// textures is re-computed and re-uploaded; the signed distance field is combined as max(min(base, added), -erased) so untouched
// coast keeps its original antialiased quality. Vector coast (snapping, clipping, area, ink) is rebuilt per edited cluster.
import { DEG } from './projections.js';

export const LAND_ID = 'land-delta';
const PAD = 34, DEFAULT_BIOME = [191, 207, 148];
const BIG = 300;

export function createLandEdit({ store, fromScreen, getRenderer, getCoast, onCoast, requestRender, say, onActive, loadImage, biomeOverlay }) {
  let active = false, ready = null, W = 0, H = 0, delta = null, origAux = null, origBio = null, baseCoast = null;
  let r = 18, erase = false, cursor = null, stroke = null, lastNotes = '', dirty = null, raf = 0, mipT = 0, coastT = 0;

  // ---------- loading the source pixels (once, lazily) ----------
  async function load() {
    const grab = async (url) => {
      const bmp = await loadImage(url), c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(bmp, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height); if (bmp.close) bmp.close(); return d;
    };
    const [a, b] = await Promise.all([grab('tex/field.png'), grab('tex/biome.png')]);
    W = a.width; H = a.height; origAux = a.data; origBio = b.data; delta = new Uint8Array(W * H); return { W, H };
  }
  const ensure = () => ready || (ready = load());

  // ---------- serialisation ----------
  const encode = () => {
    const out = []; let v = delta[0], n = 0;
    for (let i = 0; i < delta.length; i++) { if (delta[i] === v) n++; else { out.push(v + n.toString(36)); v = delta[i]; n = 1; } }
    out.push(v + n.toString(36));
    return out.length === 1 && v === 0 ? '' : out.join(',');
  };
  const decode = (s) => {
    const d = new Uint8Array(W * H); if (!s) return d;
    let i = 0; for (const t of s.split(',')) { const n = parseInt(t.slice(1), 36), v = +t[0]; if (v) d.fill(v, i, i + n); i += n; }
    return d;
  };
  const feature = () => store.features.find((f) => f.id === LAND_ID);

  // ---------- distance maths on a padded rectangle ----------
  function chamfer(m, w, h) {                       // distance (px) to the nearest set pixel of m, 3-4 chamfer
    const INF = 1e9, d = new Float32Array(w * h);
    for (let i = 0; i < d.length; i++) d[i] = m[i] ? 0 : INF;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      if (y > 0) { v = Math.min(v, d[i - w] + 3); if (x > 0) v = Math.min(v, d[i - w - 1] + 4); if (x < w - 1) v = Math.min(v, d[i - w + 1] + 4); }
      d[i] = v;
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x; let v = d[i];
      if (x < w - 1) v = Math.min(v, d[i + 1] + 3);
      if (y < h - 1) { v = Math.min(v, d[i + w] + 3); if (x < w - 1) v = Math.min(v, d[i + w + 1] + 4); if (x > 0) v = Math.min(v, d[i + w - 1] + 4); }
      d[i] = v;
    }
    for (let i = 0; i < d.length; i++) d[i] = d[i] / 3;
    return d;
  }
  function signed(m, w, h) {                        // < 0 inside the mask, > 0 outside, boundary at 0; clamped and lightly smoothed
    const inv = new Uint8Array(m.length); let any = 0;
    for (let i = 0; i < m.length; i++) { inv[i] = m[i] ? 0 : 1; any |= m[i]; }
    const s = new Float32Array(m.length);
    if (!any) { s.fill(BIG); return s; }
    const dOut = chamfer(m, w, h), dIn = chamfer(inv, w, h);
    for (let i = 0; i < s.length; i++) { const v = m[i] ? -(Math.min(dIn[i], BIG) - 0.5) : Math.min(dOut[i], BIG) - 0.5; s[i] = v; }
    const t = new Float32Array(s.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let a = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) { const yy = y + dy; if (yy < 0 || yy >= h) continue; for (let dx = -1; dx <= 1; dx++) { const xx = x + dx; if (xx < 0 || xx >= w) continue; a += s[yy * w + xx]; n++; } }
      t[y * w + x] = a / n;
    }
    return t;
  }
  const wx = (x) => ((x % W) + W) % W;

  /** combined signed distance (px) + added-land distance for the rectangle [x0,x1) x [y0,y1) (x may be virtual, i.e. outside 0..W) */
  function field(x0, y0, x1, y1) {
    const px0 = x0 - PAD, py0 = Math.max(0, y0 - PAD), py1 = Math.min(H, y1 + PAD), w = x1 - x0 + 2 * PAD, h = py1 - py0;
    const A = new Uint8Array(w * h), C = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = delta[(py0 + y) * W + wx(px0 + x)]; if (v === 1) A[y * w + x] = 1; else if (v === 2) C[y * w + x] = 1; }
    const sA = signed(A, w, h), sC = signed(C, w, h);
    const ow = x1 - x0, oh = y1 - y0, s = new Float32Array(ow * oh), a = new Float32Array(ow * oh), n = new Float32Array(ow * oh);
    for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
      const gx = wx(x0 + x), gy = y0 + y, o = (gy * W + gx) * 4, i = (gy - py0) * w + (x + PAD);
      const R = origAux[o], fine = (R / 255 * 2 - 1) * 32, s0 = fine > 31 ? Math.max(origAux[o + 1], 32) : fine;
      s[y * ow + x] = Math.max(Math.min(s0, sA[i]), -sC[i]); a[y * ow + x] = sA[i]; n[y * ow + x] = Math.max(sA[i], -s0);   // n = added land that is not already base land
    }
    return { s, n, a, w: ow, h: oh };
  }

  // ---------- GPU patch ----------
  function patch(x0, y0, x1, y1) {                  // x virtual; y within 0..H
    const rd = getRenderer(); if (!rd || !rd.patch) return;
    const f = field(x0, y0, x1, y1), w = f.w, h = f.h, aux = new Uint8Array(w * h * 4), bio = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const gx = wx(x0 + x), o = ((y0 + y) * W + gx) * 4, k = (y * w + x) * 4, s = f.s[y * w + x];
      aux[k] = Math.max(0, Math.min(255, Math.round((Math.max(-32, Math.min(32, s)) / 32 + 1) / 2 * 255)));
      aux[k + 1] = s < 32 ? 0 : Math.min(255, Math.round(s)); aux[k + 2] = s < 0 ? origAux[o + 2] : 0; aux[k + 3] = 255;
      const fine0 = (origAux[o] / 255 * 2 - 1) * 32, fresh = f.a[y * w + x] < 2.5 && fine0 > -0.5;
      bio[k] = fresh ? DEFAULT_BIOME[0] : origBio[o]; bio[k + 1] = fresh ? DEFAULT_BIOME[1] : origBio[o + 1]; bio[k + 2] = fresh ? DEFAULT_BIOME[2] : origBio[o + 2]; bio[k + 3] = 255;
    }
    // painted biomes (biomeedit.js) go over the baked and fresh-land colours; this is the only place the biome texture is written,
    // so a land stroke cannot erase biome paint. Without the hook (no biome editor) nothing changes.
    if (biomeOverlay) biomeOverlay(bio, x0, y0, w, h);
    const wrapAt = wx(x0), first = Math.min(w, W - wrapAt);   // split at the seam
    for (const [off, len, gx] of [[0, first, wrapAt], ...(first < w ? [[first, w - first, 0]] : [])]) {
      const cut = (src) => { const out = new Uint8Array(len * h * 4); for (let y = 0; y < h; y++) out.set(src.subarray((y * w + off) * 4, (y * w + off + len) * 4), y * len * 4); return out; };
      rd.patch('aux', gx, y0, len, h, cut(aux)); rd.patch('biome', gx, y0, len, h, cut(bio));
    }
    clearTimeout(mipT); mipT = setTimeout(() => { const g = getRenderer(); g && g.mips && g.mips(); requestRender(); }, 140);
    requestRender();
  }
  function patchRect(x0, y0, x1, y1) {              // dirty rect (virtual x) -> upload area dirty +- PAD
    x0 -= PAD; x1 += PAD; y0 = Math.max(0, y0 - PAD); y1 = Math.min(H, y1 + PAD);
    if (x1 - x0 >= W) { x0 = 0; x1 = W; }
    patch(x0, y0, x1, y1);
  }

  // ---------- vector coast (marching squares per edited cluster) ----------
  function contours(rect, which) {
    const f = field(rect.x0, rect.y0, rect.x1, rect.y1), s = f[which], w = f.w, h = f.h, segs = new Map(), out = [];
    const ek = (x, y, v) => (y * w + x) * 2 + v;                          // v 0: edge (x,y)-(x+1,y); v 1: edge (x,y)-(x,y+1)
    const pt = (x, y, v) => { const a = s[y * w + x], b = v ? s[(y + 1) * w + x] : s[y * w + x + 1], t = a / (a - b); return v ? [x, y + t] : [x + t, y]; };
    for (let y = 0; y < h - 1; y++) for (let x = 0; x < w - 1; x++) {
      const tl = s[y * w + x], tr = s[y * w + x + 1], bl = s[(y + 1) * w + x], br = s[(y + 1) * w + x + 1];
      const E = []; if ((tl < 0) !== (tr < 0)) E.push('T'); if ((tr < 0) !== (br < 0)) E.push('R'); if ((bl < 0) !== (br < 0)) E.push('B'); if ((tl < 0) !== (bl < 0)) E.push('L');
      if (!E.length) continue;
      const key = { T: ek(x, y, 0), B: ek(x, y + 1, 0), L: ek(x, y, 1), R: ek(x + 1, y, 1) }, P = { T: pt(x, y, 0), B: pt(x, y + 1, 0), L: pt(x, y, 1), R: pt(x + 1, y, 1) };
      let pairs; if (E.length === 2) pairs = [[E[0], E[1]]]; else pairs = ((tl + tr + bl + br) / 4 < 0) === (tl < 0) ? [['T', 'R'], ['B', 'L']] : [['T', 'L'], ['B', 'R']];
      for (const [p, q] of pairs) {
        const corner = ({ TL: [tl, 0, 0], TR: [tr, 1, 0], BR: [br, 1, 1], BL: [bl, 0, 1] })[{ TL: 'TL', LT: 'TL', TR: 'TR', RT: 'TR', BR: 'BR', RB: 'BR', BL: 'BL', LB: 'BL', TB: 'TL', BT: 'TL', LR: 'TL', RL: 'TL' }[p + q]];
        const A = P[p], B = P[q], dx = B[0] - A[0], dy = B[1] - A[1];
        const cx = x + corner[1], cy = y + corner[2], right = (cx - A[0]) * -dy + (cy - A[1]) * dx > 0;
        const land = corner[0] < 0;
        const fwd = right === land;
        const a = fwd ? [key[p], A, key[q], B] : [key[q], B, key[p], A];
        segs.set(a[0], { to: a[2], a: a[1], b: a[3] });
      }
    }
    const used = new Set(), start = new Set(); for (const k of segs.keys()) start.add(k);
    const ends = new Set(); for (const sg of segs.values()) ends.add(sg.to);
    const run = (k0) => { const line = []; let k = k0; while (segs.has(k) && !used.has(k)) { used.add(k); const sg = segs.get(k); line.push(sg.a); if (!segs.has(sg.to) || used.has(sg.to)) line.push(sg.b); k = sg.to; } return line; };
    for (const k of start) if (!ends.has(k)) { const l = run(k); if (l.length > 1) out.push(l); }       // open pieces first (they leave the rectangle)
    for (const k of start) if (!used.has(k)) { const l = run(k); if (l.length > 2) out.push(l); }        // then closed loops
    return out.map((l) => l.map(([x, y]) => [rect.x0 + x, rect.y0 + y]));
  }
  function rebuildCoast() {
    const base = baseCoast || (baseCoast = getCoast()); if (!base) return;
    const T = 64, TX = Math.ceil(W / T), TY = Math.ceil(H / T), dirtyT = new Uint8Array(TX * TY);
    for (let y = 0; y < H; y++) { const row = y * W, ty = (y / T) | 0; for (let x = 0; x < W; x++) if (delta[row + x]) dirtyT[ty * TX + ((x / T) | 0)] = 1; }
    const grown = new Uint8Array(dirtyT.length);
    for (let ty = 0; ty < TY; ty++) for (let tx = 0; tx < TX; tx++) if (dirtyT[ty * TX + tx]) for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const yy = ty + a; if (yy >= 0 && yy < TY) grown[yy * TX + ((tx + b + TX) % TX)] = 1; }
    const seen = new Uint8Array(grown.length), rects = [];
    for (let i = 0; i < grown.length; i++) {
      if (!grown[i] || seen[i]) continue;
      const cells = [], st = [i]; seen[i] = 1;
      while (st.length) { const c = st.pop(); cells.push(c); const cx = c % TX, cy = (c / TX) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = (cx + dx + TX) % TX, ny = cy + dy; if (ny < 0 || ny >= TY) continue; const n = ny * TX + nx; if (grown[n] && !seen[n]) { seen[n] = 1; st.push(n); } } }
      const cols = cells.map((c) => c % TX), rowsC = cells.map((c) => (c / TX) | 0), wraps = cols.includes(0) && cols.includes(TX - 1);
      const cc = wraps ? cols.map((c) => (c > TX / 2 ? c - TX : c)) : cols;
      let x0 = Math.min(...cc) * T, x1 = (Math.max(...cc) + 1) * T; if (x1 - x0 >= W) { x0 = 0; x1 = W; }
      rects.push({ x0, x1, y0: Math.min(...rowsC) * T, y1: Math.min(H, (Math.max(...rowsC) + 1) * T) });
    }
    if (!rects.length) { onCoast(base, base); return; }
    const toRad = (line) => {                                              // pixel polyline -> radian pieces, split where it crosses the seam
      const outs = []; let cur = [], prevLon = null;
      for (const [x, y] of line) {
        const lon = (wx(x + 0.5) / W * 360 - 180) * DEG, lat = (90 - (y + 0.5) / H * 180) * DEG;
        if (prevLon !== null && Math.abs(lon - prevLon) > Math.PI) { if (cur.length > 2) outs.push(Float64Array.from(cur)); cur = []; }
        cur.push(lon, lat); prevLon = lon;
      }
      if (cur.length > 2) outs.push(Float64Array.from(cur)); return outs;
    };
    const inside = (lon, lat) => { const x = (lon / DEG + 180) / 360 * W, y = (90 - lat / DEG) / 180 * H; return rects.some((q) => { if (y < q.y0 || y >= q.y1) return false; let xx = x; if (xx < q.x0) xx += W; if (xx >= q.x1 + W) xx -= W; return xx >= q.x0 && xx < q.x1; }); };
    // 1) shown coast (ink only, may be open pieces): base lines minus the edited areas, plus the new contour inside them
    const shown = [];
    for (const p of base) {
      let cur = [];
      for (let i = 0; i < p.length; i += 2) { if (inside(p[i], p[i + 1])) { if (cur.length > 2) shown.push(Float64Array.from(cur)); cur = []; } else cur.push(p[i], p[i + 1]); }
      if (cur.length > 2) shown.push(cur.length === p.length ? p : Float64Array.from(cur));
    }
    for (const q of rects) for (const line of contours(q, 's')) shown.push(...toRad(line));
    // 2) editor coast (clipping, snapping, areas): the untouched original plus closed rings for NEW land only, so existing countries never change
    let forEditor = base;
    if (delta.includes(1)) { forEditor = base.slice(); for (const q of rects) for (const line of contours(q, 'n')) forEditor.push(...toRad(line)); }
    onCoast(shown, forEditor);
  }
  const scheduleCoast = () => { clearTimeout(coastT); coastT = setTimeout(() => { try { rebuildCoast(); } catch (e) { console.warn('coast rebuild failed', e); } }, 250); };

  // ---------- painting ----------
  function stamp(px, py, rx, ry, val) {
    const y0 = Math.max(0, Math.floor(py - ry)), y1 = Math.min(H - 1, Math.ceil(py + ry)), xa = Math.floor(px - rx), xb = Math.ceil(px + rx);
    for (let y = y0; y <= y1; y++) {
      const dy = (y + 0.5 - py) / ry, rem = 1 - dy * dy; if (rem < 0) continue; const hw = Math.sqrt(rem) * rx;
      for (let x = Math.ceil(px - hw - 0.5); x <= Math.floor(px + hw - 0.5); x++) delta[y * W + wx(x)] = val;
    }
    if (!dirty) dirty = { x0: xa, x1: xb + 1, y0, y1: y1 + 1 };
    else { dirty.x0 = Math.min(dirty.x0, xa); dirty.x1 = Math.max(dirty.x1, xb + 1); dirty.y0 = Math.min(dirty.y0, y0); dirty.y1 = Math.max(dirty.y1, y1 + 1); }
  }
  function stampAt(sx, sy, val) {
    const c = fromScreen(sx, sy), e = fromScreen(sx + r, sy), n = fromScreen(sx, sy - r); if (!c || !e || !n) return false;
    let px = (c[0] + 180) / 360 * W; if (stroke.px !== null) { while (px - stroke.px > W / 2) px -= W; while (stroke.px - px > W / 2) px += W; } stroke.px = px;
    const dl = Math.abs(((e[0] - c[0] + 540) % 360) - 180), rx = Math.max(1, dl / 360 * W), ry = Math.max(1, Math.abs(n[1] - c[1]) / 180 * H);
    stamp(px, (90 - c[1]) / 180 * H, rx, ry, val); return true;
  }
  function flush() {
    raf = 0; if (!dirty) return; const d = dirty; dirty = null; patchRect(d.x0, d.y0, d.x1, d.y1);
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(flush); };

  function down(sx, sy, shift) {
    if (!ready || !delta) { ensure().then(() => say('Land data ready - drag to paint.')).catch((e) => say(String(e.message || e))); say('Loading land data…'); return true; }
    store.edit((all) => { if (!all.some((f) => f.id === LAND_ID)) all.push({ id: LAND_ID, kind: 'label', text: 'land', lon: 0, lat: 0, size: 18, rotation: 0, spacing: 4, life: { from: null, to: null }, notes: '' }); });
    stroke = { val: erase !== !!shift ? 2 : 1, px: null, last: [sx, sy] };
    if (stampAt(sx, sy, stroke.val)) queue(); return true;
  }
  function move(sx, sy) {
    cursor = [sx, sy]; requestRender();
    if (!stroke) return;
    const dx = sx - stroke.last[0], dy = sy - stroke.last[1], n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / Math.max(2, r / 3)));
    for (let i = 1; i <= n; i++) stampAt(stroke.last[0] + dx * i / n, stroke.last[1] + dy * i / n, stroke.val);
    stroke.last = [sx, sy]; queue();
  }
  function up() {
    if (!stroke) return; stroke = null; flush();
    const f = feature(), notes = encode(); lastNotes = notes;
    if (f) store.live(() => { f.notes = notes; });
    scheduleCoast();
  }

  // ---------- follow undo / redo / open ----------
  async function sync() {
    const f = feature(), notes = f ? f.notes || '' : '';
    if (notes === lastNotes) return;
    if (!notes && !delta) { lastNotes = notes; return; }
    await ensure(); if (stroke) return;
    const next = decode(notes); let x0 = W, x1 = -1, y0 = H, y1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0, o = y * W; x < W; x++) if (next[o + x] !== delta[o + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    delta = next; lastNotes = notes; if (x1 < 0) return;
    patchRect(x0, y0, x1 + 1, y1 + 1); scheduleCoast();
  }
  store.on((t) => { if (t === 'change') sync().catch((e) => console.warn('land sync failed', e)); });
  window.addEventListener('keydown', (e) => {
    if (!active || e.target.closest && e.target.closest('input,textarea,select')) return;
    if (e.key === '[') { r = Math.max(4, r - 4); requestRender(); } else if (e.key === ']') { r = Math.min(120, r + 4); requestRender(); }
    else if ((e.key === 'e' || e.key === 'E') && !e.ctrlKey && !e.metaKey) { erase = !erase; say(erase ? 'Land eraser: drag to carve water (Shift adds land).' : 'Land brush: drag to add land (Shift erases).'); requestRender(); }
    else if (e.key === 'Escape') setActive(false);
  });

  function setActive(on) {
    on = !!on; if (on === active) return; active = on; cursor = null; stroke = null;
    if (on) { ensure().catch((e) => say(String(e.message || e))); say('Land: drag to add land, Shift (or E) to erase, [ ] sets the size. Esc to leave.'); }
    onActive && onActive(on); requestRender();
  }
  function draw(ctx) {
    if (!active || !cursor) return;
    ctx.save(); ctx.beginPath(); ctx.arc(cursor[0], cursor[1], r, 0, 7); ctx.lineWidth = 2;
    const er = stroke ? stroke.val === 2 : erase; ctx.strokeStyle = er ? '#c44830' : '#2f6f94'; ctx.fillStyle = er ? 'rgba(196,72,48,.12)' : 'rgba(47,111,148,.12)'; ctx.fill(); ctx.stroke(); ctx.restore();
  }
  return { get active() { return active; }, get erase() { return erase; }, setActive, down, move, up, draw, sync, repaint: patchRect, ready: ensure, leave() { cursor = null; requestRender(); } };
}
