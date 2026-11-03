"""Shared extraction of the cleaned land field and the river mask from land.png (used by the bake scripts)."""
import os, pathlib, numpy as np, cv2
from PIL import Image


def alpha(src, name):
    return np.array(Image.open(pathlib.Path(src) / name).convert('RGBA'))[..., 3]


def load(src):
    """-> land_a (float 0..1), land_clean (rivers filled in), rivers (bool, thin lines inside land)"""
    land_a = alpha(src, 'land.png').astype(np.float32) / 255
    water = land_a < .5
    n, lab, st, _ = cv2.connectedComponentsWithStats(water.astype(np.uint8), connectivity=8)
    ocean = lab == (1 + np.argmax(st[1:, 4]))
    coast_zone = cv2.dilate(ocean.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))) > 0
    cand = (land_a < .93) & (land_a > .04) & ~coast_zone
    cand = cv2.morphologyEx(cand.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8)) > 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(cand.astype(np.uint8), connectivity=8)
    keep = np.zeros(n, bool); keep[1:] = st[1:, 4] >= 25
    solid = cv2.erode((land_a < .5).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    rivers = keep[lab] & ~cv2.dilate(solid.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    land_clean = np.where(rivers, 1.0, land_a).astype(np.float32)
    return land_a, heal_poles(land_clean), rivers


def heal_poles(land, full_deg=float(os.environ.get('POLE_FULL', 85.5)), zero_deg=float(os.environ.get('POLE_ZERO', 88.5))):
    """A pole is one point, but the flat source has a whole row of detail there. Between 85.5 and 88.5 degrees the
    land field is blended toward the value the pole itself has (open water at the north, ice-land at the south),
    so no spokes appear on globes. Affects ~0.1% of the planet's surface.
    Stronger healing:  POLE_FULL=80 POLE_ZERO=86 python tools/bake_textures.py ...  (and bake_vectors.py)"""
    H = land.shape[0]
    lat = np.abs(90 - (np.arange(H) + .5) / H * 180)
    t = np.clip((zero_deg - lat) / (zero_deg - full_deg), 0, 1)
    keep = (t * t * (3 - 2 * t)).astype(np.float32)[:, None]            # 1 = untouched, 0 = fully healed
    out = land.copy()
    for rows in (slice(0, H // 2), slice(H // 2, H)):                   # north half, south half
        half = land[rows]
        edge = half[:6] if rows.start == 0 else half[-6:]
        forced = os.environ.get('POLE_NORTH' if rows.start == 0 else 'POLE_SOUTH', 'auto').lower()   # land | water | auto
        target = 1.0 if forced == 'land' else 0.0 if forced == 'water' else (1.0 if edge.mean() > .5 else 0.0)
        k = keep[rows]
        out[rows] = half * k + target * (1 - k)
    return out.astype(np.float32)
