function tryRequire(modulePath) {
  try {
    return require(modulePath)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') return null
    throw e
  }
}

const rules = {
  'no-raw-axios': tryRequire('./rules/no-raw-axios'),
  'service-file-convention': tryRequire('./rules/service-file-convention'),
  'store-must-make-observable': tryRequire('./rules/store-must-make-observable'),
  'no-cross-store-import': tryRequire('./rules/no-cross-store-import'),
  'component-folder-convention': tryRequire('./rules/component-folder-convention'),
  'utils-reuse-hint': tryRequire('./rules/utils-reuse-hint')
}

module.exports = {
  rules: Object.fromEntries(Object.entries(rules).filter(([, v]) => v !== null))
}
