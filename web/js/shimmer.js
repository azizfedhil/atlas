// A gentle shimmer along the border of the area that is selected or shown ("Show on map", the info card).
// It has its own canvas above the map overlay and paints ONLY that border: a few strokes per frame, the cached map layers are never
// repainted. app.js calls frame() at the end of every map render (so it follows pans, zooms and rotations without lag); between
// renders its own light loop (~30 frames a second) keeps the glints moving, and the loop stops by itself when nothing is shown.
// prefers-reduced-motion: one static glow, no loop.
const TAU = Math.PI * 2;
const GLOW = '90,174,230', WHITE = '255,255,255';
const STREAMS = [                                                   // travelling glints: dash length, gap (px), speed (px / s, sign = direction), width (px), alpha
  { len: 26, gap: 250, speed: 85, width: 3, alpha: 0.9 },
  { len: 14, gap: 340, speed: -52, width: 2.4, alpha: 0.65 },
];
const MAX_GLINT_POINTS = 15000;                                     // a border this dense gets the glow only (dashing a huge path every frame is the one costly thing here)

/** canvas: the #fx canvas. getView() -> { def, cx, cy, scale, lon0, lat0, w, h }. getTarget(view, fast) -> { paths: Path2D[] (projected units), pts } | null.
 *  busy() -> true while a map render is already queued (the loop then waits for it). */
export function createShimmer({ canvas, getView, getTarget, busy = () => false, fps = 30 }) {
  const ctx = canvas.getContext('2d'), t0 = performance.now();
  const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const still = () => !!(mq && mq.matches);
  let dpr = 1, raf = 0, last = -1e9, drew = false;

  function clear() { if (drew) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); drew = false; } }

  /** paints one frame; false when there is nothing to shimmer */
  function paint(now, fast) {
    last = now;
    const v = getView(), tg = v ? getTarget(v, fast) : null;
    clear();
    if (!tg) return false;
    const calm = still(), t = (now - t0) / 1000, b = calm ? 0.6 : 0.5 + 0.5 * Math.sin((TAU * t) / 3.2);      // b: the slow breathing, 0..1
    const k = v.scale * dpr, px = 1 / v.scale;                                                                   // the paths are in projected units: 1 px = px units
    const all = (lw) => { ctx.lineWidth = lw * px; for (const p of tg.paths) ctx.stroke(p); };
    ctx.setTransform(k, 0, 0, -k, dpr * (v.w / 2 - v.cx * v.scale), dpr * (v.h / 2 + v.cy * v.scale));
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.setLineDash([]);
    ctx.strokeStyle = `rgba(${GLOW},${(0.10 + 0.10 * b).toFixed(3)})`; all(12);                                 // wide soft glow
    ctx.strokeStyle = `rgba(${WHITE},${(0.28 + 0.24 * b).toFixed(3)})`; all(5);                                 // pale halo
    ctx.strokeStyle = `rgba(${GLOW},${(0.55 + 0.25 * b).toFixed(3)})`; all(1.6);                                // thin core
    if (!calm && tg.pts <= MAX_GLINT_POINTS) {
      for (const s of STREAMS) {
        ctx.setLineDash([s.len * px, s.gap * px]);
        ctx.lineDashOffset = -(((s.speed * t) % (s.len + s.gap)) * px);
        ctx.strokeStyle = `rgba(${WHITE},${(s.alpha * 0.28).toFixed(3)})`; all(s.width * 2.6);                  // soft under-glow of the glint
        ctx.strokeStyle = `rgba(${WHITE},${s.alpha})`; all(s.width);
      }
      ctx.setLineDash([]);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drew = true;
    return true;
  }

  function tick(ts) {
    raf = 0;
    if (!busy() && ts - last >= 1000 / fps - 3) { if (!paint(ts, false)) return; }
    if (!still()) raf = requestAnimationFrame(tick);
  }

  return {
    /** the canvas is sized like the map; capped at 2x (thin glints do not need more, and fewer pixels is cheaper) */
    resize(cssW, cssH, d) {
      dpr = Math.min(d || 1, 2);
      canvas.width = Math.max(1, Math.round(cssW * dpr)); canvas.height = Math.max(1, Math.round(cssH * dpr));
      canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px'; drew = false;
    },
    /** call after every map render: repaints for the view as it is now and starts / stops the loop. fast: the view is moving (a rotating globe gets a coarser outline) */
    frame(fast = false) {
      const on = paint(performance.now(), fast);
      if (!on) { if (raf) { cancelAnimationFrame(raf); raf = 0; } return; }
      if (!raf && !still()) raf = requestAnimationFrame(tick);
    },
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; clear(); },
  };
}
