// COSMOSSI bridge, globe-page side. Loaded by sim/index.html BEFORE import-main.js; the (minified) bundle calls back into it
// at three points (see sim-src/bridge/patch-bundle.mjs and the matching `globalThis.__cosmossi?.` lines in sim-src/js):
//   material(m)      every globe material is passed through here: it gets the country overlay shader
//   attach({...})    once the page has built its renderer / scene / camera / state
//   wrapAdapter(a)   the export adapter: colour maps get the countries painted into them
// The atlas (the parent window, same origin) talks to this module through window.__cosmossi. No dependencies.
const G = globalThis;
const cm = (G.__cosmossi = G.__cosmossi || {});
const DEG = Math.PI / 180;
const docked = /[?&]dock=1/.test(location.search);
if (docked) document.documentElement.classList.add('cm-docked');

// ---------- the country overlay: two canvas textures shared by every globe material ----------
// Uniform objects are shared, so one update reaches every compiled program. Cost on the GPU: two texture reads per globe fragment,
// only while an overlay is on; cost on the CPU: none per frame (a texture is uploaded only when the atlas repaints it).
const U = { cmOv: { value: null }, cmSel: { value: null }, cmOn: { value: 0 }, cmSelOn: { value: 0 }, cmAlpha: { value: 1 } };
const VERT_HEAD = 'varying vec3 cmDir;\n';
const FRAG_HEAD = `uniform sampler2D cmOv; uniform sampler2D cmSel; uniform float cmOn; uniform float cmSelOn; uniform float cmAlpha;
varying vec3 cmDir;
`;
// longitude / latitude from the object-space direction (the planet's own axes: lon = atan2(x, z), lat = asin(y)), sampled with
// explicit gradients: atan() jumps at the date line, and the automatic mip level would pick the smallest mip along that seam
const FRAG_BODY = `
  if (cmOn > 0.5) {
    vec3 cd = normalize(cmDir);
    vec2 cuv = vec2(atan(cd.x, cd.z) * 0.15915494 + 0.5, asin(clamp(cd.y, -1.0, 1.0)) * 0.31830989 + 0.5);
    vec2 cgx = dFdx(cuv), cgy = dFdy(cuv);
    cgx.x -= floor(cgx.x + 0.5); cgy.x -= floor(cgy.x + 0.5);
    vec4 co = textureGrad(cmOv, cuv, cgx, cgy);
    diffuseColor.rgb = mix(diffuseColor.rgb, co.rgb, co.a * cmAlpha);
    if (cmSelOn > 0.5) { vec4 cs = textureGrad(cmSel, cuv, cgx, cgy); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.97, 0.85), cs.a * 0.42); }
  }
`;

cm.material = (m) => {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = function (sh, r) {
    if (prev) prev.call(this, sh, r);
    Object.assign(sh.uniforms, U);
    sh.vertexShader = VERT_HEAD + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n cmDir = normalize(position);');
    sh.fragmentShader = FRAG_HEAD + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_BODY);
  };
  m.customProgramCacheKey = () => 'cosmossi-overlay-1';
  return m;
};

let A = null;                                   // internals handed over by attach()
const layer = { fill: null, sel: null };        // { cv, ctx, tex }
function makeLayer(w, h) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const tex = new A.Texture(cv);
  tex.colorSpace = 'srgb';                      // the canvas is sRGB: sampled linear, as the vertex colours are
  tex.wrapS = 1000; tex.wrapT = 1001;           // repeat / clamp
  tex.magFilter = 1006; tex.minFilter = 1008;   // linear / linear-mipmap-linear
  tex.generateMipmaps = true;
  try { tex.anisotropy = Math.min(8, A.renderer.capabilities.getMaxAnisotropy()); } catch (_) {}
  return { cv, ctx: cv.getContext('2d'), tex };
}
function ensure() {
  if (!A || layer.fill) return !!A;
  const maxT = A.renderer.capabilities.maxTextureSize || 4096;
  const w = Math.min(4096, maxT);
  layer.fill = makeLayer(w, w >> 1);
  layer.sel = makeLayer(Math.min(2048, maxT), Math.min(2048, maxT) >> 1);
  U.cmOv.value = layer.fill.tex; U.cmSel.value = layer.sel.tex;
  return true;
}
const copyInto = (L, src) => { L.ctx.clearRect(0, 0, L.cv.width, L.cv.height); if (src) L.ctx.drawImage(src, 0, 0, L.cv.width, L.cv.height); L.tex.needsUpdate = true; };
let want = { show: true, has: false };
const refresh = () => { U.cmOn.value = want.show && want.has ? 1 : 0; syncMapQuad(); };
/** the atlas painted its countries (an equirectangular canvas, lon -180..180): upload it as the overlay */
cm.setOverlay = (src) => { if (!ensure()) return false; copyInto(layer.fill, src); want.has = !!src; refresh(); return true; };
/** the selected country's outline / fill (or null): a lighter wash over it */
cm.setSelection = (src) => { if (!ensure()) return false; copyInto(layer.sel, src); U.cmSelOn.value = src ? 1 : 0; syncMapQuad(); return true; };
cm.setShow = (on) => { want.show = !!on; refresh(); };
cm.setAlpha = (a) => { U.cmAlpha.value = Math.max(0, Math.min(1, a)); syncMapQuad(); };
cm.exportCountries = true;                      // paint the countries into exported colour maps

// ---------- the flat map (Map view) ----------
// The flat map is its own mesh (planet-mesh.js buildMapMesh), not a globe material, so it gets its own overlay: one quad, 4 x 2 map units
// (the map's whole extent), a hair in front of the map, that reads the SAME two textures, switch and opacity as the globe. Its longitude
// comes from the quad's own x plus the map's centre meridian, read live, so the Centre slider moves it with the map. It sits in the
// scene, so the map in a projection (which draws the flat map into a picture) picks it up with no further work. Cost: nothing while the
// globe is shown or the countries are off (the quad is hidden); one quad and two texture reads per pixel otherwise.
const MAP_VERT = 'varying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const MAP_FRAG = `uniform sampler2D cmOv; uniform sampler2D cmSel; uniform float cmSelOn; uniform float cmAlpha; uniform float uOff; varying vec2 vP;
void main() {
  vec2 uv = vec2(vP.x * 0.25 + uOff, vP.y * 0.5 + 0.5);
  vec4 co = texture2D(cmOv, uv);
  float a0 = co.a * cmAlpha, s = 0.0;
  if (cmSelOn > 0.5) s = texture2D(cmSel, uv).a * 0.42;
  float a = a0 + s * (1.0 - a0);
  if (a < 0.002) discard;
  gl_FragColor = vec4((co.rgb * a0 + vec3(1.0, 0.97, 0.85) * s * (1.0 - a0)) / a, a);
  #include <colorspace_fragment>
}`;
let mapQuad = null;
function buildMapQuad() {
  if (mapQuad || !A || !A.Mesh || !A.PlaneGeometry || !A.ShaderMaterial || !A.scene) return;
  const mat = new A.ShaderMaterial({
    uniforms: { cmOv: U.cmOv, cmSel: U.cmSel, cmSelOn: U.cmSelOn, cmAlpha: U.cmAlpha, uOff: { value: 0.5 } },
    vertexShader: MAP_VERT, fragmentShader: MAP_FRAG, transparent: true, depthWrite: false, side: 2,
  });
  mapQuad = new A.Mesh(new A.PlaneGeometry(4, 2), mat);
  mapQuad.position.z = 0.0004; mapQuad.renderOrder = -1; mapQuad.visible = false;     // (before the map's own lines, over its cells)
  A.scene.add(mapQuad);
}
/** show / hide the quad and point it at the map's centre meridian; called whenever the overlay, the switch, the view or the centre changes */
function syncMapQuad() {
  if (!A || !A.state) return;
  const on = !!(A.state.mapMode && want.show && want.has && layer.fill);
  if (on && !mapQuad) buildMapQuad();
  if (!mapQuad) return;
  mapQuad.visible = on;
  mapQuad.material.uniforms.uOff.value = (A.state.mapCenterLon || 0) / (2 * Math.PI) + 0.5;
  mapQuad.material.needsUpdate = true;            // a new material version: the projected map (map-projection.js) redraws its picture only when one of these changes
}
function wireMapOverlay() {
  const vm = document.getElementById('viewMode'), sl = document.getElementById('sMapCenterLon');
  if (vm) vm.addEventListener('change', syncMapQuad);                                   // (the page's own handler ran first and set state.mapMode)
  if (sl) sl.addEventListener('input', syncMapQuad);
  syncMapQuad();
}

// ---------- picking and the camera ----------
// small column-major 4x4 helpers: the bundle does not export THREE, and these need nothing from it
const mulPoint = (e, x, y, z) => { const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); return [(e[0] * x + e[4] * y + e[8] * z + e[12]) * w, (e[1] * x + e[5] * y + e[9] * z + e[13]) * w, (e[2] * x + e[6] * y + e[10] * z + e[14]) * w]; };
const mulDir = (e, x, y, z) => [e[0] * x + e[4] * y + e[8] * z, e[1] * x + e[5] * y + e[9] * z, e[2] * x + e[6] * y + e[10] * z];
const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const toLonLat = (d) => ({ lon: Math.atan2(d[0], d[2]) / DEG, lat: Math.asin(Math.max(-1, Math.min(1, d[1]))) / DEG });
const toDir = (lon, lat) => { const a = lon * DEG, b = lat * DEG, c = Math.cos(b); return [c * Math.sin(a), Math.sin(b), c * Math.cos(a)]; };

/** the geographic point under a screen position of the globe (client coordinates), or null (sky, or the flat map view) */
cm.lonLatAt = (clientX, clientY) => {
  if (!A || A.state.mapMode || !A.state.planetMesh) return null;
  const { camera, canvas } = A, r = canvas.getBoundingClientRect();
  const nx = ((clientX - r.left) / r.width) * 2 - 1, ny = -((clientY - r.top) / r.height) * 2 + 1;
  camera.updateMatrixWorld();
  const pm = camera.projectionMatrixInverse.elements, cw = camera.matrixWorld.elements;
  const v = mulPoint(pm, nx, ny, 1), wd = norm(mulDir(cw, v[0], v[1], v[2])), wo = [cw[12], cw[13], cw[14]];
  A.state.planetMesh.updateMatrixWorld();
  const inv = A.state.planetMesh.matrixWorld.clone().invert().elements, o = mulPoint(inv, wo[0], wo[1], wo[2]), d = norm(mulDir(inv, wd[0], wd[1], wd[2]));
  const R = 1.03, b = 2 * (o[0] * d[0] + o[1] * d[1] + o[2] * d[2]), c = o[0] * o[0] + o[1] * o[1] + o[2] * o[2] - R * R, disc = b * b - 4 * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / 2; if (t < 0) return null;
  return toLonLat(norm([o[0] + t * d[0], o[1] + t * d[1], o[2] + t * d[2]]));
};
/** the point the camera looks at (degrees) */
cm.getCenter = () => {
  if (!A || A.state.mapMode || !A.state.planetMesh) return null;
  A.state.planetMesh.updateMatrixWorld();
  const inv = A.state.planetMesh.matrixWorld.clone().invert().elements, p = A.camera.position, t = A.ctrl.target;
  return toLonLat(norm(mulDir(inv, p.x - t.x, p.y - t.y, p.z - t.z)));
};
/** turn the globe so that (lon, lat) faces the camera; the zoom stays */
cm.setCenter = (lon, lat) => {
  if (!A || A.state.mapMode || !A.state.planetMesh) return false;
  A.state.planetMesh.updateMatrixWorld();
  const w = norm(mulDir(A.state.planetMesh.matrixWorld.elements, ...toDir(lon, Math.max(-85, Math.min(85, lat))))), t = A.ctrl.target, dist = A.camera.position.distanceTo(t);
  A.camera.position.set(t.x + w[0] * dist, t.y + w[1] * dist, t.z + w[2] * dist);
  A.ctrl.update();
  return true;
};

// ---------- the pointer: hover tooltip, click to select ----------
let handlers = { hit: null, pick: null, paint: null, view: null };
let tip = null;
const showTip = (hit, e) => {
  if (!tip) { tip = document.createElement('div'); tip.id = 'cmTip'; document.body.appendChild(tip); }
  if (!hit) { tip.hidden = true; return; }
  tip.textContent = ''; const b = document.createElement('b'); b.textContent = hit.name; tip.appendChild(b);
  if (hit.sub) { const s = document.createElement('span'); s.textContent = ' \u00b7 ' + hit.sub; tip.appendChild(s); }
  tip.style.setProperty('--c', hit.color || '#888'); tip.hidden = false;
  tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, e.clientX + 14) + 'px'; tip.style.top = Math.min(innerHeight - 30, e.clientY + 16) + 'px';
};
cm.setHandlers = (h) => { handlers = { ...handlers, ...h }; };
function wirePointer() {
  const { canvas } = A; let down = null, lastMove = 0, lastKey = '', lastHit = null;
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; if (tip) tip.hidden = true; });
  canvas.addEventListener('pointerup', (e) => {
    const d = down; down = null;
    if (!d || e.button !== 0 || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5 || performance.now() - d.t > 450 || !handlers.pick) return;
    const ll = cm.lonLatAt(e.clientX, e.clientY); handlers.pick(ll ? ll.lon : null, ll ? ll.lat : null, e);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons || !handlers.hit) { if (tip) tip.hidden = true; return; }
    const now = performance.now();
    if (now - lastMove >= 60) {                 // throttled; the lookup is only repeated when the point moved by more than ~0.05 degrees
      lastMove = now;
      const ll = cm.lonLatAt(e.clientX, e.clientY);
      if (!ll) { lastKey = ''; lastHit = null; }
      else { const key = ll.lon.toFixed(1) + ',' + ll.lat.toFixed(1); if (key !== lastKey) { lastKey = key; try { lastHit = handlers.hit(ll.lon, ll.lat); } catch (_) { lastHit = null; } } }
    }
    showTip(lastHit, e);
  });
  canvas.addEventListener('pointerleave', () => { if (tip) tip.hidden = true; lastKey = ''; lastHit = null; });
  // the camera moved: tell the atlas (at most every 100 ms, with a trailing call so the last position is always sent)
  let timer = 0, lastSent = 0;
  A.ctrl.addEventListener('change', () => {
    if (!handlers.view || A.state.mapMode) return;
    const run = () => { timer = 0; lastSent = performance.now(); const c = cm.getCenter(); if (c) handlers.view(c.lon, c.lat); };
    const wait = 100 - (performance.now() - lastSent);
    if (wait <= 0) run(); else if (!timer) timer = setTimeout(run, wait);
  });
}

// ---------- country names ----------
// A light 2D canvas over the globe. The atlas hands over each name with its centre line (lon/lat); every camera move projects the line
// to the screen and sets the name along it with the atlas's own layout (labelspine.js), so names bend with the country exactly as in the atlas.
// Cost control: nothing is drawn while the names are off; a redraw happens at most once per animation frame and only when the view
// changed; labels on the far side or off screen are rejected after ONE point test; and when a redraw is slow (many names) redraws are
// spaced out while the globe moves, with a final exact redraw when it stops. Nothing runs per frame on a still globe.
const N = { items: [], txt: null, show: false, cv: null, ctx: null, mod: null, raf: 0, timer: 0, last: 0, cost: 0, w: 0, h: 0 };
const NAME_FONT = (dp, px) => `${dp ? 'italic 500' : '600'} ${px}px Archivo, system-ui, "Segoe UI", sans-serif`;
const NAME_R = 1.01, NAME_MAX = 160;
function ensureNames() {
  if (N.cv) return true;
  const cv = document.createElement('canvas'); cv.id = 'cmNames';
  cv.style.cssText = 'position:fixed;pointer-events:none;z-index:5;display:none;';
  document.body.appendChild(cv); N.cv = cv; N.ctx = cv.getContext('2d');
  // the names use Archivo: if it was not loaded yet when a name was measured, measure again once it is
  try { Promise.all([document.fonts.load('600 16px Archivo'), document.fonts.load('italic 500 16px Archivo')]).then(() => { for (const it of N.items) it.adv = null; scheduleNames(); }); } catch (_) { /* system font */ }
  return true;
}
function clearNames() { if (N.cv) { N.ctx.setTransform(1, 0, 0, 1, 0, 0); N.ctx.clearRect(0, 0, N.cv.width, N.cv.height); N.cv.style.display = 'none'; } }
function scheduleNames() {
  if (!N.show || !N.items.length || !N.mod || !A || N.raf) return;
  const wait = N.cost > 7 ? Math.min(90, N.cost * 6) - (performance.now() - N.last) : 0;
  if (wait > 4) { if (!N.timer) N.timer = setTimeout(() => { N.timer = 0; scheduleNames(); }, wait); return; }
  N.raf = requestAnimationFrame(drawNames);
}
function drawNames() {
  N.raf = 0; const t0 = performance.now(), mesh = A && A.state.planetMesh;
  if (!N.show || !N.items.length || !N.mod || !mesh || A.state.mapMode) { clearNames(); return; }
  const { camera, canvas } = A, r = canvas.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return;
  const dpr = Math.min(devicePixelRatio || 1, 2), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr), st = N.cv.style;
  if (N.cv.width !== W || N.cv.height !== H) { N.cv.width = W; N.cv.height = H; }
  st.display = 'block'; st.left = r.left + 'px'; st.top = r.top + 'px'; st.width = r.width + 'px'; st.height = r.height + 'px';
  const ctx = N.ctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  camera.updateMatrixWorld(); mesh.updateMatrixWorld();
  const inv = mesh.matrixWorld.clone().invert().elements, cw = camera.matrixWorld.elements;
  const o = mulPoint(inv, cw[12], cw[13], cw[14]), od = Math.hypot(o[0], o[1], o[2]) || 1;
  const PV = camera.projectionMatrix.clone().multiply(camera.matrixWorld.clone().invert()).multiply(mesh.matrixWorld).elements;
  const minCos = NAME_R / od + 0.12, rw = r.width, rh = r.height;                      // a little inside the horizon: names squeezed against the rim are not legible
  const vis = (d, i) => (d[i] * o[0] + d[i + 1] * o[1] + d[i + 2] * o[2]) / od > minCos;
  const proj = (d, i) => { const p = mulPoint(PV, d[i] * NAME_R, d[i + 1] * NAME_R, d[i + 2] * NAME_R); return [(p[0] * 0.5 + 0.5) * rw, (0.5 - p[1] * 0.5) * rh]; };
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  let drawn = 0; const th = N.txt || { name: 'rgba(52,40,36,0.88)', halo: 'rgba(250,245,232,0.85)' };
  for (const it of N.items) {
    if (drawn >= NAME_MAX) break;
    const d = it.dirs, n = it.n, mid = (n >> 1) * 3;
    if (!vis(d, mid)) continue;                                                         // one test rejects most of the far side
    const m = proj(d, mid); if (m[0] < -rw * 0.1 || m[0] > rw * 1.1 || m[1] < -rh * 0.1 || m[1] > rh * 1.1) continue;
    const sc = []; let ok = true, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let k = 0; k < n; k++) {
      if (!vis(d, k * 3)) { ok = false; break; }
      const s = proj(d, k * 3); sc.push(s); if (s[0] < x0) x0 = s[0]; if (s[0] > x1) x1 = s[0]; if (s[1] < y0) y0 = s[1]; if (s[1] > y1) y1 = s[1];
    }
    if (!ok || Math.max(x1 - x0, y1 - y0) < 24) continue;                                // hidden side, or too small to carry a name
    if (!it.adv) { ctx.font = NAME_FONT(it.dp, 100); it.adv = it.chars.map((ch) => ctx.measureText(ch).width / 100); }
    const L = N.mod.layoutName(sc, N.mod.thicknessPx(sc, it.sp), it.chars, it.adv, { minSize: it.dp ? 9 : 10, maxSize: it.dp ? 14 : 28, maxSpace: it.dp ? 0.07 : 0.26, baseSpace: it.dp ? 0.02 : 0.09, fill: it.dp ? 0.86 : 0.84, thickShare: it.dp ? 0.3 : 0.34 });
    if (!L) continue;
    drawn++; ctx.font = NAME_FONT(it.dp, L.size);
    const glyphAt = (g) => { const c = Math.cos(g.a) * dpr, s = Math.sin(g.a) * dpr; ctx.setTransform(c, s, -s, c, g.x * dpr, g.y * dpr); };
    ctx.strokeStyle = th.halo; ctx.lineWidth = Math.max(1.6, L.size * (th.haloW || 0.1));
    for (const g of L.glyphs) { glyphAt(g); ctx.strokeText(g.ch, 0, 0); }
    ctx.fillStyle = th.name;
    for (const g of L.glyphs) { glyphAt(g); ctx.fillText(g.ch, 0, 0); }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  N.last = performance.now(); N.cost = N.last - t0;
}
/** the atlas's names: { items: [{ id, text, dp, sp: { pts, loc, thick } }], txt: { name, halo } } (or null) */
cm.setNames = (o) => {
  const items = [];
  for (const it of (o && o.items) || []) {
    const pts = it.sp && it.sp.pts; if (!pts || pts.length < 2) continue;
    const n = pts.length, dirs = new Float64Array(n * 3);
    for (let k = 0; k < n; k++) { const v = toDir(pts[k][0], pts[k][1]); dirs[k * 3] = v[0]; dirs[k * 3 + 1] = v[1]; dirs[k * 3 + 2] = v[2]; }
    items.push({ sp: it.sp, dp: it.dp || 0, chars: [...it.text], adv: null, dirs, n, len: it.sp.len || 0 });
  }
  items.sort((a, b) => a.dp - b.dp || b.len - a.len);                                   // countries first, the longest (largest) first: they win the cap
  N.items = items; N.txt = (o && o.txt) || null; scheduleNames(); return items.length;
};
cm.setShowNames = (on) => {
  on = !!on; if (on === N.show) { if (on) scheduleNames(); return; }
  N.show = on;
  if (on) { ensureNames(); scheduleNames(); } else { clearNames(); }
};
function wireNames() {
  import(new URL('../js/labelspine.js', import.meta.url).href).then((m) => { N.mod = m; scheduleNames(); }).catch((e) => console.warn('Cosmossi bridge: names not available', e));
  A.ctrl.addEventListener('change', scheduleNames);
  try { new ResizeObserver(scheduleNames).observe(A.canvas); } catch (_) { addEventListener('resize', scheduleNames); }
}

// ---------- layers and season: the atlas drives the globe's own tabs ----------
const click = (sel) => { const b = document.querySelector(sel); if (b) b.click(); return !!b; };
/** '' terrain · 'biome' satellite · 'koppen' · 'temperature' · 'precip' · 'wind' ... */
cm.setLayer = (id) => click(`#mapTabs [data-layer="${id}"]`) || click(`#climateTabs [data-layer="${id}"]`);
cm.setSeason = (s) => { const sel = document.getElementById('climateSeason'); if (sel && sel.value !== s && [...sel.options].some((o) => o.value === s)) { sel.value = s; sel.dispatchEvent(new Event('change')); } };

// ---------- exports ----------
cm.openExport = () => click('#exportBtn');
/** save what the globe shows now (with the countries) as a PNG */
cm.saveView = (name = 'cosmossi-globe') => {
  if (!A) return false;
  A.renderer.render(A.scene, A.state.mapMode ? A.mapCamera : A.camera);       // the buffer is only readable right after a render
  A.canvas.toBlob((blob) => { if (!blob) return; const a = document.createElement('a'); a.download = name + '.png'; a.href = URL.createObjectURL(blob); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
  return true;
};
/** paint the atlas's countries over a finished colour map (sRGB RGBA, equirectangular, centred on centreLon degrees) */
async function compositeCountries(res, centreLon) {
  if (!handlers.paint) return;
  const w = Math.min(res.W, 8192), src = handlers.paint(w, centreLon); if (!src) return;
  const sw = src.width, sh = src.height, sd = src.getContext('2d').getImageData(0, 0, sw, sh).data, out = res.data, W = res.W, H = res.H;
  const kx = sw / W, ky = sh / H;
  for (let y = 0; y < H; y++) {
    const sy = Math.min(sh - 1, (y * ky) | 0) * sw;
    for (let x = 0; x < W; x++) {
      const si = (sy + Math.min(sw - 1, (x * kx) | 0)) * 4, a = sd[si + 3]; if (!a) continue;
      const di = (y * W + x) * 4, k = a / 255, j = 1 - k;
      out[di] = sd[si] * k + out[di] * j; out[di + 1] = sd[si + 1] * k + out[di + 1] * j; out[di + 2] = sd[si + 2] * k + out[di + 2] * j;
    }
    if ((y & 255) === 255) await new Promise((r) => setTimeout(r, 0));          // let the page breathe on a big map
  }
}
cm.wrapAdapter = (ad) => {
  const produce = ad.produce;
  ad.produce = async function (rctx, job, progress) {
    const res = await produce.apply(this, arguments);
    try {
      if (cm.exportCountries && handlers.paint && job && job.variant === 'colour' && res && res.kind === 'rgba') {
        if (typeof progress === 'function') progress(1, 'adding the countries');
        await compositeCountries(res, (rctx && rctx.opts && rctx.opts.centerLon) || 0);
      }
    } catch (e) { console.warn('Cosmossi: countries not added to the export', e); }
    return res;
  };
  return ad;
};

// ---------- attach ----------
cm.ready = false;
cm.attach = (o) => {
  A = o; cm.internals = o;                       // the sun module (cosmossi-sun.js) reads the scene and state from here
  try { ensure(); wirePointer(); wireNames(); wireMapOverlay(); } catch (e) { console.warn('Cosmossi bridge: overlay not available', e); }
  cm.ready = true;
  try { G.dispatchEvent(new Event('cosmossi-ready')); } catch (_) {}
  if (G.parent && G.parent !== G) { try { G.parent.postMessage('cosmossi-globe-ready', location.origin); } catch (_) {} }
};

// ---------- the Atlas section of the sidebar ----------
function wireUi() {
  const $ = (id) => document.getElementById(id); if (!$('cmShow')) return;
  $('cmShow').addEventListener('change', (e) => cm.setShow(e.target.checked));
  $('cmAlpha').addEventListener('input', (e) => cm.setAlpha(+e.target.value / 100));
  $('cmExp').addEventListener('change', (e) => { cm.exportCountries = e.target.checked; });
  $('cmExport').addEventListener('click', () => cm.openExport());
  $('cmSave').addEventListener('click', () => cm.saveView());
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireUi); else wireUi();
