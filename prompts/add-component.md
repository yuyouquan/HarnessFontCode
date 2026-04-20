# 加一个通用组件

## 何时使用
需要新增一个**多处复用**的通用组件。业务组件（只在某个页面用到的）应该放在 `src/pages/<PageName>/` 内部，不要放到 `components/`。

## 使用方式
复制下面的提示词给 AI，替换 `<ComponentName>`（必须 PascalCase，如 `EmptyState`）。

---

## 提示词

请在 `src/components/<ComponentName>/` 新增一个通用组件：

### 背景
- 组件目录 PascalCase，每个组件独立目录
- 样式必须是 CSS Modules（`.module.scss`）
- 契约详情：`src/components/AGENTS.md`

### 步骤
1. 创建目录 `src/components/<ComponentName>/`（**PascalCase**）
2. 创建 `src/components/<ComponentName>/index.js`：

```jsx
import React from 'react'
import styles from './index.module.scss'

const <ComponentName> = (props) => {
    const { title, children } = props
    return (
        <div className={styles.wrapper}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.body}>{children}</div>
        </div>
    )
}

export default <ComponentName>
```

3. 如需样式，创建 `src/components/<ComponentName>/index.module.scss`：

```scss
.wrapper {
    display: flex;
    flex-direction: column;
}

.title {
    font-weight: 600;
}

.body {
    flex: 1;
}
```

4. 文件内**只定义一个组件**（ESLint `react/no-multi-comp` 会拦多组件）

### 禁止
- 禁止目录小写 / camelCase（新组件必须 PascalCase；`imgIcon` / `forbidden` / `loading` / `notFound` 是历史遗留，不要新增同类）
- 禁止 `import './xxx.scss'` 非 module 样式（`harness-local/component-folder-convention` error）
- 禁止 `import './xxx.css'`（同上）
- 禁止一个文件多个组件定义

### 验收
```bash
yarn lint
yarn test:structure
```

### 参考
- 契约详情：`src/components/AGENTS.md`
- 正例：`src/components/Authorized/index.js`
