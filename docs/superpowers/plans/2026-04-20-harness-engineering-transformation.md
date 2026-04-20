# Harness Engineering 改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `microwebsiteTemplate` 改造成 Harness Engineering 范式：建立 5 层机械约束 + AGENTS.md 文档体系 + Prompts 模板层，让团队成员（含 AI Agent）在统一规则下高效协作开发。

**Architecture:** 采用分层混合约束（L1 ESLint / L2 husky / L3 Jest 结构化测试 / L4 jscpd / L5 周度熵扫描），文档层面用 `AGENTS.md` 系统（根 + 7 子目录）+ `prompts/` 模板。严格度首版偏宽松：多数规则 error，部分设 warn；pre-commit 只拦 error。

**Tech Stack:** React 18、craco、qiankun、MobX 6、react-intl、axios、Antd v6、Sass、Jest（react-scripts 内建）、ESLint 8、jscpd、husky 9、lint-staged 15、prettier 3、GitLab CI。

**Prerequisites:** 项目已 git-init 并关联 GitLab 远端。本地若未 git-init（检测到 `.git` 不存在），执行任务 0（见下文）。

**相关文档：**
- 设计文档（飞书，小白版）：https://www.feishu.cn/docx/NV0Kd0RlQogDSIx7TuWcUv75nfh
- 本地 spec：`docs/superpowers/specs/2026-04-20-harness-engineering-transformation-design.md`

---

## 文件结构总览

### 新增文件
```
AGENTS.md
src/AGENTS.md
src/components/AGENTS.md
src/pages/AGENTS.md
src/services/AGENTS.md
src/store/AGENTS.md
src/router/AGENTS.md
src/utils/AGENTS.md
tools/eslint-plugin-harness-local/
├── package.json
├── index.js
├── rules/
│   ├── no-raw-axios.js
│   ├── service-file-convention.js
│   ├── store-must-make-observable.js
│   ├── no-cross-store-import.js
│   ├── component-folder-convention.js
│   └── utils-reuse-hint.js
└── tests/
    ├── no-raw-axios.test.js
    ├── service-file-convention.test.js
    ├── store-must-make-observable.test.js
    ├── no-cross-store-import.test.js
    ├── component-folder-convention.test.js
    └── utils-reuse-hint.test.js
tests/structure/
├── jest.config.js
├── routes-vs-pages.test.js
├── stores-registered.test.js
├── services-structure.test.js
└── components-structure.test.js
prompts/
├── AGENTS.md
├── add-page.md
├── add-service.md
├── add-store.md
└── add-component.md
scripts/
├── entropy-scan.js
└── generate-tech-debt-pr.js
.jscpdrc.json
.gitlab-ci.yml
.husky/pre-commit
.prettierrc.json
```

### 修改文件
- `.eslintrc.js` — 接入 `eslint-plugin-harness-local`
- `package.json` — 新增 scripts + devDeps
- `src/layout/sider/index.js` — 修复自身重复 (jscpd 发现的 clone)
- `src/components/notFound/index.js` — 修复自身重复
- `src/components/notFound/index.module.scss` — 修复自身 SCSS 重复

---

## 任务 0（条件执行）：git 初始化

**仅当本地 `.git` 不存在时执行。** 如已是 git 仓库，跳到任务 1。

**Files:**
- Create: `.git/` (via `git init`)

- [ ] **Step 1: Check if git-initialized**

```bash
git rev-parse --is-inside-work-tree 2>&1
```
Expected output: `true` (skip this task) OR `fatal: not a git repository...` (continue).

- [ ] **Step 2: Initialize git + connect to GitLab**

询问用户 GitLab 仓库 URL，然后：

```bash
git init
git remote add origin <GITLAB_URL_FROM_USER>
git fetch origin
git checkout -b develop origin/develop 2>/dev/null || git checkout -b develop
```

- [ ] **Step 3: Verify**

```bash
git status
git remote -v
```

Expected: clean status, `origin` points to GitLab.

---

# 波次 1：地基（Day 1-3）

## 任务 1：根 AGENTS.md

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1: Create root AGENTS.md**

Write exactly the following content to `AGENTS.md`:

```markdown
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

## 什么时候改本文件
- 新增顶层目录、改变分层哲学、引入新工具链 → 改
- 加一个组件/服务/页面 → 不改（改对应子目录的 AGENTS.md 或不用改）

## Roadmap（后续演进）
- 熵扫描补齐维度：依赖新鲜度、大文件扫描
- `no-cross-store-import` 从 warn 升 error（运行 2 个月后）
- 新增 prompt 模板：`add-route` / `add-i18n-key` / `fix-ci-fail`
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add root AGENTS.md navigation guide"
```

---

## 任务 2：子目录 AGENTS.md（7 份）

**Files:**
- Create: `src/AGENTS.md`
- Create: `src/components/AGENTS.md`
- Create: `src/pages/AGENTS.md`
- Create: `src/services/AGENTS.md`
- Create: `src/store/AGENTS.md`
- Create: `src/router/AGENTS.md`
- Create: `src/utils/AGENTS.md`

- [ ] **Step 1: Create `src/AGENTS.md`**

```markdown
# src AGENTS.md

## 契约
- 全局路径别名：`@/` → `src/`（在 `jsconfig.json` / webpack alias 中配置）
- 所有样式必须使用 CSS Modules：`.module.scss`，禁止非 module 的 `.scss` / `.css`
- 禁止污染全局 `window`（qiankun 子应用必须避免全局冲突）

## 目录职责
| 目录 | 职责 | 详情 |
|---|---|---|
| `components/` | 通用组件 | `components/AGENTS.md` |
| `pages/` | 路由页面 | `pages/AGENTS.md` |
| `services/` | API 调用 + axios 封装 | `services/AGENTS.md` |
| `store/` | MobX 状态管理 | `store/AGENTS.md` |
| `router/` | 路由配置 | `router/AGENTS.md` |
| `utils/` | 工具函数 + hooks | `utils/AGENTS.md` |
| `i18n/` | 多语言包 | `en-US.js` / `zh-CN.js` key 必须对齐 |
| `layout/` | 布局（footer/header/sider） | 布局组件约定同 components |
| `assets/` `fonts/` `commonCss/` | 静态资源 | 按现有结构维护 |

## 禁止
- 禁止新建 `.css` / 非 module 的 `.scss`（规则 `harness-local/component-folder-convention`）
- 禁止直接操作 `window` 的全局属性（会被 qiankun 沙箱拦截）
```

- [ ] **Step 2: Create `src/components/AGENTS.md`**

```markdown
# src/components AGENTS.md

## 契约
本目录只放**通用**组件（多处复用的、无业务上下文的）。业务组件放 `pages/<PageName>/` 内部。

## 新增一个通用组件的步骤
1. 创建目录 `src/components/<ComponentName>/`（**PascalCase**）
2. 文件 `index.js` export default 组件
3. 有样式时同目录加 `index.module.scss`（**必须是 module.scss**）
4. 文件内**只定义一个组件**（扩展自 `react/no-multi-comp`）

## 禁止
- 禁止目录小写 / camelCase（规则 `harness-local/component-folder-convention`）
- 禁止 `import './xxx.scss'` 非 module 样式（规则 `harness-local/component-folder-convention`）
- 禁止一个文件多个组件定义

## 正例
- `src/components/Authorized/index.js` — 权限包装组件
- `src/components/imgIcon/index.js` — 图标组件（注：`imgIcon` 是历史遗留小写命名，**新组件必须 PascalCase**）
```

- [ ] **Step 3: Create `src/pages/AGENTS.md`**

```markdown
# src/pages AGENTS.md

## 契约
每个页面对应一个 qiankun 子应用内部的路由。页面目录 PascalCase，每个页面独立目录。

## 新增一个页面的步骤
1. 创建 `src/pages/<PageName>/index.js`（PascalCase 目录，`index.js` 文件）
2. 组件 `export default`，命名 PascalCase
3. 有样式时同目录加 `index.module.scss`
4. **在 `src/router/config.js` 注册路由**（L3 结构化测试兜底）
5. 路由对象格式：
   ```js
   {
     path: '/<kebab-case>',
     component: () => import('@/pages/<PageName>'),
     name: '<PageName>',
     meta: { intl: '<intl-key-in-both-language-files>' }
   }
   ```
6. 在 `src/i18n/en-US.js` 和 `zh-CN.js` **两份都加** `<intl-key>`
7. 读 MobX store：`inject('<storeName>')(observer(<Component>))`
8. 调接口：从 `@/services/<domain>/xxxService` 导入，禁止自己 new axios

## 禁止
- 禁止新建页面不注册路由（CI 会失败，测试 `routes-vs-pages.test.js`）
- 禁止页面内写中文字面量，必须走 `<FormattedMessage id="..." />`
- 禁止直接 `import axios from 'axios'`（规则 `harness-local/no-raw-axios`）

## 正例
- `src/pages/Home/index.js`
```

- [ ] **Step 4: Create `src/services/AGENTS.md`**

```markdown
# src/services AGENTS.md

## 契约
本目录负责所有 HTTP 调用。中心化的 axios 实例在 `services/xhr/`，包含 token 刷新、错误处理、环境变量 baseURL。**其他任何地方都必须走这个实例**。

## 目录结构
```
services/
├── xhr/              # axios 实例（不要改动）
│   ├── index.js
│   └── code.js
├── user/             # 按领域分组
│   └── loginService.js
├── dashboard/
├── deviceDetails/
└── productDetails/
```

## 新增一个服务调用的步骤
1. 按业务领域选目录（`user/` `dashboard/` ...），不存在就新建 domain 目录
2. 文件命名 **`xxxService.js`**（驼峰 + Service 后缀）
3. 文件顶部 `import http from '@/services/xhr'`（**只能这样导入**）
4. `export default` 一个对象或函数集

## 文件内容示例
```js
import http from '@/services/xhr'

export default {
  fetchList(params) {
    return http.get('/api/device/list', { params })
  },
  create(payload) {
    return http.post('/api/device', payload)
  }
}
```

## 禁止
- 禁止 `import axios from 'axios'`（规则 `harness-local/no-raw-axios`，仅 `services/xhr/` 内部豁免）
- 禁止文件不以 `Service.js` 结尾（规则 `harness-local/service-file-convention`）
- 禁止在 domain 目录下建子目录（结构测试会检查）
```

- [ ] **Step 5: Create `src/store/AGENTS.md`**

```markdown
# src/store AGENTS.md

## 契约
MobX 6 状态管理。每个 Store 是一个独立类，通过 `store/index.js` 汇总为 rootStore 注入到组件。

## 新增一个 Store 的步骤
1. 创建 `src/store/<name>.Store.js`（**文件名必须以 `.Store.js` 结尾**）
2. 定义 class，命名 `XxxStore`（PascalCase）
3. **构造器必须调用 `makeAutoObservable(this)` 或 `makeObservable(this, {...})`**
4. **在 `src/store/index.js` 里 import 并注册到 rootStore**（L3 测试兜底）

## 文件内容示例
```js
import { makeAutoObservable } from 'mobx'

class DeviceStore {
  list = []
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  setList(list) {
    this.list = list
  }

  async fetchList() {
    this.loading = true
    try {
      const { data } = await http.get('/api/devices')
      this.setList(data)
    } finally {
      this.loading = false
    }
  }
}

export default DeviceStore
```

## 禁止
- 禁止构造器不调 `makeObservable` / `makeAutoObservable`（规则 `harness-local/store-must-make-observable`）
- 禁止 Store 间直接 import（规则 `harness-local/no-cross-store-import`，**首版 warn**）
  - 需要访问其他 Store 的数据：通过 rootStore 注入，如 `rootStore.userStore.name`
- 禁止 Store 文件不在 `store/index.js` 注册（L3 `stores-registered.test.js` 兜底）

## 正例
- `src/store/user.Store.js`
- `src/store/app.Store.js`
```

- [ ] **Step 6: Create `src/router/AGENTS.md`**

```markdown
# src/router AGENTS.md

## 契约
所有路由集中在 `src/router/config.js`（单文件维护），`index.js` 负责渲染 `<Routes>`。

## 新增一条路由的步骤
1. 在 `src/router/config.js` 的路由数组中新增对象：
   ```js
   {
     path: '/<kebab-case>',
     component: () => import('@/pages/<PageName>'),
     name: '<PageName>',
     meta: { intl: 'menu.device.list' }  // 必须是 i18n 两份文件都存在的 key
   }
   ```
2. 懒加载必须用 `() => import(...)`，不要直接 import
3. `meta.intl` 对应 menu / 面包屑 / 页面标题展示

## 禁止
- 禁止页面目录存在但路由不注册（L3 `routes-vs-pages.test.js` 兜底）
- 禁止路由 `component` 指向不存在的 `pages/` 目录
- 禁止 `meta.intl` 使用不存在的 i18n key（后续可升级为 L3 检查）

## 正例
- `src/router/config.js`
```

- [ ] **Step 7: Create `src/utils/AGENTS.md`**

```markdown
# src/utils AGENTS.md

## 契约
放置**通用纯函数**和**跨页面复用的自定义 hook**。业务相关工具放到对应 `services/<domain>/` 或 `pages/<Page>/` 内部。

## 目录结构
```
utils/
├── index.js          # 主导出
├── hooks/            # 自定义 hook（建议新增）
└── format/           # 格式化工具（建议新增）
```

## 新增一个工具的步骤
1. 纯函数 → 放 `utils/` 根目录或 `utils/<category>/`
2. 自定义 hook（函数名以 `use` 开头）→ 放 `utils/hooks/`
3. 文件 export named export，聚合到 `utils/index.js` 的 `export * from './xxx'`

## 禁止
- 禁止在 `pages/` 或 `components/` 中定义超过 5 行的 `useXxx` hook 而不抽到本目录（规则 `harness-local/utils-reuse-hint`，warn）
- 禁止同一个工具在不同页面写 3 次（jscpd 会告警，阈值 5%）

## 正例
- `src/utils/index.js`（当前是空文件，待补充）
```

- [ ] **Step 8: Commit all AGENTS.md**

```bash
git add src/AGENTS.md src/components/AGENTS.md src/pages/AGENTS.md \
        src/services/AGENTS.md src/store/AGENTS.md src/router/AGENTS.md \
        src/utils/AGENTS.md
git commit -m "docs: add per-directory AGENTS.md contracts"
```

---

## 任务 3：脚手架 eslint-plugin-harness-local

**Files:**
- Create: `tools/eslint-plugin-harness-local/package.json`
- Create: `tools/eslint-plugin-harness-local/index.js`

- [ ] **Step 1: Create plugin package.json**

File: `tools/eslint-plugin-harness-local/package.json`

```json
{
  "name": "eslint-plugin-harness-local",
  "version": "0.1.0",
  "private": true,
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=8"
  }
}
```

- [ ] **Step 2: Create plugin entry**

File: `tools/eslint-plugin-harness-local/index.js`

```js
module.exports = {
  rules: {
    'no-raw-axios': require('./rules/no-raw-axios'),
    'service-file-convention': require('./rules/service-file-convention'),
    'store-must-make-observable': require('./rules/store-must-make-observable'),
    'no-cross-store-import': require('./rules/no-cross-store-import'),
    'component-folder-convention': require('./rules/component-folder-convention'),
    'utils-reuse-hint': require('./rules/utils-reuse-hint')
  }
}
```

- [ ] **Step 3: Install local plugin link + jest for tests**

```bash
yarn add -D file:./tools/eslint-plugin-harness-local jest
```

Modify `package.json` dependencies to include the local file path (yarn will add it automatically).

- [ ] **Step 4: Commit scaffolding**

```bash
git add tools/eslint-plugin-harness-local/package.json \
        tools/eslint-plugin-harness-local/index.js \
        package.json yarn.lock
git commit -m "feat(lint): scaffold eslint-plugin-harness-local"
```

---

## 任务 4：规则 1 — `no-raw-axios`（TDD）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/no-raw-axios.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/no-raw-axios.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/no-raw-axios.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/no-raw-axios')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-raw-axios', rule, {
  valid: [
    {
      code: "import http from '@/services/xhr'",
      filename: '/abs/src/pages/Home/index.js'
    },
    {
      code: "import axios from 'axios'",
      filename: '/abs/src/services/xhr/index.js'
    }
  ],
  invalid: [
    {
      code: "import axios from 'axios'",
      filename: '/abs/src/pages/Home/index.js',
      errors: [{ messageId: 'banned' }]
    },
    {
      code: "import { AxiosInstance } from 'axios'",
      filename: '/abs/src/services/user/loginService.js',
      errors: [{ messageId: 'banned' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails (rule missing)**

```bash
npx jest tools/eslint-plugin-harness-local/tests/no-raw-axios.test.js
```

Expected: `Cannot find module '../rules/no-raw-axios'`

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/no-raw-axios.js`

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止直接导入 axios，必须从 @/services/xhr 引入封装好的实例'
    },
    schema: [],
    messages: {
      banned: '禁止直接导入 axios，必须从 @/services/xhr 引入封装好的实例。详见 src/services/AGENTS.md#契约'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    const inXhrDir = /\/src\/services\/xhr\//.test(filename)
    if (inXhrDir) return {}

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'axios') {
          context.report({ node, messageId: 'banned' })
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/no-raw-axios.test.js
```

Expected: `PASS` with 4 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/no-raw-axios.js \
        tools/eslint-plugin-harness-local/tests/no-raw-axios.test.js
git commit -m "feat(lint): add no-raw-axios rule"
```

---

## 任务 5：规则 2 — `service-file-convention`（TDD）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/service-file-convention.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/service-file-convention.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/service-file-convention.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/service-file-convention')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('service-file-convention', rule, {
  valid: [
    {
      code: "export default { fetch() {} }",
      filename: '/abs/src/services/user/loginService.js'
    },
    {
      code: "export default function foo(){}",
      filename: '/abs/src/services/dashboard/chartService.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/services/xhr/index.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/services/xhr/code.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/pages/Home/index.js'
    }
  ],
  invalid: [
    {
      code: "export default {}",
      filename: '/abs/src/services/user/login.js',
      errors: [{ messageId: 'badName' }]
    },
    {
      code: "export const foo = 1",
      filename: '/abs/src/services/user/loginService.js',
      errors: [{ messageId: 'noDefault' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails**

```bash
npx jest tools/eslint-plugin-harness-local/tests/service-file-convention.test.js
```

Expected: module not found error.

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/service-file-convention.js`

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'services/<domain>/ 下的文件命名必须为 xxxService.js 且 export default'
    },
    schema: [],
    messages: {
      badName: '服务文件命名必须以 Service.js 结尾（例：loginService.js）。详见 src/services/AGENTS.md',
      noDefault: '服务文件必须 export default。详见 src/services/AGENTS.md'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    // 匹配 src/services/<domain>/xxx.js，但不包含 xhr 目录
    const match = filename.match(/\/src\/services\/([^/]+)\/([^/]+)\.js$/)
    if (!match) return {}
    const [, domain, base] = match
    if (domain === 'xhr') return {}

    let hasDefault = false
    let programNode = null

    return {
      Program(node) { programNode = node },
      ExportDefaultDeclaration() { hasDefault = true },
      'Program:exit'(node) {
        if (!/Service$/.test(base)) {
          context.report({ node, messageId: 'badName' })
        }
        if (!hasDefault) {
          context.report({ node, messageId: 'noDefault' })
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/service-file-convention.test.js
```

Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/service-file-convention.js \
        tools/eslint-plugin-harness-local/tests/service-file-convention.test.js
git commit -m "feat(lint): add service-file-convention rule"
```

---

## 任务 6：规则 3 — `store-must-make-observable`（TDD）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/store-must-make-observable.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/store-must-make-observable.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/store-must-make-observable.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/store-must-make-observable')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('store-must-make-observable', rule, {
  valid: [
    {
      code: `
        import { makeAutoObservable } from 'mobx'
        class UserStore { constructor(){ makeAutoObservable(this) } }
      `,
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: `
        import { makeObservable, observable } from 'mobx'
        class AppStore { constructor(){ makeObservable(this, { name: observable }) } }
      `,
      filename: '/abs/src/store/app.Store.js'
    },
    {
      code: "class NotAStore {}",
      filename: '/abs/src/utils/helper.js'  // 非 store 文件，豁免
    }
  ],
  invalid: [
    {
      code: "class UserStore { constructor(){ this.name = 'x' } }",
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    },
    {
      code: "class UserStore {}",
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails**

```bash
npx jest tools/eslint-plugin-harness-local/tests/store-must-make-observable.test.js
```

Expected: module not found.

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/store-must-make-observable.js`

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '*.Store.js 中每个 class 的构造器必须调用 makeObservable 或 makeAutoObservable'
    },
    schema: [],
    messages: {
      missing: 'MobX Store 类 "{{name}}" 的构造器必须调用 makeAutoObservable(this) 或 makeObservable。详见 src/store/AGENTS.md'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    if (!/\.Store\.js$/.test(filename)) return {}

    function hasMakeObservableCall(classNode) {
      const ctor = classNode.body.body.find(
        m => m.type === 'MethodDefinition' && m.kind === 'constructor'
      )
      if (!ctor) return false
      const stmts = ctor.value.body.body
      return stmts.some(s => {
        if (s.type !== 'ExpressionStatement') return false
        const expr = s.expression
        if (expr.type !== 'CallExpression') return false
        const callee = expr.callee
        if (callee.type !== 'Identifier') return false
        return callee.name === 'makeObservable' || callee.name === 'makeAutoObservable'
      })
    }

    return {
      ClassDeclaration(node) {
        if (!hasMakeObservableCall(node)) {
          context.report({
            node,
            messageId: 'missing',
            data: { name: node.id ? node.id.name : '<anonymous>' }
          })
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/store-must-make-observable.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/store-must-make-observable.js \
        tools/eslint-plugin-harness-local/tests/store-must-make-observable.test.js
git commit -m "feat(lint): add store-must-make-observable rule"
```

---

## 任务 7：接入 plugin 到 .eslintrc.js

**Files:**
- Modify: `.eslintrc.js`
- Modify: `package.json` (add `lint` script)

- [ ] **Step 1: Update .eslintrc.js**

Edit `.eslintrc.js`:

Replace the `plugins: ['react'],` line with:

```js
plugins: ['react', 'harness-local'],
```

Add to the `rules` object (inside the final `}` before `},`):

```js
// Harness Engineering 自定义规则（波次 1：3 条核心）
'harness-local/no-raw-axios': 'error',
'harness-local/service-file-convention': 'error',
'harness-local/store-must-make-observable': 'error',
```

- [ ] **Step 2: Add lint script to package.json**

Edit `package.json`, add to `scripts`:

```json
"lint": "eslint src tools/eslint-plugin-harness-local --ext .js,.jsx",
"lint:fix": "yarn lint --fix",
```

- [ ] **Step 3: Run lint**

```bash
yarn lint 2>&1 | tee /tmp/lint-output.txt
```

Expected: may find real violations in existing code (e.g., a service not named `xxxService.js`, or a `.Store.js` missing `makeObservable`). Review output.

- [ ] **Step 4: Fix any existing violations**

For each violation reported:
- If `no-raw-axios` triggers outside `services/xhr/` → change to `import http from '@/services/xhr'`
- If `service-file-convention` flags a filename → rename file + update its imports
- If `store-must-make-observable` flags → add `makeAutoObservable(this)` in constructor

Re-run `yarn lint` until clean.

- [ ] **Step 5: Commit**

```bash
git add .eslintrc.js package.json src
git commit -m "feat(lint): wire harness-local plugin (3 core rules) + fix existing violations"
```

---

# 波次 2：CI 层 + husky（Day 4-8）

## 任务 8：修复 4 处 jscpd 发现的重复

**Files:**
- Modify: `src/layout/sider/index.js` (lines 101-132 vs 218-247 — menu render duplication)
- Modify: `src/components/notFound/index.js` (lines 7-14 vs 9-28)
- Modify: `src/components/notFound/index.module.scss` (lines 122-137 vs 137-151; 261-283 vs 283-305)

- [ ] **Step 1: Read and understand sider duplication**

```bash
# 查看 src/layout/sider/index.js 的两段重复
```
Use Read tool on `src/layout/sider/index.js` lines 95-135 and 215-250.

Typical pattern: two `menu.map()` or similar loops duplicated with slight variation.

- [ ] **Step 2: Refactor sider — extract shared render function**

Identify the duplicated block. Create a helper function inside the component (or module-level) that accepts differing params. Replace both occurrences.

Example approach:
```js
function renderMenuItem(item, isSubMenu) {
  // shared logic
}
// then use renderMenuItem(item, false) and renderMenuItem(item, true)
```

- [ ] **Step 3: Read and refactor notFound/index.js**

Use Read tool on `src/components/notFound/index.js`.

Typical pattern: two similar JSX blocks for different states. Extract to a component or helper.

- [ ] **Step 4: Refactor notFound/index.module.scss**

Identify the duplicated SCSS blocks. Extract to a `@mixin` or shared class.

Example:
```scss
@mixin centered-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  // ...shared props
}

.wrapperA { @include centered-layout; }
.wrapperB { @include centered-layout; }
```

- [ ] **Step 5: Verify jscpd drops**

```bash
npx jscpd src --min-lines 10 --min-tokens 70
```

Expected: total duplication drops from 2.92% towards 0-1%.

- [ ] **Step 6: Run app in dev to ensure nothing broke**

```bash
yarn start:dev
```

Manual check: sider renders correctly, notFound page renders correctly.

- [ ] **Step 7: Commit**

```bash
git add src/layout/sider/index.js src/components/notFound/
git commit -m "refactor: eliminate 4 duplication sites flagged by jscpd baseline"
```

---

## 任务 9：规则 4 — `no-cross-store-import`（TDD，warn 级）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/no-cross-store-import.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/no-cross-store-import.js`
- Modify: `.eslintrc.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/no-cross-store-import.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/no-cross-store-import')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-cross-store-import', rule, {
  valid: [
    {
      code: "import { makeAutoObservable } from 'mobx'",
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: "import helper from '@/utils'",
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: "import UserStore from './user.Store'",
      filename: '/abs/src/store/index.js'  // rootStore 聚合器豁免
    }
  ],
  invalid: [
    {
      code: "import UserStore from './user.Store'",
      filename: '/abs/src/store/app.Store.js',
      errors: [{ messageId: 'crossStore' }]
    },
    {
      code: "import UserStore from './user.Store.js'",
      filename: '/abs/src/store/app.Store.js',
      errors: [{ messageId: 'crossStore' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails**

```bash
npx jest tools/eslint-plugin-harness-local/tests/no-cross-store-import.test.js
```

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/no-cross-store-import.js`

```js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'MobX Store 间禁止直接 import，应通过 rootStore 注入'
    },
    schema: [],
    messages: {
      crossStore: 'Store 间不能直接 import "{{target}}"，要通过 rootStore 注入。详见 src/store/AGENTS.md#禁止'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    // 只在 *.Store.js 文件内生效（index.js 豁免）
    if (!/\/src\/store\/[^/]+\.Store\.js$/.test(filename)) return {}

    return {
      ImportDeclaration(node) {
        const src = node.source.value
        // 匹配相对路径指向其他 .Store 文件
        if (/^\.\/[^/]+\.Store(\.js)?$/.test(src)) {
          context.report({
            node,
            messageId: 'crossStore',
            data: { target: src }
          })
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/no-cross-store-import.test.js
```

- [ ] **Step 5: Enable rule at warn level in .eslintrc.js**

Add to `rules` in `.eslintrc.js`:

```js
'harness-local/no-cross-store-import': 'warn',
```

- [ ] **Step 6: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/no-cross-store-import.js \
        tools/eslint-plugin-harness-local/tests/no-cross-store-import.test.js \
        .eslintrc.js
git commit -m "feat(lint): add no-cross-store-import rule (warn)"
```

---

## 任务 10：规则 5 — `component-folder-convention`（TDD）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/component-folder-convention.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/component-folder-convention.js`
- Modify: `.eslintrc.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/component-folder-convention.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/component-folder-convention')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } }
})

ruleTester.run('component-folder-convention', rule, {
  valid: [
    {
      code: "import styles from './index.module.scss'",
      filename: '/abs/src/components/MyBtn/index.js'
    },
    {
      code: "import './global.css'",
      filename: '/abs/src/index.js'  // 非 components 目录豁免
    }
  ],
  invalid: [
    {
      code: "import './index.scss'",
      filename: '/abs/src/components/MyBtn/index.js',
      errors: [{ messageId: 'nonModuleScss' }]
    },
    {
      code: "import './styles.css'",
      filename: '/abs/src/components/MyBtn/index.js',
      errors: [{ messageId: 'nonModuleScss' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails**

```bash
npx jest tools/eslint-plugin-harness-local/tests/component-folder-convention.test.js
```

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/component-folder-convention.js`

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'components 目录下样式必须使用 .module.scss'
    },
    schema: [],
    messages: {
      nonModuleScss: '组件样式必须使用 .module.scss，禁止导入普通 .scss/.css。详见 src/components/AGENTS.md'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    if (!/\/src\/components\//.test(filename)) return {}

    return {
      ImportDeclaration(node) {
        const src = node.source.value
        // 只检查本地样式文件
        if (!/^\.\.?\//.test(src)) return
        if (/\.module\.scss$/.test(src)) return
        if (/\.(scss|css)$/.test(src)) {
          context.report({ node, messageId: 'nonModuleScss' })
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/component-folder-convention.test.js
```

- [ ] **Step 5: Enable rule in .eslintrc.js**

Add:

```js
'harness-local/component-folder-convention': 'error',
```

- [ ] **Step 6: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/component-folder-convention.js \
        tools/eslint-plugin-harness-local/tests/component-folder-convention.test.js \
        .eslintrc.js
git commit -m "feat(lint): add component-folder-convention rule"
```

---

## 任务 11：规则 6 — `utils-reuse-hint`（TDD，warn 级）

**Files:**
- Create: `tools/eslint-plugin-harness-local/tests/utils-reuse-hint.test.js`
- Create: `tools/eslint-plugin-harness-local/rules/utils-reuse-hint.js`
- Modify: `.eslintrc.js`

- [ ] **Step 1: Write failing test**

File: `tools/eslint-plugin-harness-local/tests/utils-reuse-hint.test.js`

```js
const { RuleTester } = require('eslint')
const rule = require('../rules/utils-reuse-hint')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('utils-reuse-hint', rule, {
  valid: [
    {
      code: "function useFoo() { return 1 }",
      filename: '/abs/src/utils/hooks/useFoo.js'
    },
    {
      code: "function useLocal() { return 1 }",  // 3 行以内豁免
      filename: '/abs/src/pages/Home/index.js'
    }
  ],
  invalid: [
    {
      code: `function useBig() {
        const a = 1
        const b = 2
        const c = 3
        const d = 4
        const e = 5
        return a + b + c + d + e
      }`,
      filename: '/abs/src/pages/Home/index.js',
      errors: [{ messageId: 'considerExtract' }]
    }
  ]
})
```

- [ ] **Step 2: Run test → fails**

```bash
npx jest tools/eslint-plugin-harness-local/tests/utils-reuse-hint.test.js
```

- [ ] **Step 3: Implement rule**

File: `tools/eslint-plugin-harness-local/rules/utils-reuse-hint.js`

```js
const MIN_LINES = 5

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '超过 5 行的自定义 hook 建议抽到 src/utils/hooks/'
    },
    schema: [],
    messages: {
      considerExtract: '自定义 hook "{{name}}" 超过 {{lines}} 行，考虑抽到 src/utils/hooks/。详见 src/utils/AGENTS.md'
    }
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/')
    // 只在 pages/ 或 components/ 下检查
    if (!/\/src\/(pages|components)\//.test(filename)) return {}

    function check(node, name) {
      if (!name || !/^use[A-Z]/.test(name)) return
      const loc = node.loc
      if (!loc) return
      const lines = loc.end.line - loc.start.line + 1
      if (lines > MIN_LINES) {
        context.report({
          node,
          messageId: 'considerExtract',
          data: { name, lines: MIN_LINES }
        })
      }
    }

    return {
      FunctionDeclaration(node) {
        check(node, node.id && node.id.name)
      },
      VariableDeclarator(node) {
        if (node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
          check(node.init, node.id && node.id.name)
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run test → passes**

```bash
npx jest tools/eslint-plugin-harness-local/tests/utils-reuse-hint.test.js
```

- [ ] **Step 5: Enable rule at warn level in .eslintrc.js**

Add:

```js
'harness-local/utils-reuse-hint': 'warn',
```

- [ ] **Step 6: Commit**

```bash
git add tools/eslint-plugin-harness-local/rules/utils-reuse-hint.js \
        tools/eslint-plugin-harness-local/tests/utils-reuse-hint.test.js \
        .eslintrc.js
git commit -m "feat(lint): add utils-reuse-hint rule (warn)"
```

---

## 任务 12：Jest 配置（结构化测试专用）

**Files:**
- Create: `tests/structure/jest.config.js`
- Modify: `package.json`

- [ ] **Step 1: Create jest config**

File: `tests/structure/jest.config.js`

```js
module.exports = {
  rootDir: '../..',
  testMatch: ['<rootDir>/tests/structure/**/*.test.js'],
  testEnvironment: 'node',
  transform: {},
  verbose: true
}
```

- [ ] **Step 2: Add test:structure script**

Edit `package.json`, add to `scripts`:

```json
"test:structure": "jest --config tests/structure/jest.config.js"
```

- [ ] **Step 3: Verify script runs (with no tests yet)**

```bash
yarn test:structure
```

Expected: `No tests found` (OK — tests come next).

- [ ] **Step 4: Commit**

```bash
git add tests/structure/jest.config.js package.json
git commit -m "chore: add jest config for structure tests"
```

---

## 任务 13：结构化测试 1 — `routes-vs-pages`

**Files:**
- Create: `tests/structure/routes-vs-pages.test.js`

- [ ] **Step 1: Write test**

File: `tests/structure/routes-vs-pages.test.js`

```js
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.resolve(__dirname, '../../src/pages')
const ROUTER_CONFIG = path.resolve(__dirname, '../../src/router/config.js')

function getPageFolders() {
  return fs.readdirSync(PAGES_DIR).filter(name => {
    const full = path.join(PAGES_DIR, name)
    if (!fs.statSync(full).isDirectory()) return false
    return fs.existsSync(path.join(full, 'index.js')) ||
           fs.existsSync(path.join(full, 'index.jsx'))
  })
}

function extractPageNamesFromRouter() {
  const src = fs.readFileSync(ROUTER_CONFIG, 'utf8')
  // 匹配 @/pages/PageName 或 ./pages/PageName
  const regex = /['"](?:@\/|\.\.?\/)pages\/([^'"/]+)/g
  const names = new Set()
  let m
  while ((m = regex.exec(src))) names.add(m[1])
  return Array.from(names)
}

describe('routes-vs-pages consistency', () => {
  const pageFolders = getPageFolders()
  const routedPages = extractPageNamesFromRouter()

  test.each(pageFolders)(
    'page folder "%s" must be registered in router/config.js',
    (pageName) => {
      expect(routedPages).toContain(pageName)
    }
  )

  test.each(routedPages)(
    'router reference "%s" must correspond to a real page folder',
    (pageName) => {
      expect(pageFolders).toContain(pageName)
    }
  )
})
```

- [ ] **Step 2: Run test → passes on current codebase**

```bash
yarn test:structure
```

Expected: PASS (current Home page is in both router/config.js and pages/Home/).

If FAIL: investigate. Home should match `@/pages/Home` or similar in router/config.js.

- [ ] **Step 3: Commit**

```bash
git add tests/structure/routes-vs-pages.test.js
git commit -m "test(structure): add routes-vs-pages consistency test"
```

---

## 任务 14：结构化测试 2 — `stores-registered`

**Files:**
- Create: `tests/structure/stores-registered.test.js`

- [ ] **Step 1: Write test**

File: `tests/structure/stores-registered.test.js`

```js
const fs = require('fs')
const path = require('path')

const STORE_DIR = path.resolve(__dirname, '../../src/store')
const INDEX_FILE = path.join(STORE_DIR, 'index.js')

function getStoreFiles() {
  return fs.readdirSync(STORE_DIR).filter(f => /\.Store\.js$/.test(f))
}

describe('MobX store registration', () => {
  const indexSrc = fs.readFileSync(INDEX_FILE, 'utf8')
  const storeFiles = getStoreFiles()

  test.each(storeFiles)(
    '"%s" must be imported in src/store/index.js',
    (storeFile) => {
      // e.g. file "user.Store.js" → expect import from "./user.Store"
      const base = storeFile.replace(/\.js$/, '')
      const pattern = new RegExp(`from\\s+['"]\\./${base.replace('.', '\\.')}['"]`)
      expect(indexSrc).toMatch(pattern)
    }
  )
})
```

- [ ] **Step 2: Run test → PASS**

```bash
yarn test:structure
```

Expected: PASS for user.Store.js and app.Store.js (both currently registered).

If FAIL: check `src/store/index.js` — may need to verify imports match the pattern `from './xxx.Store'`.

- [ ] **Step 3: Commit**

```bash
git add tests/structure/stores-registered.test.js
git commit -m "test(structure): add stores-registered consistency test"
```

---

## 任务 15：结构化测试 3 — `services-structure`

**Files:**
- Create: `tests/structure/services-structure.test.js`

- [ ] **Step 1: Write test**

File: `tests/structure/services-structure.test.js`

```js
const fs = require('fs')
const path = require('path')

const SERVICES_DIR = path.resolve(__dirname, '../../src/services')
const EXEMPT_DOMAINS = new Set(['xhr'])

function listDomains() {
  return fs.readdirSync(SERVICES_DIR).filter(d =>
    fs.statSync(path.join(SERVICES_DIR, d)).isDirectory()
  )
}

function listServiceFiles(domain) {
  const domainDir = path.join(SERVICES_DIR, domain)
  return fs.readdirSync(domainDir).filter(f =>
    fs.statSync(path.join(domainDir, f)).isFile() && /\.js$/.test(f)
  )
}

function hasNestedDirs(domain) {
  const domainDir = path.join(SERVICES_DIR, domain)
  return fs.readdirSync(domainDir).some(entry =>
    fs.statSync(path.join(domainDir, entry)).isDirectory()
  )
}

describe('services directory structure', () => {
  const domains = listDomains().filter(d => !EXEMPT_DOMAINS.has(d))

  test.each(domains)(
    'domain "%s" must not contain nested subdirectories',
    (domain) => {
      expect(hasNestedDirs(domain)).toBe(false)
    }
  )

  domains.forEach(domain => {
    listServiceFiles(domain).forEach(file => {
      test(`"services/${domain}/${file}" must end with Service.js`, () => {
        expect(file).toMatch(/Service\.js$/)
      })
    })
  })
})
```

- [ ] **Step 2: Run test**

```bash
yarn test:structure
```

Expected: PASS for current structure (services/user/loginService.js, etc.).

If FAIL: rename any non-conforming files (e.g., `login.js` → `loginService.js`), update imports.

- [ ] **Step 3: Commit**

```bash
git add tests/structure/services-structure.test.js
git commit -m "test(structure): add services-structure consistency test"
```

---

## 任务 16：结构化测试 4 — `components-structure` + i18n

**Files:**
- Create: `tests/structure/components-structure.test.js`

- [ ] **Step 1: Write test**

File: `tests/structure/components-structure.test.js`

```js
const fs = require('fs')
const path = require('path')

const COMPONENTS_DIR = path.resolve(__dirname, '../../src/components')
const I18N_EN = path.resolve(__dirname, '../../src/i18n/en-US.js')
const I18N_ZH = path.resolve(__dirname, '../../src/i18n/zh-CN.js')

function listComponentDirs() {
  return fs.readdirSync(COMPONENTS_DIR).filter(d =>
    fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory()
  )
}

// 简易 parser：extract top-level object keys from export default { ... }
function extractTopLevelKeys(jsFile) {
  const mod = require(jsFile)
  const obj = mod.default || mod
  return Object.keys(obj)
}

describe('component folder structure', () => {
  const dirs = listComponentDirs()

  test.each(dirs)(
    'component "%s" must have index.js (or index.jsx)',
    (dir) => {
      const hasIndex =
        fs.existsSync(path.join(COMPONENTS_DIR, dir, 'index.js')) ||
        fs.existsSync(path.join(COMPONENTS_DIR, dir, 'index.jsx'))
      expect(hasIndex).toBe(true)
    }
  )

  test.each(dirs)(
    'component "%s" — if it has scss, it must be .module.scss',
    (dir) => {
      const dirPath = path.join(COMPONENTS_DIR, dir)
      const badScss = fs.readdirSync(dirPath).filter(
        f => /\.scss$/.test(f) && !/\.module\.scss$/.test(f)
      )
      expect(badScss).toEqual([])
    }
  )
})

describe('i18n keys parity', () => {
  test('en-US and zh-CN must have identical key sets', () => {
    const en = extractTopLevelKeys(I18N_EN)
    const zh = extractTopLevelKeys(I18N_ZH)
    const onlyInEn = en.filter(k => !zh.includes(k))
    const onlyInZh = zh.filter(k => !en.includes(k))
    expect({ onlyInEn, onlyInZh }).toEqual({ onlyInEn: [], onlyInZh: [] })
  })
})
```

- [ ] **Step 2: Run test**

```bash
yarn test:structure
```

Expected: most pass. If i18n keys fail → align the two files manually.

Note: If `require(jsFile)` for i18n files fails because they use ES modules syntax that Node can't resolve, adapt:
- Replace with regex-based extraction:

```js
function extractTopLevelKeys(jsFile) {
  const src = fs.readFileSync(jsFile, 'utf8')
  const match = src.match(/export\s+default\s+\{([\s\S]*)\}/)
  if (!match) return []
  // Extract first-level keys (naïve — good for flat objects)
  const body = match[1]
  const keys = []
  const regex = /['"]?([\w.-]+)['"]?\s*:/g
  let m
  while ((m = regex.exec(body))) keys.push(m[1])
  return keys
}
```

Use the regex version if `require` fails.

- [ ] **Step 3: Fix any i18n mismatches**

If test reports `onlyInEn` or `onlyInZh` non-empty, add missing keys to the other file (use existing entries as placeholder translations pending real translations).

- [ ] **Step 4: Commit**

```bash
git add tests/structure/components-structure.test.js src/i18n
git commit -m "test(structure): add components + i18n consistency test"
```

---

## 任务 17：.jscpdrc.json

**Files:**
- Create: `.jscpdrc.json`
- Modify: `package.json`

- [ ] **Step 1: Create .jscpdrc.json**

File: `.jscpdrc.json`

```json
{
  "threshold": 5,
  "format": ["javascript", "jsx", "scss"],
  "ignore": [
    "**/node_modules/**",
    "**/build/**",
    "**/*.test.js",
    "**/tests/**",
    "**/report/**"
  ],
  "minLines": 10,
  "minTokens": 70,
  "reporters": ["console", "markdown"],
  "absolute": true,
  "gitignore": true,
  "output": "./report/jscpd"
}
```

- [ ] **Step 2: Add dup:check script and ci:quality shortcut**

Edit `package.json`, add to `scripts`:

```json
"dup:check": "jscpd src",
"ci:quality": "yarn lint && yarn test:structure && yarn dup:check"
```

Install jscpd:

```bash
yarn add -D jscpd
```

- [ ] **Step 3: Add report/ to .gitignore**

Edit `.gitignore`, add:

```
report/
```

- [ ] **Step 4: Run dup:check**

```bash
yarn dup:check
```

Expected: duplication % below 5 (after Task 8 refactor, should be ~0-1%).

- [ ] **Step 5: Commit**

```bash
git add .jscpdrc.json .gitignore package.json yarn.lock
git commit -m "chore: add jscpd config + dup:check script (threshold 5%)"
```

---

## 任务 18：GitLab CI 配置

**Files:**
- Create: `.gitlab-ci.yml`

- [ ] **Step 1: Create .gitlab-ci.yml**

File: `.gitlab-ci.yml`

```yaml
stages:
  - quality

default:
  image: node:18-alpine
  cache:
    key:
      files:
        - yarn.lock
    paths:
      - node_modules/

.only-mr: &only-mr
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

install:
  stage: quality
  script:
    - yarn install --frozen-lockfile
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour
  <<: *only-mr

lint:
  stage: quality
  needs: [install]
  script:
    - yarn lint
  <<: *only-mr

structure-tests:
  stage: quality
  needs: [install]
  script:
    - yarn test:structure
  <<: *only-mr

duplication:
  stage: quality
  needs: [install]
  script:
    - yarn dup:check
  artifacts:
    when: always
    paths:
      - report/jscpd/
    expire_in: 1 week
  <<: *only-mr
```

- [ ] **Step 2: Commit**

```bash
git add .gitlab-ci.yml
git commit -m "ci: add GitLab pipeline (lint/structure/jscpd on MR)"
```

- [ ] **Step 3: Verify on test MR**

```bash
git checkout -b test/harness-ci-verification
git push -u origin test/harness-ci-verification
```

Open a test MR via GitLab UI → verify 3 jobs run in parallel and pass.

Merge or close the test MR. **This task is complete only after verifying CI pipeline actually executes.**

---

## 任务 19：husky + lint-staged + prettier

**Files:**
- Create: `.husky/pre-commit`
- Create: `.prettierrc.json`
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
yarn add -D husky lint-staged prettier
```

- [ ] **Step 2: Initialize husky**

```bash
yarn husky install
```

This creates `.husky/` dir.

- [ ] **Step 3: Add prepare script + lint-staged config to package.json**

Edit `package.json`, add to `scripts`:

```json
"prepare": "husky install"
```

Add top-level:

```json
"lint-staged": {
  "src/**/*.{js,jsx}": [
    "eslint",
    "prettier --write"
  ],
  "src/**/*.{scss,json}": [
    "prettier --write"
  ]
}
```

- [ ] **Step 4: Create .prettierrc.json**

File: `.prettierrc.json`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "always"
}
```

*(Matches existing `.eslintrc.js` style: single quotes, no semicolons, 4-space indent.)*

- [ ] **Step 5: Create pre-commit hook**

File: `.husky/pre-commit`

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

Make executable:

```bash
chmod +x .husky/pre-commit
```

- [ ] **Step 6: Test hook**

Make a trivial change to a `.js` file in `src/`, then:

```bash
git add src/<touched-file>
git commit -m "test: verify husky hook"
```

Expected: lint-staged runs, prettier formats, commit succeeds (if no error-level violations).

Verify by intentionally introducing `import axios from 'axios'` in a non-xhr file → commit should fail with rule `no-raw-axios` error. Revert the change.

- [ ] **Step 7: Commit**

```bash
git add .husky/pre-commit .prettierrc.json package.json yarn.lock
git commit -m "chore: add husky pre-commit + lint-staged + prettier"
```

---

## 任务 20：Prompts 模板层（5 个文件）

**Files:**
- Create: `prompts/AGENTS.md`
- Create: `prompts/add-page.md`
- Create: `prompts/add-service.md`
- Create: `prompts/add-store.md`
- Create: `prompts/add-component.md`

- [ ] **Step 1: Create prompts/AGENTS.md**

File: `prompts/AGENTS.md`

```markdown
# prompts 目录

这里存放"验证过能跑通"的提示词模板。当你要做常见任务（加页面/服务/Store/组件）时，复制对应文件里的提示词给 AI，把占位符替换成你的值。

## 包含
- `add-page.md` — 加一个路由页面
- `add-service.md` — 加一个 API 服务
- `add-store.md` — 加一个 MobX Store
- `add-component.md` — 加一个通用组件

## 什么时候加新模板
- 一个任务被团队反复做（≥3 次）
- 写过一次成功的 prompt 并跑通了所有 CI

## 什么时候更新
- AGENTS.md 里的约定变了 → 同步更新对应 prompt
- 发现 prompt 里的步骤会被 Agent 跳步 → 改步骤措辞 / 加强"禁止"

## 格式要求
每个模板遵循：何时使用 / 使用方式 / 提示词（含：背景 / 步骤 / 禁止 / 验收 / 参考）
```

- [ ] **Step 2: Create prompts/add-page.md**

File: `prompts/add-page.md`

```markdown
# 加一个新页面

## 何时使用
需要在本微应用中新增一个路由页面。

## 使用方式
复制下面的提示词给 AI，把 `<PageName>`、`<kebab-case>`、`<intl-key>`、`<menu-label>` 替换成你的值。

---

## 提示词

你要在这个 qiankun 子应用中新增一个页面 `<PageName>`（例如 `DeviceList`）。严格按以下步骤，不要跳步：

### 背景
- React 18 + MobX + react-intl + qiankun 微前端模板
- 所有约定见根目录 `AGENTS.md` 和 `src/pages/AGENTS.md`

### 步骤
1. 创建 `src/pages/<PageName>/index.js`，组件用 PascalCase 命名，`export default`
2. 如需样式，同目录加 `index.module.scss`（**必须 module**）
3. 在 `src/router/config.js` 注册路由：
   ```js
   {
     path: '/<kebab-case>',
     component: () => import('@/pages/<PageName>'),
     name: '<PageName>',
     meta: { intl: '<intl-key>' }
   }
   ```
4. 在 `src/i18n/en-US.js` 和 `src/i18n/zh-CN.js` **两份都加** `<intl-key>`（缺一份 CI 会失败）
5. 读 MobX store：用 `inject('<storeName>')(observer(<Component>))`
6. 调接口：service 放 `src/services/<domain>/xxxService.js`，从 `@/services/xhr` 导入 http 实例

### 禁止
- 禁止 `import axios from 'axios'`
- 禁止写中文字面量，必须走 `<FormattedMessage id="..." />`
- 禁止新建 store 却不在 `src/store/index.js` 注册

### 验收
写完后请按顺序跑这三个命令并确认全过：
```bash
yarn lint
yarn test:structure
yarn dup:check
```

### 参考
- 契约详情：`src/pages/AGENTS.md`
- 正例：`src/pages/Home/index.js`
```

- [ ] **Step 3: Create prompts/add-service.md**

File: `prompts/add-service.md`

```markdown
# 加一个新服务

## 何时使用
需要在本应用中新增一个或一组 API 调用。

## 使用方式
复制下面的提示词给 AI，替换 `<domain>` 和 `<name>Service`。

---

## 提示词

请在 `src/services/<domain>/<name>Service.js` 新增 API 调用：

### 背景
- 所有 HTTP 调用必须走 `@/services/xhr`（已封装 token 刷新、错误处理）
- 见 `src/services/AGENTS.md`

### 步骤
1. 如果 `<domain>` 目录不存在，先 `mkdir src/services/<domain>`
2. 创建 `src/services/<domain>/<name>Service.js`
3. 文件顶部：`import http from '@/services/xhr'`
4. `export default` 一个对象，键是函数名，值是函数：
   ```js
   import http from '@/services/xhr'

   export default {
     fetchList(params) {
       return http.get('/api/<domain>/list', { params })
     },
     create(payload) {
       return http.post('/api/<domain>', payload)
     }
   }
   ```

### 禁止
- 禁止 `import axios from 'axios'`
- 禁止文件不以 `Service.js` 结尾（`login.js` ❌，`loginService.js` ✅）
- 禁止在 `services/<domain>/` 下建子目录

### 验收
```bash
yarn lint
yarn test:structure
```
```

- [ ] **Step 4: Create prompts/add-store.md**

File: `prompts/add-store.md`

```markdown
# 加一个新 MobX Store

## 何时使用
需要新增一块独立的全局状态（如设备列表、用户设置）。

## 使用方式
复制下面的提示词给 AI，替换 `<Name>`。

---

## 提示词

请新建 MobX Store `<Name>Store` 并注册到 rootStore：

### 背景
- MobX 6，每个 Store 必须 `makeAutoObservable(this)` 或 `makeObservable(this, {...})`
- 见 `src/store/AGENTS.md`

### 步骤
1. 创建 `src/store/<name>.Store.js`（小写 name + `.Store.js`）
2. 文件内容：
   ```js
   import { makeAutoObservable } from 'mobx'

   class <Name>Store {
     // 状态
     list = []
     loading = false

     constructor() {
       makeAutoObservable(this)  // 不能漏
     }

     // action
     setList(list) {
       this.list = list
     }
   }

   export default <Name>Store
   ```
3. 在 `src/store/index.js` 里 import 并注册到 rootStore：
   ```js
   import <Name>Store from './<name>.Store'
   // 在 rootStore 创建时挂载
   ```

### 禁止
- 禁止漏 `makeObservable` / `makeAutoObservable`（CI 会报错）
- 禁止 Store 间直接 import（要通过 rootStore 访问别的 Store）
- 禁止文件名不以 `.Store.js` 结尾

### 验收
```bash
yarn lint
yarn test:structure
```
```

- [ ] **Step 5: Create prompts/add-component.md**

File: `prompts/add-component.md`

```markdown
# 加一个通用组件

## 何时使用
需要新增一个会被多处复用的通用组件（业务组件放页面目录内部）。

## 使用方式
复制下面的提示词给 AI，替换 `<ComponentName>`（必须 PascalCase）。

---

## 提示词

请在 `src/components/<ComponentName>/` 新增一个通用组件：

### 背景
- 见 `src/components/AGENTS.md`
- 所有组件样式必须 `.module.scss`

### 步骤
1. 创建目录 `src/components/<ComponentName>/`（**PascalCase**）
2. 文件 `index.js`：export default 组件
   ```jsx
   import React from 'react'
   import styles from './index.module.scss'

   export default function <ComponentName>(props) {
     return <div className={styles.wrapper}>...</div>
   }
   ```
3. 如需样式，创建 `index.module.scss`
4. 文件内**只定义一个组件**

### 禁止
- 禁止目录小写 / camelCase
- 禁止 `import './xxx.scss'` 非 module 样式
- 禁止一个文件多个组件

### 验收
```bash
yarn lint
yarn test:structure
```
```

- [ ] **Step 6: Commit**

```bash
git add prompts/
git commit -m "docs: add prompts/ templates (page/service/store/component)"
```

---

# 波次 3：熵管理 + 收尾（Day 9-14）

## 任务 21：熵扫描脚本 `entropy-scan.js`

**Files:**
- Create: `scripts/entropy-scan.js`

- [ ] **Step 1: Install dependency**

```bash
yarn add -D knip
```

*(Knip 用于检测死代码 / 未使用的导出。)*

- [ ] **Step 2: Create scan script**

File: `scripts/entropy-scan.js`

```js
#!/usr/bin/env node
/**
 * 熵扫描：产出两个维度的技术债
 *   1. TODO/FIXME/XXX/HACK 债务（按 git blame 年龄排序）
 *   2. 未使用的导出 / 死代码（用 knip）
 * 输出 JSON 到 stdout。
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const TODO_PATTERN = /\b(TODO|FIXME|XXX|HACK)\b/

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else if (/\.(js|jsx|scss)$/.test(name)) acc.push(full)
  }
  return acc
}

function scanTodos() {
  const files = walk(SRC)
  const todos = []
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const lines = fs.readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (TODO_PATTERN.test(line)) {
        const lineNo = i + 1
        let ageDays = null
        try {
          const blame = execSync(
            `git blame -L ${lineNo},${lineNo} --date=short -- "${rel}"`,
            { cwd: ROOT, encoding: 'utf8' }
          )
          const dateMatch = blame.match(/(\d{4}-\d{2}-\d{2})/)
          if (dateMatch) {
            const written = new Date(dateMatch[1])
            ageDays = Math.floor((Date.now() - written.getTime()) / 86400000)
          }
        } catch (_) { /* ignore */ }
        todos.push({ file: rel, line: lineNo, content: line.trim(), ageDays })
      }
    })
  }
  return todos.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0))
}

function scanDeadCode() {
  try {
    const raw = execSync('npx knip --reporter json', { cwd: ROOT, encoding: 'utf8' })
    return JSON.parse(raw)
  } catch (err) {
    return { error: err.message }
  }
}

function main() {
  const result = {
    scannedAt: new Date().toISOString(),
    todos: scanTodos(),
    deadCode: scanDeadCode()
  }
  process.stdout.write(JSON.stringify(result, null, 2))
}

main()
```

- [ ] **Step 3: Run script**

```bash
node scripts/entropy-scan.js > /tmp/entropy.json
cat /tmp/entropy.json | head -50
```

Expected: JSON output. TODO list may be empty or small; knip may report some dead code.

- [ ] **Step 4: Commit**

```bash
git add scripts/entropy-scan.js package.json yarn.lock
git commit -m "feat(entropy): add weekly scan script (todos + dead-code)"
```

---

## 任务 22：生成 tech-debt MR 脚本

**Files:**
- Create: `scripts/generate-tech-debt-pr.js`

- [ ] **Step 1: Create script**

File: `scripts/generate-tech-debt-pr.js`

```js
#!/usr/bin/env node
/**
 * 把 entropy-scan.js 的 JSON 输出格式化为 markdown，并调用 GitLab API 开 MR。
 *
 * 依赖环境变量（GitLab CI 自动注入）：
 *   - CI_API_V4_URL       (例: https://gitlab.com/api/v4)
 *   - CI_PROJECT_ID
 *   - GITLAB_BOT_TOKEN    (需要在 GitLab 项目 Settings → CI/CD → Variables 里手动配)
 *   - CI_DEFAULT_BRANCH   (通常 develop 或 main)
 */

const fs = require('fs')
const https = require('https')
const { execSync } = require('child_process')

const {
  CI_API_V4_URL,
  CI_PROJECT_ID,
  GITLAB_BOT_TOKEN,
  CI_DEFAULT_BRANCH = 'develop'
} = process.env

if (!CI_API_V4_URL || !CI_PROJECT_ID || !GITLAB_BOT_TOKEN) {
  console.error('缺少环境变量 CI_API_V4_URL / CI_PROJECT_ID / GITLAB_BOT_TOKEN')
  process.exit(1)
}

const scanPath = process.argv[2] || 'entropy.json'
const scan = JSON.parse(fs.readFileSync(scanPath, 'utf8'))

function formatMarkdown(scan) {
  const lines = [
    `# 熵扫描报告 — ${scan.scannedAt.slice(0, 10)}`,
    '',
    '## TODO 债务',
    '',
    scan.todos.length === 0 ? '_无_' : [
      '| 文件:行 | 内容 | 存活天数 |',
      '|---|---|---|',
      ...scan.todos.slice(0, 50).map(t => {
        const age = t.ageDays == null ? '?' : (t.ageDays > 90 ? `${t.ageDays} ⚠️` : t.ageDays)
        const content = t.content.replace(/\|/g, '\\|').slice(0, 80)
        return `| ${t.file}:${t.line} | ${content} | ${age} |`
      })
    ].join('\n'),
    '',
    '## 死代码 / 未使用导出',
    '',
    scan.deadCode.error
      ? `_扫描失败: ${scan.deadCode.error}_`
      : '```json\n' + JSON.stringify(scan.deadCode, null, 2).slice(0, 3000) + '\n```',
    '',
    '---',
    '本 MR 由 `scripts/generate-tech-debt-pr.js` 自动生成。',
    '挑能清理的改掉即可，不强制全部处理。'
  ]
  return lines.join('\n')
}

const body = formatMarkdown(scan)
const date = scan.scannedAt.slice(0, 10)
const branch = `tech-debt/entropy-${date}`
const title = `tech-debt/entropy-report-${date}`

// 1. 在 repo 里创建空分支（用 git + push）
try {
  execSync(`git checkout -b ${branch}`, { stdio: 'inherit' })
  // 把 entropy.json 存进 repo 方便追溯
  execSync(`cp ${scanPath} entropy-${date}.json`, { stdio: 'inherit' })
  execSync(`git add entropy-${date}.json`, { stdio: 'inherit' })
  execSync(`git -c user.email=ci@example.com -c user.name=EntropyBot commit -m "chore(entropy): scan ${date}"`, { stdio: 'inherit' })
  execSync(`git push origin ${branch}`, { stdio: 'inherit' })
} catch (err) {
  console.error('分支创建/推送失败:', err.message)
  process.exit(1)
}

// 2. 调 GitLab API 开 MR
const url = new URL(`${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests`)
const payload = JSON.stringify({
  source_branch: branch,
  target_branch: CI_DEFAULT_BRANCH,
  title,
  description: body,
  remove_source_branch: true
})

const req = https.request({
  method: 'POST',
  hostname: url.hostname,
  path: url.pathname + url.search,
  headers: {
    'PRIVATE-TOKEN': GITLAB_BOT_TOKEN,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let data = ''
  res.on('data', chunk => { data += chunk })
  res.on('end', () => {
    console.log(`GitLab API 返回 ${res.statusCode}`)
    console.log(data)
    if (res.statusCode >= 400) process.exit(1)
  })
})
req.on('error', err => {
  console.error('API 请求失败:', err.message)
  process.exit(1)
})
req.write(payload)
req.end()
```

- [ ] **Step 2: Commit**

```bash
git add scripts/generate-tech-debt-pr.js
git commit -m "feat(entropy): add tech-debt MR generator"
```

---

## 任务 23：添加 entropy-report 到 GitLab CI

**Files:**
- Modify: `.gitlab-ci.yml`

- [ ] **Step 1: Append scheduled job to .gitlab-ci.yml**

Add to the end of `.gitlab-ci.yml`:

```yaml
entropy-report:
  stage: quality
  image: node:18-alpine
  before_script:
    - apk add --no-cache git
    - yarn install --frozen-lockfile
  script:
    - node scripts/entropy-scan.js > entropy.json
    - node scripts/generate-tech-debt-pr.js entropy.json
  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
  artifacts:
    paths:
      - entropy.json
    expire_in: 1 month
```

- [ ] **Step 2: Commit**

```bash
git add .gitlab-ci.yml
git commit -m "ci: add weekly entropy-report scheduled job"
```

- [ ] **Step 3: Configure GitLab schedule (manual)**

**人工步骤，提醒用户执行：**
1. 打开 GitLab 项目 → Settings → CI/CD → Pipeline schedules
2. **Variables:** 添加 `GITLAB_BOT_TOKEN`（value 是一个有 `api` 权限的 project access token，事先在 Settings → Access Tokens 创建）
3. **New schedule:** cron `0 0 * * 1`（每周一 00:00）、target `develop` 分支
4. Save

- [ ] **Step 4: Trigger schedule manually once**

在 GitLab Schedules 页面点击"Play"按钮手动触发一次，验证能产出 tech-debt MR。

---

## 任务 24：更新根 AGENTS.md 的"机械式约束清单"

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Append "机械式约束清单" section**

在根 `AGENTS.md` 的"什么时候改本文件"之前插入：

```markdown
## 机械式约束清单（完整）

### ESLint 规则（自定义）
| 规则 | 级别 | 检查 |
|---|---|---|
| `harness-local/no-raw-axios` | error | 禁止 `import axios from 'axios'`（除 services/xhr/ 内部） |
| `harness-local/service-file-convention` | error | services/<domain>/ 下文件必须 `xxxService.js` + default export |
| `harness-local/store-must-make-observable` | error | `*.Store.js` class 构造器必须 `makeObservable`/`makeAutoObservable` |
| `harness-local/no-cross-store-import` | warn | `*.Store.js` 间禁止 import |
| `harness-local/component-folder-convention` | error | components/ 样式必须 `.module.scss` |
| `harness-local/utils-reuse-hint` | warn | pages/components 内 >5 行 hook 建议抽到 utils/hooks/ |

### 结构化测试（Jest）
| 测试 | 保证 |
|---|---|
| `routes-vs-pages.test.js` | 页面目录 ↔ 路由表 双向一致 |
| `stores-registered.test.js` | 每个 `*.Store.js` 在 `store/index.js` 注册 |
| `services-structure.test.js` | service 命名 + 目录扁平 + default export |
| `components-structure.test.js` | 组件目录结构 + i18n key 对齐 |

### 重复检测
- `jscpd`：总重复率 ≤ 5%（最少 10 行 / 70 token 才计入）

### 熵管理
- 每周一 00:00 自动扫 TODO 债务 + 死代码，开 tech-debt MR

### 执行命令
- 本地：`yarn ci:quality`（一次跑完 lint + structure + dup）
- CI：MR 自动跑 lint / structure / dup 三个并行 job
- 熵扫描：GitLab 定时任务，每周一
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add full mechanical enforcement checklist to root AGENTS.md"
```

---

## 任务 25（可选，推荐）：团队对齐会

**这不是代码任务，是流程任务。**

- [ ] **Step 1: 准备 30 分钟会议议程**

会议大纲：
1. **为什么做这个改造**（5 min）— 参考飞书文档 1.3 节
2. **Harness Engineering 核心思想**（5 min）— 参考飞书文档 1.2 节
3. **现场演示**（10 min）：
   - 打开 IDE，故意写 `import axios from 'axios'`，看 lint 报错
   - 展示 `prompts/add-page.md`，让大家体验用它和 AI 协作加页面
   - 打开 CI 一个成功的 MR，看检查结果
4. **5-10 分钟 Q&A**
5. **5 分钟：约定团队节奏**
   - 谁 pick tech-debt MR
   - 谁是"规则守护人"（规则坏了谁来修）

- [ ] **Step 2: 发出会议邀请，拉团队**

- [ ] **Step 3: 会后把会议纪要放到团队知识库**

---

## 最终验收 checklist

改造完成后逐项确认：

- [ ] 根 `AGENTS.md` 和 7 个子 `AGENTS.md` 都存在且内容正确
- [ ] `yarn lint` 通过，无 error
- [ ] `yarn test:structure` 通过
- [ ] `yarn dup:check` 通过，重复率 < 5%
- [ ] `yarn ci:quality` 一条命令能跑完所有检查
- [ ] 故意写违规代码，IDE 和 pre-commit 都能拦住
- [ ] 开一个测试 MR，GitLab CI 三个 quality job 都跑起来且通过
- [ ] GitLab 定时任务已配置，手动触发一次能成功产出 tech-debt MR
- [ ] `prompts/` 4 个模板都写好，团队有人按它做过至少一次
- [ ] 团队对齐会已召开
