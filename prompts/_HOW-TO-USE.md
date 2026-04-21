# 怎么用 prompts/ 模板 —— 一分钟速成

> 这里解释：拿到一个产品需求，你应该给 AI 发什么话。

## 一句话公式

```
【模板原文】 + 【你的业务补充】 = 完整 prompt
```

- **模板原文**：从 `prompts/add-page.md` / `add-service.md` / `add-store.md` / `add-component.md` 里复制"## 提示词"那一段，**一字不改**。
- **业务补充**：你自己在模板末尾追加 4 块（见下）。

## 选哪个模板？（速查）

| 需求性质 | 用哪个 | 备注 |
|---|---|---|
| 新增一整个路由页面 | `add-page.md` | 最常用。里面会连带改 router + i18n |
| 只是给某个后端接口封装 JS 调用 | `add-service.md` | 通常在做 page 时 AI 会一起带上；单独用于补 API |
| 做一块跨页面共享的全局状态 | `add-store.md` | 只在状态真的跨页面时建 |
| 做一个多处复用的组件 | `add-component.md` | 业务组件**不走**这里，留在对应 page 目录里 |

## 业务补充的 4 块（填空式）

在复制来的模板末尾追加：

```markdown
## 业务需求

### ① 一句话功能简介
[例：这是 XX 管理后台，展示 YY 列表并支持增删改查]

### ② 位置
- PageName: [PascalCase，如 DeviceList]
- 路由: [kebab-case，如 /device-list]
- i18n key 前缀: [如 device.*]
- 菜单 key: [如 menu.device.list]

### ③ UI 说明（5-10 条足够，AI 会用 Antd 合理默认）
[例如]
- 顶部工具栏：左搜索框，右新增按钮
- 中间 Antd Table，列：名称 / 型号 / 状态(Tag) / 时间 / 操作
- 操作列：编辑、删除（用 Popconfirm 二次确认）
- 新增/编辑：弹 Modal 表单，字段 ...

### ④ 数据 / 接口
- 需要的 API（方法名 + HTTP 方法 + 路径 + 参数）
- 要不要 Store？如不需要说明用 useState
- 所有 HTTP 走 @/services/xhr（模板原文已声明，不必重复但可强调）

## 验收
写完跑 `yarn ci:quality`。
报错跟着错误里的 "详见 xxx/AGENTS.md" 修。
```

## 完整范例：设备列表 CRUD

可以参考仓库里的 `src/pages/DeviceList/` + `src/services/device/` 这套现成实现。
对应的 prompt 等同于：
- 复制 `prompts/add-page.md` 的"## 提示词"
- 末尾追加上面的 4 块，填入 `DeviceList` / `/device-list` / `device.*` / 5 个 API / 不建 Store

## 心智模型

> **你对 AI 说的话 = 产品对你说的话 + 5 行位置/接口补充**
> 剩下的 AI 配合 AGENTS.md + 仓库现有约定自己搞定。

## 常见坑

| 坑 | 怎么避免 |
|---|---|
| AI 生成了代码但 CI 红 | 让它跑 `yarn ci:quality`，它会根据报错自己修 |
| AI 建了多余的 Store | 你在 ④ 数据里明确说"不需要 Store，用 useState" |
| i18n 只加了一份 | 让它跑 `yarn test:structure`，`components-structure` 会失败并指出哪一侧缺 key |
| AI 直接 `import axios` | `harness-local/no-raw-axios` 会红；AI 看到错误信息会改成 `@/services/xhr` |
| 业务组件被塞进 `src/components/` | 提醒 AI："业务组件放对应 page 目录里，不要放 components/" |

## 进阶：一次描述做多个子任务

同一个 prompt 可以让 AI 一次性做 **service + page + i18n + router**。不必拆成 4 次发给 AI。
AI 收到"4 块描述"后会**自己安排顺序**（先 service → 再 page → 再 router → 最后 i18n），你只需最后看 `yarn ci:quality` 绿灯。
