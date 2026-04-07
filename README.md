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

## 大纲、剧本、分镜表、设定集：格式与内容结构

以下为交付物层面的**结构摘要**；字段级硬性要求、枚举与自检清单以 `rules/11_大纲规范.md`～`rules/15_双语镜像规范.md` 为准。样例见 `examples/最终交付样例/`。

### 大纲（`01` 英文 / `05` 中文）

- **定位**：全案**主控文档**；剧本、分镜、设定集在其上展开，不在大纲里写逐场正文或镜头语言。
- **章节顺序（固定 14 节，缺一不可）**：`Quick Reference` → `Core Selling Points` → `Adaptation Positioning` → `World Setting Summary` → `Character Cards` → `Main Plot` → `Subplot Map` → `Overall Story Structure` → `Episode Outline` → `Season Hook Map` → `Episode Hook Map` → `Paywall Map` → `Signature Scenes` → `Viral Clip Candidates`。
- **要点**：
  - `Quick Reference`：项目名、Logline、市场、类型、集数、单集时长、情绪/视觉标签、主角速览等。
  - `Episode Outline`：每集 **11 个结构化字段**（如 `episode_id`、`logline`、`core_event`、`turn`、`end_hook` 等），集数必须与 `episode_count` 一致。
  - 钩子图、卡点表、名场面与切片候选须为**结构化表格/条目**，不得用散文替代；设定细节只摘要，完整版在设定集。

### 剧本（`02` 英文 / `06` 中文）

- **定位**：大纲与分镜之间的**中间层**——把集级结构落实为可拍的「场」，**不写**景别、机位、运镜（那些归分镜表）。
- **整体层级**：`EPISODE` → 可选 `COLD OPEN` → 若干 `SCENE`；每场固定四段：**场次头信息** → `[OPENING STATE]` → `[MAIN BODY]` → `[SCENE ENDING]`。
- **集头 `[EPISODE BRIEF]`**（每集第一场之前，全集只写一次）：6 项必填——`Episode Plot`、`Opening Hook`、`Cold Open Focus`、`Closing Hook`、`Core Satisfaction`、`Target Emotion`；须与首场开场、末场结尾钩子对齐。
- **场次头（7 字段）**：`Time`、`Location`、`Characters`、`Core Event`、`Scene Result`、`Outline Ref`（对齐大纲某字段，且全集须覆盖本集 `core_event` 与 `turn`）。
- **`[MAIN BODY]`**：按**动作块**分段；标准**英文剧本对白格式**（全大写角色名、`(O.S.)` / `(V.O.)` / `(CONT'D)` 等）；可视化动作行可拍、道具位置明确。
- **附录级**：需有与正文场次一致的 **scene crosswalk**（含 time、core_event、scene_result、outline_ref 等），供分镜索引对齐。

### 分镜表（`03` 英文 / `07` 中文）

- **定位**：**镜头级**生产表；主体为 **shot 一行一条** 的表格，不是剧情散文。
- **每行至少包含**（列名与细则见 `rules/13_分镜表规范.md`）：`shot_id`、`episode_id`、`scene_id`、`slugline`、`shot_size`、`camera_angle_or_move`、`visual_action`、`dialogue_anchor`、`emotion`、`character_ids`、`location_id`、`prop_ids`、`look_ids`、`sfx_music`、`transition`、`ai_note`、`estimated_duration_sec`。
- **`shot_id` 格式**：`集.场.S镜序`，例如 `01.01.S01`，可回溯到集与场。
- **密度**：按场次类型有**最低镜头数**；单集各 shot 时长累计宜落在 **60–120s**；`ai_note` 不得留空（需可指导 AI 生图/视频）。
- **可先列场次索引（scene_index）**，再列全表 shot 行，与剧本场次一一对应。

### 设定集（`04` 英文 / `08` 中文）

- **定位**：**超重设计册**（非轻量人物卡）：服务美术、道具、造型与连续性，不是剧本摘要。
- **Quick Reference**：与大纲/剧本等一致的元信息块。
- **主体须覆盖**（顺序与深度见 `rules/14_设定集规范.md`）：项目定位与世界背景；时间线与前史；角色详细设定；角色形象设计；角色关系；场景设定；道具/物品；服装与视觉系统；色彩/材质/气质标签；连续性与叙事禁区；AI 资产生成注意事项。
- **ID 体系**：主要角色、主场景、关键道具、主要造型系统须有稳定的 **`character_id` / `location_id` / `prop_id` / `look_id`**，与大纲、分镜表引用对齐。

中文四件套除翻译与本地化外，须遵守 **`rules/15_双语镜像规范.md`**，与英文结构与字段对齐。
