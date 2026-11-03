// GLSL for live reprojection. The source raster stays in plate-carree (lon/lat) space; for every
// screen pixel we invert the active projection, look the colour up, and apply the atlas shading
// (ocean depth tint, coast ripples, ink coastline, rivers) in screen space.
import {
  EE_YMAX, NE_YMAX, E4_KX, E4_KY, E4_C, STEREO_R,
} from './projections.js';

const f = (n) => { const s = String(n); return /[.e]/i.test(s) ? s : s + '.0'; };

export const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = `#version 300 es
precision highp float;
precision highp int;

uniform vec2  uRes;        // framebuffer size (device px)
uniform vec2  uCenter;     // projected coords at the screen centre
uniform float uScale;      // device px per projected unit
uniform int   uProj;       // projection id (see PROJECTIONS[].glId)
uniform vec2  uCtr;        // (central meridian, centre latitude) in radians
uniform vec2  uTex;        // source texture size in px
uniform float uBiomes, uRivers, uRipples, uInk;
uniform vec3  uBg, uPaper, uOceanA, uOceanB, uRippleC, uLandC, uRiverC, uInkC;
uniform vec3  uIce;
uniform vec3  uLandB;      // dark theme: second land colour (dry ground); uLandC is the green one
uniform float uLandMode;   // 0 = biome colours, 1 = two-colour dark land shaded by the biome
uniform float uPole;                      // latitude (rad) where the polar cap starts to fade in
uniform float uBioSat, uGrain, uVig;       // theme: biome desaturation, parchment grain, edge darkening
uniform float uRefA;       // reference image opacity (0 = off)
uniform sampler2D uBiome;
uniform sampler2D uAux;
uniform sampler2D uRef;    // user reference image, equirectangular, whole world
uniform sampler2D uClim;   // climate sheet: 4x4 tiles of 1024x512 (R = temperature, G = rainfall); tiles 0..11 months, 12 annual
uniform sampler2D uClimS;  // climate static (NEAREST): R koppen id, G painted class, B sea/elevation
uniform sampler2D uBioF;   // painted biomes after the climate reconciliation (soft colours)
uniform float uClimMode;   // 0 off, 1 temperature, 2 rainfall, 3 koppen, 4 reconciled painted biomes
uniform float uClimA;      // climate overlay opacity
uniform float uClimM;      // month position 0..12 (fractional: blends two months)
uniform float uClimAnnual; // 1 = the annual tile instead of a month
uniform float uRainMax;    // rainfall at the top of the colour ramp (mm per month, or per year)
uniform vec3  uKop[31];    // koppen class colours
uniform sampler2D uTopo;   // topography (the 3D globe's heightmap): R, G = land height, 16 bit, 0..uTopoMax km; B = land of the heightmap
uniform float uTopoOn;     // 1 = the topographic layer is on
uniform vec3  uTopoFx;     // x elevation-colour opacity, y shaded-relief strength, z contour-line opacity (0 = that part is off)
uniform vec3  uTopoSh;     // x vertical exaggeration, y light azimuth (rad, clockwise from north), z light altitude (rad)
uniform float uTopoStep;   // contour interval (km)
uniform float uTopoMax;    // height at full scale of the texture (km)
uniform float uTopoS[11];  // elevation colour ramp: heights (km) ...
uniform vec3  uTopoC[11];  // ... and colours
out vec4 outColor;

const float PI = 3.14159265358979;
const float HALF_PI = 1.57079632679490;
const float TAU = 6.28318530717959;
const float SQRT2 = 1.41421356237310;
const float SQRT3 = 1.73205080757;
const float EA1 = 1.340264, EA2 = -0.081106, EA3 = 0.000893, EA4 = 0.003796;
const float EE_YMAX = ${f(EE_YMAX)};
const float NE_YMAX = ${f(NE_YMAX)};
const float E4_KX = ${f(E4_KX)}, E4_KY = ${f(E4_KY)}, E4_C = ${f(E4_C)};
const float STEREO_R = ${f(STEREO_R)};
const float GALL_C = 0.70710678118655;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0,0.0)), f.x), mix(h21(i + vec2(0.0,1.0)), h21(i + vec2(1.0,1.0)), f.x), f.y); }
// theme finishing: map-anchored blotches + fine grain, and a darkened edge (both off in the clean theme)
vec3 post(vec3 c, vec2 p){
  if (uGrain > 0.0) { float n = vnoise(p*3.0)*0.45 + vnoise(p*11.0)*0.3 + h21(gl_FragCoord.xy)*0.25; c *= 1.0 + (n - 0.5)*uGrain; }
  if (uVig > 0.0) { vec2 q = gl_FragCoord.xy/uRes*2.0 - 1.0; c *= 1.0 - uVig*0.35*pow(max(abs(q.x), abs(q.y)), 3.0); }
  return c;
}

float neX(float p){ float p2=p*p, p4=p2*p2; return 0.8707 - 0.131979*p2 + p4*(-0.013791 + p4*(0.003971*p2 - 0.001529*p4)); }
float neY(float p){ float p2=p*p, p4=p2*p2; return p*(1.007226 + p2*(0.015085 + p4*(-0.044475 + 0.028874*p2 - 0.005916*p4))); }
float neYD(float p){ float p2=p*p, p4=p2*p2, p6=p4*p2; return 1.007226 + 3.0*0.015085*p2 - 7.0*0.044475*p6 + 9.0*0.028874*p6*p2 - 11.0*0.005916*p6*p4; }

bool azInv(vec2 p, float c, out vec2 lp){
  float rho = length(p);
  float sc = sin(c), cc = cos(c), s0 = sin(uCtr.y), c0 = cos(uCtr.y);
  float phi = asin(clamp(cc*s0 + (rho == 0.0 ? 0.0 : p.y*sc*c0/rho), -1.0, 1.0));
  float dl = atan(p.x*sc, rho*c0*cc - p.y*s0*sc);
  lp = vec2(dl, phi);
  return true;
}

// projected -> (longitude relative to centre meridian, latitude); false = outside the outline
bool inverseProj(vec2 p, out vec2 lp){
  float x = p.x, y = p.y;
  lp = vec2(0.0);
  if (uProj == 0) {                                   // Equal Earth
    if (abs(y) > EE_YMAX) return false;
    float t = clamp(y / EA1, -1.1, 1.1);
    for (int i = 0; i < 4; i++) {                       // Newton converges to 1e-15 in 3 steps over the whole range (tools/test_draw_perf.mjs)
      float t2 = t*t, t6 = t2*t2*t2;
      t -= (t*(EA1 + EA2*t2 + t6*(EA3 + EA4*t2)) - y) / (EA1 + 3.0*EA2*t2 + t6*(7.0*EA3 + 9.0*EA4*t2));
    }
    float t2 = t*t, t6 = t2*t2*t2;
    float dl = 3.0*x*(EA1 + 3.0*EA2*t2 + t6*(7.0*EA3 + 9.0*EA4*t2)) / (2.0*SQRT3*cos(t));
    if (!(abs(dl) <= PI)) return false;
    lp = vec2(dl, asin(clamp(2.0*sin(t)/SQRT3, -1.0, 1.0)));
    return true;
  }
  if (uProj == 1) {                                   // Natural Earth
    if (abs(y) > NE_YMAX) return false;
    float ph = y;
    for (int i = 0; i < 7; i++) ph -= (neY(ph) - y) / neYD(ph);   // 6 steps give 5e-11 rad (was 12)
    float dl = x / neX(ph);
    if (!(abs(dl) <= PI)) return false;
    lp = vec2(dl, ph);
    return true;
  }
  if (uProj == 2) {                                   // Mollweide
    float s = y / SQRT2;
    if (abs(s) > 1.0) return false;
    float t = asin(s), c = cos(t);
    float dl = c < 1e-6 ? 0.0 : PI*x / (2.0*SQRT2*c);
    if (!(abs(dl) <= PI)) return false;
    lp = vec2(dl, asin(clamp((2.0*t + sin(2.0*t)) / PI, -1.0, 1.0)));
    return true;
  }
  if (uProj == 3) {                                   // Eckert IV
    float s = y / E4_KY;
    if (abs(s) > 1.0) return false;
    float t = asin(s), c = cos(t);
    float dl = x / (E4_KX*(1.0 + c));
    if (!(abs(dl) <= PI)) return false;
    lp = vec2(dl, asin(clamp((t + sin(t)*c + 2.0*sin(t)) / E4_C, -1.0, 1.0)));
    return true;
  }
  if (uProj == 4) {                                   // Sinusoidal
    if (abs(y) > HALF_PI) return false;
    float c = cos(y);
    float dl = c < 1e-6 ? 0.0 : x / c;
    if (!(abs(dl) <= PI)) return false;
    lp = vec2(dl, y);
    return true;
  }
  if (uProj == 5) {                                   // Gall-Peters
    float s = y * GALL_C, dl = x / GALL_C;
    if (abs(s) > 1.0 || abs(dl) > PI) return false;
    lp = vec2(dl, asin(s));
    return true;
  }
  if (uProj == 6) {                                   // Equirectangular
    if (abs(x) > PI || abs(y) > HALF_PI) return false;
    lp = vec2(x, y);
    return true;
  }
  if (uProj == 7) {                                   // Mercator
    if (abs(x) > PI || abs(y) > PI) return false;
    lp = vec2(x, 2.0*atan(exp(y)) - HALF_PI);
    return true;
  }
  float rho = length(p);
  if (uProj == 8) {                                   // Orthographic
    if (rho > 1.0) return false;
    return azInv(p, asin(rho), lp);
  }
  if (uProj == 9) {                                   // Lambert azimuthal equal-area
    if (rho > 2.0) return false;
    return azInv(p, 2.0*asin(rho/2.0), lp);
  }
  if (rho > STEREO_R) return false;                   // Stereographic
  return azInv(p, 2.0*atan(rho/2.0), lp);
}

vec2 toUV(vec2 lp){ return vec2((lp.x + uCtr.x)/TAU + 0.5, 0.5 - lp.y/PI); }
vec2 uvDelta(vec2 a, vec2 b){ vec2 d = a - b; d.x -= round(d.x); return d; }

// ---- climate overlay ----
vec2 climUV(float tile, vec2 uv){
  vec2 t = vec2(fract(uv.x), clamp(uv.y, 0.0, 1.0));
  t = clamp(t, vec2(0.5/1024.0, 0.5/512.0), vec2(1.0 - 0.5/1024.0, 1.0 - 0.5/512.0));   // stay inside the tile: no bleed from the neighbouring month
  return (vec2(mod(tile, 4.0), floor(tile/4.0)) + t) / 4.0;
}
vec2 climTile(float tile, vec2 uv, float pmax){          // -> (deg C, mm)
  vec2 c = texture(uClim, climUV(tile, uv)).rg;
  return vec2(-80.0 + c.r*140.0, pmax*c.g*c.g);
}
vec2 climSample(vec2 uv){
  if (uClimAnnual > 0.5) return climTile(12.0, uv, 12000.0);
  float m0 = floor(uClimM), f = uClimM - m0, m1 = mod(m0 + 1.0, 12.0);
  return mix(climTile(mod(m0, 12.0), uv, 6400.0), climTile(m1, uv, 6400.0), f);
}
vec3 rampTemp(float t){
  const float S[9] = float[9](-40.0, -25.0, -10.0, 0.0, 10.0, 20.0, 30.0, 40.0, 55.0);
  const vec3  C[9] = vec3[9](vec3(0.30,0.15,0.50), vec3(0.20,0.30,0.70), vec3(0.35,0.60,0.90), vec3(0.82,0.93,0.98), vec3(0.68,0.88,0.55),
                             vec3(0.98,0.90,0.40), vec3(0.96,0.60,0.20), vec3(0.85,0.25,0.15), vec3(0.45,0.05,0.08));
  if (t <= S[0]) return C[0];
  for (int i = 1; i < 9; i++) if (t <= S[i]) return mix(C[i-1], C[i], (t - S[i-1]) / (S[i] - S[i-1]));
  return C[8];
}
vec3 rampRain(float x){                                       // x = sqrt(rain / top of ramp), 0..1
  const float S[6] = float[6](0.0, 0.2, 0.4, 0.6, 0.8, 1.0);
  const vec3  C[6] = vec3[6](vec3(0.96,0.93,0.82), vec3(0.85,0.88,0.60), vec3(0.45,0.75,0.55), vec3(0.20,0.60,0.70), vec3(0.15,0.35,0.70), vec3(0.10,0.12,0.45));
  x = clamp(x, 0.0, 1.0);
  for (int i = 1; i < 6; i++) if (x <= S[i]) return mix(C[i-1], C[i], (x - S[i-1]) / (S[i] - S[i-1]));
  return C[5];
}

// ---- topographic layer ----
float topoH(vec2 uv, vec2 gx, vec2 gy){                      // land height in km (the two 8-bit channels add up linearly, so filtering them separately is exact)
  vec3 c = textureGrad(uTopo, vec2(uv.x, clamp(uv.y, 0.0, 1.0)), gx, gy).rgb;
  return (c.r*255.0*256.0 + c.g*255.0) / 65535.0 * uTopoMax;
}
vec3 rampTopo(float km){
  if (km <= uTopoS[0]) return uTopoC[0];
  for (int i = 1; i < 11; i++) if (km <= uTopoS[i]) return mix(uTopoC[i-1], uTopoC[i], (km - uTopoS[i-1]) / (uTopoS[i] - uTopoS[i-1]));
  return uTopoC[10];
}

void main(){
  vec2 p = uCenter + (gl_FragCoord.xy - 0.5*uRes) / uScale;
  vec2 lp;
  if (!inverseProj(p, lp)) { outColor = vec4(uBg, 1.0); return; }

  // screen-space derivatives of the lookup (analytic via neighbouring pixels, seam-safe)
  vec2 e = vec2(1.0 / uScale);
  vec2 uv = toUV(lp), l2;
  vec2 ddx = vec2(0.0), ddy = vec2(0.0);
  if (inverseProj(p + vec2(e.x, 0.0), l2)) ddx = uvDelta(toUV(l2), uv);
  else if (inverseProj(p - vec2(e.x, 0.0), l2)) ddx = uvDelta(uv, toUV(l2));
  if (inverseProj(p + vec2(0.0, e.y), l2)) ddy = uvDelta(toUV(l2), uv);
  else if (inverseProj(p - vec2(0.0, e.y), l2)) ddy = uvDelta(uv, toUV(l2));
  float pf = smoothstep(uPole, uPole + 0.1, abs(lp.y));          // polar cap: the source painting is unusable here (see README)
  float lx = length(ddx*uTex), ly = length(ddy*uTex);
  float major = max(max(lx, ly), 1e-3), minor = max(min(lx, ly), 1e-3);
  float spp = sqrt(major * minor);                                   // source px per device px
  float aniso = major / minor;                                       // huge near projection poles

  vec3 bio = textureGrad(uBiome, uv, ddx, ddy).rgb;
  vec3 aux = textureGrad(uAux,   uv, ddx, ddy).rgb;
  float fine = (aux.r*2.0 - 1.0) * 32.0;
  float sdf  = fine > 31.0 ? max(aux.g*255.0, 32.0) : fine;         // + water, - land (source px)
  float dW = max(sdf, 0.0), dI = max(-sdf, 0.0);
  float sdfScr = sdf / spp;                                          // in device px

  // ocean
  float t = 1.0 - exp(-dW / 90.0);
  vec3 ocean = mix(uOceanA, uOceanB, t);
  float fade = (1.0 - smoothstep(1.5, 3.5, major)) * (1.0 - smoothstep(3.0, 9.0, aniso));
  float rw = max(1.4, spp*1.1), rip = 0.0;
  rip = max(rip, 0.55*(1.0 - smoothstep(0.0, rw, abs(dW -  6.4))));
  rip = max(rip, 0.42*(1.0 - smoothstep(0.0, rw, abs(dW - 14.0))));
  rip = max(rip, 0.30*(1.0 - smoothstep(0.0, rw, abs(dW - 24.0))));
  rip = max(rip, 0.20*(1.0 - smoothstep(0.0, rw, abs(dW - 38.6))));
  rip = max(rip, 0.12*(1.0 - smoothstep(0.0, rw, abs(dW - 56.6))));
  ocean = mix(ocean, uRippleC, rip * 0.55 * fade * uRipples);

  // land
  vec3 land = mix(uLandC, mix(vec3(dot(bio, vec3(0.299,0.587,0.114))), bio, uBioSat), uBiomes);
  if (uLandMode > 0.5) {                                              // dark theme: teal where the biome is green, slate-violet where it is dry; the biome's brightness adds texture
    float lum = dot(bio, vec3(0.299, 0.587, 0.114)), gr = clamp((bio.g - bio.r) * 4.0 + 0.45, 0.0, 1.0);
    land = mix(uLandC, mix(uLandB, uLandC, gr) * (0.78 + 0.55 * lum), uBiomes);
  }
  land *= 1.0 - exp(-dI / 6.4) * 0.10;
  float cov = smoothstep(-0.7, 0.7, -sdfScr);
  vec3 col = mix(ocean, land, cov);

  // climate overlay (land only; rivers and the ink coast stay on top)
  if (uClimMode > 0.5) {
    vec3 cc = col;
    if (uClimMode < 1.5)      { cc = rampTemp(climSample(uv).x); }
    else if (uClimMode < 2.5) { cc = rampRain(sqrt(climSample(uv).y / uRainMax)); }
    else if (uClimMode < 3.5) { cc = uKop[min(int(texture(uClimS, uv).r*255.0 + 0.5), 30)]; }
    else                      { cc = textureGrad(uBioF, uv, ddx, ddy).rgb; }
    col = mix(col, cc, cov * uClimA);
  }

  // topographic layer (land only, on top of the biome / climate colours; rivers and the ink coast stay on top of it)
  if (uTopoOn > 0.5 && cov > 0.002) {
    vec2 tsz = vec2(textureSize(uTopo, 0));
    float sT = clamp(spp * tsz.x / uTex.x, 1.0, 12.0);                        // heightmap texels per device px, never finer than one texel
    vec2 sd = vec2(sT) / tsz;                                                   // tap distance in uv
    float h0 = topoH(uv, ddx, ddy);
    float hE = topoH(uv + vec2(sd.x, 0.0), ddx, ddy), hW = topoH(uv - vec2(sd.x, 0.0), ddx, ddy);
    float hN = topoH(uv - vec2(0.0, sd.y), ddx, ddy), hS = topoH(uv + vec2(0.0, sd.y), ddx, ddy);   // v grows towards the south
    if (uTopoFx.x > 0.0) col = mix(col, rampTopo(h0), cov * uTopoFx.x);
    if (uTopoFx.y > 0.0) {                                                      // shaded relief: slope from the four taps, geographic light (default north-west)
      float cl = max(cos(lp.y), 0.05);
      float dxk = 2.0 * sd.x * TAU * 6371.0 * cl;                               // km between the west and east taps (Earth-sized reference sphere)
      float dyk = 2.0 * sd.y * PI * 6371.0;                                      // km between the north and south taps
      vec3 nrm = normalize(vec3(-(hE - hW) / dxk * uTopoSh.x, -(hN - hS) / dyk * uTopoSh.x, 1.0));
      float ca = cos(uTopoSh.z);
      vec3 L = vec3(sin(uTopoSh.y) * ca, cos(uTopoSh.y) * ca, sin(uTopoSh.z));
      float k = (dot(nrm, L) - L.z) * uTopoFx.y * 1.6;                          // 0 on flat ground, < 0 in shade, > 0 lit
      vec3 shaded = k < 0.0 ? col * (1.0 + max(k, -0.85)) : mix(col, vec3(1.0), min(k, 0.8) * 0.5);
      col = mix(col, shaded, cov);
    }
    if (uTopoFx.z > 0.0) {                                                      // contour lines: every uTopoStep km, every fifth one stronger
      vec2 gU = vec2((hE - hW) / (2.0 * sd.x), (hS - hN) / (2.0 * sd.y));       // km per uv unit
      float gp = max(length(vec2(dot(gU, ddx), dot(gU, ddy))), 1e-6);           // km per device px
      float st1 = uTopoStep, st5 = uTopoStep * 5.0;
      float d1 = abs(fract(h0 / st1 + 0.5) - 0.5) * st1 / gp;                  // device px to the nearest contour ...
      float d5 = abs(fract(h0 / st5 + 0.5) - 0.5) * st5 / gp;                  // ... and to the nearest strong one
      float gap = st1 / gp;                                                     // device px between two contours: dense lines (steep or zoomed out) fade away
      float ln = max(0.55 * (1.0 - smoothstep(0.3, 1.1, d1)) * smoothstep(2.5, 7.0, gap), (1.0 - smoothstep(0.5, 1.7, d5)) * smoothstep(2.5, 7.0, gap * 5.0));
      ln *= smoothstep(0.0003, 0.0016, max(abs(hE - hW), abs(hN - hS))) * step(0.5 * st1, h0);   // none on dead-flat ground or at the coast
      vec3 lc = uLandMode > 0.5 ? vec3(0.86, 0.82, 0.72) : vec3(0.32, 0.21, 0.12);
      col = mix(col, lc, ln * cov * uTopoFx.z);
    }
  }

  // rivers
  float r = clamp(aux.b * 2.2, 0.0, 1.0) * step(sdf, 0.0) * uRivers;
  col = mix(col, uRiverC, r * 0.95);

  // ink coastline
  float ink = (1.0 - smoothstep(0.2, 1.15, abs(sdfScr))) * 0.8 * (1.0 - smoothstep(3.0, 9.0, aniso)) * (1.0 - smoothstep(1.50, 1.56, abs(lp.y))) * uInk * (1.0 - pf);
  col = mix(col, uInkC, ink);
  col = mix(col, uIce, pf);
  // reference image (equirectangular, full world) on top of the map, same reprojection as the biome lookup
  if (uRefA > 0.0) {
    vec4 rc = textureGrad(uRef, uv, ddx, ddy);
    col = mix(col, rc.rgb, rc.a * uRefA);
  }
  outColor = vec4(post(col, p), 1.0);
}`;