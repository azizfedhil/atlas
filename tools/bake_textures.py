#!/usr/bin/env python3
"""Bake the source-space textures the viewer reprojects live.

  web/tex/biome.png : RGB  = soft biome colour (priority: smaller layer on top)
  web/tex/field.png   : R = fine signed distance to coast  (+water / -land), +-32 src px, 0.25px steps
                      G = coarse distance from land over water, 0..255 src px
                      B = rivers (thin semi-transparent lines inside the land layer)

usage: python tools/bake_textures.py path/to/world/   (folder containing land.png + biome layers)
(A Rust port of this step is planned for a later batch; the algorithm is intentionally simple.)
"""
import sys, pathlib, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import landrivers

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'world')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'web' / 'tex'
OUT.mkdir(parents=True, exist_ok=True)
alpha = lambda f: np.array(Image.open(SRC / f).convert('RGBA'))[..., 3]

# ---- rivers + cleaned land (shared with bake_vectors.py) ----
land_a, land_clean, rivers = landrivers.load(SRC)
H, W = land_a.shape

# ---- biome colours ----
PAL = {'default': '#bfcf94', 'Coniferous_forest': '#86a883', 'Tropical_rainforest': '#5d9a63',
       'temperate_decidous_forest': '#a7c383', 'mediterannean': '#97b36b', 'shrubland': '#b8b585',
       'steppe': '#d8d594', 'semi_arid': '#dccaa0', 'semi_arid_desert': '#e4cf9c', 'hot_dry_desert': '#ebd7a4',
       'coastal_desert': '#dfd0a8', 'tundra': '#c6cdb9', 'arctic': '#f1f5f7',
       'hyper_arid': '#e6bb7e'}      # optional layer (hyper_arid.png): the Alduran heartland; skipped when the file is absent
rgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
names = [k for k in PAL if k != 'default' and (SRC / (k + '.png')).exists()]      # biome layers are optional; missing ones fall back to the default colour
masks = {k: alpha(k + '.png') > 127 for k in names}
col = np.tile(rgb(PAL['default']), (H, W, 1))
for k in sorted(names, key=lambda k: -masks[k].sum()):      # big first, small on top
    col[masks[k]] = rgb(PAL[k])
lm = (land_clean > .5).astype(np.float32)
num = cv2.GaussianBlur(col * lm[..., None], (0, 0), 3.2)
den = cv2.GaussianBlur(lm, (0, 0), 3.2)[..., None] + 1e-6
col = num / den

# ---- signed distance to the SAME smoothed 0.5 iso-line the vector coast is traced from ----
field = cv2.GaussianBlur(land_clean, (0, 0), 0.7)                 # keep identical to bake_vectors.py
land = field > 0.5
d_out = ndi.distance_transform_edt(~land); d_in = ndi.distance_transform_edt(land)
sdf = np.where(land, -d_in, d_out)
gy, gx = np.gradient(field)
est = np.clip((0.5 - field) / np.maximum(np.hypot(gx, gy), 0.05), -3, 3)   # sub-pixel distance near the shore
sdf = np.where((np.abs(field - 0.5) < 0.45) & (np.abs(sdf) <= 2.5), est, sdf).astype(np.float32)
R = np.clip(sdf / 32, -1, 1) * .5 + .5
G = np.clip(d_out, 0, 255) / 255
B = np.clip(cv2.dilate(rivers.astype(np.uint8), np.ones((2, 2), np.uint8)).astype(np.float32), 0, 1)
q = lambda a: np.clip(a * 255 + .5, 0, 255).astype(np.uint8)
Image.fromarray(np.clip(col + .5, 0, 255).astype(np.uint8), 'RGB').save(OUT / 'biome.png', optimize=True)
Image.fromarray(np.dstack([q(R), q(G), q(B)]), 'RGB').save(OUT / 'field.png', optimize=True)
print('baked', W, 'x', H, '->', OUT)
