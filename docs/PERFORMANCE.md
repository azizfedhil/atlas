# Performance notes

## The two overlay layers
The vector overlay (`web/js/overlay.js`) keeps a cached BASE picture (graticule, coast, rivers, area fills, names, cities) and redraws a cheap TOP layer (selection, handles, brush) every frame. While a flat map is dragged or zoomed, the base is shown from a **pan bitmap** painted with a margin and shifted / scaled to the view; when the view leaves the margin a new one is painted.

## Pan bitmap
* Margin: 32 % of each axis. Resolution: at most 0.75 px per css px, lower on very large windows so the bitmap stays near 3 Mpx (floor 0.4).
* Rebuilds are spaced by their measured cost (time to the next frame), at least 200 ms (350 ms while a zoom eases), at most 900 ms.

## Name pictures (`web/js/namesprites.js`)
Each country / range / subdivision name is laid out and painted once per zoom bucket (steps of 2^(1/8)) into a small canvas, and a pan-bitmap rebuild only places it. The cache is an LRU with a 12 Mpx budget; entries are keyed by feature id, shape revision, text, theme and device scale. While the view moves, at most 12 ms per rebuild goes to making new pictures; names not ready yet use the nearest cached size or appear on the next rebuild / the crisp repaint. The idle pre-build has no limit. The crisp repaint at rest and exports still draw names directly (full quality).

## Coast / rivers
Flat maps thin the vector coast and rivers to about 0.6 px (`lodEps`, quantised to half octaves); the projected points are cached per projection and centre. `visibleRings` reuses its combined path while the same rings are visible.

## Editor
City lists are sorted once per content version; label collisions use a grid; hit tests reject by cached bounds first; an exact repaint of an unchanged view reuses each name's layout.

## Reading an F4 log
Press F4, use the app, press F4 again, paste the report. The "pan-rebuild breakdown" table gives mean / max ms per stage: `grat`, `base`, `polys`, `names`, `rest` are CPU; `fg` (graticule), `fc` (coast + rivers) and `flush` (everything else) are the raster work forced after each stage; `spH` / `spB` / `spL` count name pictures reused / built / left for later.

## Deeper zoom (up to 256x) and name styling
* The zoom range is `0.6x .. 256x` of the fitted world (`ZOOM_MIN_REL` / `ZOOM_MAX_REL` in `web/js/app.js`). Past about 40x only vector layers gain detail; the land texture is magnified.
* The coast level-of-detail tolerance has a floor (`LOD_FLOOR` in `web/js/overlay.js`): once it is below the data's point spacing nothing is dropped, so zooming deeper no longer rebuilds identical paths.
* Border colours are cached per country colour and theme (`borderOf` in `editor.js`) instead of being built as a string for every country on every repaint.
* Name layout changes (gentler axis, calm centre line, steady glyph angles) only run when a layout is made (once per zoom bucket and name, cached); painting and the sprite cache are unchanged.

## Bottom bar (merge animation)
* One `#botbar` grid holds the scale bar, the history bar and the readout. Opening animates one `grid-template-rows` change (`0fr` to `1fr`) on that small box plus `opacity` / `transform` fades. The box has `container-type: inline-size`, which also contains its layout, so a frame never relayouts the map or the side panel.
* The box backgrounds are `::before` / `::after` plates faded with `opacity` (no animated shadows or colours). `backdrop-filter` is gone from these bars: the card colour is 93-94 % opaque, so the blur was nearly invisible and every animated frame would have had to redo it.
* While folded, `#tlBody` is `display:none` (set by `botbar.js` after the close animation), so the timeline strip's canvas is not measured or painted. Nothing runs per frame: one `MutationObserver` on `#timeline`'s class attribute, one 360 ms timer on close, one forced layout on open.
* The scale bar no longer writes `left` (the box positions it); it still writes only its bar width, and only when it changed. It has `min-width: 168px` so the neighbouring history bar does not jitter while zooming.
* Reduced motion, and the first two frames after boot, switch every transition off.

## Roads (see `docs/ROADS.md`)
Roads are drawn in the editor's base layer, so they live in the pan bitmap like everything else. Per tier: one cached array of `{ path, bb }` (rebuilt only when the projection, centre, features or visible set change), culled with `visibleRings()`, stroked twice (halo, line) through the unit-space transform. Tiers finer than the zoom allows are skipped entirely; while a globe turns only highways and national roads are drawn, without halo and at most 400 per tier. Open lines now carry projected bounds (`projRing`), which also speeds up picking and snapping. Undo history is capped by size (at least 20 steps, about 120 M characters).
