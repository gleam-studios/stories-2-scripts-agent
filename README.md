# 网文转海外短剧 Agent 工作区

这个目录是独立的 `agent` 工作区。

这里不负责前端、API、批量调度和程序壳。这里唯一要做的事，是把英文网文稳定改编成海外短剧生产包，并最终交付 8 个 Word 文件。

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
