# Soul — 本 Agent 的北极星

> 读此文件建立「为什么做、做到哪算对、绝不能踩什么线」。  
> **字段、枚举、密度、自检清单的唯一权威：** `rules/`（见 `rules/00_规则库索引.md`）。  
> **操作顺序与导出：** `SKILL.md`、`role/`。

---

## 我们到底在做什么

把**单篇英文网文**稳定改编成**海外短剧生产包**：8 个 Word（英文 01–04 主版本 + 中文 05–08 镜像），可直接支撑编剧、分镜与 AI 生产流水线。

本仓库的核心是内容与规格。`prompts/` 目录提供面向 API / 前端的多角色 prompt 文件体系。

---

## 四层分工（不可混层）


| 层级      | 回答的问题                   | 对应规则       |
| ------- | ----------------------- | ---------- |
| **设定集** | 世界、人、景、物、视觉与连续性长什么样     | `rules/14` |
| **大纲**  | 整部戏的骨架、钩子、商业结构、集级走向     | `rules/11` |
| **剧本**  | 每场发生什么、动作顺序、对白与场尾（不写镜头） | `rules/12` |
| **分镜表** | 每场拆成逐行镜头，含自动化字段（21 列等）  | `rules/13` |


设定集是**最重**的设计母文档；剧本/分镜必须与其中 ID 与连续性一致。中文交付物为**结构镜像**，细则见 `rules/15`。

---

## 多角色架构（面向 API / 前端）

8 stage 流水线在面向 API 时由**多 Agent 协作**执行，prompt 文件在 `prompts/` 目录下：

| 角色 | 文件 | 职责 |
| --- | --- | --- |
| **总制作人** | `prompts/主Agent/总制作人.txt` | 纯调度，不生成内容；按顺序调度子角色并在每步后触发审核 |
| 原文分析师 | `prompts/子Agent/原文分析师.txt` | Stage 1：`source-analysis` → `story_bible.json` |
| 原作梳理师 | `prompts/子Agent/原作梳理师.txt` | Stage 1b：`source-narrative-digest` → `narrative_digest.json` |
| 改编策划师 | `prompts/子Agent/改编策划师.txt` | Stage 2：`overseas-adaptation-planner` → `adaptation_plan.json` |
| 设定集构建师 | `prompts/子Agent/设定集构建师.txt` | Stage 3：`english-setting-bible-builder` → `setting_bible.json` |
| 大纲创作师 | `prompts/子Agent/大纲创作师.txt` | Stage 4：`english-outline-writer` → `outline_pack.json` |
| 剧本创作师 | `prompts/子Agent/剧本创作师.txt` | Stage 5：`english-screenplay-writer` → `screenplay_pack.json` |
| 分镜构建师 | `prompts/子Agent/分镜构建师.txt` | Stage 6：`english-storyboard-table-builder` → `storyboard_pack.json` |
| 镜像翻译师 | `prompts/子Agent/镜像翻译师.txt` | Stage 7：`chinese-mirror-pack-translator` → `mirror_pack.json` |
| **规格审核员** | `prompts/子Agent/规格审核员.txt` | 每个 stage 完成后审核产物质量，75 分通过，最多 2 轮修改 |

**执行闭环**：子角色完成 → 规格审核员审核 → 询问用户意见 → 用户满意才进入下一 stage。

在 Cursor 中手动驱动时仍可直接使用 `skills/` 目录；`prompts/` 是面向 API 层的执行格式，内容源自相同的 `rules/` + `skills/`。

---

## 固定流水线（8 stages）

`source-analysis` → `source-narrative-digest` → `overseas-adaptation-planner` → `english-setting-bible-builder` → `english-outline-writer` → `english-screenplay-writer` → `english-storyboard-table-builder` → `chinese-mirror-pack-translator`

**改内容：先改英文 01–04，再镜像中文。** 不得绕过英文另写一版故事。

---

## 长文本与上下文（默认）

原文达到 **~50 万字符 / ~12 万 token** 量级或更高时，**必须**按 `rules/16_长文本分段执行规范.md` 执行：**chunk + merge、大纲 batch + align、剧本按集、分镜按集/按场**，并维护 `work/<slug>/run_manifest.json`。**禁止**为省事单次塞入全书导致截断与缩水。新开对话续跑：先读 `run_manifest.json` 与本 `soul.md`。

---

## 非妥协项（Soul 级）

1. **不缩水**：大纲 / 剧本动作块 / 分镜行数须满足各 `rules` 中的最低密度与公式；禁止用概括段替代可拍细节。
2. **规则源唯一**：运行时只认 `rules/`；`short-drama原始参考/` 等仅供人读，不当作执行约束。
3. **分镜可机读**：表头、枚举、`episode_id` / `scene_id`、声音与连续性字段等按 `rules/13` 与对应 `schema.json` 填满。
4. **双语对齐**：中文分镜等须与英文**逐行对齐**，列名与枚举不胡乱中文化（见 `rules/15`）。
5. **边界清晰**：设定集里不写分场剧本；剧本里不写镜头表；分镜里不重写整部大纲。

---

## 读完 Soul 之后读什么

1. `README.md` — 交付物列表、目录、格式骨架总览
2. `SKILL.md` — 总控入口
3. `role/README.md` 与 `role/单篇执行流程.md` — 怎么跑完一篇
4. `prompts/` — 面向 API 的多角色 prompt 文件（总制作人 + 7 子角色 + 规格审核员）
5. 执行到某一 stage 时：打开对应 `skills/<stage>/SKILL.md` + 其引用的 `rules/`

若本文件与 `rules/` 冲突，**以 `rules/` 为准**；Soul 仅作方向与优先级提醒。