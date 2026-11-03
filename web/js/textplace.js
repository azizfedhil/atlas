// Shared collision grid for map text (country / subdivision / range names, text labels, city names). Pure: no DOM, no canvas.
// Boxes are [x0, y0, x1, y1] in screen px. A name is tested letter by letter (glyphsHit), so a curved or slanted name does not
// claim the empty corners of its bounding box.

/** cell: grid cell size in px. The grid only holds the few boxes near a point, so a test never scans every name placed so far. */
export function createPlacer(cell = 48) {
  const grid = new Map(), key = (gx, gy) => (gx + 32768) * 65536 + (gy + 32768);
  return {
    /** true when the box overlaps one that was added */
    hit(x0, y0, x1, y1) {
      for (let gx = Math.floor(x0 / cell), ex = Math.floor(x1 / cell); gx <= ex; gx++) {
        for (let gy = Math.floor(y0 / cell), ey = Math.floor(y1 / cell); gy <= ey; gy++) {
          const l = grid.get(key(gx, gy));
          if (l) for (const q of l) if (x0 < q[2] && x1 > q[0] && y0 < q[3] && y1 > q[1]) return true;
        }
      }
      return false;
    },
    add(x0, y0, x1, y1) {
      const b = [x0, y0, x1, y1];
      for (let gx = Math.floor(x0 / cell), ex = Math.floor(x1 / cell); gx <= ex; gx++) {
        for (let gy = Math.floor(y0 / cell), ey = Math.floor(y1 / cell); gy <= ey; gy++) {
          const k = key(gx, gy), l = grid.get(k);
          if (l) l.push(b); else grid.set(k, [b]);
        }
      }
    },
  };
}

const box = [0, 0, 0, 0];                                           // reused: no allocation per letter
/** the screen box of one letter: glyph { x, y, a (angle), w (advance px) }, mapped by x * kk + ox, y * kk + oy */
function glyphBox(g, size, kk, ox, oy, pad) {
  const w = (g.w || size * 0.6) * kk, h = size * kk * 0.8, c = Math.abs(Math.cos(g.a)), s = Math.abs(Math.sin(g.a));
  const hw = (c * w + s * h) / 2 + pad, hh = (s * w + c * h) / 2 + pad, x = g.x * kk + ox, y = g.y * kk + oy;
  box[0] = x - hw; box[1] = y - hh; box[2] = x + hw; box[3] = y + hh;
  return box;
}
/** true when any letter of this laid-out name would land on text that was already added */
export function glyphsHit(placer, glyphs, size, kk = 1, ox = 0, oy = 0, pad = 2) {
  for (const g of glyphs) { const b = glyphBox(g, size, kk, ox, oy, pad); if (placer.hit(b[0], b[1], b[2], b[3])) return true; }
  return false;
}
/** reserves the place of every letter of this name */
export function glyphsAdd(placer, glyphs, size, kk = 1, ox = 0, oy = 0, pad = 2) {
  for (const g of glyphs) { const b = glyphBox(g, size, kk, ox, oy, pad); placer.add(b[0], b[1], b[2], b[3]); }
}
