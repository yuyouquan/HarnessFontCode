const { RuleTester } = require('eslint')
const rule = require('../rules/no-cross-store-import')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-cross-store-import', rule, {
  valid: [
    {
      code: 'import { makeAutoObservable } from \'mobx\'',
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: 'import helper from \'@/utils\'',
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: 'import UserStore from \'./user.Store\'',
      filename: '/abs/src/store/index.js'
    }
  ],
  invalid: [
    {
      code: 'import UserStore from \'./user.Store\'',
      filename: '/abs/src/store/app.Store.js',
      errors: [{ messageId: 'crossStore' }]
    },
    {
      code: 'import UserStore from \'./user.Store.js\'',
      filename: '/abs/src/store/app.Store.js',
      errors: [{ messageId: 'crossStore' }]
    },
    {
      code: 'import \'./other.Store\'',
      filename: '/abs/src/store/app.Store.js',
      errors: [{ messageId: 'crossStore' }]
    },
    {
      code: 'import SelfStore from \'./user.Store\'',
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'crossStore' }]
    }
  ]
})
