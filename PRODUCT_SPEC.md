# FermentLab MVP product spec

FermentLab is a mobile-first workspace for home mead, cider, and wine makers. It replaces scattered notes and calculators with one reliable path from recipe idea to fermentation record.

## V1 outcomes
- Build and save recipes with volume, style, ingredients, gravity contribution, and target FG.
- Calculate OG, ABV, and honey additions deterministically in code.
- Scale recipes and switch displays between US and metric units.
- Log gravity, temperature, additions, and notes against a batch.
- Ask an AI Brewer questions using open recipe and batch context. AI explains and suggests; it never owns brewing math.

## Primary flow
Open Recipe Builder → enter fermentables and targets → review live numbers → save recipe → log a batch → ask for contextual guidance.

## Scope
V1 prioritizes mead, cider, fruit wine, and country wine. Beer-specific mash, hop, color, and bitterness calculations are deferred. Inventory, reminders, nutrient schedules, PDF export, Recipe Doctor, accounts, cloud sync, and subscriptions are future modules.

## Acceptance criteria
Phone and desktop layouts are usable; calculations update immediately; saved recipes and batch logs survive reload on the same device; unit switching preserves canonical quantities; Brewer responses include the current recipe context.
