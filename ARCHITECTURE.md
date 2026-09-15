# Technical architecture

## Current scaffold
Vinext/React with TypeScript, Tailwind CSS, Shadcn/Radix primitives, and device-local browser storage. The working surface is divided into recipe, calculator, batch, library, and Brewer domains.

Pure calculation functions are isolated from conversational guidance. The Brewer reads calculated values but cannot write or override them. A read-only WebMCP tool exposes the current recipe to compatible browser agents.

## Production evolution
Add a repository/service layer between UI and persistence, then replace the local adapter with authenticated API endpoints and D1/SQLite repositories. Put AI behind a server endpoint that builds a bounded context packet, validates structured output, and never writes deterministic result fields.

## Extension seams
Inventory links ingredients to owned lots. Reminders and nutrient schedules link to batch events. PDF export reads immutable snapshots. Recipe Doctor returns advisory findings. Subscription entitlements remain separate from the pure calculation module.
