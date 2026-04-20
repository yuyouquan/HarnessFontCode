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
