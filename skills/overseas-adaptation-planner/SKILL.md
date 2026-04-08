# overseas-adaptation-planner

## Purpose

Turn `story_bible` plus **`narrative_digest.json`** into a structured overseas short-drama adaptation plan that **locks** narrative and naming for all downstream stages.

This stage defines the commercial and narrative plan for all downstream documents. It does not write the setting bible, outline, screenplay, or storyboard table itself.

## Input

- `story_bible` (merged; if `supporting_evidence` is thin, **only** re-read the relevant `source_chunks` / chapter excerpts — **not** the full novel, per `rules/16`)
- `narrative_digest` (五维原文梳理; must exist before this stage)

## Output

- `adaptation_plan.json`

## Required output fields

- `target_market`
- `episode_count`
- `episode_duration`
- `primary_tropes`
- `opening_template`
- `hook_distribution`
- `season_hook_map`
- `episode_hook_map`
- `paywall_map`
- `rhythm_curve`
- `satisfaction_mix`
- `villain_ladder`
- `cultural_swap_rules`
- `role_function_map`
- `forbidden_traps`
- `adaptation_summary`
- `adapted_plot_direction` — 改编后剧情走向；对照 `narrative_digest.plot_direction` 写明差异策略
- `adapted_structure` — 改编后结构；对照 `narrative_digest.story_structure`
- `adapted_background` — 改编后背景；文化换壳与时代/场域替换
- `adapted_character_system` — 改编后设定体系；与 `character_rename_map` 一致
- `adapted_relationships_and_turns` — 改编后关系与转变；对照 `narrative_digest.relationships_and_turns`
- `character_rename_map` — 每项含 `source_character_id`, `adapted_display_name`；**主要角色必须全部改名**
- `all_principal_names_changed` — 布尔，须为 `true`
- `season_arc`
- `scene_language_rules`
- `similarity_avoidance`
- `similarity_score` — `total` **不得大于 30**（与 `rules/10` 一致）；超标须迭代策划直至达标

## Minimum standard

1. Make the hook, paywall, and arc structure machine-readable.
2. Map every main role to downstream document function.
3. Use ratio-based planning plus actual episode IDs where needed.
4. Keep similarity below the red line while retaining commercial engine.
5. The five `adapted_*` fields are **binding** for setting / outline / screenplay / storyboard / mirror (see `rules/17_改编计划锁定与下游服从.md`).
6. `character_rename_map` must list every principal from `story_bible.character_cards`; adapted display names must not copy source names.

## Prohibitions

1. Do not output prose-only planning.
2. Do not write actual screenplay scenes.
3. Do not merge outline and screenplay concerns.

## References

- `rules/16_长文本分段执行规范.md`
- `rules/01_海外题材与文化映射.md`
- `rules/02_开场规则.md`
- `rules/03_钩子设计.md`
- `rules/04_商业化卡点策略.md`
- `rules/05_节奏曲线.md`
- `rules/06_爽点矩阵.md`
- `rules/07_反派设计体系.md`
- `rules/10_相似度评分规则.md`
- `rules/17_改编计划锁定与下游服从.md`
- `examples/中间产物样例/adaptation_plan.json`
- `skills/source-narrative-digest/SKILL.md`
