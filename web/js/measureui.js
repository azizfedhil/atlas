// Distance + area measuring tool (Batch 6.1 / 6.2). Pure view/interaction code on top of measure.js: click to add points, the
// legs are great-circle arcs drawn on the overlay, the numbers come from measurePath(). Measurements are a working
// aid and are not saved in the .cosmap file.
import { project, unproject, DEG } from './projections.js';
import { arcPoints, compassPoint, distanceKm, measureArea, measurePath, midpoint } from './measure.js';
import { toVec, fromVec } from './spherical.js';
import { createLru } from './perf.js';

const ACCENT = '#b5541c', SNAP_PX = 11;

export function createMeasureTool({ getView, getPlanetKm, getCities, formatKm, formatArea = (k) => `${k.toFixed(2)} km²`, requestRender, onChange }) {
  const arcCache = createLru(512);                       // densified arcs do not depend on the view, so they are reused every frame
  const arc = (a, b) => arcCache.get(`${a[0]},${a[1]}|${b[0]},${b[1]}`, () => arcPoints(a, b, 0.5));
  let active = false, pts = [], hover = null, finished = false, mode = 'distance';   // mode: 'distance' (open path) | 'area' (closed polygon)

  const lat0 = (v) => (v.def.globe ? v.lat0 : 0);
  const toScreen = (v, lon, lat) => {
    const p = project(v.def, lon * DEG, lat * DEG, v.lon0, lat0(v));
    return p ? [v.w / 2 + (p[0] - v.cx) * v.scale, v.h / 2 - (p[1] - v.cy) * v.scale] : null;
  };
  const fromScreen = (v, sx, sy) => {
    const r = unproject(v.def, v.cx + (sx - v.w / 2) / v.scale, v.cy - (sy - v.h / 2) / v.scale, v.lon0, lat0(v));
    return r ? [r[0] / DEG, r[1] / DEG] : null;
  };
  /** screen position -> lon/lat, snapping to a visible city when one is within a few pixels */
  function pointAt(sx, sy) {
    const v = getView(); let best = null, bd = SNAP_PX;
    for (const c of getCities()) {
      const s = toScreen(v, c.lon, c.lat); if (!s) continue;
      const d = Math.hypot(s[0] - sx, s[1] - sy); if (d < bd) { bd = d; best = [c.lon, c.lat]; }
    }
    return best || fromScreen(v, sx, sy);
  }

  /** everything the readout needs; includes the live (rubber-band) leg while a path is being drawn */
  function info() {
    const live = !finished && hover && pts.length ? [...pts, hover] : pts;
    const R = getPlanetKm(), base = { active, mode, points: pts.slice(), finished, hasLive: live.length > pts.length };
    if (mode !== 'area') return { ...base, ...measurePath(live, R) };
    // area mode: the legs are the edges of the closed ring (the closing edge appears once there are 3+ points)
    const ring = live.length >= 3 ? [...live, live[0]] : live;
    return { ...base, ...measurePath(ring, R), area: measureArea(live, R) };
  }
  const changed = () => { if (onChange) onChange(info()); requestRender(); };

  const api = {
    get active() { return active; },
    get points() { return pts; },
    get mode() { return mode; },
    setMode(m) { if ((m !== 'distance' && m !== 'area') || m === mode) return; mode = m; hover = null; finished = false; changed(); },
    info,
    setActive(on) {
      if (on === active) return;
      active = on; hover = null; if (!on) { pts = []; finished = false; }
      changed();
    },
    clear() { pts = []; hover = null; finished = false; changed(); },
    removeLast() { if (pts.length) { pts.pop(); finished = false; changed(); } },
    refresh: changed,
    click(sx, sy) {
      if (!active) return false;
      const p = pointAt(sx, sy); if (!p) return true;
      if (finished) { pts = []; finished = false; }
      const last = pts[pts.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
      hover = null; changed(); return true;
    },
    move(sx, sy) {
      if (!active || finished || !pts.length) return false;
      hover = pointAt(sx, sy); changed(); return true;
    },
    finish() { if (active && pts.length) { finished = true; hover = null; changed(); } },
    dblclick() { if (!active) return false; this.finish(); return true; },
    /** Esc clears the path (a second Esc leaves the tool), Enter finishes, Backspace removes a point. */
    keydown(e) {
      if (!active) return false;
      if (e.key === 'Escape') { if (pts.length) api.clear(); else api.setActive(false); return true; }
      if (e.key === 'Enter') { api.finish(); return true; }
      if (e.key === 'Backspace' || e.key === 'Delete') { api.removeLast(); return true; }
      return false;
    },
    /** plain-text summary for the clipboard */
    summaryText() {
      const m = info(); if (!m.legs.length) return '';
      const n = m.points.length, rows = m.legs.map((g, i) => `${i + 1}→${(i + 1) % (m.mode === 'area' ? n : Infinity) + 1}: ${formatKm(g.km)} (${(g.km).toFixed(2)} km), bearing ${g.initialBearing.toFixed(1)}° ${compassPoint(g.initialBearing)}`);
      if (m.mode === 'area') {
        if (n < 3) return '';
        return [`Area: ${formatArea(m.area.areaKm2)} (${m.area.areaKm2.toFixed(2)} km²), perimeter ${formatKm(m.area.perimeterKm)} (${m.area.perimeterKm.toFixed(2)} km), ${n} points, planet radius ${getPlanetKm()} km${m.area.selfIntersecting ? ' (edges cross: area not meaningful)' : ''}`, ...rows].join('\n');
      }
      return [`Total: ${formatKm(m.totalKm)} (${m.totalKm.toFixed(2)} km), planet radius ${getPlanetKm()} km`, ...rows].join('\n');
    },

    draw(ctx, v) {
      if (!active || !pts.length) return;
      const live = !finished && hover ? [...pts, hover] : pts;
      const jump = 0.5 * Math.max(v.def.xmax, v.def.ymax), sx = (p) => v.w / 2 + (p[0] - v.cx) * v.scale, sy = (p) => v.h / 2 - (p[1] - v.cy) * v.scale;
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const areaInfo = mode === 'area' && live.length >= 3 ? measureArea(live, getPlanetKm()) : null;   // once per frame
      const isArea = !!areaInfo, edges = isArea ? live.length : live.length - 1;   // area: the ring closes
      const vtx = (i) => live[i % live.length];
      if (isArea) {                                                   // translucent fill, only when the whole ring is visible and unbroken
        const fill = new Path2D(); let ok = true, last = null;
        for (let i = 0; i < edges && ok; i++) for (const q of arc(vtx(i), vtx(i + 1))) {
          const p = project(v.def, q[0] * DEG, q[1] * DEG, v.lon0, lat0(v));
          if (!p || (last && Math.hypot(p[0] - last[0], p[1] - last[1]) > jump)) { ok = false; break; }
          if (last) fill.lineTo(sx(p), sy(p)); else fill.moveTo(sx(p), sy(p));
          last = p;
        }
        if (ok) { fill.closePath(); ctx.fillStyle = 'rgba(181,84,28,.16)'; ctx.fill(fill); }
      }
      // arcs: densified, projected, broken where the globe hides them or the map seam is crossed
      for (let k = 0; k < edges; k++) {
        const i = k + 1, a0 = vtx(k), a1 = vtx(k + 1);
        const isLive = !finished && hover && (isArea ? (k === live.length - 2 || k === live.length - 1) : i === live.length - 1);
        const path = new Path2D(); let started = false, last = null;
        for (const q of arc(a0, a1)) {
          const p = project(v.def, q[0] * DEG, q[1] * DEG, v.lon0, lat0(v));
          if (!p) { started = false; last = null; continue; }
          if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) > jump) started = false;
          if (started) path.lineTo(sx(p), sy(p)); else { path.moveTo(sx(p), sy(p)); started = true; }
          last = p;
        }
        ctx.setLineDash(isLive ? [6, 5] : []);
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 5; ctx.stroke(path);
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.2; ctx.stroke(path);
      }
      ctx.setLineDash([]);
      // leg labels (only when the leg is long enough on screen to hold one)
      ctx.font = '600 11.5px Archivo, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const label = (s, text) => {
        const w = ctx.measureText(text).width + 12;
        ctx.fillStyle = 'rgba(250,245,232,.95)'; ctx.strokeStyle = ACCENT; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(s[0] - w / 2, s[1] - 10, w, 20, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6b2f0d'; ctx.fillText(text, s[0], s[1] + 0.5);
      };
      for (let k = 0; k < edges; k++) {
        const e0 = vtx(k), e1 = vtx(k + 1);
        const a = toScreen(v, ...e0), b = toScreen(v, ...e1); if (!a || !b || Math.hypot(a[0] - b[0], a[1] - b[1]) < 90) continue;
        const m = midpoint(e0, e1), s = toScreen(v, m[0], m[1]); if (!s) continue;
        label(s, formatKm(distanceKm(e0, e1, getPlanetKm())));
      }
      if (isArea && !areaInfo.selfIntersecting) {          // area label at the (spherical) centre of the ring
        const c = fromVec(live.reduce((r, p) => { const t = toVec(p[0], p[1]); return [r[0] + t[0], r[1] + t[1], r[2] + t[2]]; }, [0, 0, 0])), s = toScreen(v, c[0] / DEG, c[1] / DEG);
        if (s) { ctx.font = '700 12.5px Archivo, system-ui, sans-serif'; label(s, formatArea(areaInfo.areaKm2)); }
      }
      // vertices with numbers
      ctx.font = '600 10.5px Archivo, system-ui, sans-serif';
      pts.forEach((p, i) => {
        const s = toScreen(v, p[0], p[1]); if (!s) return;
        ctx.beginPath(); ctx.arc(s[0], s[1], 7, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = ACCENT; ctx.fillText(String(i + 1), s[0], s[1] + 0.5);
      });
      ctx.restore();
    },
  };
  return api;
}
