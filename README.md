# Urban Cool GIS

[![CI](https://github.com/Rajit-helix/Urban_Cool_GIS/actions/workflows/ci.yml/badge.svg)](https://github.com/Rajit-helix/Urban_Cool_GIS/actions/workflows/ci.yml)

Urban Cool GIS is a frontend dashboard prototype for urban heat analysis and mitigation planning. It combines an interactive map, city hotspot overlays, EV station visualization, multilingual assistant responses, and analytics charts in a single-page web interface.

## Features
- Interactive Leaflet map with dark, light, and satellite basemaps
- Heat hotspot circles with threshold filtering
- Vegetation and EV station layer toggles
- City switching with dynamic mock data generation for searched locations
- Right-panel hotspot recommendations and intervention suggestions
- Analytics mode with Chart.js visualizations
- Multilingual chatbot responses (English, Hindi, Odia, Bengali, with dynamic additions)
- Mock login and registration pages

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet + Leaflet plugins
- Chart.js

## Project Structure
- `index.html`: Main dashboard UI
- `script.js`: Core logic (map layers, filters, chatbot, analytics, language detection)
- `style.css`: Dashboard and chatbot styling
- `login.html`: Mock sign-in page
- `register.html`: Mock sign-up page
- `earth_bg.png`: Background asset used by auth pages

## Run Locally
Because this is a static frontend project, you can run it with any local static server.

1. Open the project directory.
2. Start a local server (example with Python):

```bash
python -m http.server 5500
```

3. Open:
- `http://localhost:5500/login.html` (login flow)
- `http://localhost:5500/index.html` (dashboard directly)

You can also use VS Code Live Server or any equivalent static host.

## Notes
- Authentication is currently mocked (no backend auth/session).
- Data is mock/demo data generated in `script.js`.
- Text files are saved in UTF-8 encoding for consistent multilingual rendering.

## Roadmap Ideas
- Add real backend APIs for hotspots, EV stations, and user auth
- Split `script.js` into modules
- Add CSV/PDF export formats in addition to JSON report export
- Add tests and linting pipeline

## Community
- Contribution guide: `.github/CONTRIBUTING.md`
- Security policy: `.github/SECURITY.md`
- Code of conduct: `.github/CODE_OF_CONDUCT.md`

## Repository
GitHub: `https://github.com/Rajit-helix/Urban_Cool_GIS`
