#!/usr/bin/env python3
"""Import a new land layer: downsample it to the viewer's source size, then bake the vector coast and the textures.

usage: python tools/import_land.py path/to/land.png [--north water|land|auto] [--south water|land|auto] [--pole-full 88.3] [--pole-zero 89.6]

  * Only the ALPHA channel of the PNG is used (opaque = land, transparent = water), as in the original pipeline.
  * The image must be an equirectangular world map (2:1). Larger images are reduced to 3087 x 1554 with an exact box average
    (the bakes are tuned for that size, saved land edits are stored at that size, and the full-size bake runs out of memory).
  * The pole row of a flat map is one point on a globe, so a thin cap around each pole is blended toward one uniform value
    (water or land) so no spokes appear on globes. Only the top ~1.7 degrees are touched (--pole-full / --pole-zero), because a
    wider cap cuts a straight line across any continent that reaches the edge of the map. --north / --south choose land or water;
    'auto' follows whichever the edge rows lean to (a coin flip when the edge is about half land: say it explicitly).
  * Biome layers (tundra.png, steppe.png, ...) are optional: put them next to the baked land in world/ before running
    tools/bake_textures.py again; without them all land gets the default land colour.
Writes: world/land.png, web/data/coast.json, web/tex/biome.png, web/tex/field.png
"""
import argparse, os, pathlib, subprocess, sys
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = pathlib.Path(__file__).resolve().parent.parent
TEX_W, TEX_H = 3087, 1554

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('--north', default='auto', choices=['water', 'land', 'auto']); ap.add_argument('--south', default='auto', choices=['water', 'land', 'auto'])
ap.add_argument('--pole-full', type=float, default=88.3, help='latitude (deg) up to which the art is left untouched')
ap.add_argument('--pole-zero', type=float, default=89.6, help='latitude (deg) from which the pole is fully healed')
a = ap.parse_args()

im = Image.open(a.src).convert('RGBA'); w, h = im.size
if abs(w / h - 2) > 0.03: sys.exit(f'{a.src} is {w}x{h}: the land layer must be an equirectangular 2:1 world map')
alpha = im.getchannel('A')
if (w, h) != (TEX_W, TEX_H):
    if w % TEX_W == 0 and h % TEX_H == 0 and w // TEX_W == h // TEX_H: alpha = alpha.reduce(w // TEX_W)        # exact box average
    else: alpha = alpha.resize((TEX_W, TEX_H), Image.BOX)
arr = np.array(alpha)
if arr.min() > 200 or arr.max() < 55: sys.exit('the alpha channel has no land/water contrast - is the land in the alpha channel?')
print(f'{a.src}: {w}x{h} -> {TEX_W}x{TEX_H}, {100 * (arr > 127).mean():.1f}% land')

world = ROOT / 'world'; world.mkdir(exist_ok=True)
out = Image.new('RGBA', (TEX_W, TEX_H), (0, 0, 0, 0)); out.putalpha(alpha); out.save(world / 'land.png', optimize=True)
env = dict(os.environ, POLE_NORTH=a.north, POLE_SOUTH=a.south, POLE_FULL=str(a.pole_full), POLE_ZERO=str(a.pole_zero))
for tool in ('bake_vectors.py', 'bake_textures.py'):
    subprocess.run([sys.executable, str(ROOT / 'tools' / tool), str(world)], check=True, env=env)
print('done. Reload the app to see the new land.')
