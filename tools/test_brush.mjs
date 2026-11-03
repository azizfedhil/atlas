// node tools/test_brush.mjs -- brush tool, drawing at a chosen subdivision level, changing a subdivision's level, subdivision capitals.
import * as P from '../web/js/projections.js';
import { createStore } from '../web/js/store.js';
import { createEditor } from '../web/js/editor.js';
import { strokeRing } from '../web/js/brush.js';
import { planarArea } from '../web/js/polyops.js';
globalThis.Path2D = class { moveTo() {} lineTo() {} closePath() {} };
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL', m); } };
const def = P.byId('equirectangular'), W = 1000, H = 600, view = () => ({ def, cx: 0, cy: 0, scale: 300, lon0: 0, lat0: 0, w: W, h: H, zoomRel: 1 });

// ---- brush geometry ----
{
  const r = strokeRing([[100, 100], [300, 100]], 20, W, H);
  const A = (() => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; })();
  ok(Math.abs(A - (2 * 20 * 200 + Math.PI * 400)) < 0.02 * A, 'a straight stroke covers length x width + the two round ends: ' + A.toFixed(0));
  ok(strokeRing([[50, 50]], 12, W, H).length >= 8, 'a single click is a round dab');
  const loop = []; for (let i = 0; i <= 130; i++) { const a = i / 120 * 2 * Math.PI; loop.push([500 + 120 * Math.cos(a), 300 + 120 * Math.sin(a)]); }
  ok(strokeRing(loop, 12, W, H).length >= 8, 'a stroke that closes on itself still gives one outline');
}

// ---- editor ----
const store = createStore(), said = [];
const ed = createEditor({ store, getView: view, getCoast: () => null, requestRender: () => {}, onHint: (t) => said.push(t) });
const area = (f) => planarArea(ed.flat(f));
const stroke = (pts, shift = false) => { ed.pointerDown(pts[0][0], pts[0][1], false, shift, false); for (const p of pts.slice(1)) ed.pointerMove(p[0], p[1], false); ed.pointerUp(); };
const countries = () => store.features.filter((f) => f.kind === 'country'), subs = () => store.features.filter((f) => f.kind === 'subdivision');

ed.setTool('brush'); ed.setBrushSize(40);
stroke([[300, 250], [400, 250], [500, 250], [600, 250]]);
ok(countries().length === 1, 'a stroke with nothing selected starts a country');
const c1 = countries()[0];
ok(ed.tool === 'brush' && ed.selectedId === c1.id, 'the brush stays active and selects what it made');
const a0 = area(c1); ok(a0 > 5, 'the country has an area: ' + a0.toFixed(1));
stroke([[500, 250], [500, 330], [500, 400]]);
ok(countries().length === 1 && area(c1) > a0 * 1.1, 'a stroke over the selected country adds to it (' + a0.toFixed(1) + ' -> ' + area(c1).toFixed(1) + ')');
const a1 = area(c1);
stroke([[560, 230], [560, 270]], true);
ok(area(c1) < a1, 'Shift while painting erases (' + a1.toFixed(1) + ' -> ' + area(c1).toFixed(1) + ')');
const a2 = area(c1); ed.setBrushErase(true); stroke([[300, 250], [330, 250]]); ed.setBrushErase(false);
ok(area(c1) < a2, 'erase mode removes paint too');
ed.newArea(); const before = JSON.stringify(store.features); said.length = 0; ed.setBrushErase(true); stroke([[300, 250], [400, 250]]); ed.setBrushErase(false);
ok(JSON.stringify(store.features) === before && said.some((t) => /Select a country/.test(t)), 'erasing with nothing selected changes nothing and says why');
ok(store.canUndo, 'brush edits are undoable'); const aUndo = area(c1); ed.select(c1.id); store.undo(); ok(area(store.find(c1.id)) !== aUndo, 'undo reverts the last stroke');

// ---- drawing at a chosen level ----
const big = { id: 'big', kind: 'country', name: 'Big', color: '#d98c8c', rings: [[[-60, -40], [60, -40], [60, 40], [-60, 40]]], life: { from: null, to: null }, notes: '', facts: {} };
store.load([big], null);
const pen = (pts) => { for (const p of pts) ed.click(p[0], p[1], {}); ed.keydown({ key: 'Enter' }); };
ed.setTool('sub'); ed.setLevel(1);
pen([[350, 220], [450, 220], [450, 300]]);
ok(subs().length === 1 && ed.depth(subs()[0]) === 1 && subs()[0].parent === 'big', 'level 1 puts the subdivision directly under the country');
const s1 = subs()[0];
ed.setTool('sub'); ed.setLevel(2);
pen([[380, 230], [430, 230], [430, 260]]);
ok(subs().length === 2 && ed.depth(subs()[1]) === 2 && subs()[1].parent === s1.id, 'level 2 goes under the level 1 area at that spot');
const s2 = subs()[1];
ed.setTool('sub'); ed.setLevel(3); said.length = 0;
pen([[640, 350], [700, 350], [700, 400]]);
ok(subs().length === 2 && said.some((t) => /no level|inside/i.test(t)), 'a level with no parent at that spot is refused with a hint: ' + said.at(-1));
ed.setTool('sub'); ed.setLevel(0);
pen([[390, 235], [415, 235], [415, 250]]);
ok(subs().length === 3 && ed.depth(subs()[2]) === 3, 'automatic keeps nesting under whatever is clicked (depth ' + (subs()[2] && ed.depth(subs()[2])) + ')');
ed.setLevel(2); ed.setTool('sub'); ed.setLevel(1);
ok(ed.level === 1 && ed.parentId === null, 'choosing a level clears a pinned parent');

// brush at a level
ed.setLevel(1); ed.setTool('brush'); ed.newArea(); ed.setBrushSize(30);
stroke([[560, 300], [600, 300], [620, 340]]);
const bs = subs().find((f) => f !== s1 && f !== s2 && ed.depth(f) === 1);
ok(!!bs && bs.parent === 'big' && countries().length === 1, 'brush with level 1 chosen paints a level 1 subdivision, not a country');
ed.setLevel(2); ed.newArea(); said.length = 0;
stroke([[700, 450], [720, 470]]);
ok(subs().filter((f) => ed.depth(f) === 2).length === 2 || said.length > 0, 'brush at a level without a parent under it is refused or placed correctly');

// changing the level of an existing subdivision (moving up cuts it out of what it was inside)
ed.setTool('select');
let msg = ed.changeLevel(s2, 1);
ok(typeof msg === 'string' && /hole|inside/.test(msg) && ed.depth(s2) === 2 && s2.parent === s1.id, 'an area wholly inside its parent cannot be promoted (it would leave a hole): ' + msg);
const rect = (id, kind, parent, x0, y0, x1, y1) => ({ id, kind, name: id.toUpperCase(), color: '#d98c8c', ...(parent ? { parent } : {}), rings: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]], life: { from: null, to: null }, notes: '', facts: {} });
store.load([rect('big', 'country', null, -60, -40, 60, 40), rect('a', 'subdivision', 'big', -30, -30, 30, 30), rect('b', 'subdivision', 'a', 10, -10, 30, 10)], null);
const A = store.find('a'), B = store.find('b'), aA = area(A);
ok(ed.depth(B) === 2, 'setup: b is level 2');
msg = ed.changeLevel(B, 1);
ok(msg === null && B.parent === 'big' && ed.depth(B) === 1, 'an area touching its parent edge moves up to level 1: ' + msg);
ok(area(A) < aA && area(B) > 0 && Math.abs(area(A) + area(B) - aA) < 1e-6, 'the parent gives up exactly that footprint (' + aA.toFixed(1) + ' -> ' + area(A).toFixed(1) + ' + ' + area(B).toFixed(1) + ')');
ok(store.canUndo && (store.undo(), ed.depth(store.find('b')) === 2), 'promotion is one undo step');
msg = ed.changeLevel(store.find('b'), 3); ok(typeof msg === 'string' && /only move up/.test(msg), 'moving down is refused with an explanation: ' + msg);
ok(typeof ed.changeLevel(store.find('big'), 1) === 'string', 'a country has no level to change');
ok(ed.changeLevel(store.find('b'), 2) === null, 'same level is a no-op');
ok(typeof ed.changeLevel(store.find('b'), 7) === 'string', 'out-of-range levels are refused');

// subdivision capitals: the diamond marker is drawn only for a city picked as capital that lies inside the subdivision
const city = { id: 'city1', kind: 'city', name: 'Hub', lon: 0, lat: 0, rank: 'town', life: { from: null, to: null }, notes: '' };
store.load([{ ...big, facts: {} }, { id: 'p1', kind: 'subdivision', name: 'Prov', color: '#d98c8c', parent: 'big', rings: [[[-20, -20], [20, -20], [20, 20], [-20, 20]]], life: { from: null, to: null }, notes: '', facts: {} }, city], null);
let closes = 0; const ctx = new Proxy({}, { get: (t, k) => (k === 'getTransform' ? () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) : k === 'measureText' ? () => ({ width: 8 }) : k === 'closePath' ? () => { closes++; } : k in t ? t[k] : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
const drawn = () => { closes = 0; ed.draw(ctx, { ...view(), scale: 900, zoomRel: 3, theme: undefined, political: true }); return closes; };
const without = drawn(); store.features[1].facts.capital = 'city1'; const withCap = drawn();
ok(withCap === without + 1, `a chosen subdivision capital gets its own marker (${without} -> ${withCap})`);
store.features[1].facts.capital = 'nope'; ok(drawn() === without, 'a capital that does not exist draws nothing');
store.features[2].lon = 150; store.features[1].facts.capital = 'city1'; ok(drawn() === without, 'a capital that moved outside the subdivision draws no marker');

console.log(fail ? `${fail} of ${n} checks FAILED` : `all ${n} brush / level / capital checks passed`); process.exit(fail ? 1 : 0);
