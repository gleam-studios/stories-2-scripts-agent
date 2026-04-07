# english-outline-writer

## Purpose

Write the English outline only.

The outline contains series positioning, season structure, episode outlines, hook distribution, and paywall map. It must not include full scenes or screenplay prose.

Every episode must have its own complete entry. No episode may be omitted, summarized with "same pattern," or left as a placeholder.

## Input

- `adaptation_plan`
- `english_setting_bible`

## Output

- `outline_pack.json`
- final document target: `01_<剧名>_英文大纲.docx`

## Required content (in order)

1. `Quick Reference`
2. Adaptation Positioning
3. Season Outline
4. Episode Outline (full, all episodes)
5. Season Hook Map
6. Episode Hook Map (structured table)
7. Paywall Map (structured table)

## Per-episode required fields

Every episode entry must include all 11 fields — one sentence each:

| Field | Content |
|-------|---------|
| `episode_id` | e.g. `EP01` |
| `title` | Short, punchy episode title |
| `arc_phase` | **Enum only**: `launch` / `rise` / `storm` / `finale` |
| `logline` | One-line episode positioning |
| `core_event` | The central narrative event of the episode |
| `turn` | The key turn: information, relationship, or power shift |
| `emotional_goal` | What the audience should feel by the end of this episode |
| `relationship_shift` | One-line: what changes between the key characters this episode |
| `antagonist_pressure` | One-line: the specific step the antagonist or institution takes this episode |
| `satisfaction_beat` | One-line: the satisfaction payoff, tagged with one of 5 types |
| `end_hook` | One-line: the cliffhanger or hook that closes the episode |

### `arc_phase` enum

Must use exactly: `launch` / `rise` / `storm` / `finale`
Aligned with `adaptation_plan.rhythm_curve` and `rules/05_节奏曲线`.

### `satisfaction_beat` tag

Tag + one line. Tag must be one of: `status_reversal` / `face_slap` / `underdog_rise` / `emotional_eruption` / `truth_drop`
Aligned with `adaptation_plan.satisfaction_mix` and `rules/06_爽点矩阵`.

## Hook Map and Paywall Map format

### Episode Hook Map

Structured table — one row per episode:

| episode_id | hook_type | hook_out |
|---|---|---|

`hook_type` options: `identity_tease` / `evidence_drop` / `alliance_shift` / `betrayal_reveal` / `romance_peak` / `cliffhanger` / `reversal` / `setup`

Must align with `adaptation_plan.episode_hook_map`.

### Paywall Map

Structured table:

| episode_id | position_ratio | phase | type | beat | viewer_task |
|---|---|---|---|---|---|

Must align with `adaptation_plan.paywall_map`.

## Alignment with `adaptation_plan`

Before writing, read `adaptation_plan` fully. The outline must be traceable to the plan:

1. Every episode's `arc_phase` must fall within the correct `season_arc` ratio band.
2. `Episode Hook Map` entries must match `adaptation_plan.episode_hook_map` in `episode_id` and `hook_type`.
3. `Paywall Map` entries must match `adaptation_plan.paywall_map` in `episode_id` and `position_ratio`.
4. `satisfaction_beat` labels must correspond to `adaptation_plan.satisfaction_mix` design directions.

## Completion requirement (anti-shrinkage)

1. `episode_outlines` count must equal `quick_reference.episode_count` — no exceptions.
2. `Episode Hook Map` must have one row per episode.
3. Markdown output must include all 6 sections in order.
4. Do not compress multiple episodes into a single block.

## Prohibitions

1. Do not write scene-by-scene screenplay text.
2. Do not write camera directions, shot sizes, or production notes.
3. Do not turn the outline into a prose novella or story summary.
4. Do not use free-text `arc_phase` values — enum only.
5. Do not write Hook Map or Paywall Map as prose — structured table only.
6. Do not omit any episode from the Episode Outline or Episode Hook Map.

## Pre-output self-audit (mandatory)

```
□ episode_outlines count = quick_reference.episode_count
□ Every episode entry has all 11 required fields
□ All arc_phase values are: launch / rise / storm / finale
□ All satisfaction_beat tags come from the 5-type enum
□ Episode Hook Map has one row per episode, aligned with adaptation_plan
□ Paywall Map entries aligned with adaptation_plan.paywall_map
□ Markdown output contains all 6 sections in order
```

Any check that fails must be resolved before submission.

## References

- `rules/11_大纲规范.md`
- `rules/04_商业化卡点策略.md`
- `rules/05_节奏曲线.md`
- `rules/06_爽点矩阵.md`
- `examples/中间产物样例/outline_pack.json`
- `examples/最终交付样例/01_英文大纲.md`
