// Geodesic measurement on a sphere. Mirrors crates/cosmossi-core/src/measure.rs (the Rust core is the authority;
// tools/test_measure.mjs and the Rust tests both run tests/measure_cases.json).
// Points are [lon, lat] in DEGREES. Bearings: degrees clockwise from north, [0, 360).
// Degenerate input: coincident points -> distance 0, bearing 0; antipodal points -> one deterministic path.
import { haversine } from './geo.js';

const DEG = Math.PI / 180;
const toVec = (p) => { const lo = p[0] * DEG, la = p[1] * DEG, c = Math.cos(la); return [c * Math.cos(lo), c * Math.sin(lo), Math.sin(la)]; };
const fromVec = (v) => { const n = Math.hypot(v[0], v[1], v[2]) || 1; return [Math.atan2(v[1], v[0]) / DEG, Math.asin(Math.max(-1, Math.min(1, v[2] / n))) / DEG]; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm360 = (d) => { const r = ((d % 360) + 360) % 360; return r >= 360 ? 0 : r; };
const wrapLon = (d) => ((((d + 540) % 360) + 360) % 360) - 180;
const angle = (va, vb) => Math.atan2(Math.hypot(...cross(va, vb)), dot(va, vb));

export const distanceKm = (a, b, radiusKm) => haversine(a[0] * DEG, a[1] * DEG, b[0] * DEG, b[1] * DEG) * radiusKm;

export function initialBearing(a, b) {
  const p1 = a[1] * DEG, p2 = b[1] * DEG, dl = (b[0] - a[0]) * DEG;
  const y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  if (x === 0 && y === 0) return 0;
  return norm360(Math.atan2(y, x) / DEG);
}
export const finalBearing = (a, b) => norm360(initialBearing(b, a) + 180);

/** point a fraction f (0 = a, 1 = b) of the way along the shortest path */
export function intermediate(a, b, f) {
  const va = toVec(a), vb = toVec(b), ang = angle(va, vb);
  if (ang < 1e-12) return [a[0], a[1]];
  if (Math.PI - ang < 1e-9) {                                   // antipodal: rotate a about a fixed perpendicular axis
    const c = cross(va, Math.abs(va[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]), n = Math.hypot(...c), u = c.map((x) => x / n), t = f * Math.PI;
    return fromVec([0, 1, 2].map((i) => va[i] * Math.cos(t) + u[i] * Math.sin(t)));
  }
  const s = Math.sin(ang), f1 = Math.sin((1 - f) * ang) / s, f2 = Math.sin(f * ang) / s;
  return fromVec([0, 1, 2].map((i) => f1 * va[i] + f2 * vb[i]));
}
export const midpoint = (a, b) => intermediate(a, b, 0.5);

export function destination(a, bearingDeg, distanceKm_, radiusKm) {
  const p1 = a[1] * DEG, l1 = a[0] * DEG, th = bearingDeg * DEG, d = distanceKm_ / radiusKm;
  const p2 = Math.asin(Math.max(-1, Math.min(1, Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(th))));
  const l2 = l1 + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [wrapLon(l2 / DEG), p2 / DEG];
}

/** points along the arc a -> b, at most stepDeg of arc apart, including both ends */
export function arcPoints(a, b, stepDeg = 0.5) {
  const n = Math.max(1, Math.ceil(angle(toVec(a), toVec(b)) / (Math.max(stepDeg, 1e-6) * DEG))), out = [[a[0], a[1]]];
  for (let i = 1; i < n; i++) out.push(intermediate(a, b, i / n));
  out.push([b[0], b[1]]);
  return out;
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export const compassPoint = (deg) => COMPASS[Math.round(norm360(deg) / 22.5) % 16];

/** Throws RangeError for bad input. Zero or one point gives an empty measurement. */
export function measurePath(points, radiusKm) {
  if (!(Number.isFinite(radiusKm) && radiusKm > 0)) throw new RangeError('planet radius must be a positive number');
  points.forEach((p, i) => { if (!(Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90)) throw new RangeError(`point ${i + 1} is outside the globe`); });
  const legs = [], cumulativeKm = []; let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], km = distanceKm(a, b, radiusKm);
    total += km;
    legs.push({ km, initialBearing: initialBearing(a, b), finalBearing: finalBearing(a, b) });
    cumulativeKm.push(total);
  }
  return { legs, cumulativeKm, totalKm: total };
}

// ---- Area measurement (6.2). Polygon = closed ring of great-circle edges through the points (closing edge implicit).
// Area is the smaller of the two regions the ring splits the sphere into (same convention as ringAreaKm2).
export function ringAreaKm2(points, radiusKm) {
  const n = points.length; if (n < 3) return 0;
  const vs = points.map(toVec); let r = [0, 0, 0];
  for (const v of vs) r = [r[0] + v[0], r[1] + v[1], r[2] + v[2]];
  const m = Math.hypot(...r); r = m < 1e-9 ? [0, 0, 1] : r.map((x) => x / m);
  let sum = 0;
  for (let i = 0; i < n; i++) { const b = vs[i], c = vs[(i + 1) % n]; sum += 2 * Math.atan2(dot(r, cross(b, c)), 1 + dot(r, b) + dot(b, c) + dot(c, r)); }
  let a = Math.abs(sum); if (a > 2 * Math.PI) a = 4 * Math.PI - a;
  return a * radiusKm * radiusKm;
}
export function ringPerimeterKm(points, radiusKm) {
  const n = points.length; if (n < 2) return 0;
  let s = 0; for (let i = 0; i < n; i++) s += distanceKm(points[i], points[(i + 1) % n], radiusKm);
  return s;
}
const unit = (v) => { const n = Math.hypot(...v); return v.map((x) => x / n); };
function arcsCross(a1, a2, b1, b2) {
  const na = cross(a1, a2), nb = cross(b1, b2);
  if (Math.hypot(...na) < 1e-12 || Math.hypot(...nb) < 1e-12) return false;
  const d0 = cross(na, nb); if (Math.hypot(...d0) < 1e-12) return false;   // same great circle: touching, not crossing
  const d = unit(d0);
  const onArc = (p, s, e) => { const ls = angle(s, e), as = angle(s, p), ae = angle(p, e); return Math.abs(as + ae - ls) < 1e-9 && as > 1e-9 && ae > 1e-9; };
  return [d, d.map((x) => -x)].some((p) => onArc(p, a1, a2) && onArc(p, b1, b2));
}
export function ringSelfIntersects(points) {
  const n = points.length; if (n < 4) return false;
  const vs = points.map(toVec);
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue;
    if (arcsCross(vs[i], vs[(i + 1) % n], vs[j], vs[(j + 1) % n])) return true;
  }
  return false;
}
/** Throws RangeError for bad input. Fewer than 3 points give area 0. */
export function measureArea(points, radiusKm) {
  if (!(Number.isFinite(radiusKm) && radiusKm > 0)) throw new RangeError('planet radius must be a positive number');
  points.forEach((p, i) => { if (!(Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90)) throw new RangeError(`point ${i + 1} is outside the globe`); });
  return { areaKm2: ringAreaKm2(points, radiusKm), perimeterKm: ringPerimeterKm(points, radiusKm), vertexCount: points.length, selfIntersecting: ringSelfIntersects(points) };
}
