// COSMOSSI sun: an optional day / night simulation for the 3D globe. A plain file (not part of the minified bundle), loaded
// by sim/index.html after cosmossi-bridge.js.
//   OFF (the default, and after switching off): nothing runs. No requestAnimationFrame callback exists, nothing was added to
//   the scene, and the globe's lights are exactly as scene.js made them (they are put back to the values saved when the
//   simulation was switched on).
//   ON: one requestAnimationFrame callback turns the scene's directional light around the planet and sets the ambient light,
//   so the night side is dark; one glowing billboard (the visible sun) is added to the scene; a floating card at the bottom
//   left holds the controls; a small marker at the screen's edge points at the sun while it is out of view or hidden behind
//   the planet. Switching off removes all of it again.
const G = globalThis;
const cm = (G.__cosmossi = G.__cosmossi || {});
const DEG = Math.PI / 180;
const TILT_DEG = 25.2;           // the Cosmossi axial tilt (docs/CLIMATE.md)
const SUN_INTENSITY_ON = 3.6;    // scene.js has 1.5 with an ambient of 3.5; with a lower ambient the sun has to carry the day side
const AMBIENT_MIN = 0.15;        // ambient at night darkness 100 %
const AMBIENT_SPAN = 1.2;        // ambient = AMBIENT_MIN + (1 - night) * AMBIENT_SPAN
const MAX_DT_MS = 100;           // a long pause (hidden tab) must not make the clock jump
const SUN_DIST = 90;             // the visible sun's distance from the planet's centre (the camera's far plane is 200, the stars sit at 40 to 70)
const SUN_SIZE = 40;             // side of the sun's square billboard, in world units; the glow fills it
const SUN_CORE = 0.16;           // radius of the bright disc as a fraction of half the billboard
const PLANET_R = 1.03;           // the planet's radius for the "is the sun behind it" test (scene.js: the sphere is 1, the relief a little more)

const S = {
  on: false, playing: true, hold: false, min: false,
  minutes: 720,                  // time of day, 0 .. 1440 (12:00 = the sun over longitude 0)
  season: 91 / 365,              // 0 .. 1, 0 = northern winter solstice; 91 days on is about the equinox
  daySeconds: 60,                // real seconds one day takes while playing
  advanceYear: false, night: 0.8,
  raf: 0, last: 0, shownKey: '',
  sun: null, amb: null, v: null, saved: null,
  disc: null, t1: null, t2: null, hud: null, ptr: null, arrow: null, ro: null, rect: null,
};
let A = null;                    // the globe page's internals (cm.internals), once attached
const $ = (id) => document.getElementById(id);
const pad2 = (n) => String(n).padStart(2, '0');

const declinationDeg = () => -TILT_DEG * Math.cos(2 * Math.PI * S.season);
const subsolarLonDeg = () => { const l = (12 - S.minutes / 60) * 15; return ((l + 180) % 360 + 360) % 360 - 180; };

function findLights() {
  let sun = null, amb = null;
  A.scene.traverse((o) => { if (o.isDirectionalLight && !sun) sun = o; if (o.isAmbientLight && !amb) amb = o; });
  return sun && amb ? { sun, amb } : null;
}

// ---------- the visible sun: one additive billboard far out along the light's direction ----------
const SUN_VERT = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const SUN_FRAG = [
  'uniform float uCore; varying vec2 vUv;',
  'void main() {',
  '  float d = length(vUv - 0.5) * 2.0;',
  '  if (d >= 1.0) discard;',
  '  float disc = 1.0 - smoothstep(uCore * 0.85, uCore, d);',
  '  float glow = exp(-d * 5.5) * 0.85 + pow(1.0 - d, 4.0) * 0.35;',
  '  vec3 col = vec3(1.0, 0.92, 0.75) * glow + vec3(1.0, 0.99, 0.94) * disc;',
  '  gl_FragColor = vec4(col, 1.0);',
  '}',
].join('\n');

/** The billboard, added to the scene (hidden until the first frame). Null if the page did not hand over the classes. */
function makeDisc() {
  if (!A.Mesh || !A.PlaneGeometry || !A.ShaderMaterial) return null;
  const mat = new A.ShaderMaterial({
    uniforms: { uCore: { value: SUN_CORE } }, vertexShader: SUN_VERT, fragmentShader: SUN_FRAG,
    transparent: true, depthWrite: false, blending: 2,                    // 2 = THREE.AdditiveBlending; the depth test stays on, so the planet hides the sun when it is in front of it
  });
  const m = new A.Mesh(new A.PlaneGeometry(SUN_SIZE, SUN_SIZE), mat);
  m.frustumCulled = false; m.visible = false;
  A.scene.add(m);
  return m;
}
function dropDisc() {
  const m = S.disc; if (!m) return;
  A.scene.remove(m); m.geometry.dispose(); m.material.dispose(); S.disc = null;
}

function applyLighting() {
  const decl = declinationDeg() * DEG, lon = subsolarLonDeg() * DEG, cd = Math.cos(decl);
  S.v.set(cd * Math.sin(lon), Math.sin(decl), cd * Math.cos(lon));       // the planet's own axes: lon = atan2(x, z), lat = asin(y)
  const pm = A.state.planetMesh;                                          // read every frame: it is replaced when the planet is regenerated
  if (pm) S.v.applyQuaternion(pm.quaternion);                             // the planet's turn (Auto-Rotate): the sun stays right over the same lon / lat
  S.sun.position.copy(S.v).multiplyScalar(S.saved.dist);                  // a DirectionalLight only uses the direction (its target is the origin)
  S.sun.intensity = SUN_INTENSITY_ON;
  S.amb.intensity = AMBIENT_MIN + (1 - S.night) * AMBIENT_SPAN;
  if (S.disc) {                                                           // the visible sun sits on the same line, far out, facing the camera
    S.disc.position.copy(S.v).multiplyScalar(SUN_DIST);
    S.disc.quaternion.copy(A.camera.quaternion);
    S.disc.visible = true;
  }
}

// ---------- the marker for a sun that is out of view or behind the planet ----------
/** Put the marker at (x, y) pixels; `ang` turns its arrow; `behind` shows the dim ring (no arrow) instead. */
function placeMarker(x, y, ang, behind) {
  S.ptr.hidden = false;
  S.ptr.classList.toggle('behind', behind);
  S.ptr.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
  S.arrow.style.transform = 'rotate(' + ang.toFixed(3) + 'rad)';
}
function updateMarker() {
  const d = S.disc; if (!d || !S.ptr) return;
  const cam = A.camera, R = S.rect, w = innerWidth, h = innerHeight;
  const cx = (R.l + R.r) / 2, cy = (R.t + R.b) / 2;
  S.t1.copy(d.position).applyMatrix4(cam.matrixWorldInverse);            // the sun in the camera's own axes: x right, y up, the camera looks down -z
  const front = S.t1.z < 0;
  let dx = S.t1.x, dy = S.t1.y, sx = 0, sy = 0, inside = false;
  if (front) {
    S.t2.copy(d.position).project(cam);                                   // -1 .. 1 across the screen, y up
    sx = (S.t2.x + 1) / 2 * w; sy = (1 - S.t2.y) / 2 * h;                 // pixels, y down
    dx = sx - cx; dy = cy - sy;                                           // from the middle of the free area, y up
    inside = sx >= R.l && sx <= R.r && sy >= R.t && sy <= R.b;
  }
  if (inside) {
    // in view: the sun itself is drawn; a marker is only needed if the planet is in the way (ray from the camera to the sun against the planet's sphere)
    const c = cam.position, rx = d.position.x - c.x, ry = d.position.y - c.y, rz = d.position.z - c.z, len = Math.hypot(rx, ry, rz) || 1;
    const b = (c.x * rx + c.y * ry + c.z * rz) / len, disc = b * b - (c.x * c.x + c.y * c.y + c.z * c.z - PLANET_R * PLANET_R);
    if (disc > 0 && -b - Math.sqrt(disc) > 0) placeMarker(sx, sy, 0, true); else S.ptr.hidden = true;
    return;
  }
  const m = Math.hypot(dx, dy);
  if (m < 1e-6) { dx = 0; dy = -1; } else { dx /= m; dy /= m; }          // straight behind the camera: point down
  const hw = (R.r - R.l) / 2, hh = (R.b - R.t) / 2;
  const k = Math.min(Math.abs(dx) > 1e-6 ? hw / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-6 ? hh / Math.abs(dy) : Infinity);
  placeMarker(cx + dx * k, cy - dy * k, Math.atan2(-dy, dx), false);
}

// ---------- the floating card: where it sits, and the free area the marker may use ----------
/** Called when the window or the sidebar changes size, and when the simulation is switched on. */
function layout() {
  const hud = S.hud; if (!hud) return;
  const narrow = matchMedia('(max-width: 768px)').matches, ui = $('ui');
  let l = 28, t = 64, r = innerWidth - 28, b = innerHeight - 28;
  hud.style.removeProperty('--cm-hud-left');
  if (narrow) b = innerHeight - 96;                                       // a phone: above the bottom sheet's handle
  else if (ui) {
    const u = ui.getBoundingClientRect(), hr = hud.getBoundingClientRect();
    l = Math.max(l, u.right + 16);                                        // the marker stays clear of the sidebar
    if (u.bottom > hr.top && u.right + 12 + hr.width <= innerWidth - 8) hud.style.setProperty('--cm-hud-left', Math.round(u.right + 12) + 'px');   // an open sidebar reaches the card's corner: the card moves to its right
  }
  if (r - l < 80 || b - t < 80) { l = 28; t = 64; r = innerWidth - 28; b = innerHeight - 28; }
  S.rect = { l, t, r, b };
}

function updateUi() {
  const m = Math.floor(S.minutes) % 1440, day = Math.floor(S.season * 365 + 1e-9) % 365;   // 1e-9: 91 / 365 * 365 can land just under 91
  const lat = declinationDeg(), lon = subsolarLonDeg();
  const key = m + '|' + day + '|' + Math.round(lat * 10) + '|' + Math.round(lon);
  if (key === S.shownKey) return;                                         // touch the DOM only when something visible changed
  S.shownKey = key;
  $('cmSunTimeVal').textContent = pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
  $('cmSunSeasonVal').textContent = 'day ' + (day + 1);
  $('cmSunReadout').textContent = 'Sun overhead at ' + Math.abs(lat).toFixed(1) + '°' + (lat >= 0 ? 'N' : 'S') + ', ' + Math.abs(lon).toFixed(0) + '°' + (lon >= 0 ? 'E' : 'W');
  if (S.playing && !S.hold) $('cmSunTime').value = String(m);
  if (S.advanceYear && !S.hold) $('cmSunSeason').value = String(day);
}

function tick(now) {
  S.raf = requestAnimationFrame(tick);
  const dt = Math.min(MAX_DT_MS, Math.max(0, now - S.last)); S.last = now;
  if (A.state.mapMode) {                                                  // the flat map view is not lit: keep the loop alive, show nothing
    if (S.disc) S.disc.visible = false;
    if (S.ptr) S.ptr.hidden = true;
    return;
  }
  if (S.playing && !S.hold) {                                             // (while a slider is held the clock waits)
    const dMin = dt / 1000 / S.daySeconds * 1440;
    S.minutes = (S.minutes + dMin) % 1440;
    if (S.advanceYear) S.season = (S.season + dMin / 1440 / 365) % 1;
  }
  applyLighting();
  updateMarker();
  updateUi();
}

/** Switch on. Returns false (and changes nothing) if the globe is not ready or has no sun / ambient light. */
function enable() {
  if (S.on) return true;
  if (!A) return false;
  const L = findLights(); if (!L) return false;
  S.sun = L.sun; S.amb = L.amb;
  S.saved = { pos: L.sun.position.clone(), dist: L.sun.position.length(), sunI: L.sun.intensity, ambI: L.amb.intensity };
  S.v = L.sun.position.clone();                                           // Vector3s made from the light's own class, so no THREE import is needed
  S.t1 = L.sun.position.clone(); S.t2 = L.sun.position.clone();
  try { S.disc = makeDisc(); } catch (e) { S.disc = null; console.warn('Cosmossi sun: the visible sun is not available', e); }
  S.hud = $('cmSunHud'); S.ptr = $('cmSunPtr'); S.arrow = $('cmSunPtrDir');
  S.on = true; S.shownKey = ''; S.hold = false;
  S.hud.hidden = false;                                                   // visible first, so that layout() can measure it
  layout();
  if (typeof ResizeObserver !== 'undefined') { S.ro = new ResizeObserver(layout); const ui = $('ui'); if (ui) S.ro.observe(ui); S.ro.observe(S.hud); }
  addEventListener('resize', layout);
  S.last = performance.now();
  S.raf = requestAnimationFrame(tick);
  return true;
}

/** Switch off: stop the loop, take the visible sun and the card away, and put the lights back exactly as they were. */
function disable() {
  if (!S.on) return;
  cancelAnimationFrame(S.raf); S.raf = 0; S.on = false;
  S.sun.position.copy(S.saved.pos); S.sun.intensity = S.saved.sunI; S.amb.intensity = S.saved.ambI;
  dropDisc();
  if (S.ro) { S.ro.disconnect(); S.ro = null; }
  removeEventListener('resize', layout);
  S.hud.hidden = true; S.ptr.hidden = true;
  S.sun = S.amb = S.v = S.t1 = S.t2 = S.saved = S.rect = null;
}

// ---------- the sidebar switch and the floating card ----------
function syncUi() {
  $('cmSunOn').checked = S.on;
  $('cmSunHud').hidden = !S.on;
  $('cmSunHud').classList.toggle('min', S.min);
  $('cmSunMin').setAttribute('aria-expanded', S.min ? 'false' : 'true');
  $('cmSunPlay').textContent = S.playing ? 'Pause' : 'Play';
  $('cmSunNightVal').textContent = Math.round(S.night * 100) + '%';
}
function wireUi() {
  if (!$('cmSunOn') || !$('cmSunHud') || !$('cmSunPtr')) return;
  const noteText = $('cmSunNote') ? $('cmSunNote').textContent : '';      // the note as the page has it; restored after a successful switch-on
  const setOn = (want) => {
    if (want) {
      if (!enable() && $('cmSunNote')) $('cmSunNote').textContent = 'The globe is not ready yet. Try again in a moment.';
      else if ($('cmSunNote')) $('cmSunNote').textContent = noteText;
    } else disable();
    syncUi();                                                             // (also puts the switch right if switching on failed)
  };
  $('cmSunOn').addEventListener('change', (e) => setOn(e.target.checked));
  $('cmSunClose').addEventListener('click', () => setOn(false));
  $('cmSunMin').addEventListener('click', () => { S.min = !S.min; syncUi(); });
  $('cmSunPlay').addEventListener('click', () => { S.playing = !S.playing; syncUi(); });
  $('cmSunSpeed').addEventListener('change', (e) => { S.daySeconds = +e.target.value || 60; });
  $('cmSunTime').addEventListener('input', (e) => { S.minutes = +e.target.value; S.shownKey = ''; });
  $('cmSunSeason').addEventListener('input', (e) => { S.season = +e.target.value / 365; S.shownKey = ''; });
  $('cmSunYear').addEventListener('change', (e) => { S.advanceYear = e.target.checked; });
  $('cmSunNight').addEventListener('input', (e) => { S.night = +e.target.value / 100; syncUi(); });
  const hold = () => {                                                    // a held slider stops the clock, so that the thumb is not pulled away from the hand
    S.hold = true;
    const up = () => { S.hold = false; removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
  };
  $('cmSunTime').addEventListener('pointerdown', hold);
  $('cmSunSeason').addEventListener('pointerdown', hold);
  syncUi();
}

// ---------- start-up: wait for the bridge to be attached ----------
const init = () => { A = cm.internals || null; };
if (cm.ready) init(); else G.addEventListener('cosmossi-ready', init, { once: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireUi); else wireUi();
