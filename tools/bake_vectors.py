#!/usr/bin/env python3
"""Bake vector coastlines/lakes and river centrelines in lon/lat.

  web/data/coast.json : {"coast": [[lon100, lat100, ...], ...], "rivers": [{"w": 1..3, "p": [lon100, lat100, ...]}, ...]}
  Coordinates are integers in 1/100 degree. Contours that touch the image edge are left open (the seam /
  the poles) so no artificial line is drawn along the map border.

usage: python tools/bake_vectors.py path/to/world/
"""
import sys, json, pathlib, numpy as np, cv2
from scipy import ndimage as ndi
from skimage import measure, morphology
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import landrivers

SRC = sys.argv[1] if len(sys.argv) > 1 else 'world'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'web' / 'data'
OUT.mkdir(parents=True, exist_ok=True)
land_a, land_clean, rivers = landrivers.load(SRC)
H, W = land_a.shape

def to_lonlat(rc):                       # rc = (row, col) in pixel-centre index space
    lon = (rc[:, 1] + .5) / W * 360 - 180
    lat = 90 - (rc[:, 0] + .5) / H * 180
    return np.round(np.column_stack([lon, lat]) * 100).astype(int).ravel().tolist()

def simplify(pts, eps):
    a = pts[:, ::-1].astype(np.float32).reshape(-1, 1, 2)       # (x, y) for OpenCV
    return cv2.approxPolyDP(a, eps, False).reshape(-1, 2)[:, ::-1]

# ---- coast + lakes: sub-pixel 0.5 iso-line of a lightly smoothed land field ----
field = cv2.GaussianBlur(land_clean, (0, 0), 0.7)
coast, npts = [], 0
for c in measure.find_contours(field, 0.5):
    if len(c) < 5: continue
    ext = c.max(0) - c.min(0)
    if max(ext) < 2.0: continue                                  # specks
    s = simplify(c, 0.30)
    if len(s) < 3: continue
    coast.append(to_lonlat(s)); npts += len(s)
print('coast paths', len(coast), 'points', npts)

# ---- rivers: skeleton -> greedy path tracing -> smooth + simplify ----
skel = morphology.skeletonize(rivers)
pts = set(zip(*[a.tolist() for a in np.nonzero(skel)]))
N8 = [(-1, 0), (0, -1), (0, 1), (1, 0), (-1, -1), (-1, 1), (1, -1), (1, 1)]          # orthogonal first
nb = lambda p: [(p[0] + dy, p[1] + dx) for dy, dx in N8 if (p[0] + dy, p[1] + dx) in pts]
visited, paths = set(), []
def extend(path):
    while True:
        cur = path[-1]
        cand = [q for q in nb(cur) if q not in visited]
        if not cand: return
        visited.add(cand[0]); path.append(cand[0])
for p in sorted(p for p in pts if len(nb(p)) == 1):                                   # from endpoints
    if p in visited: continue
    visited.add(p); path = [p]; extend(path); paths.append(path)
for p in sorted(pts):                                                                   # branches / loops
    if p in visited: continue
    v = [q for q in nb(p) if q in visited]
    path = ([v[0]] if v else []) + [p]; visited.add(p); extend(path); paths.append(path)
out_r, rpts = [], 0
for path in paths:
    if len(path) < 5: continue
    a = np.array(path, float)
    a = np.column_stack([ndi.gaussian_filter1d(a[:, 0], 1.6, mode='nearest'), ndi.gaussian_filter1d(a[:, 1], 1.6, mode='nearest')])
    s = simplify(a, 0.45)
    L = len(path)
    out_r.append({'w': 1 if L < 70 else 2 if L < 220 else 3, 'p': to_lonlat(s)}); rpts += len(s)
print('river paths', len(out_r), 'points', rpts)

(OUT / 'coast.json').write_text(json.dumps({'v': 1, 'coast': coast, 'rivers': out_r}, separators=(',', ':')))
print('wrote', OUT / 'coast.json', (OUT / 'coast.json').stat().st_size // 1024, 'KB')
