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
