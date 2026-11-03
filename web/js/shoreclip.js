// Shore clip: cuts a country outline to the land of the vector coast (the true intersection outline ∩ land), so a border
// drawn loosely over the sea ends exactly at the shore. Used when a country is finished and by "Clip border to shores".
//
// Work is kept small on purpose: the land is indexed once per coast (lazy), a contour is only touched when its box meets the
// outline's box, and it is first cropped to that box (Sutherland-Hodgman), so the planar boolean in polyops.js only ever sees
// the coast that is near the outline. Lakes are ignored (they stay inside the country, like in the land-area figures).
import { densify } from './spherical.js';
import { intersectRings, unionRings } from './polyops.js';

const DEG = Math.PI / 180, RAD = 180 / Math.PI;
const wrap = (d) => ((d + 540) % 360 + 360) % 360 - 180;                       // -> [-180, 180)
const SHIFTS = [0, -360, 360];                                                  // a contour may be needed one world to either side
const GAP_CLOSE = 3;        // deg: an open contour whose ends are closer than this is closed with a straight segment
const PAD = 2;              // deg: margin between the outline's box and the crop window
const MAX_SPAN = 150;       // deg of longitude: wider outlines are refused (polyops works with shifts below 180 deg)
const LONG_EDGE = 2;        // deg: edges longer than this get extra points so they follow their great circle
const STEP = 1;             // deg between those extra points
const MIN_LAND = 2e-4;      // deg^2: smaller landmasses are not used
const MIN_FRAC = 0.002;     // a piece smaller than this share of the clipped area is dropped (tiny islets)
const MAX_PIECES = 40;      // never create more than this many parts
const MAX_MERGE = 80;       // overlapping pieces are only merged when there are at most this many

const kw = (p) => Math.round(wrap(p[0]) * 1e6) + ',' + Math.round(p[1] * 1e6);   // a point's identity (~0.1 m)
const area2 = (r) => { let s = 0; for (let i = 0, n = r.length; i < n; i++) { const a = r[i], b = r[(i + 1) % n]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
const boxOf = (r) => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of r) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  return { x0, x1, y0, y1 };
};
/** the ring with continuous longitudes (no 360 jumps); the first point lands within 180 deg of `ref` */
const unwrapRing = (ring, ref = ring[0][0]) => {
  const out = []; let prev = ref + wrap(ring[0][0] - ref);
  for (let i = 0; i < ring.length; i++) { const x = i ? prev + wrap(ring[i][0] - prev) : prev; out.push([x, ring[i][1]]); prev = x; }
  return out;
};

/** one Sutherland-Hodgman pass */
function clipPass(poly, inside, cut) {
  const out = [];
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n], ia = inside(a), ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) out.push(cut(a, b));
  }
  return out;
}
/** the polygon cropped to the rectangle (it only keeps what lies inside) */
function cropToRect(poly, x0, x1, y0, y1) {
  const atX = (x) => (a, b) => [x, a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])];
  const atY = (y) => (a, b) => [a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), y];
  let r = clipPass(poly, (p) => p[0] >= x0, atX(x0));
  if (r.length) r = clipPass(r, (p) => p[0] <= x1, atX(x1));
  if (r.length) r = clipPass(r, (p) => p[1] >= y0, atY(y0));
  if (r.length) r = clipPass(r, (p) => p[1] <= y1, atY(y1));
  return r;
}
/** pieces that overlap or touch (nested islands, land painted next to the baked coast) are joined into one */
function mergeTouching(rings, ref) {
  if (rings.length > MAX_MERGE) return rings;
  const list = rings.map((r) => ({ r, b: boxOf(r) }));
  for (let again = true; again;) {
    again = false;
    for (let i = 0; i < list.length && !again; i++) for (let j = i + 1; j < list.length && !again; j++) {
      const p = list[i].b, q = list[j].b;
      if (p.x1 < q.x0 || q.x1 < p.x0 || p.y1 < q.y0 || q.y1 < p.y0) continue;
      const u = unionRings(list[i].r, list[j].r);
      if (u.length !== 1) continue;                                              // separate landmasses: leave them alone
      const r = unwrapRing(u[0], ref);
      list.splice(j, 1); list[i] = { r, b: boxOf(r) }; again = true;
    }
  }
  return list.map((o) => o.r);
}

export function createShoreClip(coastRad) {
  let land = null;                                                               // { items: land contours, open: contours that cannot be closed }

  /** one-off index of the coast: continuous longitudes, closed rings, land contours only, with their boxes */
  function build() {
    const items = [], open = [];
    for (const p of coastRad) {
      const n = p.length / 2; if (n < 4) continue;
      const pts = new Array(n); let prev = 0;
      for (let i = 0; i < n; i++) { const lo = p[2 * i] * RAD, x = i ? prev + wrap(lo - prev) : lo; pts[i] = [x, p[2 * i + 1] * RAD]; prev = x; }
      const first = pts[0], last = pts[n - 1], drift = last[0] - first[0];
      let ring = pts;
      if (Math.abs(drift) > 180) {                                               // runs right round the globe (a polar cap): close it through the pole
        let mean = 0; for (const q of pts) mean += q[1]; mean /= n;
        const pole = mean < 0 ? -90 : 90;
        ring = pts.concat([[last[0], pole], [first[0], pole]]);
      } else if (Math.hypot(drift, last[1] - first[1]) >= GAP_CLOSE) { open.push(boxOf(pts)); continue; }   // ends too far apart: cannot be used
      const a = area2(ring);
      if (a >= 0 || -a / 2 < MIN_LAND) continue;                                 // positive = a lake (stays inside the country); tiny = ignored
      items.push({ ring, ...boxOf(ring) });
    }
    land = { items, open };
  }

  function run(input) {
    if (!input || input.length < 3) return { status: 'error', msg: 'The outline has too few points.', pieces: [] };
    if (!land) build();
    const base = unwrapRing(input), n = base.length;
    if (Math.abs(wrap(base[n - 1][0] - base[0][0]) - (base[n - 1][0] - base[0][0])) > 1e-6) {
      return { status: 'unsupported', msg: 'This outline goes right round the globe, so it cannot be clipped.', pieces: [] };
    }
    // 1. the outline, with extra points on long edges so the edge follows its great circle (the way it is drawn)
    const dense = [], extras = new Set(), origs = new Set();
    for (let i = 0; i < n; i++) {
      const a = base[i], b = base[(i + 1) % n];
      dense.push(a); origs.add(kw(a));
      const dx = wrap(b[0] - a[0]) * Math.max(Math.cos(a[1] * DEG), 0.05), dy = b[1] - a[1];
      if (Math.hypot(dx, dy) <= LONG_EDGE) continue;
      const d = densify([[a[0], a[1]], [b[0], b[1]]], false, STEP);              // flat radians: a, extra points..., b
      let px = a[0];
      for (let j = 2; j < d.length - 2; j += 2) {
        const x = px + wrap(d[j] * RAD - px), q = [x, d[j + 1] * RAD];
        dense.push(q); extras.add(kw(q)); px = x;
      }
    }
    const bb = boxOf(dense), A0 = Math.abs(area2(dense)) / 2;
    if (bb.x1 - bb.x0 > MAX_SPAN) return { status: 'toolarge', msg: `This border is too wide (over ${MAX_SPAN}° of longitude) to be clipped in one go.`, pieces: [] };
    if (!(A0 > 1e-9)) return { status: 'error', msg: 'The outline has no area.', pieces: [] };
    const wx0 = bb.x0 - PAD, wx1 = bb.x1 + PAD, wy0 = bb.y0 - PAD, wy1 = bb.y1 + PAD;
    const near = (it, s) => it.x1 + s >= wx0 && it.x0 + s <= wx1 && it.y1 >= wy0 && it.y0 <= wy1;
    for (const o of land.open) for (const s of SHIFTS) {
      if (near(o, s)) return { status: 'unsupported', msg: 'The coastline here is not a closed outline, so the border cannot be clipped.', pieces: [] };
    }
    // 2. outline ∩ every land contour that meets its box (each contour cropped to the box first)
    let found = [];
    for (const it of land.items) for (const s of SHIFTS) {
      if (!near(it, s)) continue;
      const poly = cropToRect(s ? it.ring.map((q) => [q[0] + s, q[1]]) : it.ring, wx0, wx1, wy0, wy1);
      if (poly.length < 3) continue;
      for (const r of intersectRings(dense, poly)) found.push(unwrapRing(r, bb.x0));
    }
    if (found.length > 1) found = mergeTouching(found, bb.x0);
    // 3. tidy: drop the extra points again (they were only needed to find the crossings), measure, sort
    const out = [];
    for (const r of found) {
      const full = Math.abs(area2(r)) / 2;
      const keep = r.filter((p) => { const k = kw(p); return !extras.has(k) || origs.has(k); });
      const clean = keep.filter((p, i) => kw(p) !== kw(keep[(i + keep.length - 1) % keep.length]));
      if (clean.length < 3) continue;
      out.push({ ring: clean.map((p) => [wrap(p[0]), p[1]]), a: full });
    }
    if (!out.length) return { status: 'empty', msg: 'There is no land inside this border.', pieces: [] };
    out.sort((p, q) => q.a - p.a);
    if (out.length === 1 && Math.abs(out[0].a - A0) <= 1e-7 * Math.max(1, A0)) return { status: 'unchanged', pieces: [] };   // already all land
    const total = out.reduce((s, o) => s + o.a, 0);
    let kept = out.filter((o, i) => i === 0 || o.a >= MIN_FRAC * total);
    if (kept.length > MAX_PIECES) kept = kept.slice(0, MAX_PIECES);
    return { status: 'ok', pieces: kept.map((o) => o.ring), dropped: out.length - kept.length };
  }

  /**
   * Clips one outline ([[lon, lat], …] in degrees, edges are great circles) to land.
   * Returns { status, msg?, pieces, dropped? }, pieces = rings sorted largest first; together they are the separate land parts of ONE country.
   *  'ok' (pieces changed) | 'unchanged' (already all land) | 'empty' (no land inside) | 'toolarge' | 'unsupported' | 'error'
   */
  function clipRing(input) {
    try { return run(input); }
    catch (e) { return { status: 'error', msg: 'The border could not be clipped (' + ((e && e.message) || e) + ').', pieces: [] }; }
  }
  return { clipRing };
}
