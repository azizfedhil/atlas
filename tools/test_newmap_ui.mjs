// node tools/test_newmap_ui.mjs -- OPTIONAL browser test of "New map" (needs Playwright + Chromium).
// Checks: a never-saved map asks first (Cancel / Esc keep it, Discard starts blank); a saved map starts blank without a question
// AFTER its last second of work is flushed to its file; and the blank map never overwrites the old file or the old Drive backup.
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
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const pg = await ctx.newPage();
const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/google|gsi|ERR_/.test(m.text())) errs.push(m.text()); });
const google = []; await ctx.route(/google/, (r) => { google.push(r.request().url()); r.abort(); });
// a stand-in for the file the user saved to: records every write
await pg.addInitScript(() => {
  window.__writes = []; window.__fileName = 'World.cosmap';
  window.showSaveFilePicker = async () => ({ name: window.__fileName, createWritable: async () => ({ write: async (s) => { window.__writes.push(s); }, close: async () => {} }) });
  try { localStorage.setItem('cosmossi.drive', JSON.stringify({ clientId: 'test-client', enabled: true, fileId: 'OLD-DRIVE-FILE' })); } catch (_) {}
});
await pg.goto(`${base}/index.html`);
await pg.waitForFunction(() => window.__atlasReady || window.__atlasError, null, { timeout: 60000 });
const r = []; const ok = (c, m) => r.push([!!c, m]);
ok(await pg.evaluate(() => window.__atlasReady), 'app boots');
const country = (id) => ({ id, kind: 'country', name: id, color: '#7aa6c2', rings: [[[10, 10], [30, 10], [30, 30], [10, 30]]], life: { from: null, to: null } });
const addCountry = (id) => pg.evaluate((c) => window.__atlas.store.edit((all) => all.push(c)), country(id));
const names = () => pg.evaluate(() => window.__atlas.store.features.map((f) => f.id));
const boxShown = () => pg.evaluate(() => !document.querySelector('#newBox').hidden);

// ---- 1. never saved: asks first ----
ok(!(await pg.evaluate(() => window.__atlas.hasContent())), 'a fresh app has no content');
await addCountry('c1'); await addCountry('c2');
await pg.click('#tbNew');
ok(await boxShown(), 'New on a never-saved map asks first');
ok(/not been saved/.test(await pg.textContent('#nbMsg')), 'the question says it was never saved');
ok((await pg.evaluate(() => document.activeElement.id)) === 'nbCancel', 'Cancel has the focus (the safe default)');
await pg.click('#nbCancel');
ok(!(await boxShown()) && (await names()).length === 2, 'Cancel keeps the map');
await pg.click('#tbNew'); await pg.keyboard.press('Escape');
ok(!(await boxShown()) && (await names()).length === 2, 'Esc keeps the map');
await pg.keyboard.press('Control+n');
ok(await boxShown(), 'Ctrl+N asks too'); await pg.keyboard.press('Escape');

// ---- 2. discard -> a totally blank map ----
await pg.evaluate(() => { window.__atlas.store.editTimeline((t) => { t.events.push({ id: 'ev1', day: 100, title: 'x' }); }); });
await pg.evaluate(() => { document.querySelector('#radius').value = '1000'; document.querySelector('#radius').dispatchEvent(new Event('input')); });
await pg.click('#tbNew'); await pg.click('#nbGo');
const blank = await pg.evaluate(() => { const A = window.__atlas, p = A.store.toProject('x', A.state.planetKm); return { f: p.features.length, ev: p.timeline.events.length, km: A.state.planetKm, undo: A.store.canUndo, redo: A.store.canRedo, sel: A.editor().selectedId || null, content: A.hasContent() }; });
ok(blank.f === 0 && blank.ev === 0, `blank: no features, no timeline events (${JSON.stringify(blank)})`);
ok(blank.km === 6371, 'planet radius back to the default'); ok(!blank.undo && !blank.redo, 'undo history is empty (no way back into the old map by accident)');
ok(!(await boxShown()), 'the question is closed');
ok(/Not saved to a file yet/.test(await pg.textContent('#saveStatus')), 'status says: not saved to a file yet');

// ---- 3. a saved map: the old file and Drive backup are never touched by the blank one ----
await addCountry('keep1'); await pg.keyboard.press('Control+s'); await pg.waitForTimeout(500);
ok((await pg.evaluate(() => window.__writes.length)) >= 1 && (await pg.evaluate(() => window.__atlas.target().hasHandle)), 'Ctrl+S saved to a file');
await addCountry('keep2');                                      // work from the last second, not yet autosaved to the file
await pg.waitForTimeout(300); const googleBefore = google.length;   // the explicit Ctrl+S above may legitimately have started a Drive backup
await pg.click('#tbNew');
ok(!(await boxShown()), 'a saved map starts blank without asking');
const lastWrite = JSON.parse(await pg.evaluate(() => window.__writes[window.__writes.length - 1]));
ok(lastWrite.features.map((f) => f.id).join() === 'keep1,keep2', 'the file was flushed with ALL the work before the blank map started: ' + lastWrite.features.map((f) => f.id));
const nWrites = await pg.evaluate(() => window.__writes.length);
ok((await names()).length === 0, 'the app is blank'); ok(!(await pg.evaluate(() => window.__atlas.target().hasHandle)), 'and no longer tied to the old file');
await pg.waitForTimeout(4500);                                  // longer than the 0.5 s / 3 s autosave timers
ok((await pg.evaluate(() => window.__writes.length)) === nWrites, 'the blank map is NOT written over the old file (autosave timers waited out)');
ok((await pg.evaluate(() => JSON.parse(localStorage.getItem('cosmossi.drive')).fileId)) === '', 'the Drive backup of the old map is let go (next backup is a new file)');
ok(google.length === googleBefore, 'nothing is sent to Google after the blank map started: ' + (google.length - googleBefore));
ok(!JSON.parse(await pg.evaluate(() => localStorage.getItem('cosmossi.project') || '{"features":[]}')).features.length, 'the autosaved session is blank, so a reload starts blank too');

// ---- 4. reload: starts blank, then work continues normally ----
await pg.reload(); await pg.waitForFunction(() => window.__atlasReady || window.__atlasError, null, { timeout: 60000 });
ok((await names()).length === 0, 'after a reload the map is still blank (the old session is not restored)');
await addCountry('fresh'); await pg.waitForTimeout(700);
ok(JSON.parse(await pg.evaluate(() => localStorage.getItem('cosmossi.project'))).features.length === 1, 'new work autosaves to the session again');

// ---- 5. land edits are part of the map: New map reverts them ----
await pg.evaluate(() => window.__atlas.store.edit((all) => all.push({ id: 'land-delta', kind: 'label', text: 'land', lon: 0, lat: 0, size: 18, rotation: 0, spacing: 4, life: { from: null, to: null }, notes: '12s,0' + (3087 * 1554 - 100).toString(36) })));
await pg.waitForTimeout(1500);
ok(await pg.evaluate(() => window.__atlas.hasContent()), 'land edits count as content');
await pg.click('#tbNew'); await pg.click('#nbGo'); await pg.waitForTimeout(1500);
ok(!(await names()).includes('land-delta') && !(await pg.evaluate(() => window.__atlas.hasContent())), 'New map removes the land edits too');
ok(errs.length === 0, 'no page errors: ' + errs.join(' | '));

let bad = 0; for (const [c, m] of r) { if (!c) bad++; console.log(c ? 'ok  ' : 'FAIL', m); }
await b.close(); server.close();
console.log(bad ? `${bad} of ${r.length} checks FAILED` : `all ${r.length} checks passed`); process.exit(bad ? 1 : 0);
