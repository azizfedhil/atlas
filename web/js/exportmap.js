// Helpers for exporting the current map view as a PNG (Batch 7.3).
export const EXPORT_SCALES = [1, 2, 3, 4];
export const MAX_SIDE = 8192;                       // longest edge in device pixels; safe for every WebGL2 / canvas implementation we ship on

/** the requested scale, reduced if the picture would exceed MAX_SIDE; always >= 1 */
export function clampScale(scale, cssW, cssH) {
  const cap = MAX_SIDE / Math.max(cssW, cssH, 1);
  return Math.max(1, Math.min(scale, cap));
}
/** output size in pixels for a visible map area of cssW x cssH at `scale` */
export const outputSize = (scale, cssW, cssH) => [Math.round(cssW * scale), Math.round(cssH * scale)];
/** a file-system friendly name: letters, digits, dash/underscore only */
export const safeName = (name) => (String(name || 'map').replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '') || 'map');
