# source-analysis

## Purpose

Read the English source and extract the adaptation substrate.

This stage does not write outline, screenplay, storyboard table, or setting bible. It only produces `story_bible.json`.

## Input

- `source_packet` (and, for long texts, `chapter_index.yaml` / `source_chunks/*` as defined in `rules/16_长文本分段执行规范.md`)

## Output

- `story_bible.json` (final merged artifact)

Optional working files (long text):

- `work/<project_slug>/story_bible_partials/<chunk_id>.json` — one per chunk pass

## Long-text protocol (mandatory when `rules/16` applies)

1. **Chunk pass** (one model call per chunk): Input = excerpt text for that chapter range only + a **short** summary of `rules/10_相似度评分规则.md` (key thresholds and red lines, not necessarily the full file). Output = `story_bible_partial` JSON matching [`story_bible_partial.schema.json`](story_bible_partial.schema.json). Each partial **must** include:
   - `chunk_id` (e.g. `CH01-CH05`)
   - `chapter_range` (list of chapter ids covered)
   - `characters_seen`, `plot_beats`, `open_threads`
   - plus any subset fields that map cleanly into the final `story_bible` (`worldbuilding_seeds`, `location_candidates`, etc.)

2. **Merge pass** (separate model call): Input = **array of all** `story_bible_partial` objects **only** (no raw novel text). Output = single `story_bible.json` satisfying [`schema.json`](schema.json). **Must** populate `source_coverage`:
   - `chapters_covered`
   - `chunk_ids_merged`
   - `merge_version` (e.g. `1.0`)
   - `coverage_gaps` only if something failed; then **re-run** missing chunks before downstream stages.

**Merge rules:** follow `rules/16` §4.2 (ID precedence, no invented main plot, no uncovered chapters).

## Short-text protocol

If the full source comfortably fits one context window with rules and output headroom: a **single** pass may output `story_bible.json` directly. Omit `source_coverage` **only** when merge was not used (single-pass). If in doubt, use chunk+merge.

## Required output fields (final `story_bible.json`)

- `genre_assessment`
- `tone`
- `worldbuilding_seeds`
- `timeline_seeds`
- `location_candidates`
- `prop_candidates`
- `visual_theme_seeds`
- `character_cards`
- `relationship_map`
- `conflict_map`
- `selling_points`
- `similarity_risks`
- `source_value_assessment`
- `supporting_evidence`
- `source_coverage` — **required** when produced via chunk+merge

## Minimum standard

1. Extract enough world, character, location, and prop information to support a future setting bible.
2. Tag every main character with a stable `character_id`.
3. Tag every location and prop candidate with stable IDs.
4. Surface high-risk similarities before downstream writing starts.
5. After merge, `chapters_covered` must match `chapter_index.yaml` for all chapters.

## Prohibitions

1. Do not write episode outlines.
2. Do not write screenplay scenes.
3. Do not write shot rows.
4. Do not generate the setting bible here.
5. Do not feed the **entire** novel in one call when `rules/16` applies.

## References

- `rules/10_相似度评分规则.md`
- `rules/16_长文本分段执行规范.md`
- `examples/中间产物样例/story_bible.json`
- `schema.json`
- `story_bible_partial.schema.json`
