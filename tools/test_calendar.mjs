// node tools/test_calendar.mjs -- calendar.js against the golden vectors (made by the ORIGINAL World-Units
// calendar math, see tools/golden_calendar.mjs) plus structural/property tests and error handling.
import { readFileSync } from 'node:fs';
import * as C from '../web/js/calendar.js';

let fail = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { if (++fail <= 25) console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const throws = (f, m) => { checks++; try { f(); fail++; console.log('FAIL (no throw)', m); } catch (e) { if (!(e instanceof RangeError)) { fail++; console.log('FAIL (wrong error type)', m, e); } } };

const G = JSON.parse(readFileSync(new URL('../crates/cosmossi-core/tests/calendar_golden.json', import.meta.url), 'utf8'));

// ---- golden vectors -------------------------------------------------------------------------------------
eq(C.anchorDayNumber(), G.anchorAbs, 'anchor day number');
for (const r of G.days) {
  const d = { era: r.era, year: r.year, month: r.month, day: r.day };
  const n = C.dateToDayNumber(d);
  eq(n, r.abs, `abs of ${r.code}`);
  eq(C.dayNumberToDate(r.abs), d, `date of #${r.abs}`);
  eq(C.weekdayIndex(r.abs), r.weekday, `weekday of ${r.code}`);
  eq(C.dayNumberToGregorian(r.abs), r.greg, `gregorian of ${r.code}`);
  eq(C.gregorianToDayNumber(...r.greg), r.abs, `from gregorian ${r.greg}`);
  eq(C.dateCode(d), r.code, 'code');
  if (r.long !== undefined) eq(C.longDate(d), r.long, 'long format');
}
for (const r of G.real) {
  eq(C.gregorianToDayNumber(...r.greg), r.abs, `real ${r.greg}`);
  eq(C.dayNumberToDate(r.abs), { era: r.era, year: r.year, month: r.month, day: r.day }, `real ${r.greg} -> date`);
}
for (const r of G.abs) {
  eq(C.dayNumberToDate(r.abs), { era: r.era, year: r.year, month: r.month, day: r.day }, `#${r.abs}`);
  const ye = C.yearsElapsed(r.era, r.year);
  eq(C.yearLength(ye), r.yearLength, `year length #${r.abs}`);
}

// ---- structure ------------------------------------------------------------------------------------------
eq(C.MONTHS.reduce((s, m) => s + m.days, 0), 365, 'common year length');
eq(C.MONTHS.length, 15, '15 months');
ok(C.isLeapYear(0) && C.isLeapYear(6) && !C.isLeapYear(1) && !C.isLeapYear(5), 'leap every 6th');
eq(C.monthLength(6, 15), 26, 'leap Sebolle'); eq(C.monthLength(7, 15), 25, 'common Sebolle'); eq(C.monthLength(6, 1), 24, 'only last month grows');
eq(C.dayNumberToDate(1), { era: 1, year: 0, month: 1, day: 1 }, 'day 1');
eq(C.dateToDayNumber({ era: 1, year: 0, month: 15, day: 26 }), 366, 'year 0 is a leap year');
eq(C.dayNumberToDate(C.dateToDayNumber({ era: 1, year: 999, month: 15, day: 25 }) + 1), { era: 2, year: 0, month: 1, day: 1 }, 'era rollover');
eq(C.dayNumberToGregorian(C.anchorDayNumber()), [2025, 1, 1], 'anchor gregorian');
eq(C.dayNumberToDate(C.anchorDayNumber()), C.ANCHOR_DATE, 'anchor date');
eq(C.dayNumberFromUnixMs(Date.UTC(2025, 0, 1, 23, 59, 59)), C.anchorDayNumber(), 'unix ms same day');
eq(C.dayNumberFromUnixMs(Date.UTC(2024, 11, 31, 23, 59, 59)), C.anchorDayNumber() - 1, 'unix ms previous day');

// ---- exhaustive round trip (first 1.5M day numbers, strictly increasing) --------------------------------
let prev = null;
for (let n = 1; n <= 1_500_000; n++) {
  const d = C.dayNumberToDate(n);
  if (C.dateToDayNumber(d) !== n) { ok(false, `round trip at ${n}`); break; }
  if (prev && C.compareDates(prev, d) >= 0) { ok(false, `ordering at ${n}`); break; }
  prev = d;
}
ok(true, 'round trip loop ran');

// ---- navigation ------------------------------------------------------------------------------------------
eq(C.addMonths({ era: 1, year: 999, month: 15, day: 3 }, 1), { era: 2, year: 0, month: 1, day: 3 }, 'addMonths era rollover');
eq(C.addMonths({ era: 2, year: 0, month: 1, day: 3 }, -1), { era: 1, year: 999, month: 15, day: 3 }, 'addMonths back');
eq(C.addMonths({ era: 1, year: 1, month: 2, day: 25 }, 1), { era: 1, year: 1, month: 3, day: 24 }, 'addMonths clamps');
eq(C.addDays({ era: 1, year: 6, month: 15, day: 26 }, 1), { era: 1, year: 7, month: 1, day: 1 }, 'leap day then new year');
eq(C.monthLayout(5, 300, 1).leadingBlanks, C.weekdayIndex(C.anchorDayNumber()), 'leading blanks');
eq(C.monthLayout(5, 302, 15).days, 26, 'layout leap Sebolle');

// ---- formatting / parsing --------------------------------------------------------------------------------
eq(C.dateCode(C.ANCHOR_DATE), '01/01/300-05', 'anchor code');
eq([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 24].map(C.ordinal), ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '24th'], 'ordinals');
eq(C.parseDateCode('1/1/300-5'), C.ANCHOR_DATE, 'parse unpadded'); eq(C.parseDateCode(' 01/01/300-05 '), C.ANCHOR_DATE, 'parse padded');
for (const bad of ['', '01/01/300', '01/01-5', 'aa/01/300-05', '-1/01/300-05', '30/01/300-05', '01/16/300-05', '01/01/1000-05', '01/01/300-0', '1//300-5', '01/01/300-05/1'])
  throws(() => C.parseDateCode(bad), `parse '${bad}'`);
eq(C.eraName(5), 'Modern Era', 'era 5'); eq(C.eraName(7), 'Uncharted Era', 'era 7'); eq(C.eraName(0), 'Uncharted Era', 'era 0');
eq(C.dayInfo(C.anchorDayNumber()).code, '01/01/300-05', 'dayInfo');

// ---- errors ----------------------------------------------------------------------------------------------
throws(() => C.dayNumberToDate(0), 'day 0'); throws(() => C.dayNumberToDate(-3), 'negative day');
throws(() => C.dayNumberToDate(1.5), 'fractional day'); throws(() => C.dayNumberToDate(C.maxDayNumber() + 1), 'past the end');
throws(() => C.dayNumberToDate(NaN), 'NaN');
throws(() => C.validateDate({ era: 0, year: 0, month: 1, day: 1 }), 'era 0'); throws(() => C.validateDate({ era: 1, year: 1000, month: 1, day: 1 }), 'year 1000');
throws(() => C.validateDate({ era: 1, year: 1, month: 16, day: 1 }), 'month 16'); throws(() => C.validateDate({ era: 1, year: 1, month: 1, day: 25 }), 'day 25 of a 24-day month');
throws(() => C.validateDate({ era: 1, year: 7, month: 15, day: 26 }), 'leap day in a common year');
throws(() => C.gregorianToDayNumber(2025, 2, 29), 'Feb 29 2025'); throws(() => C.gregorianToDayNumber(2025, 13, 1), 'month 13'); throws(() => C.gregorianToDayNumber(-5000, 1, 1), 'before calendar');
throws(() => C.addMonths({ era: 1, year: 0, month: 1, day: 1 }, -1), 'addMonths before start');
eq(C.maxDayNumber(), C.dateToDayNumber(C.dayNumberToDate(C.maxDayNumber())), 'max day number round trip');

console.log(fail ? `${fail} FAILED of ${checks} checks` : `calendar: all ${checks} checks passed`);
process.exit(fail ? 1 : 0);
