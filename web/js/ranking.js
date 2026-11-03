// Ranking list: every visible country sorted by one measure. Numbers come from countrystats.js.
import { metricsListSliced, rank, RANK_KEYS, defaultDir } from './countrystats.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => Math.round(n).toLocaleString('en');

/** el: the <ol>. keySel / dirBtn / countEl: the sort select, the direction button and the count. getUnits() -> { R, unit, kmU }.
 *  onPick(id) is called when a row is clicked. */
export function createRanking({ el, keySel, dirBtn, countEl, store, editor, isVisible, getUnits, onPick }) {
  let key = 'area', dir = defaultDir(key), queued = false;
  const countries = () => store.features.filter((f) => f.kind === 'country' && isVisible(f));
  const valueText = (m, unit, kmU) => {
    switch (key) {
      case 'area': return m.area == null ? '—' : `${num(m.area / (kmU * kmU))} ${esc(unit)}²`;
      case 'population': return m.pop == null ? '—' : num(m.pop);
      case 'cities': return num(m.cities);
      case 'subdivisions': return num(m.subs);
      case 'border': return `${num(m.border / kmU)} ${esc(unit)}`;
      default: return '';
    }
  };
  const syncDir = () => {
    const byName = key === 'name';
    dirBtn.textContent = dir === 'desc' ? (byName ? 'Z–A' : '▼') : (byName ? 'A–Z' : '▲');
    dirBtn.title = byName ? 'Change the order' : dir === 'desc' ? 'Largest first (click for smallest first)' : 'Smallest first (click for largest first)';
  };
  let cancel = null;                                                  // the measuring in progress, if any
  function render() {
    queued = false;
    if (cancel) cancel();
    const { R, unit, kmU } = getUnits(), ctx = { store, editor, R, isVisible }, all = countries();
    countEl.textContent = all.length ? String(all.length) : '';
    if (!all.length) { cancel = null; el.innerHTML = '<li class="rk-empty">No countries yet.</li>'; return; }
    // a big map takes a while to measure: the numbers come in slices, and the last list stays on screen until the new one is ready
    cancel = metricsListSliced(all, ctx, (list) => { cancel = null; paint(list, unit, kmU); });
  }
  const FIELD = { area: 'area', population: 'pop', cities: 'cities', subdivisions: 'subs', border: 'border' };
  function paint(list, unit, kmU) {
    const field = FIELD[key], max = field ? list.reduce((mx, m) => (m[field] > mx ? m[field] : mx), 0) : 0;   // the longest bar is the biggest value
    el.innerHTML = rank(list, key, dir).map((m) => {
      const f = store.find(m.id), w = max > 0 && m[field] > 0 ? Math.max(2, Math.round((m[field] / max) * 100)) : 0;
      return `<li data-id="${m.id}" style="--w:${w}%" title="${esc(m.name)}"><i>${m.rank ?? '–'}</i><s style="background:${esc(f && f.color)}"></s><span>${esc(m.name)}</span><em>${valueText(m, unit, kmU)}</em></li>`;
    }).join('');
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(render); } };

  keySel.innerHTML = Object.entries(RANK_KEYS).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('');
  keySel.value = key; syncDir();
  keySel.addEventListener('change', () => { key = keySel.value; dir = defaultDir(key); syncDir(); schedule(); });
  dirBtn.addEventListener('click', () => { dir = dir === 'desc' ? 'asc' : 'desc'; syncDir(); schedule(); });
  el.addEventListener('click', (e) => { const li = e.target.closest('li[data-id]'); if (li && onPick) onPick(li.dataset.id); });
  return { render: schedule };
}
