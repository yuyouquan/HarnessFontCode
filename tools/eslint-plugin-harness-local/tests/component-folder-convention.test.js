const { RuleTester } = require('eslint')
const rule = require('../rules/component-folder-convention')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  }
})

ruleTester.run('component-folder-convention', rule, {
  valid: [
    {
      code: 'import styles from \'./index.module.scss\'',
      filename: '/abs/src/components/MyBtn/index.js'
    },
    {
      code: 'import \'./global.css\'',
      filename: '/abs/src/index.js'
    }
  ],
  invalid: [
    {
      code: 'import \'./index.scss\'',
      filename: '/abs/src/components/MyBtn/index.js',
      errors: [{ messageId: 'nonModuleScss' }]
    },
    {
      code: 'import \'./styles.css\'',
      filename: '/abs/src/components/MyBtn/index.js',
      errors: [{ messageId: 'nonModuleScss' }]
    }
  ]
})
