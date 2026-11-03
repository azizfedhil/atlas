// One-time upgrade of OLD project files. They stored an island (or any far-away area added to a country / subdivision) as its OWN feature
// with `partOf: <main id>`. A country is now ONE feature whose `rings` hold all its separate land parts, so every such part is folded into
// its main feature here (in place) and removed from the list. Everything that pointed at the part (children, enclaves, timeline events)
// is re-pointed at the main feature. Files without partOf are not touched. Returns how many parts were folded.
import { flattenRing, hasHandle } from './pen.js';

const isArea = (f) => f.kind === 'country' || f.kind === 'subdivision';

export function foldLegacyParts(features, timeline) {
  const parts = features.filter((f) => f.partOf);
  if (!parts.length) return 0;
  const byId = new Map(features.map((f) => [f.id, f]));
  const rootOf = (f) => { let m = f, n = 0; while (m && m.partOf && byId.has(m.partOf) && n++ < 20) m = byId.get(m.partOf); return m; };   // a part of a part
  const byMain = new Map(), idMap = new Map();
  for (const p of parts) {
    const m = rootOf(p);
    // dangling, odd or an enclave's part (an enclave is a hole of its host and stays inside it): the part simply becomes its own feature
    if (!m || m === p || m.partOf || !isArea(p) || p.kind !== m.kind || m.enclaveOf || !Array.isArray(p.rings) || !p.rings.length) { delete p.partOf; continue; }
    (byMain.get(m) || byMain.set(m, []).get(m)).push(p);
    idMap.set(p.id, m.id);
  }
  const dayOf = (v) => (v.from == null ? -Infinity : v.from);
  const versionsOf = (f) => (f.shapes && f.shapes.length ? f.shapes : [{ from: null, rings: f.rings, handles: f.handles }]);
  const pick = (f, day) => { const vs = versionsOf(f); let k = 0; vs.forEach((v, i) => { if (dayOf(v) <= day) k = i; }); return vs[k]; };
  const flatRings = (v) => v.rings.map((r, i) => (i === 0 && v.handles && v.handles.some(hasHandle) ? flattenRing(r, v.handles, true) : r));   // a part's curves are sampled into a polyline
  for (const [m, list] of byMain) {
    const all = [m, ...list];
    if (!all.some((f) => f.shapes && f.shapes.length)) {                  // the usual case: no border history
      for (const p of list) for (const r of flatRings({ rings: p.rings, handles: p.handles })) m.rings.push(r);
      continue;
    }
    const days = new Set([-Infinity]);                                    // border history: one version per date that any of them has
    for (const f of all) if (f.shapes) for (const v of f.shapes) days.add(dayOf(v));
    const shapes = [...days].sort((a, b) => a - b).map((d) => {
      const mv = pick(m, d), rings = mv.rings.slice();
      for (const p of list) for (const r of flatRings(pick(p, d))) rings.push(r);
      const v = { from: d === -Infinity ? null : d, rings };
      if (mv.handles) v.handles = mv.handles;
      return v;
    });
    m.shapes = shapes; m.rings = shapes[0].rings;
    if (shapes[0].handles) m.handles = shapes[0].handles; else delete m.handles;
  }
  for (const f of features) {
    if (f.parent && idMap.has(f.parent)) f.parent = idMap.get(f.parent);
    if (f.enclaveOf && idMap.has(f.enclaveOf)) f.enclaveOf = idMap.get(f.enclaveOf);
  }
  if (timeline && Array.isArray(timeline.events)) for (const e of timeline.events) if (e.featureId && idMap.has(e.featureId)) e.featureId = idMap.get(e.featureId);
  for (let i = features.length - 1; i >= 0; i--) if (idMap.has(features[i].id)) features.splice(i, 1);
  return idMap.size;
}
