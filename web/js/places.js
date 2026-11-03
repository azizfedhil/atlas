// Places: one shared answer to "what lies inside what" for the Countries list, the info card and the inspector, so all three
// agree on which city is a capital, which areas a city belongs to and what the breadcrumb of an area is. Pure helpers, no DOM,
// and nothing here is saved in a file: it only reads what the editor already stores (parent,  facts.capital, rank ...).
//
//   const P = places.snapshot();      // one consistent view of the map for one render pass (cheap: rebuilt only when something changed)
//   P.citiesIn(area)   P.directCities(area)   P.ownerOf(city)   P.areasOf(city)   P.capitalOf(area)   P.roleOf(city)
//   P.pathOf(area)     P.subsOf(area)         P.colorOf(area)   P.levelName(area)

const isPoly = (f) => f.kind === 'country' || f.kind === 'subdivision';
const RANK_ORDER = { capital: 0, city: 1, town: 2 };

/** capitals first, then cities, then towns; equal ranks keep their order (or go A-Z when byName) */
export function sortCities(list, byName = false) {
  const idx = new Map(list.map((c, i) => [c.id, i]));
  return list.slice().sort((a, b) => {
    const d = (RANK_ORDER[a.rank] ?? 3) - (RANK_ORDER[b.rank] ?? 3);
    if (d) return d;
    return byName ? String(a.name || '').localeCompare(String(b.name || '')) : idx.get(a.id) - idx.get(b.id);
  });
}

/** createPlaces({ store, editor, isVisible }) */
export function createPlaces({ store, editor, isVisible }) {
  let memo = null;

  // what the index depends on: the shape, parent and visibility of every area, and the position, rank and visibility of every city
  function signature() {
    let s = String(store.features.length);
    for (const f of store.features) {
      if (isPoly(f)) s += `|${f.id}:${editor.revOf(f)}:${f.parent || ''}:${f.enclaveOf || ''}:${isVisible(f) ? 1 : 0}:${(f.facts && f.facts.capital) || ''}`;
      else if (f.kind === 'city') s += `|${f.id}:${f.lon}:${f.lat}:${f.rank}:${isVisible(f) ? 1 : 0}`;
    }
    return s;
  }

  function build() {
    const feats = store.features, byId = new Map(feats.map((f) => [f.id, f]));
    const mains = feats.filter((f) => isPoly(f) && isVisible(f));
    const cities = feats.filter((f) => f.kind === 'city' && isVisible(f));
    const parentMain = (f) => (f.kind === 'subdivision' && f.parent && byId.get(f.parent) ? byId.get(f.parent) : null);
    // bounding box of each area with its separate parts: a city is only tested against the areas whose box holds it
    const boxes = mains.map((f) => {
      const b = [Infinity, Infinity, -Infinity, -Infinity];
      for (const r of editor.shape(f)) for (const p of r) { if (!p) continue; if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1]; if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1]; }
      return { f, b, d: f.kind === 'country' ? 0 : editor.depth(f) };
    });
    const owner = new Map(), chains = new Map(), inside = new Map(), direct = new Map();
    for (const c of cities) {
      const pt = [c.lon, c.lat]; let best = null, bd = -1;
      for (const { f, b, d } of boxes) {
        if (pt[0] < b[0] || pt[0] > b[2] || pt[1] < b[1] || pt[1] > b[3]) continue;
        if (d >= bd && editor.containsGroup(f, pt)) { bd = d; best = f; }          // the deepest area wins (an enclave beats its host: the host has a hole there)
      }
      if (!best) continue;
      const chain = []; for (let g = best, n = 0; g && n < 12; g = parentMain(g), n++) chain.unshift(g);
      owner.set(c.id, best); chains.set(c.id, chain);
      for (const g of chain) (inside.get(g.id) || inside.set(g.id, []).get(g.id)).push(c);
      (direct.get(best.id) || direct.set(best.id, []).get(best.id)).push(c);
    }
    return { byId, mains, cities, owner, chains, inside, direct, parentMain };
  }

  function make(idx) {
    const mainId = (f) => f.id;
    const api = {
      cities: idx.cities,
      /** every visible city inside the area (its subdivisions and separate parts included) */
      citiesIn: (f) => idx.inside.get(mainId(f)) || [],
      /** the cities inside the area that are not inside one of its subdivisions */
      directCities: (f) => idx.direct.get(mainId(f)) || [],
      /** the deepest area holding the city, or null */
      ownerOf: (c) => idx.owner.get(c.id) || null,
      /** the areas holding the city, outermost (the country) first */
      areasOf: (c) => idx.chains.get(c.id) || [],
      /** the area's visible subdivisions one level down (separate parts are not listed on their own) */
      subsOf(f) {
        const out = [];
        for (const k of editor.children(f.id)) if (isVisible(k)) out.push(k);
        return out;
      },
      /** [country, ..., area]: the chain from the country down to the area (separate parts count as their main area) */
      pathOf(f) {
        const out = []; let g = f, n = 0;
        while (g && n++ < 12) { out.unshift(g); g = idx.parentMain(g); }
        return out;
      },
      /** the chosen capital while it still lies inside; else a city ranked "capital" inside (for a subdivision: not one that already is the capital of an area above it) */
      capitalOf(f) {
        const m = f, inside = api.citiesIn(m), id = m.facts && m.facts.capital;
        const chosen = id && inside.find((c) => c.id === id); if (chosen) return chosen;
        if (m.kind === 'country') return inside.find((c) => c.rank === 'capital') || null;
        const taken = new Set();
        for (let p = idx.parentMain(m), n = 0; p && n < 8; p = idx.parentMain(p), n++) { const c = api.capitalOf(p); if (c) taken.add(c.id); }
        return inside.find((c) => c.rank === 'capital' && !taken.has(c.id)) || null;
      },
      /** what the city is the capital of: { kind: 'national' | 'regional', area } (the deepest area that chose it), or null */
      roleOf(c) {
        const chain = api.areasOf(c);
        for (let i = chain.length - 1; i >= 0; i--) { const a = chain[i]; if (a.facts && a.facts.capital === c.id) return { kind: i === 0 ? 'national' : 'regional', area: a }; }
        if (chain[0] && c.rank === 'capital' && api.capitalOf(chain[0]) === c) return { kind: 'national', area: chain[0] };
        return null;
      },
      /** the name of the level the area is on: "country", or the country's own name for that level ("Province") */
      levelName(f) {
        if (f.kind === 'country') return 'country';
        const r = editor.root(f), d = editor.depth(f);
        return (r && r.levels && r.levels[d - 1]) || `Level ${d}`;
      },
      /** the colour an area is drawn with: a subdivision wears its country's colour */
      colorOf(f) {
        const src = f.kind === 'subdivision' ? editor.root(f) : f;
        return (src && src.color) || f.color || '#8cb4d9';
      },
      byId: (id) => idx.byId.get(id) || null,
    };
    return api;
  }

  return {
    /** a consistent view of the map (rebuilt only when an area or a city changed since the last one) */
    snapshot() {
      const sig = signature();
      if (!memo || memo.sig !== sig) memo = { sig, api: make(build()) };
      return memo.api;
    },
  };
}
