# 加一个新页面

## 何时使用
需要在本微应用中新增一个路由页面。

## 使用方式
复制下面的提示词给 AI，把 `<PageName>`、`<kebab-case>`、`<intl-key>` 替换成你的值。

---

## 提示词

你要在这个 qiankun 子应用中新增一个页面 `<PageName>`（例如 `DeviceList`）。严格按以下步骤，不要跳步：

### 背景
- React 18 + MobX + react-intl + qiankun 微前端模板
- 所有约定见根目录 `AGENTS.md` 和 `src/pages/AGENTS.md`

### 步骤
1. 创建 `src/pages/<PageName>/index.js`，组件用 PascalCase 命名，`export default`
2. 如需样式，同目录加 `index.module.scss`（**必须 module**）
3. 在 `src/router/config.js` 中：
   - 顶部加 `const <PageName> = lazy(() => import('@/pages/<PageName>'))`
   - `routerItems` 数组中新增：
     ```js
     {
       path: '/<kebab-case>',
       title: '<菜单标题>',
       component: <PageName>,
       key: '<PageName>',
       isShow: true
     }
     ```
4. 在 `src/i18n/en-US.js` 和 `src/i18n/zh-CN.js` **两份都加** `<intl-key>`（缺一份 CI 会失败）
5. 读 MobX store：用 `useStore()` hook（从 `@/store` 导入）
6. 调接口：service 放 `src/services/<domain>/xxxService.js`，从 `@/services/xhr` 导入 http 实例

### 禁止
- 禁止 `import axios from 'axios'`（`harness-local/no-raw-axios` 会拦）
- 禁止写中文字面量，必须走 `<FormattedMessage id="..." />` 或 `useIntl()`
- 禁止新建 store 却不在 `src/store/index.js` 注册（L3 结构测试会失败）

### 验收
写完后请按顺序跑这三个命令并确认全过：
```bash
yarn lint
yarn test:structure
yarn dup:check
```
或一条 `yarn ci:quality` 跑完全部。

### 参考
- 契约详情：`src/pages/AGENTS.md`
- 路由约定：`src/router/AGENTS.md`
- 正例：`src/pages/Home/index.js`
