// Country colours: a big palette, random fresh colours on top of it, and a picker that keeps a new country
// clearly different from the countries it touches. Pure functions, no DOM, no editor state.

// The original 8 colours first (kept so old maps look the same), then 28 more, then random ones are generated on demand.
export const COUNTRY_PALETTE = [
  '#d98c8c', '#8cb4d9', '#d9c88c', '#9fd08c', '#c79bd9', '#8cd9c8', '#d9a98c', '#a9b0d9',
  '#fcaa96', '#b88b80', '#d1825d', '#f1b178', '#ba8e4c', '#a59564', '#939c4e', '#b8c576', '#8a9b7a', '#73a26a',
  '#a7c6a8', '#40a77e', '#6cb098', '#61d2ad', '#06c5bf', '#64a0a2', '#16d0ed', '#03a4be', '#8dc8d5', '#11afe7',
  '#6797e0', '#a9a9f6', '#a28fb0', '#ca7cb5', '#bd85a6', '#f393be', '#dfb2c6', '#dc7790',
];

export const NEIGHBOUR_MIN_DE = 30;      // a new country's colour should differ from every neighbour's by at least this much (CIE76 delta E)
export const CLASH_DE = 20;              // an existing country below this against a neighbour counts as "too similar" and may be recoloured
export const NEIGHBOUR_TOL_DEG = 1;      // outlines closer than this (degrees, ~110 km) count as neighbours

// ---- colour maths (sRGB hex -> CIELAB) ----
const norm = (hex) => {
  if (typeof hex !== 'string') return '#808080';
  if (/^#[0-9a-f]{3}$/i.test(hex)) return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#808080';
};
const labCache = new Map();
export function hexLab(hex) {
  const h = norm(hex).toLowerCase(); let v = labCache.get(h); if (v) return v;
  const lin = (i) => { const c = parseInt(h.slice(i, i + 2), 16) / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const r = lin(1), g = lin(3), b = lin(5);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  v = [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
  if (labCache.size > 2000) labCache.clear();
  labCache.set(h, v); return v;
}
export function colorDistance(a, b) { const p = hexLab(a), q = hexLab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }

function hslHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60) % 6];
  return '#' + [r, g, b].map((u) => Math.round((u + m) * 255).toString(16).padStart(2, '0')).join('');
}
/** a random pastel in the same family as the palette (so it looks right with the theme's saturation boost); never a grey, never too dark or too light */
export function randomCandidate(rand = Math.random) {
  for (let i = 0; i < 12; i++) {
    const hex = hslHex(rand() * 360, 0.4 + 0.22 * rand(), 0.6 + 0.14 * rand()), lab = hexLab(hex), C = Math.hypot(lab[1], lab[2]);
    if (lab[0] >= 62 && lab[0] <= 84 && C >= 20 && C <= 46) return hex;
  }
  return COUNTRY_PALETTE[Math.floor(rand() * COUNTRY_PALETTE.length)];
}

/** the smallest distance from `hex` to any colour of `list` (Infinity for an empty list) */
export function nearestDistance(hex, list) { let m = Infinity; for (const c of list) { const d = colorDistance(hex, c); if (d < m) m = d; } return m; }

/** Picks a colour for a country.
 *  neighbours: the colours of the countries it touches. used: the colours of all other countries (so the pick looks unlike what is already on the map).
 *  Colours that clear NEIGHBOUR_MIN_DE against every neighbour always beat the ones that do not; among them, the colour least like any colour
 *  already in use wins, with a random nudge so the result is not always the same. If nothing clears the bar, the colour furthest from the neighbours wins. */
export function pickCountryColor({ neighbours = [], used = [], rand = Math.random } = {}) {
  const pool = COUNTRY_PALETTE.slice();
  for (let i = 0; i < 36; i++) pool.push(randomCandidate(rand));
  let best = null, bestScore = -Infinity;
  for (const c of pool) {
    const near = nearestDistance(c, neighbours), far = used.length ? nearestDistance(c, used) : 60;
    const score = near >= NEIGHBOUR_MIN_DE ? 1000 + Math.min(far, 40) + rand() * 14 : Math.min(near, NEIGHBOUR_MIN_DE) + Math.min(far, 40) * 0.01;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best;
}

// ---- neighbour detection on [lon, lat] rings in degrees ----
const wrapDeg = (d) => ((d + 540) % 360 + 360) % 360 - 180;
const latBand = (r) => { let lo = 91, hi = -91; for (const p of r) { if (p[1] < lo) lo = p[1]; if (p[1] > hi) hi = p[1]; } return [lo, hi]; };
/** does any vertex of P lie within `tol` degrees of the outline of Q? (longitude wraps at the antimeridian, a degree of longitude shrinks with latitude) */
function vertexNear(P, Q, tol) {
  const [q0, q1] = latBand(Q), D = Math.PI / 180;
  for (const p of P) {
    if (p[1] < q0 - tol || p[1] > q1 + tol) continue;
    const cs = Math.max(0.05, Math.cos(p[1] * D));
    for (let i = 0; i < Q.length; i++) {
      const a = Q[i], b = Q[(i + 1) % Q.length];
      if (p[1] < Math.min(a[1], b[1]) - tol || p[1] > Math.max(a[1], b[1]) + tol) continue;
      const dx = wrapDeg(b[0] - a[0]) * cs, dy = b[1] - a[1], px = wrapDeg(p[0] - a[0]) * cs, py = p[1] - a[1], L = dx * dx + dy * dy;
      const t = L ? Math.max(0, Math.min(1, (px * dx + py * dy) / L)) : 0;
      if (Math.hypot(px - t * dx, py - t * dy) <= tol) return true;
    }
  }
  return false;
}
/** do the outlines A and B touch, or come within `tol` degrees of each other? */
export function ringsNear(A, B, tol = NEIGHBOUR_TOL_DEG) {
  if (!A || !B || A.length < 3 || B.length < 3) return false;
  const [a0, a1] = latBand(A), [b0, b1] = latBand(B);
  if (a1 + tol < b0 || b1 + tol < a0) return false;                  // no shared latitude band: cannot be neighbours
  return vertexNear(A, B, tol) || vertexNear(B, A, tol);
}
