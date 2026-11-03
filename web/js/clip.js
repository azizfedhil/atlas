// Clipping of lon/lat rings for drawing.
//
// A ring is a flat [lon, lat, lon, lat, ...] array in RADIANS whose edges are short great-circle pieces (already densified, or a dense
// coastline). Drawing it naively breaks in two situations:
//   * flat maps: the ring crosses the seam (antimeridian of the current centre meridian). A straight line then jumps across the whole
//     map, or the shape is dropped.
//   * globes: part of the ring is on the far side. Joining the visible parts with a chord cuts wedges out of the picture.
// clipRing() cuts the ring exactly at the seam / horizon and, for FILLS, closes every piece along the map edge (flat maps, including
// the pole line for rings that enclose a pole) or along the horizon circle (globes). For BORDER strokes it returns the open pieces,
// which end exactly on the seam / horizon and are never joined across it.
//
// Result: { whole, chains, rings }
//   whole  - nothing was cut: chains = [the full outline], rings = [that same outline] (rings is empty for open lines)
//   chains - open polylines in projected coordinates (stroke these)
//   rings  - closed polygons in projected coordinates (fill these); empty for open lines
import { PI, HALF_PI, TAU, DEG, STEREO_R, wrapLon } from './projections.js';

/** tolerance (projected units) used while a globe is being rotated: points closer than ~1 px to the last kept one are dropped. Quantised to half octaves so a zoom does not invalidate caches every frame. */
export function moveEps(scale) { return Math.pow(2, Math.round(Math.log2(1.1 / scale) * 2) / 2); }
/** the same, for a flat map: points closer than ~px screen pixels to the last kept one are dropped from the vector coast / rivers (quantised to half octaves, so a zoom does not invalidate the paths every frame) */
export function lodEps(scale, px = 0.6) { return Math.pow(2, Math.round(Math.log2(px / scale) * 2) / 2); }

const STEP = 2 * DEG;                                           // sampling of the seam / pole line / horizon arcs
const CAP = { orthographic: HALF_PI, stereographic: 2 * Math.atan(STEREO_R / 2), 'lambert-azimuthal': PI - 1e-6 };   // angular radius of the visible cap

/** true when the (smaller) inside of the ring lies to the LEFT of the travel direction, seen from outside the sphere */
export function interiorLeft(d) {
  const n = d.length / 2;
  if (n < 3) return true;
  const vs = new Array(n);
  let rx = 0, ry = 0, rz = 0;
  for (let i = 0; i < n; i++) {
    const lo = d[2 * i], la = d[2 * i + 1], c = Math.cos(la);
    const v = [c * Math.cos(lo), c * Math.sin(lo), Math.sin(la)];
    vs[i] = v; rx += v[0]; ry += v[1]; rz += v[2];
  }
  const m = Math.hypot(rx, ry, rz), r = m < 1e-9 ? [0, 0, 1] : [rx / m, ry / m, rz / m];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const b = vs[i], c = vs[(i + 1) % n];
    sum += 2 * Math.atan2(dot(r, cross(b, c)), 1 + dot(r, b) + dot(b, c) + dot(c, r));
  }
  const left = sum > 0 ? sum : sum + 4 * PI;                    // area of the region on the left of the travel direction
  return left <= 2 * PI;
}

/** splits a sequence of (point | crossing) events into chains; shared by the flat and the globe version */
function finish(chains, cur, curMeta, closed, cross, wantLeft, assemble) {
  if (!cross) {
    const whole = cur.length > 0;
    return { whole, chains: whole ? [cur] : [], rings: whole && closed ? [cur] : [] };
  }
  const first = chains[0];
  if (closed && first.s0 === 0) {                               // the ring started in the middle of a piece: the last piece continues into the first
    chains.shift();
    chains.push({ pts: cur.concat(first.pts), s0: curMeta.s0, a0: curMeta.a0, s1: first.s1, a1: first.a1 });
  } else {
    chains.push({ pts: cur, s0: curMeta.s0, a0: curMeta.a0, s1: 0, a1: 0 });
  }
  const live = chains.filter((c) => c.pts.length > 1);
  return { whole: false, chains: live.map((c) => c.pts), rings: closed ? assemble(live, wantLeft()) : [] };
}

// ---------------------------------------------------------------------------------------------------------------- flat maps
function clipFlat(def, d, closed, lon0, wantLeft) {
  const n = d.length / 2, pm = Math.min(def.phiMax, HALF_PI) - 1e-9;
  const fwd = (dl, lat) => def.fwd(dl, Math.max(-pm, Math.min(pm, lat)), 0);
  const chains = [];
  let cur = [], curMeta = { s0: 0, a0: 0 }, cross = 0, prevRl = 0, prevLat = 0;
  const count = closed ? n + 1 : n;
  for (let i = 0; i < count; i++) {
    const j = i % n, rl = wrapLon(d[2 * j] - lon0), la = d[2 * j + 1];
    if (i > 0 && Math.abs(rl - prevRl) > PI) {                  // the edge crosses the seam
      let t, s;
      if (prevRl > 0) { s = 1; t = (PI - prevRl) / (rl + TAU - prevRl); } else { s = -1; t = (prevRl + PI) / (prevRl - rl + TAU); }
      const lc = prevLat + t * (la - prevLat);
      const pe = fwd(s * PI, lc); if (pe) cur.push(pe);
      chains.push({ pts: cur, s0: curMeta.s0, a0: curMeta.a0, s1: s, a1: lc });
      cross++;
      cur = []; curMeta = { s0: -s, a0: lc };
      const ps = fwd(-s * PI, lc); if (ps) cur.push(ps);
    }
    const p = fwd(rl, la); if (p) cur.push(p);
    prevRl = rl; prevLat = la;
  }
  const assemble = (cs, left) => {
    const dirOf = (s) => (left ? s : -s);                       // direction (north = +1) in which the inside continues along the seam on side s
    const starts = [[], []];                                    // [east side, west side]
    cs.forEach((c, i) => starts[c.s0 > 0 ? 0 : 1].push({ lat: c.a0, i }));
    const used = new Array(cs.length).fill(false);
    const seam = (s, a, b, out) => { const k = Math.ceil(Math.abs(b - a) / STEP); for (let q = 1; q < k; q++) { const p = fwd(s * PI, a + ((b - a) * q) / k); if (p) out.push(p); } };
    const rings = [];
    for (let a = 0; a < cs.length; a++) {
      if (used[a]) continue;
      const ring = [];
      let ci = a;
      for (let guard = 0; guard <= cs.length; guard++) {
        used[ci] = true;
        const c = cs[ci]; for (const p of c.pts) ring.push(p);
        const s = c.s1, dir = dirOf(s);
        let best = null, bd = Infinity;
        for (const st of starts[s > 0 ? 0 : 1]) {
          const dd = (st.lat - c.a1) * dir;
          if (dd >= -1e-9 && dd < bd && (!used[st.i] || st.i === a)) { bd = dd; best = st; }
        }
        let next = null;
        if (best) { seam(s, c.a1, best.lat, ring); next = best.i; }
        else {                                                  // nothing further along this side: the ring encloses a pole - go round it along the pole line
          const pole = dir * pm;
          seam(s, c.a1, pole, ring);
          const p0 = fwd(s * PI, pole); if (p0) ring.push(p0);
          const k = Math.ceil(TAU / STEP);
          for (let q = 1; q < k; q++) { const p = fwd(s * PI - s * TAU * (q / k), pole); if (p) ring.push(p); }
          const p1 = fwd(-s * PI, pole); if (p1) ring.push(p1);
          let b2 = null, bm = -Infinity;
          for (const st of starts[s > 0 ? 1 : 0]) { const m = st.lat * dir; if (m > bm && (!used[st.i] || st.i === a)) { bm = m; b2 = st; } }
          if (b2) { seam(-s, pole, b2.lat, ring); next = b2.i; }
        }
        if (next == null || next === a || used[next]) break;    // closed (or an inconsistent ring: closed naively)
        ci = next;
      }
      if (ring.length > 2) rings.push(ring);
    }
    return rings;
  };
  return finish(chains, cur, curMeta, closed, cross, wantLeft, assemble);
}

// -------------------------------------------------------------------------------------------------------------------- globes
const unitCache = new WeakMap();      // ring -> [x, y, z] of every point; the coast and the cached densified outlines are stable arrays, so a globe rotation only does dot products
function unitVecs(d) {
  let u = unitCache.get(d);
  if (u && u.length === (d.length / 2) * 3) return u;
  const n = d.length / 2; u = new Float64Array(n * 3);
  for (let j = 0; j < n; j++) { const la = d[2 * j + 1], co = Math.cos(la); u[3 * j] = co * Math.cos(d[2 * j]); u[3 * j + 1] = co * Math.sin(d[2 * j]); u[3 * j + 2] = Math.sin(la); }
  unitCache.set(d, u); return u;
}
function clipGlobe(def, d, closed, lon0, lat0, wantLeft, eps = 0) {
  const n = d.length / 2, kc = Math.cos(CAP[def.id] ?? HALF_PI), kIn = kc + 1e-7, R = def.xmax;
  const cl = Math.cos(lat0), c = [cl * Math.cos(lon0), cl * Math.sin(lon0), Math.sin(lat0)];
  const U = unitVecs(d), vec = (j) => [U[3 * j], U[3 * j + 1], U[3 * j + 2]];
  const fwd = (lon, lat) => def.fwd(lon - lon0, lat, lat0);
  // visible points are projected from their unit vectors with the view's east / north axes: a few multiplications, no sin / cos
  // (the same numbers as def.fwd; this was the per-frame cost of rotating a globe)
  const ex = -Math.sin(lon0), ey = Math.cos(lon0), nx = -Math.sin(lat0) * Math.cos(lon0), ny = -Math.sin(lat0) * Math.sin(lon0), nz = Math.cos(lat0);
  const ortho = def.id === 'orthographic', lamb = def.id === 'lambert-azimuthal', eps2 = eps * eps;
  const fast = (j, f) => {
    const x = U[3 * j] * ex + U[3 * j + 1] * ey, y = U[3 * j] * nx + U[3 * j + 1] * ny + U[3 * j + 2] * nz;
    if (ortho) return [x, y];
    const k = lamb ? Math.sqrt(2 / (1 + f)) : 2 / (1 + f);
    return [k * x, k * y];
  };
  const chains = [];
  let cur = [], curMeta = { s0: 0, a0: 0 }, cross = 0, prev = null, prevF = 0;
  const count = closed ? n + 1 : n;
  for (let i = 0; i < count; i++) {
    const j = i % n, v = vec(j), f = c[0] * v[0] + c[1] * v[1] + c[2] * v[2], vis = f >= kc;
    if (i > 0 && vis !== (prevF >= kc)) {                       // the edge crosses the horizon of the visible cap
      let t = (kIn - prevF) / (f - prevF); t = Math.max(0, Math.min(1, t));
      const x = [prev[0] + t * (v[0] - prev[0]), prev[1] + t * (v[1] - prev[1]), prev[2] + t * (v[2] - prev[2])];
      const m = Math.hypot(x[0], x[1], x[2]) || 1;
      const px = fwd(Math.atan2(x[1], x[0]), Math.asin(Math.max(-1, Math.min(1, x[2] / m))));
      if (px) {
        const th = Math.atan2(px[1], px[0]);
        if (vis) { cur = []; curMeta = { s0: 1, a0: th }; cur.push(px); }                      // coming into view
        else { cur.push(px); chains.push({ pts: cur, s0: curMeta.s0, a0: curMeta.a0, s1: 1, a1: th }); cross++; cur = []; curMeta = { s0: -2, a0: 0 }; }
      }
    }
    if (vis) {
      const p = fast(j, f), q = cur.length ? cur[cur.length - 1] : null;
      if (!eps || !q || (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 >= eps2) cur.push(p);     // moving: drop points closer than eps to the last kept one
    }
    prev = v; prevF = f;
  }
  if (cross && curMeta.s0 === -2) { cur = []; curMeta = { s0: 0, a0: 0 }; }
  const assemble = (cs, left) => {
    const dirA = left ? 1 : -1, used = new Array(cs.length).fill(false), rings = [];
    for (let a = 0; a < cs.length; a++) {
      if (used[a]) continue;
      const ring = [];
      let ci = a;
      for (let guard = 0; guard <= cs.length; guard++) {
        used[ci] = true;
        const ch = cs[ci]; for (const p of ch.pts) ring.push(p);
        let best = -1, bd = Infinity;
        for (let q = 0; q < cs.length; q++) {
          if (used[q] && q !== a) continue;
          const dd = ((((cs[q].a0 - ch.a1) * dirA) % TAU) + TAU) % TAU;
          if (dd < bd) { bd = dd; best = q; }
        }
        if (best < 0) break;
        const th1 = ch.a1, delta = dirA * bd, k = Math.max(1, Math.ceil(Math.abs(delta) / STEP));      // arc along the horizon circle
        for (let q = 1; q < k; q++) { const th = th1 + (delta * q) / k; ring.push([R * Math.cos(th), R * Math.sin(th)]); }
        if (best === a || used[best]) break;
        ci = best;
      }
      if (ring.length > 2) rings.push(ring);
    }
    return rings;
  };
  return finish(chains, cur, curMeta, closed, cross, wantLeft, assemble);
}

/** see the header. d: flat [lon, lat, ...] radians; closed: ring (true) or open line (false); lon0 / lat0: view orientation in radians */
const leftCache = new WeakMap();      // ring -> interiorLeft: it only depends on the ring, not on the view (it was recomputed, with trig per point, on every frame of a rotation)
export function clipRing(def, d, closed, lon0, lat0, eps = 0) {
  const left = () => { let r = leftCache.get(d); if (r === undefined) { r = interiorLeft(d); leftCache.set(d, r); } return r; };
  return def.globe ? clipGlobe(def, d, closed, lon0, lat0, left, eps) : clipFlat(def, d, closed, lon0, left);
}
