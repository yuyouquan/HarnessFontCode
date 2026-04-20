const { RuleTester } = require('eslint')
const rule = require('../rules/utils-reuse-hint')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('utils-reuse-hint', rule, {
  valid: [
    {
      code: 'function useFoo() { return 1 }',
      filename: '/abs/src/utils/hooks/useFoo.js'
    },
    {
      code: 'function useLocal() { return 1 }',
      filename: '/abs/src/pages/Home/index.js'
    },
    {
      code: 'function nonHook() {\n  const a = 1\n  const b = 2\n  const c = 3\n  const d = 4\n  const e = 5\n  return a + b + c + d + e\n}',
      filename: '/abs/src/pages/Home/index.js'
    }
  ],
  invalid: [
    {
      code: 'function useBig() {\n  const a = 1\n  const b = 2\n  const c = 3\n  const d = 4\n  const e = 5\n  return a + b + c + d + e\n}',
      filename: '/abs/src/pages/Home/index.js',
      errors: [{ messageId: 'considerExtract' }]
    },
    {
      code: 'const useArrow = () => {\n  const a = 1\n  const b = 2\n  const c = 3\n  const d = 4\n  const e = 5\n  return a + b + c + d + e\n}',
      filename: '/abs/src/components/MyBtn/index.js',
      errors: [{ messageId: 'considerExtract' }]
    }
  ]
})
