const getFilename = require('../lib/getFilename')

function hasMakeObservableCall(classNode) {
  const ctor = classNode.body.body.find(
    m => m.type === 'MethodDefinition' && m.kind === 'constructor'
  )
  if (!ctor) return false
  const stmts = ctor.value.body.body
  return stmts.some(s => {
    if (s.type !== 'ExpressionStatement') return false
    const expr = s.expression
    if (expr.type !== 'CallExpression') return false
    const callee = expr.callee
    if (callee.type !== 'Identifier') return false
    return callee.name === 'makeObservable' || callee.name === 'makeAutoObservable'
  })
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '*.Store.js 中每个 class 的构造器必须调用 makeObservable 或 makeAutoObservable'
    },
    schema: [],
    messages: {
      missing: 'MobX Store 类 "{{name}}" 的构造器必须调用 makeAutoObservable(this) 或 makeObservable。详见 src/store/AGENTS.md'
    }
  },
  create(context) {
    const filename = getFilename(context)
    if (!/\.Store\.js$/.test(filename)) return {}

    return {
      ClassDeclaration(node) {
        if (!hasMakeObservableCall(node)) {
          context.report({
            node,
            messageId: 'missing',
            data: { name: node.id ? node.id.name : '<anonymous>' }
          })
        }
      }
    }
  }
}
