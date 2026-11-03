import { VERT, FRAG } from './shaders.js';
import { fitTextureSize } from './refimage.js';
import { THEMES } from './themes.js';

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    throw new Error('Shader compile failed:\n' + log);
  }
  return sh;
}

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Fetch a PNG and decode it, with explicit diagnostics and a fallback decoder. */
export async function fetchPng(url) {
  let res;
  try { res = await fetch(url); } catch (e) { throw new Error(`Could not load ${url}: ${e.message || e}`); }
  const buf = await res.arrayBuffer();
  const head = new Uint8Array(buf.slice(0, 8));
  const isPng = PNG_SIG.every((b, i) => head[i] === b);
  if (!res.ok || !isPng) {
    const peek = new TextDecoder().decode(new Uint8Array(buf.slice(0, 60))).replace(/\s+/g, ' ');
    throw new Error(`${url} is not a PNG (HTTP ${res.status}, ${buf.byteLength} bytes, ` +
      `content-type "${res.headers.get('content-type')}"). Starts with: "${peek}". ` +
      `The texture file is probably missing from the web/tex folder or was not bundled into the app.`);
  }
  const blob = new Blob([buf], { type: 'image/png' });
  try {
    return await createImageBitmap(blob);                       // fast path
  } catch (e1) {
    try {                                                       // fallback: <img> decoder
      const objUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.src = objUrl;
      await img.decode();
      URL.revokeObjectURL(objUrl);
      return img;
    } catch (e2) {
      throw new Error(`${url} looks like a PNG (${buf.byteLength} bytes) but this webview could not decode it ` +
        `(createImageBitmap: ${e1.message || e1}; <img>: ${e2.message || e2}).`);
    }
  }
}

async function loadTexture(gl, url, unit) {
  const bmp = await fetchPng(url);
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);   // keep raw channel values
  const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);          // longitude wraps
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT,
    Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  if (bmp.close) bmp.close();
  return { tex, size: [w, h] };
}

/** Decode a user-picked image file (PNG/JPEG/WebP/...) to something texImage2D accepts. */
export async function decodeImageFile(file) {
  try { return await createImageBitmap(file); }
  catch (e1) {
    const url = URL.createObjectURL(file);
    try { const img = new Image(); img.src = url; await img.decode(); return img; }
    catch (e2) { throw new Error(`Could not read "${file.name}" as an image (${e2.message || e2}).`); }
    finally { URL.revokeObjectURL(url); }
  }
}

export async function createRenderer(canvas, { biomeUrl, auxUrl }) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 is not available in this webview.');
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('Program link failed:\n' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  gl.bindVertexArray(gl.createVertexArray());

  const biome = await loadTexture(gl, biomeUrl, 0);
  const aux = await loadTexture(gl, auxUrl, 1);
  const U = {};
  for (const n of ['uRes', 'uCenter', 'uScale', 'uProj', 'uCtr', 'uTex', 'uBiomes', 'uRivers', 'uRipples', 'uInk', 'uBiome', 'uAux', 'uRef', 'uRefA', 'uBg', 'uPaper', 'uOceanA', 'uOceanB', 'uRippleC', 'uLandC', 'uRiverC', 'uInkC', 'uIce', 'uLandB', 'uLandMode', 'uPole', 'uBioSat', 'uGrain', 'uVig', 'uClim', 'uClimS', 'uBioF', 'uClimMode', 'uClimA', 'uClimM', 'uClimAnnual', 'uRainMax', 'uKop', 'uTopo', 'uTopoOn', 'uTopoFx', 'uTopoSh', 'uTopoStep', 'uTopoMax', 'uTopoS', 'uTopoC'])
    U[n] = gl.getUniformLocation(prog, n);
  gl.uniform1i(U.uBiome, 0);
  gl.uniform1i(U.uAux, 1);
  gl.uniform1i(U.uRef, 2);
  gl.uniform1f(U.uRefA, 0);
  const anisoExt = gl.getExtension('EXT_texture_filter_anisotropic'), anisoMax = anisoExt ? Math.min(8, gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT)) : 0;
  let curFast = null;
  /** while the view moves: bilinear mip lookups and no anisotropic filtering (several times fewer texel fetches when zoomed out); full quality at rest */
  const setFilter = (fast) => {
    if (fast === curFast) return; curFast = fast;
    for (const [unit, tex] of [[0, biome.tex], [1, aux.tex]]) {
      gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, fast ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR_MIPMAP_LINEAR);
      if (anisoExt) gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, fast ? 1 : anisoMax);
    }
  };
  let refTex = null, refSize = null, lastKey = '', epoch = 0;     // lastKey: what the canvas currently shows (the buffer is preserved), so an unchanged view is not re-rendered
  const params = () => {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  // unit 2 always holds a texture: a transparent pixel until the user loads a reference image
  gl.activeTexture(gl.TEXTURE2);
  const blank = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  params(); gl.generateMipmap(gl.TEXTURE_2D);
  gl.uniform2f(U.uTex, biome.size[0], biome.size[1]);

  // units 3..5 belong to the climate layer; each holds a 1x1 pixel until setClimate() uploads the real textures (a sampler must never point at nothing)
  const clim = { ready: false, tex: [null, null, null] };
  for (const unit of [3, 4, 5]) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    const b = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, b);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  gl.uniform1i(U.uClim, 3); gl.uniform1i(U.uClimS, 4); gl.uniform1i(U.uBioF, 5);
  gl.uniform1f(U.uClimMode, 0);
  /** upload one decoded image to a climate unit. kind: 'data' = smooth lookups, no mips; 'ids' = nearest; 'colour' = like the biome texture */
  const upload = (unit, bmp, kind) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    const old = clim.tex[unit - 3]; if (old) gl.deleteTexture(old);
    const tex = gl.createTexture(); clim.tex[unit - 3] = tex; gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
    const f = kind === 'ids' ? gl.NEAREST : gl.LINEAR;
    if (kind === 'colour') gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, kind === 'colour' ? gl.LINEAR_MIPMAP_LINEAR : f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  // unit 6 belongs to the topographic layer: a 1x1 pixel until setTopo() uploads tex/topo.png
  const topo = { ready: false, tex: null };
  gl.activeTexture(gl.TEXTURE6);
  { const b = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, b);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); }
  gl.uniform1i(U.uTopo, 6);
  gl.uniform1f(U.uTopoOn, 0);

  return {
    gl,
    /** Upload (or, with null, remove) the reference image. Returns the uploaded size [w, h] or null. Sources larger than the GPU limit are downscaled. */
    setReference(src) {
      epoch++;
      gl.activeTexture(gl.TEXTURE2);
      if (refTex) { gl.deleteTexture(refTex); refTex = null; refSize = null; }
      if (!src) { gl.bindTexture(gl.TEXTURE_2D, blank); return null; }
      let w = src.width || src.naturalWidth, h = src.height || src.naturalHeight, up = src;
      const [tw, th] = fitTextureSize(w, h, Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), 8192));
      if (tw !== w || th !== h) {                                   // downscale through a 2D canvas
        const c = document.createElement('canvas'); c.width = tw; c.height = th;
        const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, tw, th); up = c;
      }
      refTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, refTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, up);
      gl.generateMipmap(gl.TEXTURE_2D); params();
      const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
      if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      if (src.close) src.close();
      refSize = [tw, th]; return refSize;
    },
    get referenceSize() { return refSize; },
    /** climate layer textures: sheet (monthly T/rain), stat (koppen/painted/sea ids), biome (reconciled painted colours); kop = flat [r,g,b]*31 in 0..1. The bitmaps stay the caller's to close. */
    setClimate({ sheet, stat, biome: bf, kop }) {
      upload(3, sheet, 'data'); upload(4, stat, 'ids'); upload(5, bf, 'colour');
      gl.uniform3fv(U.uKop, new Float32Array(kop));
      clim.ready = true; epoch++;
    },
    get climateReady() { return clim.ready; },
    /** topographic layer: the decoded tex/topo.png (R, G = 16-bit land height, B = land), maxKm = the height at full scale, stops = [[km, r, g, b (0..255)] x 11] the elevation colour ramp. The bitmap stays the caller's to close. */
    setTopo({ bitmap, maxKm, stops }) {
      gl.activeTexture(gl.TEXTURE6);
      if (topo.tex) gl.deleteTexture(topo.tex);
      const tex = topo.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
      gl.generateMipmap(gl.TEXTURE_2D); params();
      if (anisoExt) gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(4, anisoMax));
      gl.uniform1f(U.uTopoMax, maxKm);
      gl.uniform1fv(U.uTopoS, new Float32Array(stops.map((s) => s[0])));
      gl.uniform3fv(U.uTopoC, new Float32Array(stops.flatMap((s) => [s[1] / 255, s[2] / 255, s[3] / 255])));
      topo.ready = true; epoch++;
    },
    get topoReady() { return topo.ready; },
    /** overwrite a rectangle of the biome / aux texture (land editor); mips are refreshed separately by mips() */
    patch(which, x, y, w, h, rgba) {
      const t = which === 'aux' ? aux : biome; epoch++;
      gl.activeTexture(gl.TEXTURE0 + (which === 'aux' ? 1 : 0)); gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    },
    mips() { epoch++; for (const [u, t] of [[0, biome.tex], [1, aux.tex]]) { gl.activeTexture(gl.TEXTURE0 + u); gl.bindTexture(gl.TEXTURE_2D, t); gl.generateMipmap(gl.TEXTURE_2D); } },
    /** The pixels of the area x, y, w, h (device px, origin top-left) of what was just drawn, read straight from the framebuffer.
     *  Used by the PNG export: copying the live WebGL canvas with drawImage can come out blank (it depends on compositing timing), reading the buffer cannot. */
    readPixels(x, y, w, h) {
      const W = canvas.width, H = canvas.height;
      x = Math.max(0, Math.min(W - 1, Math.round(x))); y = Math.max(0, Math.min(H - 1, Math.round(y)));
      w = Math.max(1, Math.min(W - x, Math.round(w))); h = Math.max(1, Math.min(H - y, Math.round(h)));
      gl.finish();
      const buf = new Uint8ClampedArray(w * h * 4);
      gl.readPixels(x, H - y - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);          // GL rows run bottom -> top
      const row = w * 4, tmp = new Uint8ClampedArray(row);
      for (let a = 0, b = h - 1; a < b; a++, b--) {
        tmp.set(buf.subarray(a * row, (a + 1) * row)); buf.copyWithin(a * row, b * row, (b + 1) * row); buf.set(tmp, b * row);
      }
      return new ImageData(buf, w, h);
    },
    /** F3 only: waits until the GPU has finished the frame, so its time can be read */
    sync() { gl.finish(); },
    /** resize the drawing buffer to the canvas' CSS size * dpr; returns dpr used */
    resize(cssW, cssH, dprOverride) {
      const dpr = dprOverride || Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      lastKey = '';
      return dpr;
    },
    /** view: { cx, cy, scale (css px / unit), dpr, glId, lon0, lat0, layers:{biomes,rivers,ripples} } */
    draw(v) {
      const key = [canvas.width, canvas.height, v.cx, v.cy, v.scale, v.dpr, v.glId, v.lon0, v.lat0, v.layers.biomes, v.layers.rivers, v.layers.ripples, v.layers.ink, v.theme && v.theme.id, v.pole, refTex ? v.refAlpha || 0 : 0, epoch, !!v.fast, clim.ready && v.climate ? [v.climate.mode, v.climate.month, v.climate.annual, v.climate.alpha, v.climate.rainMax].join(',') : 0,
        topo.ready && v.topo ? [v.topo.tint, v.topo.shade, v.topo.lines, v.topo.step, v.topo.relief, v.topo.azimuth, v.topo.altitude].join(',') : 0].join('|');
      if (key === lastKey) return false;                          // identical picture already on the canvas (hover, selection, overlay-only changes)
      lastKey = key;
      setFilter(!!v.fast);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform2f(U.uCenter, v.cx, v.cy);
      gl.uniform1f(U.uScale, v.scale * v.dpr);
      gl.uniform1i(U.uProj, v.glId);
      gl.uniform2f(U.uCtr, v.lon0, v.lat0);
      gl.uniform1f(U.uBiomes, v.layers.biomes ? 1 : 0);
      gl.uniform1f(U.uRivers, v.layers.rivers ? 1 : 0);
      gl.uniform1f(U.uRipples, v.layers.ripples ? 1 : 0);
      gl.uniform1f(U.uInk, v.layers.ink ? 1 : 0);
      gl.uniform1f(U.uRefA, refTex ? (v.refAlpha || 0) : 0);
      const T = (v.theme || THEMES.atlas).gl;
      gl.uniform3fv(U.uBg, T.bg || T.paper); gl.uniform3fv(U.uPaper, T.paper); gl.uniform3fv(U.uOceanA, T.oceanA); gl.uniform3fv(U.uOceanB, T.oceanB); gl.uniform3fv(U.uRippleC, T.ripple);
      gl.uniform3fv(U.uLandC, T.land); gl.uniform3fv(U.uRiverC, T.river); gl.uniform3fv(U.uInkC, T.ink);
      gl.uniform3fv(U.uIce, T.ice); gl.uniform3fv(U.uLandB, T.landB || T.land); gl.uniform1f(U.uLandMode, T.landMode || 0); gl.uniform1f(U.uPole, v.pole == null ? 3 : v.pole);
      gl.uniform1f(U.uBioSat, T.bioSat); gl.uniform1f(U.uGrain, T.grain); gl.uniform1f(U.uVig, T.vig);
      const C = clim.ready && v.climate && v.climate.mode > 0 ? v.climate : null;
      gl.uniform1f(U.uClimMode, C ? C.mode : 0);
      if (C) { gl.uniform1f(U.uClimA, C.alpha); gl.uniform1f(U.uClimM, C.month); gl.uniform1f(U.uClimAnnual, C.annual ? 1 : 0); gl.uniform1f(U.uRainMax, C.rainMax); }
      const P = topo.ready && v.topo ? v.topo : null;
      gl.uniform1f(U.uTopoOn, P ? 1 : 0);
      if (P) { gl.uniform3f(U.uTopoFx, P.tint, P.shade, P.lines); gl.uniform3f(U.uTopoSh, P.relief, P.azimuth, P.altitude); gl.uniform1f(U.uTopoStep, P.step); }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    },
  };
}