// Reference image helpers (pure; no DOM/GL). The reference is an equirectangular picture of the WHOLE world
// (360 x 180 degrees, 2:1) that the shader reprojects with the same inverse projection as the map itself.

/** Size to upload so neither side exceeds the GPU limit (keeps the aspect ratio, never upscales). */
export function fitTextureSize(w, h, maxSize) {
  if (!(w > 0 && h > 0) || !(maxSize > 0)) throw new RangeError('image has no size');
  const k = Math.min(1, maxSize / Math.max(w, h));
  return [Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k))];
}

/** Warning text when the picture is not (close to) 2:1, otherwise ''. It is still accepted and stretched over the world. */
export function aspectWarning(w, h) {
  const r = w / h;
  return Math.abs(r - 2) <= 0.03 ? '' : `The image is ${w}×${h} (${r.toFixed(2)}:1), not 2:1. It will be stretched over the whole world (360°×180°).`;
}

/** Opacity slider value (0-100, anything) -> shader alpha 0..1. */
export const opacityFromPercent = (p) => { const n = Number(p); return Number.isFinite(n) ? Math.min(1, Math.max(0, n / 100)) : 0.5; };
export const DEFAULT_OPACITY = 50;
