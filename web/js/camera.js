// Smooth camera for the map, in the spirit of Google Maps:
//   - zoom eases towards its target (wheel notches add up, they never jump), and the point under the cursor stays put while it eases
//   - a drag moves the map 1:1 with the pointer; releasing a fast drag flings it and it decelerates
//   - wheel input is normalised across mice (line / pixel / page deltas), trackpads and pinch (ctrl + wheel)
//
// The camera owns the MOTION of the view. It writes into the same plain object the renderer reads (cx, cy, scale, lon0, lat0), so
// nothing else needs to know about it except the rule: any code that sets the view directly calls camera.stop() first.
// Time comes from an injected clock, so tools/test_camera.mjs can drive it deterministically without a browser.
// Flat maps pan the projected plane. Globes rotate (lon0 / lat0) the way Google Earth does: the point grabbed under the cursor STAYS under
// the cursor for the whole drag (not a fixed number of degrees per pixel), the wheel zooms into the point under the cursor by rotating
// the globe (the sphere itself never slides across the screen), and a fling keeps its angular speed and decelerates.
// The app supplies the geometry through the `globe` option: { active(), pick(sx, sy, W, H) -> [lon, lat] | null, place(g, sx, sy, W, H, latHint) -> [lon0, lat0] | null }.

export const ZOOM_TAU = 0.09;          // s: time constant of the zoom ease (about 63 % of a notch after 90 ms, 95 % after 270 ms)
export const WHEEL_K = 0.0016;         // natural-log zoom per wheel pixel: a 100 px notch is about x1.17 (the previous feel)
export const PINCH_K = 0.01;           // ctrl + wheel (trackpad pinch) per pixel; pinch sends many small deltas, so the total still adds up
export const WHEEL_CLAMP = 300;        // px: one event never zooms by more than about x1.6, whatever the device reports
export const FLING_TAU = 0.35;         // s: time constant of the fling deceleration (a flick travels about 0.35 s of its speed)
export const FLING_MIN = 150;          // px/s: slower releases just stop
export const FLING_MAX = 6000;         // px/s
const SAMPLE_MS = 100;                 // pointer history used to measure the release speed
const REST_MS = 80;                    // no movement for this long before the release means no fling
const ANCHOR_SLOP = 1.5;               // px: the cursor may move this much before a zoom re-anchors
const SETTLE = 1e-4;                   // log-scale distance under which the zoom is considered finished
export const FLY_MS = 650;             // ms: a glide to a place (flyTo) takes this long unless the caller says otherwise
const easeInOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

/** Wheel delta in pixels, whatever unit the device reported it in (Windows / Mac / Firefox lines / page scroll). */
export function wheelPixels(e) {
  let d = e.deltaY || 0;
  if (e.deltaMode === 1) d *= 40;            // lines
  else if (e.deltaMode === 2) d *= 800;      // pages
  return Math.max(-WHEEL_CLAMP, Math.min(WHEEL_CLAMP, d));
}

const wrapLon = (l) => ((l + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

/**
 * view: { cx, cy, scale, lon0, lat0 } (mutated in place)
 * limits: () => [minScale, maxScale]   (the app's zoom range, relative to the fitted world)
 * clock: () => ms
 */
export function createCamera({ view, limits = () => [1e-9, 1e12], clock = () => performance.now(), globe = null }) {
  let zoomTarget = null;                    // log-scale target of the zoom ease, null when not zooming
  let anchor = null;                        // { px, py, sx, sy }: projected point pinned under the screen point (sx, sy)
  let vel = { x: 0, y: 0 };                 // fling velocity, screen px / s
  let samples = [];                         // recent pointer positions for the release speed: { t, x, y } (raw events, not frames)
  let lastT = 0;                            // clock value of the last step (for dt)
  let gpin = null;                          // globe zoom: { g: [lon, lat] | null, sx, sy }, the geographic point pinned under the cursor
  let grabGeo = null;                       // globe drag: the geographic point grabbed at pointer-down (null: grabbed off the globe)
  let orient = [];                          // globe drag: recent { t, lon, lat } orientations for the release speed
  let avel = { lon: 0, lat: 0 };            // globe fling: angular velocity, rad / s
  let fly = null;                           // glide to a place: { t0, dur, from, to } (views), null when not gliding
  const geo = globe;                        // (step() and panBy() take a `globe` flag that would shadow the option)
  const onGlobe = () => !!(geo && geo.active());
  const clampLat = (l) => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, l));

  /** Pins the projected point under (sx, sy) for the current view, unless the same point is already pinned. */
  function pin(sx, sy, W, H) {
    if (anchor && Math.hypot(anchor.sx - sx, anchor.sy - sy) <= ANCHOR_SLOP) return;
    anchor = { px: view.cx + (sx - W / 2) / view.scale, py: view.cy - (sy - H / 2) / view.scale, sx, sy };
  }

  function panPx(dx, dy, globe) {
    if (globe) {
      view.lon0 = wrapLon(view.lon0 - dx / view.scale);
      view.lat0 = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, view.lat0 + dy / view.scale));
    } else {
      view.cx -= dx / view.scale;
      view.cy += dy / view.scale;
    }
  }

  const api = {
    /** true while the view is still moving on its own (zoom ease or fling) */
    active() { return zoomTarget !== null || fly !== null || vel.x !== 0 || vel.y !== 0 || avel.lon !== 0 || avel.lat !== 0; },

    /** true while a zoom ease is still running (not a fling or a drag) */
    zooming() { return zoomTarget !== null; },

    /** Where the running zoom ease will end ({ cx, cy, scale }), or null when no zoom is easing. Lets the overlay prepare its bitmap for the final view. */
    targetView(W, H) {
      if (zoomTarget === null) return null;
      const t = { cx: view.cx, cy: view.cy, scale: zoomTarget };
      if (anchor) { t.cx = anchor.px - (anchor.sx - W / 2) / zoomTarget; t.cy = anchor.py + (anchor.sy - H / 2) / zoomTarget; }
      return t;
    },

    /** Cancels any ease or fling and forgets the drag history. Call before setting the view directly. */
    stop() { fly = null; zoomTarget = null; anchor = null; gpin = null; grabGeo = null; vel = { x: 0, y: 0 }; avel = { lon: 0, lat: 0 }; samples = []; orient = []; },

    /** Multiplies the zoom by `factor`, easing there; the projected point under (sx, sy) stays under the cursor. */
    zoomAt(sx, sy, factor, W, H) {
      if (!(factor > 0)) return;
      const [min, max] = limits();
      fly = null;                                                                       // the user took over from a glide
      if (zoomTarget === null) { vel = { x: 0, y: 0 }; avel = { lon: 0, lat: 0 }; samples = []; }   // a zoom takes over from a fling
      if (onGlobe()) {                                                                  // globe: pin the geographic point under the cursor (rotation keeps it there)
        if (!gpin || Math.hypot(gpin.sx - sx, gpin.sy - sy) > ANCHOR_SLOP) gpin = { g: geo.pick(sx, sy, W, H), sx, sy };
        anchor = null;
      } else { gpin = null; pin(sx, sy, W, H); }
      const base = zoomTarget !== null ? zoomTarget : view.scale;
      zoomTarget = Math.min(max, Math.max(min, base * factor));
      lastT = clock();
    },

    /** A wheel event: normalised delta, finer for pinch (ctrl). */
    wheel(e, W, H) {
      const k = e.ctrlKey ? PINCH_K : WHEEL_K;
      api.zoomAt(e.clientX, e.clientY, Math.exp(-wheelPixels(e) * k), W, H);
    },

    /** Glides to a view: `to` may hold any of cx, cy, scale, lon0, lat0 (what it leaves out stays as it is). The scale eases in log space,
     *  a longitude takes the short way round, and any pan / zoom / drag by the user ends the glide where it is. */
    flyTo(to, ms = FLY_MS) {
      const [min, max] = limits(), now = clock();
      zoomTarget = null; anchor = null; gpin = null; grabGeo = null; vel = { x: 0, y: 0 }; avel = { lon: 0, lat: 0 }; samples = []; orient = [];
      const from = { cx: view.cx, cy: view.cy, scale: view.scale, lon0: view.lon0, lat0: view.lat0 };
      const end = { ...from, ...to };
      end.scale = Math.min(max, Math.max(min, end.scale));
      end.lon0 = from.lon0 + wrapLon(end.lon0 - from.lon0);
      end.lat0 = clampLat(end.lat0);
      fly = { t0: now, dur: Math.max(1, ms), from, to: end };
      lastT = now;
    },

    /** Records a pointer position for the release speed. Called for every pointer event of a drag, with the event's own time. */
    track(x, y, t = clock()) {
      samples.push({ t, x, y });
      while (samples.length > 2 && t - samples[0].t > SAMPLE_MS) samples.shift();
    },

    /** Moves the view by a drag step of (dx, dy) screen px, immediately (1:1 with the pointer). */
    /** Globe drag start: remembers the point under the cursor (nothing when the pointer is off the globe or the map is flat). */
    grab(sx, sy, W, H) {
      fly = null;
      grabGeo = onGlobe() ? geo.pick(sx, sy, W, H) : null;
      orient = [];
    },

    /** Globe drag step: rotates so the grabbed point is under (sx, sy). Returns false when there is nothing grabbed (use panBy then). */
    dragGlobe(sx, sy, W, H) {
      if (!grabGeo || !onGlobe()) return false;
      fly = null; zoomTarget = null; anchor = null; gpin = null; vel = { x: 0, y: 0 }; avel = { lon: 0, lat: 0 };
      const o = geo.place(grabGeo, sx, sy, W, H, view.lat0);
      if (o) {
        view.lon0 = o[0]; view.lat0 = o[1];
        const t = clock(); orient.push({ t, lon: o[0], lat: o[1] });
        while (orient.length > 2 && t - orient[0].t > SAMPLE_MS) orient.shift();
      }
      lastT = clock();
      return true;
    },

    panBy(dx, dy, globe) {
      fly = null; zoomTarget = null; anchor = null; gpin = null;
      vel = { x: 0, y: 0 }; avel = { lon: 0, lat: 0 };
      panPx(dx, dy, globe);
      lastT = clock();
    },

    /** The pointer was released after a drag: a fast enough drag keeps moving the map and decelerates. */
    release() {
      const t = clock();
      if (grabGeo) {                                                                    // globe: the fling keeps the angular speed of the last moments of the drag
        const recent = orient.filter((p) => t - p.t <= SAMPLE_MS);
        orient = []; samples = []; grabGeo = null;
        if (recent.length < 2 || t - recent[recent.length - 1].t > REST_MS) return;
        const first = recent[0], last = recent[recent.length - 1], span = last.t - first.t;
        if (span <= 0) return;
        const lon = wrapLon(last.lon - first.lon) / span * 1000, lat = (last.lat - first.lat) / span * 1000;
        const sp = Math.hypot(lon * Math.cos(last.lat), lat) * view.scale;              // screen px / s at the centre of the globe
        if (sp < FLING_MIN) return;
        const k = Math.min(1, FLING_MAX / sp);
        avel = { lon: lon * k, lat: lat * k }; lastT = t;
        return;
      }
      const recent = samples.filter((p) => t - p.t <= SAMPLE_MS);
      samples = [];
      if (recent.length < 2 || t - recent[recent.length - 1].t > REST_MS) return;   // a single sample, or the pointer rested before the release
      const first = recent[0], last = recent[recent.length - 1], span = last.t - first.t;
      if (span <= 0) return;
      const vx = (last.x - first.x) / span * 1000, vy = (last.y - first.y) / span * 1000;
      const sp = Math.hypot(vx, vy);
      if (sp < FLING_MIN) return;
      const k = Math.min(1, FLING_MAX / sp);
      vel = { x: vx * k, y: vy * k };
      lastT = t;
    },

    /** Advances the ease and the fling to the current time. Returns true when the view changed. */
    step(W, H, globe) {
      const t = clock();
      const dt = Math.min(0.05, Math.max(0, (t - lastT) / 1000));
      lastT = t;
      let moved = false;
      if (fly) {                                                                        // glide to a place: eased in time, scale in log space
        const u = Math.min(1, (t - fly.t0) / fly.dur), e = easeInOut(u), a = fly.from, b = fly.to;
        view.cx = a.cx + (b.cx - a.cx) * e; view.cy = a.cy + (b.cy - a.cy) * e;
        view.scale = Math.exp(Math.log(a.scale) + (Math.log(b.scale) - Math.log(a.scale)) * e);
        view.lon0 = wrapLon(a.lon0 + (b.lon0 - a.lon0) * e); view.lat0 = a.lat0 + (b.lat0 - a.lat0) * e;
        if (u >= 1) { Object.assign(view, b, { lon0: wrapLon(b.lon0) }); fly = null; }
        moved = true;
      }
      if (zoomTarget !== null) {
        const cur = Math.log(view.scale), tgt = Math.log(zoomTarget);
        let next = cur + (tgt - cur) * (1 - Math.exp(-dt / ZOOM_TAU));
        if (Math.abs(tgt - next) < SETTLE) { next = tgt; zoomTarget = null; }
        view.scale = Math.exp(next);
        if (anchor) {                                                                   // keep the pinned point under the cursor
          view.cx = anchor.px - (anchor.sx - W / 2) / view.scale;
          view.cy = anchor.py + (anchor.sy - H / 2) / view.scale;
        }
        if (gpin && gpin.g) {                                                           // globe: rotate so the pinned point stays under the cursor
          const o = geo.place(gpin.g, gpin.sx, gpin.sy, W, H, view.lat0);
          if (o) { view.lon0 = o[0]; view.lat0 = o[1]; }
        }
        if (zoomTarget === null) { anchor = null; gpin = null; }
        moved = true;
      }
      if (avel.lon !== 0 || avel.lat !== 0) {
        view.lon0 = wrapLon(view.lon0 + avel.lon * dt);
        view.lat0 = clampLat(view.lat0 + avel.lat * dt);
        const k = Math.exp(-dt / FLING_TAU);
        avel = { lon: avel.lon * k, lat: Math.abs(view.lat0) >= Math.PI / 2 ? 0 : avel.lat * k };
        if (Math.hypot(avel.lon * Math.cos(view.lat0), avel.lat) * view.scale < FLING_MIN) avel = { lon: 0, lat: 0 };
        moved = true;
      }
      if (vel.x !== 0 || vel.y !== 0) {
        panPx(vel.x * dt, vel.y * dt, globe);
        const k = Math.exp(-dt / FLING_TAU);
        vel = { x: vel.x * k, y: vel.y * k };
        if (Math.hypot(vel.x, vel.y) < FLING_MIN) vel = { x: 0, y: 0 };
        moved = true;
      }
      return moved;
    },
  };
  return api;
}
