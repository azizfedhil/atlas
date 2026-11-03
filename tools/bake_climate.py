#!/usr/bin/env python3
"""Bake the Cosmossi climate (World Orogen engine, axial tilt 25.2 deg, Alduran hand-set) into atlas textures.

  web/tex/clim.png        4096x2048 RGB. 4x4 grid of 1024x512 tiles; tile 0..11 = months (0 = month after the northern
                          winter solstice), tile 12 = annual.  R = temperature, G = rainfall (sqrt-coded), B = 0.
                          Sea cells are filled with the nearest land value so bilinear lookups never bleed garbage at the coast.
                          Tile 13, R = how much of the hand-set Alduran climate a cell has (0..255 = 0..1, see tools/alduran_blend.py); the hover readout uses it.
  web/tex/clim_static.png 1024x512 RGB, sampled NEAREST.  R = Koppen class id (from the final monthly climate),
                          G = painted biome class (k+1, sea filled with the nearest land), B = 0 sea, else 1 + elevation (0..8 km -> 0..254)
  web/tex/biome_final.png 3087x1554 RGB soft biome colours of the reconciled painting (16 classes), same blur as biome.png
  web/data/climate.json   encodings, legends, month convention, Alduran profile, area statistics

usage: python tools/bake_climate.py            (reads world/climate_src/, needs node for the Koppen rules)
"""
import json, pathlib, subprocess, sys, tempfile, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, TEX, DATA = ROOT / 'world' / 'climate_src', ROOT / 'web' / 'tex', ROOT / 'web' / 'data'
TEX.mkdir(parents=True, exist_ok=True); DATA.mkdir(parents=True, exist_ok=True)
W, H, SW, SH = 1024, 512, 3087, 1554
T_MIN, T_MAX = -80.0, 60.0            # deg C  -> 0..255
P_MAX_M, P_MAX_A = 6400.0, 12000.0    # mm per month / per year (sqrt-coded)
ELEV_MAX = 8.0                        # km

z = np.load(SRC / 'climate_final_monthly.npz')
T = z['T_x100'].astype(np.float32) / 100
praw = z['P_x10'].astype(np.int32)
praw = np.where(praw < 0, praw + 65536, praw)          # the stored int16 wrapped above 3276.7 mm/month (78 land cells)
P = praw.astype(np.float32) / 10
land = T[..., 0] > -300                                  # sea was stored as -327 C
elev = np.fromfile(SRC / 'tilt25.2.elevkm.f32', np.float32).reshape(H, W)
print('land cells', int(land.sum()), '| monthly rain max %.0f mm' % P[land].max())

# ---- Koppen from the FINAL monthly climate (Alduran + its warm halo included), with the engine's own rules ----
with tempfile.TemporaryDirectory() as td:
    td = pathlib.Path(td)
    (np.where(land[..., None], T, 0).astype(np.float32).reshape(-1, 12)).tofile(td / 't.f32')
    (np.where(land[..., None], P, 0).astype(np.float32).reshape(-1, 12)).tofile(td / 'p.f32')
    land.astype(np.uint8).tofile(td / 'l.u8')
    subprocess.run(['node', str(ROOT / 'tools' / 'koppen_classify.mjs'), td / 't.f32', td / 'p.f32', td / 'l.u8', td / 'k.u8'], check=True)
    kop = np.fromfile(td / 'k.u8', np.uint8).reshape(H, W)
    kclasses = json.load(open(td / 'k.u8.classes.json'))

# ---- fill the sea with the nearest land value (coast-safe bilinear lookups) ----
idx = ndi.distance_transform_edt(~land, return_distances=False, return_indices=True)
fill = lambda a: a[idx[0], idx[1]]
Tf, Pf, Kf, Ef = fill(T), fill(P), fill(kop), fill(np.maximum(elev, 0))

q8 = lambda a: np.clip(np.round(a), 0, 255).astype(np.uint8)
enc_t = lambda t: q8((t - T_MIN) / (T_MAX - T_MIN) * 255)
enc_p = lambda p, pm: q8(np.sqrt(np.clip(p, 0, pm) / pm) * 255)
tiles = [np.dstack([enc_t(Tf[..., m]), enc_p(Pf[..., m], P_MAX_M), np.zeros((H, W), np.uint8)]) for m in range(12)]
tiles.append(np.dstack([enc_t(Tf.mean(2)), enc_p(Pf.sum(2), P_MAX_A), np.zeros((H, W), np.uint8)]))
aw = (z['alduran_w_x1000'].astype(np.float32) / 1000) if 'alduran_w_x1000' in z.files else np.zeros((H, W), np.float32)
tiles += [np.dstack([q8(aw * 255), np.zeros((H, W), np.uint8), np.zeros((H, W), np.uint8)])]          # tile 13: Alduran weight
tiles += [np.zeros((H, W, 3), np.uint8)] * 2
sheet = np.vstack([np.hstack(tiles[r * 4:(r + 1) * 4]) for r in range(4)])
Image.fromarray(sheet, 'RGB').save(TEX / 'clim.png', optimize=True)

# ---- painted biomes (reconciled in step 3) ----
prep = json.load(open(SRC / 'prep_report.json'))
classes = prep['classes']; n = len(classes)
final = np.array(Image.open(SRC / 'final_class_index.png')).astype(np.int16) // 15 - 1      # -1 sea, k class k
PAL = np.array([[53,126,64],[96,166,70],[190,196,84],[230,196,110],[222,150,70],[214,170,90],[216,208,130],[150,184,96],
                [120,200,120],[70,150,150],[110,168,70],[70,120,60],[60,100,110],[40,82,64],[168,176,160],[240,244,248]], np.float32)
lm = (final >= 0).astype(np.float32)
col = PAL[np.clip(final, 0, n - 1)] * lm[..., None]
num = cv2.GaussianBlur(col, (0, 0), 3.2); den = cv2.GaussianBlur(lm, (0, 0), 3.2)[..., None] + 1e-6
Image.fromarray(np.clip(num / den + .5, 0, 255).astype(np.uint8), 'RGB').save(TEX / 'biome_final.png', optimize=True)
fin_small = cv2.resize((final + 1).astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST)
fin_small = np.where(fin_small > 0, fin_small, fill(fin_small))
elev_b = np.where(land, 1 + np.clip(np.round(Ef / ELEV_MAX * 254), 0, 254), 0).astype(np.uint8)      # 0 = sea, 1..255 = land at 0..8 km
static = np.dstack([Kf.astype(np.uint8), fin_small.astype(np.uint8), elev_b])
Image.fromarray(static, 'RGB').save(TEX / 'clim_static.png', optimize=True)

# ---- json: encodings + legends ----
prof = json.load(open(SRC / 'alduran_profile.json'))
used = sorted(set(np.unique(kop[land]).tolist()))
area = {kclasses[k]['code']: round(float((kop[land] == k).mean() * 100), 2) for k in used}
meta = dict(
    tiltDeg=25.2, grid=[W, H], sheet=dict(file='tex/clim.png', cols=4, tile=[W, H], annualTile=12),
    static=dict(file='tex/clim_static.png', R='koppen id', G='painted class + 1 (sea filled with nearest land)', B='0 = sea, else 1 + elevation km / %g * 254' % ELEV_MAX),
    biomeFinal='tex/biome_final.png',
    enc=dict(tempMin=T_MIN, tempMax=T_MAX, rainMaxMonth=P_MAX_M, rainMaxYear=P_MAX_A, rain='value = pmax * (byte/255)^2', elevMaxKm=ELEV_MAX),
    monthNote='month 0 = the month after the northern winter solstice (Earth: January); the hottest northern month is 6',
    koppen=[dict(id=k, code=kclasses[k]['code'], name=kclasses[k]['name'], color=[round(c * 255) for c in kclasses[k]['color']], pctLand=area[kclasses[k]['code']]) for k in used],
    painted=[dict(id=c['id'], name=c['name'], code=c['code'], color=[int(v) for v in PAL[i]], pctLand=round(float((final == i).sum() / (final >= 0).sum() * 100), 2)) for i, c in enumerate(classes)],
    alduran={k: v for k, v in prof.items() if not k.startswith('_')},
    alduranClass=[c['id'] for c in classes].index('hyper_arid') + 1,
    alduranWeightTile=13,
)
json.dump(meta, open(DATA / 'climate.json', 'w'), separators=(',', ':'))
print('Koppen classes on land:', area)
print('wrote clim.png', sheet.shape, '| clim_static.png | biome_final.png | climate.json')
