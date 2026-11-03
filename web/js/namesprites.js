// Cached name pictures for the pan bitmap (Batch 10). Pure: no DOM except makeCanvas().
//
// Setting a country name costs a layout (spine -> font size, spacing, one position per glyph) plus two text draws per letter
// (halo, then fill). Doing that for every name on every pan-bitmap rebuild was the biggest CPU cost of a rebuild (about 20 ms of
// a 55 ms rebuild in a recorded session) and the text rasteriser was a large part of the GPU cost after it. A name's picture does
// not depend on where the view is, only on the projection, the shape, the text, the theme and the zoom, so it is painted once per
// zoom bucket (a step of 2^(1/8), 9%) and every later rebuild only places it.
export const SPRITE_STEPS = 8;
export const bucketOf = (scale) => Math.round(Math.log2(scale) * SPRITE_STEPS);
export const scaleOfBucket = (b) => Math.pow(2, b / SPRITE_STEPS);

/** an off-screen canvas: OffscreenCanvas where it exists (cheaper to create and to draw from), else a detached <canvas> */
export function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') { try { return new OffscreenCanvas(w, h); } catch (_) { /* fall through to a <canvas> */ } }
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
}

/**
 * LRU cache of sprites with a pixel budget. An entry is { px, ... } (px = its size in device pixels, 0 for "no picture").
 * `name` identifies one name in one variant (feature, shape revision, text, theme, device scale); `b` is the zoom bucket.
 */
export function createSpriteCache({ budgetPx = 12e6 } = {}) {
  const map = new Map(), byName = new Map();             // "name#b" -> { e, name, b } (insertion order = least recently used first); name -> Map(b -> e)
  let px = 0;
  const drop = (key) => {
    const o = map.get(key); if (!o) return;
    map.delete(key); px -= o.e.px || 0;
    const m = byName.get(o.name); if (m) { m.delete(o.b); if (!m.size) byName.delete(o.name); }
  };
  return {
    get(name, b) {
      const key = name + '#' + b, o = map.get(key);
      if (!o) return undefined;
      map.delete(key); map.set(key, o);                  // most recently used goes last
      return o.e;
    },
    put(name, b, e) {
      const key = name + '#' + b; drop(key);
      map.set(key, { e, name, b }); px += e.px || 0;
      let m = byName.get(name); if (!m) byName.set(name, (m = new Map())); m.set(b, e);
      while (px > budgetPx && map.size > 1) drop(map.keys().next().value);    // never the one just added (it is last)
      return e;
    },
    /** the cached entry of the same name whose bucket is closest to b (within maxDist buckets), or undefined */
    nearest(name, b, maxDist = 6) {
      const m = byName.get(name); if (!m) return undefined;
      let best, bd = maxDist + 1;
      for (const [bb, e] of m) { const d = Math.abs(bb - b); if (d < bd) { bd = d; best = e; } }
      return best;
    },
    clear() { map.clear(); byName.clear(); px = 0; },
    get size() { return map.size; },
    get px() { return px; },
  };
}
