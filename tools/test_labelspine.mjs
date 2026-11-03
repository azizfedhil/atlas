// node tools/test_labelspine.mjs -- spine extraction + curved name layout (web/js/labelspine.js)
import { spineOf, thicknessPx, layoutName } from '../web/js/labelspine.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const near = (a, b, t) => Math.abs(a - b) <= t;
const DEG = Math.PI / 180;

// horizontal band 40 x 6 deg at the equator
const band = [[0, -3], [40, -3], [40, 3], [0, 3]];
let sp = spineOf(band);
ok(sp && sp.pts.length === 28, 'band: spine found');
ok(sp.pts[0][0] < sp.pts[27][0], 'band: runs left to right');
ok(sp.pts.every((p) => near(p[1], 0, 1.0)), 'band: stays on the centre line');
ok(sp.len > 30 && sp.len < 41, 'band: length ~ the band (' + sp.len.toFixed(1) + ')');
ok(near(sp.thick[14], 6, 0.5) && sp.thick.every((t) => t <= 6.6), 'band: thickness ~ 6 deg in the middle (' + sp.thick[14].toFixed(2) + ')');

// diagonal band at 45 deg: the spine follows it and is never reversed
const dg = [[0, 0], [30, 30], [34, 26], [4, -4]];
sp = spineOf(dg);
ok(sp && sp.pts[27][0] > sp.pts[0][0] && sp.pts[27][1] > sp.pts[0][1], 'diagonal: rises to the right');

// vertical strip reads bottom to top
sp = spineOf([[0, 0], [5, 0], [5, 40], [0, 40]]);
ok(sp && sp.pts[27][1] > sp.pts[0][1] && near(sp.pts[0][0], 2.5, 1), 'vertical: bottom to top, centred');

// crescent (arc): the spine bends and every sample is inside the shape
const arc = [], R0 = 30, R1 = 40;
for (let a = 20; a <= 160; a += 5) arc.push([R1 * Math.cos(a * DEG), R1 * Math.sin(a * DEG)]);
for (let a = 160; a >= 20; a -= 5) arc.push([R0 * Math.cos(a * DEG), R0 * Math.sin(a * DEG)]);
sp = spineOf(arc);
const pipArc = (pt, ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
ok(sp && sp.pts.every((p) => pipArc(p, arc)), 'crescent: every spine sample inside the shape');
ok(sp.pts[14][1] > sp.pts[0][1] + 5, 'crescent: spine arches up in the middle (' + sp.pts[0][1].toFixed(1) + ' -> ' + sp.pts[14][1].toFixed(1) + ')');

// crossing the antimeridian: continuous, no jump of ~360 deg
const seam = [[165, -3], [-165, -3], [-165, 3], [165, 3]];
sp = spineOf(seam);
ok(sp && sp.pts.every((p, i) => i === 0 || Math.abs(((p[0] - sp.pts[i - 1][0] + 540) % 360) - 180) < 5), 'seam: samples continuous across 180');
ok(sp.pts.every((p) => Math.abs(p[0]) > 160), 'seam: samples stay near 180');

// steep, moderately elongated shape: text is tilted at most 60 deg (stacked vertical letters look wrong)
const steep = []; for (let a = 0; a < 360; a += 10) { const x = 6 * Math.cos(a * DEG), y = 18 * Math.sin(a * DEG), r = 80 * DEG; steep.push([x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]); }
sp = spineOf(steep);
ok(sp && Math.abs(sp.angle) <= 60 * DEG + 1e-9, 'steep shape: axis clamped to 60 deg (' + (sp.angle / DEG).toFixed(0) + ')');
// a ragged diagonal band gives a straight spine, not a wobble
const rag = [[0, 0], [10, 8], [20, 20], [30, 28], [40, 40], [44, 36], [34, 24], [24, 14], [14, 4], [4, -4]];
sp = spineOf(rag);
const sl = (sp.pts[27][1] - sp.pts[0][1]) / (sp.pts[27][0] - sp.pts[0][0]);
ok(sp.pts.every((p) => Math.abs(p[1] - (sp.pts[0][1] + sl * (p[0] - sp.pts[0][0]))) < 2), 'ragged band: spine is (nearly) straight');
// degenerate input
ok(spineOf(null) === null && spineOf([[0, 0], [1, 1]]) === null, 'degenerate: null');
ok(spineOf([[0, 0], [0, 0], [0, 0]]) === null, 'zero-area: null');
// a round blob still gets a (horizontal) spine
const circ = []; for (let a = 0; a < 360; a += 10) circ.push([10 * Math.cos(a * DEG), 10 * Math.sin(a * DEG)]);
sp = spineOf(circ);
ok(sp && near(sp.pts[0][1], sp.pts[27][1], 1.5), 'round: horizontal');
// L / C shaped country: spine samples are inside the polygon
const C = [[0, 0], [30, 0], [30, 8], [8, 8], [8, 22], [30, 22], [30, 30], [0, 30]];
sp = spineOf(C);
const pip = (pt, ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
ok(sp && sp.pts.every((p) => pip(p, C)), 'C shape: every spine sample inside');

// layout
const chars = [...'ABCD'], adv = [0.7, 0.7, 0.7, 0.7];
const line = Array.from({ length: 28 }, (_, i) => [i * 10, 100]), thick = new Array(28).fill(80);
let L = layoutName(line, thick, chars, adv, { maxSize: 30 });
ok(L && L.size === 30, 'layout: size capped at maxSize');
ok(L.spacing > 30 * 0.08 && L.spacing <= 30 * 0.45 + 1e-9, 'layout: spacing grows to fill, capped at 0.45 em (' + L.spacing.toFixed(1) + ')');
ok(L.glyphs.length === 4 && L.glyphs.every((g) => near(g.a, 0, 1e-9)), 'layout: straight spine -> zero angle');
ok(near((L.glyphs[0].x + L.glyphs[3].x) / 2, 135, 1), 'layout: centred on the spine');
ok(L.glyphs.every((g, i) => i === 0 || g.x > L.glyphs[i - 1].x), 'layout: glyphs advance');
// too long for a thin short spine: shrinks, or gives up under minSize
L = layoutName(line.slice(0, 5), new Array(5).fill(80), [...'ABCDEFGHIJ'], new Array(10).fill(0.7), { maxSize: 50 });
ok(L === null || L.size < 50, 'layout: shrinks to fit');
ok(layoutName(line.slice(0, 3), new Array(3).fill(80), [...'ABCDEFGHIJ'], new Array(10).fill(0.7)) === null, 'layout: null when it would be below minSize');
ok(layoutName(line, new Array(28).fill(10), chars, adv) === null, 'layout: null when too thin for minSize');
// reversed (right to left) spine is flipped so text is never upside down
L = layoutName(line.slice().reverse(), thick, chars, adv, { maxSize: 30 });
ok(L && L.glyphs.every((g) => Math.abs(g.a) < 1e-9), 'layout: right-to-left spine flipped upright');
// word gaps are wider than letter gaps
L = layoutName(line, thick, [...'AB CD'], [0.7, 0.7, 0.3, 0.7, 0.7], { maxSize: 30 });
ok(L && (L.glyphs[2].x - L.glyphs[1].x) > (L.glyphs[1].x - L.glyphs[0].x), 'layout: word gap wider than letter gap');
// curved spine: angles follow the tangent
const curve = Array.from({ length: 28 }, (_, i) => { const t = (i / 27) * Math.PI; return [200 - 200 * Math.cos(t), 200 - 100 * Math.sin(t)]; });
L = layoutName(curve, new Array(28).fill(80), [...'ABCDEFG'], new Array(7).fill(0.7), { maxSize: 24 });
ok(L && L.glyphs[0].a < 0 && L.glyphs[6].a > 0, 'layout: letters rotate with the curve (' + L.glyphs[0].a.toFixed(2) + ' .. ' + L.glyphs[6].a.toFixed(2) + ')');
// a name stays on the part of the spine that is wide enough for it (a thick body with a thin tail: the text must not run into the tail)
const taper = Array.from({ length: 28 }, (_, i) => [i * 10, 100]), tthick = taper.map((_, i) => (i < 16 ? 90 : 12));
L = layoutName(taper, tthick, [...'NORTHLAND'], new Array(9).fill(0.7), { maxSize: 30 });
ok(L && L.glyphs.every((g) => g.x <= 160 + 1e-6), 'layout: no letter on the thin tail (last x ' + (L && L.glyphs[L.glyphs.length - 1].x.toFixed(0)) + ')');
// letter spacing is capped by maxSpace
L = layoutName(line, thick, [...'AB'], [0.7, 0.7], { maxSize: 20, maxSpace: 0.3 });
ok(L && L.spacing <= 20 * 0.3 + 1e-9, 'layout: spacing capped at maxSpace');

// thicknessPx scales by the projection ratio
sp = spineOf(band);
const scr = sp.loc.map(([x, y]) => [x * 5, -y * 5]);
const tp = thicknessPx(scr, sp);
ok(tp.every((t, i) => near(t, sp.thick[i] * 5, 1e-6)), 'thicknessPx: scales with px per unit');

console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} label-spine checks passed`); process.exit(fail ? 1 : 0);
