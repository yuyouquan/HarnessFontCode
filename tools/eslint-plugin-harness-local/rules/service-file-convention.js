const getFilename = require('../lib/getFilename')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'services/<domain>/ 下的文件命名必须为 xxxService.js 且 export default'
    },
    schema: [],
    messages: {
      badName: '服务文件命名必须以 Service.js 结尾（例：loginService.js）。详见 src/services/AGENTS.md',
      noDefault: '服务文件必须 export default。详见 src/services/AGENTS.md'
    }
  },
  create(context) {
    const filename = getFilename(context)
    // 只匹配 src/services/<domain>/<file>.js（两级深度），排除 xhr 豁免
    const match = filename.match(/(?:^|\/)src\/services\/([^/]+)\/([^/]+)\.js$/)
    if (!match) return {}
    const [, domain, base] = match
    if (domain === 'xhr') return {}

    let hasDefault = false

    return {
      ExportDefaultDeclaration() { hasDefault = true },
      'Program:exit'(node) {
        if (!/\wService$/.test(base)) {
          context.report({ node, messageId: 'badName' })
        }
        if (!hasDefault) {
          context.report({ node, messageId: 'noDefault' })
        }
      }
    }
  }
}
