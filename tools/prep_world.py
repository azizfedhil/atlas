#!/usr/bin/env python3
"""STEP 1 - turn the hand-painted layers into ONE clean class map + an app-ready heightmap.
usage: python3 -I tools/prep_world.py <painted-folder> <out-folder>
"""
import sys, pathlib, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
SRC, OUT = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
W, H = 3087, 1554                                        # the atlas's native grid (source / 4)

# id, file stem as painted, code, plain name
CLASSES = [
 ('Tropical_rainforest', 'Tropical Rainforest Af',            'Af',  'Tropical rainforest'),
 ('Tropical_monsoon',    'Tropical Monsoon Am',               'Am',  'Tropical monsoon'),
 ('Tropical_savanna',    'tropical savannah Aw',              'Aw',  'Tropical savanna'),
 ('hot_dry_desert',      'Hot Desert Bwh',                    'BWh', 'Hot desert'),
 ('hyper_arid',          'alduran Hyperdesert',               'BWh+','Alduran hyper-desert'),
 ('semi_arid',           'Hot Semi Arid Steppe BSh',          'BSh', 'Hot semi-arid steppe'),
 ('steppe',              'steppe',                            'BSk', 'Steppe'),
 ('mediterannean',       'Mediterannean Csa Csb',             'Cs',  'Mediterranean'),
 ('humid_subtropical',   'Humid Subtropical Sfa',             'Cfa', 'Humid subtropical'),
 ('oceanic',             'Oceanic Cfb Cfc',                   'Cfb', 'Oceanic'),
 ('hot_continental',     'Hot Summer Humid Contitnental Dfa', 'Dfa', 'Hot-summer humid continental'),
 ('humid_continental',   'Humid Continental Dfb',             'Dfb', 'Humid continental'),
 ('subarctic',           'Subarctic',                         'Dfc', 'Subarctic'),
 ('Coniferous_forest',   'Boreal Forest',                     'Dfc-b','Boreal forest (taiga)'),
 ('tundra',              'Tundra Et',                         'ET',  'Tundra'),
 ('arctic',              'Ice cap',                           'EF',  'Ice cap'),
]
n = len(CLASSES)

def down_alpha(path):
    a = Image.open(path).convert('RGBA').getchannel('A')
    return np.array(a.reduce(4) if a.size[0] == 12348 else a.resize((W, H), Image.BOX))

# ---- land (rivers healed so they stay land) ----
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import landrivers
tmp = OUT / '_srcland'; tmp.mkdir(exist_ok=True)
Image.fromarray(down_alpha(SRC / 'land.png'), 'L').convert('RGBA').save(tmp / 'land.png')
_a = np.array(Image.open(tmp / 'land.png'))[..., 0]; Image.fromarray(np.dstack([_a]*3 + [_a]), 'RGBA').save(tmp / 'land.png')
land_a, land_clean, rivers = landrivers.load(tmp)
land = land_clean > .5
print('land %.2f%%' % (land.mean()*100))

# ---- raw masks ----
masks = np.zeros((n, H, W), bool)
for i, (_, stem, _, _) in enumerate(CLASSES):
    masks[i] = down_alpha(SRC / (stem + '.png')) > 127
raw_area = masks.sum((1, 2))
cover = masks.sum(0)
stats = dict(overlap_px=int(((cover > 1) & land).sum()), gap_px=int(((cover == 0) & land).sum()),
             paint_on_sea_px=int(((cover > 0) & ~land).sum()), land_px=int(land.sum()))
print(stats)

# ---- 1. resolve overlaps like the atlas does: big first, small on top ----
cls = np.full((H, W), -1, np.int16)
for i in sorted(range(n), key=lambda i: -raw_area[i]):
    cls[masks[i]] = i
cls[~land] = -1
# ---- 2. fill gaps: nearest painted class (never across the sea: nearest *land* pixel) ----
gap = land & (cls < 0)
if gap.any():
    idx = ndi.distance_transform_edt(cls < 0, return_distances=False, return_indices=True)
    filled = cls[idx[0], idx[1]]
    cls = np.where(gap, filled, cls)
# land that is far from any paint (whole unpainted islands) falls back to nearest too - reported
# ---- 3. smooth the hand-painted edges: blur each class, argmax (keeps topology, removes jaggies/speckle) ----
sig = 4.0
acc = np.zeros((n, H, W), np.float32)
lm = land.astype(np.float32)
den = cv2.GaussianBlur(lm, (0, 0), sig) + 1e-6
for i in range(n):
    acc[i] = cv2.GaussianBlur(((cls == i) & land).astype(np.float32), (0, 0), sig) / den
sm = np.argmax(acc, 0).astype(np.int16); sm[~land] = -1
changed = int(((sm != cls) & land).sum())
cls = sm
# ---- 4. drop specks: connected pieces of one class under 60 px (≈ 0.0013% of the map) join their neighbours ----
for i in range(n):
    m = (cls == i).astype(np.uint8)
    k, lab, st, _ = cv2.connectedComponentsWithStats(m, connectivity=4)
    small = np.isin(lab, [j for j in range(1, k) if st[j, 4] < 60])
    if small.any():
        cls2 = cls.copy(); cls2[small] = -2
        idx = ndi.distance_transform_edt(cls2 == -2, return_distances=False, return_indices=True)
        cls[small] = cls2[idx[0], idx[1]][small]
cls[~land] = -1
# polar caps: above 85 degrees every land pixel is ice cap (the flat source is a whole row of detail at a single point)
_lat = 90 - (np.arange(H) + .5) / H * 180
cls[(np.abs(_lat) > 85)[:, None] & land] = [c[0] for c in CLASSES].index('arctic')

# ---- outputs ----
np.save(OUT / 'class_map_3087.npy', cls)
pal = np.array([[53,126,64],[96,166,70],[190,196,84],[230,196,110],[222,150,70],[214,170,90],[216,208,130],[150,184,96],
                [120,200,120],[70,150,150],[110,168,70],[70,120,60],[60,100,110],[40,82,64],[168,176,160],[240,244,248]], np.uint8)
rgb = np.where((cls >= 0)[..., None], pal[np.clip(cls, 0, n - 1)], np.array([22, 28, 46], np.uint8))
Image.fromarray(rgb.astype(np.uint8)).save(OUT / 'class_map_preview.png')
Image.fromarray(((cls + 1) * 15).astype(np.uint8)).save(OUT / 'class_map_index.png')   # 0 = sea, k = class k-1
Image.fromarray((land * 255).astype(np.uint8)).save(OUT / 'land_mask_3087.png')
Image.fromarray((np.clip(rivers, 0, 1) * 255).astype(np.uint8)).save(OUT / 'rivers_3087.png')

# ---- app-ready heightmap: the app reads 0 = sea, 1..255 = land (sqrt curve), so land is lifted to >= 2 ----
HW, HH = 4096, 2048
hl = Image.open(SRC / 'heightmap_land_only.png').convert('L').resize((HW, HH), Image.BOX)
hb = Image.open(SRC / 'heightmap_with_bathymetry.png').convert('L').resize((HW, HH), Image.BOX)
lm4 = cv2.resize((land_clean * 255).astype(np.uint8), (HW, HH), interpolation=cv2.INTER_AREA) > 127
hl = np.array(hl); hb = np.array(hb)
imp = np.where(lm4, np.maximum(hl, 2), 0).astype(np.uint8)
Image.fromarray(imp, 'L').save(OUT / 'import_heightmap_4096.png')
Image.fromarray(hb, 'L').save(OUT / 'bathymetry_4096.png')
Image.fromarray((lm4 * 255).astype(np.uint8), 'L').save(OUT / 'land_mask_4096.png')

# ---- report ----
lat = 90 - (np.arange(H) + .5) / H * 180
rep = dict(stats, smoothing_changed_px=changed, classes=[])
for i, (cid, stem, code, name) in enumerate(CLASSES):
    m = cls == i
    rows = np.where(m.any(1))[0]
    rep['classes'].append(dict(id=cid, code=code, name=name, source=stem + '.png', painted_pct_of_map=round(raw_area[i]/H/W*100, 3),
        final_pct_of_land=round(m.sum()/land.sum()*100, 3), lat_north=round(float(lat[rows[0]]), 1) if len(rows) else None,
        lat_south=round(float(lat[rows[-1]]), 1) if len(rows) else None))
json.dump(rep, open(OUT / 'prep_report.json', 'w'), indent=1)
for c in rep['classes']: print(f"{c['code']:6s} {c['name']:30s} {c['final_pct_of_land']:6.2f}% of land  {c['lat_south']}..{c['lat_north']}")
