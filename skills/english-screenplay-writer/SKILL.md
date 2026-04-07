# SKILL: English Screenplay Writer

## Purpose

Transform the `outline_pack.json` into a full English screenplay — structured by episode and scene — that functions as the stable middle layer between the outline and the storyboard table.

Every scene must be written in a format that allows the storyboard builder to extract shot rows directly, without any additional interpretation or invention.

---

## Input

- `outline_pack.json` (required — the single source of truth for story structure, characters, hooks, and paywall beats)
- `adaptation_plan.json` (required — target market, tone, paywall strategy)
- `setting_bible.json` (required — world rules, location names, prop inventory)
- `rules/12_剧本规范.md` (required — governs every structural and content decision in this skill)
- `rules/08_英文对白写作规则.md` (required — governs all dialogue writing)

---

## Output

- `screenplay_pack.json` (intermediate JSON, matches `schema.json`)
- `02_<title>_EnglishScreenplay.docx` (final delivery — full Markdown converted to Word)

---

## Required content

### Episode briefs

Every episode in `screenplay_pack.json` must include an `episode_brief` object with all 6 fields:

| Field | Content |
|-------|---------|
| `plot_summary` | 2-4 sentences covering all scenes in the episode |
| `opening_hook` | What grabs the audience in the first seconds (conflict / info / image) |
| `cold_open_focus` | Specific visible element required in the first 3-5 seconds |
| `closing_hook` | The suspense or crisis left unresolved at the episode end |
| `core_satisfaction_beat` | The satisfaction type + landing point — must match `outline.episode_outlines[n].satisfaction_beat` |
| `target_emotion` | The dominant emotion the viewer should feel at the final second |

**Alignment rules:**
- `opening_hook` and `cold_open_focus` must be delivered in the first half of Scene 01 of the episode
- `closing_hook` must match the `[SCENE ENDING]` type and beat of the episode's final scene
- `plot_summary` must reference events from every scene — not just the first

---

### Scene structure (mandatory 4-part format for every scene)

#### Part 1 — Scene header (7 fields)

```
### SCENE XX.XX
Time: [Day / Night / Dawn / Dusk / Pre-Dawn / Continuous]
Location: [INT./EXT. Location Name]
Characters: [all characters present]
Core Event: [single sentence — the primary narrative event]
Scene Result: [single sentence — how the situation changes by scene end]
Outline Ref: [which outline field this scene primarily delivers: core_event / turn / emotional_goal / relationship_shift / antagonist_pressure / satisfaction_beat / setup]
```

The 7 scene-header fields are copied verbatim into `scene_crosswalk` in `screenplay_pack.json`.

#### Part 2 — [OPENING STATE]

1-4 sentences. Must cover:
- Environment (space, light, atmosphere)
- Initial character position/posture
- Key props — first mention of any prop that will be used later MUST include its exact location
- Current situation (power/emotional status quo at scene open)

This block produces the first 1-2 establishing shots in the storyboard.

#### Part 3 — [MAIN BODY]

Written in **action blocks** — not prose paragraphs.

One action block = one continuous action or one short exchange. Each block produces 1-3 storyboard shot rows.

**Minimum action block count by scene type:**

| Scene type | Minimum blocks | Expected storyboard shots |
|-----------|---------------|--------------------------|
| Dialogue-driven | 5 blocks | 6-10 shots |
| Confrontation / conflict | 7 blocks | 9-14 shots |
| Emotional peak / reversal / reveal | 6 blocks | 8-12 shots |
| Quick transition (≤20s) | 3 blocks | 4-6 shots |

**What triggers a new block (each situation = its own block):**
- A character enters or exits
- Any physical action (pick up / push / stand / turn)
- Dialogue — always surrounded by: action line → dialogue → reaction line
- A power shift, information reveal, or emotional turn
- A key prop appearing or being used

**3-question self-check per block:**
1. What is visible in this block? (must be describable as a camera image)
2. Who is driving the action?
3. What changes by the end of this block?

#### Part 4 — [SCENE ENDING]

A separate labeled block. Must use one of:
- `cliffhanger` — action frozen, danger not resolved
- `reversal` — dialogue or action that flips the situation
- `emotional_peak` — high-intensity action line, hard cut
- `setup` — stakes-raising beat pointing to next scene or episode

The final scene's `[SCENE ENDING]` must match the episode's `closing_hook`.

---

### COLD OPEN (optional per episode)

Pre-title sequence. Written as a full scene using the 4-part structure, labeled:

```
### COLD OPEN
...
[SCENE ENDING / END COLD OPEN]
```

Duration target: 15-25s. Does not receive a SCENE XX.XX number.

---

## Dialogue rules (summary — full spec in rules/08)

Every dialogue line must do at least one:
- Advance conflict (shift the power dynamic)
- Reveal information (something the viewer or the other character didn't know)
- Change emotion (pivot the scene's emotional direction)

Additional constraints:
- No line repeats information already established in this scene
- Character voices must be distinguishable — each major character has a stable linguistic register
- High-pressure scenes: max 15 words per line
- No explanatory monologue (3+ consecutive lines, same character, no interruption)
- Parentheticals: max 3 per scene; use only when tone cannot be inferred from context

Dialogue formatting:
- Normal: `CHARACTER NAME` on its own line, dialogue below
- Off screen (in scene, not in frame): `CHARACTER NAME (O.S.)`
- Voice over / narration: `CHARACTER NAME (V.O.)`
- Continuation after action interruption: `CHARACTER NAME (CONT'D)`

---

## Scene count and episode duration

| Target episode length | Recommended scene count | Per-scene duration |
|----------------------|------------------------|--------------------|
| 1 min | 2-3 scenes | 20-35s |
| 1.5 min | 3-4 scenes | 20-35s |
| 2 min | 3-5 scenes | 25-40s |

Hard minimum: **2 scenes per episode.**

The density chain: action blocks in [MAIN BODY] → storyboard shot rows → screen seconds.
Do not increase scene count to fill time — write each scene's action blocks to the minimum count.

---

## Coverage requirements

- Every episode in `outline_pack.json.episode_outlines` must have a corresponding episode in the screenplay
- Every episode must have complete scene text — no summary substitutes
- Each episode's scenes collectively must cover `core_event` and `turn` from the outline (verified via `Outline Ref` fields)
- `scene_crosswalk` in `screenplay_pack.json` must list every scene, with all 7 header fields populated

---

## Alignment with outline_pack.json

| Outline field | Where it appears in screenplay |
|--------------|-------------------------------|
| `episode_outlines[n].core_event` | Scene with `Outline Ref: core_event` |
| `episode_outlines[n].turn` | Scene with `Outline Ref: turn` |
| `episode_outlines[n].emotional_goal` | Scene with `Outline Ref: emotional_goal` |
| `episode_outlines[n].satisfaction_beat` | `episode_brief.core_satisfaction_beat` + matching scene |
| `episode_outlines[n].end_hook` | Episode final `[SCENE ENDING]` + `episode_brief.closing_hook` |
| `episode_outlines[n].relationship_shift` | Scene with `Outline Ref: relationship_shift` |
| `episode_outlines[n].antagonist_pressure` | Scene with `Outline Ref: antagonist_pressure` |
| `character_cards` | Character names, identity, arc must be consistent throughout |
| `signature_scenes` | Each must appear as a full scene — no compression |
| `paywall_map` | Paywall beats must appear as `[SCENE ENDING]` or a distinct action block |

---

## Prohibitions

1. Omitting `[EPISODE BRIEF]` or any of its 6 fields
2. `[EPISODE BRIEF]` content not matching actual scene content (detached summary)
3. No scene delivering the outline's `core_event` or `turn` for that episode
4. Prose-style / summary-style body text ("they argued and eventually made up")
5. Bare dialogue (no action or reaction lines surrounding it)
6. Key props appearing without explicit location at first mention
7. Turning points implied only by dialogue, not written as visible actions
8. `[SCENE ENDING]` missing, buried in body text, or using a plain narrative close
9. Parentheticals used to express emotions that action lines should carry
10. Long explanatory monologue (3+ lines, same character, no interruption)
11. Character voices indistinguishable across the scene
12. Dialogue repeating information already established earlier in the scene
13. Shot sizes, camera angles, or AI notes written inside the screenplay (storyboard layer only)
14. Any episode delivered as a summary or abstract instead of full scene text
15. More than one primary conflict or location change inside a single scene

---

## Pre-output self-audit

```
□ Every episode has [EPISODE BRIEF] with all 6 fields complete
□ Every [EPISODE BRIEF] matches actual scene content (opening and closing beats)
□ Every episode has full scene text — no summaries
□ Scene count per episode is within the duration-appropriate range
□ Every scene has all 4 structural parts (header + OPENING STATE + MAIN BODY + SCENE ENDING)
□ Every scene header has all 7 fields including Outline Ref
□ Each episode's Outline Ref fields collectively cover core_event and turn
□ Every scene meets the minimum action block count for its type
□ [OPENING STATE] includes environment, character position, key props, and situation
□ All key props have an explicit location at first mention
□ [SCENE ENDING] is a separate labeled block using one of the 4 typed endings
□ Final scene [SCENE ENDING] matches episode_brief.closing_hook
□ Every dialogue line has surrounding action / reaction lines
□ No explanatory monologue; character voices are distinguishable
□ No parentheticals used for emotions expressible in action lines
□ Parentheticals do not exceed 3 per scene
□ scene_crosswalk in screenplay_pack.json lists every scene with all 7 header fields
□ episode_briefs in screenplay_pack.json cover all episodes
```
