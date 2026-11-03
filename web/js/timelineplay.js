// Timeline playback (batch 7): one requestAnimationFrame loop that advances the slider day by (days per second x elapsed time).
// Fractions of a day are carried over so slow speeds still move; a long hitch (a background tab) is clamped so the date never jumps years.
// The loop stops by itself at the end of the range, optionally at the next event, and when the day cannot move (history switched off).

export const SPEEDS = [
  { id: 'd1', label: '1 day / s', dps: 1 },
  { id: 'w1', label: '1 week / s', dps: 6 },
  { id: 'm1', label: '1 month / s', dps: 24.4 },
  { id: 'y1', label: '1 year / s', dps: 365 },
  { id: 'y10', label: '10 years / s', dps: 3652 },
  { id: 'y100', label: '100 years / s', dps: 36525 },
  { id: 'y500', label: '500 years / s', dps: 182625 },
];
export const speedById = (id) => SPEEDS.find((s) => s.id === id) || SPEEDS[3];

/**
 * getDay() -> current day, setDay(day) moves it, limits() -> [first, last] day of the range,
 * nextStop(from, dir) -> the next event day in the direction of travel (or null), onChange() after play / stop,
 * onStop(reason, day) when playback ended by itself: reason is 'event', 'end' or 'blocked'.
 */
export function createPlayer({ getDay, setDay, limits, nextStop, onChange = () => {}, onStop = () => {} }) {
  let dir = 0, speed = SPEEDS[3], acc = 0, last = 0, raf = 0, stopAtEvents = false;

  function end(reason) {
    const was = dir;
    dir = 0; acc = 0;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (was) { onChange(); if (reason) onStop(reason, getDay()); }
  }

  function frame(now) {
    raf = 0;
    if (!dir) return;
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    acc += dir * speed.dps * dt;
    const whole = acc < 0 ? Math.ceil(acc) : Math.floor(acc);
    if (whole !== 0) {
      acc -= whole;
      const from = getDay(), [lo, hi] = limits();
      let to = from + whole, reason = '';
      if (stopAtEvents) {
        const s = nextStop(from, dir);
        if (s !== null && (dir > 0 ? s <= to : s >= to)) { to = s; reason = 'event'; }
      }
      if (dir > 0 && to >= hi) { to = hi; reason = 'end'; }
      else if (dir < 0 && to <= lo) { to = lo; reason = 'end'; }
      setDay(to);
      if (reason) { end(reason); return; }
      if (getDay() === from) { end('blocked'); return; }
    }
    raf = requestAnimationFrame(frame);
  }

  function play(d) {
    dir = d < 0 ? -1 : 1;
    const [lo, hi] = limits();
    if (dir > 0 && getDay() >= hi) setDay(lo);            // pressing play at the end starts again from the beginning (and the other way round)
    else if (dir < 0 && getDay() <= lo) setDay(hi);
    acc = 0; last = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
    onChange();
  }

  return {
    get dir() { return dir; },
    get speed() { return speed; },
    play,
    toggle(d) { if (dir === (d < 0 ? -1 : 1)) end(''); else play(d); },
    stop() { if (dir) end(''); },
    setSpeed(id) { speed = speedById(id); },
    setStopAtEvents(on) { stopAtEvents = !!on; },
  };
}
