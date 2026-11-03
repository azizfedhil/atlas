// Project state with snapshot-based undo/redo. Features are plain JSON (same shape the Rust core validates).
// Batch 5.3: the store also owns the timeline (range, events, filter flag, current day). Undo/redo snapshots cover
// features AND timeline, but moving the slider (setCurrent) is a view change: it is never an undo step and
// undo/redo keep the day you are looking at (clamped into the restored range).
// Batch 7 (performance): setCurrent emits 'day' with { day, prev, epochChanged, switched }. `epochChanged` is true only when the move
// crossed a day on which some feature starts / stops existing or switches border version (see buildChangeIndex), so listeners can skip
// every repaint while the slider moves inside a quiet stretch. `ver` counts feature mutations and invalidates the cached lists.
import { createTimeline, normalizeTimeline, timelineProblems, buildChangeIndex, bisectRight } from './timeline.js';
import { foldLegacyParts } from './legacyparts.js';

export const FORMAT_VERSION = 2;
const NONE = Object.freeze([]);

export function createStore() {
  let paused = false, feats = [], tl = createTimeline(), undoStack = [], redoStack = [], counter = 0;
  let ver = 0, shaped = null, ci = null, ciVer = -1;
  const listeners = new Set();
  const bump = () => { ver++; shaped = null; };
  // Border history: a feature may carry f.shapes = [{from: day|null, rings, handles?}] (sorted, first from = null).
  // f.rings / f.handles are always the version in effect on the slider day, so the editor never needs to know about versions.
  const ai = new WeakMap();
  const aIdx = (f, day) => { let k = 0; f.shapes.forEach((sh, i) => { if (sh.from == null || sh.from <= day) k = i; }); return k; };
  const commit = (f) => { const i = ai.get(f); if (f.shapes && i !== undefined && f.shapes[i]) { f.shapes[i].rings = f.rings; if (f.handles) f.shapes[i].handles = f.handles; else delete f.shapes[i].handles; } };
  const useShape = (f, i) => { const sh = f.shapes[i]; f.rings = sh.rings; if (sh.handles) f.handles = sh.handles; else delete f.handles; ai.set(f, i); };
  const shapedList = () => shaped || (shaped = feats.filter((f) => f.shapes && f.shapes.length));   // only these need a version check
  /** puts every feature that has border versions on the version in effect on tl.current; returns the features that switched */
  const sync = () => {
    const out = [];
    for (const f of shapedList()) {
      const i = aIdx(f, tl.current), prev = ai.get(f);
      if (prev === i) continue;
      if (prev !== undefined) commit(f);
      useShape(f, i); out.push(f);
    }
    return out;
  };
  const changes = () => { if (!ci || ciVer !== ver) { ci = buildChangeIndex(feats); ciVer = ver; } return ci; };
  const snap = () => { feats.forEach(commit); return JSON.stringify({ f: feats, t: tl }); };
  const restore = (str) => {
    const o = JSON.parse(str), cur = tl.current;
    feats = o.f; tl = o.t;
    tl.current = Math.min(Math.max(cur, tl.start), tl.end); bump(); sync();
  };
  const emit = (type, info) => listeners.forEach((fn) => fn(type, info));
  // memory cap: every undo step is the whole map as a string, so a big road network would make 300 steps huge; keep at least 20 steps, drop the oldest beyond ~120 M characters
  const UNDO_CHARS = 120e6, undoChars = () => undoStack.reduce((n, s) => n + s.length, 0);
  const pushUndo = () => { undoStack.push(snap()); while (undoStack.length > 300 || (undoStack.length > 20 && undoChars() > UNDO_CHARS)) undoStack.shift(); redoStack = []; };
  return {
    get features() { return feats; },
    get timeline() { return tl; },
    get canUndo() { return undoStack.length > 0; },
    get canRedo() { return redoStack.length > 0; },
    /** counts every change made to the features (edit / live / undo / redo / load); caches elsewhere key on it */
    get ver() { return ver; },
    /** { days, byDay } of the feature changes (see buildChangeIndex); rebuilt lazily after the features changed */
    get changes() { return changes(); },
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    find: (id) => feats.find((f) => f.id === id),
    newId(kind) { return `${kind}-${Date.now().toString(36)}${(counter++).toString(36)}`; },
    /** one undoable change */
    edit(fn) { pushUndo(); bump(); fn(feats); bump(); emit('change'); },
    /** one undoable change to the timeline (range, events, filter flag); fn receives the timeline object */
    editTimeline(fn) { pushUndo(); fn(tl); emit('timeline'); },
    get paused() { return paused; },
    /** history off: the slider day is frozen, every feature shows regardless of lifespan, borders stay on the version in effect */
    setPaused(on) { paused = !!on; emit('timeline'); },
    /** move the slider: not undoable, clamped into the range; returns the day actually set. Emits 'day' (see the header comment). */
    setCurrent(day) {
      if (paused || !Number.isFinite(day)) return tl.current;
      const d = Math.min(Math.max(Math.round(day), tl.start), tl.end);
      if (d === tl.current) return d;
      const prev = tl.current, days = changes().days;
      const epochChanged = bisectRight(days, prev) !== bisectRight(days, d);
      tl.current = d;
      const switched = epochChanged ? sync() : NONE;
      emit('day', { day: d, prev, epochChanged, switched });
      return d;
    },
    /** start a continuous change (drag, typing): one undo step, then call live() as often as needed */
    begin() { pushUndo(); },
    live(fn, type = 'live') { bump(); fn(feats); bump(); emit(type); },                  // type 'meta' = a change that is not drawn on the map (the app skips the repaint for it)
    undo() { if (!undoStack.length) return; redoStack.push(snap()); restore(undoStack.pop()); emit('change'); },
    redo() { if (!redoStack.length) return; undoStack.push(snap()); restore(redoStack.pop()); emit('change'); },
    /** replace everything (opening a file); clears history. `timeline` may be omitted (= default timeline). */
    load(features, timeline) { feats = features; tl = timeline ? normalizeTimeline(timeline) : createTimeline(); undoStack = []; redoStack = []; bump(); sync(); emit('change'); },
    shapeIndex: (f) => (f.shapes ? (ai.get(f) ?? 0) : 0),
    /** start a new border version for `f` on `day` (a copy of the version in effect) */
    addShape(f, day) {
      if (f.shapes && f.shapes.some((x) => x.from === day)) return false;
      this.edit(() => {
        if (!f.shapes) { f.shapes = [{ from: null, rings: f.rings, handles: f.handles }]; ai.set(f, 0); }
        commit(f);
        const c = JSON.parse(JSON.stringify({ rings: f.rings, handles: f.handles }));
        f.shapes.push({ from: day, ...c });
        f.shapes.sort((a, b) => (a.from ?? -Infinity) - (b.from ?? -Infinity));
        ai.set(f, f.shapes.findIndex((x) => x.rings === f.rings)); sync();
      });
      return true;
    },
    removeShape(f, i) {
      if (!f.shapes || f.shapes.length < 2) return;
      this.edit(() => {
        commit(f); f.shapes.splice(i, 1); f.shapes[0].from = null;
        if (f.shapes.length === 1) { useShape(f, 0); delete f.shapes; ai.delete(f); } else { ai.delete(f); sync(); }
      });
    },
    /** change the start day of border version `i` (not the first one); false when the day is invalid or another version already starts on it */
    moveShape(f, i, day) {
      if (!f.shapes || i < 1 || i >= f.shapes.length) return false;
      if (!Number.isInteger(day) || day < 1 || f.shapes.some((x, j) => j !== i && x.from === day)) return false;
      this.edit(() => {
        commit(f);
        f.shapes[i].from = day;
        f.shapes.sort((a, b) => (a.from ?? -Infinity) - (b.from ?? -Infinity));
        ai.delete(f); sync();
      });
      return true;
    },
    toProject(name, planetRadiusKm) { feats.forEach(commit); return { version: FORMAT_VERSION, name, planetRadiusKm, features: feats, timeline: tl }; },
  };
}

/** light client-side check mirroring the Rust validation; the Rust core remains the authority when saving */
export function checkProject(p) {
  if (!p || typeof p !== 'object') throw new Error('not a Cosmossi map file');
  if (p.version > FORMAT_VERSION) throw new Error(`file format ${p.version} is newer than this app understands`);
  if (!Array.isArray(p.features)) throw new Error('missing features');
  if (!(p.planetRadiusKm > 0)) throw new Error('missing planet radius');
  const ids = new Set();
  for (const f of p.features) {
    if (!f.id || ids.has(f.id)) throw new Error('duplicate or empty feature id');
    ids.add(f.id);
    if (!['country', 'subdivision', 'range', 'river', 'road', 'city', 'label'].includes(f.kind)) throw new Error('unknown feature kind ' + f.kind);
    if (f.kind === 'subdivision' && !p.features.some((g) => g.id === f.parent)) throw new Error('subdivision ' + (f.name || f.id) + ' has no parent');
    if (f.handles && f.handles.length && f.handles.length !== f.rings[0].length) throw new Error('curve handles do not match the points of ' + (f.name || f.id));
  }
  return migrateProject(p);
}

/** Upgrades older files in place (v1 -> v2: adds the default timeline), validates the timeline and returns `p`. */
export function migrateProject(p) {
  p.timeline = normalizeTimeline(p.timeline);
  foldLegacyParts(p.features, p.timeline);               // old files: islands stored as separate features (partOf) become rings of their country
  const problems = timelineProblems(p.timeline, p.features);
  if (problems.length) throw new Error(problems.join('; '));
  p.version = FORMAT_VERSION;
  return p;
}
