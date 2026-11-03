# Topographic layer

The 3D globe's heightmap (`web/sim/world/heightmap.png`) drawn on the atlas as a layer you can switch on: **Topography** section in the side panel.

## What you get
| control | what it does |
|---|---|
| Topographic layer | master switch (remembered between sessions). Loads `tex/topo.png` the first time it is switched on |
| Elevation colours | land coloured by height, lowland green > yellow > brown > grey > white; opacity slider; the legend shows the ramp (0 to 6000 m) |
| Shaded relief | hillshade from the slope of the heightmap, lit from the north-west; **Relief** is the vertical exaggeration (x1 to x40, default x15). It also shades the biome and climate colours when the elevation colours are off |
| Contour lines | every 50 / 100 / 250 / 500 / 1000 m, every fifth line stronger. Lines fade out where they would be closer than a few pixels (steep ground or zoomed far out) and are left out on dead-flat ground |
| Hover | the status bar shows the height under the cursor (`elev. 1230 m`, rounded to 5 m) |

It works in every projection (the shader reads the heightmap per pixel, like the biome and climate layers) and is part of PNG exports. It only paints land; the heightmap has no sea floor. Rivers, the ink coast and countries stay on top.

## Where the heights come from
The globe imports the heightmap with its own rule: grey 0 = sea, grey 1..255 = land with `e = sqrt((grey - 1) / 254)`, and then maps `e` to kilometres with `elevToHeightKm` (0 .. 6 km; `sim-src/js/color-map.js`). `tools/bake_topo.py` applies exactly that and writes `web/tex/topo.png` (4096 x 2048 RGB):

* R, G: land height, 16 bit (`(R * 256 + G) / 65535 * 6 km`). 16 bits and a 1 px blur are used instead of the 8-bit grey so that shaded relief and contours do not show the 8-bit steps (about 15 m in the lowlands) when zoomed in.
* B: 255 on land of the heightmap, 0 at sea (used by the hover readout).
* The land height is carried 6 px out over the sea, so the coast does not fade when the atlas coast is a pixel off the heightmap's.

After replacing `web/sim/world/heightmap.png`, run `python tools/bake_topo.py` (needs numpy, SciPy and Pillow) to refresh the layer; the 3D globe picks up the new heightmap by itself.

## Notes
* The relief shading uses an Earth-sized reference sphere (6371 km) for the slope, whatever planet radius is set in the atlas, so it looks the same on every planet; use **Relief** to taste.
* The layer does not follow land you edit in the atlas (the heightmap is not edited); edited land outside the original land shows the nearest carried height or, farther out, sea level.
* Code: `web/js/topo.js` (panel, loading, legend, hover), `web/js/shaders.js` (the `topographic layer` block and `topoH` / `rampTopo`), `web/js/renderer.js` (`setTopo`, texture unit 6, `uTopo*` uniforms). Nothing is written to the project file.
