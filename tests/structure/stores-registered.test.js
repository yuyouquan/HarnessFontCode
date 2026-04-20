const fs = require('fs')
const path = require('path')

const STORE_DIR = path.resolve(__dirname, '../../src/store')
const INDEX_FILE = path.join(STORE_DIR, 'index.js')

function getStoreFiles() {
  return fs.readdirSync(STORE_DIR).filter(f => /\.Store\.js$/.test(f))
}

describe('MobX store registration', () => {
  const indexSrc = fs.readFileSync(INDEX_FILE, 'utf8')
  const storeFiles = getStoreFiles()

  if (storeFiles.length === 0) {
    test.skip('no .Store.js files to check', () => {})
  } else {
    test.each(storeFiles)(
      '"%s" must be imported in src/store/index.js',
      (storeFile) => {
        // 文件名 user.Store.js → 匹配 from './user.Store' 或 from './user.Store.js'
        const base = storeFile.replace(/\.js$/, '')
        // 用 RegExp 构造器才能正确 escape 点号
        const escaped = base.replace(/\./g, '\\.')
        const pattern = new RegExp(
          `from\\s+['"]\\./${escaped}(\\.js)?['"]`
        )
        expect(indexSrc).toMatch(pattern)
      }
    )
  }
})
