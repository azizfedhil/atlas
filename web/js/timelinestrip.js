// Timeline strip (batch 7): the canvas around the slider. It draws era bands, a date ruler and (optionally) one lane per country showing
// when the country exists (a bar) and when its border changes (white notches). It also owns the VIEW WINDOW: the stretch of the timeline
// range the slider currently spans (wheel = zoom, Shift+wheel = pan, drag the lanes = pan, double-click = whole range).
// The slider DAY lives in the store; this file never changes it (it asks the UI to, through onScrub).
// Cost: at most one paint per animation frame, and only when its data, window, width or hover changed. The playhead is a DOM element.
import { eraBands, followWindow, lifeSummary, panWindow, rulerTicks, shiftIntoRange, zoomWindow } from './timeline.js';
import { frameCoalesce } from './perf.js';

export const INSET = 8;                   // px. The native range thumb's centre runs from INSET to width - INSET; ruler, lanes, markers and playhead use the same mapping
export const RULER_H = 34, MID_H = 24;    // the ruler (eras + ticks + labels), then the row where the native slider and the event markers sit
const ERA_H = 13, LANE_H = 15, MAX_LANES = 6, LANES_Y = RULER_H + MID_H + 3;
const FONT = '10px Archivo, system-ui, "Segoe UI", sans-serif';
const ERA_FONT = '600 9px Archivo, system-ui, "Segoe UI", sans-serif';

/** readable text colour on a #rrggbb fill */
const textOn = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#fff';
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1b252c' : '#fff';
};

/**
 * canvas: the strip's <canvas>; host: the element that holds it, the slider and the markers (its height is set here);
 * getRange() -> { start, end }; onView(win) the window changed; onLayout() width or height changed; onScrub(day) the user dragged on the ruler;
 * onPickFeature(id) a lane bar was clicked.
 */
export function createStrip({ canvas, host, getRange, onView = () => {}, onLayout = () => {}, onScrub = () => {}, onPickFeature = () => {} }) {
  const ctx = canvas.getContext('2d');
  let win = null, lastRange = null, lanes = [], open = false, laneTop = 0, hoverId = null, drag = null, W = 0, H = 0;

  const inner = () => Math.max(1, (W || host.clientWidth) - 2 * INSET);
  const xOf = (day) => INSET + ((day - win.a) / Math.max(1, win.b - win.a)) * inner();
  const dayAt = (x) => Math.round(Math.min(win.b, Math.max(win.a, win.a + ((x - INSET) / inner()) * (win.b - win.a))));
  const pt = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  /** [x0, x1] of a lane's bar in the current window, or null when the country does not exist inside it */
  const barX = (lane) => {
    if ((lane.from !== null && lane.from > win.b) || (lane.to !== null && lane.to < win.a)) return null;
    const from = lane.from === null ? win.a : Math.max(lane.from, win.a), to = lane.to === null ? win.b : Math.min(lane.to + 1, win.b);
    const x0 = xOf(from);
    return [x0, Math.max(x0 + 2, xOf(to))];
  };
  const laneAtY = (y) => {
    if (!open || y < LANES_Y) return null;
    const r = Math.floor((y - LANES_Y) / LANE_H), i = laneTop + r;
    return r < MAX_LANES && i < lanes.length ? lanes[i] : null;
  };

  function paint() {
    if (!win) return;
    const w = Math.round(host.clientWidth);
    if (w < 40) return;                                                      // hidden (collapsed or history off)
    const nVis = open ? Math.min(MAX_LANES, Math.max(1, lanes.length)) : 0;
    const h = open ? LANES_Y + nVis * LANE_H + 3 : RULER_H + MID_H;
    const layoutChanged = w !== W || h !== H;
    W = w; H = h;
    if (host.style.height !== h + 'px') host.style.height = h + 'px';
    const dpr = window.devicePixelRatio || 1, cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue('--ink').trim() || '#33434d', muted = cs.getPropertyValue('--muted').trim() || '#7b8790', line = cs.getPropertyValue('--line').trim() || '#d8ceb2';

    // era bands
    ctx.font = ERA_FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (const bd of eraBands(win.a, win.b)) {
      const x0 = Math.max(0, xOf(bd.from)), x1 = Math.min(W, xOf(bd.to + 1));
      if (x1 <= x0) continue;
      ctx.fillStyle = bd.era % 2 ? 'rgba(59,110,138,.18)' : 'rgba(59,110,138,.09)';
      ctx.fillRect(x0, 0, x1 - x0, ERA_H);
      const full = bd.name, short = 'Era ' + bd.era;
      const label = ctx.measureText(full).width + 8 <= x1 - x0 ? full : ctx.measureText(short).width + 8 <= x1 - x0 ? short : '';
      if (label) { ctx.fillStyle = muted; ctx.fillText(label, x0 + 4, ERA_H / 2 + 0.5); }
    }
    // ruler
    ctx.font = FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    let lastRight = -1e9;
    for (const t of rulerTicks(win.a, win.b, inner())) {
      const x = Math.round(xOf(t.day)) + 0.5;
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, t.major ? ERA_H : ERA_H + 4); ctx.lineTo(x, 24); ctx.stroke();
      const tw = ctx.measureText(t.label).width;
      if (x - tw / 2 > lastRight + 4 && x - tw / 2 > 0 && x + tw / 2 < W) { ctx.fillStyle = muted; ctx.fillText(t.label, x, 25); lastRight = x + tw / 2; }
    }
    // lanes
    if (open) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      if (!lanes.length) { ctx.fillStyle = muted; ctx.fillText('No countries yet - draw one to see its history here.', INSET, LANES_Y + LANE_H / 2); }
      for (let r = 0; r < nVis; r++) {
        const lane = lanes[laneTop + r];
        if (!lane) break;
        const y = LANES_Y + r * LANE_H, bh = LANE_H - 3, f = lane.f, hot = lane.id === hoverId, bx = barX(lane);
        ctx.fillStyle = 'rgba(120,130,140,.12)'; ctx.fillRect(INSET, y + bh / 2, W - 2 * INSET, 1);
        if (!bx) continue;
        const [x0, x1] = bx, col = f.color || '#4a86b8';
        ctx.globalAlpha = hot ? 1 : 0.8; ctx.fillStyle = col;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x0, y, x1 - x0, bh, 3); else ctx.rect(x0, y, x1 - x0, bh);
        ctx.fill(); ctx.globalAlpha = 1;
        if (hot) { ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.stroke(); }
        let lastX = -9;
        for (const d of lane.marks) {                                        // border changes: a white notch with a dark edge
          if (d < win.a || d > win.b) continue;
          const x = xOf(d);
          if (x - lastX < 3) continue;
          lastX = x;
          ctx.fillStyle = 'rgba(20,28,34,.6)'; ctx.fillRect(x - 1.5, y - 1, 3, bh + 2);
          ctx.fillStyle = '#fff'; ctx.fillRect(x - 0.5, y - 1, 1, bh + 2);
        }
        if (x1 - x0 > 40) {
          ctx.save(); ctx.beginPath(); ctx.rect(x0, y, x1 - x0, bh); ctx.clip();
          ctx.fillStyle = textOn(col); ctx.fillText(f.name || f.id, Math.max(x0, INSET) + 4, y + bh / 2 + 0.5);
          ctx.restore();
        }
      }
      if (lanes.length > MAX_LANES) {                                        // a thin scroll thumb
        const trackH = nVis * LANE_H, th = Math.max(10, (trackH * MAX_LANES) / lanes.length);
        const ty = LANES_Y + (trackH - th) * (laneTop / (lanes.length - MAX_LANES));
        ctx.fillStyle = 'rgba(120,130,140,.45)'; ctx.fillRect(W - 4, ty, 3, th);
      }
    }
    if (layoutChanged) onLayout();
  }
  const schedule = frameCoalesce(paint);

  // ---------- the view window ----------
  function setWindow(w) {
    const next = shiftIntoRange(w, getRange2());
    if (win && next.a === win.a && next.b === win.b) return;
    win = next; schedule(); onView(win);
  }
  const getRange2 = () => { const r = getRange(); return { start: r.start, end: r.end }; };
  function setRange() {
    const r = getRange2();
    if (!win) win = { a: r.start, b: r.end };
    else if (lastRange && win.a === lastRange.start && win.b === lastRange.end) win = { a: r.start, b: r.end };   // it showed the whole range: keep doing so
    else win = shiftIntoRange(win, r);
    lastRange = r; schedule();
  }
  const zoomBy = (factor, frac = 0.5) => { if (win) setWindow(zoomWindow(win, getRange2(), factor, frac)); };
  const fit = () => { const r = getRange2(); setWindow({ a: r.start, b: r.end }); };
  const follow = (day, dir = 0) => { if (win) setWindow(followWindow(win, getRange2(), day, dir)); };

  // ---------- pointer: ruler = scrub, lanes = pan / pick ----------
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || !win) return;
    const p = pt(e), inRuler = p.y < RULER_H;
    canvas.setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, x0: p.x, y0: p.y, a: win.a, b: win.b, moved: false, scrub: inRuler, lane: inRuler ? null : laneAtY(p.y) };
    if (inRuler) onScrub(dayAt(p.x));
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!win) return;
    const p = pt(e);
    if (drag && drag.id === e.pointerId) {
      const dx = p.x - drag.x0;
      if (Math.abs(dx) > 3 || Math.abs(p.y - drag.y0) > 3) drag.moved = true;
      if (drag.scrub) onScrub(dayAt(p.x));
      else if (drag.moved) setWindow(panWindow({ a: drag.a, b: drag.b }, getRange2(), -dx * ((drag.b - drag.a) / inner())));
      return;
    }
    const lane = laneAtY(p.y), bx = lane && barX(lane), on = lane && bx && p.x >= bx[0] - 2 && p.x <= bx[1] + 2 ? lane : null, id = on ? on.id : null;
    if (id !== hoverId) {
      hoverId = id; canvas.style.cursor = on ? 'pointer' : '';
      canvas.title = on ? `${on.f.name || on.f.id} · ${lifeSummary(on.f.life)}${on.marks.length ? ` · ${on.marks.length} border change${on.marks.length === 1 ? '' : 's'}` : ''}` : '';
      schedule();
    }
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const d = drag; drag = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* already released */ }
    if (e.type === 'pointercancel' || d.scrub || d.moved || !win) return;
    const p = pt(e), bx = d.lane && barX(d.lane);
    if (d.lane && bx && p.x >= bx[0] - 2 && p.x <= bx[1] + 2) onPickFeature(d.lane.id); else onScrub(dayAt(p.x));
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { if (hoverId !== null) { hoverId = null; canvas.style.cursor = ''; canvas.title = ''; schedule(); } });
  canvas.addEventListener('dblclick', () => fit());
  // the wheel works anywhere on the strip (ruler, slider row, lanes): zoom around the pointer, Shift = pan, over many lanes = scroll them
  host.addEventListener('wheel', (e) => {
    if (!win) return;
    e.preventDefault();
    const r = host.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (e.shiftKey) { setWindow(panWindow(win, getRange2(), (e.deltaY || e.deltaX) * ((win.b - win.a) / inner()))); return; }
    if (open && y >= LANES_Y && lanes.length > MAX_LANES) { laneTop = Math.max(0, Math.min(lanes.length - MAX_LANES, laneTop + (e.deltaY > 0 ? 1 : -1))); schedule(); return; }
    zoomBy(Math.exp(Math.max(-120, Math.min(120, e.deltaY)) * 0.0016), (x - INSET) / inner());
  }, { passive: false });

  if (typeof ResizeObserver === 'function') new ResizeObserver(() => { if (Math.round(host.clientWidth) !== W) schedule(); }).observe(host);

  return {
    get window() { return win; },
    get open() { return open; },
    xOf: (day) => (win ? xOf(day) : INSET),
    setRange, setWindow, zoomBy, fit, follow,
    setLanes(list) { lanes = list; laneTop = Math.min(laneTop, Math.max(0, lanes.length - MAX_LANES)); schedule(); },
    setOpen(on) { open = !!on; schedule(); },
    redraw: () => schedule(),
  };
}
