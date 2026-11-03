#!/usr/bin/env python3
"""Alduran hyper-desert: the hand-set climate and how it blends into the simulated one. Shared by tools/reconcile.py and tools/alduran_patch.py.

Everything here works on the 1024x512 climate grid, 12 monthly slices (slice 0 = the month after the northern winter solstice, Earth: January).

  season     0 (winter) .. 1 (summer), a cosine that is 1 at `hottest_month_index` (default 6 = July) and 0 six slices later.
             (It used to be written 0.5 - 0.5*cos(..), which is 0 at month 6: Alduran was hottest in January. Fixed.)
  weight     how much of the hand-set climate a cell gets: 0 on the footprint's border, rising smoothly to 1 `blend_cells` cells inside it,
             and 0 everywhere outside it. Nothing outside the footprint is ever written.
"""
import numpy as np
import cv2
from scipy import ndimage as ndi


def profile_months(prof):
    """per-slice day high, night low, mean and day-night range (deg C) of the hand-set Alduran climate"""
    m = np.arange(12)
    peak = float(prof.get('hottest_month_index', 6))
    season = 0.5 + 0.5 * np.cos(2 * np.pi * (m - peak) / 12)            # 1 at the hottest slice, 0 at the coldest
    day = prof['winter_day_high_c'] + (prof['summer_day_high_c'] - prof['winter_day_high_c']) * season
    night = prof['winter_night_low_c'] + (prof['summer_night_low_c'] - prof['winter_night_low_c']) * season
    return season, day, night, (day + night) / 2, day - night


def smootherstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * x * (x * (x * 6 - 15) + 10)


def inward_weight(footprint, feather_cells):
    """0 on the border cells of `footprint`, smooth up to 1 at `feather_cells` inside; 0 outside"""
    foot = footprint.astype(bool)
    d = ndi.distance_transform_edt(foot)                                 # >= 1 inside, distance to the nearest outside cell
    w = smootherstep((d - 1.0) / max(float(feather_cells), 1e-3))
    w = cv2.GaussianBlur(w.astype(np.float32), (0, 0), 1.2) * foot       # iron out the staircase of the 1024-px border; still 0 outside
    return np.clip(w, 0, 1).astype(np.float32)


def continue_offset(offset, valid, foot):
    """`offset` is known on `valid` cells (outside the footprint). Carry it a little way into the footprint so the blend meets the outside without a seam."""
    iy, ix = ndi.distance_transform_edt(~valid, return_distances=False, return_indices=True)
    carried = np.where(foot[..., None], offset[iy, ix], offset)
    sm = np.stack([cv2.GaussianBlur(carried[..., k].astype(np.float32), (0, 0), 2.0) for k in range(carried.shape[2])], axis=2)
    return np.where(foot[..., None], sm, 0.0).astype(np.float32)


def blend(T_base, P_base, W, prof, elev_km=None):
    """T_base, P_base: (H, W, 12) climate the weight blends away from. Returns T, P and the day-night range (nan where W == 0)."""
    _, day, night, mean_p, dtr_p = profile_months(prof)
    lapse = 0.0 if elev_km is None else (prof.get('lapse_c_per_km', 0) * np.maximum(elev_km - 0.3, 0))[..., None]   # 0 by default: the figures hold on high ground too
    w3 = W[..., None]
    T = T_base * (1 - w3) + (mean_p[None, None, :] - lapse) * w3
    rain = np.float32(prof['annual_rain_mm'] / 12.0)
    P = np.exp(np.log(np.maximum(P_base, 0.05)) * (1 - w3) + np.log(max(rain, 0.05)) * w3)   # rain blends in log space: it dries out quickly, like a rain shadow
    P = np.where(w3 >= 0.999, rain, np.where(w3 > 0, P, P_base))       # w == 0: the rain is left exactly as it was
    dtr = np.where(w3 > 0, dtr_p[None, None, :] * w3, np.nan).astype(np.float32)
    return T.astype(np.float32), P.astype(np.float32), dtr
