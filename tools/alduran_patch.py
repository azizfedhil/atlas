#!/usr/bin/env python3
"""Re-do ONLY the Alduran hyper-desert inside the already-baked climate, leaving every other cell exactly as it is.

  reads   world/climate_src/climate_final_monthly.npz       the climate the atlas is baked from
          world/climate_src/alduran_profile.json            the hand-set figures
          world/climate_src/alduran_overlay_1024.png        the hyper-desert overlay you drew (soft edge), 1024x512, 0..255
          world/climate_src/tilt25.2.elevkm.f32             elevation (km), the same grid
  runs    the simulator's own climate engine (node, sim-src/) to get the unmodified simulation inside the hyper-desert
  writes  the npz again: only cells inside the hyper-desert footprint are different, plus the blend weight (alduran_w_x1000)

The footprint = the hyper-desert class of the painted map (alduran_mask in the npz, holes filled) + the overlay where it is >= 25 %.
Inside it the climate is   simulation * (1 - w) + hand-set * w   with w = 0 on the border and 1 `blend_cells` cells inward, so it meets the
neighbours exactly where it starts. Rain is blended in log space. See tools/alduran_blend.py.

then:   python3 -I tools/bake_climate.py        (rebuilds web/tex/clim.png etc.)
usage:  python3 -I tools/alduran_patch.py
"""
import json, pathlib, subprocess, tempfile, numpy as np
from PIL import Image
from scipy import ndimage as ndi
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import alduran_blend as AB

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'world' / 'climate_src'
H, W = 512, 1024

z = dict(np.load(SRC / 'climate_final_monthly.npz'))
Tx, Px = z['T_x100'].copy(), z['P_x10'].copy()
Tc = Tx.astype(np.float32) / 100
Pc = np.where(Px < 0, Px.astype(np.int32) + 65536, Px.astype(np.int32)).astype(np.float32) / 10         # the int16 wrapped above 3276.7 mm/month
land = Tc[..., 0] > -300
elev = np.fromfile(SRC / 'tilt25.2.elevkm.f32', np.float32).reshape(H, W)
prof = json.load(open(SRC / 'alduran_profile.json'))

# ---- footprint ----
foot = ndi.binary_fill_holes(z['alduran_mask'].astype(bool))
ovf = SRC / 'alduran_overlay_1024.png'
if ovf.exists(): foot |= (np.array(Image.open(ovf)).astype(np.float32) / 255 >= 0.25) & land
foot = ndi.binary_fill_holes(foot) & land
print('footprint cells', int(foot.sum()), '(class mask %d)' % int(z['alduran_mask'].sum()))

# ---- the simulation as it was before Alduran was written into it ----
with tempfile.TemporaryDirectory() as td:
    td = pathlib.Path(td); land.astype(np.uint8).tofile(td / 'land.u8')
    subprocess.run(['node', str(ROOT / 'tools' / 'run_climate_elev.mjs'), str(ROOT / 'sim-src'), str(SRC / 'tilt25.2.elevkm.f32'), str(td / 'land.u8'), str(td / 'sim')], check=True)
    S = np.fromfile(td / 'sim.t12.f32', np.float32).reshape(H, W, 12); SP = np.fromfile(td / 'sim.p12.f32', np.float32).reshape(H, W, 12)
outside = land & ~foot
print('simulation vs baked, 6..12 cells outside the border (should be ~0): %.3f C' % np.abs(S - Tc)[outside & (ndi.distance_transform_edt(~foot) > 12) & (ndi.distance_transform_edt(~foot) < 30)].mean())

# ---- base climate inside = the simulation + the (small) offset the neighbours carry, carried across the border; outside = as it is ----
off = np.where(outside[..., None], Tc - S, 0.0)
Cext = AB.continue_offset(off, outside, foot)
T_base = np.where(foot[..., None], S + Cext, Tc)
P_base = np.where(foot[..., None], SP, Pc)
Wt = AB.inward_weight(foot, prof['blend_cells'])
Tn, Pn, dtr = AB.blend(T_base, P_base, Wt, prof, elev)

# ---- write back: only footprint cells ----
Tx[foot] = np.round(Tn[foot] * 100).astype(np.int16)
Px[foot] = np.round(Pn[foot] * 10).astype(np.int16)
z['T_x100'], z['P_x10'] = Tx, Px
z['alduran_footprint'] = foot
z['alduran_w_x1000'] = np.round(Wt * 1000).astype(np.int16)
z['alduran_dtr_x10'] = np.round(np.nan_to_num(np.where(foot[..., None], dtr, np.nan), nan=0) * 10).astype(np.int16)
np.savez_compressed(SRC / 'climate_final_monthly.npz', **z)
_, day, night, mean_p, _ = AB.profile_months(prof)
print('hand-set mean by month:', np.round(mean_p, 1))
print('footprint mean by month now:', np.round(Tn[foot].mean(0), 1))
print('cells at full strength (w >= 0.999): %d of %d' % (int((Wt >= 0.999).sum()), int(foot.sum())))
