// Run the simulator's own climate engine headless from an elevation grid (km) and a land mask, both 1024x512.
// Same engine call as tools/run_climate.mjs, minus the heightmap round trip (world/climate_src/tilt25.2.elevkm.f32 is exactly what that script writes).
// usage: node tools/run_climate_elev.mjs <sim-src dir> <elevkm.f32> <land.u8> <outPrefix>      -> <outPrefix>.t12.f32, <outPrefix>.p12.f32
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [repo, elevFile, landFile, outPrefix] = process.argv.slice(2);
const W = 1024, H = 512, n = W * H;
const imp = (p) => import(pathToFileURL(path.resolve(repo, p)).href);
const { planetClimate } = await imp('v2/js/climate/climate.js');
const { cellStatsCollector } = await imp('v2/js/climate/cell-stats.js');
const eb = fs.readFileSync(elevFile), elevKm = new Float32Array(eb.buffer, eb.byteOffset, n).slice();
const land = new Uint8Array(fs.readFileSync(landFile));
const xyz = new Float32Array(3 * n);
for (let j = 0; j < H; j++) {
  const lat = (0.5 - (j + 0.5) / H) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
  for (let i = 0; i < W; i++) { const r = j * W + i, lon = ((i + 0.5) / W * 2 - 1) * Math.PI; xyz[3 * r] = cl * Math.sin(lon); xyz[3 * r + 1] = sl; xyz[3 * r + 2] = cl * Math.cos(lon); }
}
const T12 = new Float32Array(n * 12).fill(NaN), P12 = new Float32Array(n * 12).fill(NaN);
const collector = cellStatsCollector(n, (r) => Math.asin(Math.max(-1, Math.min(1, xyz[3 * r + 1]))));
const onCell = (r, T, P) => { for (let m = 0; m < 12; m++) { T12[r * 12 + m] = T[m]; P12[r * 12 + m] = P[m]; } collector.add(r, T, P); };
planetClimate({ xyz, elevKm, land, axes: 'y-up' }, { tiltDeg: 25.2, greenhouseWm2: 0, precipScale: 1, onCell });
fs.writeFileSync(outPrefix + '.t12.f32', Buffer.from(T12.buffer));
fs.writeFileSync(outPrefix + '.p12.f32', Buffer.from(P12.buffer));
