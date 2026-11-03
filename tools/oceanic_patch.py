#!/usr/bin/env python3
"""Extend the Oceanic (Cfb/Cfc) painted biome from a new overlay mask, overriding whatever painted biome was there.

usage: python tools/oceanic_patch.py <Oceanic_Cfb_Cfc.png> [--dry]

Patches ONLY the painted-biome products of the climate bake (the simulated temperature / rain / Koppen are untouched):
  world/climate_src/final_class_index.png   class index map (oceanic = 9)
  web/tex/biome_final.png                   soft biome colours, rebuilt with the same blur as tools/bake_climate.py
  web/tex/clim_static.png                   G channel only (painted class + 1)
  web/data/climate.json                     painted[].pctLand
  world/climate_src/oceanic_mask_3087.png   the mask as applied (3087x1554), kept for re-runs
Only land cells change (final >= 0). The mask is added to the existing oceanic, never removed from it.
"""
import json, pathlib, sys, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, TEX, DATA = ROOT / 'world' / 'climate_src', ROOT / 'web' / 'tex', ROOT / 'web' / 'data'
OCEANIC = 9
PAL = np.array([[53,126,64],[96,166,70],[190,196,84],[230,196,110],[222,150,70],[214,170,90],[216,208,130],[150,184,96],
                [120,200,120],[70,150,150],[110,168,70],[70,120,60],[60,100,110],[40,82,64],[168,176,160],[240,244,248]], np.float32)

def biome_final(final):
    lm = (final >= 0).astype(np.float32)
    col = PAL[np.clip(final, 0, len(PAL) - 1)] * lm[..., None]
    num = cv2.GaussianBlur(col, (0, 0), 3.2); den = cv2.GaussianBlur(lm, (0, 0), 3.2)[..., None] + 1e-6
    return np.clip(num / den + .5, 0, 255).astype(np.uint8)

def main():
    ov = pathlib.Path(sys.argv[1]); dry = '--dry' in sys.argv
    final = np.array(Image.open(SRC / 'final_class_index.png')).astype(np.int16) // 15 - 1
    H, W = final.shape
    im = np.array(Image.open(ov).convert('RGB')).astype(np.float32)
    cov = 1 - im.min(2) / 255.0                                   # paint = anything that is not white
    cov = (cov > .25).astype(np.float32)
    mask = cv2.resize(cov, (W, H), interpolation=cv2.INTER_AREA) > .5
    land = final >= 0
    add = mask & land
    print('mask px', int(mask.sum()), '| on land', int(add.sum()), '| newly oceanic', int((add & (final != OCEANIC)).sum()))
    print('replaced classes:', {int(k): int(v) for k, v in zip(*np.unique(final[add & (final != OCEANIC)], return_counts=True))})
    new = np.where(add, OCEANIC, final).astype(np.int16)
    # sanity: rebuilding from the OLD index must reproduce the shipped biome_final, so only the new areas change
    old_bf = np.array(Image.open(TEX / 'biome_final.png').convert('RGB'))
    d = np.abs(biome_final(final).astype(int) - old_bf.astype(int)).max()
    print('rebuild-from-old max diff vs shipped biome_final:', int(d))
    if dry: return
    Image.fromarray(((new + 1) * 15).astype(np.uint8)).save(SRC / 'final_class_index.png')
    Image.fromarray((mask * 255).astype(np.uint8), 'L').save(SRC / 'oceanic_mask_3087.png', optimize=True)
    if d <= 2:
        Image.fromarray(biome_final(new), 'RGB').save(TEX / 'biome_final.png', optimize=True)
    else:                                                          # fall back: only touch pixels near the changed area
        zone = ndi.binary_dilation(add & (final != OCEANIC), iterations=14)
        out = old_bf.copy(); out[zone] = biome_final(new)[zone]
        Image.fromarray(out, 'RGB').save(TEX / 'biome_final.png', optimize=True)
    # clim_static G: same recipe as bake_climate (nearest resize, sea filled by nearest land) restricted to changed cells
    st = np.array(Image.open(TEX / 'clim_static.png').convert('RGB')); sh, sw = st.shape[:2]
    fin_small = cv2.resize((new + 1).astype(np.uint8), (sw, sh), interpolation=cv2.INTER_NEAREST)
    old_small = cv2.resize((final + 1).astype(np.uint8), (sw, sh), interpolation=cv2.INTER_NEAREST)
    chg = (fin_small != old_small) & (st[..., 2] > 0)              # land cells only (B > 0)
    st[..., 1] = np.where(chg, fin_small, st[..., 1])
    # sea cells carry the nearest land value: refresh those whose nearest land cell changed
    land_s = st[..., 2] > 0
    idx = ndi.distance_transform_edt(~land_s, return_distances=False, return_indices=True)
    st[..., 1] = np.where(land_s, st[..., 1], st[..., 1][idx[0], idx[1]])
    Image.fromarray(st, 'RGB').save(TEX / 'clim_static.png', optimize=True)
    meta = json.load(open(DATA / 'climate.json')); tot = (new >= 0).sum()
    for i, p in enumerate(meta['painted']): p['pctLand'] = round(float((new == i).sum() / tot * 100), 2)
    json.dump(meta, open(DATA / 'climate.json', 'w'), separators=(',', ':'))
    print('patched. oceanic now %.2f%% of land' % (meta['painted'][OCEANIC]['pctLand']))
main()
