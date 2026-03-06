# Contributing

Thanks for contributing to Urban Cool GIS.

## Development setup
1. Clone the repository.
2. Open the project folder.
3. Start a local server:

```bash
python -m http.server 5500
```

4. Open `http://localhost:5500/index.html`.

## Scope
- Keep this project frontend-only unless a backend change is explicitly discussed.
- Prefer small, focused pull requests.
- Preserve existing UI IDs/classes used by `script.js` unless you also update the JS.

## Pull request checklist
- Explain what changed and why.
- Include before/after screenshots for UI changes.
- Confirm `node --check script.js` passes.
- Confirm the app still loads from `login.html` and `index.html`.

## Coding guidelines
- Use clear variable names.
- Keep behavior changes in `script.js` modular and documented.
- Keep styles in `style.css` unless a page intentionally uses inline styles.
- Use UTF-8 encoding for text files.

## Commit messages
Use short imperative messages, for example:
- `Add report export for selected city`
- `Fix map toggle label in analytics mode`

