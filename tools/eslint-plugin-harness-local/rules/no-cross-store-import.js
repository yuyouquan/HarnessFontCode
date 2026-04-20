const getFilename = require('../lib/getFilename')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'MobX Store 间禁止直接 import，应通过 rootStore 注入'
    },
    schema: [],
    messages: {
      crossStore: 'Store 间不能直接 import "{{target}}"，要通过 rootStore 注入。详见 src/store/AGENTS.md#禁止'
    }
  },
  create(context) {
    const filename = getFilename(context)
    // 只在 src/store/<name>.Store.js 文件内生效（index.js 因不以 .Store.js 结尾自动豁免）。
    // 暂不覆盖子目录（src/store/sub/x.Store.js），如未来引入嵌套 store 需修改此正则。
    if (!/\/src\/store\/[^/]+\.Store\.js$/.test(filename)) return {}

    // 注：仅检查 static import；动态 import('./x.Store') 与 CommonJS require() 不覆盖（属罕见场景）。
    return {
      ImportDeclaration(node) {
        const src = node.source.value
        // 匹配相对路径指向其他 .Store 文件（带或不带 .js 后缀）
        if (/^\.\/[^/]+\.Store(\.js)?$/.test(src)) {
          context.report({
            node,
            messageId: 'crossStore',
            data: { target: src }
          })
        }
      }
    }
  }
}
