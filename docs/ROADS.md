# Roads

Draw roads in five tiers and see them scale with the zoom: **Highway, National road, Regional road, Local road, Track / trail**.

## Using it
| | |
|---|---|
| Road tool | toolbar button, or **O**. Click along the road (Shift+drag for a curve), Enter or double-click to finish. |
| Tier | the floating picker next to the toolbar, or keys **1-5** while the tool is on. New roads are named "Highway 1", "Local road 3", ... |
| Change a tier later | select the road, **Type** in the inspector. |
| Junctions | while drawing (or dragging a point of a road) points snap to other roads' points and lines; hold **Alt** to bypass. Roads also snap to country borders and coasts like every other tool. |
| Roads panel | side panel, **Roads**: master switch, one switch per tier, "Every tier at every zoom", a search box and a list (first 100 rows). |
| History | roads have "Exists from / Until" like every feature, so a road can be built or abandoned on a date. |

## What is drawn when
| tier | line (px at the fitted-world zoom) | halo | drawn from zoom | while a globe is turned |
|---|---|---|---|---|
| Highway | 3.4 | yes | always | yes |
| National road | 2.7 | yes | x1.25 | yes |
| Regional road | 2.1 | yes | x2.5 | no |
| Local road | 1.5 | no | x4.5 | no |
| Track / trail | 1.2, dashed | no | x8 | no |

Zoom is relative to the fitted world (the same scale the scale bar and `ZOOM_MAX_REL` use). Tiers that are not drawn at the current zoom cannot be picked or snapped to either. "Every tier at every zoom" shows all of them. Colours follow the map theme (`road` in `web/js/themes.js`). Roads are part of PNG exports and are not painted on the 3D globe.

Like rivers, a road is never cut to land, but points placed over water are pulled to the coast while "Keep countries on land" is on (toolbar); hold Alt, or switch that button off, to place points over water (bridges, ferries).

## In the map file
The Rust core only knows the feature kinds it was built with, so a road is saved as a **river** whose `notes` start with a tag line, `[[road:highway]]`, followed by the person's own notes. Opening a file turns those rivers back into roads. An older build of the app opens such a file and shows the roads as rivers (the tag line is visible in their notes). Nothing in the Rust core changed. The only code that knows about this is `encodeRoads` / `decodeRoads` in `web/js/roads.js`, called from `projectJson` and `applyProject` in `web/js/app.js`.

## Performance design
* A road's projected outline is the editor's cached `projRing` entry and its stroke path is cached on that entry in projected units, so panning and zooming do no per-point work (the same technique as countries and ranges).
* Each tier keeps one array of `{ path, bb }`. It is rebuilt only when the projection or centre, the features (`store.ver`), the slider day (only with the history filter on) or the visible set changes. `visibleRings()` culls it to the view and reuses the combined `Path2D` while the same roads are in view. A frame costs two strokes per drawn tier (halo, line) however many roads exist.
* Finer tiers are not touched at all below their zoom, so a zoomed-out map with thousands of local roads costs the same as one without.
* While a globe is turned: highways and national roads only, no halo, at most 400 roads per tier, coarse outlines. Everything returns at rest.
* Open lines (rivers and roads) now have projected bounds, so culling, picking and snapping reject far lines without touching their points. Snapping to roads tests one bounding box per far road.
* The Roads list shows 100 rows at most and is built only while the section is open.
* Saving copies only the roads (encode); undo keeps at least 20 steps and at most about 120 million characters of history.
* Not done: road names on the map, the 3D globe, routing / travel time.
