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
