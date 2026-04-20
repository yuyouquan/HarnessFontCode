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
    // 只在 src/store/<name>.Store.js 文件内生效（index.js 豁免）
    if (!/(?:^|\/)src\/store\/[^/]+\.Store\.js$/.test(filename)) return {}

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
