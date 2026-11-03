// COSMOSSI: the baked world for the 3D globe. Used by BOTH the page and the worker.
//   * axial tilt 25.2 deg (passed to the climate engine)
//   * monthly temperature / rainfall of the baked climate (Alduran hyper-desert included) replace the engine's months
//   * the Koppen class of every land cell follows YOUR painted biomes (reconciled map), not the engine's guess
// Data comes from the atlas's own textures (web/tex/clim.png, clim_static.png) and web/data/climate.json, so there is one
// copy of the truth. If they cannot be loaded the globe silently falls back to the plain simulation at 25.2 deg.
export const TILT_DEG = 25.2;

const U = (p) => new URL(p, import.meta.url);
const LUT_T = new Float32Array(256), LUT_P = new Float32Array(256);
for (let b = 0; b < 256; b++) { LUT_T[b] = -80 + (b / 255) * 140; LUT_P[b] = 6400 * (b / 255) * (b / 255); }   // enc in climate.json

// painted class (1..16, as in climate.json "painted") -> engine Koppen id (v2/js/climate/koppen.js)
//        Af Am Aw BWh BWh+ BSh BSk Cs  Cfa Cfb Dfa Dfb Dfc Dfc-b ET  EF
const PAINTED_TO_KOPPEN = [0, 1, 2, 3, 4, 4, 6, 7, 11, 8, 9, 17, 18, 19, 19, 29, 30];
export const ALDURAN_CLASS = 5;

let W = null, META = null, loading = null;

async function decode(url) {
    const blob = await (await fetch(url)).blob();
    const bmp = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
    const c = new OffscreenCanvas(bmp.width, bmp.height), g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(bmp, 0, 0);
    return g.getImageData(0, 0, bmp.width, bmp.height);
}

export function loadWorld() {
    if (!loading) loading = (async () => {
        try {
            const [clim, stat, meta] = await Promise.all([
                decode(U('../tex/clim.png')), decode(U('../tex/clim_static.png')), fetch(U('../data/climate.json')).then(r => r.json())]);
            W = { clim: clim.data, cw: clim.width, stat: stat.data, sw: stat.width, sh: stat.height };
            META = meta;
        } catch (e) { W = null; console.warn('Cosmossi world data not loaded - plain simulation at 25.2 deg.', e); }
    })();
    return loading;
}

/** The climate engine's per-cell hook: overwrite T12/P12 (deg C, mm/month) in place; return the Koppen id (0 = keep the engine's). */
export function cellOverride(lat, lon, T12, P12) {
    if (!W) return 0;
    const TW = 1024, TH = 512;
    let x = ((lon + 180) / 360) * TW - 0.5, y = ((90 - lat) / 180) * TH - 0.5;
    y = y < 0 ? 0 : y > TH - 1 ? TH - 1 : y;
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const i0 = ((x0 % TW) + TW) % TW, i1 = i0 + 1 === TW ? 0 : i0 + 1, j0 = y0, j1 = y0 + 1 < TH ? y0 + 1 : y0;
    const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
    const d = W.clim, rowPx = W.cw;
    for (let m = 0; m < 12; m++) {
        const ox = (m & 3) * TW, oy = (m >> 2) * TH;
        const a = ((oy + j0) * rowPx + ox + i0) * 4, b = ((oy + j0) * rowPx + ox + i1) * 4, c = ((oy + j1) * rowPx + ox + i0) * 4, e = ((oy + j1) * rowPx + ox + i1) * 4;
        T12[m] = w00 * LUT_T[d[a]] + w10 * LUT_T[d[b]] + w01 * LUT_T[d[c]] + w11 * LUT_T[d[e]];
        P12[m] = w00 * LUT_P[d[a + 1]] + w10 * LUT_P[d[b + 1]] + w01 * LUT_P[d[c + 1]] + w11 * LUT_P[d[e + 1]];
    }
    const k = paintedAt(lat, lon);
    return k > 0 ? PAINTED_TO_KOPPEN[k] : 0;
}

/** Painted biome class (1..16) at a point, 0 if unknown. */
export function paintedAt(lat, lon) {
    if (!W) return 0;
    const ix = Math.min(W.sw - 1, Math.max(0, Math.floor(((lon + 180) / 360) * W.sw)));
    const iy = Math.min(W.sh - 1, Math.max(0, Math.floor(((90 - lat) / 180) * W.sh)));
    return W.stat[(iy * W.sw + ix) * 4 + 1];
}

/** Hover lines (html) naming the painted biome, and Alduran's day / night temperatures. Page only. */
export function worldReadout(lat, lon) {
    const k = paintedAt(lat, lon);
    if (!k || !META) return '';
    const p = META.painted[k - 1];
    let html = `<br><span class="hi-label">Biome</span> ${p.name}`;
    if (k === ALDURAN_CLASS) {
        const a = META.alduran;
        html += `<br><span class="hi-label">Alduran</span> summer days ${a.summer_day_high_c}\u00b0C (spikes ${a.summer_day_spike_c}\u00b0C), nights ${a.summer_night_low_c}\u00b0C`
            + `<br><span class="hi-label"></span> winter days ${a.winter_day_high_c}\u00b0C, nights ${a.winter_night_low_c}\u00b0C`;
    }
    return html;
}
