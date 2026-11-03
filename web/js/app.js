import { PROJECTIONS, byId, project, unproject, orientationFor, fitScale, DEG, PI, HALF_PI } from './projections.js';
import { createRenderer, fetchPng } from './renderer.js';
import { createLandEdit, LAND_ID } from './landedit.js';
import { createBiomeEdit } from './biomeedit.js';
import { BIOME_ID } from './biomes.js';
import { hasContent, newMapPlan } from './newmap.js';
import { createOverlay } from './overlay.js';
import { plog } from './perflog.js';
import { loadVectors } from './vectors.js';
import { createStore, checkProject } from './store.js';
import { createEditor } from './editor.js';
import { ringAreaKm2, ringPerimeterKm } from './spherical.js';
import { createDrive } from './drive.js';
import { isAlive, lifeProblem, lifeStatus, codeToDay, dayToCode, lifeSummary } from './timeline.js';
import { createTimelineUI } from './timelineui.js';
import { createBotBar } from './botbar.js';
import { createClimate } from './climate.js';
import { createTopo } from './topo.js';
import { createGlobe3d } from './globe3d.js';
import { LENGTH_UNITS, unitByKey, kmPerUnit, haversine, niceStep, formatLength } from './geo.js';
import { createMeasureTool } from './measureui.js';
import { frameCoalesce, setHtml, setText } from './perf.js';
import { createCamera } from './camera.js';
import { decodeImageFile } from './renderer.js';
import { aspectWarning, opacityFromPercent, DEFAULT_OPACITY } from './refimage.js';
import { compassPoint } from './measure.js';
import { createCountryList } from './countrylist.js';
import { createCountryInfo } from './countryinfo.js';
import { createShimmer } from './shimmer.js';
import { createPlaces, sortCities } from './places.js';
import { parsePop } from './countrystats.js';
import { createRanking } from './ranking.js';
import { THEMES, themeById, applyThemeUi } from './themes.js';
import { ROAD_TIERS, TIER_BY_ID, roadColor, encodeRoads, decodeRoads } from './roads.js';
import { EXPORT_SCALES, clampScale, outputSize, safeName } from './exportmap.js';

const $ = (s) => document.querySelector(s);
const glCanvas = $('#gl'), ovCanvas = $('#ov');

const state = {
  proj: 'equal-earth',
  lon0: 0, lat0: 0,                 // central meridian / centre latitude (rad)
  cx: 0, cy: 0, scale: 1,           // view centre (projected units) and zoom (css px per unit)
  layers: { biomes: true, rivers: true, ripples: true, coast: true, countries: true, cities: true, other: true },
  roads: { on: true, all: false, tiers: {} },                        // Roads panel: master switch, every tier at every zoom, per-tier switches (a missing tier = on)
  planetKm: 6371, unit: 'Mre',
  graticule: 30, frame: true, theme: 'atlas', pole: 0,              // pole: polar cap latitude in degrees, 0 = off (the default: the map shows its real poles)

};
let globe = null, soloIds = null, dockPx = 0, coastN = 0;          // globe: the docked 3D globe (globe3d.js); soloIds: while the selection texture is painted only these features show; dockPx: width the docked globe takes from the right
let editorCoast = null, vectors = null, editor = null, tlui = null, measure = null, clist = null, info = null, ranking = null, places = null;
/** a length in km, written in the unit chosen under "Planet & units" (Cosmossi notation for fictional units) */
const fmtKm = (km) => formatLength(km / kmPerUnit(state.unit), state.unit);
/** area in the chosen unit squared, e.g. "1,234 mi²"; keeps 3 significant digits for small values */
const fmtArea = (km2) => { const u = kmPerUnit(state.unit), a = km2 / (u * u); return `${a >= 100 ? Math.round(a).toLocaleString('en') : a.toLocaleString('en', { maximumSignificantDigits: 3 })} ${state.unit}²`; };
/** Timeline filter: a feature is shown when the filter is off or it exists on the slider's current day. */
const isVisible = (f) => { if (f.id === LAND_ID || f.id === BIOME_ID) return false; const g = f; if (soloIds && !soloIds.has(f.id)) return false; return store.paused || !store.timeline.filterByLife || isAlive(g.life, store.timeline.current); };
const store = createStore();
let projectName = 'Cosmossi';
/** Runs fn at once, then at most once every `ms`; a trailing call is kept so the last state is always drawn. */
const throttled = (fn, ms) => { let last = 0, timer = 0; return () => { const wait = last + ms - performance.now(); if (wait <= 0) { last = performance.now(); fn(); } else if (!timer) timer = setTimeout(() => { timer = 0; last = performance.now(); fn(); }, wait); }; };
/** While the slider moves (or plays), the lists and numbers that depend on which features exist are refreshed at most every 120 ms. */
const refreshOnDay = throttled(() => { renderFeatureList(); updateStats(); }, 120);
let renderer, overlay, fx = null, climate = null, topo = null, W = 0, H = 0, dpr = 1, queued = false;
// the view is moving (a drag, or the camera's zoom ease / fling): the editor draws a cheaper version of expensive layers until it rests (Batch 9).
// It rests when the camera rests, so one gesture is one change of resolution (it used to flip back and forth on every pause in a drag).
let interacting = false, panning = false;
// `interacting` is held for a short while after the view stops moving. A mouse wheel / trackpad delivers zoom in bursts and the camera
// briefly rests between them; without the hold every such pause ended the gesture (GL canvas re-allocated at full resolution, a full-res
// shader frame, the crisp-repaint timer started) and the next wheel event undid it all a few ms later.
const INTERACT_HOLD_MS = 250;
let holdUntil = 0, holdTimer = 0;
$('#hint').addEventListener('click', () => { $('#hint').hidden = true; });
// the GL map is drawn at half resolution while the view moves (the fragment shader inverts the projection per pixel, so cost follows pixel count); full resolution returns when it rests
let glDpr = 0;
const GL_MIN_DPR = 0.25;
// moving resolution adapts: it starts at full resolution (no blur, no canvas re-allocation per gesture), shrinks (down to 0.3x) after a drag / zoom that ran slowly and recovers (up to 1x) after smooth ones
let glMove = 1, moveGaps = [];
const adaptGlMove = () => {
  if (moveGaps.length > 4) { const g = moveGaps.slice(2), avg = g.reduce((s, x) => s + x, 0) / g.length; if (avg > 28) glMove = Math.max(0.3, glMove * Math.max(0.5, Math.min(0.9, Math.sqrt(16.7 / avg)))); else if (avg < 17) glMove = Math.min(1, glMove * 1.25); }
  moveGaps = [];
};
// F3 readout: CPU ms of the last frame by section + the real interval between frames (a long interval with small CPU ms means the GPU / compositor is the bottleneck)
const perf = { on: false, last: 0, gaps: [], gl: 0, ov: 0, gpu: 0, cpu: [] };
const def = () => byId(state.proj);
const poleRad = () => (state.pole ? state.pole * DEG : 4);      // 4 rad = beyond any latitude: no cap
// the map is framed in the space not covered by the side panel
const inset = () => ($('#panel').classList.contains('collapsed') ? 56 : 322);
const fit = () => fitScale(def(), W - inset(), H, 0.92);
// the smooth camera owns every move of the view (zoom ease, fling); anything that sets the view directly calls camera.stop() first
// zoom range relative to the fitted world: out to 0.6x, in to 256x (was 28x). Past ~40x only the vector layers (borders, coast, rivers, names) gain detail: the land texture is 3087 px for 360 degrees and is just magnified.
const ZOOM_MIN_REL = 0.6, ZOOM_MAX_REL = 256;
const camera = createCamera({ view: state, limits: () => [fit() * ZOOM_MIN_REL, fit() * ZOOM_MAX_REL], globe: {
  active: () => !!def().globe,
  // the geographic point under a screen position (null when it is off the globe)
  pick: (sx, sy, w, h) => { const d = def(); return d.globe ? unproject(d, state.cx + (sx - w / 2) / state.scale, state.cy - (sy - h / 2) / state.scale, state.lon0, state.lat0) : null; },
  // the orientation that puts g under a screen position; a position just outside the globe is pulled onto its edge, so a drag that leaves the globe keeps rotating it
  place: (g, sx, sy, w, h, latHint) => {
    const d = def(); let x = state.cx + (sx - w / 2) / state.scale, y = state.cy - (sy - h / 2) / state.scale;
    const r = Math.hypot(x, y), lim = d.xmax * 0.9995; if (r > lim) { x *= lim / r; y *= lim / r; }
    return orientationFor(d, g, x, y, latHint);
  },
} });

// ---------- rendering ----------
let seenLon = state.lon0, seenLat = state.lat0;
function render(o = {}) {
  queued = false;
  if (!renderer) return;
  const live = !o.dpr && !o.exporting;                                        // an on-screen frame (not an export)
  if (live && (state.lon0 !== seenLon || state.lat0 !== seenLat)) { seenLon = state.lon0; seenLat = state.lat0; saveSettingsSoon(); }   // dragged / turned: remember the orientation
  if (live && camera.step(W, H, def().globe) && def().globe) syncSliders();    // advance the zoom ease / fling
  const wasInteracting = interacting;
  const moving = live && (panning || camera.active());
  if (live) {
    const tNow = performance.now();
    if (moving) holdUntil = tNow + INTERACT_HOLD_MS;
    interacting = moving || tNow < holdUntil;
    if (interacting && !moving && !holdTimer) holdTimer = setTimeout(() => { holdTimer = 0; requestRender(); }, Math.max(1, holdUntil - tNow) + 4);   // no frames are coming: wake up once to end the gesture
  }
  if (wasInteracting && !interacting) adaptGlMove();                           // the gesture is over: judge its smoothness, once
  const d = def(), D = o.dpr || dpr;
  const L = state.layers, vec = !!vectors;      // vector coast/rivers replace the raster ink when loaded
  const p0 = performance.now(), gap = perf.last ? p0 - perf.last : 0; perf.last = p0;
  if (gap > 0 && gap < 500) { perf.gaps.push(gap); if (perf.gaps.length > 30) perf.gaps.shift(); }
  if (moving && !o.dpr && gap > 0 && gap < 500) moveGaps.push(gap);              // only frames of real movement: the idle hold would read as a slow gesture
  const gD = o.dpr ? D : (interacting ? Math.max(GL_MIN_DPR, dpr * glMove) : dpr);
  if (!o.dpr && gD !== glDpr) { const tr = performance.now(); renderer.resize(W, H, gD); if (plog.on) plog.ev('gl-resize', { from: glDpr, to: gD, ms: performance.now() - tr }); glDpr = gD; }
  if (plog.on && live && wasInteracting !== interacting) plog.ev(interacting ? 'gesture-start' : 'gesture-end', { zoom: +(state.scale / fit()).toFixed(2), glMove: +glMove.toFixed(2) });
  const drew = renderer.draw({ cx: state.cx, cy: state.cy, scale: state.scale, dpr: gD, glId: d.glId,
    lon0: state.lon0, lat0: d.globe ? state.lat0 : 0, refAlpha: ref.show ? ref.opacity : 0,
    pole: poleRad(), theme: themeById(state.theme), climate: climate && climate.view(), topo: topo && topo.view(), fast: interacting && !o.dpr && glMove < 1, layers: { biomes: L.biomes, ripples: L.ripples, rivers: L.rivers && !vec, ink: !vec } });
  const p1 = performance.now();
  overlay.draw({ def: d, cx: state.cx, cy: state.cy, scale: state.scale, lon0: state.lon0, interacting: interacting && !o.exporting,
    lat0: state.lat0, w: W, h: H, graticuleStep: state.graticule, frame: state.frame, ver: contentVer, theme: themeById(state.theme), pole: poleRad(),
    showCoast: L.coast, showRivers: L.rivers, zoomRel: state.scale / fit(), exporting: !!o.exporting, zooming: live && camera.zooming(), target: live ? camera.targetView(W, H) : null });
  perf.gl = p1 - p0; perf.ov = performance.now() - p1;
  if (live && fx) fx.frame(interacting);                                       // the shimmer follows the view as it is now (and starts / stops its own loop)
  if (plog.on && live) plog.frame({ gap, gl: perf.gl, ov: perf.ov, cpu: perf.gl + perf.ov, i: interacting ? 1 : 0, p: panning ? 1 : 0, c: camera.active() ? 1 : 0, gD: +gD.toFixed(2), drew, br: overlay.info.branch, hv: overlay.info.ms });
  perf.cpu.push(perf.gl + perf.ov); if (perf.cpu.length > 60) perf.cpu.shift();   // recent frames: the readout shows the worst, since averages hide spikes
  if (perf.on) { const g0 = performance.now(); renderer.sync(); perf.gpu = performance.now() - g0; showPerf(); }   // F3 only: wait for the GPU, so its time shows here
  updateScaleBar();
  if (live && globe) globe.viewTick();                                         // the docked globe follows the view
  if (live && camera.active()) requestRender();                               // keep frames coming until the ease / fling is done
}
// ---------- F4: performance recorder (see perflog.js) ----------
function perfMeta() {
  const d = def(), L = state.layers, fs = store ? store.features : [];
  return { app: 'cosmossi-atlas', proj: d.id, globe: !!d.globe, window: W + 'x' + H, dpr: window.devicePixelRatio, canvasDpr: +dpr.toFixed(2), glMove: +glMove.toFixed(2), zoomRel: +(state.scale / fit()).toFixed(2),
    layers: Object.keys(L).filter((k) => L[k]).join(','), theme: state.theme, features: fs.length, countries: fs.filter((f) => f.kind === 'country').length, subdivisions: fs.filter((f) => f.kind === 'subdivision').length,
    gl: (() => { try { const g = renderer.gl, x = g.getExtension('WEBGL_debug_renderer_info'); return x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : 'n/a'; } catch (e) { return 'n/a'; } })(), ua: navigator.userAgent.replace(/^Mozilla\/5.0 /, '') };
}
function perfBadge(on) {
  let b = document.getElementById('perfRec');
  if (!b) { b = document.createElement('div'); b.id = 'perfRec'; b.style.cssText = 'position:fixed;top:10px;right:70px;z-index:9999;background:#c0392b;color:#fff;font:600 12px system-ui;padding:4px 10px;border-radius:12px;pointer-events:none'; b.textContent = '● REC  (F4 to stop)'; document.body.appendChild(b); }
  b.hidden = !on;
}
function showPerfReport(text) {
  let box = document.getElementById('perfReport'); if (box) box.remove();
  box = document.createElement('div'); box.id = 'perfReport';
  box.style.cssText = 'position:fixed;inset:5% 8%;z-index:10000;background:#1f2933;color:#e4e7eb;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;box-shadow:0 10px 40px rgba(0,0,0,.5)';
  const ta = document.createElement('textarea'); ta.readOnly = true; ta.value = text; ta.style.cssText = 'flex:1;width:100%;box-sizing:border-box;background:#111827;color:#e4e7eb;border:0;border-radius:6px;font:12px/1.35 Consolas,monospace;padding:8px;resize:none';
  const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:8px;align-items:center';
  const mk = (t, fn) => { const b = document.createElement('button'); b.textContent = t; b.style.cssText = 'padding:6px 14px;border-radius:6px;border:0;background:#3b82f6;color:#fff;font:600 13px system-ui;cursor:pointer'; b.addEventListener('click', fn); return b; };
  const msg = document.createElement('span'); msg.style.cssText = 'font:12px system-ui;opacity:.8';
  bar.append(mk('Copy to clipboard', async () => { try { await navigator.clipboard.writeText(text); msg.textContent = 'Copied.'; } catch (e) { ta.select(); msg.textContent = 'Clipboard blocked: text selected, press Ctrl+C.'; } }), mk('Close', () => box.remove()), msg);
  box.append(ta, bar); document.body.appendChild(box); ta.focus(); ta.select();
}
function togglePerfLog() {
  if (!plog.on) {
    plog.state = () => ({ i: interacting ? 1 : 0 }); plog.onChange = perfBadge; plog.start();
    toast('Recording performance. Use the app normally (drag, zoom, hover, edit), then press F4 again to stop and get the report.');
  } else { plog.stop(); showPerfReport(plog.report(perfMeta())); }
}
function showPerf() {
  const el = $('#perfHud'), t = editor ? editor.timings : null, g = perf.gaps, avg = g.length ? g.reduce((a, b) => a + b, 0) / g.length : 0;
  setText(el, `frame every ${avg.toFixed(1)} ms (${avg ? Math.round(1000 / avg) : 0} fps) · cpu: gl ${perf.gl.toFixed(1)} + 2d ${perf.ov.toFixed(1)} ms · gpu ${perf.gpu.toFixed(1)} ms · worst of last 60 frames ${Math.max(0, ...perf.cpu).toFixed(1)} ms cpu` +
    (t ? ` (areas ${t.polys.toFixed(1)} · ranges ${t.ranges.toFixed(1)} · names ${t.names.toFixed(1)} · rest ${t.rest.toFixed(1)})` : ''));
}
const requestRender = () => { if (!queued) { queued = true; requestAnimationFrame(() => render()); } };
// anything drawn on the overlay changed other than the view itself (features, selection, tool state, measuring ...): the overlay's pan snapshot is stale
let contentVer = 0;
const touchContent = () => { contentVer++; requestRender(); if (globe) globe.contentChanged(); };

function resize() {
  W = Math.max(320, window.innerWidth - dockPx); H = window.innerHeight;
  dpr = renderer.resize(W, H); glDpr = dpr;
  glCanvas.style.width = W + 'px'; glCanvas.style.height = H + 'px';
  overlay.resize(W, H, dpr);
  if (fx) fx.resize(W, H, dpr);
  requestRender();
}

function resetView() {
  camera.stop();
  state.scale = fit();
  state.cx = -inset() / (2 * state.scale); state.cy = 0;
  requestRender();
}

/** Flies the view to a feature: an area (with its separate parts) is framed in the part of the screen the side panel leaves free, a city or label gets a close-up. */
/** "Show on map": fly there and make the border shimmer. Nothing is selected for editing (no points, no inspector): the info card opens instead and owns the shimmer. */
function showOnMap(f) {
  if (!f || !editor) return;
  if (f.kind !== 'country' && f.kind !== 'subdivision') { locate(f); return; }
  if (editor.tool !== 'pan') editor.setTool('pan');                          // leaves the edit selection (setTool closes the info card; it is reopened right below)
  if (info) info.show(f);
  editor.spotlight(f.id);
  locate(f);
}
function locate(f) {
  if (!f || !renderer || !editor) return;
  const d = def(), wrap = (x) => ((x + 540) % 360 + 360) % 360 - 180, pts = [];
  if (f.kind === 'city' || f.kind === 'label') pts.push([f.lon, f.lat]);
  else if (f.rings) { for (const r of editor.shape(f)) for (const p of r) if (p) pts.push(p); }
  if (!pts.length) return;
  let lo0 = Infinity, lo1 = -Infinity, la0 = Infinity, la1 = -Infinity; const ref = pts[0][0];
  for (const p of pts) { const u = ref + wrap(p[0] - ref); lo0 = Math.min(lo0, u); lo1 = Math.max(lo1, u); la0 = Math.min(la0, p[1]); la1 = Math.max(la1, p[1]); }
  const cLon = wrap((lo0 + lo1) / 2), cLat = (la0 + la1) / 2, f0 = fit();
  const lon0 = d.globe ? cLon * DEG : state.lon0, lat0 = d.globe ? cLat * DEG : 0;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;                  // the area's box, projected (sampled: the box edges bend in most projections)
  for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
    const p = project(d, wrap(lo0 + (lo1 - lo0) * i / 6) * DEG, (la0 + (la1 - la0) * j / 6) * DEG, lon0, lat0);
    if (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  }
  const have = x1 >= x0, single = pts.length === 1 || !have || (x1 - x0 < 1e-9 && y1 - y0 < 1e-9);
  let scale = single ? f0 * 8 : Math.min((W - inset() - 120) / Math.max(x1 - x0, 1e-9), (H - 220) / Math.max(y1 - y0, 1e-9));
  scale = Math.max(f0, Math.min(f0 * 20, scale));
  const px = have ? (x0 + x1) / 2 : 0, py = have ? (y0 + y1) / 2 : 0;
  camera.flyTo(d.globe ? { cx: -inset() / (2 * scale), cy: 0, scale, lon0, lat0 } : { cx: px - inset() / (2 * scale), cy: py, scale });
  requestRender();
}

// ---------- projection UI ----------
function buildProjectionList() {
  const ul = $('#projList');
  ul.innerHTML = '';
  for (const p of PROJECTIONS) {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `<span class="pname">${p.name}</span><span class="ptag">${p.tag}</span>`;
    li.addEventListener('click', () => setProjection(p.id));
    ul.appendChild(li);
  }
}

const memo = { lonWorld: 0, lonGlobe: 75 * DEG };   // remember orientation per family
export function setProjection(id) {
  const wasGlobe = def().globe;
  state.proj = id;
  const d = def();
  if (d.globe !== wasGlobe) {
    if (d.globe) { memo.lonWorld = state.lon0; state.lon0 = memo.lonGlobe; }
    else { memo.lonGlobe = state.lon0; state.lon0 = memo.lonWorld; }
  }
  if (d.globe && Math.abs(state.lat0) < 1e-9) state.lat0 = 20 * DEG;
  if (!d.globe) state.lat0 = 0;
  $('#lonSlider').value = Math.round(state.lon0 / DEG); $('#lonVal').textContent = Math.round(state.lon0 / DEG) + '°';
  for (const li of document.querySelectorAll('#projList li')) li.classList.toggle('active', li.dataset.id === id);
  $('#lonLabel').textContent = d.globe ? 'Centre longitude' : 'Central meridian';
  $('#latRow').hidden = !d.globe;
  $('#latSlider').value = Math.round(state.lat0 / DEG);
  $('#latVal').textContent = Math.round(state.lat0 / DEG) + '°';
  $('#hudProj').textContent = d.name; $('#projCur').textContent = d.name;
  $('#hudTag').textContent = d.tag;
  saveSettings(); resetView();
}

// ---------- reference image (session only: not saved in the .cosmap file) ----------
const ref = { show: true, opacity: opacityFromPercent(DEFAULT_OPACITY), name: '' };
function syncReferenceUi() {
  const has = !!renderer.referenceSize;
  $('#refShow').disabled = !has; $('#refOpacity').disabled = !has; $('#refClear').disabled = !has;
  $('#refShow').checked = ref.show; $('#refOpacity').value = Math.round(ref.opacity * 100); $('#refOpVal').textContent = Math.round(ref.opacity * 100) + '%';
  $('#refName').textContent = has ? `${ref.name} (${renderer.referenceSize[0]}×${renderer.referenceSize[1]})` : 'None. Use an equirectangular world map (2:1).';
}
async function loadReference(file) {
  try {
    const bmp = await decodeImageFile(file);
    const warn = aspectWarning(bmp.width || bmp.naturalWidth, bmp.height || bmp.naturalHeight);
    renderer.setReference(bmp); ref.name = file.name; ref.show = true;
    syncReferenceUi(); requestRender();
    toast(warn || `Reference image loaded: ${file.name}`, !!warn);
  } catch (e) { toast(String(e.message || e), true); }
}
function wireReference() {
  $('#refLoad').addEventListener('click', () => $('#refIn').click());
  $('#refIn').addEventListener('change', async (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) await loadReference(f); });
  $('#refClear').addEventListener('click', () => { renderer.setReference(null); syncReferenceUi(); requestRender(); });
  $('#refShow').addEventListener('change', (e) => { ref.show = e.target.checked; requestRender(); });
  { let saved = 100; try { saved = +localStorage.getItem('cosmossi.fillOpacity') || 100; } catch (e) { /* storage unavailable */ }
    const apply = (v) => { $('#fillOpacity').value = v; $('#fillOpVal').textContent = v + '%'; if (editor) editor.setFillOpacity(v / 100); };
    $('#fillOpacity').addEventListener('input', (e) => { apply(+e.target.value); try { localStorage.setItem('cosmossi.fillOpacity', e.target.value); } catch (er) { /* ignore */ } });
    apply(saved); }
  $('#refOpacity').addEventListener('input', (e) => { ref.opacity = opacityFromPercent(e.target.value); $('#refOpVal').textContent = Math.round(ref.opacity * 100) + '%'; requestRender(); });
  syncReferenceUi();
}

// ---------- roads: tier picker (Road tool), Roads panel, list ----------
const ROAD_LIST_MAX = 100;
let roadFindText = '';
const roadSw = (t, extra = '') => `<i class="road-sw${t.dash ? ' dash' : ''}" data-sw="${t.id}" style="--h:${Math.max(2, Math.round(t.w))}px${extra}"></i>`;
/** colours, switches and the picked tier follow state / theme */
function syncRoadUi() {
  if (!editor) return;
  $('#tRoads').checked = state.roads.on; $('#tRoadAll').checked = state.roads.all;
  for (const cb of document.querySelectorAll('#roadTierToggles [data-roadtier]')) cb.checked = state.roads.tiers[cb.dataset.roadtier] !== false;
  for (const sw of document.querySelectorAll('.road-sw[data-sw]')) sw.style.setProperty('--c', roadColor(sw.dataset.sw, state.theme));
  for (const b of document.querySelectorAll('#roadTiers [data-tier]')) b.setAttribute('aria-pressed', String(b.dataset.tier === editor.roadTier));
  updateRoadOpts();
}
/** the floating tier picker, shown while the Road tool is on */
function updateRoadOpts() {
  const box = $('#roadOpts'); if (!box || !editor) return;
  box.hidden = editor.tool !== 'road' || !!(measure && measure.active);
  if (box.hidden) return;
  const t = TIER_BY_ID.get(editor.roadTier);
  setText($('#roadNote'), `${t.label}: drawn from zoom \\u00d7${t.minZ || 1}${state.roads.all ? ' (every tier is shown at every zoom)' : ''}. Keys 1-5 pick the tier.`);
}
/** a road drawn while its tier is switched off would be invisible: the Road tool switches the layer and the tier on */
function roadToolOn() {
  if (!editor) return;
  const id = editor.roadTier;
  if (!state.roads.on || state.roads.tiers[id] === false) { state.roads.on = true; state.roads.tiers[id] = true; editor.setRoads(state.roads); saveSettings(); }
  syncRoadUi();
}
function setRoadTier(id) {
  if (!editor || !TIER_BY_ID.has(id)) return;
  editor.setRoadTier(id); roadToolOn();
}
/** the Roads section's list: at most ROAD_LIST_MAX rows, built only while the section is open (a map can hold thousands of roads) */
function renderRoadList() {
  const sec = $('#secRoads'); if (!sec || !store || !editor) return;
  const roads = store.features.filter((f) => f.kind === 'road');
  setText($('#roadCount'), roads.length ? String(roads.length) : '');
  if (sec.classList.contains('closed')) return;
  const q = roadFindText.trim().toLowerCase(), rank = new Map(ROAD_TIERS.map((t, i) => [t.id, i]));
  const hits = (q ? roads.filter((f) => (f.name || '').toLowerCase().includes(q)) : roads)
    .sort((a, b) => (rank.get(a.tier) - rank.get(b.tier)) || ((a.name || '') < (b.name || '') ? -1 : 1));
  const row = (f) => { const t = TIER_BY_ID.get(f.tier) || ROAD_TIERS[3]; return `<li data-id="${esc(f.id)}" class="${f.id === editor.selectedId ? 'active' : ''}${isVisible(f) ? '' : ' off'}" title="${esc(lifeSummary(f.life))}">${roadSw(t, ';--c:' + roadColor(t.id, state.theme))}<span>${esc(f.name)}</span><em>${esc(t.label)}</em></li>`; };
  let html = hits.slice(0, ROAD_LIST_MAX).map(row).join('');
  if (hits.length > ROAD_LIST_MAX) html += `<li class="empty">+${hits.length - ROAD_LIST_MAX} more: type in the box to narrow the list</li>`;
  if (!hits.length) html = `<li class="empty">${roads.length ? 'No road matches.' : 'No roads yet. Pick the Road tool (O) and click along its course.'}</li>`;
  setHtml($('#roadList'), html);
}
function wireRoads() {
  const chips = $('#roadTiers'), togg = $('#roadTierToggles');
  chips.innerHTML = ROAD_TIERS.map((t) => `<button type="button" data-tier="${t.id}" aria-pressed="false" title="${esc(t.label)} (${t.key})">${roadSw(t)}<span>${esc(t.label)}</span><kbd>${t.key}</kbd></button>`).join('');
  togg.innerHTML = ROAD_TIERS.map((t) => `<label class="toggle"><input type="checkbox" data-roadtier="${t.id}" checked><span></span>${esc(t.plural)}${roadSw(t)}</label>`).join('');
  chips.addEventListener('click', (e) => { const b = e.target.closest('[data-tier]'); if (b) setRoadTier(b.dataset.tier); });
  const push = () => { editor.setRoads(state.roads); saveSettings(); const s = editor.selectedId && store.find(editor.selectedId); if (s && !editor.isShown(s)) editor.select(null); syncRoadUi(); };
  $('#tRoads').addEventListener('change', (e) => { state.roads.on = e.target.checked; push(); });
  $('#tRoadAll').addEventListener('change', (e) => { state.roads.all = e.target.checked; push(); });
  togg.addEventListener('change', (e) => { const cb = e.target.closest('[data-roadtier]'); if (!cb) return; state.roads.tiers[cb.dataset.roadtier] = cb.checked; push(); });
  $('#roadFind').addEventListener('input', (e) => { roadFindText = e.target.value; renderRoadList(); });
  $('#roadList').addEventListener('click', (e) => { const li = e.target.closest('li[data-id]'); const f = li && store.find(li.dataset.id); if (!f) return; editor.setTool('select'); editor.select(f.id); locate(f); });
  $('#secRoads h2').addEventListener('click', () => setTimeout(renderRoadList, 0));       // opening the section builds the list
  editor.setRoads(state.roads); syncRoadUi(); renderRoadList();
}

function wireControls() {
  const lon = $('#lonSlider'), lat = $('#latSlider');
  lon.addEventListener('input', () => { camera.stop(); state.lon0 = +lon.value * DEG; $('#lonVal').textContent = lon.value + '°'; saveSettingsSoon(); requestRender(); });
  lat.addEventListener('input', () => { camera.stop(); state.lat0 = +lat.value * DEG; $('#latVal').textContent = lat.value + '°'; saveSettingsSoon(); requestRender(); });
  for (const [id, key] of [['#tBiomes', 'biomes'], ['#tRivers', 'rivers'], ['#tRipples', 'ripples'], ['#tCoast', 'coast']])
    $(id).addEventListener('change', (e) => { state.layers[key] = e.target.checked; saveSettings(); requestRender(); });
  // countries, cities and the rest (labels, mountain ranges, user rivers) switch separately; hidden kinds can't be picked either
  for (const [id, key] of [['#tCountries', 'countries'], ['#tCities', 'cities'], ['#tOther', 'other']])
    $(id).addEventListener('change', (e) => { state.layers[key] = e.target.checked; saveSettings(); editor.setLayers({ [key]: e.target.checked }); const s = editor.selectedId && store.find(editor.selectedId); if (s && !editor.isShown(s)) editor.select(null); });
  $('#tFrame').addEventListener('change', (e) => { state.frame = e.target.checked; saveSettings(); requestRender(); });
  for (const b of document.querySelectorAll('#gratSeg button'))
    b.addEventListener('click', () => {
      state.graticule = +b.dataset.v;
      for (const o of document.querySelectorAll('#gratSeg button')) o.classList.toggle('on', o === b);
      saveSettings(); requestRender();
    });
  // the settings of the last session: show them in the controls (and hand the editor its layer flags)
  for (const [id, key] of [['#tBiomes', 'biomes'], ['#tRivers', 'rivers'], ['#tRipples', 'ripples'], ['#tCoast', 'coast'], ['#tCountries', 'countries'], ['#tCities', 'cities'], ['#tOther', 'other']]) $(id).checked = !!state.layers[key];
  $('#tFrame').checked = state.frame;
  for (const o of document.querySelectorAll('#gratSeg button')) o.classList.toggle('on', +o.dataset.v === state.graticule);
  editor.setLayers({ countries: state.layers.countries, cities: state.layers.cities, other: state.layers.other });
  wireRoads();
  $('#resetCtr').addEventListener('click', () => {
    camera.stop();
    state.lon0 = def().globe ? 75 * DEG : 0; state.lat0 = def().globe ? 20 * DEG : 0;
    lon.value = Math.round(state.lon0 / DEG); $('#lonVal').textContent = lon.value + '°'; lat.value = Math.round(state.lat0 / DEG); $('#latVal').textContent = lat.value + '°';
    saveSettings(); resetView();
  });
  const rad = $('#radius'), unitSel = $('#unitSel');
  for (const u of LENGTH_UNITS.filter((u) => ['Cro', 'Mre', 'km', 'mi'].includes(u.key)))
    unitSel.insertAdjacentHTML('beforeend', `<option value="${u.key}">${u.label} (${u.key})</option>`);
  rad.value = state.planetKm; unitSel.value = state.unit;
  const poleSel = $('#poleSel'); poleSel.value = String(state.pole);
  poleSel.addEventListener('change', () => { state.pole = +poleSel.value; saveSettings(); touchContent(); });
  const themeSel = $('#themeSel');
  for (const t of Object.values(THEMES)) themeSel.insertAdjacentHTML('beforeend', `<option value="${t.id}">${t.name}</option>`);
  themeSel.value = state.theme; applyThemeUi(state.theme);
  themeSel.addEventListener('change', () => { state.theme = themeSel.value; applyThemeUi(state.theme); saveSettings(); touchContent(); syncRoadUi(); });
  rad.addEventListener('input', () => { const v = parseFloat(rad.value); if (v > 0) { state.planetKm = v; saveSettings(); touchContent(); measure && measure.refresh(); } });
  unitSel.addEventListener('change', () => { state.unit = unitSel.value; saveSettings(); touchContent(); measure && measure.refresh(); });
  $('#panelToggle').addEventListener('click', () => { $('#panel').classList.toggle('collapsed'); resetView(); });
  $('#zIn').addEventListener('click', () => zoomAt(W / 2, H / 2, 1.5));
  $('#zOut').addEventListener('click', () => zoomAt(W / 2, H / 2, 1 / 1.5));
  $('#zFit').addEventListener('click', resetView);
}

// ---------- interaction ----------
const toProj = (sx, sy) => [state.cx + (sx - W / 2) / state.scale, state.cy - (sy - H / 2) / state.scale];

/** Zooms by `factor` around the screen point (sx, sy), eased by the camera (the point under the cursor stays put). */
function zoomAt(sx, sy, factor) {
  camera.zoomAt(sx, sy, factor, W, H);
  requestRender();
}

let spaceDown = false;                                            // Space held with the brush: drags move the map instead of painting
function wireInteraction() {
  let drag = null, editing = false;
  ovCanvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    camera.stop();                                                // a touch stops a fling / zoom ease, as on Google Maps
    ovCanvas.setPointerCapture(e.pointerId);
    editing = biome.active ? biome.down(e) : land.active ? land.down(e.clientX, e.clientY, e.shiftKey) : !measure.active && !spaceDown && editor.pointerDown(e.clientX, e.clientY, e.altKey, e.shiftKey, e.ctrlKey || e.metaKey);          // grabbed a vertex / city / label?
    drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: 0 };
    if (!editing) { ovCanvas.classList.add('grabbing'); camera.track(e.clientX, e.clientY, e.timeStamp); camera.grab(e.clientX, e.clientY, W, H); }   // release speed: positions as the browser reports them; a globe remembers the point it grabbed
  });
  // pointer moves are coalesced to one per animation frame (high-rate mice fire several per frame); only the last position matters
  const handleMove = frameCoalesce((cx, cy, alt, ev) => {
    updateReadout(cx, cy);
    if (measure.active) measure.move(cx, cy);
    if (land.active) land.move(cx, cy);
    if (biome.active) biome.move(ev);
    if (!drag || editing) { if (!measure.active && !land.active && !biome.active) editor.pointerMove(cx, cy, alt); return; }
    drag.moved = Math.max(drag.moved, Math.hypot(cx - drag.x0, cy - drag.y0));
    if (drag.moved < 4) return;                                   // below this it is still a click
    const dx = cx - drag.x, dy = cy - drag.y;
    drag.x = cx; drag.y = cy; panning = true;
    if (!(def().globe && camera.dragGlobe(cx, cy, W, H))) camera.panBy(dx, dy, def().globe);   // flat: 1:1 with the pointer; a globe keeps the grabbed point under the cursor
    if (def().globe) syncSliders();
    requestRender();
  });
  ovCanvas.addEventListener('pointermove', (e) => {
    if (drag && !editing) camera.track(e.clientX, e.clientY, e.timeStamp);     // every pointer event of a pan, not just the frame's last one
    handleMove(e.clientX, e.clientY, e.altKey, e);
  });
  const end = (e, cancelled) => {
    handleMove.flush();                                           // apply the last pending move before the click / drag ends
    if (editing) { if (biome.active) biome.up(); else if (land.active) land.up(); else editor.pointerUp(); editing = false; }
    else if (drag && drag.moved < 4 && !cancelled && !land.active && !biome.active) { if (!measure.click(e.clientX, e.clientY)) editor.click(e.clientX, e.clientY, e); }
    if (panning) { if (cancelled) camera.stop(); else camera.release(); panning = false; }   // a fast drag flings, as on Google Maps
    drag = null; ovCanvas.classList.remove('grabbing');
    requestRender();
  };
  ovCanvas.addEventListener('pointerup', (e) => end(e, false));
  ovCanvas.addEventListener('pointercancel', (e) => end(e, true));
  ovCanvas.addEventListener('pointerleave', () => { handleMove.cancel(); $('#hudCoord').textContent = '—'; editor.leave(); land.leave(); biome.leave(); });
  ovCanvas.addEventListener('wheel', (e) => {
    e.preventDefault(); editor.cancelStroke();                             // a stroke in progress would no longer match the zoomed view
    camera.wheel(e, W, H);                                                 // normalised delta, eased zoom around the cursor
    requestRender();
  }, { passive: false });
  ovCanvas.addEventListener('dblclick', (e) => { if (measure.active) { measure.dblclick(); return; } if (!editor.dblclick(e.clientX, e.clientY)) zoomAt(e.clientX, e.clientY, 2); });
  window.addEventListener('resize', frameCoalesce(resize));      // one resize per frame while the window is dragged
}

function syncSliders() {
  $('#lonSlider').value = Math.round(state.lon0 / DEG); $('#lonVal').textContent = Math.round(state.lon0 / DEG) + '°';
  $('#latSlider').value = Math.round(state.lat0 / DEG); $('#latVal').textContent = Math.round(state.lat0 / DEG) + '°';
}

function updateReadout(sx, sy) {
  const [x, y] = toProj(sx, sy);
  const d = def(), r = unproject(d, x, y, state.lon0, d.globe ? state.lat0 : 0);
  if (!r) { setText(hudCoord, '—'); return; }
  const lo = r[0] / DEG, la = r[1] / DEG;
  const cl = [topo ? topo.readout(lo, la) : '', climate ? climate.readout(lo, la) : ''].filter(Boolean).join(' · ');
  setText(hudCoord, `${Math.abs(lo).toFixed(2)}°${lo < 0 ? 'W' : 'E'}   ${Math.abs(la).toFixed(2)}°${la < 0 ? 'S' : 'N'}${cl ? '   ·   ' + cl : ''}`);
}

// ---------- settings + scale bar ----------
function saveSettings() {
  try {
    localStorage.setItem('cosmossi.settings', JSON.stringify({
      planetKm: state.planetKm, unit: state.unit, theme: state.theme, pole: state.pole, poleV: 2,
      proj: state.proj, lon0: state.lon0 / DEG, lat0: state.lat0 / DEG, memo: { lonWorld: memo.lonWorld / DEG, lonGlobe: memo.lonGlobe / DEG },
      graticule: state.graticule, frame: state.frame, layers: { ...state.layers }, roads: state.roads,
    }));
  } catch (_) {}
}
/** orientation changes constantly while the map is dragged: write it a moment after it stops */
let saveTimer = 0;
const saveSettingsSoon = () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveSettings, 400); };
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('cosmossi.settings') || '{}');
    const num = (v) => typeof v === 'number' && isFinite(v);
    if (s.planetKm > 0) state.planetKm = s.planetKm;
    if (s.unit && unitByKey(s.unit)) state.unit = s.unit;
    if (s.theme && THEMES[s.theme]) state.theme = s.theme;
    if (s.poleV === 2 && [0, 70, 75, 80, 84].includes(s.pole)) state.pole = s.pole;   // a cap saved before the default became Off is not carried over
    if (s.proj && byId(s.proj)) state.proj = s.proj;
    if (num(s.lon0) && Math.abs(s.lon0) <= 180) state.lon0 = s.lon0 * DEG;
    if (num(s.lat0) && Math.abs(s.lat0) <= 90) state.lat0 = s.lat0 * DEG;
    if (s.memo && num(s.memo.lonWorld)) memo.lonWorld = s.memo.lonWorld * DEG;
    if (s.memo && num(s.memo.lonGlobe)) memo.lonGlobe = s.memo.lonGlobe * DEG;
    if ([0, 10, 15, 30].includes(s.graticule)) state.graticule = s.graticule;
    if (typeof s.frame === 'boolean') state.frame = s.frame;
    if (s.layers && typeof s.layers === 'object') for (const k of Object.keys(state.layers)) if (typeof s.layers[k] === 'boolean') state.layers[k] = s.layers[k];
    if (s.roads && typeof s.roads === 'object') {
      if (typeof s.roads.on === 'boolean') state.roads.on = s.roads.on;
      if (typeof s.roads.all === 'boolean') state.roads.all = s.roads.all;
      if (s.roads.tiers && typeof s.roads.tiers === 'object') for (const t of ROAD_TIERS) if (typeof s.roads.tiers[t.id] === 'boolean') state.roads.tiers[t.id] = s.roads.tiers[t.id];
    }
  } catch (_) {}
}
/** Scale at the middle of the visible map, measured east-west along the screen (varies across most projections). */
function updateScaleBar() {
  const box = sbBox, d = def(), half = 70;
  const sx = inset() + (W - inset()) / 2, sy = H / 2;
  const pa = toProj(sx - half, sy), pb = toProj(sx + half, sy);
  const la = unproject(d, pa[0], pa[1], state.lon0, d.globe ? state.lat0 : 0);
  const lb = unproject(d, pb[0], pb[1], state.lon0, d.globe ? state.lat0 : 0);
  const ang = la && lb ? haversine(la[0], la[1], lb[0], lb[1]) : 0;
  if (!(ang > 0)) { box.hidden = true; return; }
  const perPx = (ang * state.planetKm) / kmPerUnit(state.unit) / (2 * half);   // unit per screen px
  const nice = niceStep(perPx * 130), px = nice / perPx;
  const lat = (la[1] + lb[1]) / 2 / DEG;
  const wpx = px.toFixed(1) + 'px';
  if (box.hidden) box.hidden = false;
  if (sbCache.w !== wpx) { sbCache.w = wpx; sbBar.style.width = wpx; }
  setText(sbLabel, `${nice.toLocaleString('en')} ${state.unit}  ·  at ${Math.abs(lat).toFixed(0)}°${lat < 0 ? 'S' : 'N'}`);
}
const sbCache = { w: '' }, sbBox = $('#scalebar'), sbBar = $('#sbBar'), sbLabel = $('#sbLabel'), hudCoord = $('#hudCoord');

// ---------- editor UI: toolbar, inspector, feature list, files ----------
const toastEl = () => $('#toast');
let toastTimer = 0;
function toast(msg, bad = false) {
  const t = toastEl(); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.className = ''; }, bad ? 6000 : 2600);
}
const KIND_TITLE = { country: 'Country', subdivision: 'Subdivision', range: 'Mountain range', river: 'River', road: 'Road', city: 'City', label: 'Text label' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Math.round(n).toLocaleString('en');

function statsHtml(f) {
  const R = state.planetKm, kmU = kmPerUnit(state.unit), shape = editor.shape(f), closed = f.kind !== 'river' && f.kind !== 'road';
  const ringKm = (rings, c) => rings.reduce((s, r) => s + ringPerimeterKm(r, R, c), 0);
  const per = ringKm(shape, closed) + (f.kind === 'country' ? editor.enclavesOf(f).reduce((s, e) => s + ringKm(editor.shape(e), true), 0) : 0);
  const pts = f.rings.reduce((s, r) => s + r.length, 0);
  if (f.kind === 'river' || f.kind === 'road') return `<div class="stat"><span>Length</span><b>${fmt(per)} km · ${fmt(per / kmU)} ${state.unit}</b></div><div class="stat"><span>Points</span><b>${pts}</b></div>`;
  const A = editor.areaKm2(f, R), area = A.land, sea = A.total - A.land;
  return `<div class="stat"><span>Land area</span><b>${fmt(area)} km²</b></div>
          <div class="stat"><span></span><b>${fmt(area / (kmU * kmU))} ${state.unit}²</b></div>
          ${sea > Math.max(1, A.total * 0.005) ? `<div class="stat"><span>Sea (not counted)</span><b>${fmt(sea)} km²</b></div>` : ''}
          <div class="stat"><span>Border</span><b>${fmt(per)} km · ${fmt(per / kmU)} ${state.unit}</b></div>
          ${shape.length > 1 ? `<div class="stat"><span>Separate parts</span><b>${shape.length - 1}</b></div>` : ''}
          <div class="stat"><span>Points</span><b>${pts}</b></div>`;
}
const levelNameOf = (f) => { const r = editor.root(f), d = editor.depth(f); return (r && r.levels && r.levels[d - 1]) || `Level ${d}`; };
function updateStats() {
  const f = editor && store.find(editor.selectedId), el = $('#insStats');
  if (f && (f.kind === 'country' || f.kind === 'subdivision' || f.kind === 'range' || f.kind === 'river' || f.kind === 'road') && el) el.innerHTML = statsHtml(f);
}
/** the inspector's header: colour swatch, what is selected and its name, and a close button */
/** the colour an area is drawn with: a subdivision wears its country's colour, a separate part its main area's */
const effColor = (f) => { if (f.kind === 'road') return roadColor(f.tier, state.theme); const src = f.kind === 'subdivision' ? editor.root(f) : f; return (src && src.color) || f.color || '#4a86b8'; };
function insHead(f) {
  const sw = f.kind === 'label' || f.kind === 'city' ? '' : `<s class="ins-sw" style="background:${esc(effColor(f))}"></s>`;
  return `<div class="ins-head">${sw}<div class="ins-ttl"><h3>${KIND_TITLE[f.kind]}</h3><span class="ins-name">${esc(f.name || f.text || '')}</span></div><button class="ins-x ins-loc" data-inslocate type="button" title="Show on the map" aria-label="Show on the map">⌖</button><button class="ins-x" data-insclose type="button" title="Close (Esc)" aria-label="Close">×</button></div>`;
}
const popHint = (v) => { if (v == null || String(v).trim() === '') return ''; const n = parsePop(v); return n == null ? 'Not a number: rankings skip it' : '= ' + fmt(n); };
const goLink = (g) => `<button type="button" class="ins-link" data-goto="${g.id}">${esc(g.name || (g.kind === 'country' ? 'Unnamed country' : 'Unnamed area'))}</button>`;
/** a short list of areas or cities the person can click to open, with how many more there are */
function insItems(title, list, mk, max = 8) {
  if (!list.length) return '';
  return `<div class="lvl"><h4>${title} <em>${list.length}</em></h4><div class="ins-items">${list.slice(0, max).map(mk).join('')}${list.length > max ? `<span class="ins-more">+${list.length - max} more in the Countries list</span>` : ''}</div></div>`;
}
/** keep the header in step while a name or colour is being typed (the rest of the panel is not redrawn then) */
function syncInsHead(f, box) {
  const n = box.querySelector('.ins-name'); if (n) n.textContent = f.name || f.text || '';
  const sw = box.querySelector('.ins-sw'); if (sw) sw.style.background = effColor(f);
}
function renderInspector(f, opts = {}) {
  const box = $('#inspector');
  if (!f) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  const row = (label, inner) => `<label class="irow"><span>${label}</span>${inner}</label>`;
  let h = insHead(f);
  if (f.kind === 'range') h += '<div class="ins-sec"><h4>Details</h4>' + row('Name', `<input data-k="name" type="text" value="${esc(f.name)}">`) +
    row('Colour', `<input data-k="color" type="color" value="${esc(f.color)}">`) +
    row('Intensity', `<input data-k="density" data-num="1" type="range" min="0.4" max="3" step="0.1" value="${f.density || 1}">`) +
    row('Notes', `<textarea data-k="notes" rows="3">${esc(f.notes)}</textarea>`) + '</div><div class="ins-sec"><h4>Measurements</h4>' + `<div id="insStats" class="stats">${statsHtml(f)}</div></div>`;
  if (f.kind === 'road') h += '<div class="ins-sec"><h4>Details</h4>' + row('Name', `<input data-k="name" type="text" value="${esc(f.name)}">`) +
    row('Type', `<select data-k="tier" data-edit="1">${ROAD_TIERS.map((t) => `<option value="${t.id}"${t.id === f.tier ? ' selected' : ''}>${esc(t.label)}</option>`).join('')}</select>`) +
    row('Notes', `<textarea data-k="notes" rows="3">${esc(f.notes)}</textarea>`) + '</div><div class="ins-sec"><h4>Measurements</h4>' + `<div id="insStats" class="stats">${statsHtml(f)}</div></div>`;
  if (f.kind === 'river') h += '<div class="ins-sec"><h4>Details</h4>' + row('Name', `<input data-k="name" type="text" value="${esc(f.name)}">`) +
    row('Colour', `<input data-k="color" type="color" value="${esc(f.color || '#4a86b8')}">`) +
    row('Width', `<input data-k="width" data-num="1" type="range" min="1" max="3" step="0.1" value="${f.width || 1}">`) +
    row('Notes', `<textarea data-k="notes" rows="3">${esc(f.notes)}</textarea>`) + '</div><div class="ins-sec"><h4>Measurements</h4>' + `<div id="insStats" class="stats">${statsHtml(f)}</div></div>`;
  if (f.kind === 'country' || f.kind === 'subdivision') {
    const P = places.snapshot(), fa = f.facts || {}, inside = sortCities(P.citiesIn(f)), autoCap = fa.capital ? null : P.capitalOf(f);
    h += '<div class="ins-sec"><h4>Identity</h4>' + row('Name', `<input data-k="name" type="text" value="${esc(f.name)}">`);
    if (f.kind === 'country') h += row('Colour', `<input data-k="color" type="color" value="${esc(f.color)}">`) +
      row('Political name', `<input data-political="1" type="text" maxlength="120" value="${esc(fa.politicalName)}" placeholder="e.g. Republic of …" title="Shown on the country's info card, never on the map">`);
    if (f.kind === 'subdivision') {
      const rt = editor.root(f), rl = (rt && rt.levels) || [], dp = editor.depth(f), trail = P.pathOf(f).slice(0, -1);
      h += `<div class="irow"><span>Colour</span><span class="inh">Shade of ${rt ? goLink(rt) : 'its country'}'s colour</span></div>`;
      h += row('Level', `<select data-setlevel="1" title="Move this subdivision up to a higher level: it cuts itself out of the areas above it. To draw one at a lower level, use Draw at in the Subdivision tool or Brush.">${Array.from({ length: dp }, (_, i) => `<option value="${i + 1}" ${i + 1 === dp ? 'selected' : ''}>${i + 1} · ${esc(rl[i] || 'Level ' + (i + 1))}</option>`).join('')}</select>`) +
        `<div class="irow"><span>Part of</span><span class="ins-crumbs">${trail.map(goLink).join('<i class="ic-sep">›</i>')}</span></div>`;
    }
    h += '</div><div class="ins-sec"><h4>Facts</h4>' + row('Capital', `<select data-capital="1"><option value="">${autoCap ? '(automatic: ' + esc(autoCap.name) + ')' : f.kind === 'country' ? '(automatic)' : '(none)'}</option>${inside.map((c) => `<option value="${c.id}" ${fa.capital === c.id ? 'selected' : ''}>${esc(c.name)}${c.rank === 'capital' ? ' ★' : ''}</option>`).join('')}</select>`);
    h += row('Population', `<span class="pwrap"><input data-k="facts.population" data-pophint="1" type="text" value="${esc(fa.population)}" placeholder="e.g. 3,400,000 or 1.2M"><small class="phint">${esc(popHint(fa.population))}</small></span>`);
    if (f.kind === 'country') h += row('Government', `<input data-k="facts.government" type="text" value="${esc(fa.government)}">`) + row('Language', `<input data-k="facts.language" type="text" value="${esc(fa.language)}">`);
    h += row('Notes', `<textarea data-k="notes" rows="3">${esc(f.notes)}</textarea>`) + '</div><div class="ins-sec"><h4>Measurements</h4>' + `<div id="insStats" class="stats">${statsHtml(f)}</div></div>`;
    h += insItems('Subdivisions', P.subsOf(f), (k) => `<button type="button" class="ins-item" data-goto="${k.id}"><s style="background:${esc(P.colorOf(k))}"></s><span>${esc(k.name || 'Unnamed')}</span><em>${esc(fmtArea(editor.areaKm2(k, state.planetKm).land))}</em></button>`) +
      insItems('Cities', inside, (c) => `<button type="button" class="ins-item" data-goto="${c.id}"><i>${P.roleOf(c) ? (P.roleOf(c).kind === 'national' ? '★' : '◆') : '●'}</i><span>${esc(c.name || 'Unnamed')}</span><em>${esc(c.rank)}</em></button>`);
    const root = f.kind === 'country' ? f : editor.root(f), lv = (root && root.levels) || [];
    h += `<div class="lvl"><h4>Subdivision levels${f.kind === 'subdivision' ? ' (of ' + esc(root.name) + ')' : ''}</h4>` +
      lv.map((n, i) => `<div class="lrow"><i>${i + 1}</i><input data-level="${i}" type="text" value="${esc(n)}"></div>`).join('') +
      `<button data-addlevel="1">+ Add level</button> <button data-addsub="1">+ Subdivision inside</button></div>` +
      `<div class="lvl"><h4>Border</h4><button data-op="expand" title="Draw an area that is added to this border">+ Expand</button> <button data-op="cut" title="Draw an area to remove from this border">− Cut</button> <button data-op="brush" title="Paint onto this border with the brush (Shift erases)">Brush…</button> <button data-op="merge" title="Join with another ${f.kind === 'country' ? 'country' : 'subdivision of the same parent'} - touching borders become one outline, a far island becomes a separate part">Merge with…</button>${f.kind === 'country' && !f.enclaveOf ? ' <button data-shore=\"1\" title=\"Cut the border to the coast: sea inside the outline is removed. Islands stay parts of this country\">Clip border to shores</button>' : ''}${editor.partCount(f) ? ` <button data-detach=\"1\" title=\"Make the land part you last clicked on the map its own ${f.kind === 'country' ? 'country' : 'subdivision'}\">Detach clicked part</button>` : ''}${editor.partCount(f) ? `<p class=\"hnote\">Has ${editor.partCount(f)} separate part(s) (islands), all part of this ${f.kind === 'country' ? 'country' : 'subdivision'} - click one on the map to edit its points.</p>` : ''}<p class="hnote">Or double-click an edge to add a point, and drag points to reshape.</p></div>`;
  }
  if (f.kind === 'city') {
    const chain = editor.belongsTo(f), fa = f.facts || {};
    const where = '<em>outside every country</em>';
    const lvl = chain.slice(1).map((g) => `<div class="stat"><span>${esc(levelNameOf(store.find(g.id) || g))}</span><b>${goLink(g)}</b></div>`).join('');
    const capBtns = chain.map((g) => { const a = store.find(g.id), on = !!(a && a.facts && a.facts.capital === f.id); return `<button type="button" class="${on ? 'on' : ''}" data-capof="${g.id}" aria-pressed="${on}" title="${on ? 'Stop being' : 'Make this city'} the capital of ${esc(g.name || 'this area')}">${on ? '★ ' : ''}${esc(g.name || 'Unnamed')}</button>`; }).join('');
    h += '<div class="ins-sec"><h4>City</h4>' + `<div class="lvl"><button data-relocate="1" title="Then click the new position on the map (Esc cancels). You can also drag the city.">Relocate…</button> <button data-citydel="1" class="danger" title="Delete this city (Delete key)">Delete</button></div>` +
      row('Name', `<input data-k="name" type="text" value="${esc(f.name)}">`) +
      `<div class="stats"><div class="stat"><span>Country</span><b>${chain.length ? goLink(chain[0]) : where}</b></div>${lvl}</div>` +
      (chain.length ? `<div class="lvl capof"><h4>Capital of</h4>${capBtns}<p class="hnote">A country's capital is drawn with a double ring, a region's with a diamond.</p></div>` : '') +
      row('Rank', `<select data-k="rank" data-edit="1">${['capital', 'city', 'town'].map((r) => `<option ${r === f.rank ? 'selected' : ''}>${r}</option>`).join('')}</select>`) +
      row('Population', `<span class="pwrap"><input data-k="facts.population" data-pophint="1" type="text" value="${esc(fa.population)}" placeholder="e.g. 1,200,000"><small class="phint">${esc(popHint(fa.population))}</small></span>`) +
      row('Latitude', `<input data-k="lat" data-num="1" data-pos="1" type="number" step="0.01" min="-90" max="90" value="${(+f.lat).toFixed(4)}">`) +
      row('Longitude', `<input data-k="lon" data-num="1" data-pos="1" type="number" step="0.01" min="-180" max="180" value="${(+f.lon).toFixed(4)}">`) +
      row('Notes', `<textarea data-k="notes" rows="3">${esc(f.notes)}</textarea>`) + '</div>';
  }
  if (f.kind === 'label') h += '<div class="ins-sec"><h4>Label</h4>' + row('Text', `<input data-k="text" type="text" value="${esc(f.text)}">`) +
    row('Size', `<input data-k="size" data-num="1" type="range" min="9" max="64" value="${f.size}">`) +
    row('Rotation', `<input data-k="rotation" data-num="1" type="range" min="-90" max="90" value="${f.rotation}">`) +
    row('Spacing', `<input data-k="spacing" data-num="1" type="range" min="0" max="24" value="${f.spacing}">`) + '</div>';
  if (f.kind === 'country' || f.kind === 'subdivision' || f.kind === 'range') {
    const sh = f.shapes || [{ from: null }], act = store.shapeIndex(f), tlStart = store.timeline.start;
    h += `<div class="hist"><h4>Border history</h4><p class="hnote">Borders can change over time. Each version applies from its date until the next one. Moving points edits only the version in effect on the slider day.</p>` +
      sh.map((x, i) => `<div class="hrow${i === act ? ' on' : ''}"><span>${i === act ? '●' : '○'} ${x.from == null ? 'From the beginning' : `From <input class="hdate" data-hdate="${i}" type="text" value="${dayToCode(x.from)}" title="Change the date this border version starts (DD/MM/YYY-EE)" aria-label="Start date of border version ${i + 1}">`}</span><button data-hview="${i}" title="Jump the slider to this version">View</button>${sh.length > 1 ? `<button data-hdel="${i}" title="Delete this version">✕</button>` : ''}</div>`).join('') +
      `<button data-hnew="1" class="ghost">+ New border version at slider day</button></div>`;
  }
  const lf = f.life || {};
  const lst = store.paused ? 'alive' : lifeStatus(lf, store.timeline.current);
  const chip = lst === 'alive' ? '' : `<div class="lifechip ${lst}"><span>${lst === 'notYet' ? 'Not founded yet on the slider day' : 'Already dissolved on the slider day'}</span><button type="button" data-lifego="${lst === 'notYet' ? lf.from : lf.to}">${lst === 'notYet' ? 'Go to founding' : 'Go to last day'}</button></div>`;
  h += `<div class="life"><h4>Exists (founded → dissolved) <em id="lifeSum">${esc(lifeSummary(lf))}</em></h4>${chip}` +
    row('Exists from', `<input data-life="from" type="text" value="${dayToCode(lf.from ?? null)}" placeholder="always">`) +
    row('Until', `<input data-life="to" type="text" value="${dayToCode(lf.to ?? null)}" placeholder="forever">`) +
    `<div class="lifebtns"><button data-lifenow="from" class="ghost">From slider day</button><button data-lifenow="to" class="ghost">Until slider day</button></div></div>`;
  const nSubs = f.kind === 'country' || f.kind === 'subdivision' ? editor.descendants(f.id).length : 0;
  h += `<div class="ins-danger"><button id="insDelete" class="danger">Delete ${KIND_TITLE[f.kind].toLowerCase()}${nSubs ? ` and ${nSubs} subdivision${nSubs === 1 ? '' : 's'} inside` : ''}</button></div>`;
  box.innerHTML = h;
  let began = false;
  for (const el of box.querySelectorAll('[data-k]')) {
    const k = el.dataset.k, num = !!el.dataset.num;
    const apply = () => { const v = num ? +el.value : el.value; if (k.startsWith('facts.')) (f.facts || (f.facts = {}))[k.slice(6)] = v; else f[k] = v; editor.touch(f); syncInsHead(f, box); };
    if (el.dataset.edit) el.addEventListener('change', () => store.edit(apply));           // discrete choice = one undo step
    else {
      el.addEventListener('input', () => { if (!began) { store.begin(); began = true; } store.live(apply); });
      el.addEventListener('change', () => { began = false; });
    }
  }
  const pol = box.querySelector('[data-political]');
  if (pol) {
    let polBegan = false;
    pol.addEventListener('input', () => {
      if (!polBegan) { store.begin(); polBegan = true; }                          // one undo step per typing session
      store.live(() => { const fa2 = f.facts || (f.facts = {}); if (pol.value.trim()) fa2.politicalName = pol.value; else delete fa2.politicalName; }, 'meta');
    });
    pol.addEventListener('change', () => { polBegan = false; });
  }
  for (const b of box.querySelectorAll('[data-goto]')) b.addEventListener('click', () => { editor.setTool('select'); editor.select(b.dataset.goto); });
  const insLoc = box.querySelector('[data-inslocate]'); if (insLoc) insLoc.addEventListener('click', () => locate(f));
  for (const b of box.querySelectorAll('[data-capof]')) b.addEventListener('click', () => {
    store.edit(() => { const a = store.find(b.dataset.capof); if (!a) return; a.facts = a.facts || {}; if (a.facts.capital === f.id) delete a.facts.capital; else a.facts.capital = f.id; });
    renderInspector(f);
  });
  for (const el of box.querySelectorAll('[data-pophint]')) el.addEventListener('input', () => { const t = el.parentElement.querySelector('.phint'); if (t) t.textContent = popHint(el.value); });
  for (const el of box.querySelectorAll('[data-pos]')) el.addEventListener('change', () => renderInspector(f));          // a typed position can move the city into another country
  const rlc = box.querySelector('[data-relocate]'); if (rlc) rlc.addEventListener('click', () => editor.relocate(f.id));
  const dlc = box.querySelector('[data-citydel]'); if (dlc) dlc.addEventListener('click', () => editor.deleteSelection());
  const lvRoot = f.kind === 'country' ? f : editor.root(f);
  for (const el of box.querySelectorAll('[data-level]')) el.addEventListener('change', () => store.edit(() => { lvRoot.levels[+el.dataset.level] = el.value.trim() || 'Level ' + (+el.dataset.level + 1); editor.touch(f); }));
  const addLv = box.querySelector('[data-addlevel]'); if (addLv) addLv.addEventListener('click', () => { if ((lvRoot.levels || []).length >= editor.maxLevels) { toast(`At most ${editor.maxLevels} subdivision levels.`, true); return; } store.edit(() => { (lvRoot.levels || (lvRoot.levels = [])).push('Level ' + ((lvRoot.levels.length || 0) + 1)); }); renderInspector(f); });
  const dt = box.querySelector('[data-detach]'); if (dt) dt.addEventListener('click', () => { const nf = editor.detachRing(f, editor.selectedRing); if (nf) toast('The part is now its own ' + (nf.kind === 'country' ? 'country' : 'subdivision') + ': ' + (nf.name || '')); });
  for (const b of box.querySelectorAll('[data-op]')) b.addEventListener('click', () => editor.setTool(b.dataset.op, f.id));
  const shoreBtn = box.querySelector('[data-shore]');
  if (shoreBtn) shoreBtn.addEventListener('click', () => { const r = editor.clipToShores(f); toast(r.msg, !r.ok); if (r.ok) renderInspector(store.find(f.id) || f); });
  const lvSel = box.querySelector('[data-setlevel]');
  if (lvSel) lvSel.addEventListener('change', () => { const msg = editor.changeLevel(f, +lvSel.value); if (msg) toast(msg, true); renderInspector(store.find(f.id) || f); updateToolOpts(); });
  const addSub = box.querySelector('[data-addsub]'); if (addSub) addSub.addEventListener('click', () => editor.setTool('sub', f.id));
  const capSel = box.querySelector('[data-capital]'); if (capSel) capSel.addEventListener('change', () => store.edit(() => { (f.facts || (f.facts = {})).capital = capSel.value; if (!capSel.value) delete f.facts.capital; }));
  for (const b of box.querySelectorAll('[data-hview]')) b.addEventListener('click', () => { const x = (f.shapes || [{ from: null }])[+b.dataset.hview]; store.setCurrent(x.from ?? store.timeline.start); });
  for (const b of box.querySelectorAll('[data-hdel]')) b.addEventListener('click', () => { store.removeShape(f, +b.dataset.hdel); renderInspector(f); });
  for (const el of box.querySelectorAll('[data-hdate]')) el.addEventListener('change', () => {
    try {
      const d = codeToDay(el.value);
      if (d === null) throw new RangeError('a border version needs a start date');
      if (!store.moveShape(f, +el.dataset.hdate, d)) throw new RangeError('another border version already starts on that day');
    } catch (err) { toast(String(err.message || err), true); }
    renderInspector(f);
  });
  const hn = box.querySelector('[data-hnew]'); if (hn) hn.addEventListener('click', () => { if (!store.addShape(f, store.timeline.current)) toast('There is already a border version starting on this day.', true); renderInspector(f); });
  for (const b of box.querySelectorAll('[data-lifego]')) b.addEventListener('click', () => store.setCurrent(+b.dataset.lifego));
  const setLife = (key, day) => {
    const next = { from: f.life?.from ?? null, to: f.life?.to ?? null, [key]: day };
    const problem = lifeProblem(next, KIND_TITLE[f.kind]);
    if (problem) { toast(problem, true); return false; }
    store.edit(() => { f.life = next; editor.touch(f); });
    return true;
  };
  for (const el of box.querySelectorAll('[data-life]')) el.addEventListener('change', () => {
    try { const d = codeToDay(el.value); if (setLife(el.dataset.life, d)) el.value = dayToCode(d); else el.value = dayToCode(f.life?.[el.dataset.life] ?? null); }
    catch (e) { toast(String(e.message || e), true); el.value = dayToCode(f.life?.[el.dataset.life] ?? null); }
    const sum = $('#lifeSum'); if (sum) sum.textContent = lifeSummary(f.life);
  });
  for (const b of box.querySelectorAll('[data-lifenow]')) b.addEventListener('click', () => {
    if (setLife(b.dataset.lifenow, store.timeline.current)) renderInspector(f);
  });
  $('#insDelete').addEventListener('click', () => editor.deleteSelection());
  const insX = box.querySelector('[data-insclose]'); if (insX) insX.addEventListener('click', () => editor.select(null));
  if (opts.focusName) { const n = box.querySelector('[data-k="name"],[data-k="text"]'); if (n) { n.focus(); n.select(); } }
}
let sideTimer = 0;
/** the info card and the ranking are recomputed once the edits settle (150 ms after the last change), not on every drag step */
function refreshSide() { clearTimeout(sideTimer); sideTimer = setTimeout(() => { if (info) info.refresh(); if (ranking) ranking.render(); renderRoadList(); }, 150); }
function renderFeatureList() {
  const ul = $('#featList'), all = store.features, countries = all.filter((f) => f.kind === 'country');
  const fs = all.filter((f) => f.id !== LAND_ID && f.id !== BIOME_ID && (f.kind === 'range' || f.kind === 'river' || f.kind === 'label' || (f.kind === 'city' && !countries.some((c) => editor.containsGroup(c, [f.lon, f.lat])))));
  $('#featCount').textContent = fs.length ? String(fs.length) : '';
  $('#ctryCount').textContent = countries.length ? String(countries.length) : '';
  if (clist) clist.render();
  refreshSide();
  if (!fs.length) { ul.innerHTML = '<li class="empty">Mountain ranges, labels and cities outside countries appear here.</li>'; return; }
  const icon = { country: '▱', range: '▲', river: '≈', city: '●', label: 'T' };
  ul.innerHTML = fs.map((f) => `<li data-id="${f.id}" class="${f.id === editor.selectedId ? 'active' : ''}${isVisible(f) ? '' : ' off'}" title="${esc(lifeSummary(f.life))}"><i>${icon[f.kind]}</i><span>${esc(f.name || f.text)}</span><em>${f.kind === 'city' ? f.rank : f.kind}</em></li>`).join('');
  for (const li of ul.querySelectorAll('li[data-id]')) li.addEventListener('click', () => { editor.setTool('select'); editor.select(li.dataset.id); });
}
/** every section header toggles its section; the choice is remembered. The header button folds / unfolds them all. */
function wireSections() {
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('cosmossi.sections') || '{}'); } catch (_) {}
  const secs = [...document.querySelectorAll('#panel section')].filter((sec) => sec.querySelector('h2'));
  const keyOf = (sec) => sec.id || sec.querySelector('h2').textContent.trim().split(' ')[0];
  const persist = () => { try { localStorage.setItem('cosmossi.sections', JSON.stringify(saved)); } catch (_) {} };
  const fold = $('#panelFold');
  const syncFold = () => {
    if (!fold) return;
    const anyOpen = secs.some((sec) => !sec.classList.contains('closed'));
    fold.textContent = anyOpen ? '⌃' : '⌄';
    fold.title = anyOpen ? 'Fold all sections' : 'Unfold all sections'; fold.setAttribute('aria-label', fold.title);
  };
  const reflect = (sec) => { const h = sec.querySelector('h2'); h.setAttribute('aria-expanded', String(!sec.classList.contains('closed'))); };
  for (const sec of secs) {
    const h = sec.querySelector('h2'), key = keyOf(sec);
    if (key in saved ? saved[key] : sec.dataset.closed === '1') sec.classList.add('closed');
    h.tabIndex = 0; h.setAttribute('role', 'button'); reflect(sec);
    const toggle = () => { sec.classList.toggle('closed'); saved[key] = sec.classList.contains('closed'); persist(); reflect(sec); syncFold(); };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', (e) => { if (e.target === h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); toggle(); } });
  }
  if (fold) fold.addEventListener('click', () => {
    const close = secs.some((sec) => !sec.classList.contains('closed'));
    for (const sec of secs) { sec.classList.toggle('closed', close); saved[keyOf(sec)] = close; reflect(sec); }
    persist(); syncFold();
  });
  syncFold();
}
function updateToolbar() {
  for (const b of document.querySelectorAll('#toolbar [data-tool]')) b.classList.toggle('on', b.dataset.tool === editor.tool);
  $('#tbUndo').disabled = !store.canUndo; $('#tbRedo').disabled = !store.canRedo;
  $('#tbSnap').classList.toggle('on', editor.snap);
  $('#tbClip').classList.toggle('on', editor.clip);
  ovCanvas.classList.toggle('draw', (editor.tool !== 'select' && editor.tool !== 'pan') || (measure && measure.active) || land.active || biome.active);
  $('#tbLand').classList.toggle('on', land.active);
  $('#tbBiome').classList.toggle('on', biome.active); $('#tbBiome').setAttribute('aria-pressed', String(biome.active));
  $('#tbMeasure').classList.toggle('on', !!(measure && measure.active));
  $('#tbMeasure').setAttribute('aria-pressed', String(!!(measure && measure.active)));
  updateToolOpts(); updateRoadOpts();
}
/** floating options for the brush (size, paint / erase) and for the level new subdivisions are drawn at */
function updateToolOpts() {
  if (!editor) return;
  const t = editor.tool, box = $('#toolOpts'), on = t === 'brush' || t === 'sub' || t === 'expand' || t === 'cut';
  box.hidden = !on || !!(measure && measure.active); if (box.hidden) return;
  const border = t === 'expand' || t === 'cut';
  if (border) {                                                                              // Expand / Cut: the Pen/Brush toggle, no level or size controls
    setText($('#toTitle'), t === 'expand' ? 'Expand' : 'Cut');
    $('#toDraw').hidden = false; $('#toBrush').hidden = true; $('#toNew').hidden = true; $('#toLevel').parentElement.hidden = true;
    setText($('#toNote'), t === 'expand' ? 'Pen: draw an area to add to the selected border. Brush: paint it on.' : 'Pen: draw the area to remove from the selected border. Brush: paint it away.');
    for (const b of document.querySelectorAll('#toDraw [data-d]')) b.classList.toggle('on', b.dataset.d === 'pen');
    return;
  }
  $('#toLevel').parentElement.hidden = false;
  const brush = t === 'brush', pf = store.find(editor.selectedId) || store.find(editor.parentId);
  const root = pf && (pf.kind === 'country' ? pf : pf.kind === 'subdivision' ? editor.root(pf) : null);
  setText($('#toTitle'), brush ? 'Brush' : 'Subdivision');
  setText($('#toLevelLbl'), brush ? 'New area' : 'Draw at');
  $('#toBrush').hidden = !brush;
  const tgtBorder = store.find(editor.selectedId);
  $('#toDraw').hidden = !(brush && tgtBorder && (tgtBorder.kind === 'country' || tgtBorder.kind === 'subdivision'));   // Brush on a border: offer Pen (Expand / Cut)
  for (const b of document.querySelectorAll('#toDraw [data-d]')) b.classList.toggle('on', b.dataset.d === 'brush');
  const lv = (root && root.levels) || [], names = Array.from({ length: editor.maxLevels }, (_, i) => `Level ${i + 1}` + (lv[i] && lv[i] !== `Level ${i + 1}` ? ` · ${lv[i]}` : ''));
  const first = brush ? 'Country' : 'Automatic (inside what I click)', html = [first, ...names].map((n, i) => `<option value="${i}">${esc(n)}</option>`).join('');
  const sel = $('#toLevel'); if (sel._sig !== html) { sel._sig = html; sel.innerHTML = html; }
  const pinned = !brush && editor.parentId && store.find(editor.parentId);                // "+ Subdivision" on a chosen area fixes its level
  sel.value = String(pinned ? editor.depth(pinned) + 1 : editor.level);
  const tgt = store.find(editor.selectedId), paintOn = brush && tgt && (tgt.kind === 'country' || tgt.kind === 'subdivision');
  setText($('#toNote'), brush ? (paintOn ? `Painting on ${tgt.name}. Pick another area with Ctrl+click.` : editor.level ? `Nothing selected: a stroke starts a new level ${editor.level} area (start it inside a level ${editor.level - 1 || 'country'} area).` : 'Nothing selected: a stroke starts a new country.')
    : pinned ? `Drawing inside ${pinned.name}. Change the level to pick another parent by position.` : editor.level ? `Start inside a ${editor.level === 1 ? 'country' : 'level ' + (editor.level - 1) + ' area'}.` : 'The new area goes one level below whatever you click.');
  $('#toNew').hidden = !brush || !tgt;
  const size = Math.round(editor.brushSize); if ($('#toSize').value !== String(size)) $('#toSize').value = size; setText($('#toSizeVal'), size + ' px');
  for (const b of document.querySelectorAll('#toMode [data-m]')) b.classList.toggle('on', (b.dataset.m === 'erase') === editor.brushErase);
}

function toggleMeasure() {
  const on = !measure.active;
  editor.setTool('select'); editor.select(null);               // leaves any drawing tool (this also switches measuring off)
  measure.setActive(on); updateToolbar();
  if (on) setMeasureHint();
}
// Biome painter (toolbar button and G). Its paint is drawn from the biome texture, so the Biomes layer is switched on with it.
function toggleBiome(on = !biome.active) {
  if (on && !biome.active) {
    // the other tools go first: setTool('pan') goes through onTool, which would switch the painter off again
    land.setActive(false); measure && measure.setActive(false); if (info) info.hide();
    editor.setTool('pan');
    const t = $('#tBiomes'); if (!t.checked) { t.checked = true; t.dispatchEvent(new Event('change')); }   // the layer's own handler: state and redraw stay in step
  }
  biome.setActive(on); updateToolbar();
}
function toggleHelp(on = $('#helpBox').hidden) {
  $('#helpBox').hidden = !on; $('#tbHelp').classList.toggle('on', on); $('#tbHelp').setAttribute('aria-pressed', String(on));
}
// tool hint: shows for a few seconds, click it to dismiss; a new hint (tool change) brings it back
let hintTimer = 0;
function showHint(t) {
  const el = $('#hint'); clearTimeout(hintTimer);
  if (!t) { el.hidden = true; return; }
  el.textContent = t; el.hidden = false;
  hintTimer = setTimeout(() => { el.hidden = true; }, 7000);
}
function setMeasureHint() {
  showHint(measure.mode === 'area'
    ? 'Measure area: click to add corners (cities snap) · double-click or Enter to close · Backspace removes a point · Esc clears'
    : 'Measure: click to add points (cities snap) · double-click or Enter to finish · Backspace removes a point · Esc clears');
}
function renderMeasureBox(m) {
  const box = $('#measureBox'); box.hidden = !m.active;
  updateToolbar();
  if (!m.active) { if (editor.tool === 'select') editor.setTool('select'); return; }       // restores the normal hint
  const isArea = m.mode === 'area', n = m.points.length + (m.hasLive ? 1 : 0), hasLegs = m.legs.length > 0, hasArea = isArea && n >= 3;
  for (const b of document.querySelectorAll('#mbMode [data-mode]')) b.classList.toggle('on', b.dataset.mode === m.mode);
  setText($('#mbTitle'), isArea ? 'Area' : 'Distance');
  const main = isArea ? (hasArea ? fmtArea(m.area.areaKm2) : '—') : (hasLegs ? fmtKm(m.totalKm) : '—');
  setText($('#mbTotal'), main);
  const sub = isArea ? (hasArea ? [state.unit !== 'km' ? `${m.area.areaKm2.toLocaleString('en', { maximumFractionDigits: 2 })} km²` : '', `perimeter ${fmtKm(m.area.perimeterKm)}`].filter(Boolean).join(' · ') : '')
    : (hasLegs && state.unit !== 'km' ? `${m.totalKm.toLocaleString('en', { maximumFractionDigits: 2 })} km` : '');
  setText($('#mbTotalKm'), sub);
  const warn = $('#mbWarn'); warn.hidden = !(hasArea && m.area.selfIntersecting);
  const nPts = m.points.length, edgeName = (i) => `${i + 1}→${isArea ? (i + 1) % Math.max(nPts + (m.hasLive ? 1 : 0), 1) + 1 : i + 2}`;
  setHtml($('#mbLegs'), hasLegs ? m.legs.map((g, i) => {
    const live = m.hasLive && (isArea ? i >= m.legs.length - 2 : i === m.legs.length - 1);
    return `<li class="${live ? 'live' : ''}"><i>${edgeName(i)}</i><span>${fmtKm(g.km)}</span><em>${g.initialBearing.toFixed(1)}° ${compassPoint(g.initialBearing)}</em></li>`;
  }).join('') : `<li class="empty">${isArea ? 'Click the map to place the first corner.' : 'Click the map to place the first point.'}</li>`);
  $('#mbUndo').disabled = !m.points.length; $('#mbClear').disabled = !m.points.length; $('#mbCopy').disabled = isArea ? nPts < 3 : !hasLegs;
}

// ---------- export the current view as a PNG ----------
const exportArea = () => ({ x: inset(), w: W - inset(), h: H });         // the map area not covered by the side panel
function syncExportUi() {
  const a = exportArea(), sel = $('#exSel'), cur = sel.value;
  sel.innerHTML = EXPORT_SCALES.map((s) => { const c = clampScale(s, W, H), [pw, ph] = outputSize(c, a.w, a.h); return `<option value="${s}">${s}× — ${pw} × ${ph} px${c < s ? ' (limited)' : ''}</option>`; }).join('');
  sel.value = cur || '2';
}
function toggleExport(on = $('#exportBox').hidden) { if (on) syncExportUi(); $('#exportBox').hidden = !on; $('#tbExport').classList.toggle('on', on); $('#tbExport').setAttribute('aria-pressed', String(on)); }
/** Re-renders the map at `scale` x the screen resolution without selection handles, crops the panel away, returns a PNG blob. */
async function renderPng(scale) {
  const a = exportArea(), s = clampScale(scale, W, H);
  renderer.resize(W, H, s); glDpr = -1; overlay.resize(W, H, s);
  try {
    render({ dpr: s, exporting: true });                                // draws synchronously, so the buffers are still valid below
    const [pw, ph] = outputSize(s, a.w, a.h), out = document.createElement('canvas'); out.width = pw; out.height = ph;
    const c = out.getContext('2d');
    const paper = (themeById(state.theme).gl.paper || [1, 1, 1]).map((x) => Math.round(x * 255));
    c.fillStyle = `rgb(${paper[0]},${paper[1]},${paper[2]})`; c.fillRect(0, 0, pw, ph);          // never a transparent / white picture, whatever happens below
    c.putImageData(renderer.readPixels(a.x * s, 0, pw, ph), 0, 0);                                // the ocean / terrain / contour layer (WebGL), read straight from the framebuffer
    c.drawImage(ovCanvas, Math.round(a.x * s), 0, pw, ph, 0, 0, pw, ph);                          // borders, names, cities, coast, graticule
    return await new Promise((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error('could not encode the PNG (image too large?)'))), 'image/png'));
  } finally {
    renderer.resize(W, H); glDpr = -1; overlay.resize(W, H, dpr); requestRender();
  }
}
async function exportMap() {
  const btn = $('#exGo'); btn.disabled = true;
  try {
    const blob = await renderPng(+$('#exSel').value || 1), name = `${safeName(projectName)}.png`, T = window.__TAURI__;
    if (T && T.dialog && T.core) {
      const path = await T.dialog.save({ defaultPath: name, filters: [{ name: 'PNG image', extensions: ['png'] }] });
      if (!path) return;
      await T.core.invoke('save_binary', new Uint8Array(await blob.arrayBuffer()), { headers: { path: encodeURIComponent(path) } });
      toast('Exported ' + path);
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Downloaded ' + name);
    }
    toggleExport(false);
  } catch (e) { toast(String(e.message || e), true); }
  finally { btn.disabled = false; }
}

const fileFilter = [{ name: 'Cosmossi map', extensions: ['cosmap'] }];
// ---- saving: the first save picks a file, later saves + autosave write to it silently; optional Google Drive backup ----
let lastPath = null, lastHandle = null, saveCfg = { autoFile: true };
try { saveCfg = Object.assign(saveCfg, JSON.parse(localStorage.getItem('cosmossi.savecfg') || '{}')); lastPath = localStorage.getItem('cosmossi.lastPath') || null; } catch (_) {}
const driveStatus = (m, bad) => { const el = $('#driveStatus'); if (el) { el.textContent = m; el.style.color = bad ? '#8a2f1f' : ''; } };
const drive = createDrive({ onStatus: driveStatus });
const saveStatus = (m) => { const el = $('#saveStatus'); if (el) el.textContent = m; };
const setTarget = (path, handle) => { lastPath = path || null; lastHandle = handle || null; try { if (lastPath) localStorage.setItem('cosmossi.lastPath', lastPath); else localStorage.removeItem('cosmossi.lastPath'); } catch (_) {}
  saveStatus(path ? `Saving to ${path}` : handle ? `Saving to ${handle.name}` : 'Not saved to a file yet - press Ctrl+S once to choose where.'); };
const projectJson = () => { const p = store.toProject(projectName, state.planetKm); p.features = encodeRoads(p.features); return JSON.stringify(p); };          // roads are written as tagged rivers (roads.js); the store's own features are untouched
async function writeTarget(json) {
  const T = window.__TAURI__;
  if (T && T.core && lastPath) { await T.core.invoke('save_project', { path: lastPath, json }); return true; }
  if (lastHandle) { const w = await lastHandle.createWritable(); await w.write(json); await w.close(); return true; }
  return false;
}
/** asNew (Save as / first save) always asks where; otherwise writes to the last saved file */
async function saveProject(asNew = false) {
  const json = projectJson(), T = window.__TAURI__;
  try {
    if (!asNew && await writeTarget(json)) { toast('Saved ' + (lastPath || lastHandle.name)); }
    else if (T && T.dialog && T.core) {
      const path = await T.dialog.save({ defaultPath: lastPath || `${projectName}.cosmap`, filters: fileFilter });
      if (!path) return false;
      await T.core.invoke('save_project', { path, json }); setTarget(path); toast('Saved ' + path);
    } else if (window.showSaveFilePicker) {
      const h = await window.showSaveFilePicker({ suggestedName: `${projectName}.cosmap`, types: [{ description: 'Cosmossi map', accept: { 'application/json': ['.cosmap'] } }] });
      lastHandle = h; await writeTarget(json); setTarget(null, h); toast('Saved ' + h.name);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = `${projectName}.cosmap`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Downloaded ' + a.download);
    }
  } catch (e) { if (e && e.name === 'AbortError') return false; toast(String(e.message || e), true); return false; }
  drive.push(json, projectName, { interactive: false });
  return true;                                                          // saved (or downloaded): callers such as New map may go on
}
function applyProject(p) {
  if (Array.isArray(p.features)) decodeRoads(p.features);       // tagged rivers become roads again (roads.js)
  checkProject(p);                                      // also migrates v1 files (adds the default timeline)
  store.load(p.features, p.timeline); projectName = p.name || 'Cosmossi';
  state.planetKm = p.planetRadiusKm; $('#radius').value = state.planetKm; saveSettings();
  editor.select(null); requestRender();
}
async function openProject() {
  const T = window.__TAURI__;
  try {
    if (T && T.dialog && T.core) {
      const path = await T.dialog.open({ multiple: false, filters: fileFilter });
      if (!path) return;
      applyProject(JSON.parse(await T.core.invoke('load_project', { path })));            // Rust validates first
      setTarget(path); toast('Opened ' + path);
    } else if (window.showOpenFilePicker) {
      const [h] = await window.showOpenFilePicker({ types: [{ description: 'Cosmossi map', accept: { 'application/json': ['.cosmap', '.json'] } }] });
      applyProject(JSON.parse(await (await h.getFile()).text())); setTarget(null, h); toast('Opened ' + h.name);
    } else $('#fileIn').click();
  } catch (e) { if (e && e.name === 'AbortError') return; toast(String(e.message || e), true); }
}
/** Windows file association: the installer registers .cosmap, Explorer launches us with the path as an argument. */
async function openStartupFile() {
  const core = window.__TAURI__ && window.__TAURI__.core; if (!core) return;
  try {
    const path = await core.invoke('startup_file'); if (!path) return;
    applyProject(JSON.parse(await core.invoke('load_project', { path }))); setTarget(path); toast('Opened ' + path);
  } catch (e) { toast(String(e.message || e), true); }
}
let autosaveTimer = 0, fileTimer = 0, driveHold = false;      // driveHold: a fresh blank map is not backed up until it holds something
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    try { localStorage.setItem('cosmossi.project', projectJson()); } catch (_) {}
  }, 500);
  clearTimeout(fileTimer);
  fileTimer = setTimeout(async () => {                                    // quieter second stage: the real file, then Drive
    const json = projectJson();
    if (saveCfg.autoFile && (lastPath || lastHandle)) {
      try { if (await writeTarget(json)) saveStatus(`Autosaved ${new Date().toLocaleTimeString()} to ${lastPath || lastHandle.name}`); }
      catch (e) { saveStatus('Autosave failed: ' + (e.message || e)); }
    }
    if (driveHold && !hasContent(store)) return;
    driveHold = false; drive.push(json, projectName, { minGapMs: 60000 });
  }, 3000);
}
function wireBackup() {
  const on = $('#autoFile'), dOn = $('#driveOn'), box = $('#driveBox'), id = $('#driveId');
  on.checked = saveCfg.autoFile; dOn.checked = drive.config.enabled; box.hidden = !dOn.checked; id.value = drive.config.clientId || '';
  if (lastPath) saveStatus(`Saving to ${lastPath}`);
  on.addEventListener('change', () => { saveCfg.autoFile = on.checked; try { localStorage.setItem('cosmossi.savecfg', JSON.stringify(saveCfg)); } catch (_) {} });
  $('#saveAs').addEventListener('click', () => saveProject(true));
  dOn.addEventListener('change', () => { drive.set({ enabled: dOn.checked }); box.hidden = !dOn.checked; });
  id.addEventListener('change', () => drive.set({ clientId: id.value.trim() }));
  $('#driveConnect').addEventListener('click', async () => { drive.set({ clientId: id.value.trim() }); const ok = await drive.connect(projectJson(), projectName); if (ok) toast('Backed up to Google Drive'); });
}
// ---- new map: a totally blank project: no features, default timeline, no land edits, default planet, tied to no file and no Drive backup ----
const DEFAULT_PLANET_KM = 6371, newBox = () => $('#newBox');
function startNewMap() {
  newBox().hidden = true;
  clearTimeout(autosaveTimer); clearTimeout(fileTimer);        // a pending autosave must never write the blank map over the old file
  setTarget(null, null);                                       // let go of the old file FIRST (store.load below triggers the autosave)
  drive.set({ fileId: '' }); driveHold = true;                 // ... and of its Drive backup: the next backup becomes a new Drive file
  try { localStorage.removeItem('cosmossi.project'); } catch (_) {}
  land.setActive(false); biome.setActive(false); if (measure && measure.active) measure.setActive(false); if (info) info.hide();   // the painter first: a stroke still running would paint into the blank map
  projectName = 'Cosmossi'; state.planetKm = DEFAULT_PLANET_KM; $('#radius').value = state.planetKm; saveSettings();
  store.load([], null);                                        // default timeline, empty undo history; the land-delta feature goes too, so land edits revert to the baked land
  editor.select(null); touchContent(); requestRender();
}
async function askNewMap() {
  const plan = newMapPlan({ hasContent: hasContent(store), hasFile: !!(lastPath || lastHandle), autoFile: saveCfg.autoFile });
  if (plan === 'safe') {                                       // autosave keeps the file current; flush the last second of work, then go
    try { const where = lastPath || lastHandle.name; if (await writeTarget(projectJson())) { startNewMap(); toast(`New map. The previous map is saved in ${where}.`); return; } } catch (_) { /* fall through: ask */ }
  }
  if (plan === 'now') { startNewMap(); toast('New map'); return; }
  $('#nbMsg').textContent = lastPath || lastHandle
    ? 'This map has changes that are not saved to its file (autosave to the file is off or failed). Starting a new map discards them.'
    : 'This map has not been saved to a file. Starting a new map discards it.';
  newBox().hidden = false; $('#nbCancel').focus();
}
function wireNewMap() {
  $('#tbNew').addEventListener('click', askNewMap); $('#newMap').addEventListener('click', askNewMap);
  $('#nbCancel').addEventListener('click', () => { newBox().hidden = true; }); $('#nbClose').addEventListener('click', () => { newBox().hidden = true; });
  $('#nbGo').addEventListener('click', () => { startNewMap(); toast('New map'); });
  $('#nbSave').addEventListener('click', async () => { if (await saveProject(false)) { startNewMap(); toast('Saved. New map started.'); } });
}
function restoreAutosave() {
  try {
    const raw = localStorage.getItem('cosmossi.project'); if (!raw) return;
    const p = JSON.parse(raw); if (!p.features || !(p.features.length || (p.timeline && p.timeline.events && p.timeline.events.length))) return;
    applyProject(p); toast('Restored your last session');
  } catch (_) {}
}

let biome = { active: false, setActive() {}, draw() {}, leave() {}, down: () => false, move() {}, up() {}, key: () => false };
let land = { active: false, setActive() {}, draw() {}, leave() {}, down: () => false, move() {}, up() {} };
function wireEditor() {
  // every tool switch goes through onTool (setTool always calls it), so Land, Biome and Measure turn each other off here
  editor = createEditor({
    store, getView: () => ({ def: def(), cx: state.cx, cy: state.cy, scale: state.scale, lon0: state.lon0, lat0: state.lat0, w: W, h: H, zoomRel: state.scale / fit() }),
    getCoast: () => editorCoast || (vectors && vectors.coast), requestRender, onContent: touchContent, isVisible,
    onSelect: (f, o) => { renderInspector(f, o); renderFeatureList(); updateToolOpts(); if (globe) globe.selectionChanged(f); if (clist && f) clist.reveal(f.id); },
    onPick: (root, area) => { if (info) info.show(area || root); },
    onTool: (t) => { land.setActive(false); biome.setActive(false); measure && measure.setActive(false); if (info) info.hide(); if (t === 'road') roadToolOn(); updateToolbar(); }, onHint: (t) => showHint(t),
  });
  places = createPlaces({ store, editor, isVisible });
  measure = createMeasureTool({
    getView: () => ({ def: def(), cx: state.cx, cy: state.cy, scale: state.scale, lon0: state.lon0, lat0: state.lat0, w: W, h: H }),
    getPlanetKm: () => state.planetKm, getCities: () => store.features.filter((f) => f.kind === 'city' && isVisible(f)),
    formatKm: fmtKm, formatArea: fmtArea, requestRender, onChange: renderMeasureBox,
  });
  editor.setFillOpacity(+$('#fillOpacity').value / 100);
  // order matters: the biome overlay is handed to the land editor (it is the only writer of the biome texture), then the biome editor gets the land editor back
  biome = createBiomeEdit({ store, fromScreen: (x, y) => editor.fromScreen(x, y), getRenderer: () => renderer, requestRender, say: (t) => showHint(t), onActive: () => updateToolbar() });
  land = createLandEdit({
    store, biomeOverlay: biome.overlay, fromScreen: (x, y) => editor.fromScreen(x, y), getRenderer: () => renderer, getCoast: () => vectors && vectors.coast, requestRender, say: (t) => showHint(t), loadImage: fetchPng,
    onCoast: (coast, forEditor) => { coastN++; if (!vectors) return; editorCoast = forEditor; vectors = { coast, rivers: vectors.rivers }; overlay.setVectors(vectors); editor.coastChanged(); },
    onActive: () => updateToolbar(),
  });
  biome.attach(land);
  overlay.setExtraDraw((ctx, v) => editor.drawBase(ctx, v));                 // expensive content: cached as a bitmap by the overlay
  overlay.setTopDraw((ctx, v) => { editor.drawTop(ctx, v); land.draw(ctx); biome.draw(ctx); measure.draw(ctx, v); });   // cheap content: redrawn every frame
  store.on((type, info) => {
    if (type === 'day') {                                                              // the slider moved: only a lifespan or border version starting / ending changes anything drawn
      scheduleAutosave();
      if (!info || !info.epochChanged) return;
      for (const f of info.switched) editor.touch(f);                                  // a border version switched: drop that area's cached outline
      refreshOnDay(); touchContent();
      const g = store.find(editor.selectedId); if (g && !$('#inspector').contains(document.activeElement)) renderInspector(g);
      return;
    }
    if (type === 'meta') { scheduleAutosave(); refreshSide(); if (clist) clist.render(); return; }      // facts that are not drawn on the map (political name): no map repaint, no layout reset
    if (type === 'timeline' || type === 'change') editor.touchAll();                 // border versions may have switched
    renderFeatureList(); updateToolbar(); updateStats(); scheduleAutosave(); touchContent();
    if (type === 'timeline') { const g = store.find(editor.selectedId); if (g && !$('#inspector').contains(document.activeElement)) renderInspector(g); }
    if (type === 'change') {
      const f = store.find(editor.selectedId);
      if (f) { if (!$('#inspector').contains(document.activeElement) || document.activeElement.tagName === 'SELECT') renderInspector(f); }
      else if (editor.selectedId) editor.select(null);
    }
  });
  for (const b of document.querySelectorAll('#toolbar [data-tool]')) b.addEventListener('click', () => editor.setTool(b.dataset.tool));
  $('#tbLand').addEventListener('click', () => { if (land.active) land.setActive(false); else { editor.setTool('pan'); land.setActive(true); } });
  $('#tbBiome').addEventListener('click', () => toggleBiome());
  $('#tbUndo').addEventListener('click', () => store.undo());
  $('#tbRedo').addEventListener('click', () => store.redo());
  $('#tbMeasure').addEventListener('click', toggleMeasure);
  $('#tbHelp').addEventListener('click', () => toggleHelp());
  $('#hbClose').addEventListener('click', () => toggleHelp(false));
  // every titled toolbar button gets the same text as its accessible name (screen readers ignore title on some platforms)
  for (const b of document.querySelectorAll('#toolbar button[title]')) b.setAttribute('aria-label', b.title);
  $('#mbClose').addEventListener('click', () => measure.setActive(false));
  for (const b of document.querySelectorAll('#mbMode [data-mode]')) b.addEventListener('click', () => { measure.setMode(b.dataset.mode); setMeasureHint(); });
  $('#mbUndo').addEventListener('click', () => measure.removeLast());
  $('#mbClear').addEventListener('click', () => measure.clear());
  $('#mbCopy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(measure.summaryText()); toast('Copied the measurement'); } catch (_) { toast('Could not copy to the clipboard', true); }
  });
  $('#toSize').addEventListener('input', () => { editor.setBrushSize(+$('#toSize').value); updateToolOpts(); });
  for (const b of document.querySelectorAll('#toMode [data-m]')) b.addEventListener('click', () => { editor.setBrushErase(b.dataset.m === 'erase'); updateToolOpts(); });
  for (const b of document.querySelectorAll('#toDraw [data-d]')) b.addEventListener('click', () => {
    const id = editor.selectedId || editor.parentId;
    if (b.dataset.d === 'brush') { if (editor.tool !== 'brush') editor.setTool('brush', id); }
    else editor.setTool(editor.brushErase ? 'cut' : 'expand', id);                           // brush erase mode <-> Cut
  });
  $('#toLevel').addEventListener('change', () => { editor.setLevel(+$('#toLevel').value); updateToolOpts(); });
  $('#toNew').addEventListener('click', () => { editor.newArea(); updateToolOpts(); });
  $('#tbSnap').addEventListener('click', () => { editor.setSnap(!editor.snap); updateToolbar(); });
  $('#tbClip').addEventListener('click', () => { editor.setClip(!editor.clip); updateToolbar(); });
  $('#tbExport').addEventListener('click', () => toggleExport());
  $('#exClose').addEventListener('click', () => toggleExport(false));
  $('#exGo').addEventListener('click', exportMap);
  $('#tbOpen').addEventListener('click', openProject);
  $('#tbSave').addEventListener('click', (e) => saveProject(e.shiftKey));
  $('#fileIn').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    try { applyProject(JSON.parse(await file.text())); toast('Opened ' + file.name); } catch (err) { toast(String(err.message || err), true); }
  });
  window.addEventListener('keydown', (e) => {
    const t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') { if (e.key === 'Escape') e.target.blur(); return; }
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (e.key === 'F4') { e.preventDefault(); togglePerfLog(); return; }
    if (e.key === 'F3') { e.preventDefault(); perf.on = !perf.on; $('#perfHud').hidden = !perf.on; perf.gaps.length = 0; requestRender(); return; }
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? store.redo() : store.undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); store.redo(); return; }
    if (mod && k === 's') { e.preventDefault(); saveProject(e.shiftKey); return; }
    if (mod && k === 'o') { e.preventDefault(); openProject(); return; }
    if (mod && k === 'n' && !e.shiftKey) { e.preventDefault(); askNewMap(); return; }
    if (mod && k === 'e') { e.preventDefault(); toggleExport(); return; }
    if (e.key === ' ' && editor.tool === 'brush') { spaceDown = true; e.preventDefault(); return; }
    if (editor.tool === 'road' && !mod && !e.altKey && /^[1-5]$/.test(e.key)) { setRoadTier(ROAD_TIERS[+e.key - 1].id); return; }          // 1-5 pick the tier while the Road tool is on
    const TOOL_KEYS = { h: 'pan', v: 'select', c: 'country', s: 'sub', b: 'brush', r: 'range', i: 'river', o: 'road', p: 'city', t: 'label' };
    if (!mod && !e.altKey && TOOL_KEYS[k]) { editor.setTool(TOOL_KEYS[k]); return; }
    if (e.key === 'Escape' && !newBox().hidden) { newBox().hidden = true; e.preventDefault(); return; }
    if (e.key === 'Escape' && !$('#exportBox').hidden) { toggleExport(false); e.preventDefault(); return; }
    if (e.key === 'Escape' && !$('#helpBox').hidden) { toggleHelp(false); e.preventDefault(); return; }
    if (e.key === 'Escape' && info && info.shown) { info.hide(); e.preventDefault(); return; }
    if (e.key === '?') { toggleHelp(); e.preventDefault(); return; }
    if (biome.key(e)) { e.preventDefault(); return; }             // only while the painter is on: it takes [ ] E 0-9 and Esc
    if (measure.keydown(e)) { e.preventDefault(); return; }
    if (!mod && !e.altKey && measure.active && (k === 'd' || k === 'a')) { measure.setMode(k === 'a' ? 'area' : 'distance'); setMeasureHint(); return; }
    if (!mod && k === 'm') { toggleMeasure(); return; }
    if (!mod && !e.altKey && k === 'g') { toggleBiome(); return; }
    if (tlui && tlui.keydown(e)) { e.preventDefault(); return; }
    if (editor.keydown(e)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { if (e.key === ' ') spaceDown = false; });
  window.addEventListener('blur', () => { spaceDown = false; });
  const getUnits = () => ({ R: state.planetKm, unit: state.unit, kmU: kmPerUnit(state.unit) });
  clist = createCountryList({ el: $('#countryList'), store, editor, places, isVisible, getUnits, onLocate: locate, onShow: showOnMap });
  info = createCountryInfo({ el: $('#infoCard'), store, editor, places, isVisible, getUnits, onLocate: locate, onFocus: (id) => editor.spotlight(id),
    onEdit: (id) => { editor.setTool('select'); editor.select(id); }, onCity: (id) => { editor.setTool('select'); editor.select(id); } });
  ranking = createRanking({ el: $('#rankList'), keySel: $('#rankKey'), dirBtn: $('#rankDir'), countEl: $('#rankCount'), store, editor, isVisible,
    getUnits: () => ({ R: state.planetKm, unit: state.unit, kmU: kmPerUnit(state.unit) }),
    onPick: (id) => { const f = store.find(id); editor.setTool('pan'); if (info && f) info.show(f); } });
  ranking.render();
  renderFeatureList(); updateToolbar();
}

// ---------- Rust backend (Tauri) ----------
async function probeBackend() {
  const pill = $('#backend');
  const core = window.__TAURI__ && window.__TAURI__.core;
  if (!core) { pill.textContent = 'Browser preview'; pill.dataset.state = 'browser'; return; }
  try {
    const list = await core.invoke('list_projections');
    const same = list.length === PROJECTIONS.length && PROJECTIONS.every((p) => list.some((q) => q.id === p.id));
    pill.textContent = same ? `Rust core · ${list.length} projections` : 'Rust core · projection list differs!';
    pill.dataset.state = same ? 'ok' : 'warn';
  } catch (err) {
    pill.textContent = 'Rust core error'; pill.title = String(err); pill.dataset.state = 'warn';
  }
}

// ---------- the 3D globe beside the atlas (globe3d.js) ----------
/** everything the globe dock needs from the atlas */
function globeHost() {
  const polys = () => store.features.filter((f) => (f.kind === 'country' || f.kind === 'subdivision') && editor.isShown(f));
  /** Paint the countries as an equirectangular picture (lon -180..180 around `lon0`, deg), the way the atlas draws them: same colours,
   *  land clipping, enclave holes and borders. Drawn at a 2048 css px width and scaled up, so borders keep the weight they have on screen. */
  function paint(pxWidth, { lon0 = 0, solo = null } = {}) {
    const cssW = 2048, cssH = cssW / 2, k = pxWidth / cssW, cv = document.createElement('canvas');
    cv.width = Math.round(pxWidth); cv.height = Math.round(pxWidth / 2);
    const ctx = cv.getContext('2d'); ctx.setTransform(k, 0, 0, k, 0, 0);
    const prev = soloIds; soloIds = solo;
    try {
      editor.drawBase(ctx, { def: byId('equirectangular'), cx: 0, cy: 0, scale: cssW / (2 * PI), lon0: lon0 * DEG, lat0: 0, w: cssW, h: cssH, zoomRel: 1, theme: themeById(state.theme),
        interacting: false, cheap: false, snapshot: true, exporting: true, areasOnly: true, pole: 4, graticuleStep: 0, ver: 0 });
    } finally { soloIds = prev; }
    return cv;
  }
  /** the deepest country / subdivision at a point (deg), for hover and click on the globe */
  function hit(lon, lat) {
    const ll = [lon, lat]; let best = null, bd = -1;
    for (const f of polys()) {
      const dp = f.kind === 'country' ? 0 : editor.depth(f);
      if (dp > bd && (f.kind === 'country' ? editor.containsGroup(f, ll) : editor.contains(f, ll))) { best = f; bd = dp; }
    }
    if (!best) return null;
    const root = editor.root(best);
    return { id: best.id, name: best.name, sub: best.kind === 'subdivision' && root ? root.name : '', color: (root && root.color) || best.color };
  }
  /** a short string that changes exactly when the countries' picture would: the globe repaints only then (not for a selection, a tool or a measurement) */
  const signature = () => store.features.filter((f) => (f.kind === 'country' || f.kind === 'subdivision') && editor.isShown(f))
    .map((f) => `${f.id}:${editor.revOf(f)}:${f.color}:${f.enclaveOf || ''}:${f.parent || ''}`).join('|')
    + `#${state.theme}|${editor.fillOpacity}|${editor.clip}|${JSON.stringify(editor.layers)}|${coastN}`;
  /** the shown countries / subdivisions that have a name (far islands included: they carry the country's name, as in the atlas) */
  const named = () => store.features.filter((f) => (f.kind === 'country' || f.kind === 'subdivision') && editor.isShown(f) && f.name);
  /** changes exactly when the names the globe would set change (text, shape, level, theme) */
  const namesSignature = () => named().map((f) => `${f.id}:${editor.revOf(f)}:${f.name}:${f.parent || ''}`).join('|') + `#${state.theme}`;
  /** the names for the globe: each with its centre line in lon/lat (cached by the editor until the shape changes); the globe lays them out itself */
  function names() {
    const items = [];
    for (const f of named()) {
      const sp = editor.spineOf(f); if (!sp) continue;
      const dp = f.kind === 'subdivision' ? editor.depth(f) : 0, nm = f.name;
      items.push({ id: f.id, text: dp ? nm : nm.toUpperCase(), dp, sp: { pts: sp.pts, loc: sp.loc, thick: sp.thick, len: sp.len } });
    }
    const t = themeById(state.theme).txt;
    return { items, txt: { name: t.name, halo: t.halo, haloW: t.haloW || 0.1 } };
  }
  const group = (f) => new Set([f.id]);
  return {
    store, paint, hit, group, signature, names, namesSignature,
    selected: () => store.find(editor.selectedId),
    select: (id) => { editor.select(id); requestRender(); },
    climate: () => climate,
    toast: (m, bad) => toast(m, bad),
    setDock(px) { if (px === dockPx) return; dockPx = px; document.body.classList.toggle('docked', px > 0); document.documentElement.style.setProperty('--dock', px + 'px'); if (renderer) resize(); },
    /** the geographic point at the centre of the atlas view (deg), or null */
    center() {
      const d = def();
      if (d.globe) return { lon: state.lon0 / DEG, lat: state.lat0 / DEG };
      const r = unproject(d, state.cx + inset() / (2 * state.scale), state.cy, state.lon0, 0);
      return r ? { lon: r[0] / DEG, lat: r[1] / DEG } : null;
    },
    /** the globe was turned: turn the atlas to the same place (a globe projection rotates, a flat map pans) */
    setCenter(lon, lat) {
      camera.stop(); const d = def();
      if (d.globe) { state.lon0 = lon * DEG; state.lat0 = Math.max(-80, Math.min(80, lat)) * DEG; syncSliders(); }
      else { const p = project(d, lon * DEG, lat * DEG, state.lon0, 0); if (!p) return; state.cx = p[0] - inset() / (2 * state.scale); state.cy = p[1]; }
      requestRender();
    },
  };
}

// ---------- boot ----------
async function boot() {
  try {
    renderer = await createRenderer(glCanvas, { biomeUrl: 'tex/biome.png', auxUrl: 'tex/field.png' });
    overlay = createOverlay(ovCanvas);
    overlay.onRequest = requestRender;
    fx = createShimmer({ canvas: $('#fx'), getView: () => ({ def: def(), cx: state.cx, cy: state.cy, scale: state.scale, lon0: state.lon0, lat0: state.lat0, w: W, h: H }), getTarget: (v, fast) => (editor ? editor.shimmerOf(v, fast) : null), busy: () => queued });
    loadSettings();
    // Archivo is drawn on the canvas too (names, measurements): have it loaded before the first frame so nothing is measured in a fallback font
    try { await Promise.all([...['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 16px Archivo`)), document.fonts.load('italic 500 16px Archivo')]); } catch (_) { /* system font */ }
    try { vectors = await loadVectors('data/coast.json'); overlay.setVectors(vectors); }
    catch (e) { console.warn('Vector coast unavailable, using raster coast:', e.message); }
    wireEditor();
    tlui = createTimelineUI({ store, toast, selectFeature: (id) => { editor.setTool('select'); editor.select(id); }, linkable: (f) => f.id !== LAND_ID && f.id !== BIOME_ID });
    climate = createClimate({ renderer, store, requestRender, toast }); climate.wire();
    topo = createTopo({ renderer, requestRender, toast }); topo.wire();
    globe = createGlobe3d(globeHost()); globe.wire();
    { const tl = $('#timeline'), b = $('#tlCollapse'); const set = (on) => { tl.classList.toggle('min', on); b.setAttribute('aria-expanded', String(!on)); b.textContent = on ? '▴' : '▾'; b.title = on ? 'Show the timeline slider' : 'Collapse the timeline'; try { localStorage.setItem('cosmossi.tlmin', on ? '1' : '0'); } catch (_) {} };
    try { store.setPaused(localStorage.getItem('cosmossi.tlpaused') === '1'); } catch (_) {}
    let m = false; try { m = localStorage.getItem('cosmossi.tlmin') === '1'; } catch (_) {} set(m); b.addEventListener('click', () => set(!tl.classList.contains('min'))); createBotBar(); }
  wireBackup(); wireNewMap(); wireSections(); buildProjectionList(); wireControls(); wireReference(); wireInteraction();
    resize();
    setProjection(state.proj);
    restoreAutosave();
    await openStartupFile();                    // a double-clicked .cosmap wins over the restored session
    probeBackend();
    try { editor.warmArea(); } catch (e) { console.warn('land mask not prepared yet:', e.message); }   // the area figures need it: build it now, under the loader
    $('#loading').classList.add('done');
    window.__atlasReady = true;
  } catch (err) {
    console.error(err);
    const box = $('#error'); box.hidden = false; box.textContent = String(err.message || err);
    window.__atlasError = String(err.message || err);
  }
}
window.__atlas = { askNewMap, startNewMap, hasContent: () => hasContent(store), target: () => ({ lastPath, hasHandle: !!lastHandle }), projectJson, store, editor: () => editor, measure: () => measure, biome: () => biome, state, camera: () => camera, get vectors() { return vectors; }, overlay: () => overlay, setProjection, render: () => render(), zoomAt, resetView, byId };
boot();