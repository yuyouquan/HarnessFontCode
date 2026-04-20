# 加一个新 MobX Store

## 何时使用
需要新增一块独立的全局状态（如设备列表、用户设置、应用配置）。

## 使用方式
复制下面的提示词给 AI，替换 `<Name>`（PascalCase，如 `Device`）和 `<name>`（小写，如 `device`）。

---

## 提示词

请新建 MobX Store `<Name>Store` 并注册到 rootStore：

### 背景
- MobX 6 状态管理
- 每个 Store 必须调 `makeAutoObservable(this)` 或 `makeObservable(this, {...})`
- 契约详情：`src/store/AGENTS.md`

### 步骤
1. 创建 `src/store/<name>.Store.js`（**文件名必须以 `.Store.js` 结尾**）
2. 文件内容范式：

```js
import { makeAutoObservable } from 'mobx'

class <Name>Store {
    // 状态字段
    list = []
    loading = false

    constructor() {
        makeAutoObservable(this)  // 必调，漏了 ESLint 会报错
    }

    // action：改状态
    setList(list) {
        this.list = list
    }

    // async action：调接口 + 改状态
    async fetchList() {
        this.loading = true
        try {
            // 注：从 service 层而不是直接 axios
            // const data = await <name>Service.fetchList()
            // this.setList(data)
        } finally {
            this.loading = false
        }
    }
}

export default <Name>Store
```

3. 在 `src/store/index.js` 里 import 并实例化：

```js
import <Name>Store from './<name>.Store'

// 在 RootStore 构造器里加：
this.<name>Store = new <Name>Store()
```

### 禁止
- 禁止漏 `makeObservable` / `makeAutoObservable`（`harness-local/store-must-make-observable` error）
- 禁止 Store 间直接 `import`（`harness-local/no-cross-store-import` warn —— 要通过 rootStore 访问别的 Store）
- 禁止文件名不以 `.Store.js` 结尾（L3 测试不会检测它）
- 禁止 Store 文件不在 `store/index.js` 注册（L3 `stores-registered` 会失败）

### 验收
```bash
yarn lint
yarn test:structure
```

### 参考
- 契约详情：`src/store/AGENTS.md`
- 正例：`src/store/user.Store.js`、`src/store/app.Store.js`
