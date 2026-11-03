// node tools/test_timeline.mjs -- timeline.js against tests/timeline_cases.json (shared with the Rust tests) + unit checks.
import { readFileSync } from 'node:fs';
import * as T from '../web/js/timeline.js';
import * as C from '../web/js/calendar.js';

let fail = 0, checks = 0;
const eq = (a, b, m) => { checks++; if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log('FAIL', m, 'got', JSON.stringify(a), 'want', JSON.stringify(b)); } };
const ok = (c, m) => eq(!!c, true, m);
const G = JSON.parse(readFileSync(new URL('../crates/cosmossi-core/tests/timeline_cases.json', import.meta.url), 'utf8'));

for (const c of G.status) eq(T.lifeStatus(c.life, c.day), c.want, `status ${JSON.stringify(c)}`);
for (const l of G.invalidLives) ok(T.lifeProblem(l), `rejects ${JSON.stringify(l)}`);
ok(T.lifeProblem({ from: 5, to: 5 }) === null, 'single-day life ok');

const t = T.normalizeTimeline({ events: G.events.list });
const ids = (v) => v.map((e) => e.id);
for (const [d, w] of G.events.on) eq(ids(T.eventsOn(t, d)), w, `on ${d}`);
for (const [a, b, w] of G.events.between) eq(ids(T.eventsBetween(t, a, b)), w, `between ${a}-${b}`);
for (const [d, w] of G.events.next) eq(T.nextEventDay(t, d), w, `next ${d}`);
for (const [d, w] of G.events.prev) eq(T.prevEventDay(t, d), w, `prev ${d}`);

// defaults
const d = T.createTimeline();
eq(d.start, 1, 'start'); eq(d.current, C.anchorDayNumber(), 'current = anchor');
const end = C.dayNumberToDate(d.end);
eq([end.era, end.year, end.month], [6, 999, 15], 'default end = last day of era 6');
eq(T.timelineProblems(d), [], 'default valid');
eq(T.normalizeTimeline({}), d, 'normalize {} = default');
eq(T.normalizeTimeline({ events: [{ id: 'e', title: 'x', day: 5 }] }).events[0], { id: 'e', title: 'x', day: 5, endDay: null, notes: '', featureId: null }, 'event defaults');

// clamping + range
const r = { ...d, start: 100, end: 200, current: 150, events: [] };
eq(T.setCurrent(r, 5), 100, 'clamp low'); eq(T.setCurrent(r, 999), 200, 'clamp high'); eq(T.setCurrent(r, 123), 123, 'inside');
const g = { ...d, start: 100, end: 200, current: 150, events: [{ id: 'a', title: 'a', day: 50, endDay: null }, { id: 'b', title: 'b', day: 250, endDay: 300 }] };
T.includeEventsInRange(g); eq([g.start, g.end, g.current], [50, 300, 150], 'range grows');

// validation
const bad = { ...d, events: [{ id: 'a', title: 'x', day: 10, endDay: 5 }, { id: 'a', title: 'x', day: 0, endDay: null }] };
const msg = T.timelineProblems(bad).join(';');
ok(msg.includes('duplicate event id') && msg.includes('ends before it begins') && msg.includes('outside the calendar'), 'event problems');
ok(T.timelineProblems({ ...d, start: 50, end: 40, current: 45 }).join().includes('range ends before'), 'reversed range');
ok(T.timelineProblems({ ...d, start: 10, end: 20, current: 30 }).join().includes('current day'), 'current outside');

// project helpers (same project as the Rust test)
const feats = [
  { id: 'country-1', life: { from: null, to: 500 } },
  { id: 'city-1', life: { from: 400, to: null } },
  { id: 'label-1', life: { from: null, to: null } },
];
eq(T.visibleFeatureIds(feats, 100), ['country-1', 'label-1'], 'visible 100');
eq(T.visibleFeatureIds(feats, 450), ['country-1', 'city-1', 'label-1'], 'visible 450');
eq(T.visibleFeatureIds(feats, 501), ['city-1', 'label-1'], 'visible 501');
eq(T.visibleFeatureIds([{ id: 'x' }], 5), ['x'], 'missing life = always');
eq(T.lifeExtent(feats), [400, 500], 'extent'); eq(T.lifeExtent([{ id: 'x', life: {} }]), null, 'no extent');
const lt = { ...d, events: [{ id: 'e', title: 'e', day: 450, endDay: null, featureId: 'city-1' }] };
eq(T.timelineProblems(lt, feats), [], 'links ok');
lt.events.push({ id: 'f', title: 'f', day: 460, endDay: null, featureId: 'ghost' });
ok(T.timelineProblems(lt, feats).join().includes("missing feature 'ghost'"), 'missing link');

// ---- UI helpers
eq(T.dayToCode(null), '', 'null -> blank'); eq(T.dayToCode(1), '01/01/000-01', 'day 1 code');
eq(T.dayToCode(C.anchorDayNumber()), '01/01/300-05', 'anchor code');
eq(T.codeToDay(''), null, 'blank -> open'); eq(T.codeToDay('  '), null, 'spaces -> open');
eq(T.codeToDay('1/1/300-5'), C.anchorDayNumber(), 'unpadded parse');
for (const n of [1, 2, 365, 366, 800000, C.anchorDayNumber(), 2190000]) eq(T.codeToDay(T.dayToCode(n)), n, `code round trip ${n}`);
for (const bad of ['x', '32/01/300-05', '01/16/300-05', '01/01/300']) { checks++; try { T.codeToDay(bad); fail++; console.log('FAIL no throw', bad); } catch (e) { if (!(e instanceof RangeError)) { fail++; console.log('FAIL type', bad); } } }
const a = C.anchorDayNumber();
eq(T.stepDay(a, { days: 1 }), a + 1, 'step +1 day'); eq(T.stepDay(a, { days: -1 }), a - 1, 'step -1 day');
eq(C.dayNumberToDate(T.stepDay(a, { years: 1 })), { era: 5, year: 301, month: 1, day: 1 }, 'step +1 year');
eq(C.dayNumberToDate(T.stepDay(a, { years: -2 })), { era: 5, year: 298, month: 1, day: 1 }, 'step -2 years');
eq(T.stepDay(1, { days: -1 }), 1, 'clamps at calendar start'); eq(T.stepDay(1, { years: -1 }), 1, 'year step clamps at start');
eq(T.stepDay(C.maxDayNumber(), { days: 1 }), C.maxDayNumber(), 'clamps at calendar end');
eq(T.lifeSummary({ from: null, to: null }), 'always', 'summary always');
eq(T.lifeSummary({ from: 1, to: null }), 'from 01/01/000-01', 'summary from');
eq(T.lifeSummary({ from: null, to: 1 }), 'until 01/01/000-01', 'summary until');
eq(T.lifeSummary({ from: 1, to: 2 }), '01/01/000-01 to 02/01/000-01', 'summary span');
eq(T.fitRange({ events: [] }, [{ life: {} }]), null, 'nothing to fit');
eq(T.fitRange({ events: [{ day: 1000, endDay: 1200 }] }, [{ life: { from: 500, to: null } }], 100), { start: 400, end: 1300 }, 'fit range');
eq(T.fitRange({ events: [{ day: 10, endDay: null }] }, [], 365), { start: 1, end: 375 }, 'fit clamps at 1');
eq([T.sliderFraction({ start: 0, end: 100 }, 25), T.sliderFraction({ start: 0, end: 100 }, 500), T.sliderFraction({ start: 5, end: 5 }, 5)], [0.25, 1, 0], 'slider fraction');

console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} timeline checks passed`);
process.exit(fail ? 1 : 0);
