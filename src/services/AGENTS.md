# src/services AGENTS.md

## 契约
本目录负责所有 HTTP 调用。中心化的 axios 实例在 `services/xhr/`，包含 token 刷新、错误处理、环境变量 baseURL。**其他任何地方都必须走这个实例**。

## 目录结构
```
services/
├── xhr/              # axios 实例（不要改动）
│   ├── index.js
│   └── code.js
├── user/             # 按领域分组
│   └── loginService.js
├── dashboard/
├── deviceDetails/
└── productDetails/
```

## 新增一个服务调用的步骤
1. 按业务领域选目录（`user/` `dashboard/` ...），不存在就新建 domain 目录
2. 文件命名 **`xxxService.js`**（驼峰 + Service 后缀）
3. 文件顶部 `import http from '@/services/xhr'`（**只能这样导入**）
4. `export default` 一个对象或函数集

## 文件内容示例
```js
import http from '@/services/xhr'

export default {
  fetchList(params) {
    return http.get('/api/device/list', { params })
  },
  create(payload) {
    return http.post('/api/device', payload)
  }
}
```

## 禁止
- 禁止 `import axios from 'axios'`（规则 `harness-local/no-raw-axios`，仅 `services/xhr/` 内部豁免）
- 禁止文件不以 `Service.js` 结尾（规则 `harness-local/service-file-convention`）
- 禁止在 domain 目录下建子目录（结构测试会检查）
