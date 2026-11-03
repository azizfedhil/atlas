// "Countries" panel: every country with its facts, capital, cities and a subdivision tree of any depth.
//   - selecting something on the map opens its branch and scrolls it into view (reveal)
//   - the filter finds countries, subdivisions and cities, opens the branches that hold a match and marks the match
//   - A-Z sort, arrow-key navigation, hover a row to see the area on the map, double-click to fly there, F2 to rename
// Selection never rebuilds the rows (only the "active" mark moves), so double-clicks and keyboard focus survive it.
import { metricsFor } from './countrystats.js';
import { sortCities } from './places.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => Math.round(n).toLocaleString('en');
const SORT_KEY = 'cosmossi.clsort';

/** el: the list element. places: createPlaces(). getUnits() -> { R, unit, kmU }. onLocate(feature): fly the map there.
 *  onShow(feature): "Show on map": fly there and make the border shimmer, without opening it for editing. */
export function createCountryList({ el, store, editor, places, isVisible, getUnits, onSelect, onLocate, onShow }) {
  const doc = el.ownerDocument;
  const filterEl = doc.getElementById('countryFilter'), sortBtn = doc.getElementById('countrySort');
  const open = new Set();
  let queued = false, lastHtml = null, editing = null, hoverId = null, rove = null, refocus = null;
  let byName = false; try { byName = localStorage.getItem(SORT_KEY) === 'name'; } catch (_) { /* storage unavailable */ }

  const fact = (k, v) => (v ? `<div class="cl-fact"><span>${k}</span><b>${v}</b></div>` : '');
  const nameCmp = (a, b) => String(a.name || '').localeCompare(String(b.name || ''));
  const q = () => (filterEl ? filterEl.value.trim().toLowerCase() : '');
  const idOf = (n) => n && (n.dataset.id || n.dataset.pick);
  const rowFor = (id) => el.querySelector(`[data-id="${id}"],[data-pick="${id}"]`);

  function render() {
    queued = false;
    if (editing) return;                                                      // a name is being typed: the rows stay as they are until it is done
    const P = places.snapshot(), { R, unit, kmU } = getUnits(), ctx = { store, editor, R, isVisible };
    const query = q();
    const nameHas = (x) => (x.name || '').toLowerCase().includes(query);
    const hl = (s) => {                                                       // a name with the matching part marked
      s = String(s ?? ''); const i = query ? s.toLowerCase().indexOf(query) : -1;
      return i < 0 ? esc(s) : `${esc(s.slice(0, i))}<mark>${esc(s.slice(i, i + query.length))}</mark>${esc(s.slice(i + query.length))}`;
    };
    const order = (list) => (byName ? list.slice().sort(nameCmp) : list);
    const memo = new Map();
    const hit = (f) => {                                                      // { self: its own name matches, below: something inside it matches }
      let m = memo.get(f.id); if (m) return m;
      const below = P.subsOf(f).some((k) => { const h = hit(k); return h.self || h.below; }) || P.directCities(f).some(nameHas);
      m = { self: nameHas(f), below }; memo.set(f.id, m); return m;
    };
    const cityRows = (list, cap, f) => sortCities(list, byName).map((c) =>
      `<div class="cl-item" role="treeitem" data-pick="${c.id}" aria-selected="false"><i>${cap && cap.id === c.id ? (f.kind === 'country' ? '★' : '◆') : '●'}</i><span class="nm">${hl(c.name)}</span><em>${esc(c.rank)}</em></div>`).join('');

    function node(f) {
      const m = query ? hit(f) : null;
      let kids = order(P.subsOf(f)), own = P.directCities(f);
      if (m && !m.self) { kids = kids.filter((k) => { const h = hit(k); return h.self || h.below; }); own = own.filter(nameHas); }   // only the branches that lead to a match
      const isOpen = open.has(f.id) || !!(m && m.below);
      const sw = `<s style="background:${esc(P.colorOf(f))}"></s>`;
      let h = `<div class="cl-row" role="treeitem" aria-expanded="${isOpen}" aria-selected="false" data-id="${f.id}"><b class="chev" data-tog="${f.id}">${isOpen ? '▾' : '▸'}</b>${sw}<span class="nm">${hl(f.name)}</span><em>${f.kind === 'country' ? 'country' : esc(P.levelName(f))}</em><button class="cl-loc" data-loc="${f.id}" type="button" title="Show on the map" aria-label="Show ${esc(f.name || 'it')} on the map" tabindex="-1">⌖</button></div>`;
      if (!isOpen) return h;
      const st = metricsFor(f, ctx), cap = P.capitalOf(f), facts = f.facts || {}, parts = editor.partCount(f), nCities = P.citiesIn(f).length, nSubs = editor.descendants(f.id).length;
      h += `<div class="cl-body" role="group">` +
        (f.kind === 'country' ? fact('Political name', esc(facts.politicalName)) : '') + fact('Capital', cap ? esc(cap.name) : '') + fact('Population', esc(facts.population)) + fact('Government', esc(facts.government)) + fact('Language', esc(facts.language)) +
        fact('Area', `${num(st.area)} km² · ${num(st.area / (kmU * kmU))} ${esc(unit)}²`) + fact('Border', `${num(st.border)} km`) + fact('Cities', nCities || '') + fact('Subdivisions', nSubs || '') + fact('Parts', parts || '') +
        (f.notes ? `<div class="cl-note">${esc(f.notes)}</div>` : '') +
        `<div class="cl-actions"><button data-sub="${f.id}" type="button">+ Subdivision</button><button data-edit="${f.id}" type="button">Edit…</button><button data-loc="${f.id}" type="button">Show on map</button></div>`;
      if (kids.length) h += `<div class="cl-h">Subdivisions</div>` + kids.map(node).join('');
      if (own.length) h += `<div class="cl-h">Cities</div>` + cityRows(own, cap, f);
      return h + '</div>';
    }

    const all = store.features.filter((f) => f.kind === 'country' && isVisible(f));
    let html;
    if (!all.length) html = '<div class="cl-empty">No countries yet. Choose the country tool (C) and draw one.</div>';
    else {
      const roots = order(query ? all.filter((f) => { const h = hit(f); return h.self || h.below; }) : all);
      html = roots.length ? roots.map(node).join('') : `<div class="cl-empty">Nothing matches “${esc(filterEl.value.trim())}”.</div>`;
    }
    if (html !== lastHtml) { lastHtml = html; el.innerHTML = html; }
    afterPaint();
  }

  /** what depends on the selection or the focus, applied to the rows already on screen */
  function afterPaint() {
    for (const n of el.querySelectorAll('.active')) { n.classList.remove('active'); n.setAttribute('aria-selected', 'false'); }
    const s = editor.selectedId && store.find(editor.selectedId);
    if (s) {
      const target = rowFor(s.kind === 'country' || s.kind === 'subdivision' ? s.id : s.id);
      if (target) { target.classList.add('active'); target.setAttribute('aria-selected', 'true'); }
    }
    const rows = [...el.querySelectorAll('.cl-row,.cl-item')];
    for (const r of rows) r.tabIndex = -1;
    const t = (rove && rowFor(rove)) || el.querySelector('.cl-row.active,.cl-item.active') || rows[0];
    if (t) t.tabIndex = 0;
    if (refocus) { const r = rowFor(refocus); refocus = null; if (r) r.focus(); }
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(render); } };

  // ---- reveal: open the branch that holds the selection and bring its row into view (inside this list only) ----
  function reveal(id) {
    const f = id && store.find(id); if (!f) return;
    const P = places.snapshot(); let path = [];
    if (f.kind === 'city') { const o = P.ownerOf(f); if (o) path = P.pathOf(o); }
    else if (f.kind === 'country' || f.kind === 'subdivision') path = P.pathOf(f).slice(0, -1);
    else return;
    const before = open.size; for (const g of path) open.add(g.id);
    if (open.size !== before) render();
    const row = rowFor(f.kind === 'city' ? f.id : f.id); if (!row) return;
    const r = row.getBoundingClientRect(), c = el.getBoundingClientRect();
    if (r.top < c.top) el.scrollTop -= c.top - r.top + 6; else if (r.bottom > c.bottom) el.scrollTop += r.bottom - c.bottom + 6;
  }

  // ---- rename in place: F2 on a row (double-click means "show on the map") ----
  function startRename(id) {
    const f = store.find(id), row = rowFor(id); if (!f || !row || editing) return;
    const span = row.querySelector('.nm'); if (!span) return;
    const input = doc.createElement('input'); input.type = 'text'; input.className = 'cl-rename'; input.value = f.name || ''; input.setAttribute('aria-label', 'Name');
    span.replaceWith(input); editing = { f, input }; input.focus(); input.select();
    const done = (ok) => {
      if (!editing || editing.input !== input) return;
      const v = input.value.trim(); editing = null;
      if (ok && v && v !== f.name) store.edit(() => { f.name = v; editor.touch(f); });
      lastHtml = null; refocus = id; render();
    };
    input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); done(true); } else if (e.key === 'Escape') { e.preventDefault(); done(false); } });
    input.addEventListener('blur', () => done(true));
  }

  // ---- events ----
  const activate = (id, node) => {
    editor.setTool('select'); editor.select(id); if (node.dataset.id) open.add(id);
    onSelect && onSelect(id); render();
  };
  el.addEventListener('click', (e) => {
    if (e.target.closest('input')) return;
    const t = e.target.closest('[data-tog],[data-sub],[data-edit],[data-loc],[data-pick],.cl-row'); if (!t) return;
    if (t.dataset.tog) { open.has(t.dataset.tog) ? open.delete(t.dataset.tog) : open.add(t.dataset.tog); render(); return; }
    if (t.dataset.sub) { open.add(t.dataset.sub); editor.setTool('sub', t.dataset.sub); render(); return; }
    if (t.dataset.loc) { const f = store.find(t.dataset.loc); if (f) { if (onShow) onShow(f); else { editor.setTool('select'); editor.select(f.id); onLocate && onLocate(f); } render(); } return; }
    const id = t.dataset.edit || t.dataset.pick || t.dataset.id; if (id) activate(id, t);
  });
  el.addEventListener('dblclick', (e) => {
    if (e.target.closest('input,button')) return;
    const n = e.target.closest('.cl-row,.cl-item'), f = n && store.find(idOf(n));
    if (f) { if (onShow && (f.kind === 'country' || f.kind === 'subdivision')) onShow(f); else if (onLocate) onLocate(f); }       // a city has no border to shimmer: just fly there
  });
  el.addEventListener('mouseover', (e) => {
    const n = e.target.closest('.cl-row,.cl-item'), id = n ? idOf(n) : null;
    if (id !== hoverId) { hoverId = id; if (editor.highlight) editor.highlight(id); }
  });
  el.addEventListener('mouseleave', () => { if (hoverId) { hoverId = null; if (editor.highlight) editor.highlight(null); } });
  el.addEventListener('focusin', (e) => {
    const n = e.target.closest('.cl-row,.cl-item'); if (!n || e.target.tagName === 'INPUT') return;
    rove = idOf(n); for (const r of el.querySelectorAll('.cl-row,.cl-item')) r.tabIndex = r === n ? 0 : -1;
  });
  el.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.ctrlKey || e.metaKey || e.altKey) return;
    const n = e.target.closest('.cl-row,.cl-item'); if (!n || e.target !== n) return;
    const rows = [...el.querySelectorAll('.cl-row,.cl-item')], i = rows.indexOf(n), id = idOf(n), isArea = !!n.dataset.id;
    const go = (r) => { if (r) r.focus(); };
    switch (e.key) {
      case 'ArrowDown': go(rows[i + 1]); break;
      case 'ArrowUp': go(rows[i - 1]); break;
      case 'Home': go(rows[0]); break;
      case 'End': go(rows[rows.length - 1]); break;
      case 'ArrowRight': if (!isArea) return; if (!open.has(id)) { open.add(id); refocus = id; render(); } else go(rows[i + 1]); break;
      case 'ArrowLeft': {
        if (isArea && open.has(id)) { open.delete(id); refocus = id; render(); break; }
        const body = n.parentElement, parent = body && body.classList.contains('cl-body') ? body.previousElementSibling : null;
        go(parent); break;
      }
      case 'Enter': case ' ': refocus = id; activate(id, n); break;
      case 'F2': startRename(id); break;
      default: return;
    }
    e.preventDefault();
  });
  if (filterEl) {
    filterEl.addEventListener('input', schedule);
    filterEl.addEventListener('keydown', (e) => { if (e.key === 'Escape' && filterEl.value) { filterEl.value = ''; schedule(); e.stopPropagation(); } });
  }
  const syncSort = () => {
    if (!sortBtn) return;
    sortBtn.classList.toggle('on', byName); sortBtn.setAttribute('aria-pressed', String(byName));
    sortBtn.title = byName ? 'Sorted A–Z (click for the order they were drawn in)' : 'In the order drawn (click to sort A–Z)';
  };
  if (sortBtn) sortBtn.addEventListener('click', () => { byName = !byName; try { localStorage.setItem(SORT_KEY, byName ? 'name' : 'map'); } catch (_) { /* ignore */ } syncSort(); render(); });
  syncSort();
  return { render: schedule, expand: (id) => { open.add(id); schedule(); }, reveal, rename: startRename };
}
