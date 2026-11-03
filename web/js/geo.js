// Planet geometry + Cosmossi length units. Mirrors crates/cosmossi-core/src/{geo,units}.rs.
export const LENGTH_UNITS = [   // cm per unit, from the Cosmossi units page
  { key: 'Sdr', label: 'Sadelle',    cm: 0.25,     fictional: true },
  { key: 'Dr',  label: 'Delle',      cm: 6,        fictional: true },
  { key: 'Ro',  label: 'Roçenna',    cm: 144,      fictional: true },
  { key: 'Cro', label: 'Caroçenna',  cm: 3456,     fictional: true },
  { key: 'Mre', label: 'Mereta',     cm: 82944,    fictional: true },
  { key: 'm',   label: 'metre',      cm: 100,      fictional: false },
  { key: 'km',  label: 'kilometre',  cm: 100000,   fictional: false },
  { key: 'mi',  label: 'mile',       cm: 160934.4, fictional: false },
];
export const unitByKey = (k) => LENGTH_UNITS.find((u) => u.key === k);
export const kmPerUnit = (k) => unitByKey(k).cm / 100000;

/** central angle (rad) between two lon/lat points (rad) */
export function haversine(lon1, lat1, lon2, lat2) {
  const s1 = Math.sin((lat2 - lat1) / 2), s2 = Math.sin((lon2 - lon1) / 2);
  const a = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Cosmossi notation: whole.fraction where the fraction counts 24ths of the next whole unit (324.12Mre). */
export function formatLength(value, key) {
  const u = unitByKey(key), neg = value < 0, v = Math.abs(value);
  if (!u.fictional) return (neg ? '-' : '') + v.toLocaleString('en', { maximumFractionDigits: 2 }) + key;
  let whole = Math.floor(v), frac = Math.round((v - whole) * 24);
  if (frac === 24) { whole += 1; frac = 0; }
  return (neg ? '-' : '') + whole + (frac ? '.' + frac : '') + key;
}

/** largest 1-2-5 x 10^k value not above `target` */
export function niceStep(target) {
  const p = Math.pow(10, Math.floor(Math.log10(target))), m = target / p;
  return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * p;
}
