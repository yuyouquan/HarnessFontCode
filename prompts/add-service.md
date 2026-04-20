# 加一个新服务

## 何时使用
需要在本应用中新增一个或一组 API 调用。

## 使用方式
复制下面的提示词给 AI，替换 `<domain>` 和 `<name>Service`。

---

## 提示词

请在 `src/services/<domain>/<name>Service.js` 新增 API 调用：

### 背景
- 所有 HTTP 调用必须走 `@/services/xhr`（已封装 token 刷新、错误处理、baseURL 多环境切换）
- 契约详情：`src/services/AGENTS.md`

### 步骤
1. 如果 `<domain>` 目录不存在，先 `mkdir src/services/<domain>`
2. 创建文件 `src/services/<domain>/<name>Service.js`（**文件名必须以 `Service.js` 结尾**）
3. 文件顶部：`import http from '@/services/xhr'`（**只能这样导入**）
4. `export default` 一个对象，键是函数名，值是函数：

```js
import http from '@/services/xhr'

export default {
  fetchList(params) {
    return http.get('/api/<domain>/list', { params })
  },
  create(payload) {
    return http.post('/api/<domain>', payload)
  },
  update(id, payload) {
    return http.put(`/api/<domain>/${id}`, payload)
  },
  remove(id) {
    return http.delete(`/api/<domain>/${id}`)
  }
}
```

### 禁止
- 禁止 `import axios from 'axios'`（`harness-local/no-raw-axios` error）
- 禁止 `import http from 'fetch'` 或直接用 `window.fetch` / `XMLHttpRequest`
- 禁止文件命名不以 `Service.js` 结尾（`login.js` ❌，`loginService.js` ✅）
- 禁止在 `services/<domain>/` 下建子目录（L3 结构测试 `services-structure` 会失败）
- 禁止缺失 `export default`（ESLint 规则 `service-file-convention` 会报错）

### 验收
```bash
yarn lint
yarn test:structure
```

### 参考
- 契约详情：`src/services/AGENTS.md`
- xhr 实现：`src/services/xhr/index.js`
- 正例：`src/services/user/loginService.js`
