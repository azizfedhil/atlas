// node tools/test_camera.mjs -- the smooth camera (web/js/camera.js): eased, cursor-anchored zoom, 1:1 drag, fling on release.
// Deterministic: a fake clock drives it frame by frame, so no browser is needed.
import { createCamera, wheelPixels, ZOOM_TAU, FLING_MIN, FLING_TAU } from '../web/js/camera.js';
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const near = (a, b, eps) => Math.abs(a - b) <= eps;

// ---- wheel normalisation ----
ok(wheelPixels({ deltaY: 100, deltaMode: 0 }) === 100, 'pixel deltas pass through');
ok(wheelPixels({ deltaY: 3, deltaMode: 1 }) === 120, 'line deltas (Firefox) are scaled to pixels');
ok(wheelPixels({ deltaY: 1, deltaMode: 2 }) === 300, 'page deltas are scaled and clamped');
ok(wheelPixels({ deltaY: -5000, deltaMode: 0 }) === -300, 'a huge event is clamped, so one event cannot fling the zoom');

// ---- helpers ----
const W = 1200, H = 800;
function rig(extra = {}) {
  let t = 1000;
  const view = { cx: 0.3, cy: -0.2, scale: 300, lon0: 0.5, lat0: 0.1 };
  const cam = createCamera({ view, clock: () => t, limits: () => [180, 8400], ...extra });
  const frame = (ms = 16) => { t += ms; return cam.step(W, H, false); };
  const run = (frames, ms = 16) => { for (let i = 0; i < frames; i++) frame(ms); };
  return { view, cam, frame, run, setT: (v) => { t = v; }, tick: () => t };
}
// a drag of `n` steps, one frame (16 ms) apart: the pointer is tracked as the browser reports it, the view follows 1:1
function dragSteps(r, n, dx, dy) {
  let x = 500, y = 400;
  r.cam.track(x, y);
  for (let i = 0; i < n; i++) { x += dx; y += dy; r.cam.track(x, y); r.cam.panBy(dx, dy, false); r.run(1); }
}
const worldUnder = (v, sx, sy) => [v.cx + (sx - W / 2) / v.scale, v.cy - (sy - H / 2) / v.scale];

// ---- a single wheel notch eases, it does not jump ----
{
  const r = rig();
  const s0 = r.view.scale;
  r.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 600, clientY: 400, ctrlKey: false }, W, H);
  ok(r.view.scale === s0, 'the view does not change on the event itself (the ease runs on frames)');
  const target = s0 * Math.exp(100 * 0.0016);
  r.frame(16);
  const first = Math.log(r.view.scale / s0), total = Math.log(target / s0);
  ok(first > 0 && first < 0.6 * total, `first frame moves less than 60 % of the notch (${(first / total * 100).toFixed(0)} %)`);
  let prev = r.view.scale, mono = true;
  for (let i = 0; i < 60; i++) { r.frame(16); if (r.view.scale < prev - 1e-12) mono = false; prev = r.view.scale; }
  ok(mono, 'the zoom only moves in one direction while it eases');
  ok(near(r.view.scale, target, target * 1e-3), 'the notch reaches its target');
  ok(!r.cam.active(), 'the camera is at rest after the ease');
  // time constant: after one tau the zoom is about 63 % of the way
  const r2 = rig(); r2.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 600, clientY: 400 }, W, H);
  const s2 = r2.view.scale; r2.run(Math.round(ZOOM_TAU * 1000 / 16));
  const frac = Math.log(r2.view.scale / s2) / Math.log(target / s2);
  ok(near(frac, 1 - Math.exp(-1), 0.08), `about 63 % after one time constant (${(frac * 100).toFixed(0)} %)`);
}

// ---- the point under the cursor stays exactly under it during the whole ease ----
{
  const r = rig();
  const sx = 1000, sy = 230;
  const before = worldUnder(r.view, sx, sy);
  for (let i = 0; i < 6; i++) r.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: sx, clientY: sy }, W, H);
  let worst = 0;
  for (let i = 0; i < 80; i++) {
    r.frame(16);
    const p = worldUnder(r.view, sx, sy);
    worst = Math.max(worst, Math.hypot(p[0] - before[0], p[1] - before[1]) * r.view.scale);     // in screen px
  }
  ok(worst < 1e-6, `cursor-anchored zoom: the pinned point drifts ${worst.toExponential(1)} px during the ease`);
}

// ---- notches accumulate; a moving cursor re-anchors without a jump ----
{
  const r = rig();
  const s0 = r.view.scale;
  for (let i = 0; i < 6; i++) r.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 600, clientY: 400 }, W, H);
  r.run(120);
  ok(near(r.view.scale, s0 * Math.exp(6 * 100 * 0.0016), s0 * 1e-3), 'six notches multiply up (x' + (r.view.scale / s0).toFixed(3) + ')');
  // a notch at a new cursor position in the middle of an ease: the view must not jump on the event
  const r2 = rig(); r2.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 300, clientY: 200 }, W, H); r2.run(3);
  const before = { cx: r2.view.cx, cy: r2.view.cy, s: r2.view.scale };
  r2.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 900, clientY: 600 }, W, H);
  ok(r2.view.cx === before.cx && r2.view.cy === before.cy && r2.view.scale === before.s, 'a new cursor position does not move the view until the next frame');
  const p = worldUnder(r2.view, 900, 600); r2.frame(16);
  const q = worldUnder(r2.view, 900, 600);
  ok(Math.hypot(p[0] - q[0], p[1] - q[1]) * r2.view.scale < 1e-6, 'and the new anchor holds from the first frame');
}

// ---- limits: zoom clamps to the app's range ----
{
  const r = rig();
  for (let i = 0; i < 60; i++) r.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 600, clientY: 400 }, W, H);
  r.run(400);
  ok(near(r.view.scale, 8400, 1e-6), 'zooming in stops at the maximum (' + r.view.scale.toFixed(1) + ')');
  for (let i = 0; i < 80; i++) r.cam.wheel({ deltaY: 100, deltaMode: 0, clientX: 600, clientY: 400 }, W, H);
  r.run(400);
  ok(near(r.view.scale, 180, 1e-6), 'zooming out stops at the minimum (' + r.view.scale.toFixed(1) + ')');
}

// ---- pinch (ctrl + wheel): trackpads send many small deltas, each one a gentle step ----
{
  const r = rig(); const s0 = r.view.scale;
  r.cam.wheel({ deltaY: -4, deltaMode: 0, clientX: 600, clientY: 400, ctrlKey: true }, W, H);
  r.run(120);
  ok(near(r.view.scale / s0, Math.exp(4 * 0.01), 1e-3), 'a 4 px pinch step zooms by about 4 %');
}

// ---- stop(): cancels the ease and the fling, leaves the view where it is ----
{
  const r = rig(); const s0 = r.view.scale;
  r.cam.wheel({ deltaY: -100, deltaMode: 0, clientX: 600, clientY: 400 }, W, H);
  r.frame(16); r.cam.stop();
  const s1 = r.view.scale; r.run(60);
  ok(r.view.scale === s1 && s1 !== s0 && !r.cam.active(), 'stop() freezes a zoom in progress');
}

// ---- drag: 1:1 with the pointer, flat and globe ----
{
  const r = rig(); const s = r.view.scale, cx0 = r.view.cx, cy0 = r.view.cy;
  r.cam.panBy(60, -30, false);
  ok(near(r.view.cx, cx0 - 60 / s, 1e-12) && near(r.view.cy, cy0 + (-30) / s, 1e-12), 'flat drag moves the projected centre by exactly the pointer delta / scale');
  const g = rig(); const l0 = g.view.lon0, a0 = g.view.lat0;
  g.cam.panBy(30, 20, true);
  ok(near(g.view.lon0, l0 - 30 / 300, 1e-12) && near(g.view.lat0, a0 + 20 / 300, 1e-12), 'globe drag rotates lon0 / lat0');
  g.cam.panBy(1e6, 1e6, true);
  ok(g.view.lat0 <= Math.PI / 2 + 1e-12, 'globe latitude is clamped at the pole');
  const w = rig({ view: { cx: 0, cy: 0, scale: 300, lon0: 3.1, lat0: 0 } });
  w.cam.panBy(-100, 0, true);
  ok(w.view.lon0 >= -Math.PI && w.view.lon0 <= Math.PI, 'globe longitude wraps into [-pi, pi]');
}

// ---- fling: a fast release keeps moving and decelerates; a slow or rested release stops ----
{
  const r = rig(); const s = r.view.scale;
  dragSteps(r, 8, 10, 0);                                                   // 10 px every 16 ms = 625 px/s
  const x0 = r.view.cx;
  r.cam.release();
  ok(r.cam.active(), 'a fast drag flings on release');
  r.run(25);                                                               // 400 ms of frames
  const travelled = (x0 - r.view.cx) * s;                                  // px; the drag went +x, so the centre moved -x
  const expect = 625 * FLING_TAU * (1 - Math.exp(-0.4 / FLING_TAU));       // integral of the decay over 400 ms
  ok(near(travelled, expect, expect * 0.05), `fling distance follows the decay (${travelled.toFixed(0)} px, expected ~${expect.toFixed(0)})`);
  r.run(120);                                                              // 2 s of frames
  ok(!r.cam.active(), 'the fling comes to rest');
}
{
  const r = rig();
  dragSteps(r, 8, 10, 0);
  r.run(10);                                                                  // the pointer rests for 160 ms before letting go
  r.cam.release();
  ok(!r.cam.active(), 'a drag that rests before the release does not fling');
}
{
  const r = rig();
  dragSteps(r, 8, 1, 0);                                                      // 62 px/s, slower than FLING_MIN
  r.cam.release();
  ok(!r.cam.active() && 62.5 < FLING_MIN, 'a slow drag does not fling');
}
{
  const r = rig();
  dragSteps(r, 8, 10, 0);
  r.cam.release();
  r.run(5);
  const s = r.view.scale; r.cam.zoomAt(600, 400, 1.5, W, H);
  ok(r.view.scale === s && r.cam.active(), 'a zoom takes over from a fling in progress');
  r.run(200);
  ok(!r.cam.active() && r.view.scale > s, 'and the zoom completes after the takeover');
}

// ---- a zoom button (no cursor): anchored at the viewport centre, same ease ----
{
  const r = rig(); const s0 = r.view.scale;
  r.cam.zoomAt(W / 2, H / 2, 1.5, W, H);
  r.run(120);
  ok(near(r.view.scale, s0 * 1.5, s0 * 1e-3), 'the zoom button eases to x1.5');
  const p = worldUnder(r.view, W / 2, H / 2);
  ok(near(p[0], 0.3, 1e-9) && near(p[1], -0.2, 1e-9), 'the centre of the viewport stays the centre');
}

console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} camera checks passed`);
process.exit(fail ? 1 : 0);
