# Overlay: roads in five tiers (highway, national, regional, local, track)

New **Road** tool (toolbar, **O**; keys **1-5** pick the tier) and a **Roads** section in the side panel (master switch, a switch per tier, "Every tier at every zoom", search and list). Roads are open lines like rivers, drawn above rivers and below names with a halo and a colour per tier and theme; finer tiers appear as you zoom in (x1.25 national, x2.5 regional, x4.5 local, x8 track). Points snap to other roads (junctions), roads can be selected, edited, given an "Exists from / Until" and are part of PNG exports. Details in `docs/ROADS.md`.

**Not run, not tested** (as asked). Nothing was executed and no test was run. The new and patched JS files were only parse-checked (`node --check`), the edits were proofread by reading.

Saving: the Rust core is unchanged. A road is saved as a river whose `notes` start with a `[[road:<tier>]]` line and is turned back into a road when the file is opened (an older build shows them as rivers). Roads are not painted on the 3D globe.

Performance: per-tier cached path arrays, two strokes per drawn tier, zoom-gated tiers, a reduced road set while a globe is turned, projected bounds for open lines, a size cap on the undo history (details in `docs/PERFORMANCE.md`).

Patched: `web/js/editor.js`, `web/js/app.js`, `web/js/store.js`, `web/js/themes.js`, `web/index.html`, `web/css/app.css`, `docs/PERFORMANCE.md`, `OVERLAY-NOTES.md`
New: `web/js/roads.js`, `docs/ROADS.md`

---

# Overlay: one bottom bar (scale bar | history | readout), merged when expanded

The three bars at the bottom of the map are now one row. Folded (the ▾ button, or History switched off) they are three small bars and the history bar sits between the scale bar and the projection / coordinates bar. Expanded, they join into one box and the history controls grow upward out of the row. Expanding and folding are animated.

**Not run, not tested.** Nothing was executed. The files were edited and proofread by reading only. `tools/test_timeline_ui.mjs` was read but not run; it uses `#tlJump` and `#tlFilter`, which keep their ids and are visible in the default (expanded) state.

Layout (`index.html`, `app.css`, `botbar.css`, `app.js`):
- New `#botbar` grid holds `#scalebar`, `#timeline` (now `display: contents`) and `#hud`. The history header (`.tl-top`) is the middle bar; the transport, strip and tools line live in a new expandable part (`#tlBody`) above the row.
- Filter by lifespan, the era menu, the date jump box and Today moved from the header into the tools line, so the header stays narrow. Ids are unchanged.
- The scale bar is no longer positioned by JS (`style.left` is gone); it has a minimum width so it does not jitter while zooming.
- In a narrow box (small window, docked 3D globe) the readout drops its projection tag and backend pill first, then the projection name (container queries).
- The F3 readout moved up so it no longer covers the bar.

Motion (`botbar.js`, `botbar.css`):
- `botbar.js` watches the `min` / `paused` classes on `#timeline` with one MutationObserver and sets `#botbar[data-open]`.
- Opening animates one `grid-template-rows` change plus opacity / transform fades; the card look is a pseudo-element plate that cross-fades with opacity only. No `backdrop-filter`, no `will-change`, nothing runs per frame.
- While folded the expandable part is `display: none`, so the timeline strip does not measure or paint. Transitions are off for the first two frames after boot and under `prefers-reduced-motion`.

Known limits: with the climate layer on, a long coordinate readout is cut with an ellipsis at 340 px. The tools line wraps onto two lines in a narrow window. With the scale bar hidden (some globe views) the history bar starts 8 px in.

Patched: web/index.html, web/css/app.css, web/css/timeline.css, web/js/app.js
New: web/js/botbar.js, web/css/botbar.css
Docs: docs/PERFORMANCE.md, docs/TIMELINE.md, OVERLAY-NOTES.md

---
# Overlay: Oceanic (Cfb/Cfc) extended into the new areas

The painted Oceanic biome now covers the new areas from `Oceanic Cfb Cfc.png` and overrides whatever painted biome was there before (land cells only; it only adds to Oceanic, never removes). About 38,000 land cells (3087x1554 grid) changed class, mostly from humid subtropical, hot-summer continental and humid continental; Alduran was not touched.

**Not run, not tested** (as asked). The patch script itself was run once; its sanity check confirmed that rebuilding `biome_final.png` from the old class map reproduced the shipped file exactly, so only the new areas differ.

Patched: `world/climate_src/final_class_index.png`, `web/tex/biome_final.png`, `web/tex/clim_static.png` (G channel only), `web/data/climate.json` (painted `pctLand`).
New: `tools/oceanic_patch.py`, `world/climate_src/oceanic_mask_3087.png`.
Unchanged: simulated temperature / rain / Koppen (`clim.png`, R and B of `clim_static.png`), `biome.png`, code.

---
# Overlay: topographic layer (the 3D globe's heightmap, in the 2D atlas)

New **Topography** section in the side panel (after Climate): switch on "Topographic layer" and the land is drawn from the heightmap the 3D globe uses. Elevation colours (with opacity and a legend), shaded relief lit from the north-west (Relief x1 to x40), and contour lines every 50 / 100 / 250 / 500 / 1000 m. Hovering shows the height in the status bar. It works in every projection, is part of PNG exports, can be combined with the climate layer (the relief then shades the climate colours), and is remembered between sessions. Details in `docs/TOPOGRAPHY.md`.

**Not tested** (as asked). The bake script was run once to make `web/tex/topo.png` (the decoded heights were checked against the globe's rule, and the shading maths was previewed in numpy on that texture). The JS files were only parse-checked, nothing in the app was run, and the GLSL was not compiled; it was proofread by reading only. `tools/test_*.mjs` were not run.

Known limits: the heightmap has no sea floor, so only land is painted. The layer does not follow land edited in the atlas. `tex/topo.png` is 5.2 MB and loads the first time the layer is switched on; the hover readout is ready a moment after that (it reads the heights back from the image).

Patched: `web/index.html`, `web/css/app.css`, `web/js/app.js`, `web/js/renderer.js`, `web/js/shaders.js`, `OVERLAY-NOTES.md`
New: `web/js/topo.js`, `web/tex/topo.png`, `tools/bake_topo.py`, `docs/TOPOGRAPHY.md`
