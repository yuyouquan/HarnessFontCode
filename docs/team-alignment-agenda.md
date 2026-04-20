# 团队对齐会议程 — Harness Engineering 改造推广

**时长：** 30 分钟
**参与者：** 前端团队全员（5-10 人）
**主持：** 改造负责人（你）

## 会前准备（主持人提前做）

- [ ] 提前一天把**飞书文档**（https://www.feishu.cn/docx/NV0Kd0RlQogDSIx7TuWcUv75nfh）发到团队群，请大家粗略过一遍（5-10 分钟）
- [ ] 把仓库切到 `feat/harness-engineering` 分支（改造完成态）或确认已合到 `develop`
- [ ] 确认以下命令在 Demo 机器上可以跑通：
  - `yarn ci:quality`
  - `yarn test:structure`
  - `yarn lint`
- [ ] 准备一个"故意违规"的示例文件（例如 `src/pages/Demo/index.js` 写 `import axios from 'axios'`），Demo 时现场打开给大家看 IDE 标红
- [ ] 准备打开 GitLab 一个已跑过 CI 的 MR 截图

## 议程

### 0. 开场（2 分钟）
- 本次会议目的：**让大家知道仓库新增了什么约束、为什么、怎么配合**
- 不是培训 AI，是培训**所有开发**（AI 工具用不用都受影响）

---

### 1. 为什么做这个改造（5 分钟）
参考飞书文档 1.3 节的 4 个痛点：

- **③ 服务层乱写** — 不用 xhr 封装，自己 new axios
- **④ MobX Store 不规范** — 漏 `makeObservable`
- **⑥ 组件目录混乱** — PascalCase 与 camelCase 混用
- **⑧ 重复造轮子** — utils/ 形同虚设

> **一句话**：以前靠口头约定 + code review 挑毛病，现在改成规则自动检查。

---

### 2. Harness Engineering 核心思想（5 分钟）
参考飞书文档 1.2 节的六原则，重点讲 2 条：

- **原则 ②：地图而不是手册** — 仓库根 `AGENTS.md` 40 行，子目录各 30-50 行，分层披露
- **原则 ③：机械式约束** — 规则写进 ESLint / Jest / jscpd / CI，坏代码写不进主分支

> **给完全没接触 AI 的同事**：这些规则对你写代码也有好处 —— 新同事或 AI 接手都能无缝衔接。

---

### 3. 现场演示（10 分钟）

#### 演示 A：IDE 实时报错（3 分钟）
- 打开 `src/pages/Home/index.js`
- 加一行 `import axios from 'axios'`
- → 立刻看到 ESLint 红波浪线："禁止直接导入 axios，必须从 @/services/xhr 引入封装好的实例。详见 src/services/AGENTS.md#契约"
- 点击报错信息 → 打开 `src/services/AGENTS.md` → 展示契约

#### 演示 B：提交时拦截（2 分钟）
- 保留上一步的违规代码，尝试 `git commit`
- → pre-commit hook 拦截，显示 lint-staged 失败
- 改对 → commit 成功

#### 演示 C：CI 三个 job（2 分钟）
- 打开 GitLab 一个已跑的 MR，展示 `lint` / `structure-tests` / `duplication` 三个并行 job 的结果
- 讲一下：MR 合并前必须全绿

#### 演示 D：Prompt 模板（3 分钟）
- 打开 `prompts/add-page.md`
- 现场演示复制里面的提示词，替换 `<PageName>` 为 `TeamDemo`，交给 AI（Claude Code / Cursor / Copilot）
- 让大家看 AI 一次性把文件、路由、i18n key 都改对（或者至少知道怎么配合）

---

### 4. 约束清单速览（3 分钟）

打开根 `AGENTS.md` 的"机械式约束清单"章节，快速过一遍：
- 6 条 ESLint 规则（3 error + 3 warn）
- 4 个结构化测试
- jscpd 5% 阈值
- 周度熵扫描 MR

**重点强调**：首版**偏宽松**
- warn 级不拦提交（只标黄）
- 允许 `// eslint-disable-next-line` 逃生口（不强制写原因）
- 预计 2 个月后评估升级严格度

---

### 5. 团队节奏约定（3 分钟）

讨论并达成共识：

- **Q1**：谁负责 pick 每周一的 tech-debt MR？
  - 建议：轮值（每周 1 人）或认领制
- **Q2**：发现某条规则太严/太松/误报频繁，怎么反馈？
  - 建议：在团队群提，由"规则守护人"统一评估修改
- **Q3**：谁是"规则守护人"（规则坏了/要改谁来做）？
  - 建议：改造负责人 + 1 位 backup
- **Q4**：ESLint 报错 Agent 改不掉时怎么办？
  - 建议：读错误里的 `src/xxx/AGENTS.md` 链接；仍解决不了就 team 里提

---

### 6. Q&A（2 分钟）

常见问题（小白 FAQ，参考飞书文档第八章）：
- "我从没用过 AI，这些规则影响我吗？" → 会，但都是普通 ESLint/CI，不是 AI 特有的
- "严不严格？会不会影响开发效率？" → 首版宽松，后续视情况升级
- "我能绕过吗？" → 能（`eslint-disable-next-line`），但建议写原因注释

---

## 会后行动

- [ ] 本次会议纪要发团队群
- [ ] 把飞书文档链接 pin 在群公告
- [ ] 第一个 tech-debt MR 出现后（下周一）主动 @全员 看一下
- [ ] 2 周后收集一次反馈，决定是否调整规则严格度
- [ ] 3 个月后评估：是否升级 `no-cross-store-import` 从 warn 到 error

---

## 备忘

- 飞书文档链接：https://www.feishu.cn/docx/NV0Kd0RlQogDSIx7TuWcUv75nfh
- 本地 spec：`docs/superpowers/specs/2026-04-20-harness-engineering-transformation-design.md`
- 实施计划：`docs/superpowers/plans/2026-04-20-harness-engineering-transformation.md`
- 仓库根 AGENTS.md：`AGENTS.md`
