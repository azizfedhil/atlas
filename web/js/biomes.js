// Biome palette for the Biome painter. A painted pixel stores the index + 1 of its entry (0 = untouched: the baked colour).
// The colours must equal PAL in tools/bake_textures.py, so a painted area looks exactly like the same biome baked into
// web/tex/biome.png. The ids are the PAL keys, so the two lists can be compared line by line.
export const BIOME_ID = 'biome-delta';    // hidden label feature that carries the painted biomes (RLE text in `notes`)

export const BIOMES = [
  { id: 'default', name: 'Plains', color: '#bfcf94' },
  { id: 'Coniferous_forest', name: 'Coniferous forest', color: '#86a883' },
  { id: 'Tropical_rainforest', name: 'Tropical rainforest', color: '#5d9a63' },
  { id: 'temperate_decidous_forest', name: 'Temperate deciduous forest', color: '#a7c383' },
  { id: 'mediterannean', name: 'Mediterranean', color: '#97b36b' },
  { id: 'shrubland', name: 'Shrubland', color: '#b8b585' },
  { id: 'steppe', name: 'Steppe', color: '#d8d594' },
  { id: 'semi_arid', name: 'Semi-arid', color: '#dccaa0' },
  { id: 'semi_arid_desert', name: 'Semi-arid desert', color: '#e4cf9c' },
  { id: 'hot_dry_desert', name: 'Hot desert', color: '#ebd7a4' },
  { id: 'coastal_desert', name: 'Coastal desert', color: '#dfd0a8' },
  { id: 'tundra', name: 'Tundra', color: '#c6cdb9' },
  { id: 'arctic', name: 'Arctic', color: '#f1f5f7' },
  { id: 'hyper_arid', name: 'Hyper-arid', color: '#e6bb7e' },
];
