// Cosmossi Atlas launcher (no dependencies): serves ./web on http://localhost:5173 and opens it in its OWN app window
// (Edge / Chrome / Brave / Chromium in "app mode": no tabs, no address bar, its own taskbar entry).
// It stops by itself when the last atlas window is closed.
//   node tools/serve.mjs [port] [--browser] [--no-open] [--keep]
//   --browser  open the default browser (a normal tab) instead of an app window
//   --no-open  only serve (development)       --keep  never stop by itself
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, exec } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'web');
const args = process.argv.slice(2), flag = (f) => args.includes(f);
const port = +args.find((a) => /^\d+$/.test(a)) || 5173;
const url = `http://localhost:${port}/`;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.bin': 'application/octet-stream', '.wasm': 'application/wasm', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
};

// ---- which atlas windows are open: every page pings /__alive?id=..., and says /__bye?id=.. when it closes ----
const pages = new Map();                       // id -> last ping (ms)
let everSeen = false, byeTimer = null, started = Date.now();
const PING_TIMEOUT = 150e3;                    // a minimised window's timers can sleep for a minute: be patient
const live = () => { const t = Date.now(); for (const [id, at] of pages) if (t - at > PING_TIMEOUT) pages.delete(id); return pages.size; };
function maybeQuit(grace) {
  if (flag('--keep') || flag('--no-open') || !everSeen) return;
  clearTimeout(byeTimer);
  byeTimer = setTimeout(() => { if (!live()) { console.log('\n  Atlas window closed. Stopping.\n'); process.exit(0); } }, grace);   // grace: a reload says bye and pings again a moment later
}
setInterval(() => {
  if (flag('--keep') || flag('--no-open')) return;
  if (!everSeen && Date.now() - started > 90e3) { console.log('\n  No atlas window opened. Stopping.\n'); process.exit(0); }
  if (everSeen && !live()) maybeQuit(1000);
}, 5000).unref();

const server = http.createServer((req, res) => {
  let u;
  try { u = new URL(req.url, 'http://x'); } catch { res.writeHead(400).end('bad request'); return; }
  if (u.pathname === '/__alive') { pages.set(u.searchParams.get('id') || '?', Date.now()); everSeen = true; clearTimeout(byeTimer); res.writeHead(204).end(); return; }
  if (u.pathname === '/__bye') { pages.delete(u.searchParams.get('id') || '?'); res.writeHead(204).end(); if (!live()) maybeQuit(4000); return; }
  if (u.pathname === '/__id') { res.writeHead(200, { 'Content-Type': 'text/plain' }).end('cosmossi-atlas'); return; }
  let p;
  try { p = decodeURIComponent(u.pathname); } catch { res.writeHead(400).end('bad request'); return; }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.resolve(root, '.' + p);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('forbidden'); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found: ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Content-Length': st.size });
    fs.createReadStream(file).pipe(res);
  });
});

// ---- the window ----
const exists = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
function onPath(names) {
  for (const dir of (process.env.PATH || '').split(path.delimiter)) for (const n of names) { const f = path.join(dir, n); if (dir && exists(f)) return f; }
  return null;
}
function findAppBrowser() {
  const env = process.env, home = os.homedir();
  if (process.platform === 'win32') {
    const roots = [env.ProgramFiles, env['ProgramFiles(x86)'], env.LOCALAPPDATA].filter(Boolean);
    const rel = ['Microsoft\\Edge\\Application\\msedge.exe', 'Google\\Chrome\\Application\\chrome.exe', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe', 'Chromium\\Application\\chrome.exe'];
    for (const r of rel) for (const base of roots) { const f = path.join(base, r); if (exists(f)) return f; }
    return null;
  }
  if (process.platform === 'darwin') {
    for (const a of ['Microsoft Edge', 'Google Chrome', 'Brave Browser', 'Chromium']) { const f = `/Applications/${a}.app/Contents/MacOS/${a}`; if (exists(f)) return f; const g = path.join(home, f); if (exists(g)) return g; }
    return null;
  }
  return onPath(['microsoft-edge', 'microsoft-edge-stable', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'brave-browser']);
}
const profileDir = () => process.platform === 'win32' ? path.join(env('LOCALAPPDATA') || os.homedir(), 'CosmossiAtlas', 'profile')
  : process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Application Support', 'CosmossiAtlas', 'profile')
  : path.join(env('XDG_CONFIG_HOME') || path.join(os.homedir(), '.config'), 'cosmossi-atlas', 'profile');
function env(k) { return process.env[k]; }

function openDefaultBrowser() {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}
function openWindow() {
  if (flag('--no-open')) return;
  const b = flag('--browser') ? null : findAppBrowser();
  if (!b) { if (!flag('--browser')) console.log('  (No Edge/Chrome found for an app window: opening your default browser instead.)'); openDefaultBrowser(); return; }
  // its own profile folder: the atlas keeps its settings between runs, and never mixes with your everyday browser
  const dir = profileDir(); try { fs.mkdirSync(dir, { recursive: true }); } catch {}
  const child = spawn(b, [`--app=${url}`, `--user-data-dir=${dir}`, '--window-size=1440,900', '--no-first-run', '--no-default-browser-check', '--disable-features=Translate,msEdgeSidebar'], { stdio: 'ignore', detached: false });
  child.on('error', () => openDefaultBrowser());
  child.on('exit', () => maybeQuit(4000));
}

server.on('error', (e) => {
  if (e.code !== 'EADDRINUSE') { console.error(e.message); process.exit(1); }
  // the atlas is already running (a second double-click): just open another window on it
  http.get({ host: '127.0.0.1', port, path: '/__id', timeout: 1500 }, (r) => {
    let b = ''; r.on('data', (d) => (b += d)); r.on('end', () => {
      if (b === 'cosmossi-atlas') { console.log('  The atlas is already running: opening a window on it.'); openWindow(); setTimeout(() => process.exit(0), 1500); }
      else { console.error(`  Port ${port} is used by something else. Run: node tools/serve.mjs ${port + 1}`); process.exit(1); }
    });
  }).on('error', () => { console.error(`  Port ${port} is busy. Run: node tools/serve.mjs ${port + 1}`); process.exit(1); });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`\n  Cosmossi Atlas is running at ${url}\n  It opens in its own window and stops when you close that window.\n`);
  started = Date.now(); openWindow();
});
