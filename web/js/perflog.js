// Togglable performance recorder (F4). Off by default and free when off: every call site checks `plog.on` first.
// While on it keeps (a) one record per rendered frame, (b) discrete events (gesture start/end, GL resize, pan-bitmap rebuilds, crisp repaints,
// browser long tasks, stalls between animation frames) and, on stop, turns them into a compact text report to copy and send.
// It never calls gl.finish() (unlike F3), so it does not distort the timing it measures.
const MAX_FRAMES = 20000, MAX_EVENTS = 3000;
const pct = (a, p) => (a.length ? a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))] : 0);
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
let tinyCv = null;
/** F4 only: draws `canvas` into a 1x1 canvas, which forces its queued drawing to run now; returns the ms it took (the GPU / raster cost of everything drawn on it so far) */
export function probeFlush(canvas) {
  tinyCv = tinyCv || document.createElement('canvas'); tinyCv.width = tinyCv.height = 1;
  const t = performance.now(); tinyCv.getContext('2d').drawImage(canvas, 0, 0, 1, 1);
  return performance.now() - t;
}
const sorted = (a) => a.slice().sort((x, y) => x - y);

export const plog = {
  on: false, snap: null, t0: 0, frames: [], events: [], state: null, onChange: null, _raf: 0, _obs: null,
  now: () => performance.now(),
  start() {
    this.frames = []; this.events = []; this.t0 = performance.now(); this.on = true;
    let last = 0;                                                 // stalls between animation frames, whether or not the app rendered
    const tick = (t) => { if (!this.on) return; if (last && t - last > 34) this.ev('raf-gap', { ms: +(t - last).toFixed(1) }); last = t; this._raf = requestAnimationFrame(tick); };
    this._raf = requestAnimationFrame(tick);
    try {
      this._obs = new PerformanceObserver((l) => { for (const e of l.getEntries()) this.ev('longtask', { ms: +e.duration.toFixed(1) }); });
      this._obs.observe({ entryTypes: ['longtask'] });
    } catch (e) { this._obs = null; }
    if (this.onChange) this.onChange(true);
  },
  stop() {
    this.on = false; cancelAnimationFrame(this._raf);
    if (this._obs) { try { this._obs.disconnect(); } catch (e) { /* ignore */ } this._obs = null; }
    if (this.onChange) this.onChange(false);
  },
  ev(type, data = {}) {
    if (!this.on) return;
    if (this.events.length < MAX_EVENTS) this.events.push({ t: performance.now() - this.t0, type, i: this.state ? this.state().i : 0, ...data });
  },
  frame(r) { if (this.on && this.frames.length < MAX_FRAMES) this.frames.push({ t: performance.now() - this.t0, ...r }); },

  /** the report: header, summary (moving vs resting frames), overlay branch table, then one chronological list of slow frames + events */
  report(meta) {
    const F = this.frames, E = this.events, dur = (E.length || F.length ? Math.max(F.length ? F[F.length - 1].t : 0, E.length ? E[E.length - 1].t : 0) : 0) / 1000;
    const L = [];
    L.push('COSMOSSI PERF LOG  ' + new Date().toISOString());
    L.push(Object.entries(meta).map(([k, v]) => k + '=' + (typeof v === 'object' ? JSON.stringify(v) : v)).join('  '));
    L.push(`recorded ${f1(dur)} s, ${F.length} frames, ${E.length} events`);
    L.push('');
    const part = (name, fr) => {
      if (!fr.length) { L.push(name + ': no frames'); return; }
      const gaps = sorted(fr.filter((x) => x.gap > 0 && x.gap < 1000).map((x) => x.gap)), cpu = sorted(fr.map((x) => x.cpu)), gl = sorted(fr.map((x) => x.gl)), ov = sorted(fr.map((x) => x.ov));
      const over = (a, lim) => f1((100 * a.filter((x) => x > lim).length) / Math.max(1, a.length)) + '%';
      L.push(`${name}: ${fr.length} frames`);
      L.push(`  frame interval ms  p50 ${f1(pct(gaps, 50))}  p95 ${f1(pct(gaps, 95))}  p99 ${f1(pct(gaps, 99))}  max ${f1(pct(gaps, 100))}   >25ms ${over(gaps, 25)}  >50ms ${over(gaps, 50)}  >100ms ${over(gaps, 100)}`);
      L.push(`  cpu per frame ms   p50 ${f1(pct(cpu, 50))}  p95 ${f1(pct(cpu, 95))}  max ${f1(pct(cpu, 100))}   (gl ${f1(pct(gl, 50))}/${f1(pct(gl, 95))}/${f1(pct(gl, 100))}  overlay ${f1(pct(ov, 50))}/${f1(pct(ov, 95))}/${f1(pct(ov, 100))}  as p50/p95/max)`);
    };
    part('MOVING (drag / zoom / fling)', F.filter((x) => x.i));
    part('RESTING (hover, clicks, edits)', F.filter((x) => !x.i));
    L.push('');
    const br = new Map();
    for (const x of F) { const k = (x.i ? 'moving ' : 'rest   ') + x.br; const b = br.get(k) || { n: 0, ov: 0, hv: 0, mx: 0 }; b.n++; b.ov += x.ov; b.hv += x.hv; b.mx = Math.max(b.mx, x.ov); br.set(k, b); }
    L.push('overlay path taken (frames, mean overlay ms, max overlay ms, mean heavy-paint ms)');
    for (const [k, b] of [...br].sort((a, c) => c[1].n - a[1].n)) L.push(`  ${k.padEnd(28)} ${String(b.n).padStart(5)}  ${f1(b.ov / b.n).padStart(6)}  ${f1(b.mx).padStart(6)}  ${f1(b.hv / b.n).padStart(6)}`);
    const rb = E.filter((e) => e.type === 'pan-rebuild');
    if (rb.length) {                                            // where a pan-bitmap rebuild spends its time: CPU stages, then the queued raster work forced after each stage
      L.push(''); L.push(`pan-rebuild breakdown, ${rb.length} rebuilds (mean / max ms; fg = graticule raster, fc = coast + rivers raster, flush = the rest of the raster work; spH / spB / spL = name pictures reused / built / out of time)`);
      for (const k of ['ms', 'grat', 'base', 'polys', 'names', 'rest', 'fg', 'fc', 'flush', 'spH', 'spB', 'spL']) {
        const xs = rb.map((e) => e[k]).filter((x) => typeof x === 'number'); if (!xs.length) continue;
        L.push(`  ${k.padEnd(6)} ${f1(xs.reduce((a, b) => a + b, 0) / xs.length).padStart(7)} ${f1(Math.max(...xs)).padStart(7)}`);
      }
    }
    const ev = new Map(); for (const e of E) ev.set(e.type, (ev.get(e.type) || 0) + 1);
    L.push(''); L.push('events: ' + ([...ev].map(([k, n]) => k + ' x' + n).join(', ') || 'none'));
    L.push('');
    L.push('TIMELINE (slow frames: interval >33 ms or cpu >12 ms, plus events; i=1 means the view was moving)');
    const rows = [];
    for (const x of F) if ((x.gap > 33 && x.gap < 1000) || x.cpu > 12) rows.push({ t: x.t, s: `frame  gap ${f1(x.gap)}  cpu ${f1(x.cpu)} (gl ${f1(x.gl)} + ov ${f1(x.ov)})  i=${x.i} p=${x.p} c=${x.c}  glDpr=${x.gD}  drew=${x.drew ? 1 : 0}  path=${x.br}${x.hv ? ' heavy ' + f1(x.hv) : ''}` });
    for (const e of E) { const { t, type, i, ...rest } = e; rows.push({ t, s: `EVENT  ${type}  i=${i}  ${Object.entries(rest).map(([k, v]) => k + '=' + (typeof v === 'number' ? f1(v) : v)).join(' ')}` }); }
    rows.sort((a, b) => a.t - b.t);
    const lim = 400;
    for (const r of rows.slice(0, lim)) L.push(`${(r.t / 1000).toFixed(3).padStart(8)}s  ${r.s}`);
    if (rows.length > lim) L.push(`... ${rows.length - lim} more rows not shown`);
    return L.join('\n');
  },
};
