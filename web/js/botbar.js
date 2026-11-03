// Bottom bar: the scale bar, the history header and the projection / coordinates readout share one row (scale bar | history | readout).
// Collapsed: three small bars side by side, the history bar between the other two. Expanded: one merged box, and the history
// controls (#tlBody) grow upward out of the row. All motion is CSS (css/botbar.css); this file only decides WHEN the box is open.
// Performance: no per-frame work and no pointer / scroll / resize listeners. The open state is read from the classes that app.js
// ('min') and timelineui.js ('paused') already put on #timeline, through ONE MutationObserver on that class attribute. While the box
// is closed #tlBody is display:none, so the timeline strip neither measures nor paints its canvas and the controls cost nothing.

const CLOSE_MS = 360;     // a little longer than the slowest transition in css/botbar.css (.32 s + .08 s delay)

export function createBotBar() {
  const bar = document.getElementById('botbar'), tl = document.getElementById('timeline'), body = document.getElementById('tlBody');
  if (!bar || !tl || !body) return null;
  const reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  let open = null, armed = false, hideTimer = 0;

  /** open = the history controls are in use: not folded by the user ('min') and the history feature is on (not 'paused') */
  const wanted = () => !tl.classList.contains('min') && !tl.classList.contains('paused');

  function apply(next) {
    if (next === open) return;
    open = next;
    clearTimeout(hideTimer);
    if (next) {
      body.hidden = false;                         // back in layout first: the strip measures its width and paints once
      if (armed) void bar.offsetHeight;            // commit the closed layout, so the row growth below is animated
      bar.dataset.open = '1';
    } else {
      bar.dataset.open = '0';
      if (!armed || reduced.matches) body.hidden = true;
      else hideTimer = setTimeout(() => { if (!open) body.hidden = true; }, CLOSE_MS);
    }
  }
  const sync = () => apply(wanted());

  bar.classList.add('bb-still');                   // no transitions while the app boots: the saved state appears at once
  new MutationObserver(sync).observe(tl, { attributes: true, attributeFilter: ['class'] });
  sync();
  requestAnimationFrame(() => requestAnimationFrame(() => { armed = true; bar.classList.remove('bb-still'); }));
  return { sync, get open() { return open; } };
}
