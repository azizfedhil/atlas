// node tools/test_draw_perf.mjs -- editor.draw() with a stubbed canvas (no browser): land clip count, path caching on pan, curved names.
import * as P from '../web/js/projections.js';
import { createEditor } from '../web/js/editor.js';
let paths = 0;
globalThis.Path2D = class { constructor() { paths++; } moveTo() {} lineTo() {} closePath() {} };
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const def = P.byId('equirect') || P.PROJECTIONS[0], DEG = P.DEG;

const feats = [];
const rect = (id, name, lo0, la0, lo1, la1, kind = 'country') => feats.push({ id, kind, name, color: '#d98c8c', rings: [[[lo0, la0], [lo1, la0], [lo1, la1], [lo0, la1]]], life: { from: null, to: null }, ...(kind === 'range' ? { density: 1 } : {}) });
for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) rect(`c${i}-${j}`, 'LAND' + String.fromCharCode(65 + ((i * 6 + j) % 26)), -80 + i * 20, -50 + j * 18, -62 + i * 20, -36 + j * 18);
rect('strip', 'STRIPE', -60, 70, 20, 74);                              // 80 x 4 degrees: too thin for the old bbox rule
rect('mts', 'RIDGE', 100, 20, 130, 28, 'range');
const store = { features: feats, find: (id) => feats.find((f) => f.id === id) };
const coast = [Float64Array.from([-3, -1.5, 3, -1.5, 3, 1.5, -3, 1.5])];   // one big landmass (radians) so the land clip is active

const counts = {}, text = [];
const ctx = new Proxy({}, {
  get: (_, k) => {
    if (k === 'getTransform') return () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    if (k === 'measureText') return () => ({ width: 40 });
    return (...x) => { counts[k] = (counts[k] || 0) + 1; if (k === 'fillText') text.push(x[0]); };
  }, set: () => true,
});
const view = (cx) => ({ def, cx, cy: 0, scale: 344, lon0: 0, lat0: 0, w: 1600, h: 900, zoomRel: 2 });
const ed = createEditor({ store, getView: () => view(0), getCoast: () => coast, requestRender: () => {} });

ed.draw(ctx, view(0));
ok((counts.clip || 0) <= 2, 'one land clip for the areas + one for the ranges, not one per country (clip x' + counts.clip + ')');
ok((counts.fill || 0) >= 48, 'all countries filled (' + counts.fill + ')');
const built = paths; ok(built > 0, 'paths built on the first frame (' + built + ')');
const joined = text.join('');
ok(joined.includes('STRIPE'), 'the 4-degree strip gets its name along its length');
ok(joined.includes('RIDGE'), 'the mountain range gets its name');
ok(text.length > 100, 'names drawn glyph by glyph (' + text.length + ' glyphs)');

for (const k of Object.keys(counts)) delete counts[k]; text.length = 0;
ed.draw(ctx, view(0.05));                                               // panned
ok(paths === built, 'a pan builds no new Path2D (' + (paths - built) + ' new)');
ok((counts.clip || 0) <= 2, 'still at most 2 clips per frame after a pan');
ok(text.join('').includes('STRIPE'), 'names survive the pan');

// interacting: ranges skip the blur
for (const k of Object.keys(counts)) delete counts[k];
const sh = []; const ctx2 = new Proxy({}, { get: (_, k) => (k === 'getTransform' ? () => ({ a: 1 }) : k === 'measureText' ? () => ({ width: 40 }) : () => {}), set: (_, k, v) => { if (k === 'shadowBlur') sh.push(v); return true; } });
ed.draw(ctx2, { ...view(0.05), interacting: true }); ok(sh.length === 0, 'no shadow blur while the view is moving');
ed.draw(ctx2, { ...view(0.05), interacting: false }); ok(sh.length === 2, 'two blurred passes per range once it rests (' + sh.length + ')');
ok(ed.timings.total >= 0 && 'polys' in ed.timings && 'names' in ed.timings, 'timings exposed');

// zoomed far out: tiny countries are not labelled, nothing throws
ed.draw(ctx, { ...view(0), scale: 20 });
console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} draw/perf checks passed`); process.exit(fail ? 1 : 0);
