// Historical timeline model. Mirrors crates/cosmossi-core/src/timeline.rs (the Rust core is the authority;
// tools/test_timeline.mjs and the Rust tests run the same tests/timeline_cases.json).
// Days are Cosmossi day numbers (calendar.js). Lifespans are { from, to }: inclusive, null = open.
import { ERA_NAMES, MAX_ERA, MONTHS, MONTHS_PER_YEAR, YEARS_PER_ERA, addDays, addMonths, anchorDayNumber, dateCode, dateToDayNumber, dayNumberToDate, eraName, maxDayNumber, parseDateCode, yearsElapsed } from './calendar.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isInt = Number.isInteger;

export const lifeStatus = (life, day) => {
  const { from = null, to = null } = life || {};
  if (from !== null && day < from) return 'notYet';
  if (to !== null && day > to) return 'ended';
  return 'alive';
};
export const isAlive = (life, day) => lifeStatus(life, day) === 'alive';

/** Returns an error message, or null when the lifespan is fine. */
export function lifeProblem(life, what = 'feature') {
  const { from = null, to = null } = life || {};
  const max = maxDayNumber();
  for (const [label, v] of [['start', from], ['end', to]]) {
    if (v !== null && (!isInt(v) || v < 1 || v > max)) return `${what}: lifespan ${label} day ${v} is outside the calendar (1 to ${max})`;
  }
  if (from !== null && to !== null && from > to) return `${what}: lifespan ends (day ${to}) before it begins (day ${from})`;
  return null;
}

export const visibleFeatureIds = (features, day) => features.filter((f) => isAlive(f.life, day)).map((f) => f.id);

export function lifeProblems(features) {
  return features.map((f) => lifeProblem(f.life, `feature '${f.id}'`)).filter(Boolean);
}

export function lifeExtent(features) {
  let lo = null, hi = null;
  for (const f of features) for (const n of [f.life?.from ?? null, f.life?.to ?? null]) {
    if (n === null) continue;
    lo = lo === null ? n : Math.min(lo, n);
    hi = hi === null ? n : Math.max(hi, n);
  }
  return lo === null ? null : [lo, hi];
}

// ---- events + timeline ------------------------------------------------------------------------------
export const eventLastDay = (e) => e.endDay ?? e.day;
export const eventCovers = (e, day) => e.day <= day && day <= eventLastDay(e);

const defaultEnd = () => dateToDayNumber({ era: 7, year: 0, month: 1, day: 1 }) - 1; // last day of era 6

export function createTimeline() {
  return { start: 1, end: defaultEnd(), current: anchorDayNumber(), filterByLife: true, events: [] };
}

/** Fills missing fields with defaults (like serde defaults in Rust). */
export function normalizeTimeline(t = {}) {
  const d = createTimeline();
  return {
    start: t.start ?? d.start, end: t.end ?? d.end, current: t.current ?? d.current,
    filterByLife: t.filterByLife ?? true,
    events: (t.events ?? []).map((e) => ({ id: e.id, title: e.title, day: e.day, endDay: e.endDay ?? null, notes: e.notes ?? '', featureId: e.featureId ?? null })),
  };
}

export const setCurrent = (t, day) => (t.current = Math.min(Math.max(day, t.start), t.end));

export const sortedEvents = (t) => [...t.events].sort((a, b) =>
  a.day - b.day || eventLastDay(a) - eventLastDay(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
export const eventsOn = (t, day) => sortedEvents(t).filter((e) => eventCovers(e, day));
export const eventsBetween = (t, from, to) => sortedEvents(t).filter((e) => e.day <= to && eventLastDay(e) >= from);
export function nextEventDay(t, day) { const c = t.events.map((e) => e.day).filter((d) => d > day); return c.length ? Math.min(...c) : null; }
export function prevEventDay(t, day) { const c = t.events.map((e) => e.day).filter((d) => d < day); return c.length ? Math.max(...c) : null; }

export function includeEventsInRange(t) {
  for (const e of t.events) { t.start = Math.min(t.start, e.day); t.end = Math.max(t.end, eventLastDay(e)); }
  t.start = Math.max(t.start, 1);
  t.end = Math.min(t.end, maxDayNumber());
  t.current = Math.min(Math.max(t.current, t.start), t.end);
  return t;
}

/** All problems as messages (empty array = valid). Pass `features` to also check links and lifespans. */
export function timelineProblems(t, features = null) {
  const max = maxDayNumber(), out = [];
  if (![t.start, t.end, t.current].every(isInt) || t.start < 1 || t.end > max) out.push(`timeline range ${t.start}..${t.end} is outside the calendar (1 to ${max})`);
  if (t.start > t.end) out.push('timeline range ends before it begins');
  else if (t.current < t.start || t.current > t.end) out.push(`current day ${t.current} is outside the timeline range`);
  const seen = new Set();
  for (const e of t.events) {
    if (!e.id) out.push('an event has an empty id');
    else if (seen.has(e.id)) out.push(`duplicate event id '${e.id}'`);
    else seen.add(e.id);
    if (!String(e.title ?? '').trim()) out.push(`event '${e.id}' has no title`);
    if (!isInt(e.day) || e.day < 1 || e.day > max) out.push(`event '${e.id}' day ${e.day} is outside the calendar (1 to ${max})`);
    if (e.endDay !== null && e.endDay !== undefined) {
      if (e.endDay < e.day) out.push(`event '${e.id}' ends before it begins`);
      else if (e.endDay > max) out.push(`event '${e.id}' end day ${e.endDay} is outside the calendar`);
    }
  }
  if (features) {
    out.push(...lifeProblems(features));
    const ids = new Set(features.map((f) => f.id));
    for (const e of t.events) if (e.featureId && !ids.has(e.featureId)) out.push(`event '${e.id}' refers to a missing feature '${e.featureId}'`);
  }
  return out;
}

// ---- UI helpers (Batch 5.4; JS only, they sit on top of the model above) ------------------------------
/** Day number -> "DD/MM/YYY-EE" ('' for null = open). */
export const dayToCode = (n) => (n === null || n === undefined ? '' : dateCode(dayNumberToDate(n)));
/** "DD/MM/YYY-EE" -> day number; blank = null (open). Throws RangeError for text that is not a real date. */
export function codeToDay(text) {
  const t = String(text ?? '').trim();
  return t === '' ? null : dateToDayNumber(parseDateCode(t));
}
/** Move a day by whole days or whole years (15 months); clamps to the calendar instead of throwing. */
export function stepDay(day, { days = 0, years = 0 } = {}) {
  try {
    let d = dayNumberToDate(day);
    if (years) d = addMonths(d, years * 15);
    if (days) d = addDays(d, days);
    return dateToDayNumber(d);
  } catch { return days + years * 365 < 0 ? 1 : Math.min(maxDayNumber(), day); }
}
/** Short text for a lifespan, e.g. "always", "from 01/01/300-05", "until ...", "a .. b". */
export function lifeSummary(life) {
  const f = life?.from ?? null, t = life?.to ?? null;
  if (f === null && t === null) return 'always';
  if (t === null) return `from ${dayToCode(f)}`;
  if (f === null) return `until ${dayToCode(t)}`;
  return `${dayToCode(f)} to ${dayToCode(t)}`;
}
/** Range that covers all lifespans and events (plus a margin in days), or null when there is nothing to fit. */
export function fitRange(t, features, marginDays = 365) {
  const days = [];
  const ext = lifeExtent(features); if (ext) days.push(...ext);
  for (const e of t.events) days.push(e.day, eventLastDay(e));
  if (!days.length) return null;
  return { start: Math.max(1, Math.min(...days) - marginDays), end: Math.min(maxDayNumber(), Math.max(...days) + marginDays) };
}
/** Position (0..1) of a day along the slider. */
export const sliderFraction = (t, day) => (t.end > t.start ? Math.min(1, Math.max(0, (day - t.start) / (t.end - t.start))) : 0);

// ======================================================================================================================
// Timeline overhaul (batch 7): pure helpers for store.js, timelineui.js, timelinestrip.js and timelineplay.js.
// NOTHING ABOVE THIS LINE CHANGED (the shared Rust test vectors still apply to it).
// ======================================================================================================================

// ---- search in sorted arrays ----
/** Index of the first element greater than x in the ascending array a (a.length when there is none). */
export function bisectRight(a, x) { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] <= x) lo = m + 1; else hi = m; } return lo; }
/** Index of the first element greater than or equal to x in the ascending array a. */
export function bisectLeft(a, x) { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; }
/** Merge two ascending arrays into one ascending array without duplicates. */
export function mergeDays(a, b) {
  const out = []; let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    const x = j >= b.length || (i < a.length && a[i] <= b[j]) ? a[i++] : b[j++];
    if (!out.length || out[out.length - 1] !== x) out.push(x);
  }
  return out;
}

// ---- event kinds. The kind is kept INSIDE the event's `notes` as a first line "[[k:war]]" because the Rust core only knows the
// fields id / title / day / endDay / notes / featureId (a new field would be dropped on save). Old files simply have no tag = 'event'.
export const EVENT_KINDS = [
  { id: 'event', label: 'Event', color: '#b5703a' },
  { id: 'founding', label: 'Founding', color: '#2f8f5b' },
  { id: 'war', label: 'War / battle', color: '#c0392b' },
  { id: 'treaty', label: 'Treaty / politics', color: '#3b6e8a' },
  { id: 'disaster', label: 'Disaster', color: '#8e5bb5' },
  { id: 'discovery', label: 'Discovery / culture', color: '#c9a227' },
];
const KIND_BY_ID = new Map(EVENT_KINDS.map((k) => [k.id, k]));
export const kindInfo = (id) => KIND_BY_ID.get(id) || KIND_BY_ID.get('event');
const KIND_TAG = /^\[\[k:([a-z]{1,16})\]\]\n?/;
/** notes -> { kind, text } (the tag line is removed from text). */
export function splitNotes(notes) {
  const s = String(notes ?? ''), m = KIND_TAG.exec(s);
  if (!m) return { kind: 'event', text: s };
  return { kind: KIND_BY_ID.has(m[1]) ? m[1] : 'event', text: s.slice(m[0].length) };
}
/** { kind, text } -> notes. The default kind adds no tag. */
export function joinNotes(kind, text) {
  const t = String(text ?? '');
  if (!kind || kind === 'event' || !KIND_BY_ID.has(kind)) return t;
  return t === '' ? `[[k:${kind}]]` : `[[k:${kind}]]\n${t}`;
}
export const eventKind = (e) => splitNotes(e.notes).kind;
/** Case-insensitive search in an event's title and notes (an empty query matches everything). */
export function matchEvent(e, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  return String(e.title ?? '').toLowerCase().includes(q) || splitNotes(e.notes).text.toLowerCase().includes(q);
}

// ---- event index: built once per change of the events; every lookup is a binary search ----
export function buildEventIndex(t) {
  const sorted = sortedEvents(t), starts = new Array(sorted.length), maxEnd = new Array(sorted.length);
  let m = -Infinity;
  for (let i = 0; i < sorted.length; i++) { starts[i] = sorted[i].day; m = Math.max(m, eventLastDay(sorted[i])); maxEnd[i] = m; }
  return { sorted, starts, maxEnd };
}
/** Events that cover `day`, in the same order as eventsOn(). */
export function eventsAtIdx(idx, day) {
  const out = [];
  for (let i = bisectRight(idx.starts, day) - 1; i >= 0 && idx.maxEnd[i] >= day; i--) if (eventLastDay(idx.sorted[i]) >= day) out.push(idx.sorted[i]);
  return out.reverse();
}
export function nextEventDayIdx(idx, day) { const i = bisectRight(idx.starts, day); return i < idx.starts.length ? idx.starts[i] : null; }
export function prevEventDayIdx(idx, day) { const i = bisectLeft(idx.starts, day); return i > 0 ? idx.starts[i - 1] : null; }
/**
 * Events that touch the window [a, b], merged into buckets of `bucketPx` pixels over `width` pixels (so a huge number of events stays
 * cheap to draw). Returns [{ left, right, day, first, n, ids }] with left / right in px from the window start. `accept(e)` filters.
 */
export function bucketEvents(idx, a, b, width, bucketPx = 6, accept = null) {
  const per = width / Math.max(1, b - a), out = [], seen = new Map(), found = [];
  const { sorted, starts, maxEnd } = idx;
  for (let i = bisectRight(starts, b) - 1; i >= 0 && maxEnd[i] >= a; i--) {
    const e = sorted[i];
    if (eventLastDay(e) >= a && (!accept || accept(e))) found.push(e);
  }
  for (let j = found.length - 1; j >= 0; j--) {
    const e = found[j], x0 = (Math.max(e.day, a) - a) * per, x1 = (Math.min(eventLastDay(e), b) - a) * per, key = Math.floor(x0 / bucketPx);
    let bk = seen.get(key);
    if (!bk) { bk = { left: x0, right: x1, day: e.day, first: e, n: 0, ids: [] }; seen.set(key, bk); out.push(bk); }
    bk.n++; bk.ids.push(e.id); if (x1 > bk.right) bk.right = x1;
  }
  return out;
}

// ---- change index: which days something starts / stops existing or switches border version ----
/**
 * { days, byDay }. `days` = sorted unique days on which a feature starts to exist (life.from), stops existing (life.to + 1) or
 * switches to a new border version (shapes[i].from). Between two consecutive values nothing on the map changes, which is what lets
 * the store skip all repaint work while the slider moves inside such a stretch. byDay: day -> [{ id, what: 'born' | 'ended' | 'border' }].
 */
export function buildChangeIndex(features) {
  const byDay = new Map();
  const add = (day, id, what) => { let l = byDay.get(day); if (!l) byDay.set(day, l = []); l.push({ id, what }); };
  for (const f of features) {
    const from = f.life?.from ?? null, to = f.life?.to ?? null;
    if (from !== null) add(from, f.id, 'born');
    if (to !== null) add(to + 1, f.id, 'ended');
    if (f.shapes) for (const s of f.shapes) if (s.from !== null && s.from !== undefined) add(s.from, f.id, 'border');
  }
  return { days: [...byDay.keys()].sort((x, y) => x - y), byDay };
}

/** One row per country for the strip's lanes, oldest first. `f` is the live feature (names and colours are read at paint time). */
export function buildLanes(features) {
  const lanes = [];
  for (const f of features) {
    if (f.kind !== 'country') continue;
    lanes.push({ f, id: f.id, from: f.life?.from ?? null, to: f.life?.to ?? null, marks: f.shapes ? f.shapes.map((s) => s.from).filter((d) => d !== null && d !== undefined) : [] });
  }
  lanes.sort((a, b) => (a.from ?? -Infinity) - (b.from ?? -Infinity) || String(a.f.name || '').localeCompare(String(b.f.name || '')));
  return lanes;
}

// ---- the view window: the stretch [a, b] of the timeline range the slider currently spans ----
export const MIN_WINDOW = 12;   // days
/** Move / shrink w = {a, b} so it lies inside range = {start, end}. */
export function shiftIntoRange(w, range) {
  const span = Math.min(w.b - w.a, range.end - range.start);
  const a = Math.max(range.start, Math.min(w.a, range.end - span));
  return { a, b: a + span };
}
/** Zoom by `factor` (< 1 zooms in) keeping the day at fraction `frac` (0..1) of the window where it is. */
export function zoomWindow(win, range, factor, frac = 0.5) {
  const full = range.end - range.start, span = win.b - win.a;
  const ns = Math.min(full, Math.max(MIN_WINDOW, Math.round(span * factor)));
  const anchor = win.a + span * frac, a = Math.round(anchor - ns * frac);
  return shiftIntoRange({ a, b: a + ns }, range);
}
export const panWindow = (win, range, deltaDays) => shiftIntoRange({ a: win.a + Math.round(deltaDays), b: win.b + Math.round(deltaDays) }, range);
/** A window of the same size that shows `day`; dir > 0 leaves room ahead (playing forward), dir < 0 behind, 0 centres it. */
export function followWindow(win, range, day, dir = 0) {
  const span = win.b - win.a, lead = dir > 0 ? 0.12 : dir < 0 ? 0.88 : 0.5, a = Math.round(day - span * lead);
  return shiftIntoRange({ a, b: a + span }, range);
}

// ---- ruler ticks and era bands (calendar aware) ----
const pad = (n, w) => String(n).padStart(w, '0');
const TICK_STEPS = [
  { unit: 'day', step: 1, days: 1 }, { unit: 'day', step: 6, days: 6 }, { unit: 'month', step: 1, days: 24.4 }, { unit: 'month', step: 3, days: 73 },
  { unit: 'year', step: 1, days: 365.2 }, { unit: 'year', step: 5, days: 1826 }, { unit: 'year', step: 10, days: 3652 }, { unit: 'year', step: 50, days: 18260 },
  { unit: 'year', step: 100, days: 36520 }, { unit: 'year', step: 500, days: 182600 }, { unit: 'year', step: 1000, days: 365200 },
];
/** Ticks for the window [a, b] drawn over `width` px: [{ day, label, major }]. At most ~400, usually 10 to 20. */
export function rulerTicks(a, b, width, minGap = 62) {
  const pxPerDay = width / Math.max(1, b - a);
  const pick = TICK_STEPS.find((s) => s.days * pxPerDay >= minGap) || TICK_STEPS[TICK_STEPS.length - 1];
  const out = [], lo = Math.max(1, Math.floor(a)), hi = Math.min(maxDayNumber(), Math.ceil(b));
  if (hi < lo) return out;
  if (pick.unit === 'day') {
    let d = lo + ((pick.step - ((lo - 1) % pick.step)) % pick.step);
    for (; d <= hi && out.length < 400; d += pick.step) {
      const dt = dayNumberToDate(d);
      out.push({ day: d, label: dt.day === 1 ? MONTHS[dt.month - 1].name.slice(0, 3) + (dt.month === 1 ? ' ' + pad(dt.year, 3) : '') : String(dt.day), major: dt.day === 1 });
    }
  } else if (pick.unit === 'month') {
    const d0 = dayNumberToDate(lo);
    let tm = Math.ceil((yearsElapsed(d0.era, d0.year) * MONTHS_PER_YEAR + (d0.month - 1)) / pick.step) * pick.step;
    for (let n = 0; n < 400; n++, tm += pick.step) {
      const y = Math.floor(tm / MONTHS_PER_YEAR), month = (tm % MONTHS_PER_YEAR) + 1, era = Math.floor(y / YEARS_PER_ERA) + 1;
      if (era > MAX_ERA) break;
      const year = y - (era - 1) * YEARS_PER_ERA, day = dateToDayNumber({ era, year, month, day: 1 });
      if (day > hi) break;
      if (day < lo) continue;
      out.push({ day, label: MONTHS[month - 1].name.slice(0, 3) + (month === 1 ? ' ' + pad(year, 3) : ''), major: month === 1 });
    }
  } else {
    const d0 = dayNumberToDate(lo);
    let ye = Math.ceil(yearsElapsed(d0.era, d0.year) / pick.step) * pick.step;
    for (let n = 0; n < 400; n++, ye += pick.step) {
      const era = Math.floor(ye / YEARS_PER_ERA) + 1;
      if (era > MAX_ERA) break;
      const year = ye - (era - 1) * YEARS_PER_ERA, day = dateToDayNumber({ era, year, month: 1, day: 1 });
      if (day > hi) break;
      if (day < lo) continue;
      out.push({ day, label: `${pad(year, 3)}-${pad(era, 2)}`, major: true });
    }
  }
  return out;
}
/** The eras that overlap the window: [{ era, name, from, to }] (to = last day of the era). */
export function eraBands(a, b) {
  const out = [], max = maxDayNumber();
  for (let era = 1; era <= ERA_NAMES.length + 1; era++) {
    const from = dateToDayNumber({ era, year: 0, month: 1, day: 1 });
    const to = era <= ERA_NAMES.length ? dateToDayNumber({ era: era + 1, year: 0, month: 1, day: 1 }) - 1 : max;
    if (to < a || from > b) continue;
    out.push({ era, name: eraName(era), from, to });
  }
  return out;
}

/** "3 days", "1,200 days (about 3.3 yr)". `days` = how many days a span covers (end - start + 1). */
export function spanText(days) {
  const n = Math.max(1, Math.round(days));
  if (n < 365) return `${n} day${n === 1 ? '' : 's'}`;
  const y = n / 365.2;
  return `${n.toLocaleString('en')} days (about ${y < 10 ? y.toFixed(1) : Math.round(y).toLocaleString('en')} yr)`;
}
