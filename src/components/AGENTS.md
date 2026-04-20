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
