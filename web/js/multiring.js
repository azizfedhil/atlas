// Multi-part outlines. A country or subdivision is ONE feature; its `rings` are its separate pieces of land (an island is just another
// ring of the same feature). A "shape" is that array of rings: flat [lon, lat] rings that do not overlap. Pure functions on shapes,
// built on the planar booleans of polyops.js. A pair of rings is only handed to polyops when their boxes meet, so the cost follows the
// rings that really overlap, not the size of the whole country. Shapes are read-only: never change a shape or its rings in place.
import { unionRings, intersectRings, subtractRings, overlaps, planarArea } from './polyops.js';

export const MIN_PIECE = 1e-8;                 // deg^2: smaller leftovers of a boolean are noise and are dropped
const SHIFTS = [0, -360, 360];                 // longitudes may be one world apart

/** [minLon, minLat, maxLon, maxLat] of a ring */
export function boxOf(ring) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]; if (!p) continue;
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return [x0, y0, x1, y1];
}
/** do two boxes meet (pad in degrees; also when one is a world to the side of the other) */
export function boxesTouch(a, b, pad = 0) {
  if (a[3] + pad < b[1] || b[3] + pad < a[1]) return false;
  for (let i = 0; i < 3; i++) { const s = SHIFTS[i]; if (a[2] + pad >= b[0] + s && a[0] - pad <= b[2] + s) return true; }
  return false;
}
export const shapeArea = (shape) => { let s = 0; for (const r of shape) s += planarArea(r); return s; };
const sameArea = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, a, b);

/** The shape with the ring `add` joined in: every ring that overlaps or touches it becomes ONE outline with it, the others stay as they are.
 *  When `add` touches nothing it becomes a new separate part. Untouched rings keep their identity.
 *  Returns { rings, merged } - merged = how many existing rings were joined (0 = `add` is a new separate part). */
export function shapeAdd(shape, add) {
  let acc = add; const used = new Set();
  for (let again = true; again;) {
    again = false;
    const ab = boxOf(acc);
    for (let i = 0; i < shape.length; i++) {
      if (used.has(i) || !boxesTouch(ab, boxOf(shape[i]))) continue;
      const u = unionRings(shape[i], acc);
      if (u.length !== 1 || u[0].length < 3) continue;       // two separate outlines: it does not touch this ring
      acc = u[0]; used.add(i); again = true; break;           // acc grew: look again from the start
    }
  }
  if (!used.size) return { rings: shape.concat([add]), merged: 0 };
  const first = Math.min(...used), rings = [];
  for (let i = 0; i < shape.length; i++) { if (i === first) rings.push(acc); else if (!used.has(i)) rings.push(shape[i]); }
  return { rings, merged: used.size };
}

/** shape - cut (cut is a shape too). Rings the cut does not change keep their identity. Returns [] when nothing is left. */
export function shapeSubtract(shape, cut, cutBoxes = cut.map(boxOf)) {
  let cur = shape;
  for (let k = 0; k < cut.length && cur.length; k++) {
    const cb = cutBoxes[k], next = [];
    for (const r of cur) {
      if (!boxesTouch(boxOf(r), cb)) { next.push(r); continue; }
      const pieces = subtractRings(r, cut[k]), area = planarArea(r);
      let got = 0; for (const p of pieces) got += planarArea(p);
      if (pieces.length === 1 && sameArea(got, area)) { next.push(r); continue; }       // untouched: keep the very same ring
      for (const p of pieces) if (p.length >= 3 && planarArea(p) >= MIN_PIECE) next.push(p);
    }
    cur = next;
  }
  return cur;
}

/** shape intersect clip: every piece of every ring inside the clip's rings. */
export function shapeIntersect(shape, clip, clipBoxes = clip.map(boxOf)) {
  const out = [];
  for (const r of shape) {
    const rb = boxOf(r);
    for (let k = 0; k < clip.length; k++) {
      if (!boxesTouch(rb, clipBoxes[k])) continue;
      for (const p of intersectRings(r, clip[k])) if (p.length >= 3 && planarArea(p) >= MIN_PIECE) out.push(p);
    }
  }
  return out;
}

/** do two shapes share area */
export function shapesOverlap(A, B) {
  const bb = B.map(boxOf);
  for (const a of A) { const ab = boxOf(a); for (let k = 0; k < B.length; k++) if (boxesTouch(ab, bb[k]) && overlaps(a, B[k])) return true; }
  return false;
}
