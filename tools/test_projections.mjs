// node tools/test_projections.mjs  -- round-trip + area/conformality checks for every projection
import { PROJECTIONS, project, unproject, DEG, PI, HALF_PI, EE_XMAX, EE_YMAX } from '../web/js/projections.js';
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log('  FAIL', m); } };
console.log('Equal Earth extents', EE_XMAX.toFixed(5), EE_YMAX.toFixed(5), 'aspect', (EE_XMAX / EE_YMAX).toFixed(4));
for (const d of PROJECTIONS) {
  let maxErr = 0, n = 0, maxArea = 0, maxConf = 0;
  for (const lon0 of [0, 70 * DEG, -140 * DEG]) for (const lat0 of d.globe ? [0, 35 * DEG, -50 * DEG] : [0]) {
    for (let lat = -84; lat <= 84; lat += 7) for (let lon = -175; lon <= 175; lon += 11) {
      const lo = lon * DEG, la = lat * DEG;
      const p = project(d, lo, la, lon0, lat0);
      if (!p) continue;
      const q = unproject(d, p[0], p[1], lon0, lat0);
      if (!q) { ok(false, `${d.id} inv null for visible point ${lon},${lat}`); continue; }
      let dl = Math.abs(q[0] - lo); dl = Math.min(dl, 2 * PI - dl);
      const err = Math.max(dl * Math.cos(la), Math.abs(q[1] - la));
      maxErr = Math.max(maxErr, err); n++;
      // local Jacobian (finite differences on the sphere): area ratio & conformality
      const h = 1e-5, px = project(d, lo + h, la, lon0, lat0), py = project(d, lo, la + h, lon0, lat0);
      const cosC = Math.sin(la) * Math.sin(lat0) + Math.cos(la) * Math.cos(lat0) * Math.cos(lo - lon0);
      // finite differences are ill-conditioned right at a globe's antipode, so skip that zone
      if (px && py && Math.abs(lat) < 80 && !(d.globe && cosC < -0.9)) {
        const ax = (px[0] - p[0]) / (h * Math.cos(la)), ay = (px[1] - p[1]) / (h * Math.cos(la));   // d/d(east metres)
        const bx = (py[0] - p[0]) / h, by = (py[1] - p[1]) / h;                                       // d/d(north metres)
        const area = Math.abs(ax * by - ay * bx);
        const sa = Math.hypot(ax, ay), sb = Math.hypot(bx, by), dot = (ax * bx + ay * by) / (sa * sb);
        if (d.tag.startsWith('Equal-area')) maxArea = Math.max(maxArea, Math.abs(area - 1));
        if (d.tag.startsWith('Conformal')) maxConf = Math.max(maxConf, Math.abs(sa / sb - 1), Math.abs(dot));
      }
    }
  }
  console.log(`${d.id.padEnd(18)} pts=${String(n).padStart(5)}  max round-trip err=${maxErr.toExponential(1)}` +
    (d.tag.startsWith('Equal-area') ? `  |area-1|max=${maxArea.toExponential(1)}` : '') +
    (d.tag.startsWith('Conformal') ? `  conformality dev=${maxConf.toExponential(1)}` : ''));
  ok(maxErr < 1e-7, `${d.id} round trip`);
  if (d.tag.startsWith('Equal-area')) ok(maxArea < 2e-4, `${d.id} equal-area`);
  if (d.tag.startsWith('Conformal')) ok(maxConf < 2e-4, `${d.id} conformal`);
  // outline sanity: centre is inside, far corner outside
  ok(unproject(d, 0, 0) !== null, `${d.id} centre valid`);
  ok(unproject(d, d.xmax * 1.01, d.ymax * 1.01) === null, `${d.id} corner outside`);
}
console.log(fail ? `\n${fail} FAILURES` : '\nall projection checks passed');
process.exit(fail ? 1 : 0);
