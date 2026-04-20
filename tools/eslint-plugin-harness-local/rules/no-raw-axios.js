const getFilename = require('../lib/getFilename')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止直接导入 axios，必须从 @/services/xhr 引入封装好的实例'
    },
    schema: [],
    messages: {
      banned: '禁止直接导入 axios，必须从 @/services/xhr 引入封装好的实例。详见 src/services/AGENTS.md#契约'
    }
  },
  create(context) {
    const filename = getFilename(context)
    if (/(^|\/)src\/services\/xhr\//.test(filename)) return {}

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'axios') {
          context.report({ node, messageId: 'banned' })
        }
      }
    }
  }
}
