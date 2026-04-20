# src/store AGENTS.md

## 契约
MobX 6 状态管理。每个 Store 是一个独立类，通过 `store/index.js` 汇总为 rootStore 注入到组件。

## 新增一个 Store 的步骤
1. 创建 `src/store/<name>.Store.js`（**文件名必须以 `.Store.js` 结尾**）
2. 定义 class，命名 `XxxStore`（PascalCase）
3. **构造器必须调用 `makeAutoObservable(this)` 或 `makeObservable(this, {...})`**
4. **在 `src/store/index.js` 里 import 并注册到 rootStore**（L3 测试兜底）

## 文件内容示例
```js
import { makeAutoObservable } from 'mobx'

class DeviceStore {
  list = []
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  setList(list) {
    this.list = list
  }

  async fetchList() {
    this.loading = true
    try {
      const { data } = await http.get('/api/devices')
      this.setList(data)
    } finally {
      this.loading = false
    }
  }
}

export default DeviceStore
```

## 禁止
- 禁止构造器不调 `makeObservable` / `makeAutoObservable`（规则 `harness-local/store-must-make-observable`）
- 禁止 Store 间直接 import（规则 `harness-local/no-cross-store-import`，**首版 warn**）
  - 需要访问其他 Store 的数据：通过 rootStore 注入，如 `rootStore.userStore.name`
- 禁止 Store 文件不在 `store/index.js` 注册（L3 `stores-registered.test.js` 兜底）

## 正例
- `src/store/user.Store.js`
- `src/store/app.Store.js`
