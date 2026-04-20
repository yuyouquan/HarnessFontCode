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
