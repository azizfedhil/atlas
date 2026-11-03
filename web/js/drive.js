// Google Drive backup. Uses Google Identity Services (token flow) + Drive API v3 with the narrow `drive.file` scope, so the app can
// only touch the one backup file it created. The user supplies their own OAuth client ID (Google Cloud console -> Credentials ->
// OAuth client ID, type "Web application", with this app's origin added). Nothing is sent anywhere unless the backup is switched on.
const SCOPE = 'https://www.googleapis.com/auth/drive.file', KEY = 'cosmossi.drive';

export function createDrive({ onStatus }) {
  let cfg = { clientId: '', enabled: false, fileId: '' }, token = null, expires = 0, client = null, lastPush = 0, busy = false;
  try { Object.assign(cfg, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (_) {} };
  const say = (m, bad) => onStatus && onStatus(m, !!bad);

  const loadGsi = () => new Promise((res, rej) => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) return res();
    const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
    s.onload = () => res(); s.onerror = () => rej(new Error('could not load Google sign-in (offline?)'));
    document.head.appendChild(s);
  });
  /** interactive = may open Google's sign-in/consent popup (needs a click); otherwise tries a silent refresh */
  async function auth(interactive) {
    if (token && Date.now() < expires - 60000) return token;
    if (!cfg.clientId) throw new Error('enter your Google OAuth client ID first');
    await loadGsi();
    return new Promise((resolve, reject) => {
      client = window.google.accounts.oauth2.initTokenClient({
        client_id: cfg.clientId, scope: SCOPE,
        callback: (r) => { if (r.error) return reject(new Error(r.error_description || r.error)); token = r.access_token; expires = Date.now() + (r.expires_in || 3600) * 1000; resolve(token); },
        error_callback: (e) => reject(new Error(e && e.type === 'popup_closed' ? 'sign-in window closed' : (e && e.message) || 'sign-in failed')),
      });
      client.requestAccessToken({ prompt: interactive ? 'consent' : '' });
    });
  }
  const multipart = (meta, json) => {
    const b = 'cosmossi' + Math.random().toString(36).slice(2);
    return { type: `multipart/related; boundary=${b}`, body: `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${json}\r\n--${b}--` };
  };
  async function upload(json, name) {
    const meta = { name: `${name}.cosmap`, mimeType: 'application/json' };
    const send = (id) => { const m = multipart(meta, json);
      return fetch(`https://www.googleapis.com/upload/drive/v3/files${id ? '/' + id : ''}?uploadType=multipart&fields=id`, { method: id ? 'PATCH' : 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': m.type }, body: m.body }); };
    let r = await send(cfg.fileId);
    if (r.status === 404 && cfg.fileId) { cfg.fileId = ''; r = await send(''); }       // the backup was deleted in Drive: make a new one
    if (r.status === 401) { token = null; throw new Error('Google session expired'); }
    if (!r.ok) throw new Error('Drive said ' + r.status);
    cfg.fileId = (await r.json()).id; save();
  }
  /** back up now. `interactive` = user clicked something (a sign-in popup is allowed). `minGapMs` throttles automatic pushes. */
  async function push(json, name, { interactive = false, minGapMs = 0 } = {}) {
    if (!cfg.enabled || busy || Date.now() - lastPush < minGapMs) return false;
    busy = true;
    try {
      await auth(interactive); await upload(json, name); lastPush = Date.now();
      say('Backed up to Google Drive at ' + new Date().toLocaleTimeString()); return true;
    } catch (e) { say('Drive backup failed: ' + (e.message || e) + (interactive ? '' : ' - press "Connect" to sign in again'), true); return false; }
    finally { busy = false; }
  }
  return {
    get config() { return cfg; },
    set(patch) { Object.assign(cfg, patch); save(); },
    connect: async (json, name) => { cfg.enabled = true; save(); return push(json, name, { interactive: true }); },
    push,
    get signedIn() { return !!token && Date.now() < expires; },
  };
}
