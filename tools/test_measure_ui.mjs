// node tools/test_measure_ui.mjs -- OPTIONAL browser smoke test of the distance tool (needs Playwright + Chromium).
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
const pg = await b.newPage({ viewport: { width: 1400, height: 800 } });
const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await pg.goto(`${base}/index.html`);
await pg.waitForFunction(() => window.__atlasReady || window.__atlasError, null, { timeout: 30000 });
const r = []; const ok = (c, m) => r.push([!!c, m]);
const screenOf = (lon, lat) => pg.evaluate(([lo, la]) => { const A = window.__atlas, s = A.state, d = A.byId(s.proj), D = Math.PI / 180;
  // use the app's own forward projection through the editor's helper-free path: project() is exported by projections.js
  return import('./js/projections.js').then((P) => { const p = P.project(d, lo * D, la * D, s.lon0, d.globe ? s.lat0 : 0); const W = innerWidth, H = innerHeight; return [W / 2 + (p[0] - s.cx) * s.scale, H / 2 - (p[1] - s.cy) * s.scale]; }); }, [lon, lat]);
const clickAt = async ([x, y]) => { await pg.mouse.move(x, y); await pg.mouse.down(); await pg.mouse.up(); };
await pg.press('body', 'm');
ok(await pg.locator('#measureBox').isVisible(), 'M opens the measure box');
ok(await pg.evaluate(() => document.querySelector('#tbMeasure').classList.contains('on')), 'toolbar button is on');
await pg.evaluate(() => { document.querySelector('#radius').value = 6371; document.querySelector('#radius').dispatchEvent(new Event('input')); const u = document.querySelector('#unitSel'); u.value = 'km'; u.dispatchEvent(new Event('change')); });
await clickAt(await screenOf(0, 0)); await clickAt(await screenOf(90, 0));
const total = await pg.evaluate(() => window.__atlas.measure().info().totalKm);
ok(Math.abs(total - 6371 * Math.PI / 2) < 15, `quarter equator ~ ${total.toFixed(1)} km`);
ok((await pg.textContent('#mbTotal')).includes('10,0'), 'panel shows the total: ' + await pg.textContent('#mbTotal'));
ok(await pg.locator('#mbLegs li').count() === 1, 'one leg listed');
await pg.press('body', 'Enter');
await clickAt(await screenOf(-60, 20));
ok(await pg.evaluate(() => window.__atlas.measure().points.length) === 1, 'click after finishing starts a new path');
await pg.press('body', 'Backspace'); ok(await pg.evaluate(() => window.__atlas.measure().points.length) === 0, 'Backspace removes the point');
await pg.evaluate(() => { const u = document.querySelector('#unitSel'); u.value = 'Mre'; u.dispatchEvent(new Event('change')); });
await clickAt(await screenOf(0, 0)); await clickAt(await screenOf(10, 0));
ok(/Mre/.test(await pg.textContent('#mbTotal')), 'unit follows the selector: ' + await pg.textContent('#mbTotal'));
await pg.press('body', 'Escape'); ok(await pg.evaluate(() => window.__atlas.measure().points.length) === 0, 'Esc clears');
await pg.press('body', 'Escape'); ok(!(await pg.locator('#measureBox').isVisible()), 'second Esc closes the tool');
ok(await pg.evaluate(() => window.__atlas.store.features.length) === 0, 'measuring creates no features');
for (const [c, m] of r) console.log(c ? 'ok  ' : 'FAIL', m);
console.log('errors:', JSON.stringify(errs));
await b.close(); server.close();
process.exit(r.every(([c]) => c) && !errs.length ? 0 : 1);
