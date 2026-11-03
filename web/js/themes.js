// Map themes. `gl` feeds the shader (sea, land, paper, grain), `ov` the vector overlay, `map` the country / subdivision fills, `txt` names and labels.
export const THEMES = {
  atlas: {
    id: 'atlas', name: 'Atlas (clean)',
    gl: { paper: [0.949, 0.918, 0.839], oceanA: [0.812, 0.898, 0.918], oceanB: [0.612, 0.769, 0.839], ripple: [0.435, 0.639, 0.741], land: [0.85, 0.82, 0.71], bioSat: 1, ice: [0.93, 0.955, 0.97], river: [0.353, 0.584, 0.722], ink: [0.231, 0.31, 0.361], grain: 0, vig: 0 },
    ov: { grat: 'rgba(70, 104, 124, 0.34)', coast: 'rgba(52, 72, 84, 0.92)', river: 'rgba(70, 130, 168, 0.92)', frame: 'rgba(59, 79, 92, 0.95)' },
    road: { casing: 'rgba(250, 245, 232, 0.9)', highway: '#c8452f', national: '#dd8a2c', regional: '#9a7b46', local: '#7a766b', track: '#7a766b' },
    map: { sat: 1.4, light: 0.97, alpha: 0.52, grain: 0.18, edge: 0, border: '#2a3640', borderMix: 0.6, subAlpha: 0.3 },
    ui: { paper: '#f2ead6', card: 'rgba(250, 245, 232, .93)', line: '#d8ceb2' },
    txt: { name: 'rgba(52,40,36,0.88)', range: 'rgba(74,52,32,0.92)', halo: 'rgba(250,245,232,0.85)', label: 'rgba(40,66,88,0.92)', ink: '#2a3640', paper: '#faf5e8' },
  },
  parchment: {
    id: 'parchment', name: 'Parchment (old map)',
    gl: { bg: [0.949, 0.918, 0.839], paper: [0.8, 0.72, 0.55], oceanA: [0.8, 0.73, 0.58], oceanB: [0.71, 0.63, 0.48], ripple: [0.52, 0.42, 0.3], land: [0.88, 0.81, 0.65], bioSat: 0.3, ice: [0.9, 0.86, 0.76], river: [0.42, 0.5, 0.52], ink: [0.2, 0.13, 0.08], grain: 0.24, vig: 0.55 },
    ov: { grat: 'rgba(105, 75, 45, 0.3)', coast: 'rgba(52, 36, 20, 0.9)', river: 'rgba(92, 112, 118, 0.9)', frame: 'rgba(58, 38, 22, 0.95)' },
    road: { casing: 'rgba(232, 218, 186, 0.85)', highway: '#8f2d1d', national: '#a8552a', regional: '#6f4f2c', local: '#5a4631', track: '#5a4631' },
    map: { sat: 1.3, light: 0.95, alpha: 0.6, grain: 0.24, edge: 0.34, border: '#2b1d12', borderMix: 0.55, subAlpha: 0.32 },
    ui: { paper: '#f2ead6', card: 'rgba(232, 219, 187, .93)', line: '#b9a375' },
    txt: { name: 'rgba(66,38,28,0.92)', range: 'rgba(60,40,25,0.9)', halo: 'rgba(232,218,186,0.8)', label: 'rgba(66,42,26,0.92)', ink: '#3a2a1a', paper: '#eadfc0' },
  },
  dark: {
    id: 'dark', name: 'Dark (map app)',
    // deep navy sea, teal forests, slate-violet deserts, light dashed borders, white names with a dark halo
    gl: { paper: [0.012, 0.031, 0.094], oceanA: [0.016, 0.047, 0.18], oceanB: [0.008, 0.027, 0.125], ripple: [0.09, 0.16, 0.36], land: [0.118, 0.235, 0.275], landB: [0.165, 0.169, 0.29], landMode: 1, bioSat: 1, ice: [0.2, 0.23, 0.32], river: [0.2, 0.36, 0.62], ink: [0.27, 0.4, 0.5], grain: 0, vig: 0 },
    ov: { grat: 'rgba(160, 175, 220, 0.14)', coast: 'rgba(96, 132, 156, 0.5)', river: 'rgba(66, 112, 186, 0.75)', frame: 'rgba(120, 140, 196, 0.55)' },
    road: { casing: 'rgba(4, 9, 26, 0.7)', highway: '#ff9568', national: '#ffcf6e', regional: '#b4c1ff', local: '#8591c2', track: '#7683b4' },
    map: { sat: 1.28, light: 0.84, alpha: 0.62, grain: 0, edge: 0, border: '#7480ad', borderMix: 0.6, bw: 1.5, subAlpha: 0.3 },     // vivid jewel tones that stay clear of the dark ground (the old alpha 0.4 let the navy land wash every fill into brown / slate)
    ui: { paper: '#030818', card: 'rgba(19, 25, 50, .94)', line: '#2b3664', ink: '#dfe5f5', muted: '#8d97b8', accent: '#7fa4ff', accentSoft: 'rgba(127, 164, 255, .16)', field: 'rgba(255,255,255,.07)', hover: 'rgba(255,255,255,.07)', toggle: '#3a4470', scheme: 'dark' },
    txt: { name: '#bcc6e2', range: '#94a8d2', halo: 'rgba(4,9,26,0.7)', haloW: 0.08, nw: 500, label: '#91a1e0', ink: '#c6cde4', paper: '#0b1230' },
  },
};
export const themeById = (id) => THEMES[id] || THEMES.atlas;
/** page background and panel colours follow the map theme (the map's own paper colour shows outside the projection outline) */
export function applyThemeUi(id) {
  const u = themeById(id).ui, r = document.documentElement.style;
  const v = { paper: '#f2ead6', card: 'rgba(250, 245, 232, .93)', line: '#d8ceb2', ink: '#33434d', muted: '#7b8790', accent: '#3b6e8a', accentSoft: 'rgba(59, 110, 138, .12)', field: 'rgba(255,255,255,.65)', hover: 'rgba(51,67,77,.06)', toggle: '#cfc6ad', scheme: 'light', ...u };
  r.setProperty('--paper', v.paper); r.setProperty('--card', v.card); r.setProperty('--line', v.line); r.setProperty('--ink', v.ink); r.setProperty('--muted', v.muted);
  r.setProperty('--accent', v.accent); r.setProperty('--accent-soft', v.accentSoft); r.setProperty('--field', v.field); r.setProperty('--hover', v.hover); r.setProperty('--toggle', v.toggle);
  r.setProperty('color-scheme', v.scheme);
}