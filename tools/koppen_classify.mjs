// Classify 12-month T/P fields with World Orogen's own Koppen rules (tools/vendor/koppen.js).
// usage: node tools/koppen_classify.mjs <T12.f32> <P12.f32> <land.u8> <out.u8>      (cell-major: 12 values per cell)
import fs from 'node:fs';
import { classifyCell, KOPPEN_CLASSES } from './vendor/koppen.js';
const [tf, pf, lf, of] = process.argv.slice(2);
const T = new Float32Array(fs.readFileSync(tf).buffer.slice(0)), P = new Float32Array(fs.readFileSync(pf).buffer.slice(0)), L = fs.readFileSync(lf);
const out = new Uint8Array(L.length);
for (let c = 0; c < L.length; c++) if (L[c]) out[c] = classifyCell(T, P, c * 12, 1);
fs.writeFileSync(of, out);
fs.writeFileSync(of + '.classes.json', JSON.stringify(KOPPEN_CLASSES.map(({ code, name, color }) => ({ code, name, color }))));
