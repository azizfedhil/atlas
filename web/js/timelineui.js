// Timeline UI (batch 7 overhaul). The bottom bar (date, transport, playback, zoomable slider with ruler / eras / event markers / optional
// lanes) and the panel "Timeline" section ("On this day" card, event search + kind chips, event list, event form, range).
// All state lives in the store (store.timeline); this file only draws it and routes edits through store.setCurrent() (not undoable) and
// store.editTimeline() (undoable). Performance: the store emits 'day' for every slider move; drawDay() then only does cheap DOM writes.
// Events, markers, kind chips and the lane list are rebuilt only when events / range / window / width change.
import { dateCode, dateToDayNumber, dayNumberToDate, ERA_NAMES, eraName, longDate, todayDayNumber } from './calendar.js';
import {
  EVENT_KINDS, bisectLeft, bisectRight, bucketEvents, buildEventIndex, buildLanes, codeToDay, dayToCode, eventKind, eventsAtIdx, fitRange,
  includeEventsInRange, isAlive, joinNotes, kindInfo, matchEvent, mergeDays, nextEventDayIdx, prevEventDayIdx, spanText, splitNotes, stepDay,
} from './timeline.js';
import { frameCoalesce } from './perf.js';
import { INSET, createStrip } from './timelinestrip.js';
import { SPEEDS, createPlayer } from './timelineplay.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const PREF_KEY = 'cosmossi.tl.prefs';
const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREF_KEY) || '{}') || {}; } catch (_) { return {}; } };
const CHANGE_TEXT = { born: 'founded', ended: 'dissolved', border: 'new border' };
const KIND_ORDER = ['country', 'subdivision', 'city', 'range', 'river', 'label'];
const KIND_LABEL = { country: 'Countries', subdivision: 'Subdivisions', city: 'Cities', range: 'Mountain ranges', river: 'Rivers', label: 'Labels' };
const PAUSED_TEXT = 'History is off - all features are shown';

/** selectFeature(id): select that feature on the map; linkable(feature): false hides helper features (land / biome deltas) from the event link list */
export function createTimelineUI({ store, toast, selectFeature = () => {}, linkable = () => true }) {
  const $ = (s) => document.querySelector(s);
  const bar = $('#timeline'), slider = $('#tlSlider'), markers = $('#tlMarkers'), head = $('#tlHead'), track = $('#tlTrack');
  const el = {
    code: $('#tlCode'), long: $('#tlLong'), now: $('#tlNow'), on: $('#tlOn'), filter: $('#tlFilter'), era: $('#tlEra'), jump: $('#tlJump'),
    prevEv: $('#tlPrevEv'), nextEv: $('#tlNextEv'), play: $('#tlPlay'), playBack: $('#tlPlayBack'),
    speed: $('#tlSpeed'), snap: $('#tlSnap'), stop: $('#tlStop'), lanes: $('#tlLanes'),
    from: $('#tlFrom'), to: $('#tlTo'), count: $('#evCount'), list: $('#evList'), form: $('#evForm'), kinds: $('#evKinds'), search: $('#evSearch'), card: $('#tlNowCard'),
  };
  const prefs = { speed: 'y1', snap: true, stop: false, lanes: false, ...loadPrefs() };
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (_) { /* storage unavailable */ } };
  const fail = (e) => toast(String(e.message || e), true);
  const tl = () => store.timeline;

  let selEvent = null, dataVer = 0, evIdx = null, nav = null, navKey = '', dragging = false, bypassSnap = false, viewDirty = true;
  let query = '', kindFilter = new Set(), nowIds = new Set();
  let lastCode = '', lastLong = null, lastChip = '', lastEpoch = '', countText = '', lastCard = '', lastCardAt = 0, lastTl = null, lastEvents = null;
  const liById = new Map();

  const evIndex = () => evIdx || (evIdx = buildEventIndex(tl()));
  /** every day worth jumping to: feature changes + event starts (ascending, unique) */
  const navDays = () => {
    const key = dataVer + ':' + store.ver;
    if (nav === null || navKey !== key) { nav = mergeDays(store.changes.days, evIndex().starts); navKey = key; }
    return nav;
  };

  // ---------- moving the day ----------
  const goSoon = frameCoalesce((d) => store.setCurrent(d));                                  // slider input: one setCurrent per animation frame
  const go = (day) => { player.stop(); goSoon.cancel(); store.setCurrent(day); };            // buttons / keys / jumps: now, and playback stops
  /** while dragging, the slider sticks to the nearest event / change within 5 px (Alt bypasses, the Snap button turns it off) */
  function snapDay(day) {
    if (!prefs.snap || bypassSnap) return day;
    const w = strip.window, nv = navDays();
    if (!w || !nv.length) return day;
    const thr = 5 * ((w.b - w.a) / Math.max(1, track.clientWidth - 2 * INSET)), i = bisectLeft(nv, day);
    let best = null;
    for (const c of [nv[i - 1], nv[i]]) if (c !== undefined && Math.abs(c - day) <= thr && (best === null || Math.abs(c - day) < Math.abs(best - day))) best = c;
    return best === null ? day : best;
  }

  const player = createPlayer({
    getDay: () => tl().current,
    setDay: (d) => store.setCurrent(d),
    limits: () => [tl().start, tl().end],
    nextStop: (from, dir) => (dir > 0 ? nextEventDayIdx(evIndex(), from) : prevEventDayIdx(evIndex(), from)),
    onChange: () => drawPlay(),
    onStop: (reason, day) => {
      if (reason === 'event') { const e = eventsAtIdx(evIndex(), day)[0]; if (e) toast(`${dateCode(dayNumberToDate(day))} · ${e.title}`); }
      else if (reason === 'end') toast('Reached the end of the timeline range.');
    },
  });
  function drawPlay() {
    el.play.setAttribute('aria-pressed', String(player.dir > 0)); el.play.textContent = player.dir > 0 ? '⏸' : '▶';
    el.playBack.setAttribute('aria-pressed', String(player.dir < 0)); el.playBack.textContent = player.dir < 0 ? '⏸' : '◀';
    if (!player.dir) drawDay();                                                               // settle the card / chip that were throttled while playing
  }

  // ---------- the strip (ruler, eras, lanes) and the view window ----------
  const refreshViewSoon = frameCoalesce(() => { if (viewDirty) refreshView(); });
  const strip = createStrip({
    canvas: $('#tlCanvas'), host: track,
    getRange: () => ({ start: tl().start, end: tl().end }),
    onView: () => { viewDirty = true; refreshViewSoon(); },
    onLayout: () => { viewDirty = true; refreshViewSoon(); },
    onScrub: (day) => { player.stop(); goSoon(snapDay(day)); },
    onPickFeature: (id) => selectFeature(id),
  });

  /** slider range = the view window; event markers; playhead. Runs when the window, the width, the events or the kind filter change. */
  function refreshView() {
    viewDirty = false;
    const w = strip.window;
    if (!w) return;
    slider.min = String(w.a); slider.max = String(w.b);
    if (!dragging) slider.value = String(tl().current);
    drawMarkers(); drawHead();
  }
  function drawMarkers() {
    const w = strip.window, width = Math.max(0, track.clientWidth - 2 * INSET);
    if (!w || width < 20) { markers.innerHTML = ''; return; }
    const accept = kindFilter.size ? (e) => kindFilter.has(eventKind(e)) : null;
    markers.innerHTML = bucketEvents(evIndex(), w.a, w.b, width, 6, accept).map((bk) => {
      const e = bk.first, k = kindInfo(eventKind(e)), wd = Math.max(0, bk.right - bk.left);
      const title = bk.n > 1 ? `${bk.n} events from ${dateCode(dayNumberToDate(bk.day))}` : `${e.title} · ${dateCode(dayNumberToDate(e.day))}`;
      const cls = [bk.n > 1 ? 'multi' : '', e.endDay != null && wd > 2 ? 'span' : '', selEvent && bk.ids.includes(selEvent) ? 'sel' : ''].filter(Boolean).join(' ');
      return `<i class="${cls}" data-day="${bk.day}" data-id="${esc(e.id)}" style="left:${bk.left.toFixed(1)}px;${wd > 2 ? `width:${wd.toFixed(1)}px;` : ''}--k:${k.color}" title="${esc(title)}"></i>`;
    }).join('');
  }
  function drawHead() {
    const w = strip.window, d = tl().current;
    if (!w) return;
    if (d < w.a || d > w.b) { head.style.visibility = 'hidden'; return; }
    head.style.visibility = 'visible';
    head.style.transform = `translateX(${(strip.xOf(d) - 1).toFixed(1)}px)`;
  }

  // ---------- per slider move (cheap) ----------
  function drawDay() {
    const t = tl(), d = t.current, w = strip.window;
    if (w) {
      const span = w.b - w.a;
      if (d < w.a || d > w.b || (player.dir > 0 && d > w.a + span * 0.94) || (player.dir < 0 && d < w.a + span * 0.06)) strip.follow(d, player.dir);
    }
    const date = dayNumberToDate(d), code = dateCode(date);
    if (code !== lastCode) { lastCode = code; el.code.textContent = code; }
    const long = store.paused ? PAUSED_TEXT : `${longDate(date)} · ${eraName(date.era)}`;
    if (long !== lastLong) { lastLong = long; el.long.textContent = long; }
    if (!dragging) slider.value = String(d);
    drawHead();
    const idx = evIndex();
    el.prevEv.disabled = prevEventDayIdx(idx, d) === null; el.nextEv.disabled = nextEventDayIdx(idx, d) === null;
    if (document.activeElement !== el.jump) el.jump.value = dayToCode(d);
    drawNow();
  }
  /** the chip in the bar and the "On this day" card (limited to every 120 ms while playing) */
  function drawNow() {
    const nowMs = performance.now();
    if (player.dir && nowMs - lastCardAt < 120) return;
    lastCardAt = nowMs;
    const t = tl(), d = t.current, idx = evIndex(), ci = store.changes, date = dayNumberToDate(d);
    const evs = eventsAtIdx(idx, d), ch = ci.byDay.get(d) || [];
    markNow(evs);
    const chip = [evs.length ? `${evs.length} event${evs.length === 1 ? '' : 's'}` : '', ch.length ? `${ch.length} change${ch.length === 1 ? '' : 's'}` : ''].filter(Boolean).join(' · ');
    if (chip !== lastChip) { lastChip = chip; el.now.textContent = chip; el.now.hidden = !chip; }
    const key = bisectRight(ci.days, d) + ':' + store.ver + ':' + t.filterByLife + ':' + store.paused;
    if (key !== lastEpoch) {                                                                    // the count only changes when a country starts / stops existing
      lastEpoch = key;
      let n = 0, tot = 0;
      for (const f of store.features) if (f.kind === 'country') { tot++; if (isAlive(f.life, d)) n++; }
      countText = tot ? `${n} of ${tot} countries exist on this date` : '';
    }
    const rows = [];
    for (const e of evs.slice(0, 5)) rows.push(`<li data-ev="${esc(e.id)}"><i class="tn-dot" style="--k:${kindInfo(eventKind(e)).color}"></i><span>${esc(e.title)}</span><em>${e.endDay != null ? 'until ' + dayToCode(e.endDay) : 'event'}</em></li>`);
    let shown = 0;
    for (const c of ch) {
      if (shown >= 6) break;
      const f = store.find(c.id);
      if (!f) continue;
      shown++;
      rows.push(`<li data-feat="${esc(c.id)}"><i class="tn-dot ${c.what}"></i><span>${esc(f.name || f.id)}</span><em>${CHANGE_TEXT[c.what]}</em></li>`);
    }
    const extra = evs.length + ch.length - rows.length;
    const nv = navDays(), pi = bisectLeft(nv, d) - 1, ni = bisectRight(nv, d);
    const prevD = pi >= 0 ? nv[pi] : null, nextD = ni < nv.length ? nv[ni] : null;
    const html = `<div class="tn-head"><b>${esc(longDate(date))}</b><span>${esc(eraName(date.era))}</span></div>` +
      (countText ? `<div class="tn-count">${esc(countText)}</div>` : '') +
      (rows.length ? `<ul class="tn-list">${rows.join('')}</ul>${extra > 0 ? `<div class="tn-more">+${extra} more</div>` : ''}` : '<div class="tn-none">Nothing recorded on this date.</div>') +
      `<div class="tn-nav"><button type="button" data-goto="${prevD ?? ''}"${prevD === null ? ' disabled' : ''}>◂ ${prevD === null ? 'nothing earlier' : esc(dayToCode(prevD))}</button>` +
      `<button type="button" data-goto="${nextD ?? ''}"${nextD === null ? ' disabled' : ''}>${nextD === null ? 'nothing later' : esc(dayToCode(nextD))} ▸</button></div>`;
    if (html !== lastCard) { lastCard = html; el.card.innerHTML = html; }
  }
  /** events that run on the slider day get the .now mark in the list (only the rows that changed are touched) */
  function markNow(evs) {
    const next = new Set(evs.map((e) => e.id));
    for (const id of nowIds) if (!next.has(id)) { const li = liById.get(id); if (li) li.classList.remove('now'); }
    for (const id of next) if (!nowIds.has(id)) { const li = liById.get(id); if (li) li.classList.add('now'); }
    nowIds = next;
  }

  // ---------- on a change of the timeline or the features ----------
  function drawBar() {
    const t = tl();
    el.filter.checked = t.filterByLife; el.on.checked = !store.paused; bar.classList.toggle('paused', store.paused);
    slider.disabled = store.paused; el.play.disabled = store.paused; el.playBack.disabled = store.paused;
    lastLong = null;
  }
  function drawPanel(force) {
    const t = tl();
    if (document.activeElement !== el.from) el.from.value = dayToCode(t.start);
    if (document.activeElement !== el.to) el.to.value = dayToCode(t.end);
    el.count.textContent = t.events.length ? String(t.events.length) : '';
    drawKinds(); drawList(); drawForm(force);
  }
  function drawKinds() {
    const counts = new Map();
    for (const e of evIndex().sorted) { const k = eventKind(e); counts.set(k, (counts.get(k) || 0) + 1); }
    const kinds = EVENT_KINDS.filter((k) => counts.has(k.id) || kindFilter.has(k.id));
    el.kinds.hidden = kinds.length < 2 && !kindFilter.size;
    el.kinds.innerHTML = kinds.map((k) => `<button type="button" class="ev-kind${kindFilter.has(k.id) ? ' on' : ''}" data-kind="${k.id}" aria-pressed="${kindFilter.has(k.id)}" style="--k:${k.color}">${esc(k.label)} <small>${counts.get(k.id) || 0}</small></button>`).join('');
  }
  const matches = (e) => (!kindFilter.size || kindFilter.has(eventKind(e))) && matchEvent(e, query);
  function drawList() {
    const idx = evIndex(), list = idx.sorted.filter(matches);
    liById.clear();
    if (!idx.sorted.length) { el.list.innerHTML = '<li class="empty">No events yet. Add one at the slider day with the button below.</li>'; nowIds = new Set(); return; }
    if (!list.length) { el.list.innerHTML = '<li class="empty">No event matches.</li>'; nowIds = new Set(); return; }
    el.list.innerHTML = list.map((e) => `<li data-id="${esc(e.id)}" class="${e.id === selEvent ? 'active' : ''}" style="--k:${kindInfo(eventKind(e)).color}"><i>${dateCode(dayNumberToDate(e.day))}</i><span>${esc(e.title)}</span>${e.endDay != null ? `<em>${esc(spanText(e.endDay - e.day + 1))}</em>` : ''}</li>`).join('');
    for (const li of el.list.querySelectorAll('li[data-id]')) liById.set(li.dataset.id, li);
    nowIds = new Set(); markNow(eventsAtIdx(idx, tl().current));
  }
  function markActive() {
    for (const li of el.list.querySelectorAll('li.active')) li.classList.remove('active');
    const li = liById.get(selEvent); if (li) li.classList.add('active');
  }
  function drawForm(force) {
    const box = el.form, e = selEvent && tl().events.find((x) => x.id === selEvent);
    if (!e) { selEvent = null; box.hidden = true; box.innerHTML = ''; delete box.dataset.id; return; }
    if (!force && box.contains(document.activeElement) && box.dataset.id === e.id) return;     // don't fight the user's typing
    const { kind, text } = splitNotes(e.notes), nameOf = (f) => f.name || f.text || f.id;
    const groups = KIND_ORDER.map((k) => {
      const fs = store.features.filter((f) => f.kind === k && linkable(f)).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
      return fs.length ? `<optgroup label="${KIND_LABEL[k]}">${fs.map((f) => `<option value="${esc(f.id)}"${f.id === e.featureId ? ' selected' : ''}>${esc(nameOf(f))}</option>`).join('')}</optgroup>` : '';
    }).join('');
    const row = (l, inner) => `<label class="irow"><span>${l}</span>${inner}</label>`;
    const dayRow = (l, k, v, ph) => row(l, `<span class="evday"><input data-k="${k}" type="text" value="${dayToCode(v)}" placeholder="${ph}"><button type="button" data-set="${k}" title="Use the slider day" aria-label="Use the slider day">⇥</button></span>`);
    box.hidden = false; box.dataset.id = e.id;
    box.innerHTML = row('Title', `<input data-k="title" type="text" value="${esc(e.title)}">`) +
      row('Kind', `<select data-k="kind">${EVENT_KINDS.map((k) => `<option value="${k.id}"${k.id === kind ? ' selected' : ''}>${esc(k.label)}</option>`).join('')}</select>`) +
      dayRow('Day', 'day', e.day, 'DD/MM/YYY-EE') + dayRow('Ends', 'endDay', e.endDay, 'same day') +
      `<div class="ev-dur" id="evDur">Lasts ${e.endDay != null ? esc(spanText(e.endDay - e.day + 1)) : 'one day'}</div>` +
      row('Feature', `<select data-k="featureId"><option value="">(none)</option>${groups}</select>`) +
      row('Notes', `<textarea data-k="notes" rows="3">${esc(text)}</textarea>`) +
      '<div class="ev-btns"><button type="button" id="evGo" class="ghost">Go to day</button><button type="button" id="evShow" class="ghost"' + (e.featureId ? '' : ' disabled') + '>Show feature</button><button type="button" id="evDup" class="ghost">Duplicate</button></div>' +
      '<button id="evDelete" class="danger">Delete event</button>';
    for (const f of box.querySelectorAll('[data-k]')) f.addEventListener('change', () => applyField(e.id, f));
    for (const b of box.querySelectorAll('[data-set]')) b.addEventListener('click', () => { const i = box.querySelector(`[data-k="${b.dataset.set}"]`); i.value = dayToCode(tl().current); applyField(e.id, i); });
    box.querySelector('#evGo').addEventListener('click', () => go(e.day));
    box.querySelector('#evShow').addEventListener('click', () => { if (e.featureId) selectFeature(e.featureId); });
    box.querySelector('#evDup').addEventListener('click', () => duplicateEvent(e.id));
    box.querySelector('#evDelete').addEventListener('click', () => { selEvent = null; store.editTimeline((t) => { t.events = t.events.filter((x) => x.id !== e.id); }); });
  }
  function applyField(id, input) {
    const k = input.dataset.k, cur = tl().events.find((x) => x.id === id);
    if (!cur) return;
    try {
      const patch = {};
      if (k === 'title') { if (!input.value.trim()) throw new RangeError('an event needs a title'); patch.title = input.value.trim(); }
      else if (k === 'day') {
        const v = codeToDay(input.value);
        if (v === null) throw new RangeError('an event needs a day');
        if (cur.endDay != null && cur.endDay < v) throw new RangeError('the event ends before it begins');
        patch.day = v; input.value = dayToCode(v);
      } else if (k === 'endDay') {
        const v = codeToDay(input.value);
        if (v !== null && v < cur.day) throw new RangeError('the event ends before it begins');
        patch.endDay = v; input.value = dayToCode(v);
      } else if (k === 'featureId') patch.featureId = input.value || null;
      else if (k === 'kind') patch.notes = joinNotes(input.value, splitNotes(cur.notes).text);
      else if (k === 'notes') patch.notes = joinNotes(splitNotes(cur.notes).kind, input.value);
      store.editTimeline((t) => {
        Object.assign(t.events.find((x) => x.id === id), patch);
        if ('day' in patch || 'endDay' in patch) includeEventsInRange(t);                      // an event outside the range would have no marker
      });
    } catch (err) { fail(err); drawForm(true); return; }
    const after = tl().events.find((x) => x.id === id), dur = el.form.querySelector('#evDur');
    if (dur && after) dur.textContent = 'Lasts ' + (after.endDay != null ? spanText(after.endDay - after.day + 1) : 'one day');
  }
  function selectEvent(id, jump) {
    selEvent = id;
    const e = tl().events.find((x) => x.id === id);
    if (e && jump) go(e.day);
    markActive(); drawForm(true); drawMarkers();
    const li = liById.get(id); if (li) li.scrollIntoView({ block: 'nearest' });
  }
  function addEvent() {
    kindFilter.clear(); query = ''; el.search.value = '';                                       // a new event must not be hidden by a filter
    const id = store.newId('event'), day = tl().current;
    store.editTimeline((t) => { t.events.push({ id, title: 'New event', day, endDay: null, notes: '', featureId: null }); });
    selectEvent(id, false);
    const n = el.form.querySelector('[data-k="title"]'); if (n) { n.focus(); n.select(); }
  }
  function duplicateEvent(id) {
    const src = tl().events.find((x) => x.id === id);
    if (!src) return;
    const nid = store.newId('event');
    store.editTimeline((t) => { t.events.push({ ...src, id: nid, title: src.title + ' (copy)' }); });
    selectEvent(nid, false);
  }

  // ---------- lanes ----------
  function refreshLanes() { if (strip.open) strip.setLanes(buildLanes(store.features)); }
  function setLanes(on) {
    prefs.lanes = !!on; savePrefs();
    el.lanes.setAttribute('aria-pressed', String(!!on));
    strip.setOpen(!!on); refreshLanes();
  }

  /** everything that depends on the events, the range or the features. events = false: only features changed (the event list stays). */
  function refreshAll({ force = false, events = true } = {}) {
    strip.setRange(); refreshLanes();
    if (events) { viewDirty = true; refreshView(); drawBar(); drawPanel(force); } else strip.redraw();
    drawDay();
  }

  // ---------- wiring ----------
  slider.addEventListener('pointerdown', (e) => { player.stop(); dragging = true; bypassSnap = e.altKey; });
  const endDrag = () => { if (!dragging) return; dragging = false; goSoon.flush(); drawDay(); };
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
  slider.addEventListener('input', () => {
    let d = +slider.value;
    if (dragging) { const s = snapDay(d); if (s !== d) { d = s; slider.value = String(s); } }
    else player.stop();
    goSoon(d);
  });
  $('#tlPrevDay').addEventListener('click', () => go(stepDay(tl().current, { days: -1 })));
  $('#tlNextDay').addEventListener('click', () => go(stepDay(tl().current, { days: 1 })));
  $('#tlPrevYear').addEventListener('click', () => go(stepDay(tl().current, { years: -1 })));
  $('#tlNextYear').addEventListener('click', () => go(stepDay(tl().current, { years: 1 })));
  el.prevEv.addEventListener('click', () => { const d = prevEventDayIdx(evIndex(), tl().current); if (d !== null) go(d); });
  el.nextEv.addEventListener('click', () => { const d = nextEventDayIdx(evIndex(), tl().current); if (d !== null) go(d); });
  el.play.addEventListener('click', () => player.toggle(1));
  el.playBack.addEventListener('click', () => player.toggle(-1));
  $('#tlToday').addEventListener('click', () => { try { go(todayDayNumber()); } catch (e) { fail(e); } });
  el.jump.addEventListener('change', (e) => {
    try { const d = codeToDay(e.target.value); if (d === null) throw new RangeError('type a date as DD/MM/YYY-EE'); go(d); } catch (err) { fail(err); }
    el.jump.value = dayToCode(tl().current);
  });
  el.era.innerHTML = '<option value="">Era…</option>' + ERA_NAMES.map((n, i) => `<option value="${i + 1}">${i + 1} · ${esc(n)}</option>`).join('');
  el.era.addEventListener('change', () => {
    const era = +el.era.value; el.era.value = '';
    if (!era) return;
    try {
      const day = dateToDayNumber({ era, year: 0, month: 1, day: 1 });
      if (day < tl().start || day > tl().end) store.editTimeline((t) => { t.start = Math.min(t.start, day); t.end = Math.max(t.end, day + 1); });   // the era is outside a narrowed range: widen it
      go(day);
    } catch (err) { fail(err); }
  });
  markers.addEventListener('click', (e) => { const i = e.target.closest('i[data-id]'); if (i) selectEvent(i.dataset.id, true); });
  el.on.addEventListener('change', (e) => { store.setPaused(!e.target.checked); try { localStorage.setItem('cosmossi.tlpaused', store.paused ? '1' : '0'); } catch (_) { /* storage unavailable */ } });
  el.filter.addEventListener('change', (e) => store.editTimeline((t) => { t.filterByLife = e.target.checked; }));
  el.speed.innerHTML = SPEEDS.map((s) => `<option value="${s.id}">${esc(s.label)}</option>`).join('');
  el.speed.value = SPEEDS.some((s) => s.id === prefs.speed) ? prefs.speed : 'y1';
  player.setSpeed(el.speed.value); player.setStopAtEvents(!!prefs.stop);
  el.speed.addEventListener('change', () => { prefs.speed = el.speed.value; player.setSpeed(el.speed.value); savePrefs(); });
  el.snap.setAttribute('aria-pressed', String(!!prefs.snap));
  el.snap.addEventListener('click', () => { prefs.snap = !prefs.snap; el.snap.setAttribute('aria-pressed', String(prefs.snap)); savePrefs(); });
  el.stop.setAttribute('aria-pressed', String(!!prefs.stop));
  el.stop.addEventListener('click', () => { prefs.stop = !prefs.stop; el.stop.setAttribute('aria-pressed', String(prefs.stop)); player.setStopAtEvents(prefs.stop); savePrefs(); });
  $('#tlZoomIn').addEventListener('click', () => strip.zoomBy(0.5));
  $('#tlZoomOut').addEventListener('click', () => strip.zoomBy(2));
  $('#tlFitView').addEventListener('click', () => strip.fit());
  el.lanes.addEventListener('click', () => setLanes(!strip.open));
  // panel
  $('#evAdd').addEventListener('click', addEvent);
  el.list.addEventListener('click', (e) => { const li = e.target.closest('li[data-id]'); if (li) selectEvent(li.dataset.id, true); });
  el.search.addEventListener('input', frameCoalesce(() => { query = el.search.value; drawList(); }));
  el.kinds.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-kind]');
    if (!b) return;
    if (kindFilter.has(b.dataset.kind)) kindFilter.delete(b.dataset.kind); else kindFilter.add(b.dataset.kind);
    drawKinds(); drawList(); viewDirty = true; refreshView();
  });
  el.card.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-goto]');
    if (b) { if (b.dataset.goto !== '') go(+b.dataset.goto); return; }
    const li = e.target.closest('li');
    if (!li) return;
    if (li.dataset.ev) selectEvent(li.dataset.ev, false); else if (li.dataset.feat) selectFeature(li.dataset.feat);
  });
  const setRange = () => {
    try {
      const a = codeToDay(el.from.value), b = codeToDay(el.to.value);
      if (a === null || b === null) throw new RangeError('the range needs a start and an end date');
      if (a >= b) throw new RangeError('the range must end after it begins');
      store.editTimeline((t) => { t.start = a; t.end = b; t.current = Math.min(Math.max(t.current, a), b); });
    } catch (err) { fail(err); el.from.value = dayToCode(tl().start); el.to.value = dayToCode(tl().end); }
  };
  el.from.addEventListener('change', setRange); el.to.addEventListener('change', setRange);
  $('#tlFit').addEventListener('click', () => {
    const r = fitRange(tl(), store.features);
    if (!r) { toast('Nothing to fit yet: add lifespans or events first.'); return; }
    store.editTimeline((t) => { t.start = r.start; t.end = Math.max(r.end, r.start + 1); t.current = Math.min(Math.max(t.current, t.start), t.end); });
    strip.fit();
  });

  store.on((type) => {
    if (type === 'live' || type === 'meta') return;
    if (type === 'day') { drawDay(); return; }
    const sameEvents = type === 'change' && lastTl === tl() && lastEvents === tl().events;     // a feature edit: the events did not change
    lastTl = tl(); lastEvents = tl().events;
    if (!sameEvents) { dataVer++; evIdx = null; }
    if (type === 'timeline' && store.paused) player.stop();
    refreshAll({ force: type === 'change', events: !sameEvents });
  });

  // ---------- boot ----------
  lastTl = tl(); lastEvents = tl().events;
  strip.setRange();
  el.lanes.setAttribute('aria-pressed', String(!!prefs.lanes));
  strip.setOpen(!!prefs.lanes);
  refreshAll({ force: true });
  drawPlay();

  return {
    player, strip,
    /** Keyboard: , . = day back/forward (Shift = year), [ ] = previous/next event, { } = previous/next change, K / J = play forwards / backwards. Returns true when handled. */
    keydown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return false;
      const t = tl(), c = t.current, y = e.shiftKey;
      switch (e.key) {
        case ',': case '<': go(stepDay(c, y ? { years: -1 } : { days: -1 })); return true;
        case '.': case '>': go(stepDay(c, y ? { years: 1 } : { days: 1 })); return true;
        case '[': { const d = prevEventDayIdx(evIndex(), c); if (d !== null) go(d); return true; }
        case ']': { const d = nextEventDayIdx(evIndex(), c); if (d !== null) go(d); return true; }
        case '{': { const nv = navDays(), i = bisectLeft(nv, c) - 1; if (i >= 0) go(nv[i]); return true; }
        case '}': { const nv = navDays(), i = bisectRight(nv, c); if (i < nv.length) go(nv[i]); return true; }
        case 'k': case 'K': if (!store.paused) player.toggle(1); return true;
        case 'j': case 'J': if (!store.paused) player.toggle(-1); return true;
        default: return false;
      }
    },
  };
}
