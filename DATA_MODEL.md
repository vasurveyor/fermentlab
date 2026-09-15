# Data model

- `User`: id, email, display_name, unit_system, created_at.
- `Recipe`: id, user_id, name, fermentation_type, batch_volume_l, target_og, target_fg, notes, timestamps.
- `RecipeIngredient`: id, recipe_id, ingredient_id, stage, amount_g, volume_ml, gravity_ppg, sugar_percent, sort_order, notes.
- `Ingredient`: id, name, category, default_gravity_ppg, density, metadata_json.
- `Batch`: id, user_id, recipe_id, recipe_snapshot_json, name, status, started_at, completed_at, current_volume_l.
- `BatchEvent`: id, batch_id, event_type, observed_at, gravity_sg, temperature_c, amount_g, volume_ml, ingredient_id, note.
- `Conversation`: id, user_id, recipe_id, batch_id, created_at.
- `Message`: id, conversation_id, role, content, context_snapshot_json, created_at.

Canonical quantities are metric and convert only at the interface. Gravity is stored as specific gravity decimals. Recipe snapshots protect active batches from later recipe edits. AI messages can reference deterministic results but cannot write them. Ownership checks apply to all user data.
