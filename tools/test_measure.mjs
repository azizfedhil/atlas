// node tools/test_measure.mjs -- measure.js against tests/measure_cases.json (shared with the Rust tests) + properties.
import { readFileSync } from 'node:fs';
import * as M from '../web/js/measure.js';

let fail = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fail++; console.log('FAIL', m); } };
const close = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, `${m}: got ${a} want ${b}`);
const samePt = (a, b, tol, m) => { const dl = ((((a[0] - b[0] + 540) % 360) + 360) % 360) - 180; close(a[1], b[1], tol, m + ' lat'); ok(Math.abs(dl) <= tol || Math.abs(b[1]) > 89.999999, m + ' lon'); };
const throws = (f, m) => { checks++; try { f(); fail++; console.log('FAIL no throw', m); } catch (e) { if (!(e instanceof RangeError)) { fail++; console.log('FAIL type', m); } } };
const G = JSON.parse(readFileSync(new URL('../crates/cosmossi-core/tests/measure_cases.json', import.meta.url), 'utf8'));
const R = G.radiusKm;

for (const d of G.distances) {
  close(M.distanceKm(d.a, d.b, R), d.km, G.tolerance.km, d.name + ' km');
  close(M.initialBearing(d.a, d.b), d.initial, 1e-7, d.name + ' initial');
  close(M.finalBearing(d.a, d.b), d.final, 1e-7, d.name + ' final');
  samePt(M.midpoint(d.a, d.b), d.mid, 1e-7, d.name + ' mid');
}
for (const x of G.reference) {
  const d = G.distances.find((q) => q.name === x.name);
  close(M.distanceKm(d.a, d.b, R), x.kmApprox, x.kmTol, x.name + ' textbook km');
  close(M.initialBearing(d.a, d.b), x.initialApprox, x.initialTol, x.name + ' textbook initial');
  close(M.finalBearing(d.a, d.b), x.finalApprox, x.finalTol, x.name + ' textbook final');
}
for (const d of G.destinations) samePt(M.destination(d.a, d.bearing, d.km, R), d.to, 1e-7, `destination ${d.a} ${d.bearing}`);
for (const p of G.paths) {
  const m = M.measurePath(p.points, R);
  close(m.totalKm, p.totalKm, 1e-6, 'path total'); ok(m.legs.length === p.legs.length, 'leg count');
  m.legs.forEach((g, i) => { close(g.km, p.legs[i].km, 1e-6, 'leg km'); close(g.initialBearing, p.legs[i].initialBearing, 1e-7, 'leg initial'); });
}
for (const [deg, name] of G.compass) ok(M.compassPoint(deg) === name, `compass ${deg}`);

// properties (random but seeded)
let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const rp = () => [rnd() * 360 - 180, Math.asin(rnd() * 2 - 1) / (Math.PI / 180)];
for (let i = 0; i < 2000; i++) {
  const a = rp(), b = rp(), d = M.distanceKm(a, b, R);
  close(M.distanceKm(b, a, R), d, 1e-9, 'symmetry');
  if (d > 1e-3 && Math.PI * R - d > 1e-3) {
    samePt(M.destination(a, M.initialBearing(a, b), d, R), b, 1e-6, 'destination undoes distance+bearing');
    close(M.distanceKm(a, M.midpoint(a, b), R), d / 2, 1e-6, 'midpoint halves');
  }
}
const arc = M.arcPoints([20, 30], [-160, -30], 10);
close(arc.slice(1).reduce((s, p, i) => s + M.distanceKm(arc[i], p, R), 0), Math.PI * R, 1e-3, 'antipodal arc is a half circle');
ok(M.arcPoints([0, 0], [90, 0], 0.5).length === 181, 'arc point count'); ok(M.arcPoints([1, 1], [1, 1], 1).length === 2, 'zero arc');
const sixth = M.measurePath([[0, 0], [30, 40], [-50, 10]], 1000).totalKm, third = M.measurePath([[0, 0], [30, 40], [-50, 10]], 3000).totalKm;
close(third, 3 * sixth, 1e-9, 'scales with radius');
throws(() => M.measurePath([[0, 0], [0, 91]], R), 'lat 91'); throws(() => M.measurePath([[NaN, 0]], R), 'NaN');
throws(() => M.measurePath([[0, 0]], 0), 'radius 0'); throws(() => M.measurePath([[181, 0]], R), 'lon 181');


// ---- area (6.2) ----
{
  let n = 0;
  for (const a of G.areas) {
    const m = M.measureArea(a.points, R);
    close(m.areaKm2, a.areaKm2, 1e-6 * (1 + a.areaKm2), a.name + ' area'); close(m.perimeterKm, a.perimeterKm, 1e-6, a.name + ' perimeter');
    ok(m.vertexCount === a.vertexCount, a.name + ' vertices'); ok(m.selfIntersecting === a.selfIntersecting, a.name + ' selfIntersecting'); n++;
  }
  for (const x of G.areaReference) { const a = G.areas.find((q) => q.name === x.name); close(M.measureArea(a.points, R).areaKm2, x.areaKm2Approx, x.tol, x.name + ' reference'); }
  // independent check: a lat/lon "box" has a closed form only for edges on meridians/parallels; use a polar cap triangle bound instead
  const ring = [[10, 10], [50, 15], [40, 55], [-5, 40]];
  const base = M.measureArea(ring, R).areaKm2;
  close(M.measureArea([...ring].reverse(), R).areaKm2, base, 1e-6, 'reversed ring'); close(M.measureArea([ring[2], ring[3], ring[0], ring[1]], R).areaKm2, base, 1e-6, 'rotated ring');
  close(M.measureArea(ring, 3 * R).areaKm2, 9 * base, 1e-4, 'R^2 scaling');
  // random small spherical triangles: area ~ planar area on the tangent plane (excess formula), and never negative
  let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  for (let i = 0; i < 500; i++) {
    const c = [rnd() * 300 - 150, rnd() * 120 - 60], pts = [0, 1, 2].map(() => [c[0] + (rnd() - 0.5) * 0.4, c[1] + (rnd() - 0.5) * 0.4]);
    const m = M.measureArea(pts, R), D = Math.PI / 180, c1 = c[1] * D;
    // orthographic projection about the centre: distortion is second order, so a planar triangle there is a tight reference
    const [p, q, s] = pts.map((t) => { const dl = (t[0] - c[0]) * D, la = t[1] * D; return [R * Math.cos(la) * Math.sin(dl), R * (Math.cos(c1) * Math.sin(la) - Math.sin(c1) * Math.cos(la) * Math.cos(dl))]; });
    const planar = Math.abs((q[0] - p[0]) * (s[1] - p[1]) - (s[0] - p[0]) * (q[1] - p[1])) / 2;
    ok(m.areaKm2 >= 0 && Math.abs(m.areaKm2 - planar) <= 0.01 * planar + 1e-4, 'small triangle ~ planar ' + m.areaKm2 + ' vs ' + planar);
    ok(!m.selfIntersecting, 'triangle never self-intersects');
  }
  throws(() => M.measureArea([[0, 0], [0, 95], [1, 1]], R), 'bad latitude'); throws(() => M.measureArea([[0, 0]], 0), 'zero radius');
  ok(M.measureArea([], R).areaKm2 === 0 && M.measureArea([[0, 0], [1, 1]], R).areaKm2 === 0, 'fewer than 3 points');
  console.log('area cases:', n);
}

console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} measure checks passed`);
process.exit(fail ? 1 : 0);
