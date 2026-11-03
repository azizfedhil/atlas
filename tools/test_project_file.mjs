// node tools/test_project_file.mjs -- v1 -> v2 migration, timeline in the project file, store undo with the timeline.
import { readFileSync } from 'node:fs';
import { createStore, checkProject, FORMAT_VERSION } from '../web/js/store.js';
import { createTimeline } from '../web/js/timeline.js';

let fail = 0, checks = 0;
const eq = (a, b, m) => { checks++; if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log('FAIL', m, 'got', JSON.stringify(a), 'want', JSON.stringify(b)); } };
const ok = (c, m) => eq(!!c, true, m);
const throwsMsg = (f, part, m) => { checks++; try { f(); fail++; console.log('FAIL (no throw)', m); } catch (e) { if (!String(e.message).includes(part)) { fail++; console.log('FAIL (wrong message)', m, e.message); } } };
const fx = (n) => JSON.parse(readFileSync(new URL(`../crates/cosmossi-core/tests/fixtures/${n}`, import.meta.url), 'utf8'));

// migration
eq(FORMAT_VERSION, 2, 'format version');
const v1 = checkProject(fx('project_v1.cosmap'));
eq(v1.version, 2, 'v1 upgraded'); eq(v1.timeline, createTimeline(), 'v1 gets default timeline');
const v2 = checkProject(fx('project_v2.cosmap'));
eq([v2.timeline.current, v2.timeline.filterByLife, v2.timeline.events.length], [850000, false, 2], 'v2 timeline kept');
eq(v2.timeline.events[1].endDay, 860000, 'span event'); eq(v2.timeline.events[0].featureId, 'city-1', 'event link');

// rejections
const bad = fx('project_v2.cosmap'); bad.timeline.events[0].featureId = 'nope';
throwsMsg(() => checkProject(bad), 'missing feature', 'bad link');
const rng = fx('project_v2.cosmap'); rng.timeline.end = 100;
throwsMsg(() => checkProject(rng), 'current day', 'bad range');
const fut = fx('project_v2.cosmap'); fut.version = 3;
throwsMsg(() => checkProject(fut), 'newer', 'future version');
const life = fx('project_v2.cosmap'); life.features[0].life.from = 0;
throwsMsg(() => checkProject(life), 'outside the calendar', 'life outside calendar');

// store: load / toProject round trip
const s = createStore();
s.load(v2.features, v2.timeline);
const out = JSON.parse(JSON.stringify(s.toProject('History map', 6371)));
eq(out.version, 2, 'saved version'); eq(out.timeline, v2.timeline, 'timeline round trip');
eq(checkProject(out).timeline, v2.timeline, 'saved file re-opens identically');
s.load([]); eq(s.timeline, createTimeline(), 'load without timeline = default');

// store: timeline edits are undoable, slider moves are not
const t = createStore(); t.load([], createTimeline());
const start = t.timeline.current;
t.editTimeline((x) => x.events.push({ id: 'e', title: 'War', day: 100, endDay: null, notes: '', featureId: null }));
ok(t.canUndo, 'event add is an undo step');
t.setCurrent(5000); eq(t.timeline.current, 5000, 'slider moves');
t.undo(); eq(t.timeline.events.length, 0, 'undo removes event'); eq(t.timeline.current, 5000, 'undo keeps the slider day');
t.redo(); eq(t.timeline.events.length, 1, 'redo restores event'); eq(t.timeline.current, 5000, 'redo keeps the slider day');
t.undo(); ok(!t.canUndo, 'slider moves added no undo steps');
eq(t.setCurrent(-50), 1, 'clamp low'); eq(t.setCurrent(1e12), t.timeline.end, 'clamp high');
t.editTimeline((x) => { x.start = 6000; x.end = 9000; });
t.undo(); ok(t.timeline.current >= t.timeline.start && t.timeline.current <= t.timeline.end, 'current clamped after undo');
let events = []; t.on((ty) => events.push(ty)); t.setCurrent(10); t.setCurrent(10); eq(events, ['timeline'], 'one event per real change');

console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} project-file checks passed`);
process.exit(fail ? 1 : 0);
