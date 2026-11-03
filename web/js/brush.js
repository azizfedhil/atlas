// Brush tool geometry (pure, no DOM): a freehand stroke of screen points becomes one closed outline.
// The stroke is worked out in screen space (so the brush stays round at any zoom / projection) and mapped back to lon/lat by the editor.
// polyops treats x as a longitude (period 360), so screen pixels are scaled into a small +-80 "unit" box first and back afterwards.
import { unionRings, planarArea } from './polyops.js';

/** Douglas-Peucker on an open polyline of [x, y]; keeps the first and last point */
export function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let worst = -1, wi = -1;
    const ax = pts[a][0], ay = pts[a][1], dx = pts[b][0] - ax, dy = pts[b][1] - ay, L = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const t = L ? Math.max(0, Math.min(1, ((pts[i][0] - ax) * dx + (pts[i][1] - ay) * dy) / L)) : 0;
      const d = Math.hypot(pts[i][0] - ax - t * dx, pts[i][1] - ay - t * dy);
      if (d > worst) { worst = d; wi = i; }
    }
    if (worst > tol) { keep[wi] = 1; stack.push([a, wi], [wi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Douglas-Peucker for a closed ring (split at the two farthest-apart anchors so no corner is lost) */
export function simplifyRing(ring, tol) {
  if (ring.length < 8) return ring.slice();
  let i1 = 0, i2 = 0, best = -1;
  for (let i = 1; i < ring.length; i++) { const d = Math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]); if (d > best) { best = d; i1 = i; } }
  best = -1;
  for (let i = 0; i < ring.length; i++) { const d = Math.hypot(ring[i][0] - ring[i1][0], ring[i][1] - ring[i1][1]); if (d > best) { best = d; i2 = i; } }
  const lo = Math.min(i1, i2), hi = Math.max(i1, i2);
  const a = simplifyLine(ring.slice(lo, hi + 1), tol), b = simplifyLine([...ring.slice(hi), ...ring.slice(0, lo + 1)], tol);
  const out = [...a.slice(0, -1), ...b.slice(0, -1)];
  return out.length >= 3 ? out : ring.slice();
}

/** counter-clockwise capsule (two discs joined by their tangents) around the segment p0 -> p1; a circle when the points coincide */
export function capsule(p0, p1, r, n = 8) {
  const out = [], len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  if (len < 1e-9) { for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * 2 * Math.PI; out.push([p0[0] + r * Math.cos(a), p0[1] + r * Math.sin(a)]); } return out; }
  const th = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  for (let i = 0; i <= n; i++) { const a = th - Math.PI / 2 + (i / n) * Math.PI; out.push([p1[0] + r * Math.cos(a), p1[1] + r * Math.sin(a)]); }
  for (let i = 0; i <= n; i++) { const a = th + Math.PI / 2 + (i / n) * Math.PI; out.push([p0[0] + r * Math.cos(a), p0[1] + r * Math.sin(a)]); }
  return out;
}

const SPAN = 80;                                                       // screen box is mapped into +-SPAN units (inside polyops' longitude range)

/**
 * The outline of a round brush of radius `r` (px) dragged over `pts` (screen px). Returns a closed ring of [x, y] screen px, or null.
 * `w`, `h` bound the coordinates (only used for the unit scaling, strokes may run past the edges).
 */
export function strokeRing(pts, r, w = 4000, h = 4000) {
  if (!pts.length || !(r > 0)) return null;
  const k = SPAN / (Math.max(w, h) * 1.5), cx = w / 2, cy = h / 2;
  const toU = (p) => [(p[0] - cx) * k, (p[1] - cy) * k], toPx = (p) => [p[0] / k + cx, p[1] / k + cy];
  const line = simplifyLine(pts, Math.max(1, r * 0.2)).map(toU), ru = r * k;
  // neighbouring capsules always overlap (they share a joint), so merge them pairwise, level by level: the rings stay small, which keeps long strokes fast
  let parts = [];
  if (line.length === 1) parts.push(capsule(line[0], line[0], ru));
  for (let i = 0; i < line.length - 1; i++) parts.push(capsule(line[i], line[i + 1], ru));
  const area = (q) => planarArea(q);
  while (parts.length > 1) {
    const next = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (i + 1 >= parts.length) { next.push(parts[i]); break; }
      let u = null;
      try { u = unionRings(parts[i], parts[i + 1]); } catch (e) { u = null; }
      next.push(u && u.length ? u.reduce((p, q) => (area(q) > area(p) ? q : p)) : (area(parts[i]) >= area(parts[i + 1]) ? parts[i] : parts[i + 1]));   // a degenerate union keeps the larger piece
    }
    parts = next;
  }
  const ring = parts[0];
  const px = ring.map(toPx);
  return simplifyRing(px, Math.max(0.35, r * 0.04));
}
