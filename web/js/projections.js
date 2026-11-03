// Map projections on the unit sphere (R = 1). All angles in radians.
//
// Conventions
//   fwd(dl, phi, phi0) -> [x, y] | null   dl = longitude relative to the central meridian
//   inv(x, y, phi0)    -> [dl, phi] | null (null = outside the projection's outline)
// World projections ignore phi0; azimuthal "globe" projections use it as the centre latitude.
// The same formulas live in crates/cosmossi-core/src/projection.rs and in the shader (shaders.js);
// tools/golden.mjs generates test vectors that keep the Rust copy honest.

export const PI = Math.PI, HALF_PI = Math.PI / 2, TAU = 2 * Math.PI;
const SQRT2 = Math.SQRT2, SQRT3 = Math.sqrt(3);
export const DEG = PI / 180;
// Points exactly on the antimeridian edge can invert to |dl| = pi + 1 ulp; accept them.
const EDGE_EPS = 1e-9;

export function wrapLon(l) {
  l = (l + PI) % TAU;
  if (l < 0) l += TAU;
  return l - PI;
}

// ---------- Equal Earth (Savric, Patterson & Jenny 2018) ----------
const EA1 = 1.340264, EA2 = -0.081106, EA3 = 0.000893, EA4 = 0.003796;
const eeY = (t) => t * (EA1 + EA2 * t * t + t ** 6 * (EA3 + EA4 * t * t));
const eeD = (t) => EA1 + 3 * EA2 * t * t + t ** 6 * (7 * EA3 + 9 * EA4 * t * t);
export const EE_XMAX = (2 * SQRT3 * PI) / (3 * EA1);
export const EE_YMAX = eeY(PI / 3);

// ---------- Natural Earth (Savric et al.; same coefficients as d3-geo) ----------
const neX = (p) => { const p2 = p * p, p4 = p2 * p2; return 0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)); };
const neY = (p) => { const p2 = p * p, p4 = p2 * p2; return p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4))); };
const neYD = (p) => { const p2 = p * p, p4 = p2 * p2, p6 = p4 * p2; return 1.007226 + 3 * 0.015085 * p2 + 7 * -0.044475 * p6 + 9 * 0.028874 * p6 * p2 + 11 * -0.005916 * p6 * p4; };
export const NE_XMAX = 0.8707 * PI;
export const NE_YMAX = neY(HALF_PI);

// ---------- Eckert IV ----------
export const E4_KY = 2 * Math.sqrt(PI / (4 + PI));            // y = KY sin(theta)
export const E4_KX = 2 / Math.sqrt(PI * (4 + PI));            // x = KX * dl * (1 + cos(theta))
export const E4_C = 2 + PI / 2;
export const E4_XMAX = E4_KX * PI * 2;
export const E4_YMAX = E4_KY;

// Newton solvers (forward only; inverses are closed-form)
function mollweideTheta(phi) {
  if (Math.abs(Math.abs(phi) - HALF_PI) < 1e-9) return Math.sign(phi) * HALF_PI;
  let t = 2 * phi;                                     // t = 2*theta
  const c = PI * Math.sin(phi);
  for (let i = 0; i < 40; i++) {
    const d = (t + Math.sin(t) - c) / (1 + Math.cos(t));
    t -= d;
    if (Math.abs(d) < 1e-13) break;
  }
  return t / 2;
}
function eckert4Theta(phi) {
  if (Math.abs(Math.abs(phi) - HALF_PI) < 1e-9) return Math.sign(phi) * HALF_PI;
  let t = phi / 2;
  const c = E4_C * Math.sin(phi);
  for (let i = 0; i < 40; i++) {
    const s = Math.sin(t), co = Math.cos(t);
    const d = (t + s * co + 2 * s - c) / Math.max(2 * co * co + 2 * co, 1e-9);
    t -= d;
    if (Math.abs(d) < 1e-13) break;
  }
  return t;
}

// ---------- azimuthal helpers ----------
function azInv(x, y, phi0, c) {
  const rho = Math.hypot(x, y);
  const sc = Math.sin(c), cc = Math.cos(c), s0 = Math.sin(phi0), c0 = Math.cos(phi0);
  const phi = Math.asin(Math.max(-1, Math.min(1, cc * s0 + (rho === 0 ? 0 : (y * sc * c0) / rho))));
  const dl = Math.atan2(x * sc, rho * c0 * cc - y * s0 * sc);
  return [dl, phi];
}
const azDot = (dl, phi, phi0) => Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dl);
const azXY = (k, dl, phi, phi0) => [k * Math.cos(phi) * Math.sin(dl),
  k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dl))];

const GALL_C = Math.cos(PI / 4);
export const STEREO_R = 2.7;                           // clip radius (~107 deg from centre)
const MERC_PHI = Math.atan(Math.sinh(PI));             // ~85.0511 deg

const inRect = (x, y, xm, ym) => Math.abs(x) <= xm + EDGE_EPS && Math.abs(y) <= ym + EDGE_EPS;

/** id, display name, tag, globe?, GL id, half-extents, max latitude drawn */
export const PROJECTIONS = [
  {
    id: 'equal-earth', name: 'Equal Earth', tag: 'Equal-area', glId: 0, globe: false,
    xmax: EE_XMAX, ymax: EE_YMAX, phiMax: HALF_PI,
    fwd(dl, phi) {
      const t = Math.asin((SQRT3 / 2) * Math.sin(phi));
      return [(2 * SQRT3 * dl * Math.cos(t)) / (3 * eeD(t)), eeY(t)];
    },
    inv(x, y) {
      if (Math.abs(y) > EE_YMAX) return null;
      let t = Math.max(-1.1, Math.min(1.1, y / EA1));
      for (let i = 0; i < 12; i++) t -= (eeY(t) - y) / eeD(t);
      const dl = (3 * x * eeD(t)) / (2 * SQRT3 * Math.cos(t));
      if (!(Math.abs(dl) <= PI + EDGE_EPS)) return null;
      return [dl, Math.asin(Math.max(-1, Math.min(1, (2 * Math.sin(t)) / SQRT3)))];
    },
  },
  {
    id: 'natural-earth', name: 'Natural Earth', tag: 'Compromise', glId: 1, globe: false,
    xmax: NE_XMAX, ymax: NE_YMAX, phiMax: HALF_PI,
    fwd: (dl, phi) => [dl * neX(phi), neY(phi)],
    inv(x, y) {
      if (Math.abs(y) > NE_YMAX) return null;
      let p = y;
      for (let i = 0; i < 12; i++) p -= (neY(p) - y) / neYD(p);
      const dl = x / neX(p);
      if (!(Math.abs(dl) <= PI + EDGE_EPS)) return null;
      return [dl, p];
    },
  },
  {
    id: 'mollweide', name: 'Mollweide', tag: 'Equal-area', glId: 2, globe: false,
    xmax: 2 * SQRT2, ymax: SQRT2, phiMax: HALF_PI,
    fwd(dl, phi) {
      const t = mollweideTheta(phi);
      return [((2 * SQRT2) / PI) * dl * Math.cos(t), SQRT2 * Math.sin(t)];
    },
    inv(x, y) {
      const s = y / SQRT2;
      if (Math.abs(s) > 1) return null;
      const t = Math.asin(s), c = Math.cos(t);
      const dl = c < 1e-12 ? 0 : (PI * x) / (2 * SQRT2 * c);
      if (!(Math.abs(dl) <= PI + EDGE_EPS)) return null;
      return [dl, Math.asin(Math.max(-1, Math.min(1, (2 * t + Math.sin(2 * t)) / PI)))];
    },
  },
  {
    id: 'eckert-iv', name: 'Eckert IV', tag: 'Equal-area', glId: 3, globe: false,
    xmax: E4_XMAX, ymax: E4_YMAX, phiMax: HALF_PI,
    fwd(dl, phi) {
      const t = eckert4Theta(phi);
      return [E4_KX * dl * (1 + Math.cos(t)), E4_KY * Math.sin(t)];
    },
    inv(x, y) {
      const s = y / E4_KY;
      if (Math.abs(s) > 1) return null;
      const t = Math.asin(s), c = Math.cos(t);
      const dl = x / (E4_KX * (1 + c));
      if (!(Math.abs(dl) <= PI + EDGE_EPS)) return null;
      return [dl, Math.asin(Math.max(-1, Math.min(1, (t + Math.sin(t) * c + 2 * Math.sin(t)) / E4_C)))];
    },
  },
  {
    id: 'sinusoidal', name: 'Sinusoidal', tag: 'Equal-area', glId: 4, globe: false,
    xmax: PI, ymax: HALF_PI, phiMax: HALF_PI,
    fwd: (dl, phi) => [dl * Math.cos(phi), phi],
    inv(x, y) {
      if (Math.abs(y) > HALF_PI) return null;
      const c = Math.cos(y);
      const dl = c < 1e-12 ? 0 : x / c;
      if (!(Math.abs(dl) <= PI + EDGE_EPS)) return null;
      return [dl, y];
    },
  },
  {
    id: 'gall-peters', name: 'Gall\u2013Peters', tag: 'Equal-area', glId: 5, globe: false,
    xmax: PI * GALL_C, ymax: 1 / GALL_C, phiMax: HALF_PI,
    fwd: (dl, phi) => [dl * GALL_C, Math.sin(phi) / GALL_C],
    inv(x, y) {
      const s = y * GALL_C, dl = x / GALL_C;
      if (Math.abs(s) > 1 || Math.abs(dl) > PI + EDGE_EPS) return null;
      return [dl, Math.asin(s)];
    },
  },
  {
    id: 'equirectangular', name: 'Equirectangular', tag: 'Equidistant', glId: 6, globe: false,
    xmax: PI, ymax: HALF_PI, phiMax: HALF_PI,
    fwd: (dl, phi) => [dl, phi],
    inv: (x, y) => (inRect(x, y, PI, HALF_PI) ? [x, y] : null),
  },
  {
    id: 'mercator', name: 'Mercator', tag: 'Conformal', glId: 7, globe: false,
    xmax: PI, ymax: PI, phiMax: MERC_PHI,
    fwd: (dl, phi) => (Math.abs(phi) > MERC_PHI ? null : [dl, Math.log(Math.tan(PI / 4 + phi / 2))]),
    inv: (x, y) => (inRect(x, y, PI, PI) ? [x, 2 * Math.atan(Math.exp(y)) - HALF_PI] : null),
  },
  {
    id: 'orthographic', name: 'Orthographic globe', tag: 'Globe', glId: 8, globe: true,
    xmax: 1, ymax: 1, phiMax: HALF_PI,
    fwd(dl, phi, phi0) {
      if (azDot(dl, phi, phi0) < 0) return null;
      return azXY(1, dl, phi, phi0);
    },
    inv(x, y, phi0) {
      const rho = Math.hypot(x, y);
      if (rho > 1) return null;
      return azInv(x, y, phi0, Math.asin(rho));
    },
  },
  {
    id: 'lambert-azimuthal', name: 'Lambert azimuthal', tag: 'Equal-area globe', glId: 9, globe: true,
    xmax: 2, ymax: 2, phiMax: HALF_PI,
    fwd(dl, phi, phi0) {
      const d = 1 + azDot(dl, phi, phi0);
      if (d < 1e-9) return null;
      return azXY(Math.sqrt(2 / d), dl, phi, phi0);
    },
    inv(x, y, phi0) {
      const rho = Math.hypot(x, y);
      if (rho > 2) return null;
      return azInv(x, y, phi0, 2 * Math.asin(rho / 2));
    },
  },
  {
    id: 'stereographic', name: 'Stereographic', tag: 'Conformal globe', glId: 10, globe: true,
    xmax: STEREO_R, ymax: STEREO_R, phiMax: HALF_PI,
    fwd(dl, phi, phi0) {
      const d = 1 + azDot(dl, phi, phi0);
      if (d < 1e-9) return null;
      const xy = azXY(2 / d, dl, phi, phi0);
      return Math.hypot(xy[0], xy[1]) > STEREO_R ? null : xy;
    },
    inv(x, y, phi0) {
      const rho = Math.hypot(x, y);
      if (rho > STEREO_R) return null;
      return azInv(x, y, phi0, 2 * Math.atan(rho / 2));
    },
  },
];

export const byId = (id) => PROJECTIONS.find((p) => p.id === id);

/** lon/lat (rad) -> projected x,y (or null when not visible) */
export function project(def, lon, lat, lon0 = 0, lat0 = 0) {
  const dl = def.globe ? lon - lon0 : wrapLon(lon - lon0);
  return def.fwd(dl, lat, def.globe ? lat0 : 0);
}

/** projected x,y -> [lon, lat] (rad) or null when outside the outline */
export function unproject(def, x, y, lon0 = 0, lat0 = 0) {
  const r = def.inv(x, y, def.globe ? lat0 : 0);
  return r ? [wrapLon(r[0] + lon0), r[1]] : null;
}

/** globes: the angular distance (rad) from the view centre of the point that projects to radius rho; null outside the globe */
export function angularDistance(def, rho) {
  if (!def.globe || rho > def.xmax) return null;
  if (def.id === 'orthographic') return Math.asin(Math.min(1, rho));
  if (def.id === 'lambert-azimuthal') return 2 * Math.asin(Math.min(1, rho / 2));
  return 2 * Math.atan(rho / 2);                                  // stereographic
}

/** globes: the orientation [lon0, lat0] (rad, north stays up) that puts the geographic point g = [lon, lat] at projected point (x, y).
 *  Closed form (the spherical "destination point" equations solved for the centre), so a drag can keep the grabbed point under the
 *  cursor exactly, anywhere on the globe. Of the two possible centres it returns the one with the latitude nearest latHint.
 *  null when (x, y) lies outside the globe. */
export function orientationFor(def, g, x, y, latHint = 0) {
  const c = angularDistance(def, Math.hypot(x, y));
  if (c === null) return null;
  const th = Math.atan2(x, y);                                    // bearing of g seen from the centre (clockwise from north)
  const sg = Math.sin(g[1]), A = Math.cos(c), B = Math.sin(c) * Math.cos(th), R = Math.hypot(A, B);
  if (R < 1e-12) return null;
  const delta = Math.atan2(B, A), a = Math.asin(Math.max(-1, Math.min(1, sg / R)));   // A sin(l) + B cos(l) = R sin(l + delta) = sin(lat of g)
  let lat = null;
  for (const s of [a - delta, PI - a - delta]) {
    const w = wrapLon(s);
    if (Math.abs(w) <= HALF_PI + 1e-9 && (lat === null || Math.abs(w - latHint) < Math.abs(lat - latHint))) lat = w;
  }
  if (lat === null) return null;
  lat = Math.max(-HALF_PI, Math.min(HALF_PI, lat));
  const dl = Math.atan2(Math.sin(th) * Math.sin(c) * Math.cos(lat), Math.cos(c) - Math.sin(lat) * sg);
  return [wrapLon(g[0] - dl), lat];
}

/** closed polyline (projected coords) tracing the edge of the projected world */
export function outline(def, lon0 = 0, lat0 = 0, n = 240) {
  const pts = [];
  if (def.globe) {
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU;
      pts.push([def.xmax * Math.cos(a), def.xmax * Math.sin(a)]);
    }
    return pts;
  }
  const pm = def.phiMax, push = (dl, p) => { const v = def.fwd(dl, p, 0); if (v) pts.push(v); };
  for (let i = 0; i <= n; i++) push(-PI, -pm + (2 * pm * i) / n);   // left edge, bottom -> top
  for (let i = 0; i <= n; i++) push(-PI + (TAU * i) / n, pm);       // top edge
  for (let i = 0; i <= n; i++) push(PI, pm - (2 * pm * i) / n);     // right edge, top -> bottom
  for (let i = 0; i <= n; i++) push(PI - (TAU * i) / n, -pm);       // bottom edge
  return pts;
}

/** graticule as an array of polylines in projected coords; step in degrees */
export function graticule(def, stepDeg, lon0 = 0, lat0 = 0) {
  const lines = [], jump = 0.5 * Math.max(def.xmax, def.ymax);
  const phi0 = def.globe ? lat0 : 0;
  const trace = (gen, count) => {
    let cur = [], last = null;
    for (let i = 0; i <= count; i++) {
      const v = gen(i);
      if (!v || (last && Math.hypot(v[0] - last[0], v[1] - last[1]) > jump)) {
        if (cur.length > 1) lines.push(cur);
        cur = [];
      }
      if (v) { cur.push(v); last = v; } else last = null;
    }
    if (cur.length > 1) lines.push(cur);
  };
  const pm = Math.min(HALF_PI, def.phiMax);
  // meridians (absolute longitudes), skipping the one sitting on the outline of world projections
  for (let lonDeg = -180; lonDeg < 180; lonDeg += stepDeg) {
    const dl = def.globe ? lonDeg * DEG - lon0 : wrapLon(lonDeg * DEG - lon0);
    if (!def.globe && Math.abs(dl) > PI - 1e-6) continue;
    trace((i) => def.fwd(dl, -pm + (2 * pm * i) / 180, phi0), 180);
  }
  // parallels
  for (let latDeg = -90 + stepDeg; latDeg < 90; latDeg += stepDeg) {
    const phi = latDeg * DEG;
    if (Math.abs(phi) > pm) continue;
    if (def.globe) trace((i) => def.fwd(-PI + (TAU * i) / 360, phi, phi0), 360);
    else trace((i) => def.fwd(-PI + (TAU * i) / 360, phi, 0), 360);
  }
  return lines;
}

/** scale (px per projected unit) that fits the whole world in w x h with a margin */
export function fitScale(def, w, h, margin = 0.94) {
  return Math.min(w / (2 * def.xmax), h / (2 * def.ymax)) * margin;
}
