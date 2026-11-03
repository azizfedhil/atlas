// node tools/golden.mjs  -> crates/cosmossi-core/tests/golden.json
// Test vectors produced by the (browser-verified) JS projections; the Rust crate must reproduce them.
import { writeFileSync } from 'node:fs';
import { PROJECTIONS, project, DEG } from '../web/js/projections.js';
const cases = [];
for (const d of PROJECTIONS)
  for (const lon0 of d.globe ? [0, 70 * DEG, -140 * DEG] : [0, 70 * DEG, -140 * DEG])
    for (const lat0 of d.globe ? [0, 35 * DEG, -50 * DEG] : [0])
      for (let la = -80; la <= 80; la += 40)
        for (let lo = -160; lo <= 160; lo += 40) {
          const xy = project(d, lo * DEG, la * DEG, lon0, lat0);
          cases.push({ id: d.id, lon0, lat0, lon: lo * DEG, lat: la * DEG, xy: xy ? [xy[0], xy[1]] : null });
        }
writeFileSync(new URL('../crates/cosmossi-core/tests/golden.json', import.meta.url), JSON.stringify(cases));
console.log('wrote', cases.length, 'golden cases');
