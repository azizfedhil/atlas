// Pen-tool geometry (Batch 8): cubic Bezier segments between ring vertices, in lon/lat degrees.
// A vertex may carry a handle { i: [dLon, dLat], o: [dLon, dLat] } (offsets of its in/out control points).
// A segment is curved when the first vertex has an `o` handle or the next one has an `i` handle; otherwise it stays
// a great-circle arc exactly as before, so files without handles behave identically.
const wrapDeg = (d) => ((d + 540) % 360 + 360) % 360 - 180;
const nz = (v) => !!v && (Math.abs(v[0]) > 1e-12 || Math.abs(v[1]) > 1e-12);
export const hasOut = (h) => !!h && nz(h.o);
export const hasIn = (h) => !!h && nz(h.i);
export const hasHandle = (h) => hasOut(h) || hasIn(h);
export const segmentCurved = (hs, i, j) => !!hs && (hasOut(hs[i]) || hasIn(hs[j]));
const fix = (p) => [wrapDeg(p[0]), Math.max(-90, Math.min(90, p[1]))];

/** control points [P0, P1, P2, P3] of the segment a -> b (b's longitude unwrapped next to a) */
function ctrl(a, ha, b, hb) {
  const bl = a[0] + wrapDeg(b[0] - a[0]), P3 = [bl, b[1]];
  return [[a[0], a[1]], hasOut(ha) ? [a[0] + ha.o[0], a[1] + ha.o[1]] : [a[0], a[1]], hasIn(hb) ? [bl + hb.i[0], b[1] + hb.i[1]] : P3, P3];
}
const bez = (c, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * c[0][k] + 3 * u * u * t * c[1][k] + 3 * u * t * t * c[2][k] + t * t * t * c[3][k]); };
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];

/** ring with Bezier segments replaced by sampled points (about every 0.4 degrees, 8-64 per segment). Straight segments are left alone. */
export function flattenRing(ring, hs, closed = true) {
  const n = ring.length, out = [], last = closed ? n : n - 1;
  for (let i = 0; i < n; i++) {
    out.push(ring[i]);
    if (i >= last) continue;
    const j = (i + 1) % n;
    if (!segmentCurved(hs, i, j)) continue;
    const c = ctrl(ring[i], hs && hs[i], ring[j], hs && hs[j]);
    let L = 0; for (let k = 1; k < 4; k++) L += Math.hypot(c[k][0] - c[k - 1][0], c[k][1] - c[k - 1][1]);
    const steps = Math.max(8, Math.min(64, Math.ceil(L / 0.4)));
    for (let k = 1; k < steps; k++) out.push(fix(bez(c, k / steps)));
  }
  return out;
}
/** the point halfway along a curved segment (used for the insert handle) */
export const curveMid = (a, ha, b, hb) => fix(bez(ctrl(a, ha, b, hb), 0.5));

/** de Casteljau split at t = 0.5: the new vertex and the updated handles of both neighbours, curve shape unchanged */
export function splitSegment(a, ha, b, hb) {
  const [P0, C0, C1, P3] = ctrl(a, ha, b, hb), Q0 = mid(P0, C0), Q1 = mid(C0, C1), Q2 = mid(C1, P3), R0 = mid(Q0, Q1), R1 = mid(Q1, Q2), S = mid(R0, R1);
  return { pt: fix(S), a: { i: hasIn(ha) ? ha.i : [0, 0], o: sub(Q0, P0) }, mid: { i: sub(R0, S), o: sub(R1, S) }, b: { i: sub(Q2, P3), o: hasOut(hb) ? hb.o : [0, 0] } };
}

/** smooth handles for vertex i of a ring: tangent parallel to prev -> next, a third of the neighbour distance long */
export function defaultHandle(ring, i) {
  const n = ring.length, p = ring[i], pr = ring[(i + n - 1) % n], nx = ring[(i + 1) % n];
  const A = [wrapDeg(pr[0] - p[0]), pr[1] - p[1]], B = [wrapDeg(nx[0] - p[0]), nx[1] - p[1]];
  let d = sub(B, A); const m = Math.hypot(d[0], d[1]) || 1; d = [d[0] / m, d[1] / m];
  const lo = Math.hypot(B[0], B[1]) / 3, li = Math.hypot(A[0], A[1]) / 3;
  return { i: [-d[0] * li, -d[1] * li], o: [d[0] * lo, d[1] * lo] };
}
