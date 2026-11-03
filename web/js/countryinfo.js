// Info card: read-only facts about a country or any subdivision, shown when it is clicked in Pan mode. Numbers come from countrystats.js.
// A subdivision's card has a breadcrumb up to its country; the sub-areas and cities listed on a card open in turn.
import { metricsFor, metricsList, rank, RANK_KEYS } from './countrystats.js';
import { sortCities } from './places.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => Math.round(n).toLocaleString('en');
const fact = (k, v) => (v ? `<div class="cl-fact"><span>${k}</span><b>${v}</b></div>` : '');
const MAX_CHIPS = 10;

/** el: the card element. places: createPlaces(). getUnits() -> { R, unit, kmU }.
 *  onEdit(id) opens the area in the inspector, onLocate(feature) flies the map to it, onCity(id) selects a city.
 *  onFocus(id|null) is told which area the card shows (null when it closes): the map shimmers that area's border. */
export function createCountryInfo({ el, store, editor, places, isVisible, getUnits, onEdit, onLocate, onCity, onFocus }) {
  let cur = null;                                                              // id of the area shown
  const countries = () => store.features.filter((f) => f.kind === 'country' && isVisible(f));

  const RANK_SHORT = { area: 'Area', population: 'Population', cities: 'Cities', border: 'Border' };
  const dens = (pop, area) => { const d = pop / area; return d >= 10 ? num(d) : d.toLocaleString('en', { maximumSignificantDigits: 2 }); };
  const tile = (k, v, sub) => `<div class="ic-tile"><span>${k}</span><b>${v}</b>${sub ? `<em>${sub}</em>` : ''}</div>`;
  const chip = (attr, id, label, cls = '', title = '') => `<button type="button" class="ic-city ${cls}" ${attr}="${id}"${title ? ` title="${esc(title)}"` : ''}>${label}</button>`;

  function render() {
    const f = cur && store.find(cur);
    if (!f) { hide(); return; }
    const P = places.snapshot(), { R, unit, kmU } = getUnits(), ctx = { store, editor, R, isVisible };
    const isCountry = f.kind === 'country', path = P.pathOf(f), parent = path.length > 1 ? path[path.length - 2] : null;
    const m = metricsFor(f, ctx), facts = f.facts || {}, inside = P.citiesIn(f), cap = P.capitalOf(f), parts = editor.partCount(f), subs = P.subsOf(f);
    const level = P.levelName(f);

    // where this area stands: among all countries, or among the areas next to it inside the same parent
    const scope = isCountry ? countries() : parent ? P.subsOf(parent) : [f];
    const all = metricsList(scope, ctx), scopeName = isCountry ? 'countries' : parent ? parent.name || 'its parent' : '';
    const ranks = scope.length > 1 ? ['area', 'population', 'cities', 'border'].map((key) => {
      const field = RANK_KEYS[key].field, n = all.filter((x) => x[field] != null).length, r = rank(all, key).find((x) => x.id === f.id);
      return r && r.rank ? `<span class="ic-chip" title="#${r.rank} of ${n} by ${esc(RANK_KEYS[key].label.toLowerCase())}${isCountry ? '' : ' in ' + esc(scopeName)}"><b>#${r.rank}</b> ${RANK_SHORT[key]}</span>` : null;
    }).filter(Boolean) : [];
    // share of the mapped land (a country) or of the area it lies in (a subdivision)
    const base = isCountry ? all.reduce((sum, x) => sum + (x.area || 0), 0) : parent ? metricsFor(parent, ctx).area : 0;
    const share = base > 0 && m.area >= 0 ? (m.area / base) * 100 : null;

    const crumbs = path.slice(0, -1).map((g) => chip('data-area', g.id, esc(g.name || 'Unnamed'), 'ic-crumb', 'Show ' + (g.name || 'it'))).join('<i class="ic-sep">›</i>');
    const kind = (isCountry ? 'Country' : esc(level)) + (cap ? ' · capital ' + esc(cap.name) : '');
    const subChips = subs.slice(0, MAX_CHIPS).map((k) => chip('data-area', k.id, `<s style="background:${esc(P.colorOf(k))}"></s>${esc(k.name || 'Unnamed')}`, 'ic-sub', P.levelName(k))).join('') + (subs.length > MAX_CHIPS ? `<span class="ic-city more">+${subs.length - MAX_CHIPS} more</span>` : '');
    const shown = sortCities(inside).slice(0, MAX_CHIPS).map((c) => chip('data-city', c.id, (cap && cap.id === c.id ? '★ ' : '') + esc(c.name), cap && cap.id === c.id ? 'cap' : '', c.rank)).join('') + (inside.length > MAX_CHIPS ? `<span class="ic-city more">+${inside.length - MAX_CHIPS} more</span>` : '');

    el.innerHTML = `<div class="ic-hero" style="--c:${esc(P.colorOf(f))}"><div class="ic-top"><span class="ic-kind">${kind}</span><button data-close type="button" title="Close (Esc)" aria-label="Close">×</button></div>` +
      (crumbs ? `<nav class="ic-crumbs" aria-label="Where this is">${crumbs}</nav>` : '') +
      `<h3 class="ic-title"><s style="background:${esc(P.colorOf(f))}"></s><span>${esc(f.name || (isCountry ? 'Unnamed country' : 'Unnamed area'))}</span></h3>` +
      (isCountry && facts.politicalName ? `<div class="ic-political">${esc(facts.politicalName)}</div>` : '') + `</div>` +
      `<div class="ic-tiles">` +
        tile('Land area', `${num(m.area / (kmU * kmU))} ${esc(unit)}²`, `${num(m.area)} km²`) +
        tile('Population', facts.population ? esc(facts.population) : '—', m.pop && m.area > 0 ? `${dens(m.pop, m.area)} per km²` : '') +
        tile('Border', `${num(m.border / kmU)} ${esc(unit)}`, `${num(m.border)} km`) +
        tile('Cities', inside.length ? String(inside.length) : '—', m.subs ? `${m.subs} subdivision${m.subs === 1 ? '' : 's'}` : '') +
      `</div>` +
      (ranks.length ? `<div class="ic-ranks">${ranks.join('')}</div>` : '') +
      ((facts.government || facts.language || parts || share != null) ? `<div class="ic-facts">` +
        fact('Government', esc(facts.government)) + fact('Language', esc(facts.language)) + fact('Separate parts', parts || '') +
        (share != null ? fact(isCountry ? 'Share of mapped land' : `Share of ${esc((parent && parent.name) || 'its parent')}`, `${share >= 10 ? share.toFixed(0) : share.toFixed(1)} %`) : '') + `</div>` : '') +
      (subs.length ? `<div class="cl-h">Subdivisions</div><div class="ic-cities">${subChips}</div>` : '') +
      (inside.length ? `<div class="cl-h">Cities</div><div class="ic-cities">${shown}</div>` : '') +
      (f.notes ? `<div class="cl-h">Notes</div><div class="cl-note">${esc(f.notes)}</div>` : '') +
      `<div class="cl-actions"><button data-locate type="button">Show on map</button><button data-edit type="button" class="primary">Edit…</button></div>`;
    el.hidden = false;
    if (onFocus) onFocus(f.id);
  }
  function hide() { const had = cur; cur = null; el.hidden = true; el.innerHTML = ''; if (onFocus && had) onFocus(null); }
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { hide(); return; }
    const a = e.target.closest('[data-area]');
    if (a) { const g = store.find(a.dataset.area); if (g) { cur = g.id; render(); if (onLocate) onLocate(g); } return; }
    const c = e.target.closest('[data-city]'); if (c) { if (onCity) onCity(c.dataset.city); return; }
    if (e.target.closest('[data-locate]') && cur) { const g = store.find(cur); if (g && onLocate) onLocate(g); return; }
    if (e.target.closest('[data-edit]') && cur) { const id = cur; hide(); if (onEdit) onEdit(id); }
  });
  return {
    show(f) { if (!f) { hide(); return; } cur = f.id; render(); },
    hide, refresh() { if (cur && !el.hidden) render(); },
    get shown() { return !el.hidden; },
  };
}
