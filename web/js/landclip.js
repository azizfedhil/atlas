// Land test + border clipping against the vector coastline (Batch 7.1).
// The baked coast contours are open polylines with a consistent winding: water is on the LEFT of travel, land on the
// RIGHT (verified against field.png). So "is this point land?" = which side of the nearest coast segment it is on,
// which needs no closed polygons. Everything here works in degrees; `coast` is an array of flat [lon, lat, ...] arrays.
import { densify } from './spherical.js';

const DEG = Math.PI / 180, RAD = 180 / Math.PI;
const wrap = (d) => ((d + 540) % 360 + 360) % 360 - 180;           // -> [-180, 180)
const MAX_WALK_DEG = 40;                                           // never follow a coast further than this
const KEEP_DEG = 0.03;                                             // thin coast detail to roughly this spacing

export function createLandClip(coastRad) {
  const C = coastRad.map((p) => { const a = new Float64Array(p.length); for (let i = 0; i < a.length; i++) a[i] = p[i] * RAD; return a; });
  const info = C.map((p) => {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
    const n = p.length / 2, gap = Math.hypot(wrap(p[0] - p[p.length - 2]), p[1] - p[p.length - 1]);
    const closed = n > 3 && gap < 0.6;                              // nearly closed contours get a closing segment
    return { x0, x1, y0, y1, n, closed, segs: closed ? n : n - 1 };
  });
  const vx = (c, i) => C[c][(i % info[c].n) * 2], vy = (c, i) => C[c][(i % info[c].n) * 2 + 1];

  // Spatial index: every coast segment is registered in each CELL-degree cell its (shortest-way) bounding box touches, so a
  // query only looks at the cells around the point and widens ring by ring until no unvisited ring can hold anything closer.
  const CELL = 2, NX = 360 / CELL, NY = 180 / CELL, cells = new Array(NX * NY);
  const cellX = (lon) => (((Math.floor((lon + 180) / CELL)) % NX) + NX) % NX;
  const cellY = (lat) => Math.min(NY - 1, Math.max(0, Math.floor((lat + 90) / CELL)));
  for (let c = 0; c < C.length; c++) {
    const m = info[c];
    for (let i = 0; i < m.segs; i++) {
      const alon = wrap(vx(c, i)), blon = alon + wrap(vx(c, i + 1) - vx(c, i)), la = vy(c, i), lb = vy(c, i + 1);
      const x0 = Math.floor((Math.min(alon, blon) + 180) / CELL), x1 = Math.floor((Math.max(alon, blon) + 180) / CELL);
      const y0 = cellY(Math.min(la, lb)), y1 = cellY(Math.max(la, lb));
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        const k = ((x % NX) + NX) % NX * NY + y;
        (cells[k] || (cells[k] = [])).push(c, i);
      }
    }
  }

  /** nearest point on the coastline: { ll: [lon, lat], d (deg, cos-scaled), land: boolean } (null when there is no coast) */
  function nearest(lon, lat) {
    const k = Math.max(Math.cos(lat * DEG), 0.05);
    let best = null, bd = Infinity, bc = -1, bi = -1;
    const cx0 = cellX(lon), cy0 = cellY(lat), maxR = Math.max(NX / 2, NY);
    const visit = (cx, cy) => {
      const list = cells[(((cx % NX) + NX) % NX) * NY + cy]; if (!list) return;
      for (let q = 0; q < list.length; q += 2) {
        const c = list[q], i = list[q + 1];
        const ax = wrap(vx(c, i) - lon) * k, ay = vy(c, i) - lat, by = vy(c, i + 1) - lat;
        const dx = wrap(vx(c, i + 1) - vx(c, i)) * k, dy = by - ay, L = dx * dx + dy * dy;      // the segment's short way round, so a segment never swings across the globe
        const t = L ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L)) : 0;
        const px = ax + t * dx, py = ay + t * dy, d = px * px + py * py;
        if (d < bd || (d === bd && (c < bc || (c === bc && i < bi)))) { bd = d; bc = c; bi = i; best = { px, py, cross: dx * -ay - dy * -ax }; }
      }
    };
    for (let r = 0; r <= maxR; r++) {
      if (best && r >= 2 && (r - 1) * CELL * Math.min(1, k) > Math.sqrt(bd)) break;   // nothing in ring r or beyond can beat the current best
      if (r === 0) visit(cx0, cy0);
      else {
        for (let x = -r; x <= r; x++) {                                              // top and bottom rows of the ring
          if (cy0 - r >= 0) visit(cx0 + x, cy0 - r);
          if (cy0 + r < NY) visit(cx0 + x, cy0 + r);
        }
        for (let y = -r + 1; y <= r - 1; y++) {                                      // left and right columns
          const cy = cy0 + y; if (cy < 0 || cy >= NY) continue;
          visit(cx0 - r, cy); if (2 * r < NX) visit(cx0 + r, cy);
        }
      }
    }
    if (!best) return null;
    return { ll: [wrap(lon + best.px / k), lat + best.py], d: Math.sqrt(bd), land: best.cross < 0 };
  }
  const isLand = (lon, lat) => { const n = nearest(lon, lat); return n ? n.land : true; };

  /** coordinates of a polyline of the great-circle arc a -> b (degrees), longitudes unwrapped so they never jump */
  function arc(a, b) {
    const d = densify([a, b], false, 1), out = [];
    for (let i = 0; i < d.length; i += 2) {
      let lo = d[i] * RAD; const la = d[i + 1] * RAD;
      if (out.length) lo = out[out.length - 1][0] + wrap(lo - out[out.length - 1][0]);
      out.push([lo, la]);
    }
    return out;
  }

  /**
   * Points to insert between `a` and `b` (both [lon, lat]) so the edge follows the coast wherever the straight edge
   * would cross water. Returns [] when the edge stays on land. Water before the first / after the last crossing is
   * left alone (the caller snaps its end points to land).
   */
  function clipSegment(a, b) {
    const P = arc(a, b), m = P.length - 1;
    if (m < 1) return [];
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (const p of P) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    const shifts = [0]; if (maxX > 180) shifts.push(-360); if (minX < -180) shifts.push(360);
    const hits = [];
    for (let k = 0; k < m; k++) {
      const [x1, y1] = P[k], [x2, y2] = P[k + 1], sx0 = Math.min(x1, x2), sx1 = Math.max(x1, x2), sy0 = Math.min(y1, y2), sy1 = Math.max(y1, y2);
      for (const s of shifts) for (let c = 0; c < C.length; c++) {
        const q = info[c];
        if (q.x1 + s < sx0 || q.x0 + s > sx1 || q.y1 < sy0 || q.y0 > sy1) continue;
        for (let i = 0; i < q.segs; i++) {
          const x3 = vx(c, i) + s, y3 = vy(c, i), x4 = vx(c, i + 1) + s, y4 = vy(c, i + 1);
          if (Math.abs(x4 - x3) > 180) continue;                    // the closing segment of a contour that spans the seam
          const d1x = x2 - x1, d1y = y2 - y1, d2x = x4 - x3, d2y = y4 - y3, den = d1x * d2y - d1y * d2x;
          if (Math.abs(den) < 1e-14) continue;
          const u = ((x3 - x1) * d2y - (y3 - y1) * d2x) / den, v = ((x3 - x1) * d1y - (y3 - y1) * d1x) / den;
          if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
          hits.push({ t: (k + u) / m, c, i, v, s, x: x1 + u * d1x, y: y1 + u * d1y });
        }
      }
    }
    if (!hits.length) return [];
    hits.sort((p, q) => p.t - q.t);
    const at = (t) => { const f = Math.min(t * m, m - 1e-9), k = Math.floor(f), w = f - k; return [P[k][0] + w * (P[k + 1][0] - P[k][0]), P[k][1] + w * (P[k + 1][1] - P[k][1])]; };
    const out = [];
    for (let j = 1; j < hits.length; j++) {
      const E = hits[j - 1], N = hits[j];
      if (N.t - E.t < 1e-7) continue;
      const mid = at((E.t + N.t) / 2);
      if (isLand(wrap(mid[0]), mid[1])) continue;                    // this stretch is on land: nothing to do
      out.push(...waterStretch(E, N));
    }
    return out.map((p) => [wrap(p[0]), p[1]]);
  }

  /** the points that replace a water stretch between exit hit E and entry hit N */
  function waterStretch(E, N) {
    const ends = [[E.x, E.y], [N.x, N.y]];
    if (E.c !== N.c || E.s !== N.s) return ends;                    // different coasts (e.g. island to mainland): cut straight
    const { n, closed } = info[E.c], c = E.c, s = E.s;
    const mod = (a) => ((a % n) + n) % n;
    let fwd = Infinity, bwd = Infinity, fk = 0, bk = 0;
    if (closed) {
      fk = mod(N.i - E.i); if (fk === 0 && N.v <= E.v) fk = n; fwd = fk;
      bk = mod(E.i - N.i); if (bk === 0 && E.v <= N.v) bk = n; bwd = bk;
    } else {
      if (N.i > E.i || (N.i === E.i && N.v > E.v)) { fk = N.i - E.i; fwd = fk; }
      if (E.i > N.i || (E.i === N.i && E.v > N.v)) { bk = E.i - N.i; bwd = bk; }
    }
    if (!isFinite(fwd) && !isFinite(bwd)) return ends;
    const walk = (dir) => {                                          // vertex coordinates visited going forward / backward
      const pts = [];
      if (dir > 0) for (let q = 1; q <= fk; q++) pts.push([vx(c, mod(E.i + q)) + s, vy(c, mod(E.i + q))]);
      else for (let q = 0; q < bk; q++) pts.push([vx(c, mod(E.i - q)) + s, vy(c, mod(E.i - q))]);
      return pts;
    };
    const length = (pts) => { let L = 0, p = ends[0]; for (const q of [...pts, ends[1]]) { L += Math.hypot(wrap(q[0] - p[0]) * Math.max(Math.cos(p[1] * DEG), 0.05), q[1] - p[1]); p = q; } return L; };
    const f = isFinite(fwd) ? walk(1) : null, b = isFinite(bwd) ? walk(-1) : null;
    const lf = f ? length(f) : Infinity, lb = b ? length(b) : Infinity, pts = lf <= lb ? f : b, L = Math.min(lf, lb);
    if (!pts || L > MAX_WALK_DEG) return ends;
    const kept = [ends[0]]; let last = ends[0];
    for (const p of pts) {
      if (Math.hypot(wrap(p[0] - last[0]) * Math.max(Math.cos(p[1] * DEG), 0.05), p[1] - last[1]) >= KEEP_DEG) { kept.push(p); last = p; }
    }
    kept.push(ends[1]);
    return kept;
  }

  /** Snap a point to land: returns it unchanged when already on land, else the nearest coast point. */
  function toLand(ll) {
    const n = nearest(ll[0], ll[1]);
    return !n || n.land ? { ll, moved: false } : { ll: n.ll, moved: true };
  }

  return { isLand, nearest, clipSegment, toLand };
}
