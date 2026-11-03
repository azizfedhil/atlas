// node tools/test_timeline_ui.mjs -- OPTIONAL browser smoke test of the timeline slider, events, lifespans and filter.
// Needs Playwright with Chromium (npm i -g playwright && npx playwright install chromium); not a project dependency.
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
console.log('ready', await pg.evaluate(() => !!window.__atlasReady), await pg.evaluate(() => window.__atlasError));
const r = [];
const ok = (c, m) => { r.push([!!c, m]); };
const A = () => pg.evaluate(() => { const s = window.__atlas.store; return { cur: s.timeline.current, ev: s.timeline.events.length, code: document.querySelector('#tlCode').textContent, sl: +document.querySelector('#tlSlider').value }; });
let a = await A(); ok(a.code === '01/01/300-05' && a.sl === a.cur, 'initial date shows anchor ' + a.code);
await pg.click('#tlNextDay'); a = await A(); ok(a.code === '02/01/300-05', 'next day ' + a.code);
await pg.click('#tlNextYear'); a = await A(); ok(a.code === '02/01/301-05', 'next year ' + a.code);
await pg.fill('#tlJump', '15/03/250-05'); await pg.press('#tlJump', 'Enter'); a = await A(); ok(a.code === '15/03/250-05', 'jump ' + a.code);
await pg.fill('#tlJump', '99/99/1-1'); await pg.press('#tlJump', 'Enter'); a = await A(); ok(a.code === '15/03/250-05', 'bad jump rejected');
await pg.click('#evAdd'); a = await A(); ok(a.ev === 1, 'event added');
await pg.fill('#evForm [data-k=title]', 'Founding'); await pg.press('#evForm [data-k=title]', 'Enter'); await pg.click('#tlNextYear');
await pg.click('#tlPrevEv'); a = await A(); ok(a.code === '15/03/250-05', 'prev event jumps back ' + a.code);
ok(await pg.locator('#tlMarkers i').count() === 1, 'marker drawn');
// features with lifespans
await pg.evaluate(() => { const s = window.__atlas.store; s.edit((f) => { f.push({ id: 'c1', kind: 'city', name: 'Old', lon: 10, lat: 10, rank: 'city', life: { from: null, to: 1000 }, notes: '' }, { id: 'c2', kind: 'city', name: 'Always', lon: 20, lat: 10, rank: 'city', life: { from: null, to: null }, notes: '' }); }); });
const vis = () => pg.evaluate(() => [...document.querySelectorAll('#featList li')].map((l) => l.classList.contains('off')));
ok(JSON.stringify(await vis()) === '[true,false]', 'old city hidden at day>1000: ' + JSON.stringify(await vis()));
await pg.fill('#tlJump', '01/01/001-01'); await pg.press('#tlJump', 'Enter');
ok(JSON.stringify(await vis()) === '[false,false]', 'old city visible at early day');
await pg.click('#tlFilter'); await pg.fill('#tlJump', '01/01/300-05'); await pg.press('#tlJump', 'Enter');
ok(JSON.stringify(await vis()) === '[false,false]', 'filter off shows everything');
await pg.click('#tlFilter');
// inspector lifespan
await pg.evaluate(() => { window.__atlas.editor().select('c2'); });
await pg.fill('[data-life=to]', '01/01/310-05'); await pg.press('[data-life=to]', 'Enter');
ok(await pg.evaluate(() => window.__atlas.store.find('c2').life.to) > 1000, 'lifespan set from inspector');
await pg.fill('[data-life=from]', '01/01/320-05'); await pg.press('[data-life=from]', 'Enter');
ok(await pg.evaluate(() => window.__atlas.store.find('c2').life.from) === null, 'reversed lifespan rejected');
// undo timeline edit but keep slider
await pg.evaluate(() => window.__atlas.store.undo());
// keyboard
await pg.evaluate(() => document.activeElement.blur());
const before = (await A()).cur; await pg.keyboard.press('.'); ok((await A()).cur === before + 1, 'keyboard . steps a day');
for (const [c, m] of r) console.log(c ? 'ok  ' : 'FAIL', m);
console.log('errors:', JSON.stringify(errs));
await b.close(); server.close();
process.exit(r.every(([c]) => c) && !errs.length ? 0 : 1);
