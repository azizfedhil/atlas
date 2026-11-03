# Climate layer (World Orogen engine, 25.2° tilt)

The atlas can paint a simulated climate of the Cosmossi world over the map: **Climate** section in the side panel. See the panel's own controls; this page is for maintenance.

## What is shipped
| file | what |
|---|---|
| `web/js/climate.js` | panel section, month/calendar logic, legend, hover readout |
| `web/js/shaders.js`, `web/js/renderer.js` | the overlay (temperature / rainfall / Köppen / climate-adjusted biomes) drawn in the map shader |
| `web/tex/clim.png`, `clim_static.png`, `biome_final.png`, `web/data/climate.json` | baked climate (see `tools/bake_climate.py` header for the encoding) |
| `world/climate_src/` | inputs of the bake: final monthly climate, reconciled class map, Alduran profile, elevation |

## Changing Alduran's climate
Edit `world/climate_src/alduran_profile.json` (day high / night low for summer and winter, yearly rain, whether altitude cools it) - but note the profile is applied in the *reconcile* step. To apply a change: re-run the pipeline below from step 3 on (needs the simulation outputs), or - for small tweaks - ask for a re-bake.

## Full pipeline (needs the painted layers and a copy of the World Orogen repo; GPL-3.0)
1. `python tools/prep_world.py <painted-folder> <build>/world` - merges your painted biome layers, converts the heightmap.
2. `node tools/run_climate.mjs <world-orogen-repo> <hm.u8> 1024 512 25.2 <build>/sim/tilt25.2` - the simulator's climate engine, headless. **The tilt is the 25.2 here.**
3. `python -I tools/reconcile.py <build>` - folds Alduran in, applies the altitude rule, writes `climate_final_monthly.npz` and the class map.
4. copy those two results into `world/climate_src/`, then `python tools/bake_climate.py` - writes the textures the atlas reads.
(`bake_climate.py` itself only needs numpy, OpenCV, SciPy, Pillow and Node.)

## Notes
* The Month slider steps through the Cosmossi calendar's 15 months (`calendar.js`), with a 16th position for the whole year. The baked sheet itself still holds 12 equal slices of the year (tile 12 = annual); each Cosmossi month is placed at the middle of its days on that sheet and the shader blends the two nearest slices. Monthly rainfall is shown per Cosmossi month (a baked slice x 12/15), so the 15 months add up to the yearly total. A true 15-slice bake would mean re-running the pipeline below and widening the 4x4 sheet usage in `bake_climate.py`, `shaders.js` and `climate.js` (15 months + annual = 16 tiles, which fits exactly).
* Slice 0 of the baked sheet is the month after the northern winter solstice. The "Winter solstice on day" setting ties it to your calendar (default: 1 Çuanede).
* `tools/vendor/` holds World Orogen's Köppen rules and its GPL-3.0 licence. It is used only by the bake tool and is not loaded by the app.
* The painted biomes in `web/tex/biome.png` are untouched. "Biomes, climate-adjusted" is a separate overlay: your painting plus alpine tundra / ice where the simulated altitude and temperature call for it.

## The 3D globe (Climate panel > "Open 3D globe")
World Orogen's Import Heightmap page, bundled locally in `web/sim/` and opened in an overlay (`web/js/globe3d.js`). It runs the engine at 25.2 deg tilt on `web/sim/world/heightmap.png`, replaces the simulated months with the baked ones from `tex/clim.png`, and gives every land cell the Koppen class of your painted biome (`sim-src/js/cosmossi-world.js`). Hover shows the painted biome and Alduran's day/night temperatures.
Rebuild after editing `sim-src/`: `cd sim-src && npm install && npm run build`. Re-baking the climate (above) is picked up automatically, since the globe reads the atlas textures.
Licence: the globe contains World Orogen code (GPL-3.0, `web/sim/LICENSE-world-orogen-GPL3`); distributing the atlas with it means distributing under the GPL.
