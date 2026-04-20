// jest-environment-node must be resolved relative to jest-cli (v30) to avoid a
// version mismatch with the v27 copy installed by react-scripts.  When the
// top-level node_modules contains mixed jest versions, the v27 environment
// lacks `moduleMocker.replaceProperty` and triggers a runtime crash inside
// jest-runtime v30.  Resolving via jest-cli guarantees the matching version.
const jestEnvNode = require.resolve(
  require('path').join(
    require.resolve('jest-cli/package.json'),
    '../node_modules/jest-environment-node'
  )
)
module.exports = {
  rootDir: '../..',
  testMatch: ['<rootDir>/tests/structure/**/*.test.js'],
  testEnvironment: jestEnvNode,
  transform: {},
  verbose: true
}
