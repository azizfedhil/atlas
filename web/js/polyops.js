// Planar polygon booleans on [lon, lat] rings (degrees). Edges are treated as straight lines in lon/lat, which is
// accurate for the short edges of drawn borders. Segment-classification algorithm: split both outlines at every
// crossing, keep the pieces that lie inside/outside the other polygon, then stitch the kept pieces into rings.
const wrap = (d) => ((d + 540) % 360 + 360) % 360 - 180;
const EPS = 1e-9;
const area2 = (r) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
export const planarArea = (r) => Math.abs(area2(r)) / 2;
const key = (p) => Math.round(p[0] / 1e-7) + ',' + Math.round(p[1] / 1e-7);
const unwrapTo = (ring, ref) => { let prev = ref + wrap(ring[0][0] - ref); return ring.map((p, i) => { const x = i ? prev + wrap(p[0] - prev) : prev; prev = x; return [x, p[1]]; }); };
const ccw = (r) => (area2(r) < 0 ? r.slice().reverse() : r.slice());
function pip(pt, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a[1] > pt[1] !== b[1] > pt[1] && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
const onSeg = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; if (!L) return false;
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L; if (t < -EPS || t > 1 + EPS) return false;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) < 1e-7;
};
/** the ring with extra vertices where it is crossed by / touches the other ring */
function split(A, B) {
  const out = [], nb = B.length, TOL = 1e-6, bb = new Float64Array(4 * nb);
  for (let j = 0; j < nb; j++) {                                      // each B edge's box, once
    const c = B[j], d = B[(j + 1) % nb];
    bb[4 * j] = Math.min(c[0], d[0]) - TOL; bb[4 * j + 1] = Math.min(c[1], d[1]) - TOL;
    bb[4 * j + 2] = Math.max(c[0], d[0]) + TOL; bb[4 * j + 3] = Math.max(c[1], d[1]) + TOL;
  }
  for (let i = 0; i < A.length; i++) {
    const a = A[i], b = A[(i + 1) % A.length], hits = [];
    const ax0 = Math.min(a[0], b[0]), ax1 = Math.max(a[0], b[0]), ay0 = Math.min(a[1], b[1]), ay1 = Math.max(a[1], b[1]);
    for (let j = 0; j < nb; j++) {
      if (ax1 < bb[4 * j] || ax0 > bb[4 * j + 2] || ay1 < bb[4 * j + 1] || ay0 > bb[4 * j + 3]) continue;   // boxes do not meet: no crossing, no touch
      const c = B[j], d = B[(j + 1) % nb];
      const rx = b[0] - a[0], ry = b[1] - a[1], sx = d[0] - c[0], sy = d[1] - c[1], den = rx * sy - ry * sx;
      if (Math.abs(den) > 1e-14) {
        const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den, u = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
        if (t > EPS && t < 1 - EPS && u > -EPS && u < 1 + EPS) hits.push([t, [a[0] + t * rx, a[1] + t * ry]]);
      }
      for (const q of [c, d]) if (onSeg(q, a, b)) { const L = rx * rx + ry * ry, t = ((q[0] - a[0]) * rx + (q[1] - a[1]) * ry) / L; if (t > EPS && t < 1 - EPS) hits.push([t, q]); }
    }
    out.push(a); hits.sort((p, q) => p[0] - q[0]);
    for (const h of hits) if (key(h[1]) !== key(out[out.length - 1])) out.push(h[1]);
  }
  return out;
}
/** 1 inside, 0 outside, 2 on the boundary running the same way, 3 on the boundary running the other way */
function where(m, a, b, P) {
  for (let j = 0; j < P.length; j++) {
    const c = P[j], d = P[(j + 1) % P.length];
    if (onSeg(m, c, d)) return ((b[0] - a[0]) * (d[0] - c[0]) + (b[1] - a[1]) * (d[1] - c[1])) > 0 ? 2 : 3;
  }
  return pip(m, P) ? 1 : 0;
}
function op(ringA, ringB, mode) {
  const ref = ringA[0][0];
  let A = ccw(unwrapTo(ringA, ref)), B = ccw(unwrapTo(ringB, ref));
  A = split(A, B); B = split(B, A);
  const edges = [], add = (a, b) => { if (key(a) !== key(b)) edges.push([a, b]); };
  const walk = (P, Q, isA) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const q of Q) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const w = (m[0] < x0 - 1e-7 || m[0] > x1 + 1e-7 || m[1] < y0 - 1e-7 || m[1] > y1 + 1e-7) ? 0 : where(m, a, b, Q);   // outside Q's box = outside Q
      if (mode === 'union') { if (w === 0 || (w === 2 && isA)) add(a, b); }
      else if (mode === 'inter') { if (w === 1 || (w === 2 && isA)) add(a, b); }
      else if (isA) { if (w === 0 || w === 3) add(a, b); }              // difference A - B
      else if (w === 1) add(b, a);                                       // the part of B's outline inside A, reversed
    }
  };
  walk(A, B, true); walk(B, A, false);
  const next = new Map();
  for (const e of edges) { const k = key(e[0]); if (!next.has(k)) next.set(k, []); next.get(k).push(e); }
  const rings = [];
  for (const e0 of edges) {
    if (e0.used) continue;
    const ring = []; let e = e0;
    for (let guard = 0; e && !e.used && guard < 100000; guard++) {
      e.used = true; ring.push(e[0]);
      if (key(e[1]) === key(e0[0])) { if (ring.length >= 3) rings.push(ring); break; }
      e = (next.get(key(e[1])) || []).find((x) => !x.used);
    }
  }
  return rings.filter((r) => area2(r) > 0).map((r) => r.map((p) => [wrap(p[0]), p[1]]));   // outer pieces only (holes run clockwise)
}
const biggest = (rs) => (rs.length ? rs.reduce((p, q) => (planarArea(q) > planarArea(p) ? q : p)) : null);
/** each returns the largest resulting outline, or null when nothing is left */
export const union = (a, b) => biggest(op(a, b, 'union'));
export const intersect = (a, b) => biggest(op(a, b, 'inter'));
export const subtract = (a, b) => biggest(op(a, b, 'diff'));
export const overlaps = (a, b) => op(a, b, 'inter').some((r) => planarArea(r) > 1e-8);
export const unionRings = (a, b) => op(a, b, 'union');
export const intersectRings = (a, b) => op(a, b, 'inter');                // every piece of a ∩ b (shoreclip.js needs all of them, intersect() keeps only the largest)
export const subtractRings = (a, b) => op(a, b, 'diff');             // every piece of a - b (subtract() keeps only the largest)

const wrapLon = (d) => ((d + 540) % 360 + 360) % 360 - 180;
/** B's outline with each vertex moved onto A where it lies within `tol` degrees: onto a nearby vertex of A, else onto the
 *  nearest point of an A edge. Borders drawn separately then share their edge exactly, so unionRings joins them. */
export function weld(B, A, tol) {
  const near = (p) => {
    let best = null, bd = tol;
    for (const q of A) { const d = Math.hypot(wrapLon(p[0] - q[0]), p[1] - q[1]); if (d <= bd) { bd = d; best = [q[0], q[1]]; } }
    if (best) return best;
    bd = tol;
    for (let i = 0; i < A.length; i++) {
      const a = A[i], b = A[(i + 1) % A.length];
      const dx = wrapLon(b[0] - a[0]), dy = b[1] - a[1], L = dx * dx + dy * dy;
      if (!L) continue;
      const t = Math.max(0, Math.min(1, (wrapLon(p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L));
      const x = a[0] + t * dx, y = a[1] + t * dy, d = Math.hypot(wrapLon(p[0] - x), p[1] - y);
      if (d <= bd) { bd = d; best = [wrapLon(x), y]; }
    }
    return best || p;
  };
  const out = [];
  for (const p of B) { const q = near(p), last = out[out.length - 1]; if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q); }
  const f = out[0], l = out[out.length - 1];
  if (out.length > 1 && f[0] === l[0] && f[1] === l[1]) out.pop();
  return out;
}
