// Cosmossi calendar. Mirrors crates/cosmossi-core/src/calendar.rs (the Rust core is the authority;
// tools/test_calendar.mjs and the Rust tests check both against the same golden vectors).
//
// 15 months of 24/25 days, a 6-day week, eras of 1000 years, a leap day appended to the last month every
// 6th year (years counted continuously across eras from year 0 of era 1).
// Anchor: Gregorian 2025-01-01 (UTC) = 1 Çuanede, year 300, era 5.
//
// DAY NUMBERS: 1 = 1 Çuanede, year 0, era 1. They are plain integers (safe in a double up to 2^53) and are
// what the project file stores and the timeline slider moves along.
// Months are 1-based (1..15), like the printed date code DD/MM/YYY-EE.

export const MONTHS = [
  ['Çuanede', 24], ['Febreo', 25], ['Asurro', 24], ['Neisanne', 25], ['Açarra', 25],
  ['Sebina', 24], ['Primechelli', 24], ['Rania', 24], ['Maiossa', 24], ['Avessu', 24],
  ['Edusechelli', 24], ['Primeneimalle', 25], ['Primelaure', 24], ['Novum', 24], ['Sebolle', 25],
].map(([name, days]) => ({ name, days }));

export const WEEKDAYS = [
  { name: 'Caçe', icon: '☽' }, { name: 'Cheçe', icon: '☀' }, { name: 'Marçe', icon: '' },
  { name: 'Nerçe', icon: '' }, { name: 'Talçe', icon: '' }, { name: 'Sivaçe', icon: '' },
];

export const ERA_NAMES = ['Pre-Civilization Era', 'Rise of Sivasta', "Sivasta's Ascendancy", 'Medieval Era', 'Modern Era', 'Post-Modern Era'];
export const eraName = (era) => (Number.isInteger(era) && era >= 1 && era <= ERA_NAMES.length ? ERA_NAMES[era - 1] : 'Uncharted Era');

export const MONTHS_PER_YEAR = 15;
export const YEARS_PER_ERA = 1000;
export const LEAP_INTERVAL_YEARS = 6;
export const DAYS_PER_WEEK = 6;
export const BASE_YEAR_LENGTH = 365;
export const MAX_ERA = 9999;
export const ANCHOR_GREGORIAN = [2025, 1, 1];
export const ANCHOR_DATE = { era: 5, year: 300, month: 1, day: 1 };

const isInt = Number.isInteger;
const fail = (msg) => { throw new RangeError(msg); };

// ---- year / month structure ------------------------------------------------------------------------
export const yearsElapsed = (era, year) => (era - 1) * YEARS_PER_ERA + year;
export const isLeapYear = (ye) => ((ye % LEAP_INTERVAL_YEARS) + LEAP_INTERVAL_YEARS) % LEAP_INTERVAL_YEARS === 0;
export const yearLength = (ye) => BASE_YEAR_LENGTH + (isLeapYear(ye) ? 1 : 0);
export function monthLength(ye, month) {
  if (!isInt(month) || month < 1 || month > MONTHS_PER_YEAR) fail(`month ${month} is out of range (1 to 15)`);
  return MONTHS[month - 1].days + (month === MONTHS_PER_YEAR && isLeapYear(ye) ? 1 : 0);
}
const leapCountBefore = (y) => (y > 0 ? Math.floor((y - 1) / LEAP_INTERVAL_YEARS) + 1 : 0);
const cumulativeDaysBeforeYear = (y) => BASE_YEAR_LENGTH * y + leapCountBefore(y);

// ---- dates -------------------------------------------------------------------------------------------
/** Throws RangeError with a human-readable message when the date does not exist. */
export function validateDate({ era, year, month, day }) {
  if (!isInt(era) || era < 1 || era > MAX_ERA) fail(`era ${era} is out of range (1 to ${MAX_ERA})`);
  if (!isInt(year) || year < 0 || year >= YEARS_PER_ERA) fail(`year ${year} is out of range (0 to 999)`);
  const max = monthLength(yearsElapsed(era, year), month);
  if (!isInt(day) || day < 1 || day > max) fail(`day ${day} does not exist in ${MONTHS[month - 1].name} (1 to ${max})`);
}
export function isValidDate(d) { try { validateDate(d); return true; } catch { return false; } }

export const maxDayNumber = () => { const y = yearsElapsed(MAX_ERA, 999); return cumulativeDaysBeforeYear(y) + yearLength(y); };

export function dateToDayNumber(d) {
  validateDate(d);
  const y = yearsElapsed(d.era, d.year);
  let before = 0;
  for (let m = 1; m < d.month; m++) before += monthLength(y, m);
  return cumulativeDaysBeforeYear(y) + before + d.day;
}

export function dayNumberToDate(n) {
  if (!isInt(n)) fail(`day number ${n} is not an integer`);
  if (n < 1) fail(`day number ${n} is before the start of the calendar (day 1 = 1 Çuanede, 000-1)`);
  if (n > maxDayNumber()) fail(`day number ${n} is beyond the end of era ${MAX_ERA}`);
  let y = Math.floor(((n - 1) * LEAP_INTERVAL_YEARS) / (BASE_YEAR_LENGTH * LEAP_INTERVAL_YEARS + 1));
  while (cumulativeDaysBeforeYear(y + 1) < n) y++;
  while (y > 0 && cumulativeDaysBeforeYear(y) >= n) y--;
  let remaining = n - cumulativeDaysBeforeYear(y);
  const era = Math.floor(y / YEARS_PER_ERA) + 1;
  const year = y - (era - 1) * YEARS_PER_ERA;
  let month = 1;
  for (; month < MONTHS_PER_YEAR; month++) {
    const len = monthLength(y, month);
    if (remaining <= len) break;
    remaining -= len;
  }
  return { era, year, month, day: remaining };
}

/** 0 = Caçe. Works for any integer. */
export const weekdayIndex = (n) => (((n - 1) % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK;
export const weekdayOf = (n) => WEEKDAYS[weekdayIndex(n)];

export const addDays = (d, delta) => dayNumberToDate(dateToDayNumber(d) + delta);

/** Whole-month move; the day is clamped to the target month's length. */
export function addMonths(d, delta) {
  validateDate(d);
  const total = yearsElapsed(d.era, d.year) * MONTHS_PER_YEAR + (d.month - 1) + delta;
  if (total < 0) fail('that is before the start of the calendar');
  const y = Math.floor(total / MONTHS_PER_YEAR), month = (total % MONTHS_PER_YEAR) + 1;
  const era = Math.floor(y / YEARS_PER_ERA) + 1;
  if (era > MAX_ERA) fail(`era ${era} is out of range (1 to ${MAX_ERA})`);
  return { era, year: y - (era - 1) * YEARS_PER_ERA, month, day: Math.min(d.day, monthLength(y, month)) };
}

/** Layout of one month for a 6-column grid. */
export function monthLayout(era, year, month) {
  validateDate({ era, year, month, day: 1 });
  const y = yearsElapsed(era, year), n = dateToDayNumber({ era, year, month, day: 1 });
  return { days: monthLength(y, month), leadingBlanks: weekdayIndex(n), leapYear: isLeapYear(y), firstDayNumber: n };
}

/** Chronological comparison of two date objects. */
export const compareDates = (a, b) => a.era - b.era || a.year - b.year || a.month - b.month || a.day - b.day;

// ---- formatting / parsing -----------------------------------------------------------------------------
const pad = (n, w) => String(n).padStart(w, '0');
export const dateCode = (d) => `${pad(d.day, 2)}/${pad(d.month, 2)}/${pad(d.year, 3)}-${pad(d.era, 2)}`;
export function ordinal(n) {
  const m100 = n % 100, m10 = n % 10;
  if (m100 >= 11 && m100 <= 13) return n + 'th';
  return n + (m10 === 1 ? 'st' : m10 === 2 ? 'nd' : m10 === 3 ? 'rd' : 'th');
}
export function longDate(d) {
  const wd = weekdayOf(dateToDayNumber(d)).name;
  return `${wd}, the ${ordinal(d.day)} of ${MONTHS[d.month - 1].name}, ${pad(d.year, 3)}-${d.era}`;
}
/** Parse DD/MM/YYY-EE (padding optional). Throws RangeError on anything that is not a real date. */
export function parseDateCode(s) {
  const m = /^\s*(\d+)\/(\d+)\/(\d+)-(\d+)\s*$/.exec(String(s));
  if (!m) fail(`'${s}' is not a date in DD/MM/YYY-EE form`);
  const d = { era: +m[4], year: +m[3], month: +m[2], day: +m[1] };
  validateDate(d);
  return d;
}

// ---- Gregorian (proleptic, whole UTC days; no Date object so any year works) -----------------------------
export function daysFromCivil(y, m, d) {
  y = m <= 2 ? y - 1 : y;
  const era = Math.floor(y / 400), yoe = y - era * 400;
  const mp = (m + 9) % 12, doy = Math.floor((153 * mp + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}
export function civilFromDays(z) {
  z += 719468;
  const era = Math.floor(z / 146097), doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400, doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153), d = doy - Math.floor((153 * mp + 2) / 5) + 1, m = mp < 10 ? mp + 3 : mp - 9;
  return [m <= 2 ? y + 1 : y, m, d];
}
const isGregLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const gregMonthLength = (y, m) => [31, isGregLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

export const anchorDayNumber = () => dateToDayNumber(ANCHOR_DATE);
const anchorUnixDay = () => daysFromCivil(...ANCHOR_GREGORIAN);

export function gregorianToDayNumber(y, m, d) {
  if (![y, m, d].every(isInt) || m < 1 || m > 12 || d < 1 || d > gregMonthLength(y, m)) fail(`${y}-${m}-${d} is not a valid Gregorian date`);
  const n = anchorDayNumber() + (daysFromCivil(y, m, d) - anchorUnixDay());
  if (n < 1) fail(`day number ${n} is before the start of the calendar (day 1 = 1 Çuanede, 000-1)`);
  if (n > maxDayNumber()) fail(`day number ${n} is beyond the end of era ${MAX_ERA}`);
  return n;
}
export function dayNumberToGregorian(n) {
  dayNumberToDate(n); // range check
  return civilFromDays(anchorUnixDay() + (n - anchorDayNumber()));
}
/** Day number of the UTC day containing a Unix time in milliseconds (e.g. Date.now()). */
export function dayNumberFromUnixMs(ms) {
  const n = anchorDayNumber() + (Math.floor(ms / 86400000) - anchorUnixDay());
  if (n < 1) fail(`day number ${n} is before the start of the calendar`);
  return n;
}
export const todayDayNumber = () => dayNumberFromUnixMs(Date.now());

/** Everything the UI shows about one day. */
export function dayInfo(n) {
  const date = dayNumberToDate(n), wi = weekdayIndex(n);
  return {
    dayNumber: n, date, code: dateCode(date), long: longDate(date), weekdayIndex: wi, weekday: WEEKDAYS[wi].name,
    monthName: MONTHS[date.month - 1].name, eraName: eraName(date.era),
    leapYear: isLeapYear(yearsElapsed(date.era, date.year)), gregorian: dayNumberToGregorian(n),
  };
}
