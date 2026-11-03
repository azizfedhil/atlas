#!/usr/bin/env python3
"""STEP 3 - reconcile the cleaned painted biomes with the simulated climate (tilt 25.2).
Painted map = authority for WHERE. Simulation = used for what the painter cannot see: altitude, and a consistent climate.
Alduran hyper-desert = protected custom class with a hand-set climate (alduran_profile.json).
usage: python3 -I tools/reconcile.py <build-dir>
"""
import sys, json, pathlib, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
B = pathlib.Path(sys.argv[1]); W, H, SW, SH = 1024, 512, 3087, 1554
prep = json.load(open(B / 'world/prep_report.json'))
ids = [c['id'] for c in prep['classes']]; ID = {k: i for i, k in enumerate(ids)}
cls = np.load(B / 'world/class_map_3087.npy').astype(np.int16)
land = cls >= 0
prof = json.load(open(B / 'alduran_profile.json'))

def load(name, shape=(H, W), dt=np.float32): return np.fromfile(B / f'sim/tilt25.2.{name}', dt).reshape(*shape, *([12] if name.startswith(('t12', 'p12')) else []))
T = load('t12.f32'); P = load('p12.f32'); elev = load('elevkm.f32'); kop = load('koppen.u8', dt=np.uint8)
up = lambda a, mode=cv2.INTER_LINEAR: cv2.resize(a, (SW, SH), interpolation=mode)

# ---------- 1. Alduran: hand-set climate replaces the simulation inside it, fading in from its border ----------
# (tools/alduran_blend.py). The season curve is hottest at month 6 (July) - it used to be written upside down, which made Alduran hot in January.
# The weight is 0 on the border and 1 `blend_cells` inside, so there is no outside halo any more: the neighbours are the pure simulation.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import alduran_blend as AB
ald = np.array(Image.fromarray((cls == ID['hyper_arid']).astype(np.uint8) * 255).resize((W, H), Image.BOX)) > 127
foot = ndi.binary_fill_holes(ald) & (elev > 0)
season, day, night, mean_prof, dtr_prof = AB.profile_months(prof)
w = AB.inward_weight(foot, prof['blend_cells'])
Tf, Pf, DTR = AB.blend(T, P, w, prof, elev)
Tf[elev <= 0] = T[elev <= 0]                                            # sea untouched
Pf[elev <= 0] = P[elev <= 0]
print('Alduran cells', int(foot.sum()), '| hottest-month mean now %.1f C (was %.1f)' % (np.nanmean(Tf[foot].max(1)), np.nanmean(T[foot].max(1))))

# ---------- 2. altitude: the painter sees flat land, the simulation knows the mountains ----------
Tmax = up(Tf.max(2)); El = up(elev); Tmin = up(Tf.min(2))
final = cls.copy()
protected = np.isin(cls, [ID['hyper_arid'], ID['arctic']])
polar = np.isin(cls, [ID['tundra'], ID['arctic']])
high = land & ~protected & (El > 1.0)
to_tundra = high & ~polar & (Tmax < 10)
to_ice = land & ~protected & (El > 2.0) & (Tmax < 1.0) & (cls != ID['arctic'])
final[to_tundra] = ID['tundra']; final[to_ice] = ID['arctic']
print('alpine tundra: %.2f%% of land | alpine ice: %.2f%% of land' % (to_tundra.sum() / land.sum() * 100, to_ice.sum() / land.sum() * 100))

# ---------- 3. re-smooth only where we changed things, drop specks ----------
n = len(ids); sig = 3.0; den = cv2.GaussianBlur(land.astype(np.float32), (0, 0), sig) + 1e-6
acc = np.stack([cv2.GaussianBlur(((final == i) & land).astype(np.float32), (0, 0), sig) / den for i in range(n)])
sm = np.argmax(acc, 0).astype(np.int16)
near = cv2.dilate((to_tundra | to_ice).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
final = np.where(near & ~protected, sm, final); final[~land] = -1
final[protected & (cls >= 0)] = cls[protected & (cls >= 0)]

# ---------- 4. disagreement map: where the painted biome and the simulated climate disagree most ----------
codes = json.load(open(B / 'sim/koppen_codes.json'))
grp = lambda c: 'A' if c in ('Af', 'Am', 'Aw') else 'B' if c.startswith('B') else 'C' if c.startswith('C') else 'D' if c.startswith('D') else 'E'
gmap = {g: i for i, g in enumerate('ABCDE')}
sg = np.array([gmap[grp(c)] if c != 'Ocean' else 0 for c in codes])[kop]
pgrp = {'Tropical_rainforest': 'A', 'Tropical_monsoon': 'A', 'Tropical_savanna': 'A', 'hot_dry_desert': 'B', 'hyper_arid': 'B', 'semi_arid': 'B', 'steppe': 'B',
        'mediterannean': 'C', 'humid_subtropical': 'C', 'oceanic': 'C', 'hot_continental': 'D', 'humid_continental': 'D', 'subarctic': 'D', 'Coniferous_forest': 'D', 'tundra': 'E', 'arctic': 'E'}
pg = np.array([gmap[pgrp[k]] for k in ids])
fsm = np.array(Image.fromarray((final + 1).astype(np.uint8)).resize((W, H), Image.NEAREST)).astype(int) - 1
dis = (fsm >= 0) & (pg[np.clip(fsm, 0, n - 1)] != sg) & (elev > 0)
print('painted vs simulated climate group agree on %.1f%% of land' % ((1 - dis.sum() / (fsm >= 0).sum()) * 100))

# ---------- outputs ----------
out = B / 'reconciled'; out.mkdir(exist_ok=True)
np.save(out / 'final_class_map_3087.npy', final); np.save(out / 'alduran_weight_1024.npy', w.astype(np.float32))
pal = np.array([[53,126,64],[96,166,70],[190,196,84],[230,196,110],[222,150,70],[214,170,90],[216,208,130],[150,184,96],[120,200,120],[70,150,150],[110,168,70],[70,120,60],[60,100,110],[40,82,64],[168,176,160],[240,244,248]], np.uint8)
sea = np.array([22, 28, 46], np.uint8)
rgb = np.where((final >= 0)[..., None], pal[np.clip(final, 0, n - 1)], sea).astype(np.uint8)
Image.fromarray(rgb).save(out / 'final_biomes_preview.png')
Image.fromarray(((final + 1) * 15).astype(np.uint8)).save(out / 'final_class_index.png')
ch = np.where((final != cls) & land, 1, 0)
ov = rgb.copy(); ov[ch == 1] = [255, 40, 200]
Image.fromarray(ov).save(out / 'changes_highlighted.png')
d3 = up(dis.astype(np.float32)) > .5
ov2 = (rgb * .45 + sea * .55).astype(np.uint8); ov2[d3 & land] = [255, 190, 40]
Image.fromarray(ov2).save(out / 'disagreement_with_simulation.png')
# per-biome alpha layers named like the atlas expects (world/<id>.png), ready for its bake script
(layers := out / 'atlas_layers').mkdir(exist_ok=True)
for i, k in enumerate(ids):
    a = ((final == i) * 255).astype(np.uint8)
    Image.fromarray(np.dstack([np.full_like(a, 0), np.full_like(a, 0), np.full_like(a, 0), a]), 'RGBA').save(layers / f'{k}.png', optimize=True)
# final climate with Alduran folded in
np.savez_compressed(out / 'climate_final_monthly.npz', T_x100=np.round(np.nan_to_num(Tf, nan=-327) * 100).astype(np.int16), P_x10=np.round(np.nan_to_num(Pf, nan=0) * 10).astype(np.int16),
                    alduran_mask=ald, alduran_footprint=foot, alduran_w_x1000=np.round(w * 1000).astype(np.int16),
                    alduran_dtr_x10=np.round(np.nan_to_num(DTR, nan=0) * 10).astype(np.int16))
rep = dict(alduran_cells=int(foot.sum()), alpine_tundra_pct_of_land=round(float(to_tundra.sum() / land.sum() * 100), 3), alpine_ice_pct_of_land=round(float(to_ice.sum() / land.sum() * 100), 3),
           group_agreement_pct=round(float((1 - dis.sum() / (fsm >= 0).sum()) * 100), 1),
           alduran_month_profile=dict(mean_c=[round(float(x), 1) for x in mean_prof], day_c=[round(float(x), 1) for x in day], night_c=[round(float(x), 1) for x in night]),
           final_pct_of_land={k: round(float((final == i).sum() / land.sum() * 100), 2) for i, k in enumerate(ids)})
json.dump(rep, open(out / 'reconcile_report.json', 'w'), indent=1); print(json.dumps(rep['final_pct_of_land']))
