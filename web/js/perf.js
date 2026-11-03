// Small performance helpers (Batch 6.3). Pure, no DOM access: raf/caf are injectable so tools/test_perf.mjs can drive them.

/** Run `fn` at most once per animation frame, with the arguments of the LAST call. `.flush()` runs a pending call now
 *  (use it before handling pointerup so no move is lost); `.cancel()` drops it. */
export function frameCoalesce(fn, raf = (f) => requestAnimationFrame(f), caf = (id) => cancelAnimationFrame(id)) {
  let id = null, args = null;
  const run = () => { id = null; const a = args; args = null; if (a) fn(...a); };
  const wrapped = (...a) => { args = a; if (id === null) id = raf(run); };
  wrapped.flush = () => { if (id !== null) { caf(id); } id = null; run(); };
  wrapped.cancel = () => { if (id !== null) caf(id); id = null; args = null; };
  wrapped.pending = () => args !== null;
  return wrapped;
}

/** Tiny LRU cache (Map keeps insertion order). `get(key, make)` returns the cached value or computes and stores it. */
export function createLru(max = 256) {
  const m = new Map();
  return {
    get(key, make) {
      if (m.has(key)) { const v = m.get(key); m.delete(key); m.set(key, v); return v; }
      const v = make(); m.set(key, v);
      if (m.size > max) m.delete(m.keys().next().value);
      return v;
    },
    clear() { m.clear(); },
    get size() { return m.size; },
  };
}

/** Set innerHTML / textContent only when it changed (avoids layout work on every pointer move). */
export function setHtml(el, html) { if (el._html !== html) { el._html = html; el.innerHTML = html; } }
export function setText(el, text) { if (el.textContent !== text) el.textContent = text; }
