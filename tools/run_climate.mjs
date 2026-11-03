// STEP 2 - run the simulator's own climate engine headless on the Cosmossi heightmap.
// usage: node tools/run_climate.mjs <repo-root> <hm.u8> <W> <H> <tiltDeg> <outPrefix> [greenhouse] [precipOffset]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [repo, hmFile, Ws, Hs, tiltS, outPrefix, ghS = '0', prS = '0'] = process.argv.slice(2);
const W = +Ws, H = +Hs, tilt = +tiltS;
const imp = (p) => import(pathToFileURL(path.resolve(repo, p)).href);
const { planetClimate } = await imp('v2/js/climate/climate.js');
const { cellStatsCollector } = await imp('v2/js/climate/cell-stats.js');
const { elevToHeightKm } = await imp('js/color-map.js');

const gray = new Uint8Array(fs.readFileSync(hmFile));
const n = W * H, xyz = new Float32Array(3 * n), elevKm = new Float32Array(n), land = new Uint8Array(n);
for (let j = 0; j < H; j++) {
  const lat = (0.5 - (j + 0.5) / H) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
  for (let i = 0; i < W; i++) {
    const r = j * W + i, lon = ((i + 0.5) / W * 2 - 1) * Math.PI;
    xyz[3 * r] = cl * Math.sin(lon); xyz[3 * r + 1] = sl; xyz[3 * r + 2] = cl * Math.cos(lon);
    const v = gray[r];
    const e = v < 1 ? -0.5 : Math.sqrt((v - 1) / 254);          // the Import page's own grey -> elevation rule
    land[r] = e > 0 ? 1 : 0; elevKm[r] = elevToHeightKm(e);
  }
}
const T12 = new Float32Array(n * 12).fill(NaN), P12 = new Float32Array(n * 12).fill(NaN);
const collector = cellStatsCollector(n, (r) => Math.asin(Math.max(-1, Math.min(1, xyz[3 * r + 1]))));
const onCell = (r, T, P) => { for (let m = 0; m < 12; m++) { T12[r * 12 + m] = T[m]; P12[r * 12 + m] = P[m]; } collector.add(r, T, P); };
const t0 = performance.now();
const res = planetClimate({ xyz, elevKm, land, axes: 'y-up' }, { tiltDeg: tilt, greenhouseWm2: +ghS, precipScale: Math.max(0, 1 + 0.5 * +prS), onCell });
console.log(`tilt ${tilt}: climate ${(performance.now() - t0 | 0)} ms for ${n} cells`);
fs.writeFileSync(outPrefix + '.koppen.u8', Buffer.from(res.cell.koppen.buffer, res.cell.koppen.byteOffset, res.cell.koppen.byteLength));
fs.writeFileSync(outPrefix + '.t12.f32', Buffer.from(T12.buffer));
fs.writeFileSync(outPrefix + '.p12.f32', Buffer.from(P12.buffer));
const st = collector.stats;
for (const k of ['tRange', 'aridity', 'growing', 'rainSeason']) fs.writeFileSync(`${outPrefix}.${k}.f32`, Buffer.from(st[k].buffer, st[k].byteOffset, st[k].byteLength));
fs.writeFileSync(outPrefix + '.elevkm.f32', Buffer.from(elevKm.buffer));
fs.writeFileSync(outPrefix + '.meta.json', JSON.stringify({ W, H, tiltDeg: tilt, greenhouse: +ghS, precipOffset: +prS, timing: res.timing }, null, 1));
