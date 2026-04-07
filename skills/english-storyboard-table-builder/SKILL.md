# SKILL: English Storyboard Table Builder

## Purpose

Expand the English screenplay into a shot-level production table, structured by episode → scene → shot.

This is not a screenplay rewrite. Every shot must be traceable back to a specific action block or dialogue line in the screenplay. Content and narrative direction must not deviate from the screenplay or the outline.

The table must be usable for both human directors and AI image/video generation pipelines.

---

## Input

- `screenplay_pack.json` (required — source of scene structure, action blocks, scene_crosswalk)
- `outline_pack.json` (required — governs character identity, world rules, paywall beats, signature scenes)
- `setting_bible.json` (required — provides character_ids, location_ids, prop_ids, look_ids)
- `rules/13_分镜表规范.md` (required — all structural and density rules)
- `rules/08_英文对白写作规则.md` (required — dialogue_anchor field must conform)

---

## Output

- `storyboard_pack.json` (intermediate JSON, matches `schema.json`)
- `03_<title>_EnglishStoryboard.docx` (final delivery)

---

## Three-level structure (mandatory)

```
EPISODE  — total pacing + episode hook
  └── SCENE  — one complete dramatic event
        └── SHOT  — one continuous visual task unit
```

Every level must have its own header block before the shot table.

---

## Level 1 — Episode header (per episode)

Write before the first scene of each episode:

```
## EPISODE XX

Episode Core Event:   [primary narrative event of the episode, one sentence]
Episode Tone:         [emotional register: e.g. "tense / distrustful / stakes escalating"]
Key Reversal:         [the episode's central turn, one sentence]
Closing Hook:         [the unresolved beat at episode end — must match screenplay episode_brief.closing_hook]
```

---

## Level 2 — Scene header (per scene)

Write before the shot table of each scene:

```
### SCENE XX.XX — [scene nickname]
Time:           [Day / Night / Dawn / Dusk / Pre-Dawn / Continuous]
Location:       [INT./EXT. Location Name]
Characters:     [all characters present]
Core Event:     [primary narrative event of this scene]
Start State:    [situation and power/emotional balance at scene open]
End State:      [how the situation has changed by scene close]
Scene Type:     [dialogue_driven / confrontation_conflict / emotional_peak_reversal_reveal / quick_transition]
Screenplay Ref: [scene_id from screenplay_pack.scene_crosswalk, e.g. S01.03]
```

`Start State` and `End State` define the scene's entry and exit boundaries. All shots must stay within them.

---

## Level 3 — Shot rows

Each shot row = one **continuous visual task unit** responsible for exactly one primary function.

### Shot type (`shot_type`) — required enum

| Value | Function |
|-------|----------|
| `environment_establish` | Establishes space, atmosphere, and key prop placement |
| `character_enter` | Introduces a character; establishes initial position and state |
| `action_advance` | Character executes a key physical action (pick up / push / stand / enter) |
| `dialogue_delivery` | Delivers dialogue; must be preceded by an action shot |
| `emotion_reaction` | Shows meaningful emotional or cognitive shift in response to new information |
| `info_reveal` | Reveals key narrative information via prop / screen / visual element |
| `reversal` | The power dynamic, information state, or emotional direction flips in this shot |
| `hook` | Scene-ending or episode-ending suspense beat — always the last shot of a scene |

**Rules:**
- `environment_establish` must be the first or second shot of every scene
- `hook` must be the last shot of every scene — never buried inside the table
- `emotion_reaction` only when the reaction carries new dramatic weight (not for routine responses)

---

## Scene skeleton (every scene must have all 5 anchors)

| Anchor | `shot_type` | Position |
|--------|------------|----------|
| Opening establish | `environment_establish` (+ optional `character_enter`) | First 1-2 shots |
| Trigger action | `action_advance` | When conflict begins |
| Core confrontation | `dialogue_delivery` + `emotion_reaction` alternating | Mid-scene |
| Reversal point | `reversal` | Mid-to-late scene |
| Scene-ending hook | `hook` | Final shot |

`quick_transition` scenes may compress to: `environment_establish` + `hook`.

---

## Required shot fields (21 columns)

| Field | Requirement |
|-------|-------------|
| `shot_id` | Format `01.03.S01` (episode.scene.Sshot_number) |
| `episode_id` | Must match the episode header block and `episode_summaries` |
| `scene_id` | Must match `scene_index` and screenplay `scene_crosswalk` |
| `shot_type` | Enum — see above |
| `screenplay_ref` | Exact action line or dialogue from screenplay (e.g. "SCENE 01.03 OPENING STATE line 1" or the actual quoted action) |
| `visual_content` | What is visible in this shot — physical action only, no plot summary |
| `character_action` | Who does what (for performance / motion control) |
| `key_info_point` | What the viewer must receive from this shot (determines whether the shot is necessary) |
| `shot_language` | Frame size / angle / move / composition, in one string (e.g. `WIDE \| EYE-LEVEL \| STATIC \| character left, prop foreground`) |
| `dialogue_anchor` | Exact dialogue line, or `None` |
| `emotion` | Primary emotion in this shot, one per shot (e.g. `Maya: suppressed / Elliot: alert`) |
| `rhythm` | `fast_cut` / `normal` / `pause` / `sustained_pressure` |
| `estimated_duration_sec` | e.g. `3s` or `2-4s`; per-episode total must reach 60-120s |
| `transition` | Enum only: `CUT` / `HARD_CUT` / `SMASH_CUT` / `MATCH_CUT` / `REACTION_CUT` / `HOLD` / `DISSOLVE` / `FADE_OUT` |
| `sfx_music` | Sound strategy for this shot: ambience / music cue / silence / impact accent |
| `continuity_notes` | State continuity: position, prop state, wardrobe state, screen state, wound/wetness state |
| `character_ids` | From setting bible |
| `location_id` | From setting bible |
| `prop_ids` | From setting bible |
| `look_ids` | From setting bible |
| `ai_note` | AI generation guidance — must not be empty (see AI note rules below) |

---

## Minimum shot count per scene

| `scene_type` | Minimum | Expected (from screenplay density) |
|-------------|---------|-------------------------------------|
| `dialogue_driven` | 4 | 6-10 |
| `confrontation_conflict` | 6 | 9-14 |
| `emotional_peak_reversal_reveal` | 5 | 8-12 |
| `quick_transition` | 2 | 4-6 |

**Season floor:** `total shot_rows ≥ total scene count × 4`

**Screenplay density cross-check:**
```
target_shot_count = ceil(action_block_count × 1.5) + 2
actual_shot_count ≥ max(target_shot_count, scene_type_minimum)
```
Read `action_block_count` from `screenplay_pack.scene_crosswalk[scene_id]`.

---

## 7 shot-splitting rules

**Rule 1 — One shot, one function**
Do not combine environment establish + prop reveal + emotional reversal + three dialogue lines in one shot. The shot will be unexecutable.

**Rule 2 — Split when visual focus changes**
New shot when: focus subject changes / action subject changes / information emphasis changes / emotional lead changes / spatial position changes / speaking turn shifts.

**Rule 3 — Split at every dramatic node**
These are natural shot boundaries:
Enter / Pause / See / Touch / Hand over / Stand up / Step closer / Interrupt / Counter-question / Freeze / Burst in / Drop / Reveal.
Each node = its own shot.

**Rule 4 — Dialogue splits by conflict unit, not by sentence**
Not every sentence gets its own shot. Split when:
- The line changes the situation → new shot
- The line deserves a reaction shot → new shot + `emotion_reaction` follow
- The line is an information bomb → new shot
- The line is a hook or pressure move → new shot

Routine responses can share a shot with an action. A counter-attack line or reveal line always gets its own shot.

**Rule 5 — Reaction shots only when they carry value**
Only add `emotion_reaction` when: clear emotional shift / cognitive change / truth lands / power reversal / hook falls on the reaction.
Routine nods or acknowledgements: fold into the preceding dialogue shot.

**Rule 6 — Hook shot must be standalone and explicit**
`hook` type shot is always the last row of the scene table.
- `transition`: `HARD_CUT` or `SMASH_CUT`
- `rhythm`: `pause` or `sustained_pressure`
- `ai_note`: describe the frozen moment — what expression, what prop state, what frame holds

**Rule 7 — AI generation friendliness**
- One primary action per shot (no multi-step motion sequences in one shot)
- Character state must be continuous within the shot (no large state jumps from first to last frame)
- Track costume, position, and prop state across shots in the same scene
- `continuity_notes` must explicitly record any state that the next shot must inherit
- `ai_note` must include: lighting direction, color tone reference, composition anchor, character appearance anchor

---

## `ai_note` writing rules

Every shot's `ai_note` must include:

| Component | Example |
|-----------|---------|
| Lighting | `low-key side lighting from left, cold blue tone` |
| Color / mood | `desaturated interior, shadow-heavy` |
| Composition | `Maya in left third, phone centered on table, Elliot's reaction in background right` |
| Character anchor | `Maya: dark cardigan, tense posture, no eye contact` |
| Generation note | `minimal motion, holds for 4s, subtle breath movement only` |

Do not write abstract emotional labels in `ai_note` — describe what the camera sees.

## `sfx_music` and `continuity_notes` rules

`sfx_music` must state one of the following for every shot:
- ambient bed only
- music enters / sustains / dips / cuts
- silence / air drop for tension
- impact accent (door slam / shutter click / hit / ring / buzz)

`continuity_notes` must record any state that affects downstream generation:
- character position at shot end
- which hand holds which prop
- whether phone/laptop screen is on and what it displays
- wardrobe condition (jacket on/off, sleeves rolled, blood/wet marks)
- prop state (opened / closed / folded / broken / on table / pocketed)

---

## Alignment with screenplay and outline

| Source field | Maps to storyboard |
|-------------|-------------------|
| `screenplay_pack.scene_crosswalk[n].core_event` | Scene Core Event in scene header |
| `screenplay_pack.scene_crosswalk[n].scene_result` | Scene End State in scene header |
| `screenplay_pack.scene_crosswalk[n].scene_ending_type` | `hook` shot `transition` type — see mapping below |
| `screenplay_pack.scene_crosswalk[n].action_block_count` | Target shot count formula |
| `screenplay_pack.episode_briefs[n].closing_hook` | Episode Closing Hook in episode header |
| `outline_pack.signature_scenes` | Each must appear as a full scene — no compression |
| `outline_pack.paywall_map` | Paywall beats must appear as a `hook` shot or standalone `reversal` shot |
| `setting_bible.characters` | character_ids |

**`scene_ending_type` → `hook` shot `transition` mapping:**

| `scene_ending_type` | Recommended `transition` | Rationale |
|---------------------|--------------------------|-----------|
| `cliffhanger` | `SMASH_CUT` | Action frozen mid-danger; hard collision into next scene |
| `reversal` | `HARD_CUT` | Information lands, cut before reaction resolves |
| `emotional_peak` | `HOLD` then `SMASH_CUT` | Hold on the peak expression, then cut on silence |
| `setup` | `CUT` or `DISSOLVE` | Stakes-raising beat; can dissolve if a time skip follows |
| `setting_bible.locations` | location_id |
| `setting_bible.props` | prop_ids |
| `setting_bible.looks` | look_ids |

---

## Prohibitions

1. Only 1 shot per scene (unless explicitly `quick_transition`)
2. Scene-level prose summary as the main body instead of a shot table
3. `visual_content` describing plot instead of visible physical action
4. `ai_note` left empty
5. `hook` shot missing from any scene
6. `environment_establish` not placed first or second in a scene
7. `screenplay_ref` empty or vague — must trace to a specific action block or dialogue line
8. `emotion_reaction` used for routine responses (not every reaction deserves a shot)
9. Asset IDs (`prop_ids`, `look_ids`, `location_id`) left empty when assets are present in the scene
10. Shot count below `max(target_shot_count, scene_type_minimum)` for any scene
11. Episode header block missing
12. `transition` written as free text instead of the enum
13. `sfx_music` left empty
14. `continuity_notes` left empty

---

## Pre-output self-audit

```
□ Every episode has an episode header block (Core Event / Tone / Key Reversal / Closing Hook)
□ Every scene has a scene header block (8 fields, including Start State / End State / Scene Type / Screenplay Ref)
□ total shot_rows ≥ total scene count × 4
□ Each scene's shot count ≥ scene_type minimum AND ≥ action_block_count × 1.5 + 2
□ Every scene has all 5 skeleton anchors (establish / trigger / confrontation / reversal / hook)
□ environment_establish is the first or second shot of every scene
□ hook is the last shot of every scene — standalone row, typed transition
□ All 21 shot fields are populated, no blanks
□ screenplay_ref traces to a specific action block or dialogue line for every shot
□ transition uses enum values only
□ sfx_music is filled for every shot
□ continuity_notes is filled for every shot
□ ai_note has substantive generation guidance for every shot (light / tone / composition / character anchor)
□ estimated_duration_sec sums to 60-120s per episode
□ All scene_ids in scene_index have corresponding shot rows
□ All scene_ids from screenplay_pack.scene_crosswalk are covered — no missing scenes
□ Signature scenes from outline are fully expanded, not compressed
□ Paywall beats from outline appear as hook or reversal shots
```
