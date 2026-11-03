// node tools/test_exportmap.mjs -- export helpers + static wiring of the export dialog and the mountain-range tool.
import { readFileSync } from 'node:fs';
import { clampScale, outputSize, safeName, MAX_SIDE } from '../web/js/exportmap.js';
import { checkProject } from '../web/js/store.js';
const rd = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
ok(clampScale(2, 1000, 800) === 2, 'scale kept when small'); ok(clampScale(4, 4000, 2000) === MAX_SIDE / 4000, 'scale limited by MAX_SIDE');
ok(clampScale(0.2, 100, 100) === 1, 'never below 1'); ok(outputSize(2, 1000, 500).join() === '2000,1000', 'output size');
ok(safeName('My map: v2/final') === 'My_map_v2_final' && safeName('') === 'map' && safeName('///') === 'map', 'safe file names');
const html = rd('web/index.html'), app = rd('web/js/app.js'), rs = rd('src-tauri/src/main.rs');
for (const id of ['tbExport', 'exportBox', 'exSel', 'exGo', 'exClose', 'tbClip']) ok(html.includes(`id="${id}"`), '#' + id + ' in index.html');
ok(html.includes('data-tool="range"'), 'range tool button'); ok(/save_binary/.test(app) && /fn save_binary/.test(rs) && /save_binary,/.test(rs), 'save_binary wired both sides');
// a project with a mountain range passes the JS check and keeps the range
const p = checkProject({ version: 2, name: 't', planetRadiusKm: 6371, timeline: undefined, features: [{ id: 'range-1', kind: 'range', name: 'R', color: '#8a6d4b', density: 1, rings: [[[0, 0], [5, 0], [5, 5]]], life: { from: null, to: null }, notes: '' }] });
ok(p.features[0].kind === 'range', 'range feature accepted');
console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} export/range checks passed`); process.exit(fail ? 1 : 0);
