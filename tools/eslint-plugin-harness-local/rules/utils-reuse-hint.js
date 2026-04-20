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
      considerExtract: '自定义 hook "{{name}}" 超过 {{lines}} 行，考虑抽到 src/utils/hooks/。详见 src/utils/AGENTS.md'
    }
  },
  create(context) {
    const filename = getFilename(context)
    // 只在 pages/ 或 components/ 下检查（不检查 utils/ 自身）
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
          data: { name, lines: MIN_LINES }
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
          // 对箭头函数/函数表达式，用 init 节点的 loc 计算行数，起始位置从变量名开始
          check(node.init, node.id && node.id.name)
        }
      }
    }
  }
}
