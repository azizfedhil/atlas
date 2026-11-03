# The 3D globe beside the atlas

Open it with the globe button in the toolbar (or Climate > Open 3D globe). It sits to the right of the atlas; drag the divider to resize, the arrow button in its bar fills the window (Esc comes back), the cross closes it. It keeps its state while closed.

## What is joined
| Atlas | Globe |
|---|---|
| Countries and subdivisions you draw (colours, borders, enclaves, the timeline slider, the "Countries & subdivisions" and "Country opacity" settings, the land clip) | Painted onto the planet. The atlas draws them into one 4096 x 2048 picture and the globe wraps it on with one texture lookup per pixel. It repaints about a third of a second after the last change, and only when something the globe shows changed (not for a selection, a tool or a measurement). |
| Selected country | Lit on the globe. Click a country on the globe and it is selected in the atlas. Hover shows its name. |
| View | Turn the globe and the atlas turns to the same place (a globe projection rotates, a flat map pans); the other way round too. It starts off: tick "Follow atlas view" in the globe's bar to join them. It is not remembered, so it is off again in the next session. |
| Climate layer and month | The globe's layer (temperature, rain, Köppen, biomes) and season (year, January, July). Switching the atlas's climate off sends the globe back to terrain. |

## Exporting a map from the globe
* **Export map...** (globe bar, or the Atlas section of its sidebar) opens the globe's own export: colour map, satellite, climate zones, plates, any projection and width. The colour maps get your countries painted in (same colours and borders as the atlas, painted at up to 8192 px wide and scaled above that). Untick "Put the countries in exported maps" in the globe's Atlas section to leave them out. Elevation, climate-number and other data maps never get countries.
* **Save view** saves what the globe shows right now (with the countries) as a PNG.

## Performance
* The atlas paints its countries once per change, not per frame. The globe's per-frame cost is two texture reads per land pixel while the overlay is on; no CPU work.
* While you drag the divider the globe page is frozen (it re-renders on every resize); the atlas follows once per animation frame.
* Painting the overlay re-projects the countries in the atlas's cache once, so the next atlas frame after a repaint can take a few tens of ms more than usual. It happens only after edits.
* The overlay is drawn on the globe view. On the globe page's flat map view the countries are not drawn, but they are still in exported maps.
* The sun / day-night simulation is off by default and costs nothing while off: no animation-frame callback exists, nothing is added to the scene and the lights are untouched. While on it runs one small callback per frame that moves one light, sets another's intensity and places one glow billboard (the planet's own materials and shaders are not touched).

## Sun (day / night)
Globe sidebar > **Sun (day / night)** > "Simulate day and night" (off by default, not remembered between sessions). While it is on, a card with the controls floats at the bottom left of the globe (it moves to the right of the sidebar when the open sidebar would cover it; the minus button folds it, the x button switches the simulation off). The sun goes round the planet (at 12:00 it is over longitude 0 and moves west), at a latitude that follows the 25.2 deg tilt through the year: Season counts days from the northern winter solstice, and "Seasons advance with the days" runs the year (365 days) as the days pass. "Day lasts" sets the speed, Time scrubs the clock (the clock waits while a slider is held), Night sets how dark the unlit side is. The sun is drawn as a glowing disc in the sky, on the line the light comes from, so you can find it while you turn the globe; when it is out of view a small sun with an arrow sits at the edge of the screen pointing toward it, and when the planet hides it a dim dashed ring marks where it is. It lights the Terrain and Satellite views; the Climate, Koppen and Heightmap layers are drawn in flat legend colours and do not change. "Save this view" includes the sun's glow while the simulation is on. Switching it off removes the sun and the card and puts the lights back exactly as they were. Code: `web/sim/cosmossi-sun.js` (source `sim-src/bridge/cosmossi-sun.js`); it reads the scene through `cm.internals` set in `cosmossi-bridge.js`, changes only the scene's directional light position and intensity and the ambient light intensity, and adds one billboard to the scene (removed again when switched off). Tuning constants are at the top of the file.

## For developers
The globe's own page is unchanged except for three one-line hooks (`globalThis.__cosmossi?...` in `planet-mesh.js`, `export-generate.js`, `import-main.js`). Everything else is `web/sim/cosmossi-bridge.js`. `npm run build` in `sim-src/` regenerates the bundle with the hooks from source; `node sim-src/bridge/patch-bundle.mjs` adds them to the shipped bundle if you replace it by hand. The sun simulation is a second plain file, `cosmossi-sun.js`, loaded the same way; it needs no change to the bundle. The sidebar has a fixed width on wide windows (the last rules of `sim-src/styles.css`); before, the long hint texts made it as wide as their longest line.
