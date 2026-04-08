# source-narrative-digest

## Purpose

After `story_bible.json` exists, produce a **readable five-axis digest of the source story** (原文五维梳理). This is **not** adaptation or洗稿: it restates plot, structure, backgrounds, functional character profiles, and relationship evolution **as implied by the source**, using stable IDs from `story_bible`.

Downstream `overseas-adaptation-planner` must use this digest plus `story_bible` to build the locked `adaptation_plan`.

## Input

- `story_bible.json` (merged; authoritative for `character_id`, locations, props)
- Long text: per `rules/16_长文本分段执行规范.md`, **do not** re-ingest the full novel in one call. If a detail is missing from `story_bible`, re-read only the relevant `source_chunks` excerpt.

## Output

- `narrative_digest.json` satisfying [`schema.json`](schema.json)

## Field mapping (中文对照)

| JSON key | 梳理项 |
|----------|--------|
| `plot_direction` | 剧情走向 |
| `story_structure` | 故事结构 |
| `character_backgrounds` | 人物背景 |
| `character_profiles` | 人物设定（功能层：欲望/恐惧/手段等） |
| `relationships_and_turns` | 人物关系与转变 |

## Minimum standard

1. Every principal in `story_bible.character_cards` appears in both `character_backgrounds` and `character_profiles` with the same `character_id`.
2. `relationships_and_turns.pairs_or_triads` must cover all major dynamics in `story_bible.relationship_map` (may merge redundant edges).
3. `plot_direction.key_turns` must align with `story_bible.conflict_map` / major beats where present.
4. No invented main plot: if `story_bible` is thin, mark gaps in prose inside the digest fields rather than fabricating.

## Prohibitions

1. Do not output `adaptation_plan` fields, hooks, or episode maps here.
2. Do not rename characters for adaptation (that belongs in `adaptation_plan.character_rename_map`).
3. Do not write screenplay, outline episodes, or shot rows.

## References

- `rules/16_长文本分段执行规范.md`
- `skills/source-analysis/schema.json`
- `examples/中间产物样例/narrative_digest.json`
