const getFilename = require('../lib/getFilename')

const MIN_LINES = 5

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '超过 5 行的自定义 hook 建议抽到 src/utils/hooks/'
    },
    schema: [],
    messages: {
      considerExtract: '自定义 hook "{{name}}" 共 {{lines}} 行（阈值 {{threshold}}），考虑抽到 src/utils/hooks/。详见 src/utils/AGENTS.md'
    }
  },
  create(context) {
    const filename = getFilename(context)
    if (!/\/src\/(pages|components)\//.test(filename)) return {}

    function check(node, name) {
      if (!name || !/^use[A-Z]/.test(name)) return
      const loc = node.loc
      if (!loc) return
      const lines = loc.end.line - loc.start.line + 1
      if (lines > MIN_LINES) {
        context.report({
          node,
          messageId: 'considerExtract',
          data: { name, lines, threshold: MIN_LINES }
        })
      }
    }

    return {
      FunctionDeclaration(node) {
        check(node, node.id && node.id.name)
      },
      VariableDeclarator(node) {
        if (
          node.init &&
          (node.init.type === 'ArrowFunctionExpression' ||
           node.init.type === 'FunctionExpression')
        ) {
          // 使用 VariableDeclarator 的 loc（含变量名），与 FunctionDeclaration 保持一致
          check(node, node.id && node.id.name)
        }
      }
    }
  }
}
