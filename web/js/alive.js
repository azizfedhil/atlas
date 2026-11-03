// Only used by the launcher (tools/serve.mjs): tells it this window is open, so it can stop when the last one closes.
// Does nothing in the installed desktop app (Tauri) or when the page is opened from anywhere else.
if (location.protocol === 'http:' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !window.__TAURI__) {
  const id = Math.random().toString(36).slice(2);
  const ping = () => fetch(`/__alive?id=${id}`, { cache: 'no-store', keepalive: true }).catch(() => {});
  ping(); setInterval(ping, 10000);
  window.addEventListener('pagehide', () => { try { navigator.sendBeacon(`/__bye?id=${id}`); } catch (e) { /* the server times the page out */ } });
  window.addEventListener('pageshow', (e) => { if (e.persisted) ping(); });
}
