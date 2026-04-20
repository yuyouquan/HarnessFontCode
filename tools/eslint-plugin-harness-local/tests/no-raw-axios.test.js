const { RuleTester } = require('eslint')
const rule = require('../rules/no-raw-axios')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-raw-axios', rule, {
  valid: [
    {
      code: 'import http from \'@/services/xhr\'',
      filename: '/abs/src/pages/Home/index.js'
    },
    {
      code: 'import axios from \'axios\'',
      filename: '/abs/src/services/xhr/index.js'
    }
  ],
  invalid: [
    {
      code: 'import axios from \'axios\'',
      filename: '/abs/src/pages/Home/index.js',
      errors: [{ messageId: 'banned' }]
    },
    {
      code: 'import { AxiosInstance } from \'axios\'',
      filename: '/abs/src/services/user/loginService.js',
      errors: [{ messageId: 'banned' }]
    }
  ]
})
