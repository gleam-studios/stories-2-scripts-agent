# english-setting-bible-builder

## Purpose

Build the English Setting Bible (`04_<剧名>_英文设定集.docx`).

This is the **heaviest design document** in the entire pipeline.  
Its job is to establish the single source of truth for all visual assets, character behavior, prop continuity, and AI image generation across the full production.  
Every other document (outline, screenplay, storyboard) must be consistent with the setting bible.

## Pipeline Position

**Input:**
- `story_bible` (from `source-analysis`)
- `adaptation_plan` (from `overseas-adaptation-planner`) — **binding**: character display names and narrative must follow `adaptation_plan.character_rename_map` and the five `adapted_*` fields (`rules/17_改编计划锁定与下游服从.md`)

**Output:**
- `setting_bible.json` (machine-readable intermediate)
- final delivery target: `04_<剧名>_英文设定集.docx`

**Binding:** Do not revert to source-novel names or plot beats; `CHAR-xx` names / public identities must align with `adaptation_plan.character_rename_map` and the five `adapted_*` narrative fields (`rules/17_改编计划锁定与下游服从.md`).

---

## Long-text execution (`rules/16`)

If context or output limits risk truncation:

1. **Batch** generation of heavy arrays: `character_profiles`, `look_profiles`, `location_profiles`, `prop_profiles`, `ai_asset_matrix` — each batch appends to working JSON.
2. **Merge pass** (separate call): input = partial JSON objects only; output = one valid `setting_bible.json` per `schema.json`. Merge **only** deduplicates IDs, aligns `character_id` / `look_id` / `location_id` / `prop_id`, and fills required fields — **do not** drop `rules/14` mandatory counts.
3. `quick_reference`, `world_background`, `visual_system`, `narrative_forbidden_zones` may be written in one pass after characters/locations exist, or with Batch A.
4. Update `run_manifest.json` when batches complete.

---

## Required Structure — 12 Chapters (Fixed Order)

### §1 Quick Reference

9 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `project_title` | string | English series title |
| `logline` | string | 1-2 sentences: protagonist + central conflict + stakes |
| `target_market` | string | e.g. "NA-English" |
| `genre` | array[string] | Primary + sub-genre, e.g. ["Hidden Identity", "Revenge Romance"] |
| `episode_count` | integer | Total episode count |
| `episode_duration` | string | e.g. "1-2 min" |
| `mood_tags` | array[string] | 3-5 core visual/emotional tags |
| `visual_identity_line` | string | One sentence describing the overall visual identity |
| `protagonist_snapshot` | string | One sentence: how the protagonist moves through the world |

---

### §2 World Background & Positioning

5 required fields:

| Field | Notes |
|-------|-------|
| `world_type` | enum: `contemporary` / `period` / `fantasy` / `sci-fi` |
| `power_structure` | Who controls resources, status, information, and by what rules |
| `social_rules` | The invisible laws — what behaviors are rewarded or punished |
| `the_core_wound` | The fundamental injustice or imbalance that drives the story |
| `tone_summary` | One sentence setting the tone (e.g. "cold luxury revenge with public humiliation as weapon") |

---

### §3 Timeline & Backstory

Minimum 3 events. Each event has 3 required fields:

| Field | Notes |
|-------|-------|
| `year_or_phase` | Anchor point (e.g. "Five years ago", "Present day", "Episode 1") |
| `event` | Specific, visualizable event description |
| `dramatic_impact` | What conflict or information this event activates |

---

### §4 Character Profiles

**Minimum 4 characters** (protagonist, antagonist, ally/love-interest, secondary driver).  
Each character requires **12 mandatory fields**:

| Field | Type | Notes |
|-------|------|-------|
| `character_id` | string | `CHAR-01` format, globally unique |
| `name` | string | Full name + aliases if any |
| `role_type` | enum | `protagonist` / `antagonist` / `ally` / `rival` / `love_interest` / `neutral` |
| `public_identity` | string | What the world sees |
| `hidden_identity` | string | True identity (write `none` if not applicable) |
| `core_desire` | string | Their deepest active want |
| `core_fear` | string | What they're driven to avoid at all costs |
| `fatal_flaw` | string | The character flaw that could destroy them |
| `character_arc` | string | `[start_state] → [end_state]` format |
| `voice_style` | string | 3 descriptors (e.g. "short, cold, precise") |
| `signature_behaviors` | array[string] | 2-3 specific observable behaviors that can be filmed |
| `visual_design` | string | Physical appearance: build, face, posture, aura |
| `look_ids` | array[string] | Linked LOOK-XX IDs |
| `signature_props` | array[string] | Linked PROP-XX IDs |

> `signature_behaviors` must be filmable, not psychological.  
> Bad: "She carries hidden pain."  
> Good: "She never raises her voice; she leans in instead." / "She straightens her cuffs before making a move."

---

### §5 Character Relationship Matrix

Minimum 3 pairs. Each pair has 5 required fields:

| Field | Notes |
|-------|-------|
| `char_a` | CHAR-XX |
| `char_b` | CHAR-XX |
| `relationship_type` | e.g. "rival sisters", "forced marriage", "hidden allies" |
| `hidden_tension` | The unspoken core tension between them |
| `power_balance` | enum: `a_dominant` / `b_dominant` / `equal` / `shifting` |

Must include: protagonist–antagonist pair + protagonist–love-interest pair.

---

### §6 Look Profiles

**Minimum 1 look per major character** (minimum 4 total).  
Each look has 9 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `look_id` | string | `LOOK-01` format |
| `character_id` | string | CHAR-XX |
| `look_name` | string | Short label, e.g. "Power Black" / "Disguise Casual" |
| `look_function` | enum | `power` / `vulnerable` / `disguise` / `casual` / `formal` / `confrontation` |
| `episodes_or_contexts` | string | When this look appears |
| `color_palette` | array[string] | 3-5 color names or hex codes |
| `key_garments` | array[string] | Clothing component list |
| `hair_and_makeup` | string | Hair style + makeup description |
| `ai_prompt_seed` | string | Complete, directly usable AI image generation prompt |

The `ai_prompt_seed` must be specific enough to generate a consistent image without further editing.  
Example: `"female 30s, severe black satin power blazer, sharp silhouette, minimal gold earring, controlled low chignon, cold confidence, studio lighting with harsh top light, fashion editorial"`

---

### §7 Location Profiles

**Minimum 3 locations**, each with 9 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `location_id` | string | `LOC-01` format |
| `name` | string | Location name |
| `type` | enum | `interior` / `exterior` / `vehicle` / `virtual` |
| `dramatic_function` | string | This space's role in the story (not just physical description) |
| `visual_keywords` | array[string] | 4-6 visual keywords |
| `lighting_mood` | string | Light/atmosphere description |
| `sound_environment` | string | Sound design context (feeds into storyboard `sfx_music`) |
| `continuity_notes` | string | Details that must remain consistent across all appearances |
| `ai_prompt_seed` | string | Complete AI background/environment generation prompt |

---

### §8 Prop Profiles

**Minimum 3 props**, each with 7 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `prop_id` | string | `PROP-01` format |
| `name` | string | Prop name |
| `owner_char_id` | string | CHAR-XX or `"shared"` |
| `story_function` | enum | `evidence` / `symbol` / `weapon` / `personal_item` / `plot_device` / `status_marker` |
| `first_appears_episode` | integer | Episode number of first appearance |
| `visual_description` | string | Detailed appearance: material, color, size, condition |
| `continuity_rules` | array[string] | Specific consistency requirements for this prop |
| `ai_prompt_seed` | string | Complete AI prop/still-life generation prompt |

---

### §9 Visual System

5 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `overall_color_palette` | object | `dominant` / `accent` / `shadow` / `highlight` — one color per slot |
| `lighting_philosophy` | string | Whole-series light approach |
| `texture_language` | array[string] | 3-5 material/surface texture tags |
| `hero_vs_villain_contrast` | object | `hero_visual` and `villain_visual` — one sentence each |
| `forbidden_aesthetics` | array[string] | Visual styles absolutely prohibited (must not be empty) |

---

### §10 Continuity Rules

**Minimum 6 rules**, structured format.  
Each rule has 5 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `rule_id` | string | `CONT-01` format |
| `rule_type` | enum | `character` / `prop` / `location` / `costume` / `timeline` |
| `applies_to` | string | CHAR-XX / PROP-XX / LOC-XX / LOOK-XX |
| `rule_description` | string | Specific rule |
| `violation_severity` | enum | `blocking` (must fix before delivery) / `warning` (note for review) |

Must cover: ≥ 2 characters, ≥ 1 prop, ≥ 1 location.

---

### §11 AI Asset Matrix

One entry per LOOK-XX, LOC-XX, and PROP-XX.  
Each entry has 6 required fields:

| Field | Type | Notes |
|-------|------|-------|
| `asset_id` | string | Matches existing LOOK/LOC/PROP ID |
| `asset_type` | enum | `character_look` / `location` / `prop` / `vfx` |
| `prompt_seed` | string | Fully formed generation prompt |
| `must_have` | array[string] | Visual elements that MUST appear |
| `must_avoid` | array[string] | Visual elements that MUST NOT appear |
| `resolution_hint` | enum | `portrait` / `landscape` / `square` |

> `must_have` and `must_avoid` must both be **arrays**, never a single string.

---

### §12 Narrative Forbidden Zones

Array of strings.  
Each entry describes something that **must never happen** in any screenplay or storyboard — for story logic, character consistency, or visual consistency reasons.  
Minimum 3 entries, recommended 5-8.

---

## Prohibitions

1. Do not write episode plot summaries or scene descriptions (those belong in the outline/screenplay).
2. Do not write shot rows or camera directions (those belong in the storyboard).
3. Do not produce `character_profiles` with fewer than 12 fields per character.
4. Do not use a single string for `must_have` or `must_avoid` in `ai_asset_matrix` — always use arrays.
5. Do not leave `forbidden_aesthetics` empty.
6. Do not produce `continuity_rules` as unstructured prose — always use the 5-field structure.
7. Do not skip `ai_prompt_seed` on any LOOK, LOC, or PROP entry.

---

## References

- `rules/17_改编计划锁定与下游服从.md`
- `rules/16_长文本分段执行规范.md`
- `rules/14_设定集规范.md`
- `examples/中间产物样例/setting_bible.json`
- `examples/最终交付样例/04_英文设定集.md`

---

## Pre-Output Self-Audit (15 checks)

- [ ] `quick_reference` all 9 fields present
- [ ] `world_background` all 5 fields present
- [ ] `timeline` ≥ 3 events, each with `dramatic_impact`
- [ ] `character_profiles` ≥ 4 characters, each with ≥ 12 fields
- [ ] Every character has `character_arc` in `[start] → [end]` format
- [ ] Every character has `signature_behaviors` as filmable specific behaviors
- [ ] `relationship_matrix` ≥ 3 pairs, each with `power_balance`
- [ ] `look_profiles` ≥ 4 looks, each with `ai_prompt_seed`
- [ ] `location_profiles` ≥ 3 locations, each with `sound_environment`
- [ ] `prop_profiles` ≥ 3 props, each with `continuity_rules` as array
- [ ] `visual_system.forbidden_aesthetics` is non-empty
- [ ] `continuity_rules` ≥ 6 entries, each with `rule_id` and `violation_severity`
- [ ] `ai_asset_matrix` has one entry per every LOOK-XX, LOC-XX, PROP-XX
- [ ] Every `ai_asset_matrix` entry has `must_have` and `must_avoid` as arrays
- [ ] `narrative_forbidden_zones` ≥ 3 entries
