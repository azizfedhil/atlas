// node tools/test_navigation_ui.mjs -- OPTIONAL browser test of the map navigation (needs Playwright + Chromium).
// Checks the feel, not the pixels: the zoom eases (many frames, one direction), the point under the cursor stays put while it does,
// a drag moves the map 1:1, a flick keeps moving and a press stops it, brush mode still does not pan, globes rotate, the buttons and
// double click zoom eased, and the drawing resolution changes once per gesture (not once per pause).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import('playwright');
const root = fileURLToPath(new URL('../web/', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
const server = createServer(async (q, res) => {
  try { const p = normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[/\\])+/, ''); const body = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
// count the drawing-buffer resizes of the GL canvas (each one reallocates the buffer): the navigation should change it once per gesture
await pg.addInitScript(() => {
  window.__glResizes = 0;
  const d = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'width');
  Object.defineProperty(HTMLCanvasElement.prototype, 'width', { configurable: true, get() { return d.get.call(this); }, set(v) { if (this.id === 'gl') window.__glResizes++; d.set.call(this, v); } });
});
await pg.goto(`${base}/index.html`);
await pg.waitForFunction(() => window.__atlasReady || window.__atlasError, null, { timeout: 60000 });
await pg.waitForTimeout(800);
const r = []; const ok = (c, m) => r.push([!!c, m]);
// one sample per animation frame of the view (scale, centre, orientation)
await pg.evaluate(() => { window.__rec = []; const A = window.__atlas; const loop = (t) => { const s = A.state; window.__rec.push({ t, s: s.scale, cx: s.cx, cy: s.cy, lon0: s.lon0, lat0: s.lat0 }); if (window.__rec.length > 4000) window.__rec.shift(); requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
const idle = async () => {                                          // until the camera is at rest and the frames have caught up
  const t0 = Date.now(); await pg.waitForTimeout(150);
  while (await pg.evaluate(() => window.__atlas.camera().active()) && Date.now() - t0 < 60000) await pg.waitForTimeout(100);
  await pg.waitForTimeout(250);
};
const view = () => pg.evaluate(() => { const s = window.__atlas.state; return { s: s.scale, cx: s.cx, cy: s.cy, lon0: s.lon0, lat0: s.lat0 }; });
const frames = () => pg.evaluate(() => window.__rec.slice());
const clear = () => pg.evaluate(() => { window.__rec = []; window.__glResizes = 0; });
const worldAt = (v, sx, sy) => [v.cx + (sx - 640) / v.s, v.cy - (sy - 400) / v.s];   // 1280 x 800 window
const dims = () => pg.evaluate(() => ({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio }));

// ---- start from a known view (the fitted world, at rest) ----
await pg.mouse.move(640, 400); await idle();
const v0 = await view();

// ---- wheel: six notches eased around the cursor ----
const CUR = [900, 260];
const w0 = worldAt(v0, ...CUR);
await clear();
await pg.mouse.move(...CUR);
for (let i = 0; i < 6; i++) { await pg.mouse.wheel(0, -100); await pg.waitForTimeout(40); }
await idle();
const v1 = await view(), rec = await frames();
const scales = rec.map((x) => x.s);
let monotone = true; for (let i = 1; i < scales.length; i++) if (scales[i] < scales[i - 1] - 1e-9) monotone = false;
const distinct = new Set(scales.map((x) => x.toFixed(4))).size;
ok(monotone, 'the zoom only moves in one direction while it eases');
ok(distinct >= 6, `the zoom is spread over frames, not one jump (${distinct} distinct frames)`);
ok(Math.abs(Math.log(v1.s / v0.s) - 6 * 100 * 0.0016) < 1e-3, `six notches zoom by the expected factor (x${(v1.s / v0.s).toFixed(3)})`);
let drift = 0; for (const f of rec) { const w = worldAt(f, ...CUR); drift = Math.max(drift, Math.hypot(w[0] - w0[0], w[1] - w0[1]) * f.s); }
ok(drift < 0.5, `the point under the cursor stays put through the whole ease (max drift ${drift.toFixed(3)} px)`);
const glWheel = await pg.evaluate(() => window.__glResizes);
ok(glWheel <= 2, `the drawing resolution changes once for the gesture, not per notch (${glWheel} changes)`);
const { w, h, dpr } = await dims();
const glW = await pg.evaluate(() => document.getElementById('gl').width);
ok(glW === Math.round(w * Math.min(dpr, 2)), `back to full resolution at rest (gl width ${glW})`);

// ---- drag: 1:1 with the pointer while held, then a release with no movement stops ----
await pg.mouse.move(500, 400); await pg.mouse.down();
const d0 = await view();
for (let i = 1; i <= 3; i++) await pg.mouse.move(500 + i * 20, 400 + i * 10);
await pg.waitForTimeout(700);
const d1 = await view();
ok(Math.abs(d1.cx - (d0.cx - 60 / d0.s)) < 1e-9 && Math.abs(d1.cy - (d0.cy + 30 / d0.s)) < 1e-9, `drag moves the map exactly with the pointer (dx ${((d0.cx - d1.cx) * d0.s).toFixed(3)} px, dy ${((d1.cy - d0.cy) * d0.s).toFixed(3)} px)`);
await pg.mouse.up(); await idle();
const d2 = await view();
ok(Math.abs(d2.cx - d1.cx) < 1e-12, 'a drag that rests before the release does not fling');

// ---- flick: a fast release keeps the map moving; a press stops it ----
// The flick's pointer moves are fired from the page itself, 16 ms apart, so their timestamps carry a real flick's speed
// (this browser driver delivers mouse input too slowly to show one). The press itself is a real mouse press.
const flick = async (x0) => {
  await pg.mouse.move(x0, 400); await pg.mouse.down();
  const flying = await pg.evaluate(async (x0) => {
    const cv = document.getElementById('ov');
    const ev = (type, x) => cv.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: 400, pointerId: 1, pointerType: 'mouse', isPrimary: true, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
    let x = x0;
    for (let i = 0; i < 4; i++) { await new Promise((r) => setTimeout(r, 16)); x -= 120; ev('pointermove', x); }
    ev('pointerup', x);                                              // the release comes straight after the last move
    return window.__atlas.camera().active();
  }, x0);
  await pg.mouse.up();                                              // the real release that follows is harmless
  return flying;
};
const flying = await flick(1000);
const f0 = await view();
await pg.waitForTimeout(300);
const f1 = await view();
ok(flying && Math.abs(f1.cx - f0.cx) * f0.s > 5, `a fast flick keeps moving after the release (${((f1.cx - f0.cx) * f0.s).toFixed(0)} px further)`);
await idle();
const flying2 = await flick(1000);                                  // still flinging when the next press comes
await pg.mouse.down();
const stopped = await pg.evaluate(() => !window.__atlas.camera().active());
await pg.mouse.up(); await idle();
ok(flying2 && stopped, 'a press stops the fling in progress');

// ---- brush mode: a drag paints, it does not pan (the editing gate) ----
await pg.evaluate(() => window.__atlas.editor().setTool('brush'));
const before = await view();
await pg.mouse.move(700, 420); await pg.mouse.down();
for (let i = 1; i <= 4; i++) await pg.mouse.move(700 + i * 15, 420 + i * 4);
await pg.mouse.up(); await idle();
const after = await view();
ok(after.cx === before.cx && after.cy === before.cy, 'brush mode: a drag does not pan the map');
await pg.evaluate(() => { window.__atlas.store.undo(); window.__atlas.editor().setTool('pan'); });
await idle();

// ---- globe: a drag rotates it, the sliders follow ----
await pg.evaluate(() => window.__atlas.setProjection('orthographic'));
await idle();
const g0 = await view();
await pg.mouse.move(600, 400); await pg.mouse.down();
for (let i = 1; i <= 4; i++) await pg.mouse.move(600 + i * 25, 400);
await pg.waitForTimeout(600);
const g1 = await view();
ok(Math.abs(g1.lon0 - (g0.lon0 - 100 / g0.s)) < 1e-9, `a globe drag rotates the longitude (${((g0.lon0 - g1.lon0) * 180 / Math.PI).toFixed(2)} deg)`);
const slider = await pg.evaluate(() => +document.getElementById('lonSlider').value);
ok(slider === Math.round(g1.lon0 * 180 / Math.PI), 'the longitude slider follows the globe');
await pg.mouse.up(); await idle();
await pg.evaluate(() => window.__atlas.setProjection('equal-earth'));
await idle();

// ---- zoom buttons and double click: eased, the centre stays the centre ----
const c0 = await view(), centre0 = worldAt(c0, 640, 400);
await pg.click('#zIn'); await idle();
const c1 = await view(), centre1 = worldAt(c1, 640, 400);
ok(Math.abs(c1.s / c0.s - 1.5) < 1e-3, `the + button zooms by x1.5 (x${(c1.s / c0.s).toFixed(4)})`);
ok(Math.hypot(centre1[0] - centre0[0], centre1[1] - centre0[1]) * c1.s < 0.5, 'the + button keeps the centre of the map where it was');
await pg.click('#zOut'); await idle();
await pg.mouse.move(600, 350);
await pg.mouse.dblclick(600, 350); await idle();
const c2 = await view();
ok(Math.abs(c2.s / c1.s / (1 / 1.5) - 2) < 1e-3, `double click zooms by x2 at the cursor (x${(c2.s / c1.s / (1 / 1.5)).toFixed(4)})`);

// ---- report ----
const bad = r.filter((x) => !x[0]);
for (const [c, m] of r) console.log((c ? 'ok   ' : 'FAIL ') + m);
if (errs.length) console.log('page errors:', errs.slice(0, 5));
console.log(bad.length || errs.length ? `${bad.length} of ${r.length} checks FAILED${errs.length ? `, ${errs.length} page errors` : ''}` : `all ${r.length} navigation checks passed`);
await b.close(); server.close();
process.exit(bad.length || errs.length ? 1 : 0);
