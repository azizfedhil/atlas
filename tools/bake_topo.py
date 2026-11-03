#!/usr/bin/env python3
"""Bake the 3D globe's heightmap into the atlas' topographic layer.

  in : web/sim/world/heightmap.png   4096x2048 8-bit grey, the file the 3D globe imports
                                     (0 = sea, 1..255 = land; the globe's own rule: e = sqrt((v - 1) / 254))
  out: web/tex/topo.png              4096x2048 RGB, read by the atlas shader (js/shaders.js, js/topo.js)
                                     R, G = land height, 16 bit (R * 256 + G) / 65535 * 6 km
                                     B    = 255 on land of the heightmap, 0 at sea (hover readout)

The height is what the globe works with: the grey value goes through the Import page's rule and then through its
elevation -> kilometres curve (elevToHeightKm in sim-src/js/color-map.js, 0 .. 6 km, "the same scale on every planet").
Two things are done on top, only so the picture looks right when it is zoomed in:
  * the land height is carried a few pixels out over the sea (so the coast never fades to zero when the atlas coast
    sits a pixel off the heightmap's coast, and so bilinear lookups never mix in sea);
  * a light blur (sigma 1 px) smooths the 8-bit steps of the source (about 15 m in the lowlands) before they are
    stored with 16 bits, so shaded relief and contour lines do not show terraces.

usage: python tools/bake_topo.py          (needs numpy, SciPy, Pillow)
"""
import pathlib, numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'web' / 'sim' / 'world' / 'heightmap.png'
OUT = ROOT / 'web' / 'tex' / 'topo.png'
H_MAX_KM = 6.0          # the top of the globe's height curve; the same number is TOPO_MAX_KM in web/js/topo.js
CARRY_PX = 6            # land height carried out over the sea
SIGMA_PX = 1.0          # blur

g = np.array(Image.open(SRC).convert('L'))
land = g >= 1
e = np.sqrt(np.maximum(g.astype(np.float32) - 1, 0) / 254)            # the Import page's grey -> elevation rule
t = np.minimum(e, 1)
h = (6 * t ** 4 * (5 - 4 * t)).astype(np.float32)                      # elevToHeightKm for e > 0
h[~land] = 0

# carry the land height out over the sea
dist, (iy, ix) = ndi.distance_transform_edt(~land, return_indices=True)
near = (~land) & (dist <= CARRY_PX)
h[near] = h[iy[near], ix[near]]
band = land | near

# light blur: wraps around in longitude, stays inside the land + carried band
hb = ndi.gaussian_filter(h, sigma=SIGMA_PX, mode=('nearest', 'wrap'))
wb = ndi.gaussian_filter(band.astype(np.float32), sigma=SIGMA_PX, mode=('nearest', 'wrap'))
h = np.where(band & (wb > 1e-3), hb / np.maximum(wb, 1e-3) * band, 0).astype(np.float32)
h = np.clip(h, 0, H_MAX_KM)

v16 = np.rint(h / H_MAX_KM * 65535).astype(np.uint32)
rgb = np.zeros(g.shape + (3,), np.uint8)
rgb[..., 0] = (v16 >> 8).astype(np.uint8)
rgb[..., 1] = (v16 & 255).astype(np.uint8)
rgb[..., 2] = np.where(land, 255, 0).astype(np.uint8)
Image.fromarray(rgb, 'RGB').save(OUT, optimize=True, compress_level=9)

lh = h[land]
q = np.percentile(lh, [10, 25, 50, 75, 90, 95, 99, 99.9])
print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size / 1e6:.2f} MB, land {land.mean() * 100:.1f} % of the map')
print('land height percentiles (km) 10/25/50/75/90/95/99/99.9:', ' '.join(f'{x:.2f}' for x in q), f'max {lh.max():.2f}')
