# What changed in this copy of the atlas
New: Climate layer (panel section "Climate"), `web/js/climate.js`, climate textures/data, bake and pipeline tools, `docs/CLIMATE.md`.
Edited: `web/index.html` (the section), `web/css/app.css` (legend styles), `web/js/app.js` (4 small hooks), `web/js/renderer.js` (3 texture units + draw uniforms), `web/js/shaders.js` (the overlay).
Unchanged: land, coast, rivers, biome.png, projections, editor, timeline, save format, Rust core, security policy.

## 3D globe (step 8-10)
New: `web/sim/` (bundled globe), `sim-src/` (its source + build), `web/js/globe3d.js`, launcher (`Launch Atlas.bat`, `launch-atlas.sh`, `tools/serve.mjs`, `docs/LAUNCHING.md`).
Edited: `web/index.html` (button), `web/css/app.css` (overlay), `web/js/app.js` (2 lines), `src-tauri/tauri.conf.json` (frame-src 'self', frame-ancestors 'self').

## Own window (step 11)
New: `web/js/alive.js` (tells the launcher a window is open), `web/icon.png`, `Launch Atlas (no console).vbs`, `tools/make-shortcut.ps1`.
Edited: `tools/serve.mjs` (opens an Edge/Chrome app window, stops when it closes), `Launch Atlas.bat`, `launch-atlas.sh`, `docs/LAUNCHING.md`, `web/index.html` (icon + alive.js), `web/sim/index.html` + `sim-src/index.html` (icon).

## Globe integration (step 2)
New: `sim-src/bridge/cosmossi-bridge.js` (copied to `web/sim/`, the globe's end of the link), `sim-src/bridge/patch-bundle.mjs` (adds the three hooks to the prebuilt `web/sim/import-main.js`), `docs/GLOBE.md`.
Rewritten: `web/js/globe3d.js` (the globe now docks beside the atlas instead of covering it).
Edited: `web/js/app.js` (`globeHost()`, dock width in `resize()`, 4 small hooks), `web/js/editor.js` (1 line: `areasOnly` paints only fills + borders), `web/js/climate.js` (`onChange`, `globeState`), `web/index.html` (toolbar button), `web/css/app.css` (dock), `web/sim/index.html` + `sim-src/index.html` (Atlas section, bridge script), `sim-src/styles.css`, `sim-src/build.mjs`, and in `sim-src/js/`: `planet-mesh.js`, `export-generate.js`, `import-main.js` (one hook line each; the prebuilt bundle got the same three through `patch-bundle.mjs`).

## Sun / day-night (3D globe)
New: `sim-src/bridge/cosmossi-sun.js` (copied to `web/sim/`; off by default, no cost while off).
Edited: `sim-src/bridge/cosmossi-bridge.js` (1 line: `cm.internals = o`), `sim-src/index.html` (sidebar section + script tag), `sim-src/styles.css`, `sim-src/build.mjs` (copies the new file), and the `web/sim/` copies of the three first files. The bundle `web/sim/import-main.js` is unchanged.

## Sun / day-night, second pass (3D globe)
Edited: `sim-src/bridge/cosmossi-sun.js` (rewritten: the controls moved to a floating card at the bottom left, one glow billboard is the visible sun, a marker at the screen's edge points at it), `sim-src/index.html` (the sidebar section is now the switch and a note; the card and the marker are new markup), `sim-src/styles.css` (card, marker, and a fixed width for the sidebar on wide windows), and the `web/sim/` copies of those three files. The bundle `web/sim/import-main.js` is still untouched.

## Alduran hyper-desert: seasons, figures and blend
Bug: the Alduran season curve was written upside down (`0.5 - 0.5*cos`), so it was hottest in January and coolest in July. The same sign was in `climate.js` `seasonAt`, which also picks January / July for the 3D globe from the atlas month.
Fixed: the curve now peaks at month 6 (July). New figures in `world/climate_src/alduran_profile.json`: summer days 51-55 (spikes 60), nights 15-20; winter days 41-45, nights 12-17 (the single numbers are the middles of those ranges; the map shows the monthly mean of day and night, the hover shows the day / night ranges).
Blend: the hand-set climate now fades in from the border of the hyper-desert (0 on the border, 1 from `blend_cells` = 8 cells inward) instead of switching on at full strength. Rain is blended in log space. Nothing outside the hyper-desert footprint was written: every other cell of `climate_final_monthly.npz`, `clim.png`, `clim_static.png` and `climate.json` is as it was. (The old 3-cell warm spill just outside the border is left as it was, as asked; a full `reconcile.py` re-run no longer creates it.)
New: `tools/alduran_blend.py` (the curve and the blend), `tools/alduran_patch.py` (re-does only Alduran in the baked npz), `tools/run_climate_elev.mjs` (the engine, headless, from the elevation grid), `world/climate_src/alduran_overlay_1024.png` (your overlay, 1024x512).
Edited: `tools/reconcile.py` (uses alduran_blend), `tools/bake_climate.py` (tile 13 of the climate sheet = Alduran weight), `web/js/climate.js` (`seasonAt`, the Alduran hover text), `web/data/climate.json`, `web/tex/clim.png`, `web/tex/clim_static.png` (Koppen inside Alduran only), `world/climate_src/climate_final_monthly.npz`.
