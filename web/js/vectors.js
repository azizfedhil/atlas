// Vector coastlines / rivers: loaded once in lon/lat, projected on demand into Path2D objects.
import { project, DEG, HALF_PI, STEREO_R } from './projections.js';

export async function loadVectors(url) {
  const res = await fetch(url);
  const txt = await res.text();
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  let j;
  try { j = JSON.parse(txt); } catch (e) { throw new Error(`${url} is not valid JSON (starts with "${txt.slice(0, 40)}")`); }
  const dec = (flat) => { const a = new Float64Array(flat.length); for (let i = 0; i < a.length; i++) a[i] = (flat[i] / 100) * DEG; return a; };
  return { coast: j.coast.map(dec), rivers: j.rivers.map((r) => ({ w: r.w, p: dec(r.p) })) };
}

const unitCache = new WeakMap();
const flatCache = new WeakMap();      // ring array -> its projected points for one projection / centre / cap (a flat map's level-of-detail passes start from these)

function projectedFlat(def, p, lon0, lat0, cap, jump) {
  const key = def.id + '|' + lon0 + '|' + lat0 + '|' + cap;
  let h = flatCache.get(p); if (h && h.key === key) return h;
  const xy = new Float64Array(p.length), st = new Uint8Array(p.length / 2);          // st[i] = 1: point i starts a new piece (a cut at the cap, the seam or an unprojectable point)
  let n = 0, on = false, lx = 0, ly = 0;
  for (let i = 0; i < p.length; i += 2) {
    if (Math.abs(p[i + 1]) > cap) { on = false; continue; }
    const v = project(def, p[i], p[i + 1], lon0, lat0);
    if (!v) { on = false; continue; }
    if (on && Math.hypot(v[0] - lx, v[1] - ly) > jump) on = false;
    xy[2 * n] = v[0]; xy[2 * n + 1] = v[1]; st[n] = on ? 0 : 1; n++;
    on = true; lx = v[0]; ly = v[1];
  }
  h = { key, xy, st, n }; flatCache.set(p, h); return h;
}

/** Path2Ds in projected coordinates for one projection + orientation (rebuilt only when that changes). */
export function buildPaths(def, vec, lon0, lat0, cap = 4, eps = 0) {          // cap: points beyond this latitude (rad) are left out (polar cap)
  const jump = 0.5 * Math.max(def.xmax, def.ymax);
  const rivers = [new Path2D(), new Path2D(), new Path2D()], coastRings = [];
  const units = (p) => {                                              // [x, y, z] of every point, built once per array
    let u = unitCache.get(p); if (u && u.length === (p.length / 2) * 3) return u;
    u = new Float64Array((p.length / 2) * 3);
    for (let i = 0, j = 0; i < p.length; i += 2, j += 3) { const co = Math.cos(p[i + 1]); u[j] = co * Math.cos(p[i]); u[j + 1] = co * Math.sin(p[i]); u[j + 2] = Math.sin(p[i + 1]); }
    unitCache.set(p, u); return u;
  };
  const cl = Math.cos(lat0), c0 = cl * Math.cos(lon0), c1 = cl * Math.sin(lon0), c2 = Math.sin(lat0);          // view centre
  const ex = -Math.sin(lon0), ey = Math.cos(lon0), nx = -Math.sin(lat0) * Math.cos(lon0), ny = -Math.sin(lat0) * Math.sin(lon0), nz = Math.cos(lat0);
  const ortho = def.id === 'orthographic', lamb = def.id === 'lambert-azimuthal', sinCap = cap >= HALF_PI ? 2 : Math.sin(cap);
  const addGlobe = (path, p, bb) => {                                  // same result as add(), from unit vectors: a globe rotation repaints these every frame
    const u = units(p), n = p.length / 2, e2 = eps * eps;
    let on = false, lx = 0, ly = 0;
    for (let i = 0; i < n; i++) {
      const ux = u[3 * i], uy = u[3 * i + 1], uz = u[3 * i + 2];
      if (uz > sinCap || uz < -sinCap) { on = false; continue; }
      const f = c0 * ux + c1 * uy + c2 * uz;
      let x = ux * ex + uy * ey, y = ux * nx + uy * ny + uz * nz;
      if (ortho) { if (f < 0) { on = false; continue; } }
      else {
        const d = 1 + f; if (d < 1e-9) { on = false; continue; }
        const k = lamb ? Math.sqrt(2 / d) : 2 / d; x *= k; y *= k;
        if (!lamb && x * x + y * y > STEREO_R * STEREO_R) { on = false; continue; }
      }
      if (on && e2 && (x - lx) ** 2 + (y - ly) ** 2 < e2) continue;          // moving: a point closer than eps to the last one adds nothing visible
      if (on) path.lineTo(x, y); else path.moveTo(x, y);
      on = true; lx = x; ly = y;
      if (bb) { if (x < bb[0]) bb[0] = x; if (y < bb[1]) bb[1] = y; if (x > bb[2]) bb[2] = x; if (y > bb[3]) bb[3] = y; }
    }
  };
  const addFlat = (path, p, bb) => {
    let on = false, lx = 0, ly = 0;
    for (let i = 0; i < p.length; i += 2) {
      if (Math.abs(p[i + 1]) > cap) { on = false; continue; }
      const v = project(def, p[i], p[i + 1], lon0, lat0);
      if (!v) { on = false; continue; }
      if (on && Math.hypot(v[0] - lx, v[1] - ly) > jump) on = false;     // crossed the antimeridian
      if (on) path.lineTo(v[0], v[1]); else path.moveTo(v[0], v[1]);
      on = true; lx = v[0]; ly = v[1];
      if (bb) { if (lx < bb[0]) bb[0] = lx; if (ly < bb[1]) bb[1] = ly; if (lx > bb[2]) bb[2] = lx; if (ly > bb[3]) bb[3] = ly; }
    }
  };
  // flat map, level of detail: the projected points of a ring are kept (they only depend on the projection and centre), and a pass drops the
  // points closer than eps to the last kept one. The shape on screen is the same to well under a pixel; the raster work follows the point count.
  const addFlatLod = (path, p, bb) => {
    const h = projectedFlat(def, p, lon0, lat0, cap, jump), xy = h.xy, st = h.st, e2 = eps * eps;
    let lx = 0, ly = 0, px = 0, py = 0, pend = false;                 // pend: a point was skipped and has not been drawn; the end of a piece always draws its last point
    for (let i = 0; i < h.n; i++) {
      const x = xy[2 * i], y = xy[2 * i + 1];
      if (st[i]) { if (pend) path.lineTo(px, py); path.moveTo(x, y); lx = x; ly = y; pend = false; }
      else if ((x - lx) * (x - lx) + (y - ly) * (y - ly) >= e2) { path.lineTo(x, y); lx = x; ly = y; pend = false; }
      else { px = x; py = y; pend = true; }
      if (bb) { if (x < bb[0]) bb[0] = x; if (y < bb[1]) bb[1] = y; if (x > bb[2]) bb[2] = x; if (y > bb[3]) bb[3] = y; }
    }
    if (pend) path.lineTo(px, py);
  };
  const add = def.globe ? addGlobe : eps > 0 ? addFlatLod : addFlat;
  // one Path2D per coast ring (coast and lakes) with its projected bounds, so a paint can skip every ring that is off screen or smaller than a pixel
  for (const p of vec.coast) { const path = new Path2D(), bb = [Infinity, Infinity, -Infinity, -Infinity]; add(path, p, bb); if (bb[0] <= bb[2]) coastRings.push({ path, bb }); }
  for (const r of vec.rivers) add(rivers[r.w - 1], r.p);
  return { coastRings, rivers };
}

/** the rings of `rings` ({ path, bb } in projected units) that reach the painted area and are at least ~1 px: one Path2D, or null when none */
const visCache = new WeakMap();      // rings array -> Map(minPx -> { idx, path }): the last combined path for that set of rings
export function visibleRings(rings, v, minPx = 1) {
  const s = v.scale, m = 24 / s, x0 = v.cx - v.w / (2 * s) - m, x1 = v.cx + v.w / (2 * s) + m, y0 = v.cy - v.h / (2 * s) - m, y1 = v.cy + v.h / (2 * s) + m;
  const idx = [];
  for (let i = 0; i < rings.length; i++) {
    const b = rings[i].bb;
    if (b[2] < x0 || b[0] > x1 || b[3] < y0 || b[1] > y1) continue;
    if ((b[2] - b[0]) * s < minPx && (b[3] - b[1]) * s < minPx) continue;
    idx.push(i);
  }
  if (!idx.length) return null;
  // the same rings as the last call (a pan that did not bring a ring into or out of reach): reuse the combined Path2D instead of copying every ring into a new one
  let slot = visCache.get(rings); if (!slot) visCache.set(rings, (slot = new Map()));
  const hit = slot.get(minPx);
  if (hit && hit.idx.length === idx.length && hit.idx.every((q, i) => q === idx[i])) return hit.path;
  const out = new Path2D();
  for (const i of idx) out.addPath(rings[i].path);
  slot.set(minPx, { idx, path: out });
  return out;
}
