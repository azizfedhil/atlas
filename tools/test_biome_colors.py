#!/usr/bin/env python3
"""python tools/test_biome_colors.py -- checks the baked web/tex/biome.png after tools/recolor_biome.py (needs numpy + Pillow)."""
import pathlib, sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
img = np.array(Image.open(pathlib.Path(__file__).resolve().parent.parent / 'web/tex/biome.png').convert('RGB')).astype(int)
H, W, _ = img.shape; fail = 0
# A world baked without biome layers (tools/import_land.py with only land.png) is one flat land colour: nothing to check.
lit = img.sum(2) > 30; flat = (np.abs(img - np.array([191, 207, 148])).sum(2) <= 3) & lit
if flat.sum() > 0.85 * lit.sum(): print('SKIPPED: biome.png is a single land colour (no biome layers were baked)'); sys.exit(0)
def ok(c, m):
    global fail
    if not c: fail += 1; print('FAIL', m)
def count(h, tol=3): c = np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)]); return int((np.abs(img - c).sum(2) <= tol).sum())
ok(count('#cdb97f') == 0, 'no tan Mediterranean pixels remain (%d)' % count('#cdb97f'))
ok(count('#97b36b') > 50000, 'green Mediterranean present (%d)' % count('#97b36b'))
ok(count('#e6bb7e') > 10000, 'hyper-arid heartland present (%d)' % count('#e6bb7e'))
# the heartland (lon 51..76, lat -23..4) must contain no lime 'default' blob any more
x0, x1 = int((51 + 180) / 360 * W), int((76 + 180) / 360 * W); y0, y1 = int((90 - 4) / 180 * H), int((90 + 23) / 180 * H)
box = img[y0:y1, x0:x1]; lime = (np.abs(box - np.array([191, 207, 148])).sum(2) <= 3)
lab, n = ndi.label(lime); biggest = max([int((lab == i).sum()) for i in range(1, n + 1)] or [0])
ok(biggest < 500, 'no big lime patch left in the heartland box (largest %d px)' % biggest)
# the heartland is the hottest-looking region: its mean colour is warmer (R-B) than the Mediterranean green
warm = lambda m: float((m[..., 0] - m[..., 2]).mean())
ok(warm(box[np.abs(box - np.array([230, 187, 126])).sum(2) <= 3]) > 80, 'heartland ochre is warm')
# untouched colours are still present
for h, name in [('#86a883', 'conifer'), ('#a7c383', 'deciduous'), ('#ebd7a4', 'hot desert'), ('#f1f5f7', 'arctic')]: ok(count(h) > 1000, name + ' untouched')
ok(Image.open(pathlib.Path(__file__).resolve().parent.parent / 'web/tex/biome.png').size == (3087, 1554), 'size unchanged')
print('FAILED' if fail else 'all biome colour checks passed'); sys.exit(1 if fail else 0)
