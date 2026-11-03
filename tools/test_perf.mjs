// node tools/test_perf.mjs -- frame coalescing, LRU cache and DOM-write guards from web/js/perf.js (no browser needed).
import { frameCoalesce, createLru, setHtml, setText } from '../web/js/perf.js';
let fail = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { fail++; console.log('FAIL', m); } };

// fake animation frames
let q = new Map(), nextId = 1;
const raf = (f) => { const id = nextId++; q.set(id, f); return id; }, caf = (id) => q.delete(id);
const tick = () => { const fs = [...q.values()]; q.clear(); fs.forEach((f) => f()); };

const seen = []; const c = frameCoalesce((...a) => seen.push(a), raf, caf);
c(1, 'a'); c(2, 'b'); c(3, 'c');
ok(seen.length === 0 && q.size === 1, 'nothing runs before the frame, only one frame is requested');
tick(); ok(seen.length === 1 && seen[0][0] === 3 && seen[0][1] === 'c', 'runs once with the last arguments');
tick(); ok(seen.length === 1, 'does not run again without a new call');
c(4); ok(c.pending(), 'pending after a call'); c.flush(); ok(seen.length === 2 && seen[1][0] === 4 && q.size === 0 && !c.pending(), 'flush runs now and cancels the frame');
c.flush(); ok(seen.length === 2, 'flush with nothing pending is a no-op');
c(5); c.cancel(); tick(); ok(seen.length === 2 && q.size === 0, 'cancel drops the call');
c(6); tick(); ok(seen.length === 3 && seen[2][0] === 6, 'works again after cancel');

const l = createLru(3); let made = 0; const mk = (v) => () => { made++; return v; };
ok(l.get('a', mk(1)) === 1 && l.get('a', mk(9)) === 1 && made === 1, 'cache hit does not recompute');
l.get('b', mk(2)); l.get('c', mk(3)); l.get('a', mk(0));                 // a is now most recent
l.get('d', mk(4)); ok(l.size === 3, 'size is capped');
made = 0; l.get('a', mk(1)); ok(made === 0, 'recently used entry survived');
l.get('b', mk(2)); ok(made === 1, 'least recently used entry was evicted');
l.clear(); ok(l.size === 0, 'clear');

const el = { _html: undefined, innerHTML: '', textContent: '' }; let writes = 0;
const watched = new Proxy(el, { set(t, k, v) { if (k === 'innerHTML') writes++; t[k] = v; return true; } });
setHtml(watched, '<b>x</b>'); setHtml(watched, '<b>x</b>'); setHtml(watched, '<i>y</i>'); ok(writes === 2, 'setHtml skips identical content');
let tw = 0; const te = { _t: 'a', get textContent() { return this._t; }, set textContent(v) { tw++; this._t = v; } };
setText(te, 'a'); setText(te, 'b'); setText(te, 'b'); ok(tw === 1, 'setText skips identical content');

console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} perf checks passed`); process.exit(fail ? 1 : 0);
