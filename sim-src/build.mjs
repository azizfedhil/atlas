// Rebuild the 3D globe: cd sim-src && npm install && npm run build   (writes ../web/sim/import-main.js and planet-worker.js)
import { build } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
const here = path.resolve('.');
const out = path.resolve('../web/sim');
const common = {
  bundle: true, format: 'esm', target: 'es2022', minify: true, legalComments: 'none', logLevel: 'warning',
  alias: { 'three/addons': path.join(here, 'node_modules/three/examples/jsm') },
};
await build({ ...common, entryPoints: ['js/import-main.js'], outfile: path.join(out, 'import-main.js') });
await build({ ...common, entryPoints: ['js/planet-worker.js'], outfile: path.join(out, 'planet-worker.js') });
for (const f of ['index.html', 'styles.css']) fs.copyFileSync(f, path.join(out, f));
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const f of fs.readdirSync('fonts')) fs.copyFileSync(path.join('fonts', f), path.join(out, 'fonts', f));   // Archivo
fs.copyFileSync('js/support-check.js', path.join(out, 'support-check.js'));
fs.copyFileSync('bridge/cosmossi-bridge.js', path.join(out, 'cosmossi-bridge.js'));   // the atlas <-> globe bridge (not bundled: plain readable file)
fs.copyFileSync('bridge/cosmossi-sun.js', path.join(out, 'cosmossi-sun.js'));   // the optional sun / day-night simulation (plain file, not bundled)
console.log('3D globe rebuilt in', out);
