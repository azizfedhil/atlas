// Shared country statistics for the info card and the ranking list. Pure helpers: no DOM.
// A country's separate land parts (islands) are rings of the same feature, so a country counts as one here.
import { ringPerimeterKm } from './spherical.js';
import { boxOf } from './multiring.js';

const SCALE = { k: 1e3, thousand: 1e3, m: 1e6, mn: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9 };

/** population text -> number. Accepts "3,400,000", "3 400 000", "1.2M", "1.2 million", "5bn". null when it is not a number. */
export function parsePop(s) {
  if (s == null) return null;
  const t = String(s).trim().toLowerCase().replace(/[,\s_']/g, '');
  const m = t.match(/^(\d+(?:\.\d+)?|\.\d+)(k|thousand|m|mn|million|b|bn|billion)?$/);
  if (!m) return null;
  return Math.round(parseFloat(m[1]) * (SCALE[m[2]] || 1));
}

const pip = (pt, poly) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const p = poly[i], q = poly[j];
    if (p && q && p[1] > pt[1] !== q[1] > pt[1] && pt[0] < ((q[0] - p[0]) * (pt[1] - p[1])) / (q[1] - p[1]) + p[0]) c = !c;
  }
  return c;
};
const memo = new WeakMap();                          // main country -> { key, v }: the costly numbers, reused until something they depend on changes

/** the numbers for many countries in one pass (cheap when nothing changed). ctx: { store, editor, R, isVisible }.
 *  Each item: { id, name, area (land km2), pop, border (km), cities, subs }. Separate land parts are part of their country; enclaves are its holes. */
export function metricsList(mains, { store, editor, R, isVisible }) {
  const cities = store.features.filter((c) => c.kind === 'city' && isVisible(c));
  const sig = R + '|' + cities.map((c) => c.id + ':' + c.lon + ':' + c.lat).join(',');
  const holes = new Map();                           // host id -> its visible enclaves
  for (const g of store.features) if (g.enclaveOf && isVisible(g)) (holes.get(g.enclaveOf) || holes.set(g.enclaveOf, []).get(g.enclaveOf)).push(g);
  return mains.map((f) => {
    const main = f, encl = holes.get(main.id) || [], group = [main, ...encl];
    const key = group.map((g) => g.id + ':' + editor.revOf(g)).join(',') + '|' + sig;
    let hit = memo.get(main);
    if (!hit || hit.key !== key) {
      const mainR = editor.shape(main), mainB = mainR.map(boxOf), holeR = encl.flatMap((e) => editor.shape(e));
      const inside = (pt) => mainR.some((r, i) => pt[0] >= mainB[i][0] && pt[0] <= mainB[i][2] && pt[1] >= mainB[i][1] && pt[1] <= mainB[i][3] && pip(pt, r)) && !holeR.some((h) => pip(pt, h));
      const area = editor.areaKm2(main, R).land;
      const border = group.reduce((sum, g) => sum + editor.shape(g).reduce((s2, r) => s2 + ringPerimeterKm(r, R, true), 0), 0);
      hit = { key, v: { area, border, cities: cities.filter((c) => inside([c.lon, c.lat])).length } };
      memo.set(main, hit);
    }
    return { id: main.id, name: main.name || '', pop: parsePop(main.facts && main.facts.population), subs: editor.descendants(main.id).length, ...hit.v };
  });
}
export const metricsFor = (f, ctx) => metricsList([f], ctx)[0];

/** the metric keys the ranking list offers, with their label and the value field they sort by */
export const RANK_KEYS = {
  area: { label: 'Land area', field: 'area' },
  population: { label: 'Population', field: 'pop' },
  cities: { label: 'Cities', field: 'cities' },
  subdivisions: { label: 'Subdivisions', field: 'subs' },
  border: { label: 'Border length', field: 'border' },
  name: { label: 'Name', field: 'name' },
};

/** the direction a key starts in: biggest first for numbers, A-Z for names */
export const defaultDir = (key) => (key === 'name' ? 'asc' : 'desc');

/** sorts metrics by `key` ('asc' | 'desc'). Missing values (null) always go last. Ties share a rank ("1, 1, 3").
 *  Returns new objects: { ...metrics, rank } with rank null for a missing value. */
export function rank(list, key, dir = defaultDir(key)) {
  const field = RANK_KEYS[key].field, sign = dir === 'asc' ? 1 : -1;
  const sorted = list.slice().sort((a, b) => {
    const va = a[field], vb = b[field];
    if (va == null && vb == null) return a.name.localeCompare(b.name);
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'string' || typeof vb === 'string') return sign * String(va).localeCompare(String(vb));
    if (va !== vb) return sign * (va - vb);
    return a.name.localeCompare(b.name);
  });
  let prev = null, prevRank = 0;
  return sorted.map((m, i) => {
    const v = m[field];
    if (v == null) return { ...m, rank: null };
    const r = prev !== null && v === prev ? prevRank : i + 1;
    prev = v; prevRank = r;
    return { ...m, rank: r };
  });
}

/** metricsList in slices of about `sliceMs`, so measuring a large map never blocks the page. done(list) is called once with every
 *  country, in the order given. The returned function cancels the work. The results are memoised like metricsList's, so a restart is cheap. */
export function metricsListSliced(mains, ctx, done, sliceMs = 8) {
  let i = 0, out = [], timer = 0;
  const step = () => {
    timer = 0;
    const t0 = performance.now();
    do {
      const j = Math.min(mains.length, i + 4);
      out.push(...metricsList(mains.slice(i, j), ctx));
      i = j;
    } while (i < mains.length && performance.now() - t0 < sliceMs);
    if (i < mains.length) timer = setTimeout(step, 0); else done(out);
  };
  timer = setTimeout(step, 0);
  return () => clearTimeout(timer);
}
