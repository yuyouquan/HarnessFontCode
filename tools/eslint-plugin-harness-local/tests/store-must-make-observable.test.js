const { RuleTester } = require('eslint')
const rule = require('../rules/store-must-make-observable')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('store-must-make-observable', rule, {
  valid: [
    {
      code: `
        import { makeAutoObservable } from 'mobx'
        class UserStore { constructor(){ makeAutoObservable(this) } }
      `,
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: `
        import { makeObservable, observable } from 'mobx'
        class AppStore { constructor(){ makeObservable(this, { name: observable }) } }
      `,
      filename: '/abs/src/store/app.Store.js'
    },
    {
      code: 'class NotAStore {}',
      filename: '/abs/src/utils/helper.js'
    },
    {
      code: `
        class UserStore {
          constructor() {
            if (someCondition()) {
              makeAutoObservable(this)
            }
          }
        }
      `,
      filename: '/abs/src/store/user.Store.js'
    },
    {
      code: `
        const UserStore = class {
          constructor() { makeAutoObservable(this) }
        }
      `,
      filename: '/abs/src/store/user.Store.js'
    }
  ],
  invalid: [
    {
      code: 'class UserStore { constructor(){ this.name = \'x\' } }',
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    },
    {
      code: 'class UserStore {}',
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    },
    {
      code: `
        class UserStore {
          init() { makeAutoObservable(this) }
        }
      `,
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    },
    {
      code: `
        const UserStore = class {
          constructor() { this.name = 'x' }
        }
      `,
      filename: '/abs/src/store/user.Store.js',
      errors: [{ messageId: 'missing' }]
    }
  ]
})
