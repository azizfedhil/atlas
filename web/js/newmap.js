// "New map": what counts as having something to lose, and what the app does before it starts a blank project.
// Kept free of the DOM so tools/test_newmap.mjs can check it in plain Node.
import { LAND_ID } from './landedit.js';
import { BIOME_ID } from './biomes.js';

/** true when the project holds anything worth keeping: a feature (the hidden land-delta and biome-delta only when they hold edits) or a timeline event */
export const hasContent = (store) => store.features.some((f) => (f.id !== LAND_ID && f.id !== BIOME_ID) || !!f.notes) || (store.timeline.events || []).length > 0;

/**
 * 'now'      nothing to lose: start the blank map straight away
 * 'safe'     the map lives in a file that autosave keeps current: flush it, then start (nothing is lost, Open brings it back)
 * 'unsaved'  there is work that is in no file: ask first (Save first / Discard / Cancel)
 */
export function newMapPlan({ hasContent: has, hasFile, autoFile }) {
  if (!has) return 'now';
  return hasFile && autoFile ? 'safe' : 'unsaved';
}
