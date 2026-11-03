// node tools/test_gl_cost.mjs -- GPU-side cost guards: Newton iteration counts in the shader and "unchanged view = no redraw" in the renderer.
import { FRAG } from '../web/js/shaders.js';
import * as P from '../web/js/projections.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };

// 1. the iteration counts in the GLSL are enough (same maths in float64, reference = 60 steps)
const loops = [...FRAG.matchAll(/for \(int i = 0; i < (\d+); i\+\+\)/g)].map((m) => +m[1]);
ok(loops.length === 2, 'two Newton loops in the shader (' + loops + ')');
const [nEE, nNE] = loops;
const EA1 = 1.340264, EA2 = -0.081106, EA3 = 0.000893, EA4 = 0.003796;
const ee = (y, N) => { let t = Math.max(-1.1, Math.min(1.1, y / EA1)); for (let i = 0; i < N; i++) { const t2 = t * t, t6 = t2 * t2 * t2; t -= (t * (EA1 + EA2 * t2 + t6 * (EA3 + EA4 * t2)) - y) / (EA1 + 3 * EA2 * t2 + t6 * (7 * EA3 + 9 * EA4 * t2)); } return t; };
const neY = (p) => { const p2 = p * p, p4 = p2 * p2; return p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4))); };
const neYD = (p) => { const p2 = p * p, p4 = p2 * p2, p6 = p4 * p2; return 1.007226 + 3 * 0.015085 * p2 - 7 * 0.044475 * p6 + 9 * 0.028874 * p6 * p2 - 11 * 0.005916 * p6 * p4; };
const ne = (y, N) => { let ph = y; for (let i = 0; i < N; i++) ph -= (neY(ph) - y) / neYD(ph); return ph; };
let e1 = 0, e2 = 0;
for (let y = -P.EE_YMAX; y <= P.EE_YMAX; y += P.EE_YMAX / 3000) e1 = Math.max(e1, Math.abs(ee(y, nEE) - ee(y, 60)));
for (let y = -P.NE_YMAX; y <= P.NE_YMAX; y += P.NE_YMAX / 3000) e2 = Math.max(e2, Math.abs(ne(y, nNE) - ne(y, 60)));
ok(nEE <= 6 && e1 < 1e-9, `Equal Earth: ${nEE} steps, max error ${e1.toExponential(1)} rad`);
ok(nNE <= 8 && e2 < 1e-9, `Natural Earth: ${nNE} steps, max error ${e2.toExponential(1)} rad`);

// 2. renderer: an identical view is not drawn twice; any real change is
globalThis.fetch = async () => ({ ok: true, status: 200, headers: { get: () => 'image/png' }, arrayBuffer: async () => Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]).buffer });
globalThis.createImageBitmap = async () => ({ width: 8, height: 4, close() {} });
let draws = 0;
const gl = new Proxy({}, { get: (_, k) => {
  if (k === 'getShaderParameter' || k === 'getProgramParameter') return () => true;
  if (k === 'getParameter') return () => 8192;
  if (k === 'getExtension') return () => null;
  if (k === 'drawArrays') return () => { draws++; };
  if (/^[A-Z0-9_]+$/.test(String(k))) return 1;
  return () => ({});
}, set: () => true });
const canvas = { width: 0, height: 0, getContext: () => gl };
globalThis.window = { devicePixelRatio: 2 };
const { createRenderer } = await import('../web/js/renderer.js');
const r = await createRenderer(canvas, { biomeUrl: 'b.png', auxUrl: 'a.png' });
r.resize(800, 400);
const v = () => ({ cx: 0, cy: 0, scale: 100, dpr: 2, glId: 0, lon0: 0, lat0: 0, refAlpha: 0, layers: { biomes: true, rivers: true, ripples: true, ink: true } });
r.draw(v()); ok(draws === 1, 'first draw happens');
r.draw(v()); ok(draws === 1, 'identical view: no second draw (' + draws + ')');
const w = v(); w.cx = 0.01; r.draw(w); ok(draws === 2, 'panned view draws');
const z = v(); z.cx = 0.01; z.scale = 101; r.draw(z); ok(draws === 3, 'zoomed view draws');
const l = v(); l.cx = 0.01; l.scale = 101; l.layers.ripples = false; r.draw(l); ok(draws === 4, 'layer toggle draws');
r.resize(800, 400, 1); r.draw(l); ok(draws === 5, 'after a resize the same view draws again (the buffer was cleared)');
r.draw(l); ok(draws === 5, 'and then is skipped again');
r.setReference(null); r.draw(l); ok(draws === 6, 'changing the reference image forces a draw');

console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} GL-cost checks passed`); process.exit(fail ? 1 : 0);
