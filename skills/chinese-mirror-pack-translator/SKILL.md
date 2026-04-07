# chinese-mirror-pack-translator

## Purpose

Generate the complete Chinese mirror pack from the final English 4-pack.

This stage outputs the Chinese outline, screenplay, storyboard table, and setting bible together. It does not go back to the original English webnovel.

## Input

- English outline
- English screenplay
- English storyboard table
- English setting bible

## Output

- `mirror_pack.json`
- final document targets:
  - `05_<剧名>_中文大纲.docx`
  - `06_<剧名>_中文剧本.docx`
  - `07_<剧名>_中文分镜表.docx`
  - `08_<剧名>_中文设定集.docx`

## Minimum standard

1. Chinese must be a complete structural mirror of the English pack.
2. All `episode_id` / `scene_id` / `shot_id` / asset IDs remain aligned.
3. Chinese must read naturally for internal teams, not like mechanical translation.

## Prohibitions

1. Do not return to the original English webnovel.
2. Do not change scene order, shot order, or asset IDs.
3. Do not add or remove content blocks.
4. Do not treat the Chinese pack as a rewrite.

## References

- `rules/15_双语镜像规范.md`
- `examples/中间产物样例/mirror_pack.json`
- `examples/最终交付样例/05_中文大纲.md`
- `examples/最终交付样例/06_中文剧本.md`
- `examples/最终交付样例/07_中文分镜表.md`
- `examples/最终交付样例/08_中文设定集.md`
