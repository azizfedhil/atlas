// node tools/test_overlay_snapshot.mjs -- the overlay's pan/zoom snapshot: the shifted bitmap lands exactly where a live draw would,
// it is only used for expensive flat-projection frames, and it is dropped when the content or the projection changes.
import * as P from '../web/js/projections.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };

const calls = [];
const mkCtx = (name) => new Proxy({}, { get: (_, k) => (k === 'getTransform' ? () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) : k === 'measureText' ? () => ({ width: 10 }) : (...a) => { calls.push([name, k, ...a]); }), set: () => true });
const main = mkCtx('main'), canvases = [];
globalThis.document = { createElement: () => { const cv = { width: 0, height: 0, getContext: () => mkCtx('snap' + canvases.length) }; canvases.push(cv); return cv; } };
globalThis.Path2D = class { moveTo() {} lineTo() {} closePath() {} };
let clock = 0; const realNow = performance.now.bind(performance);
globalThis.setTimeout = (fn) => { pending.push(fn); return pending.length; }; globalThis.clearTimeout = () => { pending.length = 0; };
const pending = [], flush = () => { const f = pending.splice(0); f.forEach((fn) => fn()); };
const { createOverlay } = await import('../web/js/overlay.js');
const canvas = { getContext: () => main, style: {}, width: 0, height: 0 };
const ov = createOverlay(canvas); ov.resize(1600, 900, 1);

const flat = P.byId('equirect') || P.PROJECTIONS[0], globe = P.PROJECTIONS.find((p) => p.globe);
let slow = true;
ov.setExtraDraw(() => { const t = realNow(); if (slow) while (realNow() - t < 6); });            // make the live draw "expensive" (>3.5 ms)
const view = (o = {}) => ({ def: flat, cx: 0, cy: 0, scale: 300, lon0: 0, lat0: 0, w: 1600, h: 900, graticuleStep: 0, frame: false, showCoast: false, showRivers: false, zoomRel: 1, political: true, ver: 1, interacting: false, ...o });
const drawImages = () => calls.filter((c) => c[0] === 'main' && c[1] === 'drawImage');

ov.draw(view()); flush();
// canvases[0] is the exact still picture (painted for this view), canvases[1] the margin bitmap the pans / zooms use
ok(canvases.length === 2, 'a snapshot canvas is built after a slow still frame (plus the exact picture)');
ok(canvases[1].width === 1600 + 2 * 400 && canvases[1].height === 900 + 2 * 400, 'snapshot has a 25% margin (' + canvases[1].width + 'x' + canvases[1].height + ')');

// exactness: a projected point must land on the same screen pixel through the blit as in a live draw
calls.length = 0;
const v1 = view({ cx: 0.2, cy: -0.1, scale: 330, interacting: true });
ov.draw(v1);
const di = drawImages(); ok(di.length === 1, 'moving draws the snapshot instead of painting (drawImage x' + di.length + ')');
const sets = calls.filter((c) => c[0] === 'main' && c[1] === 'setTransform'), M = sets.find((c) => c[2] !== 1).slice(2);          // transform in effect for drawImage
const dpr = 1, k = M[0] / dpr, tx = M[4] / dpr, ty = M[5] / dpr, m = 400, s0 = 300;
const p = P.project(flat, 40 * P.DEG, 25 * P.DEG, 0, 0);
const snapX = (1600 + 2 * m) / 2 + (p[0] - 0) * s0, snapY = (900 + 2 * m) / 2 - (p[1] - 0) * s0;      // where the snapshot drew that point
const liveX = 800 + (p[0] - v1.cx) * v1.scale, liveY = 450 - (p[1] - v1.cy) * v1.scale;                // where a live draw puts it
ok(Math.abs(snapX * k + tx - liveX) < 1e-6 && Math.abs(snapY * k + ty - liveY) < 1e-6, 'blit lands on the live position (' + (snapX * k + tx - liveX).toExponential(1) + ', ' + (snapY * k + ty - liveY).toExponential(1) + ')');

// fallbacks. When the snapshot no longer matches (the content changed, the view left its margin or zoomed out of its range, a layer was
// switched, the canvas was resized) it is painted again for the new state and shown at once: a fresh margin bitmap costs about as much as
// a live paint, and the frames after it reuse it. (The older rule was a live paint on every frame until the view rested.)
const painted = (v) => { calls.length = 0; ov.draw(v); return drawImages().length === 0; };                       // a live paint, nothing shown from a bitmap
const repainted = (v) => { calls.length = 0; ov.draw(v); return calls.some((c) => c[0] !== 'main') && drawImages().length === 1; };
const reused = (v) => { calls.length = 0; ov.draw(v); return !calls.some((c) => c[0] !== 'main') && drawImages().length === 1; };
ok(repainted(view({ interacting: true, ver: 2 })), 'content changed -> margin bitmap repainted for it and shown');
ov.draw(view({ ver: 2 })); flush();
ok(repainted(view({ interacting: true, ver: 2, cx: 2.5 })), 'panned beyond the margin -> repainted and shown');
ok(repainted(view({ interacting: true, ver: 2, scale: 300 * 3 })), 'zoomed more than 2.5x -> repainted and shown');
ok(repainted(view({ interacting: true, ver: 2, showCoast: true })), 'layer toggle -> repainted and shown');
ok(reused(view({ interacting: true, ver: 2, showCoast: true, cx: 0.05 })), 'a small pan reuses the snapshot (no repaint)');
const before = canvases.length; ov.draw(view({ def: globe, lon0: 1, lat0: 0.3, ver: 3 })); flush();
ok(canvases.length === before, 'no snapshot for a globe');
ok(painted(view({ def: globe, interacting: true, ver: 3, lon0: 1.1, lat0: 0.3 })), 'globe moves live');

// cheap scenes stay fully live
slow = false; ov.draw(view({ ver: 4 })); flush();
ok(painted(view({ interacting: true, ver: 4, cx: 0.05 })), 'a fast live draw never uses the snapshot');
// export is never served from the snapshot
slow = true; ov.draw(view({ ver: 5 })); flush(); calls.length = 0; ov.draw(view({ ver: 5, interacting: true, exporting: true }));
ok(drawImages().length === 0, 'export draws live');
// resize drops it
ov.resize(1600, 900, 1); ok(repainted(view({ interacting: true, ver: 5 })), 'resize drops the snapshot (it is painted again for the new canvas)');

console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} overlay snapshot checks passed`); process.exit(fail ? 1 : 0);
