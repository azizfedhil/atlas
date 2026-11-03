// Geometry on a sphere: polygons are rings of [lon, lat] in degrees whose edges are great-circle arcs.
import { DEG } from './projections.js';

export const toVec = (lonDeg, latDeg) => {
  const lo = lonDeg * DEG, la = latDeg * DEG, c = Math.cos(la);
  return [c * Math.cos(lo), c * Math.sin(lo), Math.sin(la)];
};
export const fromVec = (v) => {                                    // radians; accepts non-unit vectors (e.g. a sum of two)
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [Math.atan2(v[1], v[0]), Math.asin(Math.max(-1, Math.min(1, v[2] / n)))];
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const angleBetween = (a, b) => Math.atan2(Math.hypot(...cross(a, b)), dot(a, b));

/** Points along every edge (great-circle), as a flat [lon, lat, lon, lat...] array in RADIANS. */
export function densify(ring, closed = true, stepDeg = 0.5) {
  const out = [], n = ring.length, step = stepDeg * DEG;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = toVec(...ring[i]), b = toVec(...ring[(i + 1) % n]);
    const w = angleBetween(a, b), k = Math.max(1, Math.ceil(w / step));
    for (let j = 0; j < k; j++) {
      let p = a;
      if (j > 0 && w > 1e-9) {
        const t = j / k, s = Math.sin(w), f1 = Math.sin((1 - t) * w) / s, f2 = Math.sin(t * w) / s;
        p = [f1 * a[0] + f2 * b[0], f1 * a[1] + f2 * b[1], f1 * a[2] + f2 * b[2]];
      }
      out.push(...fromVec(p));
    }
  }
  if (!closed) out.push(ring[n - 1][0] * DEG, ring[n - 1][1] * DEG); else out.push(ring[0][0] * DEG, ring[0][1] * DEG);
  return out;
}

/** enclosed area in km^2 (smaller of the two sides of the ring), exact for great-circle edges */
export function ringAreaKm2(ring, radiusKm) {
  const n = ring.length;
  if (n < 3) return 0;
  const vs = ring.map((p) => toVec(...p));
  let r = [0, 0, 0];
  for (const v of vs) r = [r[0] + v[0], r[1] + v[1], r[2] + v[2]];
  const m = Math.hypot(...r);
  r = m < 1e-9 ? [0, 0, 1] : [r[0] / m, r[1] / m, r[2] / m];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const b = vs[i], c = vs[(i + 1) % n];
    sum += 2 * Math.atan2(dot(r, cross(b, c)), 1 + dot(r, b) + dot(b, c) + dot(c, r));   // signed spherical triangle
  }
  let a = Math.abs(sum);
  if (a > 2 * Math.PI) a = 4 * Math.PI - a;
  return a * radiusKm * radiusKm;
}

export function ringPerimeterKm(ring, radiusKm, closed = true) {
  let s = 0;
  const n = ring.length, last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) s += angleBetween(toVec(...ring[i]), toVec(...ring[(i + 1) % n]));
  return s * radiusKm;
}

/** a point to hang a label on: the grid point inside the ring farthest from its edges (in degrees) */
export function labelAnchor(ring) {
  const lon0 = ring[0][0];
  const pts = ring.map(([lo, la]) => [((lo - lon0 + 540) % 360) - 180, la]);           // unwrap around the first vertex
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const cosLat = Math.max(0.05, Math.cos(((y0 + y1) / 2) * DEG));
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const edgeDist = (x, y) => {
    let best = 1e18;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const ax = pts[j][0] * cosLat, ay = pts[j][1], bx = pts[i][0] * cosLat, by = pts[i][1], px = x * cosLat;
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (y - ay) * dy) / L)) : 0;
      best = Math.min(best, Math.hypot(px - (ax + t * dx), y - (ay + t * dy)));
    }
    return best;
  };
  let best = null, bd = -1;
  const N = 28;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const x = x0 + ((x1 - x0) * i) / N, y = y0 + ((y1 - y0) * j) / N;
    if (!inside(x, y)) continue;
    const d = edgeDist(x, y);
    if (d > bd) { bd = d; best = [x, y]; }
  }
  if (!best) best = [(x0 + x1) / 2, (y0 + y1) / 2];
  return [((best[0] + lon0 + 540) % 360) - 180, best[1]];
}
