# english-outline-writer

## Purpose

Write the English outline only.

The outline is the master document for the entire project. The screenplay, storyboard table, and setting bible all derive from and expand on the outline. The outline must summarize everything completely so downstream documents only need to deepen — not reinvent.

No full scenes. No camera directions. No prose novella.

## Input

- `adaptation_plan`
- `english_setting_bible`

## Output

- `outline_pack.json`
- final document target: `01_<剧名>_英文大纲.docx`

## Required sections (in order — all 14 are mandatory)

1. Quick Reference
2. Core Selling Points
3. Adaptation Positioning
4. World Setting Summary
5. Character Cards
6. Main Plot
7. Subplot Map
8. Overall Story Structure
9. Episode Outline (full, all episodes)
10. Season Hook Map
11. Episode Hook Map
12. Paywall Map
13. Signature Scenes
14. Viral Clip Candidates

---

## Section specs

### 2. Core Selling Points

4 dimensions — 1-2 sentences each:

| Field | Content |
|-------|---------|
| `genre_hook` | Genre type and core attraction |
| `emotional_hook` | The emotion that drives bingeing (satisfying / sweet / addictive / heartbreaking) |
| `character_hook` | What makes the protagonist or key character unforgettable |
| `differentiation` | What distinguishes this from similar projects |

### 4. World Setting Summary

Required even for contemporary settings. For fantasy / system / alternate-world settings: must be detailed.

| Field | Content |
|-------|---------|
| `era_and_environment` | Time period and world environment |
| `social_rules` | Core social order / power structure (who has power, how it's contested) |
| `industry_or_special_setting` | Industry background or special world rules |
| `key_constraints` | Hard constraints that shape the narrative (e.g. identity cannot be revealed; evidence only works in public) |

Summary only — full detail lives in `setting_bible`.

### 5. Character Cards

One card per major character. Required fields — one sentence each:

| Field | Content |
|-------|---------|
| `character_id` | Aligned with adaptation_plan and setting_bible |
| `name` | Full name / alias |
| `role_type` | Enum: `protagonist` / `antagonist` / `ally` / `romance` / `catalyst` / `supporting` |
| `identity` | Role in the story world |
| `personality_keywords` | 3-5 keywords |
| `desire_goal` | What they want most |
| `relation_to_protagonist` | How they relate to the main character |
| `contrast_point` | The contradiction that makes them three-dimensional |
| `arc_note` | Full-season growth or reversal trajectory |

Must include: protagonist, primary antagonist, romance character, plot-driving supporting character.

### 6. Main Plot

4 required fields — 1-2 sentences each:

| Field | Question answered |
|-------|------------------|
| `protagonist_want` | What does the protagonist want? |
| `antagonist_block` | Who/what blocks them and how? |
| `escalation_path` | How does the main conflict escalate? (3-4 key nodes) |
| `resolution_direction` | How is the main plot resolved? |

### 7. Subplot Map

One entry per subplot. Required fields:

| Field | Content |
|-------|---------|
| `subplot_id` | e.g. SUB-01 |
| `subplot_type` | Enum: `romance` / `revenge` / `identity_secret` / `family` / `power_struggle` / `investigation` / `competition` / `friendship` |
| `characters_involved` | Character ID list |
| `arc_summary` | What happens in this subplot start to finish (2-3 sentences) |
| `function_in_story` | What does it do for the main plot (one sentence) |

Minimum 2 subplots. Each must have at least one intersection with the main plot.

### 8. Overall Story Structure

5 narrative stages — each stage must be written:

**Opening**: protagonist intro + situation setup + inciting event + first hook
**Development**: protagonist action + conflict escalation + relationship changes + satisfaction/crisis pattern
**Midpoint Reversal**: partial truth reveal + major setback + antagonist gains
**Climax**: ultimate conflict + biggest secret revealed + relationship reconstruction
**Ending**: main plot resolution + character fates + emotional landing + season 2 hook (optional)

### 9. Episode Outline

11 required fields per episode — one sentence each. Count must equal `episode_count`.

| Field | Spec |
|-------|------|
| `episode_id` | e.g. EP01 |
| `title` | Short, punchy |
| `arc_phase` | Enum: `launch` / `rise` / `storm` / `finale` |
| `logline` | One-line episode positioning |
| `core_event` | Central narrative event |
| `turn` | Key information / relationship / power shift |
| `emotional_goal` | What audience should feel by episode end |
| `relationship_shift` | What changes between key characters |
| `antagonist_pressure` | Specific step the antagonist or institution takes |
| `satisfaction_beat` | Tag (5-type enum) + one-line concrete payoff |
| `end_hook` | hook_type (8-type enum) + one-line hook content |

### 10. Season Hook Map

4 entries — one per arc phase. Fields: `phase` / `ratio_range` / `hook_direction`

### 11. Episode Hook Map

One row per episode. Fields: `episode_id` / `hook_type` / `hook_out`
Must align with `adaptation_plan.episode_hook_map`.

### 12. Paywall Map

Fields: `episode_id` / `position_ratio` / `phase` / `type` / `beat` / `viewer_task`
Must align with `adaptation_plan.paywall_map`.

### 13. Signature Scenes

3-8 entries. Required fields:

| Field | Content |
|-------|---------|
| `scene_id` | e.g. SIG-01 |
| `episode_id` | Which episode |
| `scene_type` | Enum: `public_reversal` / `identity_reveal` / `romance_peak` / `confrontation` / `betrayal` / `sacrifice` / `truth_drop` |
| `description` | What happens (2-3 sentences, written to make someone want to watch) |
| `why_unmissable` | Why this scene is critical to the whole season (one sentence) |
| `production_weight` | Enum: `highest` / `high` / `medium` (priority signal for storyboard and AI production) |

### 14. Viral Clip Candidates

3-6 entries. Required fields:

| Field | Content |
|-------|---------|
| `clip_id` | e.g. CLIP-01 |
| `episode_id` | Which episode |
| `clip_type` | Enum: `status_reversal` / `face_slap` / `romance_moment` / `plot_twist` / `emotional_eruption` / `confrontation` |
| `description` | What makes this clip shareable (1-2 sentences) |
| `hook_in_3s` | What the viewer sees in the first 3 seconds that stops the scroll (one sentence) |

---

## Long-text execution (`rules/16`)

When the source is long or context is tight:

1. Build a **Continuity Sheet** from `english_setting_bible` (1–2 screens max): core `character_id` rules, key prop/location continuity, hard world constraints — **not** the full `setting_bible.json`.
2. **Batch A**: Write sections **1–8** only (Quick Reference through Overall Story Structure), aligned with `adaptation_plan` and the Continuity Sheet.
3. **Batch B…**: Write **section 9 — Episode Outline** only, **≤10 episodes per call** (EP01–EP10, then EP11–EP20, …) until count = `adaptation_plan.episode_count`.
4. **Batch C**: Write **sections 10–14** (Hook maps, Paywall, Signature Scenes, Viral Clips) **after** all episode rows exist.
5. **Align pass** (separate call): Input = merged `outline_pack` draft + `adaptation_plan`. Fix contradictions, hook/paywall alignment, fill missing episodes, ensure `episode_id` continuity. Do not rewrite frozen sections without documented conflict.

Update `work/<project_slug>/run_manifest.json` after each batch (`outline_batches`).

---

## Alignment with `adaptation_plan`

Before writing, read `adaptation_plan` fully:

1. `arc_phase` per episode must fall within the correct `season_arc` ratio band.
2. `Episode Hook Map` must match `adaptation_plan.episode_hook_map`.
3. `Paywall Map` must match `adaptation_plan.paywall_map`.
4. `satisfaction_beat` tags must correspond to `adaptation_plan.satisfaction_mix`.
5. `Character Cards` `character_id` must match `adaptation_plan.role_function_map`.

---

## Prohibitions

1. Do not write scene-by-scene screenplay text.
2. Do not write camera directions, shot sizes, or production notes.
3. Do not turn any section into a prose novella.
4. Do not use free-text `arc_phase` values — enum only.
5. Do not write Hook Map / Paywall Map / Signature Scenes / Viral Clips as prose — structured format only.
6. Do not omit any episode from the Episode Outline or Episode Hook Map.
7. Do not copy setting bible content wholesale into the outline — summary only.

---

## Pre-output self-audit (mandatory)

```
□ All 14 sections present in order
□ episode_outlines count = quick_reference.episode_count
□ Every episode has all 11 fields
□ All arc_phase values are enum: launch / rise / storm / finale
□ All satisfaction_beat tags come from 5-type enum
□ Character Cards cover: protagonist / antagonist / romance / key supporting
□ Subplot Map has at least 2 subplots
□ Overall Story Structure has all 5 stages written
□ Signature Scenes has at least 3 entries
□ Viral Clip Candidates has at least 3 entries
□ Episode Hook Map aligned with adaptation_plan.episode_hook_map
□ Paywall Map aligned with adaptation_plan.paywall_map
```

---

## References

- `rules/16_长文本分段执行规范.md`
- `rules/11_大纲规范.md`
- `rules/04_商业化卡点策略.md`
- `rules/05_节奏曲线.md`
- `rules/06_爽点矩阵.md`
- `rules/07_反派设计体系.md`
- `examples/中间产物样例/outline_pack.json`
- `examples/最终交付样例/01_英文大纲.md`
