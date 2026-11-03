// Land-only area. Rasterises the coast once (0.1 degree cells, even-odd), flood-fills the open ocean from the north pole
// and treats every other water cell (lakes, inland seas) as land. A polygon's area = its spherical area x the land
// fraction of the cells it covers (cos-latitude weighted), so seas and ocean inside an outline are not counted.
const DEG = Math.PI / 180, RES = 10, W = 360 * RES, H = 180 * RES;
export function createLandArea(coastRad) {
  let mask = null;
  const build = () => {
    const cv = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(W, H) : Object.assign(document.createElement('canvas'), { width: W, height: H });
    const g = cv.getContext('2d', { willReadFrequently: true }), path = new Path2D();
    const X = (lon) => (lon + 180) * RES, Y = (lat) => (90 - lat) * RES;
    for (const p of coastRad) {
      const pts = []; for (let i = 0; i < p.length; i += 2) pts.push([p[i] / DEG, p[i + 1] / DEG]);
      let run = [];
      const flush = (open) => {
        if (run.length > 2) {
          path.moveTo(X(run[0][0]), Y(run[0][1]));
          for (let i = 1; i < run.length; i++) path.lineTo(X(run[i][0]), Y(run[i][1]));
          if (open && Math.abs(run[0][0] - run[run.length - 1][0]) > 90) {       // an open contour spanning the seam (Antarctica): close it through the pole
            const la = run.reduce((s, q) => s + q[1], 0) / run.length < 0 ? -90 : 90;
            path.lineTo(X(run[run.length - 1][0]), Y(la)); path.lineTo(X(run[0][0]), Y(la));
          }
          path.closePath();
        }
        run = [];
      };
      let splits = 0;
      for (const q of pts) { if (run.length && Math.abs(q[0] - run[run.length - 1][0]) > 180) { flush(false); splits++; } run.push(q); }
      flush(splits === 0);
    }
    g.fillStyle = '#000'; g.fill(path, 'evenodd');
    const d = g.getImageData(0, 0, W, H).data, land = new Uint8Array(W * H);
    for (let i = 0; i < land.length; i++) land[i] = d[i * 4 + 3] > 127 ? 1 : 0;
    const sea = new Uint8Array(W * H), stack = new Int32Array(W * H);
    let sp = 0;
    const push = (i) => { if (!land[i] && !sea[i]) { sea[i] = 1; stack[sp++] = i; } };
    push(0);                                                                    // north-west corner = Arctic ocean
    while (sp) {
      const i = stack[--sp], x = i % W, y = (i / W) | 0;
      push(y * W + (x + 1) % W); push(y * W + (x + W - 1) % W);
      if (y > 0) push(i - W); if (y < H - 1) push(i + W);
    }
    for (let i = 0; i < land.length; i++) land[i] = sea[i] ? 0 : 1;           // ocean = 0; land, rivers and inland lakes = 1
    mask = land;
  };
  const at = (lon, lat) => mask[Math.min(H - 1, Math.max(0, Math.floor((90 - lat) * RES))) * W + ((Math.floor((lon + 180) * RES) % W) + W) % W];
  /** share (0..1) of the ring's area that is land / inland water */
  function fraction(ring) {
    if (!mask) build();
    let prev = ring[0][0]; const P = ring.map((p, i) => { const x = i ? prev + (((p[0] - prev + 540) % 360 + 360) % 360 - 180) : prev; prev = x; return [x, p[1]]; });
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const step = Math.max(1 / RES / 2, Math.sqrt(((x1 - x0) * (y1 - y0)) / 60000));
    let tot = 0, ld = 0;
    for (let la = y0 + step / 2; la < y1; la += step) {
      const xs = [];
      for (let i = 0, n = P.length; i < n; i++) {
        const a = P[i], b = P[(i + 1) % n];
        if (a[1] > la !== b[1] > la) xs.push(a[0] + ((la - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      const w = Math.cos(la * DEG);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let lo = xs[k] + step / 2; lo < xs[k + 1]; lo += step) { tot += w; if (at(((lo + 540) % 360 + 360) % 360 - 180, la)) ld += w; }
    }
    if (!tot) { const c = [(x0 + x1) / 2, (y0 + y1) / 2]; return at(((c[0] + 540) % 360 + 360) % 360 - 180, c[1]) ? 1 : 0; }
    return ld / tot;
  }
  return { fraction, warm() { if (!mask) build(); } };
}
