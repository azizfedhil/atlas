// node tools/test_newmap.mjs -- "New map": when it asks first, what counts as content, and that a store reset is really blank.
import { createStore } from '../web/js/store.js';
import { createTimeline } from '../web/js/timeline.js';
import { hasContent, newMapPlan } from '../web/js/newmap.js';
import { LAND_ID } from '../web/js/landedit.js';

let fail = 0, checks = 0;
const eq = (a, b, m) => { checks++; if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log('FAIL', m, 'got', JSON.stringify(a), 'want', JSON.stringify(b)); } };
const country = (id) => ({ id, kind: 'country', name: id, color: '#abc', rings: [[[0, 0], [10, 0], [10, 10]]], life: { from: null, to: null } });
const landDelta = (notes) => ({ id: LAND_ID, kind: 'label', text: 'land', lon: 0, lat: 0, size: 18, rotation: 0, spacing: 4, life: { from: null, to: null }, notes });

// plans
eq(newMapPlan({ hasContent: false, hasFile: false, autoFile: true }), 'now', 'empty map: no question');
eq(newMapPlan({ hasContent: false, hasFile: true, autoFile: false }), 'now', 'empty map in a file: no question');
eq(newMapPlan({ hasContent: true, hasFile: true, autoFile: true }), 'safe', 'file + autosave: flush and go');
eq(newMapPlan({ hasContent: true, hasFile: true, autoFile: false }), 'unsaved', 'file but autosave off: ask');
eq(newMapPlan({ hasContent: true, hasFile: false, autoFile: true }), 'unsaved', 'never saved: ask');
eq(newMapPlan({ hasContent: true, hasFile: false, autoFile: false }), 'unsaved', 'never saved, autosave off: ask');

// what counts as content
const s = createStore();
eq(hasContent(s), false, 'fresh store is empty');
s.load([landDelta('')], null); eq(hasContent(s), false, 'an empty land-delta is not content');
s.load([landDelta('0abc')], null); eq(hasContent(s), true, 'land edits are content');
s.load([country('c1')], null); eq(hasContent(s), true, 'a country is content');
s.load([], null); s.editTimeline((t) => { t.events.push({ id: 'e1', day: 5, title: 'x' }); }); eq(hasContent(s), true, 'a timeline event is content');

// a store reset is blank: features, events, range, undo history, redo history
const t = createStore();
t.load([country('c1'), country('c2'), landDelta('1abc')], { ...createTimeline(), start: 100, end: 900, current: 500, events: [] });
t.edit((all) => all.push(country('c3'))); t.undo();
eq([t.canUndo, t.canRedo], [false, true], 'there is history to lose'); // undo of the only edit leaves redo available
t.edit((all) => all.push(country('c4')));
t.load([], null);
eq(t.features, [], 'features cleared'); eq(t.canUndo, false, 'undo history cleared'); eq(t.canRedo, false, 'redo history cleared');
eq(t.timeline, createTimeline(), 'timeline back to the default'); eq(hasContent(t), false, 'blank after reset');
eq(t.toProject('Cosmossi', 6371).features, [], 'a project saved now is blank');

console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} checks passed`); process.exit(fail ? 1 : 0);
