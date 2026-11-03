// Curved, letter-spaced names set along the long axis of a country / range (Batch 9). Pure: no DOM, no canvas.
//
//   spineOf(ring)        lon/lat outline -> a smooth centre line + thickness profile (view independent, cached by the editor
//                        until the shape changes)
//   layoutName(...)      screen-space spine + glyph widths -> font size, letter spacing and one position/angle per glyph
//
// The spine is found on a coarse raster of the outline in a local plane (x = lon*cos(lat), y = lat, unwrapped around the
// first vertex like labelAnchor): distance transform -> principal axis -> per-station ridge -> longest run that is still
// "thick enough" -> quadratic fit (kept only if it stays inside the shape).

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const wrap = (d) => ((d + 540) % 360 + 360) % 360 - 180;

export function spineOf(ring, { cells = 72, samples = 28 } = {}) {
  if (!ring || ring.length < 3) return null;
  const lon0 = ring[0][0];
  let y0 = 1e9, y1 = -1e9;
  const un = ring.map(([lo, la]) => { y0 = Math.min(y0, la); y1 = Math.max(y1, la); return [wrap(lo - lon0), la]; });
  const cosLat = Math.max(0.05, Math.cos(((y0 + y1) / 2) * DEG));
  const P = un.map(([x, y]) => [x * cosLat, y]);
  let X0 = 1e9, X1 = -1e9, Y0 = 1e9, Y1 = -1e9;
  for (const [x, y] of P) { X0 = Math.min(X0, x); X1 = Math.max(X1, x); Y0 = Math.min(Y0, y); Y1 = Math.max(Y1, y); }
  const cell = Math.max(X1 - X0, Y1 - Y0) / cells;
  if (!(cell > 0)) return null;
  const nx = Math.ceil((X1 - X0) / cell) + 3, ny = Math.ceil((Y1 - Y0) / cell) + 3, ox = X0 - cell, oy = Y0 - cell;

  // 1. scanline raster of the outline (cell centres)
  const mask = new Uint8Array(nx * ny), n = P.length;
  for (let j = 0; j < ny; j++) {
    const yc = oy + (j + 0.5) * cell, xs = [];
    for (let i = 0, k = n - 1; i < n; k = i++) {
      const a = P[k], b = P[i];
      if ((a[1] > yc) !== (b[1] > yc)) xs.push(a[0] + ((yc - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.max(0, Math.ceil((xs[k] - ox) / cell - 0.5)), i1 = Math.min(nx - 1, Math.floor((xs[k + 1] - ox) / cell - 0.5));
      for (let i = i0; i <= i1; i++) mask[j * nx + i] = 1;
    }
  }

  // 2. chamfer (3-4) distance to the nearest outside cell, in cells
  const D = new Float32Array(nx * ny);
  for (let q = 0; q < D.length; q++) D[q] = mask[q] ? 1e9 : 0;
  const at = (i, j) => (i < 0 || j < 0 || i >= nx || j >= ny ? 0 : D[j * nx + i]);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const q = j * nx + i; if (!D[q]) continue;
    D[q] = Math.min(D[q], at(i - 1, j) + 3, at(i, j - 1) + 3, at(i - 1, j - 1) + 4, at(i + 1, j - 1) + 4);
  }
  for (let j = ny - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) {
    const q = j * nx + i; if (!D[q]) continue;
    D[q] = Math.min(D[q], at(i + 1, j) + 3, at(i, j + 1) + 3, at(i + 1, j + 1) + 4, at(i - 1, j + 1) + 4);
  }
  for (let q = 0; q < D.length; q++) D[q] /= 3;

  // 3. principal axis of the filled cells (horizontal when the shape is roughly round)
  let cnt = 0, mx = 0, my = 0;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (mask[j * nx + i]) { cnt++; mx += ox + (i + 0.5) * cell; my += oy + (j + 0.5) * cell; }
  if (cnt < 6) return null;
  mx /= cnt; my /= cnt;
  let sxx = 0, syy = 0, sxy = 0;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (mask[j * nx + i]) {
    const dx = ox + (i + 0.5) * cell - mx, dy = oy + (j + 0.5) * cell - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy;
  }
  const half = (sxx + syy) / 2, rad = Math.hypot((sxx - syy) / 2, sxy), l1 = half + rad, l2 = Math.max(1e-12, half - rad);
  let th = l1 / l2 < 1.3 ? 0 : 0.5 * Math.atan2(2 * sxy, sxx - syy);
  let ct = Math.cos(th), st = Math.sin(th);
  if (ct < -1e-9 || (Math.abs(ct) <= 1e-9 && st < 0)) { ct = -ct; st = -st; th += Math.PI; }        // always read left to right (bottom to top when vertical)
  const MAXROT = 38 * DEG;                                                                         // a blob is never set steeper than 38 deg; only clearly elongated shapes (variance ratio >= 5, about 2.2:1) keep a steep axis
  if (Math.abs(th) > MAXROT && l1 / l2 < 5) { th = Math.sign(th) * MAXROT; ct = Math.cos(th); st = Math.sin(th); }

  // 4. stations along the axis: ridge position and thickness
  let u0 = 1e9, u1 = -1e9;
  const uOf = (x, y) => (x - mx) * ct + (y - my) * st, vOf = (x, y) => -(x - mx) * st + (y - my) * ct;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (mask[j * nx + i]) { const u = uOf(ox + (i + 0.5) * cell, oy + (j + 0.5) * cell); u0 = Math.min(u0, u); u1 = Math.max(u1, u); }
  const K = Math.max(6, Math.min(80, Math.round((u1 - u0) / (cell * 1.5)))), bw = (u1 - u0) / K;
  if (!(bw > 0)) return null;
  const ridgeV = new Float64Array(K), thick = new Float64Array(K), best = new Float64Array(K);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const q = j * nx + i; if (!mask[q]) continue;
    const x = ox + (i + 0.5) * cell, y = oy + (j + 0.5) * cell, k = Math.min(K - 1, Math.floor((uOf(x, y) - u0) / bw));
    if (D[q] > best[k]) { best[k] = D[q]; ridgeV[k] = vOf(x, y); }
  }
  let tMax = 0;
  for (let k = 0; k < K; k++) { thick[k] = Math.max(0, 2 * (best[k] - 0.5)) * cell; tMax = Math.max(tMax, thick[k]); }
  if (tMax <= 0) return null;

  // 5. longest run of stations that are still thick enough
  const thr = 0.3 * tMax;
  let rs = -1, rl = 0, cs = -1;
  for (let k = 0; k <= K; k++) {
    if (k < K && thick[k] >= thr) { if (cs < 0) cs = k; }
    else if (cs >= 0) { if (k - cs > rl) { rl = k - cs; rs = cs; } cs = -1; }
  }
  if (rl < 3) return null;
  const re = rs + rl - 1, ua = u0 + rs * bw, ub = u0 + (re + 1) * bw;

  // 6. smooth centre line v(u): quadratic (then linear) fit weighted by thickness; fall back to the raw ridge
  const centre = (k) => u0 + (k + 0.5) * bw;
  const sampleU = (s) => ua + ((ub - ua) * s) / (samples - 1);
  const ridgeAt = (u) => {
    const f = Math.min(re, Math.max(rs, (u - u0) / bw - 0.5)), a = Math.floor(f), b = Math.min(re, a + 1);
    return [ridgeV[a] + (ridgeV[b] - ridgeV[a]) * (f - a), thick[a] + (thick[b] - thick[a]) * (f - a)];
  };
  const inside = (u, v) => {
    const x = mx + u * ct - v * st, y = my + u * st + v * ct, i = Math.floor((x - ox) / cell), j = Math.floor((y - oy) / cell);
    return i >= 0 && j >= 0 && i < nx && j < ny && D[j * nx + i] >= 1;
  };
  const fit = (deg) => {
    const m = deg + 1, A = Array.from({ length: m }, () => new Array(m + 1).fill(0)), mid = (ua + ub) / 2, sc = (ub - ua) / 2 || 1;
    for (let k = rs; k <= re; k++) {
      const t = (centre(k) - mid) / sc, w = thick[k], pw = [1, t, t * t].slice(0, m);
      for (let a = 0; a < m; a++) { for (let b = 0; b < m; b++) A[a][b] += w * pw[a] * pw[b]; A[a][m] += w * pw[a] * ridgeV[k]; }
    }
    for (let c = 0; c < m; c++) {                                                        // Gaussian elimination
      let p = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (Math.abs(A[p][c]) < 1e-12) return null;
      [A[c], A[p]] = [A[p], A[c]];
      for (let r = 0; r < m; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let b = c; b <= m; b++) A[r][b] -= f * A[c][b]; }
    }
    const co = A.map((r, i) => r[m] / r[i]);
    return (u) => { const t = (u - mid) / sc; return co[0] + (m > 1 ? co[1] * t : 0) + (m > 2 ? co[2] * t * t : 0); };
  };
  const vs = [];
  let vfun = null;
  const bend = (f) => Math.abs(Math.atan((f(ub) - f((ua + ub) / 2)) / ((ub - ua) / 2)) - Math.atan((f((ua + ub) / 2) - f(ua)) / ((ub - ua) / 2)));   // total turn of the line (rad)
  const resid = (f) => { let e = 0, w = 0; for (let k = rs; k <= re; k++) { e += thick[k] * (f(centre(k)) - ridgeV[k]) ** 2; w += thick[k]; } return Math.sqrt(e / w); };
  const allIn = (f) => { for (let s = 0; s < samples; s++) { const u = sampleU(s); if (!inside(u, f(u))) return false; } return true; };     // every sample of the line lies inside the shape
  const calm = (f) => Math.abs(Math.atan((f(ub) - f(ua)) / (ub - ua))) < 14 * DEG;                                                               // the line may not swing more than 14 deg away from the axis, so a blob never gets a near-vertical name
  const lin = fit(1);
  if (lin && calm(lin) && resid(lin) < 0.1 * tMax && allIn(lin)) vfun = lin;
  if (!vfun) {                                                                                       // the shape really arches: allow a gentle curve (at most ~40 deg of turn)
    const q = fit(2);
    if (q && calm(q) && bend(q) < 40 * DEG && allIn(q)) vfun = q;
  }
  if (!vfun) { const l0 = fit(0); if (l0 && allIn(l0)) vfun = l0; }                                  // straight, parallel to the axis, through the weighted middle of the ridge
  if (!vfun && lin && calm(lin) && allIn(lin)) vfun = lin;
  const th_ = [];
  for (let s = 0; s < samples; s++) { const u = sampleU(s), [rv, t] = ridgeAt(u); vs.push(vfun ? vfun(u) : rv); th_.push(t); }
  if (!vfun) for (let pass = 0; pass < 6; pass++) for (let s = 1; s < samples - 1; s++) vs[s] = (vs[s - 1] + vs[s] + vs[s + 1]) / 3;
  if (!vfun) for (let s = 0; s < samples; s++) { const u = sampleU(s); if (!inside(u, vs[s])) vs[s] = ridgeAt(u)[0]; }   // smoothing must never leave the shape
  const tf = th_.map((t, s) => Math.min(t, th_[Math.max(0, s - 1)], th_[Math.min(samples - 1, s + 1)]));      // pinch-safe thickness

  const loc = [], pts = [];
  for (let s = 0; s < samples; s++) {
    const u = sampleU(s), x = mx + u * ct - vs[s] * st, y = my + u * st + vs[s] * ct;
    loc.push([x, y]); pts.push([wrap(x / cosLat + lon0), y]);
  }
  let len = 0; for (let s = 1; s < samples; s++) len += Math.hypot(loc[s][0] - loc[s - 1][0], loc[s][1] - loc[s - 1][1]);
  return { pts, loc, thick: tf, len, angle: th };
}

/** Screen thickness (px) per spine sample: local thickness times the local px-per-unit ratio of the projection. */
export function thicknessPx(sc, sp) {
  const n = sc.length, out = new Array(n);
  let last = 1;
  for (let i = 0; i < n; i++) {
    const j = i < n - 1 ? i : i - 1, a = sp.loc[j], b = sp.loc[j + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d > 0) last = Math.hypot(sc[j + 1][0] - sc[j][0], sc[j + 1][1] - sc[j][1]) / d;
    out[i] = sp.thick[i] * last;
  }
  return out;
}

/**
 * Lay a name out along a screen-space polyline.
 *   sc       [[x, y], ...] spine in screen px      thick  thickness in px per sample
 *   adv      glyph advances in em (font size 1)     chars  the characters (same length as adv)
 *   opt      { minSize, maxSize, fill (share of the spine used), maxSpace (em), baseSpace (em), thickShare }
 * Returns { size, spacing, glyphs: [{ ch, x, y, a }] } or null when it cannot be set legibly.
 */
export function layoutName(sc, thick, chars, adv, opt = {}) {
  const { minSize = 9, maxSize = 56, fill = 0.9, maxSpace = 0.45, baseSpace = 0.1, thickShare = 0.4, compact = false, shift = 0, shrink = 1 } = opt;
  const n = chars.length; if (n === 0 || sc.length < 2) return null;
  let P = sc, T = thick;
  const dxs = P[P.length - 1][0] - P[0][0], dys = P[P.length - 1][1] - P[0][1];
  const steep = Math.abs(dxs) < 0.2 * Math.abs(dys);                                         // more than ~79 deg from horizontal
  if (steep ? dys > 0 : dxs < 0) { P = P.slice().reverse(); T = T.slice().reverse(); }       // never upside down; a steep name always reads bottom to top, so every steep name on the map turns the same way
  const minEff = minSize + (Math.atan2(Math.abs(dys), Math.abs(dxs)) > 0.87 ? 3 : 0);       // a name steeper than ~50 deg must be a little bigger to stay readable
  const cum = [0];
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = cum[cum.length - 1];
  if (!(L > 1)) return null;
  const tmax = Math.max(...T), sorted = T.filter((t) => t >= 0.5 * tmax).sort((a, b) => a - b);          // the size follows the body of the shape, not a thin tail
  const tp = sorted[Math.floor((sorted.length - 1) * 0.25)];
  const sum = adv.reduce((a, b) => a + b, 0), spaces = chars.filter((c) => c === ' ').length, gaps = Math.max(0, n - 1) + spaces;
  // The text may only sit where the shape is wide enough for the letters: the longest stretch of the spine whose thickness
  // is at least `need` x the font size. (Before, the whole spine was used, so a name ran out over the sea along a thin
  // peninsula or into the neighbour.) If the name does not fit at this size, the size shrinks until it does.
  const need = 1.05;
  const stretch = (sz) => {
    let best = null, start = -1;
    for (let i = 0; i <= P.length; i++) {
      if (i < P.length && T[i] >= sz * need) { if (start < 0) start = i; }
      else if (start >= 0) { const a = cum[start], b = cum[i - 1]; if (!best || b - a > best.b - best.a) best = { a, b }; start = -1; }
    }
    return best;
  };
  let size = Math.min(maxSize, tp * thickShare) * shrink, run = null;
  for (;;) {
    if (size < minEff) return null;
    run = stretch(size);
    if (run && size * (sum + baseSpace * gaps) <= (run.b - run.a) * fill) break;
    size *= 0.93;
  }
  const avail = (run.b - run.a) * fill;
  const spacing = !gaps ? 0 : compact ? size * baseSpace : Math.max(size * baseSpace, Math.min(size * maxSpace, (avail - size * sum) / gaps));   // compact: tight letters, which leaves slack to slide the name along the spine
  const total = size * sum + spacing * gaps;
  const pos = (s) => {                                                                    // point + segment angle at arc length s
    s = Math.min(L, Math.max(0, s));
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
    const seg = cum[hi] - cum[lo] || 1, t = (s - cum[lo]) / seg;
    return [P[lo][0] + (P[hi][0] - P[lo][0]) * t, P[lo][1] + (P[hi][1] - P[lo][1]) * t];
  };
  const glyphs = [];
  let s = run.a + ((run.b - run.a - total) / 2) * (1 + Math.max(-1, Math.min(1, shift)));          // shift: -1 = at the start of the usable stretch, 0 = centred, 1 = at its end
  for (let k = 0; k < n; k++) {
    const w = adv[k] * size, mid = s + w / 2;
    if (chars[k] !== ' ') {
      const h = Math.max(w / 2, size * 1.2), a = pos(mid - h), b = pos(mid + h), c = pos(mid);
      glyphs.push({ ch: chars[k], x: c[0], y: c[1], a: Math.atan2(b[1] - a[1], b[0] - a[0]), w });      // w: the letter's advance in px (the collision boxes use it)
    }
    s += w + spacing + (chars[k] === ' ' ? spacing : 0);
  }
  steadyAngles(glyphs);
  return { size, spacing, glyphs };
}

/** The ways a name may be set, in order of preference. Variant 0 is the design (letters spread along the spine); the others are only
 *  tried when variant 0 would lie on other text: tight letters centred, tight letters slid along the spine, then smaller. */
export const NAME_VARIANTS = [
  {},
  { compact: true },
  { compact: true, shift: -0.75 },
  { compact: true, shift: 0.75 },
  { compact: true, shrink: 0.8 },
  { compact: true, shrink: 0.8, shift: -0.75 },
  { compact: true, shrink: 0.8, shift: 0.75 },
];

/** Keeps the baseline calm: neighbouring letters may not turn sharply and no letter may lean far from the name's mean direction
 *  (a name set along an arm or a notch used to end with one letter standing on its head). Only the angles change, never the positions. */
function steadyAngles(gl, maxLean = 0.6, maxStep = 0.24) {
  const m = gl.length; if (m < 3) return;
  const A = new Array(m); A[0] = gl[0].a;
  for (let i = 1; i < m; i++) { let d = gl[i].a - gl[i - 1].a; d -= TAU * Math.round(d / TAU); A[i] = A[i - 1] + d; }          // unwrapped: no jump at +-pi
  for (let pass = 0; pass < 2; pass++) {                                                                                      // two light smoothing passes (a straight or evenly curved name is left as it is)
    const B = A.slice();
    for (let i = 1; i < m - 1; i++) B[i] = 0.25 * A[i - 1] + 0.5 * A[i] + 0.25 * A[i + 1];
    B[0] = 0.65 * A[0] + 0.35 * A[1]; B[m - 1] = 0.65 * A[m - 1] + 0.35 * A[m - 2];
    for (let i = 0; i < m; i++) A[i] = B[i];
  }
  let mean = 0; for (let i = 0; i < m; i++) mean += A[i]; mean /= m;
  for (let i = 0; i < m; i++) A[i] = Math.max(mean - maxLean, Math.min(mean + maxLean, A[i]));                                  // at most ~34 deg from the mean direction
  for (let i = 1; i < m; i++) A[i] = Math.max(A[i - 1] - maxStep, Math.min(A[i - 1] + maxStep, A[i]));                          // at most ~14 deg between neighbours, both directions
  for (let i = m - 2; i >= 0; i--) A[i] = Math.max(A[i + 1] - maxStep, Math.min(A[i + 1] + maxStep, A[i]));
  for (let i = 0; i < m; i++) gl[i].a = A[i];
}
