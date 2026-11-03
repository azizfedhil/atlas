// node tools/test_geometry.mjs -- spherical geometry + undo/redo store
import { ringAreaKm2, ringPerimeterKm, densify, labelAnchor } from '../web/js/spherical.js';
import { createStore } from '../web/js/store.js';
import { DEG } from '../web/js/projections.js';
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } };
const R = 6371;
// octant of the sphere (0,0)-(90E,0)-(0,90N) = 4*pi*R^2/8
const octant = [[0, 0], [90, 0], [0, 90]];
let a = ringAreaKm2(octant, R); ok(Math.abs(a / (Math.PI * R * R / 2) - 1) < 1e-9, 'octant area ' + a);
ok(Math.abs(ringAreaKm2([...octant].reverse(), R) - a) < 1e-6, 'orientation independent');
// 10x10 deg box straddling the equator. Its N/S edges are great-circle arcs, which bow toward the poles, so the
// area must come out slightly LARGER than the parallel-edged lune formula (by ~0.25% here)
const box = [[0, -5], [10, -5], [10, 5], [0, 5]];
const lune = R * R * (10 * DEG) * 2 * Math.sin(5 * DEG);       // upper bound (the exact area with parallel edges)
const ba = ringAreaKm2(box, R); ok(ba > lune && ba < lune * 1.005, `box area ${ba.toFixed(0)} vs ${lune.toFixed(0)}`);
// whole hemisphere via big square ring around the pole: area ~ small side chosen
const cap = [[0, 60], [90, 60], [180, 60], [-90, 60]];
ok(ringAreaKm2(cap, R) < 2 * Math.PI * R * R, 'cap smaller side');
// perimeter: quarter of the equator = pi/2 R
ok(Math.abs(ringPerimeterKm([[0, 0], [90, 0]], R, false) - Math.PI / 2 * R) < 1e-6, 'perimeter');
// densify keeps endpoints and stays on the sphere
const d = densify([[0, 0], [90, 0]], false, 5); ok(d.length / 2 === 19 + 0 || d.length / 2 === 19, 'densify count ' + d.length / 2);
ok(Math.abs(d[d.length - 2] - Math.PI / 2) < 1e-12, 'densify end');
// label anchor of a C-shaped polygon must be inside the polygon
const C = [[0, 0], [30, 0], [30, 10], [10, 10], [10, 20], [30, 20], [30, 30], [0, 30]];
const [ax, ay] = labelAnchor(C); ok(ax > 0 && ax < 30 && ay > 0 && ay < 30 && !(ax > 10 && ay > 10 && ay < 20), `anchor ${ax},${ay}`);
// store undo/redo/live
const s = createStore();
s.edit((f) => f.push({ id: 'a', kind: 'city', name: 'A' }));
s.begin(); s.live((f) => { f[0].name = 'B'; }); s.live((f) => { f[0].name = 'C'; });
ok(s.features[0].name === 'C', 'live edit');
s.undo(); ok(s.features[0].name === 'A', 'undo whole drag in one step');
s.redo(); ok(s.features[0].name === 'C', 'redo');
s.undo(); s.undo(); ok(s.features.length === 0, 'undo add'); ok(!s.canUndo && s.canRedo, 'flags');
console.log(fail ? `\n${fail} FAILURES` : 'geometry + store checks passed'); process.exit(fail ? 1 : 0);
