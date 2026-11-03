// node tools/test_polish.mjs -- static wiring/accessibility checks on index.html, app.js and app.css (no browser needed).
import { readFileSync } from 'node:fs';
const rd = (p) => readFileSync(new URL('../web/' + p, import.meta.url), 'utf8');
const html = rd('index.html'), js = rd('js/app.js'), css = rd('css/app.css');
let fail = 0, checks = 0; const ok = (c, m) => { checks++; if (!c) { fail++; console.log('FAIL', m); } };

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
ok(new Set(ids).size === ids.length, 'ids are unique: ' + ids.filter((x, i) => ids.indexOf(x) !== i).join(','));
// every #id that app.js looks up exists in the HTML (ids created at runtime are listed here)
const runtime = new Set(['insStats', 'lifeSum', 'insDelete']);   // created by renderInspector()
const used = new Set([...js.matchAll(/\$\('#([A-Za-z][\w-]*)'\)/g)].map((m) => m[1]));
for (const u of used) ok(ids.includes(u) || runtime.has(u), `app.js uses #${u} which is missing from index.html`);
// every button has an accessible name: text, aria-label or title
for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
  const named = /aria-label="[^"]+"|title="[^"]+"/.test(m[1]) || m[2].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim().length > 0;
  ok(named, 'unnamed button: ' + m[0].slice(0, 70));
}
ok(/prefers-reduced-motion: reduce/.test(css), 'reduced-motion rule present');
ok(/:focus-visible/.test(css), 'focus-visible style present');
ok(/id="mbTotal"[^>]*aria-live/.test(html), 'measure readout is a live region');
ok(/role="dialog"/.test(html) && /id="helpBox"/.test(html), 'help dialog present');
ok(!/\.innerHTML\s*=\s*[^;]*(\.value|e\.target)/.test(js), 'no raw input assigned to innerHTML');
// every script/stylesheet the page references exists
for (const m of html.matchAll(/(?:src|href)="((?:js|css|tex|data)\/[^"]+)"/g)) { try { rd(m[1]); ok(true); } catch { ok(false, 'missing asset ' + m[1]); } }
console.log(fail ? `${fail} of ${checks} checks FAILED` : `all ${checks} polish checks passed`); process.exit(fail ? 1 : 0);
