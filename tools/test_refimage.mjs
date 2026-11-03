// node tools/test_refimage.mjs -- reference-image helpers + static wiring checks (shader, renderer, HTML, app). No GPU needed.
import { readFileSync } from 'node:fs';
import { fitTextureSize, aspectWarning, opacityFromPercent, DEFAULT_OPACITY } from '../web/js/refimage.js';
const rd = (p) => readFileSync(new URL('../web/' + p, import.meta.url), 'utf8');
let fail = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const throws = (f, m) => { checks++; try { f(); fail++; console.log('FAIL no throw', m); } catch (e) { if (!(e instanceof RangeError)) { fail++; console.log('FAIL type', m); } } };

eq(fitTextureSize(4096, 2048, 8192), [4096, 2048], 'fits as is');
eq(fitTextureSize(16384, 8192, 8192), [8192, 4096], 'downscaled keeping 2:1');
eq(fitTextureSize(10000, 3000, 4096), [4096, 1229], 'wide image');
eq(fitTextureSize(1, 1, 8192), [1, 1], 'tiny');
eq(fitTextureSize(20000, 1, 8192), [8192, 1], 'never below one pixel');
throws(() => fitTextureSize(0, 10, 100), 'zero width'); throws(() => fitTextureSize(10, 10, 0), 'no limit');
ok(aspectWarning(4096, 2048) === '' && aspectWarning(2000, 1000) === '' && aspectWarning(2048, 1030) === '', 'near 2:1 is accepted silently');
ok(/not 2:1/.test(aspectWarning(1000, 1000)) && /1000×1000/.test(aspectWarning(1000, 1000)), 'square image warns');
ok(/not 2:1/.test(aspectWarning(3000, 1000)), '3:1 warns');
eq([opacityFromPercent(50), opacityFromPercent(0), opacityFromPercent(100), opacityFromPercent(150), opacityFromPercent(-5)], [0.5, 0, 1, 1, 0], 'opacity clamps');
ok(opacityFromPercent('abc') === 0.5 && opacityFromPercent('25') === 0.25, 'opacity parses strings, falls back to 50%');
ok(DEFAULT_OPACITY === 50, 'default opacity is 50%');

// static wiring
const sh = rd('js/shaders.js'), rn = rd('js/renderer.js'), html = rd('index.html'), app = rd('js/app.js');
ok(/uniform sampler2D uRef;/.test(sh) && /uniform float uRefA;/.test(sh) && /textureGrad\(uRef, uv, ddx, ddy\)/.test(sh), 'shader samples the reference with the map\'s own uv');
ok(sh.indexOf('uRefA > 0.0') > sh.indexOf('// ink coastline'), 'reference is blended after shading (on top of the map)');
ok(/rc\.a \* uRefA/.test(sh), 'reference alpha channel is honoured');
ok(/gl\.uniform1i\(U\.uRef, 2\)/.test(rn) && /TEXTURE2/.test(rn) && /'uRef', 'uRefA'/.test(rn), 'renderer uses texture unit 2');
ok(/setReference\(src\)/.test(rn) && /deleteTexture\(refTex\)/.test(rn), 'old reference texture is released');
ok(/refTex \? \(v\.refAlpha \|\| 0\) : 0/.test(rn), 'no reference -> alpha 0');
for (const id of ['refLoad', 'refClear', 'refShow', 'refOpacity', 'refOpVal', 'refName', 'refIn']) ok(html.includes(`id="${id}"`) && app.includes(`#${id}`), `#${id} in html and used by app.js`);
ok(/id="refOpacity"[^>]*value="50"/.test(html), 'opacity slider starts at 50%');
ok(/refAlpha: ref\.show \? ref\.opacity : 0/.test(app), 'render passes refAlpha');
// texture colours
console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} reference-image checks passed`); process.exit(fail ? 1 : 0);
