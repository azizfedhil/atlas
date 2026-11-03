#!/usr/bin/env python3
"""Recolour parts of the BAKED web/tex/biome.png without the source biome layers (Batch 6.5a).

  1. Mediterranean ('mediterannean') becomes green:  MED_OLD -> MED_NEW everywhere.
  2. The Alduran heartland - the uncovered patch inside the great desert that was baked with the 'default' lime
     colour - becomes hyper-arid:  DEFAULT_OLD -> HYPER_ARID, only inside the patch (not the stray default pixels on coasts).

The baked texture is a blurred composite, so edge pixels are mixtures of two palette colours. Each pixel is unmixed against
every pair of palette colours (best two-colour fit) to get the weight w of the colour being replaced, and then
        new = old + w * (NEW - OLD)
which keeps the soft blends between biomes intact. Idempotent only on the ORIGINAL texture: re-running on an already
recoloured file finds nothing to replace (pass --src to point at the original).
usage: python tools/recolor_biome.py [--src original_biome.png] [--out web/tex/biome.png]
"""
import argparse, itertools, pathlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

PAL = {'default': '#bfcf94', 'Coniferous_forest': '#86a883', 'Tropical_rainforest': '#5d9a63',
       'temperate_decidous_forest': '#a7c383', 'mediterannean': '#cdb97f', 'shrubland': '#b8b585',
       'steppe': '#d8d594', 'semi_arid': '#dccaa0', 'semi_arid_desert': '#e4cf9c', 'hot_dry_desert': '#ebd7a4',
       'coastal_desert': '#dfd0a8', 'tundra': '#c6cdb9', 'arctic': '#f1f5f7'}
MED_NEW = '#97b36b'        # olive / sage green: distinct from the cooler conifer green and the paler deciduous green
HYPER_ARID = '#e6bb7e'     # scorched ochre, hotter than the pale hot_dry_desert sand
rgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
ROOT = pathlib.Path(__file__).resolve().parent.parent

def weights(px, cols, target, tol=6.0):
    """px: (N,3) float. Weight (0..1) of palette colour `target` in the best two-colour mixture explaining each pixel."""
    n = len(px); best = np.full(n, 1e9, np.float32); w = np.zeros(n, np.float32)
    for i, j in itertools.combinations_with_replacement(range(len(cols)), 2):
        ci, cj = cols[i], cols[j]; d = ci - cj; dd = float(d @ d)
        a = np.zeros(n, np.float32) if dd == 0 else np.clip(((px - cj) @ d) / dd, 0, 1)      # weight of colour i
        res = np.linalg.norm(px - (a[:, None] * ci + (1 - a[:, None]) * cj), axis=1)
        take = res < best - 1e-3
        wt = a if i == target else (1 - a if j == target else np.zeros(n, np.float32))
        if i == j: wt = np.ones(n, np.float32) if i == target else np.zeros(n, np.float32)
        best = np.where(take, res, best); w = np.where(take, wt, w)
    return np.where(best <= tol, w, 0.0).astype(np.float32)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--src', default=str(ROOT / 'web/tex/biome.png')); ap.add_argument('--out', default=str(ROOT / 'web/tex/biome.png'))
    a = ap.parse_args()
    img = np.array(Image.open(a.src).convert('RGB')); H, W, _ = img.shape; px = img.reshape(-1, 3).astype(np.float32)
    names = list(PAL); cols = np.array([rgb(PAL[k]) for k in names]); mi, di = names.index('mediterannean'), names.index('default')
    land = px.sum(1) > 0                                                   # (0,0,0) is the empty area far from any land
    out = px.copy()

    # 1) Mediterranean, globally. Only pixels near the colour can contain it: pre-filter to keep this fast.
    near = land & (np.abs(px - rgb(PAL['mediterannean'])).max(1) < 60)
    idx = np.where(near)[0]; w = weights(px[idx], cols, mi)
    out[idx] += w[:, None] * (rgb(MED_NEW) - rgb(PAL['mediterannean']))
    print('mediterranean pixels recoloured:', int((w > 0.5).sum()))

    # 2) the heartland patch = the big connected blob of the exact default colour; blend zone = patch dilated by 14 px
    exact = (np.abs(img.astype(int) - rgb(PAL['default']).astype(int)).sum(2) <= 3)
    lab, n = ndi.label(exact); sizes = ndi.sum(exact, lab, range(1, n + 1)); big = 1 + int(np.argmax(sizes))
    patch = lab == big; zone = ndi.binary_dilation(patch, iterations=14).reshape(-1)
    print('heartland patch: %d px, %.1f%% of all default-coloured pixels' % (patch.sum(), 100 * patch.sum() / max(exact.sum(), 1)))
    idx = np.where(zone & land)[0]; w = weights(px[idx], cols, di)
    out[idx] += w[:, None] * (rgb(HYPER_ARID) - rgb(PAL['default']))
    print('heartland pixels recoloured:', int((w > 0.5).sum()))

    Image.fromarray(np.clip(out + .5, 0, 255).astype(np.uint8).reshape(H, W, 3), 'RGB').save(a.out, optimize=True)
    print('wrote', a.out)

if __name__ == '__main__':
    main()
