# english-storyboard-table-builder

## Purpose

Build the English storyboard table.

This stage is not a screenplay rewrite. It is a shot-level production table derived from the final English screenplay and setting bible.

Every scene from the screenplay must be expanded into a full shot sequence. The table must be usable for both human directors and AI image/video generation pipelines.

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
- `estimated_duration_sec`

## Minimum shot count per scene (anti-shrinkage rule)

| Scene type | Minimum shots |
|------------|--------------|
| Dialogue-driven | 4 |
| Action / conflict / chase | 6 |
| Emotional peak / reversal / reveal | 5 |
| Brief transitional scene (≤30s) | 2 |

**Season floor: total shot_rows ≥ total scene count × 4**

Do not compress multiple scenes into fewer rows than the minimum. The examples are condensed samples for format reference only — actual delivery must be full-volume.

## Shot sequence template

Each scene should follow this layered sequence (can be compressed; cannot skip establishing and emotional layers):

```
1. WIDE / ESTABLISHING     — space and character relationship
2. MEDIUM TWO-SHOT         — dialogue / confrontation coverage
3. MEDIUM / MCU            — protagonist reaction / emotional drive
4. CLOSE / CU              — key emotion or visual detail
5. INSERT / DETAIL         — prop, eyes, hands (if applicable)
6. WIDE / PULL BACK        — closing frame before transition (if applicable)
```

Every scene must cover at minimum: **establishing + emotional + detail** layers.

## Duration budget

`estimated_duration_sec` reference:

| Shot type | Suggested duration |
|-----------|--------------------|
| Wide / establishing | 3-6s |
| Dialogue medium coverage | 2-4s per beat |
| Emotional close-up | 2-5s |
| Detail insert | 1-3s |
| Transitional / cutaway | 1-2s |

Per-episode cumulative `estimated_duration_sec` must fall in **60-120s**.

## Prohibitions

1. Do not write only 1 shot per scene (unless explicitly a short transitional scene).
2. Do not output scene-level summaries as the main body.
3. Do not restate the screenplay in prose.
4. Do not omit IDs (`prop_ids`, `look_ids`, `location_id`).
5. Do not leave `ai_note` blank — every shot must have a specific note usable for AI image or video generation.
6. Do not use `visual_action` to summarize plot — describe the visible physical action only.

## Pre-output self-audit (mandatory)

Before submitting, verify all of the following:

```
□ shot_rows.length ≥ scene_count × 4
□ Every scene has shots covering: establishing + emotional + detail layers
□ Every scene has at least one WIDE/ESTABLISHING and one CLOSE/CU
□ All scene_ids in scene_index have corresponding shot rows (no missing scenes)
□ estimated_duration_sec per episode sums to 60-120s
□ All ai_note fields are filled with specific generation guidance
□ All prop_ids, look_ids, location_id fields are populated (not empty where assets exist)
```

Any check that fails must be resolved before submission.

## References

- `rules/13_分镜表规范.md`
- `rules/05_节奏曲线.md`
- `rules/07_反派设计体系.md`
- `examples/中间产物样例/storyboard_pack.json`
- `examples/最终交付样例/03_英文分镜表.md`
