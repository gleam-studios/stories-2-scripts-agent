# english-screenplay-writer

## Purpose

Write the English screenplay only.

This stage outputs performable scenes, action lines, and dialogue. It must not include shot planning or production notes.

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
3. screenplay markdown
4. scene crosswalk

## Format

`EPISODE -> SCENE -> INT./EXT. -> action -> CHARACTER NAME -> dialogue`

## Prohibitions

1. Do not include camera instructions.
2. Do not include shot sizes, transitions, or AI notes.
3. Do not rewrite the setting bible here.

## References

- `rules/12_剧本规范.md`
- `examples/中间产物样例/screenplay_pack.json`
- `examples/最终交付样例/02_英文剧本.md`
