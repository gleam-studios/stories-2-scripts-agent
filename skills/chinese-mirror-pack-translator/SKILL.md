# chinese-mirror-pack-translator

## Purpose

Generate the complete Chinese mirror pack from the final English 4-pack.

This stage outputs the Chinese outline, screenplay, storyboard table, and setting bible together. It does not go back to the original English webnovel.

## Input

- English outline
- English screenplay
- English storyboard table
- English setting bible
- `adaptation_plan` (reference — preserve adapted character names and locked narrative; **do not** restore source-novel names in Chinese, `rules/17_改编计划锁定与下游服从.md`)

## Output

- `mirror_pack.json`
- final document targets:
  - `05_<剧名>_中文大纲.docx`
  - `06_<剧名>_中文剧本.docx`
  - `07_<剧名>_中文分镜表.docx`
  - `08_<剧名>_中文设定集.docx`

## Long-text execution (`rules/16`)

When English artifacts are large:

1. Mirror in **the same batch boundaries** used for English (e.g. outline by section batch, screenplay by episode, storyboard by episode or scene, setting bible by merged JSON).
2. Maintain working `mirror_pack.json` fragments under `work/<project_slug>/mirror_fragments/` if helpful; **merge** into one `mirror_pack.json` with a final pass that only checks ID alignment and structural parity — no story rewrites.
3. **Do not** paste all four full English Word-length documents into one call if that exceeds context; use JSON slices + prior Chinese slices.
4. Update `run_manifest.json` after each mirrored batch.

---

## Minimum standard

1. Chinese must be a complete structural mirror of the English pack.
1b. Character names in Chinese narrative cells follow the English adapted names / `adaptation_plan.character_rename_map`; no reverting to original-webnovel naming.
2. All `episode_id` / `scene_id` / `shot_id` / asset IDs remain aligned.
3. Chinese must read naturally for internal teams, not like mechanical translation.
4. **Storyboard table (`07`)** must mirror the English storyboard (`03`) **row-for-row** with the same **21-column** header and column order as `rules/13_分镜表规范.md` / `english-storyboard-table-builder/schema.json`.
5. In the Chinese storyboard, **localize** narrative cells (`visual_content`, `character_action`, `key_info_point`, `sfx_music`, `continuity_notes`, `ai_note`, and Chinese `dialogue_anchor`). **Do not localize** enums: `shot_type`, `rhythm`, `transition`, or any asset IDs. Keep `emotion` strings **identical** to the English row for bilingual diff and downstream tagging.
6. For `dialogue_anchor`, use Chinese dialogue when present; use `无` when there is no line (maps to English `None` in the pipeline).
7. `transition` must use only: `CUT` / `HARD_CUT` / `SMASH_CUT` / `MATCH_CUT` / `REACTION_CUT` / `HOLD` / `DISSOLVE` / `FADE_OUT`.

## Prohibitions

1. Do not return to the original English webnovel.
2. Do not change scene order, shot order, or asset IDs.
3. Do not add or remove content blocks.
4. Do not treat the Chinese pack as a rewrite.
5. Do not rename, reorder, or drop storyboard columns relative to the English table.
6. Do not write free-text Chinese for `transition` (e.g. 硬切) instead of the enum tokens.

## References

- `rules/17_改编计划锁定与下游服从.md`
- `rules/16_长文本分段执行规范.md`
- `rules/15_双语镜像规范.md`
- `examples/中间产物样例/mirror_pack.json`
- `examples/最终交付样例/05_中文大纲.md`
- `examples/最终交付样例/06_中文剧本.md`
- `examples/最终交付样例/07_中文分镜表.md`
- `examples/最终交付样例/08_中文设定集.md`
