const getFilename = require('../lib/getFilename')

function isMakeObservableCall(expr) {
  if (!expr || expr.type !== 'CallExpression') return false
  const callee = expr.callee
  if (callee.type !== 'Identifier') return false
  return callee.name === 'makeObservable' || callee.name === 'makeAutoObservable'
}

/**
 * Walks an AST subtree and returns true if any ExpressionStatement's
 * direct expression is a call to makeObservable / makeAutoObservable.
 * This allows the call to be nested in if/try/for blocks inside the
 * constructor body (still a legitimate pattern), while not matching
 * calls in nested functions (e.g. helper methods) or arguments.
 */
function containsMakeObservableCall(node) {
  if (!node) return false
  if (Array.isArray(node)) return node.some(containsMakeObservableCall)

  if (node.type === 'ExpressionStatement' && isMakeObservableCall(node.expression)) {
    return true
  }

  // Do not descend into nested functions/classes — those are their own scope.
  if (
    node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'ClassDeclaration' ||
    node.type === 'ClassExpression'
  ) {
    return false
  }

  // Recurse into child nodes (covers BlockStatement, IfStatement, TryStatement, etc.)
  for (const key in node) {
    if (key === 'parent' || key === 'loc' || key === 'range') continue
    const child = node[key]
    if (child && typeof child === 'object') {
      if (containsMakeObservableCall(child)) return true
    }
  }
  return false
}

function hasMakeObservableCall(classNode) {
  const ctor = classNode.body.body.find(
    m => m.type === 'MethodDefinition' && m.kind === 'constructor'
  )
  if (!ctor) return false
  return containsMakeObservableCall(ctor.value.body)
}

function checkClass(context, node) {
  if (!hasMakeObservableCall(node)) {
    context.report({
      node,
      messageId: 'missing',
      data: { name: node.id ? node.id.name : '<anonymous>' }
    })
  }
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
      ClassDeclaration(node) { checkClass(context, node) },
      ClassExpression(node) { checkClass(context, node) }
    }
  }
}
