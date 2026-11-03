// node tools/check_release_config.mjs -- static release checks: versions agree, icons are real and complete,
// the installer config is what we ship, the CSP is strict, every asset the app fetches exists. No Rust or Windows needed.
import { readFileSync, existsSync, statSync } from 'node:fs';
const root = new URL('../', import.meta.url), rd = (p) => readFileSync(new URL(p, root));
const txt = (p) => rd(p).toString('utf8');
let fail = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { fail++; console.log('FAIL', m); } };

const conf = JSON.parse(txt('src-tauri/tauri.conf.json'));
const ver = (p) => (txt(p).match(/^version\s*=\s*"([^"]+)"/m) || [])[1];
ok(/^\d+\.\d+\.\d+$/.test(conf.version), 'version is plain semver (MSI needs numeric x.y.z): ' + conf.version);
ok(ver('src-tauri/Cargo.toml') === conf.version, `src-tauri/Cargo.toml version ${ver('src-tauri/Cargo.toml')} != tauri.conf.json ${conf.version}`);
ok(ver('crates/cosmossi-core/Cargo.toml') === conf.version, `core crate version ${ver('crates/cosmossi-core/Cargo.toml')} != ${conf.version}`);
ok(/^[a-z0-9]+(\.[a-z0-9-]+)+$/.test(conf.identifier) && !conf.identifier.endsWith('.app'), 'identifier is reverse-DNS and does not end in .app: ' + conf.identifier);
ok(conf.productName === 'Cosmossi Atlas' && conf.app.windows[0].title === conf.productName, 'product name / window title');
ok(existsSync(new URL('src-tauri/' + conf.build.frontendDist, root)) && existsSync(new URL('web/index.html', root)), 'frontendDist exists');

const b = conf.bundle;
ok(b.active === true && Array.isArray(b.targets) && b.targets.includes('nsis') && b.targets.includes('msi'), 'bundle targets are nsis + msi');
for (const k of ['publisher', 'copyright', 'shortDescription', 'longDescription', 'category']) ok(typeof b[k] === 'string' && b[k].length > 3, 'bundle.' + k);
const fa = (b.fileAssociations || [])[0];
ok(fa && fa.ext.includes('cosmap') && fa.name && fa.description, '.cosmap file association');
ok(b.windows && b.windows.digestAlgorithm === 'sha256', 'sha256 digest');
ok(b.windows && b.windows.webviewInstallMode && b.windows.webviewInstallMode.type, 'WebView2 install mode set');
ok(b.windows && b.windows.nsis && ['currentUser', 'perMachine', 'both'].includes(b.windows.nsis.installMode), 'nsis installMode');

// icons
const png = (p) => { const d = rd('src-tauri/' + p); const sig = d.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); return sig ? [d.readUInt32BE(16), d.readUInt32BE(20)] : null; };
for (const i of b.icon) ok(existsSync(new URL('src-tauri/' + i, root)) && statSync(new URL('src-tauri/' + i, root)).size > 500, 'icon exists: ' + i);
ok(JSON.stringify(png('icons/32x32.png')) === '[32,32]', '32x32.png is 32x32');
ok(JSON.stringify(png('icons/128x128.png')) === '[128,128]', '128x128.png is 128x128');
ok(JSON.stringify(png('icons/128x128@2x.png')) === '[256,256]', '128x128@2x.png is 256x256');
const ico = rd('src-tauri/icons/icon.ico'), n = ico.readUInt16LE(4), sizes = [...Array(n)].map((_, i) => ico[6 + 16 * i] || 256);
ok(ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1, 'icon.ico header');
for (const s of [16, 32, 48, 256]) ok(sizes.includes(s), `icon.ico contains ${s}px (has ${sizes})`);

// CSP
const csp = conf.app.security.csp; ok(typeof csp === 'string', 'CSP is set (not null)');
if (typeof csp === 'string') {
  ok(/default-src 'self'/.test(csp) && /script-src 'self'(;|$)/.test(csp), "script-src is 'self' only");
  ok(!/unsafe-eval|script-src[^;]*unsafe-inline|\*/.test(csp), 'no unsafe-eval, no inline scripts, no wildcards');
  ok(/connect-src[^;]*ipc:/.test(csp) && /connect-src[^;]*http:\/\/ipc\.localhost/.test(csp), 'Tauri IPC allowed in connect-src');
  ok(/img-src[^;]*blob:/.test(csp), 'img-src allows blob: (PNG fallback decoder)');
}
// the page must not need what the CSP forbids
const html = txt('web/index.html');
ok(!/<script(?![^>]*\bsrc=)[^>]*>/.test(html), 'index.html has no inline <script>');
ok(!/\son\w+="/.test(html), 'index.html has no inline event handlers');
ok(!/https?:\/\//.test(html.replace(/<!--[\s\S]*?-->/g, '')), 'index.html loads nothing from the network');
// everything the app fetches exists
const app = txt('web/js/app.js');
for (const m of app.matchAll(/(?:biomeUrl|auxUrl):\s*'([^']+)'|loadVectors\('([^']+)'\)/g)) { const p = m[1] || m[2]; ok(existsSync(new URL('web/' + p, root)), 'asset exists: ' + p); }
ok(/__TAURI__/.test(app) && conf.app.withGlobalTauri === true, 'withGlobalTauri matches app.js usage');
// backend wiring
const main = txt('src-tauri/src/main.rs');
ok(/fn startup_file\b/.test(main) && /startup_file\]/.test(main) && /startup_file/.test(app), 'startup_file command defined, registered and used');
ok(/windows_subsystem = "windows"/.test(main), 'no console window in release builds');
ok(/\[profile\.release\][\s\S]*lto = true/.test(txt('Cargo.toml')), 'release profile is optimised');
ok(/dialog:default/.test(txt('src-tauri/capabilities/default.json')), 'dialog permission granted');
console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} release-config checks passed`); process.exit(fail ? 1 : 0);
