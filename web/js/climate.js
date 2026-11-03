// Climate layer: the World Orogen climate (tilt 25.2 deg, your heightmap, Alduran hand-set) drawn on the atlas map.
// The numbers are baked by tools/bake_climate.py into tex/clim.png, tex/clim_static.png, tex/biome_final.png and data/climate.json;
// the shader (shaders.js) colours them live in every projection. This module owns the panel section, the month logic,
// the legend and the hover readout. Nothing here touches the project file.
import { fetchPng } from './renderer.js';
import { dayNumberToDate, yearsElapsed, monthLength, yearLength, MONTHS } from './calendar.js';

const LS_KEY = 'cosmossi.climate';
const MODES = { off: 0, temp: 1, rain: 2, koppen: 3, biomes: 4 };
const GW = 1024, GH = 512;                                     // baked grid
const TILES = 12;                                              // the baked sheet holds 12 equal slices of the year (tile 12 = annual) ...
const NM = MONTHS.length;                                      // ... but the Cosmossi year has 15 months (calendar.js); the slider steps through those
const RAIN_PER_MONTH = TILES / NM;                             // a baked slice is mm per 1/12 year; a Cosmossi month is 1/15 of one
const STATE_VERSION = 2;                                       // v1 stored month 0..11 (12 = whole year) in the old 12-slice scale
const $ = (s) => document.querySelector(s);
const TEMP_STOPS = [[-40, '#4d2680'], [-25, '#334db3'], [-10, '#5999e6'], [0, '#d1ede9'], [10, '#adE08c'], [20, '#fae666'], [30, '#f59a33'], [40, '#d94026'], [55, '#730d14']];
const RAIN_STOPS = ['#f5eed1', '#d9e099', '#73bf8c', '#3399b3', '#2659b3', '#1a1f73'];

export function createClimate({ renderer, store, requestRender, toast }) {
  const s = { layer: 'off', month: 0, follow: false, alpha: 0.85, anchor: 1 };
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    if (saved && typeof saved.month === 'number' && saved.v !== STATE_VERSION)            // old 12-month setting -> the Cosmossi month holding the same time of year
      saved.month = saved.month >= TILES ? NM : Math.min(NM - 1, Math.floor((saved.month + 0.5) * NM / TILES));
    Object.assign(s, saved);
  } catch (_) {}
  if (!(s.layer in MODES)) s.layer = 'off';
  let meta = null, data = null, loading = null;

  const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify({ ...s, v: STATE_VERSION })); } catch (_) {} };
  const subs = new Set(), notify = () => { for (const f of subs) { try { f(); } catch (_) {} } };   // the 3D globe follows layer / month changes

  // ---------- the calendar: which climate month is it? ----------
  /** 0 = northern winter solstice .. 1 (one year later). Day `anchor` of the year is the solstice (1 = 1 Cuanede). */
  function yearFraction(day) {
    const d = dayNumberToDate(day), ye = yearsElapsed(d.era, d.year);
    let doy = d.day - 1; for (let m = 1; m < d.month; m++) doy += monthLength(ye, m);
    const len = yearLength(ye), f = (doy - (s.anchor - 1)) / len;
    return ((f % 1) + 1) % 1;
  }
  /** position on the 12-slice baked sheet (0..12, fractional) of the middle of Cosmossi month i (0-based). Slice m is centred at (m + 0.5) / 12 of the year after the solstice. */
  function monthTilePos(i) {
    let start = 0; for (let k = 0; k < i; k++) start += MONTHS[k].days;
    const frac = ((((start + MONTHS[i].days / 2) - (s.anchor - 1)) / 365) % 1 + 1) % 1;
    const x = frac * TILES - 0.5;
    return ((x % TILES) + TILES) % TILES;
  }
  /** month position fed to the shader: 0..12 on the baked sheet, fractional (blends two slices) */
  function monthPos() {
    if (s.follow) {
      try { const x = yearFraction(store.timeline.current) * TILES - 0.5; return ((x % TILES) + TILES) % TILES; } catch (_) { return 0; }
    }
    return s.month >= NM ? 0 : monthTilePos(s.month);
  }
  const annual = () => !s.follow && s.month >= NM;

  /** what the renderer needs, or null when the layer is off / not loaded */
  function view() {
    if (s.layer === 'off' || !data) return null;
    return { mode: MODES[s.layer], month: monthPos(), annual: annual(), alpha: s.alpha, rainMax: annual() ? 4000 : 400 / RAIN_PER_MONTH };
  }

  // ---------- loading ----------
  async function ensureLoaded() {
    if (data) return true;
    if (!loading) loading = (async () => {
      const m = await (await fetch('data/climate.json')).json();
      const [sheet, stat, biome] = await Promise.all([fetchPng('tex/clim.png'), fetchPng('tex/clim_static.png'), fetchPng('tex/biome_final.png')]);
      const px = (b) => { const c = document.createElement('canvas'); c.width = b.width; c.height = b.height; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(b, 0, 0); return g.getImageData(0, 0, b.width, b.height).data; };
      const kop = new Array(31 * 3).fill(0);
      for (const k of m.koppen) { kop[k.id * 3] = k.color[0] / 255; kop[k.id * 3 + 1] = k.color[1] / 255; kop[k.id * 3 + 2] = k.color[2] / 255; }
      data = { sheet: px(sheet), stat: px(stat) };               // read back for the hover readout
      meta = m;
      renderer.setClimate({ sheet, stat, biome, kop });
      for (const b of [sheet, stat, biome]) if (b.close) b.close();
    })();
    try { await loading; return true; }
    catch (e) { loading = null; toast('Climate data could not be loaded: ' + (e.message || e), true); s.layer = 'off'; sync(); return false; }
  }

  // ---------- hover readout ----------
  const seasonAt = (m, peak = 6) => 0.5 + 0.5 * Math.cos(2 * Math.PI * (m - peak) / TILES);   // 0 winter .. 1 summer, 1 at month `peak` (6 = July); the same curve tools/alduran_blend.py bakes for Alduran
  const lerp = (a, b, t) => a + (b - a) * t;
  /** how much of the hand-set Alduran climate this baked cell has (0..1), from tile 13 of the climate sheet */
  function aldWeight(c) {
    const tile = meta.alduranWeightTile; if (!tile) return 1;
    return data.sheet[(((tile >> 2) * GH + c.y) * 4 * GW + (tile & 3) * GW + c.x) * 4] / 255;
  }
  /** the Alduran day / night text for season `sn` (0 winter .. 1 summer), from the typical ranges in alduran_profile.json */
  function aldText(c, sn, whole) {
    const A = meta.alduran, wgt = aldWeight(c);
    if (wgt < 0.02) return '';
    if (wgt < 0.98) return `Alduran fringe · ${Math.round(wgt * 100)}% of the desert heat`;
    const span = (k) => {
      const w = A['winter_' + k + '_range_c'], su = A['summer_' + k + '_range_c'];
      const r = w && su ? [lerp(w[0], su[0], sn), lerp(w[1], su[1], sn)] : [lerp(A['winter_' + k + '_' + (k === 'day' ? 'high' : 'low') + '_c'], A['summer_' + k + '_' + (k === 'day' ? 'high' : 'low') + '_c'], sn)];
      const a = Math.round(r[0]), b = Math.round(r[r.length - 1]); return a === b ? `${a}` : `${a}–${b}`;
    };
    return `Alduran ${whole ? 'summer ' : ''}day ${span('day')} °C, night ${span('night')} °C`;
  }
  function cell(lonDeg, latDeg) {
    const x = Math.floor((((((lonDeg + 180) / 360) % 1) + 1) % 1) * GW), y = Math.min(GH - 1, Math.max(0, Math.floor((90 - latDeg) / 180 * GH)));
    const at = (xx, yy) => (Math.min(GH - 1, Math.max(0, yy)) * GW + ((xx + GW) % GW)) * 4;
    let i = at(x, y);
    if (data.stat[i + 2] === 0) {                                                  // sea in the baked grid: the atlas coast can be a cell off, so look next door
      let j = -1; for (let dy = -1; dy <= 1 && j < 0; dy++) for (let dx = -1; dx <= 1; dx++) { const k = at(x + dx, y + dy); if (data.stat[k + 2] > 0) { j = k; break; } }
      if (j < 0) return null; i = j;
    }
    return { x: (i / 4) % GW, y: Math.floor(i / 4 / GW), i };
  }
  function tileAt(c, tile) {
    const idx = (((tile >> 2) * GH + c.y) * 4 * GW + (tile & 3) * GW + c.x) * 4, d = data.sheet;
    return [-80 + d[idx] / 255 * 140, 6400 * (d[idx + 1] / 255) ** 2];
  }
  /** a short text for the status bar: values at the point under the cursor, '' when the layer is off or the point is open water */
  function readout(lonDeg, latDeg) {
    if (s.layer === 'off' || !data) return '';
    const c = cell(lonDeg, latDeg); if (!c) return '';
    const st = data.stat, kop = meta.koppen.find((k) => k.id === st[c.i]), painted = meta.painted[st[c.i + 1] - 1];
    const out = [];
    const ald = painted && painted.id === 'hyper_arid';
    if (s.layer === 'temp' || s.layer === 'rain') {
      if (annual()) {
        let t = 0, p = 0; for (let m = 0; m < TILES; m++) { const v = tileAt(c, m); t += v[0]; p += v[1]; }
        out.push(`${(t / TILES).toFixed(1)} °C mean`, `${Math.round(p / 5) * 5} mm/yr`);
        if (ald) { const t = aldText(c, 1, true); if (t) out.push(t); }
      } else {
        const x = monthPos(), m0 = Math.floor(x), f = x - m0, a = tileAt(c, m0 % TILES), b = tileAt(c, (m0 + 1) % TILES);
        out.push(`${(a[0] + (b[0] - a[0]) * f).toFixed(1)} °C`, `${Math.round((a[1] + (b[1] - a[1]) * f) * RAIN_PER_MONTH / 5) * 5} mm`);
        if (ald) { const t = aldText(c, seasonAt(x, meta.alduran.hottest_month_index ?? 6), false); if (t) out.push(t); }
      }
    }
    if (kop) out.push(`Köppen ${kop.code}`);
    if (painted && (s.layer === 'koppen' || s.layer === 'biomes' || ald)) out.push(painted.name);
    return out.join(' · ');
  }

  // ---------- panel ----------
  const el = {};
  function legendBar(stops) { const b = document.createElement('div'); b.className = 'clim-bar'; b.style.background = `linear-gradient(90deg, ${stops.join(',')})`; return b; }
  function ticks(labels) { const t = document.createElement('div'); t.className = 'clim-ticks'; for (const l of labels) { const i = document.createElement('i'); i.textContent = l; t.appendChild(i); } return t; }
  function swatches(items) {
    const w = document.createElement('div'); w.className = 'clim-sw';
    for (const it of items) {
      const r = document.createElement('div'), c = document.createElement('b'), n = document.createElement('span'), p = document.createElement('em');
      c.style.background = `rgb(${it.color.join(',')})`; n.textContent = it.label; p.textContent = it.pct >= 0.1 ? it.pct.toFixed(1) + '%' : '<0.1%';
      r.append(c, n, p); w.appendChild(r);
    }
    return w;
  }
  function renderLegend() {
    const L = el.legend; L.replaceChildren(); if (s.layer === 'off' || !meta) return;
    if (s.layer === 'temp') { L.append(legendBar(TEMP_STOPS.map(([t, c]) => c)), ticks(['-40', '-10', '10', '30', '55 °C'])); }
    else if (s.layer === 'rain') { L.append(legendBar(RAIN_STOPS), ticks(annual() ? ['0', '1000', '2500', '4000+ mm/yr'] : ['0', '100', '250', '400+ mm/month'])); }
    else if (s.layer === 'koppen') L.append(swatches(meta.koppen.filter((k) => k.pctLand >= 0.1).map((k) => ({ color: k.color, label: `${k.code} · ${k.name}`, pct: k.pctLand }))));
    else L.append(swatches(meta.painted.map((k) => ({ color: k.color, label: k.name, pct: k.pctLand }))));
  }
  function sync() {
    el.layer.value = s.layer;
    const monthly = s.layer === 'temp' || s.layer === 'rain';
    el.monthRow.hidden = !monthly; el.followRow.hidden = !monthly; el.anchorRow.hidden = !monthly || !s.follow;
    el.follow.checked = s.follow; el.month.disabled = s.follow; el.month.value = String(s.month);
    el.alpha.value = String(Math.round(s.alpha * 100)); el.alphaVal.textContent = Math.round(s.alpha * 100) + '%';
    el.anchor.value = String(s.anchor);
    el.tag.textContent = s.layer === 'off' ? '' : { temp: 'temperature', rain: 'rainfall', koppen: 'Köppen', biomes: 'biomes' }[s.layer];
    label(); renderLegend(); notify();
  }
  function label() {
    if (s.follow) { let t = '—'; try { const d = dayNumberToDate(store.timeline.current); t = `${MONTHS[d.month - 1].name} ${d.day}`; } catch (_) {} el.monthVal.textContent = t; el.monthLbl.textContent = 'Timeline date'; return; }
    el.monthLbl.textContent = 'Month';
    el.monthVal.textContent = s.month >= NM ? 'Whole year' : `${MONTHS[s.month].name} · ${s.month + 1} of ${NM}`;
  }
  async function setLayer(v) {
    s.layer = v; save(); sync();
    if (v !== 'off') { if (await ensureLoaded()) { sync(); } }
    requestRender();
  }

  function wire() {
    for (const k of ['layer', 'month', 'monthVal', 'monthLbl', 'monthRow', 'follow', 'followRow', 'anchor', 'anchorRow', 'alpha', 'alphaVal', 'legend', 'tag'])
      el[k] = $('#clim' + k[0].toUpperCase() + k.slice(1));
    el.month.max = String(NM); el.month.setAttribute('aria-label', `Month of the year (${NM} = whole year)`);
    el.layer.addEventListener('change', () => setLayer(el.layer.value));
    el.month.addEventListener('input', () => { s.month = +el.month.value; save(); label(); renderLegend(); requestRender(); notify(); });
    el.follow.addEventListener('change', () => { s.follow = el.follow.checked; save(); sync(); requestRender(); });
    el.anchor.addEventListener('change', () => { s.anchor = Math.min(366, Math.max(1, Math.round(+el.anchor.value) || 1)); save(); sync(); requestRender(); });
    el.alpha.addEventListener('input', () => { s.alpha = +el.alpha.value / 100; el.alphaVal.textContent = el.alpha.value + '%'; save(); requestRender(); });
    let climTimer = 0;                                         // while the slider moves (or plays) the followed layer refreshes at most every 60 ms
    store.on((type) => {
      if (!s.follow || !(s.layer === 'temp' || s.layer === 'rain')) return;
      if (type === 'day') { if (!climTimer) climTimer = setTimeout(() => { climTimer = 0; label(); requestRender(); notify(); }, 60); return; }
      if (type === 'timeline' || type === 'change') { label(); requestRender(); notify(); }
    });
    sync();
    if (s.layer !== 'off') ensureLoaded().then((ok) => { if (ok) { sync(); requestRender(); } });
  }

  /** what the 3D globe should show: its layer id and season ('year' | 'jan' | 'jul'), from the layer and month chosen here */
  const GLOBE_LAYER = { off: '', temp: 'temperature', rain: 'precip', koppen: 'koppen', biomes: 'biome' };
  function globeState() {
    const season = annual() ? 'year' : seasonAt(monthPos()) > 0.5 ? 'jul' : 'jan';
    return { layer: GLOBE_LAYER[s.layer] ?? '', season, active: s.layer !== 'off' };
  }
  return { wire, view, readout, globeState, onChange(fn) { subs.add(fn); return () => subs.delete(fn); }, get active() { return s.layer !== 'off'; } };
}
