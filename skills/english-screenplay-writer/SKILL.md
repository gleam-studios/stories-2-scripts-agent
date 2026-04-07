# english-screenplay-writer

## Purpose

Write the English screenplay only.

This stage outputs performable scenes, action lines, and dialogue. It must not include shot planning or production notes.

Every episode must be written in full. No episode may be replaced with a summary, a format note, or a "same pattern continues" placeholder.

## Input

- `adaptation_plan`
- `english_setting_bible`
- `english_outline_pack`

## Output

- `screenplay_pack.json`
- final document target: `02_<剧名>_英文剧本.docx`

## Required content

1. `Quick Reference`
2. character snapshot
3. screenplay markdown (full, all episodes)
4. scene crosswalk

## Format

`EPISODE -> SCENE -> INT./EXT. -> action -> CHARACTER NAME -> dialogue`

## Action line density (anti-shrinkage rule)

Every scene's action lines must cover all three functional layers:

| Layer | Requirement |
|-------|------------|
| **Space establishment** | One line that sets location, atmosphere, and initial character position |
| **Key physical action** | The central physical beat that drives the scene (arrival, grab, collision, departure, etc.) |
| **Emotional subtext** | One line revealing body language, micro-expression, or internal state without explaining it |

Minimum 3 action lines per scene (excluding the slugline).

## Dialogue density

1. Every scene must have at least 2 full dialogue exchanges (each direction counts as one).
2. High-pressure conflict, emotional eruption, and identity-reveal scenes must have at least 3 exchanges.
3. No more than 1 action-only no-dialogue scene per episode (reserved for special rhythm beats).

## Episode-ending hook

The final scene of every episode must end with one of:

| Hook type | Description |
|-----------|-------------|
| `cliffhanger` | End on a crisis action line or unanswered threat — no resolution |
| `reversal` | End on a reveal line or reversal dialogue — drop it, don't explain it |
| `emotional_peak` | End on a high-intensity action line (body, not words) — leave space |
| `setup` | End on a line or action that explicitly forecasts the next episode's danger |

Do not end an episode on a flat descriptive action or neutral dialogue line.

## Coverage requirement

1. Write complete screenplay text for every episode — no gaps, no summaries.
2. Every episode must have at least 2 scenes.
3. Every `scene_id` in the scene crosswalk must match a `SCENE` heading in the screenplay body exactly.

## Prohibitions

1. Do not include camera instructions, shot sizes, transitions, or AI notes.
2. Do not rewrite the setting bible here.
3. Do not replace any episode with a summary or format note.
4. Do not write action lines that only describe location without human action or emotional signal.
5. Do not write dialogue that reads like translated Chinese — apply `rules/08_英文对白写作规则.md` throughout.
6. Do not end an episode without a hook.

## Pre-output self-audit (mandatory)

Before submitting, verify all of the following:

```
□ All episodes have complete screenplay text (not summaries)
□ Every episode has at least 2 scenes
□ Every scene has: slugline + 3+ action lines covering all 3 functional layers + dialogue
□ Every episode ends with a cliffhanger / reversal / emotional_peak / setup hook
□ scene_crosswalk scene_ids match screenplay SCENE headings exactly
□ No Chinese-translated dialogue patterns
□ hook_type and emotional_function are filled for every scene_crosswalk entry
```

Any check that fails must be resolved before submission.

## References

- `rules/12_剧本规范.md`
- `rules/08_英文对白写作规则.md`
- `rules/05_节奏曲线.md`
- `examples/中间产物样例/screenplay_pack.json`
- `examples/最终交付样例/02_英文剧本.md`
