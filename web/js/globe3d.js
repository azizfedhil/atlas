// The 3D globe, docked beside the atlas. It is World Orogen's globe page (web/sim/) in an iframe of the same origin, and
// web/sim/cosmossi-bridge.js is the other end of every call here. What is joined:
//   countries     the atlas paints its countries into a picture; the globe wraps it round the planet (shader, one texture lookup)
//   selection     select a country in the atlas and it lights on the globe; click one on the globe and the atlas selects it
//   view          turning the globe turns the atlas to the same place and the other way round (switch: "Follow atlas view"; off by default, never saved)
//   climate       the atlas's Climate layer and month become the globe's layer and season
//   exports       the globe's map export paints the countries into its colour maps; "Save view" gives a picture of the globe
// Modes: closed / split (beside the atlas, the divider drags) / full (the old full-window globe; Esc or the button returns).
// The iframe is created on first use and kept alive when closed, so reopening is instant and keeps its state.
const $ = (s) => document.querySelector(s);
const WIDTH_KEY = 'cosmossi.globeDock';
const COUNTRIES_KEY = 'cosmossi.globeCountries';
const NAMES_KEY = 'cosmossi.globeNames';
const lonDiff = (a, b) => ((a - b + 540) % 360) - 180;

export function createGlobe3d(host) {
  let box = null, frame = null, mode = 'closed', bridge = null, ready = false, linked = false, lastActive = false;   // "Follow atlas view" starts off every session and is never remembered
  let dock = 0.46, lastSig = '', selDirty = true, climDirty = true, paintTimer = 0, selTimer = 0, lastPaintMs = 0;
  let lastKey = '', echoUntil = 0, atlasHoldUntil = 0, unsub = null, showCountries = true, showNames = false, namesSig = '';
  try { const w = parseFloat(localStorage.getItem(WIDTH_KEY)); if (w > 0.2 && w < 0.8) dock = w; } catch (_) { /* the default */ }
  try { showCountries = localStorage.getItem(COUNTRIES_KEY) !== '0'; } catch (_) { /* shown */ }
  try { showNames = localStorage.getItem(NAMES_KEY) === '1'; } catch (_) { /* hidden */ }
  const open = () => mode !== 'closed';
  const dockPx = () => Math.round(Math.max(360, Math.min(innerWidth - 380, innerWidth * dock)));

  // ---------- the box ----------
  function build() {
    box = document.createElement('div');
    box.id = 'globeBox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', '3D globe');
    const split = document.createElement('div'); split.className = 'gb-split'; split.title = 'Drag to resize';
    const bar = document.createElement('div'); bar.className = 'gb-bar';
    const title = document.createElement('span'); title.className = 'gb-title'; title.textContent = '3D globe';
    const link = document.createElement('label'); link.className = 'gb-link'; link.title = 'Turning one view turns the other';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = linked;
    link.append(cb, document.createTextNode(' Follow atlas view'));
    cb.addEventListener('change', () => { linked = cb.checked; if (linked) { lastKey = ''; viewTick(true); } });
    const cLink = document.createElement('label'); cLink.className = 'gb-link'; cLink.title = 'Show or hide the countries on the globe';
    const cCb = document.createElement('input'); cCb.type = 'checkbox'; cCb.checked = showCountries;
    cLink.append(cCb, document.createTextNode(' Countries'));
    cCb.addEventListener('change', () => {
      showCountries = cCb.checked;
      try { localStorage.setItem(COUNTRIES_KEY, showCountries ? '1' : '0'); } catch (_) { /* not remembered */ }
      if (bridge) bridge.setShow(showCountries);
    });
    const nLink = document.createElement('label'); nLink.className = 'gb-link'; nLink.title = 'Show or hide the country names on the globe';
    const nCb = document.createElement('input'); nCb.type = 'checkbox'; nCb.checked = showNames;
    nLink.append(nCb, document.createTextNode(' Names'));
    nCb.addEventListener('change', () => {
      showNames = nCb.checked;
      try { localStorage.setItem(NAMES_KEY, showNames ? '1' : '0'); } catch (_) { /* not remembered */ }
      pushNames();
    });
    const spacer = document.createElement('i'); spacer.className = 'gb-spacer';
    const btn = (label, tip, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.title = tip; b.addEventListener('click', fn); return b; };
    const full = btn('\u2922', 'Fill the window (Esc to come back)', () => setMode(mode === 'full' ? 'split' : 'full'));
    full.className = 'gb-full';
    bar.append(title, link, cLink, nLink, spacer,
      btn('Export map\u2026', 'Export the globe\u2019s maps, with your countries', () => bridge && bridge.openExport()),
      btn('Save view', 'Save what the globe shows as a PNG', () => { if (bridge) bridge.saveView('cosmossi-globe-view'); }),
      full, btn('\u2715', 'Close the globe', () => setMode('closed')));
    frame = document.createElement('iframe');
    frame.title = 'Cosmossi 3D globe'; frame.src = 'sim/index.html?dock=1';
    frame.addEventListener('load', () => { ready = false; bridge = null; });
    box.append(split, bar, frame);
    document.documentElement.appendChild(box);      // outside <body>: the docked atlas is a transformed box and would clip it
    // the divider: the atlas follows on every animation frame; the globe page re-renders on every resize, so it is frozen while dragging
    split.addEventListener('pointerdown', (e) => {
      if (mode !== 'split') return;
      split.setPointerCapture(e.pointerId); frame.style.pointerEvents = 'none'; box.classList.add('resizing'); e.preventDefault();
      let raf = 0;
      const move = (ev) => {
        dock = Math.max(0.25, Math.min(0.75, (innerWidth - ev.clientX) / innerWidth));
        box.style.setProperty('--dock', dockPx() + 'px');
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; host.setDock(dockPx()); });
      };
      const up = () => {
        split.removeEventListener('pointermove', move); split.removeEventListener('pointerup', up); split.removeEventListener('pointercancel', up);
        frame.style.pointerEvents = ''; box.classList.remove('resizing'); host.setDock(dockPx());
        try { localStorage.setItem(WIDTH_KEY, String(dock)); } catch (_) { /* not remembered */ }
      };
      split.addEventListener('pointermove', move); split.addEventListener('pointerup', up); split.addEventListener('pointercancel', up);
    });
  }

  function setMode(m) {
    if (m !== 'closed' && !box) build();
    if (m === mode || !box) return;
    mode = m;
    box.hidden = m === 'closed';
    box.classList.toggle('full', m === 'full');
    box.style.setProperty('--dock', dockPx() + 'px');
    host.setDock(m === 'closed' ? 0 : dockPx());                  // full: the atlas keeps its width underneath, so coming back costs nothing
    const b = $('#globeBtn'); if (b) b.textContent = m === 'closed' ? 'Open 3D globe' : 'Close 3D globe';
    const t = $('#tbGlobe'); if (t) t.classList.toggle('on', m !== 'closed');
    if (m !== 'closed') { sync(); if (m === 'full') frame.focus(); }
  }

  // ---------- the bridge ----------
  function connect() {
    let b = null;
    try { b = frame.contentWindow.__cosmossi; } catch (_) { b = null; }
    if (!b || !b.ready) return false;
    bridge = b; ready = true; lastSig = ''; selDirty = climDirty = true; lastKey = ''; lastActive = false;
    bridge.setHandlers({
      hit: (lon, lat) => (showCountries ? host.hit(lon, lat) : null),                 // hidden countries give no tooltip and cannot be clicked
      pick: (lon, lat) => { if (lon == null || !showCountries) return; const h = host.hit(lon, lat); if (h) host.select(h.id); },
      paint: (w, lon0) => host.paint(w, { lon0 }),
      view: onGlobeView,
    });
    bridge.setShow(showCountries); namesSig = '';
    sync();
    return true;
  }
  const poll = setInterval(() => { if (box && frame && !ready) connect(); }, 400);
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    if (e.data === 'cosmossi-globe-ready') connect();
    else if (e.data === 'cosmossi-globe-close' && mode === 'full') setMode('split');
  });

  /** bring the globe up to date with whatever changed while it was closed or loading */
  function sync() {
    if (!open() || !ready) return;
    paintOverlay();
    if (selDirty) paintSelection();
    pushNames();
    if (climDirty) applyClimate();
    if (linked) { lastKey = ''; viewTick(true); }
  }

  // ---------- countries ----------
  function paintOverlay() {
    if (!ready || !open()) return;
    const sig = host.signature(); if (sig === lastSig) return;                   // nothing the globe shows has changed
    lastSig = sig; selDirty = true; const t0 = performance.now();
    try { bridge.setOverlay(host.paint(4096)); } catch (e) { console.warn('globe overlay failed', e); lastSig = ''; }
    lastPaintMs = performance.now() - t0;
  }
  /** the atlas's content changed (a border, a colour, the timeline, the coast ...): repaint a moment after it stops changing */
  function contentChanged() {
    if (!open() || !ready) return;
    clearTimeout(paintTimer); paintTimer = setTimeout(() => { paintOverlay(); if (selDirty) paintSelection(); pushNames(); }, Math.max(350, lastPaintMs * 3));
  }
  /** the names: sent to the globe only while they are on, and only when their text / shape / level changed (the globe lays them out itself, once per camera move) */
  function pushNames() {
    if (!ready || !bridge || !bridge.setNames) return;
    if (!showNames || !open()) { bridge.setShowNames(false); return; }
    try {
      const sig = host.namesSignature();
      if (sig !== namesSig) { namesSig = sig; bridge.setNames(host.names()); }
      bridge.setShowNames(true);
    } catch (e) { console.warn('globe names failed', e); namesSig = ''; }
  }
  function paintSelection() {
    selDirty = false; if (!ready || !open()) return;
    try {
      const f = host.selected();
      bridge.setSelection(f && (f.kind === 'country' || f.kind === 'subdivision') ? host.paint(2048, { solo: host.group(f) }) : null);
    } catch (e) { console.warn('globe selection failed', e); }
  }
  function selectionChanged() {
    selDirty = true; if (!open() || !ready) return;
    clearTimeout(selTimer); selTimer = setTimeout(paintSelection, 40);          // not inside the editor's own call
  }

  // ---------- climate ----------
  function applyClimate() {
    climDirty = false; const c = host.climate(); if (!c || !ready) return;
    const g = c.globeState();
    if (g.active) { bridge.setLayer(g.layer); bridge.setSeason(g.season); }
    else if (lastActive) bridge.setLayer('');                                    // the atlas switched its climate off: the globe goes back to terrain
    lastActive = g.active;
  }

  // ---------- views ----------
  /** every atlas frame (cheap): when the centre of the atlas view moved, turn the globe there */
  function viewTick(force = false) {
    if (!ready || !linked || !open() || mode === 'full') return;
    if (!force && performance.now() < atlasHoldUntil) return;
    const c = host.center(); if (!c) return;
    const key = c.lon.toFixed(1) + ',' + c.lat.toFixed(1);
    if (key === lastKey) return; lastKey = key;
    echoUntil = performance.now() + 350;
    bridge.setCenter(c.lon, c.lat);
  }
  /** the globe was turned (at most every 100 ms): turn the atlas there */
  function onGlobeView(lon, lat) {
    if (!linked || performance.now() < echoUntil) return;
    const c = host.center();
    if (c && Math.abs(lonDiff(c.lon, lon)) < 0.3 && Math.abs(c.lat - lat) < 0.3) return;
    atlasHoldUntil = performance.now() + 400;                                    // the atlas moves because of the globe: do not bounce it back
    lastKey = lon.toFixed(1) + ',' + lat.toFixed(1);
    host.setCenter(lon, lat);
  }

  function wire() {
    const toggle = () => setMode(open() ? 'closed' : 'split');
    const b = $('#globeBtn'); if (b) b.addEventListener('click', toggle);
    const t = $('#tbGlobe'); if (t) t.addEventListener('click', toggle);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mode === 'full') { setMode('split'); e.preventDefault(); } });
    window.addEventListener('resize', () => { if (mode === 'split') { box.style.setProperty('--dock', dockPx() + 'px'); host.setDock(dockPx()); } });
    const c = host.climate(); if (c && c.onChange) unsub = c.onChange(() => { climDirty = true; if (open() && ready) applyClimate(); });
  }
  return { wire, contentChanged, selectionChanged, viewTick, open: (m = 'split') => setMode(m), close: () => setMode('closed'), get mode() { return mode; }, destroy() { clearInterval(poll); if (unsub) unsub(); } };
}
