# AGENTS.md — 微应用模板开发指南

> 本仓库遵循 Harness Engineering 范式：人类设约束，Agent 执行。
> 所有约定都有机械式规则兜底，违规会在 ESLint / CI 直接报错。

## 这个仓库是什么
- React 18 + qiankun 微前端子应用模板
- 路由基 `/tones-template`（见 package.json `homepage`）
- 多区域构建：dev / sit / test / prod / prod-hk / prod-sz

## 目录地图（先看这里）

| 你要做的事 | 去哪 |
|---|---|
| 加页面 | `src/pages/` → 细则见 `src/pages/AGENTS.md` |
| 加服务调用 | `src/services/<domain>/` → `src/services/AGENTS.md` |
| 加 MobX Store | `src/store/` → `src/store/AGENTS.md` |
| 加通用组件 | `src/components/` → `src/components/AGENTS.md` |
| 加路由 | `src/router/config.js` → `src/router/AGENTS.md` |
| 加 i18n | `src/i18n/*.js` → 两份 key 必须对齐（CI 检查） |
| 加工具/hook | `src/utils/` → `src/utils/AGENTS.md` |
| 用 prompt 模板 | `prompts/` |

## 机械式约束（跑不过就是不合规）
- 本地：`yarn lint`（自定义规则见 `tools/eslint-plugin-harness-local/`）
- 提交时：husky 自动跑 lint-staged（只拦 error 级）
- CI：`yarn test:structure` + `yarn dup:check`（MR 必过）
- 周度：熵扫描自动开 tech-debt MR

## 我该怎么开始
1. 看一眼本文的"目录地图"
2. 去对应子目录的 `AGENTS.md` 看契约
3. 如果有 `prompts/<任务>.md`，参考那里的模板
4. 写完 `yarn lint && yarn test:structure && yarn dup:check` 都过再提

## 机械式约束清单（完整）

### ESLint 自定义规则（`tools/eslint-plugin-harness-local/`）
| 规则 ID | 级别 | 检查 |
|---|---|---|
| `harness-local/no-raw-axios` | error | 禁止 `import axios from 'axios'`（除 `services/xhr/` 内部） |
| `harness-local/service-file-convention` | error | `services/<domain>/` 下文件必须 `xxxService.js` + default export |
| `harness-local/store-must-make-observable` | error | `*.Store.js` 类构造器必须调 `makeObservable` / `makeAutoObservable` |
| `harness-local/no-cross-store-import` | warn | Store 间禁止直接 import（通过 rootStore 注入） |
| `harness-local/component-folder-convention` | error | `components/` 样式必须 `.module.scss` / `.module.css` |
| `harness-local/utils-reuse-hint` | warn | `pages`/`components` 内 >5 行自定义 hook 建议抽到 `utils/hooks/` |

### 结构化测试（`tests/structure/`）
| 测试文件 | 保证 |
|---|---|
| `routes-vs-pages.test.js` | `src/pages/` 目录 ↔ `router/config.js` 双向一致 |
| `stores-registered.test.js` | 每个 `*.Store.js` 都在 `src/store/index.js` 注册 |
| `services-structure.test.js` | service 文件命名 + 目录扁平 + default export |
| `components-structure.test.js` | 组件目录结构 + i18n en-US/zh-CN key 对齐 |

### 重复检测（`.jscpdrc.json`）
- 总重复率 ≤ 5%，最少 10 行 / 70 token 才计入
- 覆盖 javascript / jsx / scss

### 熵管理（`scripts/entropy-scan.js`）
- 每周一 00:00 定时跑，自动开 `tech-debt/entropy-report-YYYY-MM-DD` MR
- 扫描维度：TODO/FIXME/XXX/HACK 注释（含 git-blame 存活天数）、knip 识别的死代码/未使用导出

### 一键本地验证
```bash
yarn ci:quality    # = yarn lint && yarn test:structure && yarn dup:check
```

### CI（`.gitlab-ci.yml`）
- MR 触发：`lint` / `structure-tests` / `duplication` 三个并行 job
- Schedule 触发：`entropy-report`（每周一 00:00，人工在 GitLab 界面配一次）

## 什么时候改本文件
- 新增顶层目录、改变分层哲学、引入新工具链 → 改
- 加一个组件/服务/页面 → 不改（改对应子目录的 AGENTS.md 或不用改）
- 新增/下架 ESLint 规则、结构测试、CI job → **必须**同步更新上面的"机械式约束清单"

## Roadmap（后续演进）
- 熵扫描补齐维度：依赖新鲜度、大文件扫描
- `no-cross-store-import` 从 warn 升 error（运行 2 个月后）
- 新增 prompt 模板：`add-route` / `add-i18n-key` / `fix-ci-fail`
