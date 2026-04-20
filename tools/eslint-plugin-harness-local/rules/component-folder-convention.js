const getFilename = require('../lib/getFilename')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'components 目录下样式必须使用 .module.scss'
    },
    schema: [],
    messages: {
      nonModuleScss: '组件样式必须使用 .module.scss，禁止导入普通 .scss/.css。详见 src/components/AGENTS.md'
    }
  },
  create(context) {
    const filename = getFilename(context)
    // 只在 src/components/ 目录下检查
    if (!/\/src\/components\//.test(filename)) return {}

    return {
      ImportDeclaration(node) {
        const src = node.source.value
        // 只检查本地样式文件（相对路径）
        if (!/^\.\.?\//.test(src)) return
        // 同时接受 .module.scss 和 .module.css（CSS Modules 两种扩展名皆合法）
        if (/\.module\.(scss|css)$/.test(src)) return
        if (/\.(scss|css)$/.test(src)) {
          context.report({ node, messageId: 'nonModuleScss' })
        }
      }
    }
  }
}
