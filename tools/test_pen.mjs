// node tools/test_pen.mjs -- Bezier flattening, splitting, default handles and the editor/Rust wiring of the pen tool.
import { readFileSync } from 'node:fs';
import { flattenRing, splitSegment, curveMid, defaultHandle, hasHandle, segmentCurved } from '../web/js/pen.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const close = (a, b, e = 1e-9) => Math.abs(a[0] - b[0]) < e && Math.abs(a[1] - b[1]) < e;
const sq = [[0, 0], [10, 0], [10, 10], [0, 10]];
ok(flattenRing(sq, undefined).length === 4 && flattenRing(sq, [null, null, null, null]).length === 4, 'no handles: ring unchanged');
const hs = [null, { i: [0, -3], o: [0, 3] }, null, null];
ok(segmentCurved(hs, 1, 2) && segmentCurved(hs, 0, 1) && !segmentCurved(hs, 2, 3), 'only segments touching a handle are curved');
const f = flattenRing(sq, hs); ok(f.length > 4 + 14, 'curved segments gain sample points: ' + f.length);
ok(f.some((p) => close(p, sq[2])) && f.some((p) => close(p, sq[0])), 'original vertices are kept');
// split keeps the shape: first half evaluated at its midpoint == original at t = 0.25
const a = [0, 0], ha = { i: [0, 0], o: [2, 4] }, b = [10, 0], hb = { i: [-2, 4], o: [0, 0] };
const s = splitSegment(a, ha, b, hb), M = curveMid(a, ha, b, hb);
ok(close(s.pt, M, 1e-9), 'split vertex lies on the curve midpoint');
const flatBefore = flattenRing([a, b], [ha, hb], false), flatAfter = flattenRing([a, s.pt, b], [s.a, s.mid, s.b], false);
const dist = (p, poly) => Math.min(...poly.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])));
ok(flatBefore.every((p) => dist(p, flatAfter) < 0.25), 'curve is unchanged by splitting');
// antimeridian: a curve between 179 and -179 stays inside [-180, 180] and goes the short way
const am = flattenRing([[179, 0], [-179, 0]], [{ i: [0, 0], o: [0.5, 1] }, { i: [-0.5, 1], o: [0, 0] }], false);
ok(am.every((p) => p[0] >= -180 && p[0] <= 180) && am.every((p) => Math.abs(p[0]) > 176), 'wraps across the antimeridian');
const dh = defaultHandle([[0, 0], [5, 0], [10, 0]], 1); ok(close(dh.o, [5 / 3, 0], 1e-9) && close(dh.i, [-5 / 3, 0], 1e-9), 'default handle is tangent');
ok(hasHandle(dh) && !hasHandle(null) && !hasHandle({ i: [0, 0], o: [0, 0] }), 'hasHandle');
const ed = readFileSync(new URL('../web/js/editor.js', import.meta.url), 'utf8'), rs = readFileSync(new URL('../crates/cosmossi-core/src/project.rs', import.meta.url), 'utf8');
ok(/function penDown/.test(ed) && /Delete/.test(ed) && /type: 'handle'/.test(ed), 'editor has pen down, Delete key, handle drag');
ok(/pub handles: Vec<Option<Handle>>/.test(rs), 'Rust keeps handles');
console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} pen checks passed`); process.exit(fail ? 1 : 0);
