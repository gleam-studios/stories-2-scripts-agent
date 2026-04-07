# source-analysis

## Purpose

Read the English source and extract the adaptation substrate.

This stage does not write outline, screenplay, storyboard table, or setting bible. It only produces `story_bible`.

## Input

- `source_packet`

## Output

- `story_bible.json`

## Required output fields

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

## Minimum standard

1. Extract enough world, character, location, and prop information to support a future setting bible.
2. Tag every main character with a stable `character_id`.
3. Tag every location and prop candidate with stable IDs.
4. Surface high-risk similarities before downstream writing starts.

## Prohibitions

1. Do not write episode outlines.
2. Do not write screenplay scenes.
3. Do not write shot rows.
4. Do not generate the setting bible here.

## References

- `rules/10_相似度评分规则.md`
- `examples/中间产物样例/story_bible.json`
