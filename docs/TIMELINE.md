# History & timeline

The slider at the bottom of the atlas moves through the calendar. Countries and subdivisions can have a lifespan (Inspector > "Exists") and
border versions (Inspector > "Border history"); events are notes on the timeline.

## Using it
* **Slider / ruler.** The slider spans the *view window*, a stretch of the timeline range. Mouse wheel on the strip zooms around the pointer,
  Shift+wheel pans, double-click or the house button shows the whole range. The window follows the date.
* **Keys.** `,` `.` day back / forward (Shift = year) · `[` `]` previous / next event · `{` `}` previous / next change · `K` / `J` play forwards / backwards.
* **Playback.** Speeds from 1 day per second to 500 years per second. "Stop at events" pauses at every event and shows its title.
* **Snap.** While you drag the slider it sticks to events and changes; hold Alt to bypass, or turn Snap off.
* **Lanes.** One bar per country: when it exists, with white notches where its border changes. Click a bar to select the country, drag to pan.
* **On this day** (panel > Timeline): events running today, countries founded / dissolved / changing border today, the number of countries that exist,
  and buttons to the previous / next change.
* **Events** have a kind (Event, Founding, War, Treaty, Disaster, Discovery), search, kind filters, "use slider day" buttons, Go to, Show feature, Duplicate.

## Where things are stored
Nothing new is stored in the project file (the Rust core would drop unknown fields). An event's kind is a first line `[[k:war]]` in the event's notes;
the app hides it. Preferences (speed, snap, stop at events, lanes) are in `localStorage` under `cosmossi.tl.prefs`.

## Performance notes
* `store.setCurrent` emits `'day'` with `{ day, prev, epochChanged, switched }`. `epochChanged` is true only when the move crossed a day on which a
  feature starts / stops existing or switches border version (two binary searches in `store.changes.days`). The app repaints, rebuilds lists and
  repaints the globe only then, and touches only the `switched` features. List refreshes are throttled to 120 ms.
* Slider input is coalesced to one move per animation frame. The playhead is a DOM element moved with `transform`; the strip canvas repaints at most once
  per frame and only when its data / window / width / hover changed.
* Events are indexed once per change (`buildEventIndex`); markers are merged into 6 px buckets, so thousands of events stay cheap.
* Playback is a single `requestAnimationFrame` loop; the "On this day" card refreshes at most every 120 ms while playing; the climate "follow the timeline"
  layer refreshes at most every 60 ms.

## Code
`web/js/timeline.js` (model + pure helpers) · `store.js` (state, `'day'` event, border versions) · `timelineui.js` (bar + panel) ·
`timelinestrip.js` (canvas: eras, ruler, lanes, view window) · `timelineplay.js` (playback) · `web/css/timeline.css`.

## Bottom bar
The history bar shares the bottom row with the scale bar (left) and the projection / coordinates readout (right). Folded (the ▾ button) or with History off, the three are separate small bars and the history bar sits between the other two. Open, they merge into one box and the controls (transport, strip, speed, Snap, Stop, Lanes, Filter, Era, Jump, Today) grow upward out of the row. The state comes from the `min` and `paused` classes on `#timeline`; `web/js/botbar.js` watches them and `web/css/botbar.css` animates. The Filter, Era, Jump and Today controls moved from the header into the tools line so the header stays narrow enough for the middle slot.
