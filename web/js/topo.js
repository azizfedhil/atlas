// Topographic layer: the 3D globe's heightmap (web/sim/world/heightmap.png) drawn on the atlas map as elevation colours,
// shaded relief and contour lines. The heights are baked by tools/bake_topo.py into tex/topo.png (the globe's own grey -> km rule,
// 0 .. 6 km); the shader (shaders.js) colours and shades them live in every projection. This module owns the panel section,
// the loading, the legend and the hover readout. Nothing here touches the project file.
import { fetchPng } from './renderer.js';

const LS_KEY = 'cosmossi.topo';
const $ = (s) => document.querySelector(s);
export const TOPO_MAX_KM = 6;                                  // the height at full scale of tex/topo.png (TOPO_MAX_KM in tools/bake_topo.py: H_MAX_KM)
const AZIMUTH = 315 * Math.PI / 180;                           // the light comes from the north-west (clockwise from north), the way relief maps are lit
const ALTITUDE = 40 * Math.PI / 180;
const STEPS = [0.05, 0.1, 0.25, 0.5, 1];                       // contour intervals (km)
// elevation colours: [height km, r, g, b]. The shader reads exactly these 11 stops (uTopoS / uTopoC), and so does the legend.
const STOPS = [
  [0.0, 97, 153, 97], [0.05, 128, 178, 107], [0.15, 168, 199, 122], [0.4, 214, 214, 148], [0.8, 230, 204, 133], [1.4, 214, 171, 107],
  [2.2, 186, 138, 94], [3.2, 153, 115, 89], [4.4, 163, 148, 140], [5.2, 209, 204, 204], [6.0, 250, 250, 255],
];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createTopo({ renderer, requestRender, toast }) {
  const s = { on: false, tint: true, shade: true, lines: false, alpha: 0.8, relief: 15, step: 0.25 };
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    if (saved && typeof saved === 'object') {
      for (const k of ['on', 'tint', 'shade', 'lines']) if (typeof saved[k] === 'boolean') s[k] = saved[k];
      if (typeof saved.alpha === 'number') s.alpha = clamp(saved.alpha, 0.1, 1);
      if (typeof saved.relief === 'number') s.relief = clamp(Math.round(saved.relief), 1, 40);
      if (STEPS.includes(saved.step)) s.step = saved.step;
    }
  } catch (_) {}
  let loaded = false, loading = null, hdata = null;

  const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (_) {} };

  /** what the renderer needs, or null when the layer is off / not loaded / has nothing switched on */
  function view() {
    if (!s.on || !loaded) return null;
    const tint = s.tint ? s.alpha : 0, shade = s.shade ? 1 : 0, lines = s.lines ? 0.9 : 0;
    if (!tint && !shade && !lines) return null;
    return { tint, shade, lines, step: s.step, relief: s.relief, azimuth: AZIMUTH, altitude: ALTITUDE };
  }

  // ---------- loading ----------
  /** the heights again on the CPU for the hover readout: Uint16, the top 15 bits of the 16-bit height, bit 0 = land of the heightmap */
  function readBack(b) {
    const w = b.width || b.naturalWidth, h = b.height || b.naturalHeight;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(b, 0, 0);
    const d = g.getImageData(0, 0, w, h).data, n = w * h, out = new Uint16Array(n);
    for (let i = 0, j = 0; i < n; i++, j += 4) out[i] = (((d[j] << 8) | d[j + 1]) & 0xfffe) | (d[j + 2] > 127 ? 1 : 0);
    hdata = { v: out, w, h };
  }
  async function ensureLoaded() {
    if (loaded) return true;
    if (!loading) loading = (async () => {
      const bmp = await fetchPng('tex/topo.png');
      renderer.setTopo({ bitmap: bmp, maxKm: TOPO_MAX_KM, stops: STOPS });
      loaded = true;
      setTimeout(() => {                                       // the read-back (about 30 MB of pixels) waits until the first frame is out
        try { readBack(bmp); } catch (e) { console.warn('Topography hover readout unavailable:', e.message || e); }
        finally { if (bmp.close) bmp.close(); }
      }, 60);
    })();
    try { await loading; return true; }
    catch (e) { loading = null; toast('Topography could not be loaded: ' + (e.message || e), true); s.on = false; save(); sync(); return false; }
  }

  // ---------- hover readout ----------
  /** a short text for the status bar: the height under the cursor, '' when the layer is off or the point is open water */
  function readout(lonDeg, latDeg) {
    if (!s.on || !hdata) return '';
    const { v, w, h } = hdata;
    const x = Math.floor((((((lonDeg + 180) / 360) % 1) + 1) % 1) * w), y = Math.min(h - 1, Math.max(0, Math.floor((90 - latDeg) / 180 * h)));
    let i = y * w + x;
    if (!(v[i] & 1)) {                                         // sea in the heightmap: the atlas coast can be a pixel or two off, so look next door
      i = -1;
      for (let r = 1; r <= 2 && i < 0; r++) for (let dy = -r; dy <= r && i < 0; dy++) for (let dx = -r; dx <= r; dx++) {
        const yy = y + dy; if (yy < 0 || yy >= h) continue;
        const k = yy * w + ((x + dx + w) % w); if (v[k] & 1) { i = k; break; }
      }
      if (i < 0) return '';
    }
    const m = (v[i] & 0xfffe) / 65535 * TOPO_MAX_KM * 1000;
    return `elev. ${Math.round(m / 5) * 5} m`;
  }

  // ---------- panel ----------
  const el = {};
  function renderLegend() {
    const L = el.legend; L.replaceChildren(); if (!s.on || !s.tint) return;
    const bar = document.createElement('div'); bar.className = 'clim-bar';
    bar.style.background = `linear-gradient(90deg, ${STOPS.map(([km, r, g, b]) => `rgb(${r},${g},${b}) ${(km / TOPO_MAX_KM * 100).toFixed(1)}%`).join(',')})`;
    const t = document.createElement('div'); t.className = 'clim-ticks';
    for (const l of ['0', '1500', '3000', '4500', '6000 m']) { const i = document.createElement('i'); i.textContent = l; t.appendChild(i); }
    L.append(bar, t);
  }
  function sync() {
    el.on.checked = s.on; el.body.hidden = !s.on;
    el.tint.checked = s.tint; el.shade.checked = s.shade; el.lines.checked = s.lines;
    el.alphaRow.hidden = !s.tint; el.reliefRow.hidden = !s.shade; el.stepRow.hidden = !s.lines;
    el.alpha.value = String(Math.round(s.alpha * 100)); el.alphaVal.textContent = Math.round(s.alpha * 100) + '%';
    el.relief.value = String(s.relief); el.reliefVal.textContent = '×' + s.relief;
    el.step.value = String(s.step);
    el.tag.textContent = s.on ? 'on' : '';
    renderLegend();
  }
  const change = () => { save(); sync(); requestRender(); };

  function wire() {
    for (const k of ['on', 'tint', 'shade', 'lines', 'alpha', 'alphaVal', 'alphaRow', 'relief', 'reliefVal', 'reliefRow', 'step', 'stepRow', 'legend', 'tag', 'body'])
      el[k] = $('#topo' + k[0].toUpperCase() + k.slice(1));
    el.on.addEventListener('change', async () => {
      s.on = el.on.checked; save(); sync();
      if (s.on && !(await ensureLoaded())) return;
      requestRender();
    });
    for (const k of ['tint', 'shade', 'lines']) el[k].addEventListener('change', () => { s[k] = el[k].checked; change(); });
    el.alpha.addEventListener('input', () => { s.alpha = clamp(+el.alpha.value / 100, 0.1, 1); el.alphaVal.textContent = el.alpha.value + '%'; save(); requestRender(); });
    el.relief.addEventListener('input', () => { s.relief = clamp(Math.round(+el.relief.value) || 15, 1, 40); el.reliefVal.textContent = '×' + s.relief; save(); requestRender(); });
    el.step.addEventListener('change', () => { const v = +el.step.value; if (STEPS.includes(v)) { s.step = v; change(); } });
    sync();
    if (s.on) ensureLoaded().then((ok) => { if (ok) requestRender(); });
  }

  return { wire, view, readout, get active() { return s.on && loaded; } };
}
