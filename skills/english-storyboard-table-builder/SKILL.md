# english-storyboard-table-builder

## Purpose

Build the English storyboard table.

This stage is not a screenplay rewrite. It is a shot-level production table derived from the final English screenplay and setting bible.

## Input

- `english_setting_bible`
- `english_outline_pack`
- `english_screenplay_pack`

## Output

- `storyboard_pack.json`
- final document target: `03_<剧名>_英文分镜表.docx`

## Required content

1. `Quick Reference`
2. scene index
3. shot rows
4. storyboard markdown

## Required row fields

- `shot_id`
- `episode_id`
- `scene_id`
- `slugline`
- `shot_size`
- `camera_angle_or_move`
- `visual_action`
- `dialogue_anchor`
- `emotion`
- `character_ids`
- `location_id`
- `prop_ids`
- `look_ids`
- `sfx_music`
- `transition`
- `ai_note`

## Prohibitions

1. Do not output scene-level summaries as the main body.
2. Do not restate the screenplay in prose.
3. Do not omit IDs.

## References

- `rules/13_分镜表规范.md`
- `examples/中间产物样例/storyboard_pack.json`
- `examples/最终交付样例/03_英文分镜表.md`
