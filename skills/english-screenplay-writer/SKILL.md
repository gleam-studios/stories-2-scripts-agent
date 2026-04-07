# english-screenplay-writer

## Purpose

Write the English screenplay only.

The screenplay is the middle layer between the outline and the storyboard table. It takes the episode structure from the outline and turns it into fully executable scenes. The storyboard table then derives directly from the screenplay — every action block, every prop placement, every scene ending becomes shot material.

The screenplay must be written so that the storyboard can grow naturally from it. Not by including camera directions, but by writing in a form where shot boundaries are self-evident.

## Input

- `adaptation_plan`
- `english_setting_bible`
- `english_outline_pack` (primary: `episode_outlines`, `character_cards`, `signature_scenes`)

## Output

- `screenplay_pack.json`
- final document target: `02_<剧名>_英文剧本.docx`

## Required content

1. `Quick Reference`
2. Character snapshot
3. Screenplay markdown (full, all episodes, all scenes)
4. Scene crosswalk

---

## Scene structure (mandatory for every scene)

Every scene must have all four components in order:

### 1. Scene header (6 fields)

```
EPISODE XX  SCENE XX.XX
Time: [Day / Night / Dawn / Dusk / Pre-Dawn]
Location: [INT./EXT. LOCATION NAME]
Characters: [all characters present]
Core Event: [one sentence: the central narrative event]
Scene Result: [one sentence: how the scene ends / what changes]
```

The scene header feeds directly into the storyboard's `scene_index`. Keep it precise.

### 2. [OPENING STATE]

1-4 sentences. Not prose. Cover:

- Environment: space, light, atmosphere
- Characters' initial position and physical state
- Key props: anything that will matter in this scene, named and placed
- Current situation: what is the state of play when the scene begins

The storyboard's first 1-2 shots (establishing, prop insert) derive from this block.

### 3. [MAIN BODY]

Written in **action blocks** — one paragraph per continuous action or exchange. Do not run multiple beats into a single block.

Action block structure:
```
(action / state change)

CHARACTER NAME
Dialogue.

(reaction / situation shift)
```

Rules for action blocks:
- Any character entering or leaving: its own line
- Any visible physical action (grab, push, stand, turn): its own paragraph
- Every significant line of dialogue must have an action or reaction before and after it
- Every situation shift (power change, information reveal, emotional turn): its own paragraph
- Every key prop appearing or being used: explicit sentence with location

The storyboard's shot rows derive from action blocks. One block typically = 1-3 shots.

### 4. [SCENE ENDING]

Written as a separate labeled block. Never buried in the main body. Never a flat descriptive line.

Must be one of:
- `cliffhanger` — crisis action or unresolved threat, no resolution given
- `reversal` — reveal line or reversal action, dropped and not explained
- `emotional_peak` — high-intensity physical action, space left after
- `setup` — line or action that directly forecasts the next scene's danger

The final scene of every episode must use one of these types as its episode-ending hook.

---

## Writing rules (storyboard-readiness principles)

### One scene = one primary event

A scene carries one core narrative push. If location or time changes, open a new scene. Do not stack: argument + backstory explanation + confession + reversal + fight in one scene.

### Write in event order

Every main body block must follow natural event sequence:

`what happens first → who does what → who says what → what is the reaction → how the situation changes`

### Write what can be seen, not what is felt

| Do not write | Write instead |
|--------------|---------------|
| She was devastated | Her grip on the phone turns white |
| He was shocked | He looks at the photo. Doesn't speak for a long time. |
| The air froze | Nobody moves. Only the HVAC. |
| She felt fate was cruel | She's still smiling. The tears are already falling. |

Every sentence must have a visual equivalent. If it cannot be photographed, rewrite it.

### Key props must have explicit placement

Any prop that will become a shot must be placed in [OPENING STATE] or at its first mention in [MAIN BODY]:

- What is on the phone screen
- What is on the table
- Who is at the door
- Who is holding the contract
- When the ring falls
- When the photo is first seen

Missing prop placement = missing shots in the storyboard.

### Turning points must be written explicitly

The following must appear as action lines — not implied through dialogue:

- Who goes silent first
- Who's expression changes
- Who stands up
- Who pushes something across / takes it back
- Who interrupts
- Who enters suddenly

### No bare dialogue runs

Every significant line must have action or reaction before or after it. No back-and-forth dialogue blocks without physical grounding.

---

## Coverage requirement (anti-shrinkage)

1. Write complete screenplay text for every episode. No gaps, no summaries, no "same pattern continues."
2. Every episode must have at least 2 scenes.
3. Every `scene_id` in the scene crosswalk must match a `SCENE` heading in the screenplay body exactly.
4. `scene_crosswalk` must include `time`, `core_event`, and `scene_result` for every scene.

---

## Alignment with outline

Before writing, read `english_outline_pack` fully:

1. Each episode's scenes must deliver the `core_event`, `turn`, `emotional_goal`, and `satisfaction_beat` from the episode outline.
2. `signature_scenes` from the outline must be present and written at appropriate density.
3. Episode-ending `[SCENE ENDING]` must match the `end_hook.hook_type` from the episode outline.
4. Character behavior must be consistent with `character_cards` from the outline.

---

## Prohibitions

1. Do not include shot sizes, camera moves, transitions, or AI notes — these belong in the storyboard.
2. Do not write literary prose: extended interior monologue, lyrical description, abstract metaphor.
3. Do not write summary-style main body ("they argued and eventually reconciled").
4. Do not run multiple locations or time periods in a single scene.
5. Do not write bare dialogue without surrounding action/reaction.
6. Do not omit [OPENING STATE], [MAIN BODY], or [SCENE ENDING] from any scene.
7. Do not omit any episode or replace it with a note.
8. Do not write Chinese-translated dialogue patterns — apply `rules/08_英文对白写作规则.md` throughout.

---

## Per-block self-check

After writing each action block, verify:

```
□ What is happening in the frame right now? (visible)
□ Who is actively driving the situation? (clear)
□ What changes after this block ends? (something shifts)
```

If a block cannot answer all three, rewrite it.

---

## Pre-output self-audit (mandatory)

```
□ All episodes have complete screenplay text (not summaries)
□ Every episode has at least 2 scenes
□ Every scene has all 4 components: header / [OPENING STATE] / [MAIN BODY] / [SCENE ENDING]
□ Scene header has all 6 fields for every scene
□ [MAIN BODY] uses action blocks — no prose paragraphs, no bare dialogue runs
□ Key props placed explicitly in [OPENING STATE] or at first mention
□ Every [SCENE ENDING] is labeled and uses a named hook type
□ Every episode's final scene ends with an episode-level hook
□ scene_crosswalk entries match screenplay SCENE headings exactly
□ scene_crosswalk includes time / core_event / scene_result for every scene
□ Episode hook types match outline episode_outlines.end_hook.hook_type
```

---

## References

- `rules/12_剧本规范.md`
- `rules/08_英文对白写作规则.md`
- `rules/05_节奏曲线.md`
- `examples/中间产物样例/screenplay_pack.json`
- `examples/最终交付样例/02_英文剧本.md`
