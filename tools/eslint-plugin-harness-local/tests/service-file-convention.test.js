const { RuleTester } = require('eslint')
const rule = require('../rules/service-file-convention')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('service-file-convention', rule, {
  valid: [
    {
      code: "export default { fetch() {} }",
      filename: '/abs/src/services/user/loginService.js'
    },
    {
      code: "export default function foo(){}",
      filename: '/abs/src/services/dashboard/chartService.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/services/xhr/index.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/services/xhr/code.js'
    },
    {
      code: "export default {}",
      filename: '/abs/src/pages/Home/index.js'
    }
  ],
  invalid: [
    {
      code: "export default {}",
      filename: '/abs/src/services/user/login.js',
      errors: [{ messageId: 'badName' }]
    },
    {
      code: "export const foo = 1",
      filename: '/abs/src/services/user/loginService.js',
      errors: [{ messageId: 'noDefault' }]
    },
    {
      code: "export const foo = 1",
      filename: '/abs/src/services/user/login.js',
      errors: [
        { messageId: 'badName' },
        { messageId: 'noDefault' }
      ]
    },
    {
      code: "export default {}",
      filename: '/abs/src/services/user/Service.js',
      errors: [{ messageId: 'badName' }]
    }
  ]
})
