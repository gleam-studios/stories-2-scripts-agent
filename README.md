# 网文转海外短剧 Agent

**本目录即项目根目录**；`README.md` 就在根上。下文所称「本工作区」均指当前这一层目录。

本工作区不负责前端、API、批量调度和程序壳。唯一目标是把英文网文稳定改编成海外短剧生产包，并最终交付 8 个 Word 文件。

## 最终正式交付

1. `01_<剧名>_英文大纲.docx`
2. `02_<剧名>_英文剧本.docx`
3. `03_<剧名>_英文分镜表.docx`
4. `04_<剧名>_英文设定集.docx`
5. `05_<剧名>_中文大纲.docx`
6. `06_<剧名>_中文剧本.docx`
7. `07_<剧名>_中文分镜表.docx`
8. `08_<剧名>_中文设定集.docx`

说明：

1. 英文 1-4 是生产主版本。
2. 中文 5-8 只从最终英文 1-4 生成。
3. `project_slug` 用于工作目录与桌面导出目录。
4. `project_title` 用于最终 Word 文件名中的剧名字段。

## 固定 stage

1. `source-analysis`
2. `overseas-adaptation-planner`
3. `english-setting-bible-builder`
4. `english-outline-writer`
5. `english-screenplay-writer`
6. `english-storyboard-table-builder`
7. `chinese-mirror-pack-translator`

## 目录说明

- `SKILL.md`
  - 总控入口
- `role/`
  - 角色定义、快捷指令、启动与导出规范、单篇执行流程
- `skills/`
  - 7 个 stage 的正式 skill
- `rules/`
  - 运行时规则源
- `examples/`
  - 中间产物样例与 8 份最终交付样例
- `work/`
  - 单篇项目的工作目录
- `short-drama原始参考/`
  - 原始理论参考，不直接作为运行时规则源

## 推荐阅读顺序

1. `SKILL.md`
2. `role/README.md`
3. `role/快捷指令规范.md`
4. `role/总控Agent角色.md`
5. `role/单篇执行流程.md`
6. `role/启动与导出规范.md`
7. 按需读取 `rules/`
8. 按需读取 `skills/`
9. 对照 `examples/`

## 当前口径

1. `rules/` 是唯一运行时规则源。
2. 大纲、剧本、分镜表、设定集严格拆分。
3. 每份最终文件都带 `Quick Reference` 开头块。
4. 分镜表固定为镜头逐行表，不再使用旧的“拍摄脚本”总称作为交付物名称。

---

## Agent 工作原理与规则

### 角色与任务链

总控 Agent 负责把**单篇英文网文**按固定顺序改编为**海外短剧生产包**，不是单纯翻译，也不是一次性生成一大段文本。主链固定为：

理解原文 → 海外改编规划 → **英文**设定集 → **英文**大纲 → **英文**剧本 → **英文**分镜表 → **中文**镜像四件套 → **8 个 Word** 正式交付。

### 主版本与双语原则

1. **英文 01–04** 是生产主版本（大纲、剧本、分镜表、设定集）。
2. **中文 05–08** 只从最终英文四件套镜像生成，不得绕过英文另写一版故事。
3. 若要改内容，**优先改英文**，再同步镜像中文。

### 规则从哪里来、约束什么

- **`rules/`** 是运行时**唯一**规则源：约束各 stage 的输出边界、8 个 Word 的格式与密度、海外改编逻辑、双语镜像规则。
- **`role/`** 规定如何启动、如何收尾、快捷指令（如 `/start`）、单篇流程与导出路径；不写具体剧本内容。
- **`skills/`** 对应 7 个 stage 的正式 skill；执行时按 skill 读入，并服从对应 `rules/` 条目（索引见 `rules/00_规则库索引.md`）。

### 标准执行顺序（7 个 stage）

| 顺序 | Stage | 主要产出（工作区常见文件名） |
|------|--------|------------------------------|
| 1 | `source-analysis` | `story_bible` |
| 2 | `overseas-adaptation-planner` | `adaptation_plan` |
| 3 | `english-setting-bible-builder` | 英文设定集（及中间 JSON） |
| 4 | `english-outline-writer` | 英文大纲 |
| 5 | `english-screenplay-writer` | 英文剧本 |
| 6 | `english-storyboard-table-builder` | 英文分镜表 |
| 7 | `chinese-mirror-pack-translator` | 中文大纲 / 剧本 / 分镜表 / 设定集 |

启动后会在 `work/<project_slug>/` 落盘；收尾时核对英文 1–4 与中文 5–8 完整、编号与命名一致，并可按 `role/启动与导出规范.md` 导出到桌面 `~/Desktop/短剧导出/<project_slug>/`。

### 工作边界（默认）

- **做**：单篇、单次完整改编、单次双语交付；维护大纲 / 剧本 / 分镜 / 设定集边界清晰。
- **不做**：前端、批量队列、审核门、程序壳扩展等（详见 `SKILL.md`、`role/总控Agent角色.md`）。

更细的「每一步最低完成标准」见 `role/单篇执行流程.md`。

---

## 四大交付物：完整格式骨架

字段级约束、枚举与自检清单见对应 `rules/` 文件。完整带内容样例见 `examples/最终交付样例/`。

---

### 大纲 `01_英文大纲.docx` / `05_中文大纲.docx`

```
# <剧名> — Outline

## Quick Reference
Title / Logline / Target Market / Genre / Episode Count /
Episode Duration / Emotional-Visual Tags / Lead Characters

## Core Selling Points
Genre Hook:
Emotional Hook:
Character Hook:
Differentiation:

## Adaptation Positioning
Core Hook:
Audience Positioning:
Similarity Avoidance Direction:

## World Setting Summary
Era & Environment:
Social Rules:
Industry / Special Setting:
Key Constraints:

## Character Cards
### CHAR-01 — [角色名]
Role Type / Identity / Personality Keywords / Desire Goal /
Relation to Protagonist / Contrast Point / Arc Note
（每个主要角色一张，至少 4 张）

## Main Plot
Protagonist Want:
Antagonist Block:
Escalation Path:
Resolution Direction:

## Subplot Map
### SUB-01
Type / Characters Involved / Arc Summary / Function in Story
（至少 2 条）

## Overall Story Structure
### Opening
### Development
### Midpoint Reversal
### Climax
### Ending

## Episode Outline
### EP01 — [集标题]
arc_phase / logline / core_event / turn / emotional_goal /
relationship_shift / antagonist_pressure / satisfaction_beat / end_hook
（每集一条，集数等于 episode_count）

## Season Hook Map
| phase | ratio_range | hook_direction |

## Episode Hook Map
| episode_id | hook_type | hook_out |

## Paywall Map
| episode_id | position_ratio | phase | type | beat | viewer_task |

## Signature Scenes
### SIG-01
episode_id / scene_type / description / why_unmissable / production_weight
（3–8 条）

## Viral Clip Candidates
### CLIP-01
episode_id / clip_type / description / hook_in_3s
（3–6 条）
```

---

### 剧本 `02_英文剧本.docx` / `06_中文剧本.docx`

```
# <剧名> — Screenplay

## Quick Reference
Title / Logline / Target Market / Genre / Episode Count /
Episode Duration / Emotional-Visual Tags / Lead Characters

---

## EPISODE 01

[EPISODE BRIEF]
Episode Plot:
Opening Hook:
Cold Open Focus:
Closing Hook:
Core Satisfaction:
Target Emotion:

### COLD OPEN（可选）
Time:
Location:
Characters:
Core Event:
Scene Result:
Outline Ref: setup

[OPENING STATE]

[MAIN BODY]

[SCENE ENDING / END COLD OPEN]

---

### SCENE 01.01
Time:
Location:
Characters:
Core Event:
Scene Result:
Outline Ref:

[OPENING STATE]

[MAIN BODY]

CHARACTER NAME
Dialogue.

CHARACTER NAME (O.S.)
Dialogue.

CHARACTER NAME (CONT'D)
Dialogue.

[SCENE ENDING — cliffhanger / reversal / emotional_peak / setup]

---

### SCENE 01.02
...（每集 2–5 场）

---

## EPISODE 02
...（重复上述结构，全剧每集均完整展开）
```

---

### 分镜表 `03_英文分镜表.docx` / `07_中文分镜表.docx`

```
# <剧名> — Storyboard（英文主表）/ 中文分镜表（镜像）

## Quick Reference
Title / Logline / Target Market / Genre / Episode Count /
Episode Duration / Emotional-Visual Tags / Lead Characters

---

## EPISODE 01

Episode Core Event / Episode Tone / Key Reversal / Closing Hook

### SCENE 01.01 — [场次简称]
Time / Location / Characters / Core Event / Start State / End State /
Scene Type / Screenplay Ref

| shot_id | episode_id | scene_id | shot_type | screenplay_ref | visual_content | character_action | key_info_point | shot_language | dialogue_anchor | emotion | rhythm | estimated_duration_sec | transition | sfx_music | continuity_notes | character_ids | location_id | prop_ids | look_ids | ai_note |

说明：
- `07_中文分镜表` 与 `03` **列名、列序、`shot_id` 行数**完全一致；叙事类单元格用中文，`shot_type` / `rhythm` / `transition` / 资产 ID 与英文一致（`rules/15_双语镜像规范.md` §四）。
- `transition` 仅允许：CUT / HARD_CUT / SMASH_CUT / MATCH_CUT / REACTION_CUT / HOLD / DISSOLVE / FADE_OUT

---

## EPISODE 02
...（全剧每集均完整展开）
```

---

### 设定集 `04_英文设定集.docx` / `08_中文设定集.docx`

```
# <剧名> — Setting Bible

## Quick Reference
Title / Logline / Target Market / Genre / Episode Count /
Episode Duration / Emotional-Visual Tags / Lead Characters

## 1. Project Positioning & World Background

## 2. Timeline & Backstory

## 3. Character Profiles（详细设定）
### CHAR-01 — [角色名]
Full background / psychology / speech patterns / physical description /
wardrobe notes / arc across season

## 4. Character Visual Design
### CHAR-01
Key visual references / color palette / distinguishing features

## 5. Character Relationships
Relationship map / power dynamics / emotional dependencies

## 6. Location Profiles
### LOC-01 — [场景名]
Physical description / atmosphere / recurring props / lighting notes

## 7. Props & Objects
### PROP-01 — [道具名]
Description / first appearance / narrative function / visual requirements

## 8. Costume & Visual System
### LOOK-01 — [造型系统名]
Episode range / character / key pieces / color story

## 9. Color / Texture / Tone Tags
Overall palette / per-character tone tags / per-location mood tags

## 10. Continuity & Story Prohibitions
What must never change / what must always be consistent /
facts locked by the plot that cannot be retconned

## 11. AI Asset Generation Notes
Per-character prompt anchors / per-location prompt anchors /
style consistency rules for AI image/video generation
```
