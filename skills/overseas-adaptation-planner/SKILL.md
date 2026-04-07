# overseas-adaptation-planner

## Purpose

Turn `story_bible` into a structured overseas short-drama adaptation plan.

This stage defines the commercial and narrative plan for all downstream documents. It does not write the setting bible, outline, screenplay, or storyboard table itself.

## Input

- `story_bible` (merged; if `supporting_evidence` is thin, **only** re-read the relevant `source_chunks` / chapter excerpts — **not** the full novel, per `rules/16`)

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
- `season_arc`
- `scene_language_rules`
- `similarity_avoidance`
- `similarity_score`

## Minimum standard

1. Make the hook, paywall, and arc structure machine-readable.
2. Map every main role to downstream document function.
3. Use ratio-based planning plus actual episode IDs where needed.
4. Keep similarity below the red line while retaining commercial engine.

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
- `examples/中间产物样例/adaptation_plan.json`
