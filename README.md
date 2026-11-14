# FermentLab

**Build it. Measure it. Make it better.**

FermentLab is a mobile-first workspace for designing, calculating, saving, and tracking home-fermentation recipes. The current MVP focuses on mead, melomel, cider, cyser, and fruit wine.

## Current MVP

- Build recipes by fermentation stage: Primary, Secondary, and Finish
- Calculate estimated OG, FG, ABV, fermentable sugar, and fermentation time
- Scale recipes and switch between US and metric units
- Choose from detailed yeast profiles with tolerance, temperature, use, and nutrient guidance
- Add, remove, and save custom ingredients
- Measure in lb, oz, gal, qt, pt, cup, tbsp, and tsp (US) or kg, g, L, and mL (metric); the unit lists follow the US / Metric toggle
- Keep your own ingredient and yeast library in the Library tab, with a PPG and sugar sanity check on every entry
- Pick a saved recipe from the recipe name field to load it
- Save recipes and batch logs in the browser with `localStorage`
- Give the AI Brewer read-only recipe and batch context while keeping brewing math deterministic
- Use a responsive interface designed for phones first

## Project structure

- `app/` — FermentLab interface, domain data, calculations, and styles
- `public/` — static assets, including the FermentLab favicon
- `PRODUCT_SPEC.md` — product goals and MVP behavior
- `ARCHITECTURE.md` — technical architecture and implementation notes
- `DATA_MODEL.md` — recipe, batch, ingredient, and yeast data model
- `tests/` — automated test area
- `scripts/` — local build and packaging helpers

## Run locally

FermentLab requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Then open the local address shown in the terminal.

## Verify a production build

```bash
npm run build
```

## Current storage model

Recipes, batch logs, and custom ingredient presets are stored in the current browser. Clearing browser storage removes that local data. Cloud accounts and cross-device synchronization are outside the current MVP.

## Product direction

Likely next steps include richer batch tracking, exportable recipe cards, shared ingredient data, account-backed storage, and expanded fermentation styles.

## Technology

FermentLab uses React, TypeScript, Next.js-compatible Vinext, Tailwind CSS, and Cloudflare Workers tooling.

## Hosting on GitHub Pages

The app is client-only, so `npm run build:pages` makes a static copy in `dist-pages/` (config in `vite.pages.config.ts`, entry in `static/`). The `Deploy to GitHub Pages` workflow publishes it on every push to `main`. In the repo, set Settings > Pages > Source to "GitHub Actions".
