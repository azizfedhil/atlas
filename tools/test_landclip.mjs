// node tools/test_landclip.mjs -- land test + clipping on synthetic coasts and on the real baked coastline.
import { readFileSync } from 'node:fs';
import { createLandClip } from '../web/js/landclip.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const R = (a) => Float64Array.from(a, (x) => x * Math.PI / 180);
// land is on the RIGHT of travel: a clockwise square (10..20) is an island; the open "bay" contour goes down a notch
const island = R([10, 10, 10, 20, 20, 20, 20, 10, 10, 10]);                    // clockwise: (10,10)->(10,20)->(20,20)->(20,10)
const lc = createLandClip([island]);
ok(lc.isLand(15, 15), 'inside the island is land'); ok(!lc.isLand(5, 15), 'outside is water'); ok(!lc.isLand(25, 5), 'far outside is water');
const t = lc.toLand([5, 15]); ok(t.moved && Math.abs(t.ll[0] - 10) < 1e-6 && Math.abs(t.ll[1] - 15) < 1e-6, 'water point snaps to nearest coast point');
ok(!lc.toLand([15, 15]).moved, 'land point is left alone');
ok(lc.clipSegment([12, 12], [18, 18]).length === 0, 'edge inside land needs no clipping');
// C-shaped peninsula: land on the right of a clockwise outline with a notch cut from the top
const C = createLandClip([R([0, 0, 0, 10, 4, 10, 4, 4, 6, 4, 6, 10, 10, 10, 10, 0, 0, 0])]);   // notch x 4..6, y 4..10 is water
ok(C.isLand(2, 8) && C.isLand(8, 8) && !C.isLand(5, 8), 'notch is water');
const path = C.clipSegment([2, 8], [8, 8]);
ok(path.length >= 4, 'edge across the notch follows the notch: ' + JSON.stringify(path));
ok(path.some((p) => Math.abs(p[1] - 4) < 1e-6), 'path reaches the bottom of the notch');
ok(path.every((p) => C.nearest(p[0], p[1]).d < 1e-6), 'every inserted point lies on the coast');
// real data
const j = JSON.parse(readFileSync(new URL('../web/data/coast.json', import.meta.url)));
const real = createLandClip(j.coast.map((p) => Float64Array.from(p, (v) => v / 100 * Math.PI / 180)));
let agree = 0, tot = 0;                                                        // sample points just either side of coast segments
for (let s = 0; s < 400; s++) {
  const p = j.coast[(s * 7) % j.coast.length]; if (p.length < 40) continue;
  const i = ((s * 13) % (p.length / 2 - 2)) * 2, ax = p[i] / 100, ay = p[i + 1] / 100, bx = p[i + 2] / 100, by = p[i + 3] / 100, L = Math.hypot(bx - ax, by - ay);
  if (!L || L > 1) continue; const nx = -(by - ay) / L * 0.02, ny = (bx - ax) / L * 0.02, mx = (ax + bx) / 2, my = (ay + by) / 2;
  tot++; if (!real.isLand(mx + nx, my + ny) && real.isLand(mx - nx, my - ny)) agree++;
}
ok(tot > 50 && agree / tot > 0.95, `real coast: water left / land right agree for ${agree}/${tot}`);
const t0 = performance.now(); for (let k = 0; k < 50; k++) real.clipSegment([-5 + k * 0.1, 40], [25, 45]); const ms = (performance.now() - t0) / 50;
ok(ms < 40, `clipSegment on the real coast is fast enough (${ms.toFixed(1)} ms)`);
console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} landclip checks passed`); process.exit(fail ? 1 : 0);
