# Harness Engineering 改造方案 — 设计文档

> **飞书文档（小白入门指南，内容更丰富）：** https://www.feishu.cn/docx/NV0Kd0RlQogDSIx7TuWcUv75nfh
>
> 本文件是本地 spec，供后续实施计划（writing-plans）引用。飞书文档是主要可读版本。

---

## 背景

改造对象：`microwebsiteTemplate`（`micro-tones-template`）—— React 18 + qiankun 微前端子应用模板。

团队：5-10 人，使用 GitLab，混用 AI 工具（Claude Code / Cursor / Copilot / 纯人工），中文协作。

目标：把仓库改造成 Harness Engineering 范式（参考 https://github.com/deusyu/harness-engineering），让团队所有人按此规范开发。

## 聚焦的核心痛点

- ③ 服务层乱写（不走 `services/xhr` 封装、不走 `services/<domain>/xxxService.js`）
- ④ MobX Store 不规范（漏 `makeObservable`、跨 store 耦合）
- ⑥ 组件目录/命名混乱
- ⑧ 重复造轮子

## 架构概览

采用**分层混合约束**（方案 3），5 层机械约束 + 文档层 + prompts 模板层：

| 层 | 工具 | 何时跑 | 管什么 |
|---|---|---|---|
| L1 | 自定义 ESLint 规则 | IDE 实时 + 本地 `yarn lint` | 单文件违规 |
| L2 | husky + lint-staged | `git commit` 时 | 变更文件的 L1 检查 + prettier |
| L3 | Jest 结构化测试 | GitLab CI（MR 阶段） | 跨文件一致性 |
| L4 | jscpd | GitLab CI（MR 阶段） | 重复代码检测 |
| L5 | entropy-scan.js | CI 每周一定时 | 自动开 tech-debt MR |

## 文件清单

### 新增文件
- `AGENTS.md`（根，中文，≤100 行）
- `src/AGENTS.md`、`src/components/AGENTS.md`、`src/pages/AGENTS.md`、`src/services/AGENTS.md`、`src/store/AGENTS.md`、`src/router/AGENTS.md`、`src/utils/AGENTS.md`
- `tools/eslint-plugin-harness-local/index.js`
- `tools/eslint-plugin-harness-local/rules/no-raw-axios.js`
- `tools/eslint-plugin-harness-local/rules/service-file-convention.js`
- `tools/eslint-plugin-harness-local/rules/store-must-make-observable.js`
- `tools/eslint-plugin-harness-local/rules/no-cross-store-import.js`
- `tools/eslint-plugin-harness-local/rules/component-folder-convention.js`
- `tools/eslint-plugin-harness-local/rules/utils-reuse-hint.js`
- `tests/structure/routes-vs-pages.test.js`
- `tests/structure/stores-registered.test.js`
- `tests/structure/services-structure.test.js`
- `tests/structure/components-structure.test.js`
- `.jscpdrc.json`
- `.gitlab-ci.yml`
- `.husky/pre-commit`
- `scripts/entropy-scan.js`
- `scripts/generate-tech-debt-pr.js`
- `prompts/AGENTS.md`、`prompts/add-page.md`、`prompts/add-service.md`、`prompts/add-store.md`、`prompts/add-component.md`

### 修改文件
- `.eslintrc.js` —— 接入自定义 plugin + 启用新规则
- `package.json` —— 加 scripts（`lint` / `test:structure` / `dup:check` / `ci:quality`）+ devDependencies（husky / lint-staged / prettier / jscpd）
- `src/layout/sider/index.js`、`src/components/notFound/index.js`、`src/components/notFound/index.module.scss` —— 修复 4 处 jscpd 发现的重复

## ESLint 规则级别（首版宽松）

| # | 规则 | 级别 |
|---|---|---|
| 1 | `harness-local/no-raw-axios` | error |
| 2 | `harness-local/service-file-convention` | error |
| 3 | `harness-local/store-must-make-observable` | error |
| 4 | `harness-local/no-cross-store-import` | **warn**（首版） |
| 5 | `harness-local/component-folder-convention` | error |
| 6 | `harness-local/utils-reuse-hint` | warn |

## jscpd 阈值

- `threshold: 5`（总重复率 ≤ 5%，基线 2.92%）
- `minLines: 10`、`minTokens: 70`
- format: javascript / jsx / scss

## CI 触发策略

只在 MR 阶段跑（`$CI_PIPELINE_SOURCE == "merge_request_event"`），省 runner 资源。

## 豁免机制

首版**不强制**在 `eslint-disable` 注释里写原因。pre-commit 只拦 error 级，warn 不阻塞。

## 落地路径

三波推进，共 ~2 周：
- **波次 1（Day 1-3）**：根 + 7 子目录 AGENTS.md，3 条核心 ESLint 规则
- **波次 2（Day 4-8）**：修 4 处重复、补 3 条规则、4 个结构测试、jscpd、GitLab CI、husky、4 个 prompt 模板
- **波次 3（Day 9-14）**：熵扫描脚本、scheduled job、团队对齐会

## 成功标准

1. 新同事 5 分钟内知道去哪找约定
2. 90% 违规在 IDE 立即标红
3. Agent 看错误信息能自己修复，不需人类介入
4. 每周一收到 tech-debt MR
5. 新人靠 prompts/ 一周能独立提合格 MR

## 参考

- https://github.com/deusyu/harness-engineering
- 飞书完整文档（小白版）：https://www.feishu.cn/docx/NV0Kd0RlQogDSIx7TuWcUv75nfh
