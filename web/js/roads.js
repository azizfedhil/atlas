// Road tiers (highway, national, regional, local, track): pure data and helpers. No DOM, no canvas.
//
// Roads are real features in the editor (kind 'road': one open line, like a river, plus a `tier`). The Rust core only knows the kinds
// it was built with, so a SAVED file carries a road as a river tagged "[[road:<tier>]]" on the first line of `notes` (the same trick
// timeline.js uses for event kinds). encodeRoads / decodeRoads convert at the two doors (projectJson and applyProject in app.js); the rest of the
// app only ever sees kind 'road'. An older build of the app opens such a file and shows the roads as rivers.
import { THEMES, themeById } from './themes.js';

/** Finest tier last.
 *  w: line width in css px at the fitted-world zoom (it grows gently when zoomed in)
 *  casing: extra px of halo on each side of the line (0 = none)
 *  minZ: smallest zoom (relative to the fitted world) at which the tier is drawn, picked and snapped to
 *  moveKeep: still drawn while a 3D-style globe is being turned (the rest waits for the view to rest)
 *  dash: [dash, gap] in line widths, or null for a solid line */
export const ROAD_TIERS = [
  { id: 'highway',  label: 'Highway',       plural: 'Highways',        key: '1', w: 3.4, casing: 1.5, minZ: 0,    moveKeep: true,  dash: null },
  { id: 'national', label: 'National road', plural: 'National roads',  key: '2', w: 2.7, casing: 1.3, minZ: 1.25, moveKeep: true,  dash: null },
  { id: 'regional', label: 'Regional road', plural: 'Regional roads',  key: '3', w: 2.1, casing: 1.1, minZ: 2.5,  moveKeep: false, dash: null },
  { id: 'local',    label: 'Local road',    plural: 'Local roads',     key: '4', w: 1.5, casing: 0,   minZ: 4.5,  moveKeep: false, dash: null },
  { id: 'track',    label: 'Track / trail', plural: 'Tracks & trails', key: '5', w: 1.2, casing: 0,   minZ: 8,    moveKeep: false, dash: [3.2, 2.4] },
];
export const TIER_BY_ID = new Map(ROAD_TIERS.map((t) => [t.id, t]));
/** finest first: a higher tier is painted over the lower ones */
export const DRAW_ORDER = ROAD_TIERS.slice().reverse();

/** line width in css px for tier `t` at zoom `z` (z = zoom relative to the fitted world, at least 1) */
export const roadWidthPx = (t, z) => t.w * Math.min(1.7, 1 + 0.09 * Math.log2(Math.max(z, 1)));
/** is tier `t` drawn at this zoom? `all` = the "every tier at every zoom" switch */
export const tierShown = (t, zoomRel, all) => !!all || zoomRel >= t.minZ;
/** the colour a tier is drawn with in a theme */
export const roadColor = (tierId, themeId) => { const p = themeById(themeId).road || THEMES.atlas.road; return p[tierId] || p.local; };

// ---- saving: kind 'road' <-> a tagged river (see the header) ----
const TAG = /^\[\[road:([a-z]{1,12})\]\]\n?/;
const DISK_COLOR = '#8a7a66';          // any colour string is fine on disk: a road's look comes from its tier and the theme

/** the features as they are written to a file: roads become tagged rivers (new objects; the editor's own features are not touched). Returns the same array when there is no road. */
export function encodeRoads(features) {
  if (!features.some((f) => f.kind === 'road')) return features;
  return features.map((f) => {
    if (f.kind !== 'road') return f;
    const o = { ...f, kind: 'river', color: DISK_COLOR, width: 1, notes: `[[road:${TIER_BY_ID.has(f.tier) ? f.tier : 'local'}]]` + (f.notes ? '\n' + f.notes : '') };
    delete o.tier;
    return o;
  });
}

/** features read from a file (parsed JSON, changed in place): a river whose notes start with the road tag becomes a road again */
export function decodeRoads(features) {
  for (const f of features) {
    if (f.kind !== 'river' || typeof f.notes !== 'string') continue;
    const m = TAG.exec(f.notes); if (!m) continue;
    f.kind = 'road'; f.tier = TIER_BY_ID.has(m[1]) ? m[1] : 'local';
    f.notes = f.notes.slice(m[0].length);
    delete f.color; delete f.width;
  }
  return features;
}
