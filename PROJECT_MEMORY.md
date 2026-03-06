# Urban Cool GIS - Project Memory

Last analyzed: 2026-03-07
Workspace: C:\Users\KIIT0001\Urbancool\Urban_Cool_GIS

## Project type
- Static frontend app (no backend in this repo).
- Main stack: HTML + CSS + vanilla JavaScript.
- Core map engine: Leaflet with plugins.

## Repository contents
- `index.html` (136 lines): main GIS dashboard layout (top bar, map, analytics panel, chatbot, footer).
- `script.js` (609 lines): all runtime logic (data, map, layers, filters, chatbot, language detection, charts).
- `style.css` (492 lines): dashboard and chatbot styling.
- `login.html` (198 lines): mock login UI and redirect to `index.html`.
- `register.html` (211 lines): mock registration UI and redirect flow.
- `earth_bg.png`: background image used on login/register pages.

## External runtime dependencies
Loaded via CDN in HTML files:
- Leaflet 1.9.4
- `leaflet.locatecontrol`
- `leaflet-control-geocoder`
- Chart.js

Network/API calls in runtime:
- Nominatim reverse geocode API for language-by-region detection in `script.js`.
- Avatar image from `ui-avatars.com` in `index.html`.

## Functional map of `script.js`
- Data and state:
  - `CITIES`, `HOTSPOTS_DATA`, `EV_STATIONS` arrays/objects.
  - `currentCity`, `layers`, `thresholds` state.
- Map setup:
  - Dark/light/satellite base maps.
  - Geocoder search integrated into top bar.
  - Dynamic city data generation when searched city is unknown.
- Layer rendering:
  - Heat circles, vegetation overlays, EV markers.
  - Threshold-based filtering and city filtering.
- Right panel:
  - Risk details and suggestion generation by temp/veg/cooling score.
- Controls/events:
  - City selector, layer toggles, threshold sliders, simulation button.
- Chatbot:
  - Keyword-based responses (en/hi/od/bn + dynamic additions).
  - Browser language and geolocation-driven language suggestion.
- Analytics:
  - Toggle map/analytics view.
  - Chart.js bar/line/doughnut charts for selected city.

## Known implementation notes
- Several text strings display mojibake in terminal output, indicating encoding inconsistencies in source files.
- Login/register flows are mock only (no real auth or persistence).
- Export Report button exists in `index.html` but no handler exists in `script.js`.
- Most logic is in one large `script.js` file (high coupling).

## Files to inspect first for common change types
- Map behavior or data logic: `index.html` + `script.js` + `style.css`.
- Chatbot/language behavior: `script.js` + `index.html`.
- Auth page UX only: `login.html` + `register.html` + `earth_bg.png`.
- Visual theme/layout changes: `style.css` + inline styles in `login.html`/`register.html`.

## Safe edit strategy for future tasks
1. Identify impacted UI surface (dashboard vs auth pages).
2. Update markup in relevant HTML first.
3. Update behavior in `script.js` and keep state transitions centralized.
4. Update `style.css` and check for conflicts with inline auth-page CSS.
5. Verify no broken selectors/IDs between HTML and `script.js`.

## Gaps to address when productionizing
- Split `script.js` into modules.
- Replace mock auth with real API/session flow.
- Add error handling and rate-limit handling for external APIs.
- Normalize file encoding to UTF-8.
- Add automated tests and a build/lint workflow.
