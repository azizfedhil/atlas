// node tools/golden_calendar.mjs <path/to/World-Units/index.html>
//   -> crates/cosmossi-core/tests/calendar_golden.json
//
// Independent oracle: instead of using web/js/calendar.js (which would test the port against itself), this
// executes the ORIGINAL calendar math from the World-Units calendar page (the DATA + CALENDAR MATH sections
// of its <script>, unmodified) in a sandbox and records its answers. Rust and the JS port must reproduce them.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const htmlPath = process.argv[2];
if (!htmlPath) { console.error('usage: node tools/golden_calendar.mjs <World-Units/index.html>'); process.exit(1); }
const html = readFileSync(htmlPath, 'utf8');
const a = html.indexOf('/* ================= DATA ================= */');
const b = html.indexOf('/* ================= MOONS');
if (a < 0 || b < a) throw new Error('could not find the DATA..MOONS section in the page script');
const src = html.slice(a, b);
const O = vm.runInNewContext(`(function(){ "use strict"; ${src}
  return { fictionalAbsoluteDay, absoluteDayToFictional, weekdayIndexOf, realToFictional, fictionalToReal,
           fictionalDateCode, fullFictionalDate, monthsForYear, yearsElapsedTotal, isLeapYear, yearLength, ANCHOR_ABS }; })()`, { Date, Math, String, Number });

const ymd = (d) => [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
const row = (era, year, monthIdx, day, withLong = true) => {
  const abs = O.fictionalAbsoluteDay(year, era, monthIdx, day);
  return { era, year, month: monthIdx + 1, day, abs, weekday: O.weekdayIndexOf(abs),
           greg: ymd(O.fictionalToReal(year, era, monthIdx, day)),
           code: O.fictionalDateCode(year, era, monthIdx, day), ...(withLong ? { long: O.fullFictionalDate(year, era, monthIdx, day) } : {}) };
};

// 1) every day of a set of years chosen to hit leap years, era boundaries and the anchor
const years = [[1,0],[1,5],[1,6],[1,7],[1,999],[2,0],[2,2],[5,299],[5,300],[5,302],[5,999],[6,0],[12,17]];
const days = [];
for (const [era, year] of years) {
  const ms = O.monthsForYear(O.yearsElapsedTotal(era, year));
  ms.forEach((m, mi) => { for (let d = 1; d <= m.days; d++) days.push(row(era, year, mi, d, d === 1 || d === m.days || d % 7 === 0)); });
}
// 2) real date -> fictional, every 53 days over 1700..2400 plus the awkward days
const real = [];
for (let t = Date.UTC(1700, 0, 1); t < Date.UTC(2400, 0, 1); t += 53 * 86400000) {
  const f = O.realToFictional(t), dt = new Date(t);
  real.push({ greg: ymd(dt), era: f.era, year: f.yearInEra, month: f.monthIdx + 1, day: f.day, abs: O.fictionalAbsoluteDay(f.yearInEra, f.era, f.monthIdx, f.day) });
}
for (const g of [[2024,2,29],[2025,1,1],[2025,12,31],[2026,1,1],[2100,3,1],[2000,2,29],[1999,12,31],[1900,3,1],[1600,2,29]]) {
  const t = Date.UTC(g[0], g[1] - 1, g[2]), f = O.realToFictional(t);
  real.push({ greg: g, era: f.era, year: f.yearInEra, month: f.monthIdx + 1, day: f.day, abs: O.fictionalAbsoluteDay(f.yearInEra, f.era, f.monthIdx, f.day) });
}
// 3) absolute day -> fictional for spread-out day numbers (incl. exact year/era boundaries)
const abs = [];
const picks = new Set([1, 2, 365, 366, 367, 368, 731, 1000, 100000, 365243, 1000000, O.ANCHOR_ABS - 1, O.ANCHOR_ABS, O.ANCHOR_ABS + 1, 2000000, 4000000]);
for (let i = 0; i < 400; i++) picks.add(1 + Math.floor((i * 7919 * 4999) % 4000000));
for (const n of picks) { const f = O.absoluteDayToFictional(n); abs.push({ abs: n, era: f.era, year: f.yearInEra, month: f.monthIdx + 1, day: f.day, yearLength: f.yearLength, dayOfYear: f.dayOfYear }); }

const out = { source: 'World-Units index.html calendar math', anchorAbs: O.ANCHOR_ABS, days, real, abs };
writeFileSync(new URL('../crates/cosmossi-core/tests/calendar_golden.json', import.meta.url), JSON.stringify(out));
console.log(`wrote ${days.length} day rows, ${real.length} real-date rows, ${abs.length} day-number rows; anchor day number ${O.ANCHOR_ABS}`);
