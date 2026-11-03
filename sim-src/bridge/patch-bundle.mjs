// Patches the PREBUILT, minified web/sim/import-main.js so it calls into cosmossi-bridge.js. (When you rebuild the globe from
// sim-src with `npm run build`, the same three hooks come from the source files instead: js/planet-mesh.js, js/export-generate.js,
// js/import-main.js, so this script is only for the bundle that ships without a build step.) Safe to run twice.
//   node sim-src/bridge/patch-bundle.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../web/sim/import-main.js');
let s = fs.readFileSync(file, 'utf8');
if (s.includes('/*cosmossi-hooks*/')) { console.log('already patched'); process.exit(0); }
const must = (re, what) => { const m = s.match(re); if (!m) { console.error('anchor not found: ' + what); process.exit(1); } return m; };

// 1. the globe material factory: every material goes through the bridge (it adds the overlay shader)
{
  const m = must(/function (\w+)\((\w)\)\{if\(\2\)return new (\w+)\(\{vertexColors:!0\}\);let (\w)=new (\w+)\(\{vertexColors:!0\}\);return \4\.onBeforeCompile=/, 'globe material factory');
  s = s.replace(m[0], `/*cosmossi-hooks*/function ${m[1]}(${m[2]}){let m=${m[1]}$0(${m[2]});try{globalThis.__cosmossi&&globalThis.__cosmossi.material&&globalThis.__cosmossi.material(m)}catch(e){}return m}function ${m[1]}$0(${m[2]}){if(${m[2]})return new ${m[3]}({vertexColors:!0});let ${m[4]}=new ${m[5]}({vertexColors:!0});return ${m[4]}.onBeforeCompile=`);
}
// 2. the export adapter: colour maps get the countries
{
  const m = must(/return (\w+)\(\{host:document\.getElementById\("exportCard"\),overlay:document\.getElementById\("exportOverlay"\),catalogue:(\w+),adapter:(\w+),/, 'export panel');
  s = s.replace(m[0], `return (globalThis.__cosmossi&&globalThis.__cosmossi.wrapAdapter&&globalThis.__cosmossi.wrapAdapter(${m[3]}),${m[1]})({host:document.getElementById("exportCard"),overlay:document.getElementById("exportOverlay"),catalogue:${m[2]},adapter:${m[3]},`);
}
// 3. the page's internals, handed over at the very end of the module (all of these are top-level names of the bundle)
{
  const rend = must(/var (\w+)=document\.getElementById\("canvas"\),(\w+)=new (\w+)\(\{canvas:\1,antialias:!0\}\)/, 'renderer');
  const scene = must(new RegExp(`var (\\w+)=new (\\w+);\\1\\.background=new \\w+\\(197384\\);var (\\w+)=new \\w+\\(50,innerWidth/innerHeight,\\.1,200\\)`), 'scene / camera');
  const ctrl = must(new RegExp(`var (\\w+)=new \\w+\\(${scene[3]},${rend[1]}\\);\\1\\.enableDamping=!0`), 'controls');
  const prev = must(/(\w+)\.render\((\w+),(\w+)\.mapMode\?(\w+):(\w+)\)/, 'preview helper (state, map camera)');
  const tex = must(/(\w+)=class (\w+) extends \w+\{constructor\(t=\2\.DEFAULT_IMAGE/, 'Texture class');
  // the classes of the flat-map overlay quad (the plane map-projection.js builds: new Mesh(new PlaneGeometry(1,1),new ShaderMaterial({uniforms:{map:...)
  const quad = must(/new (\w+)\(new (\w+)\(1,1\),new (\w+)\(\{uniforms:\{map:/, 'plane classes');
  s = s.replace(/\s*$/, '') + `;globalThis.__cosmossi&&globalThis.__cosmossi.attach&&globalThis.__cosmossi.attach({renderer:${rend[2]},scene:${scene[1]},camera:${scene[3]},ctrl:${ctrl[1]},canvas:${rend[1]},state:${prev[3]},mapCamera:${prev[4]},Texture:${tex[1]},Mesh:${quad[1]},PlaneGeometry:${quad[2]},ShaderMaterial:${quad[3]}});\n`;
}
fs.writeFileSync(file, s);
console.log('patched', file);
