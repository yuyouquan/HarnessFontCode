const fs = require('fs')
const path = require('path')

const COMPONENTS_DIR = path.resolve(__dirname, '../../src/components')
const I18N_EN = path.resolve(__dirname, '../../src/i18n/en-US.js')
const I18N_ZH = path.resolve(__dirname, '../../src/i18n/zh-CN.js')

function listComponentDirs() {
  return fs.readdirSync(COMPONENTS_DIR).filter(entry => {
    const full = path.join(COMPONENTS_DIR, entry)
    return fs.statSync(full).isDirectory()
  })
}

/**
 * 从 i18n 的 ES module 文件中提取顶层 key 集合。
 * 用正则匹配 `'key': value` 或 `"key": value` 的第一级属性。
 * 不走 require() 因为这些文件是 ES module（export default）。
 */
function extractTopLevelKeys(jsFile) {
  const src = fs.readFileSync(jsFile, 'utf8')
  // 截取 const X = { ... } 中的 { ... } 内容
  const match = src.match(/=\s*\{([\s\S]*?)\n\}/)
  if (!match) return []
  const body = match[1]
  // 匹配 'key': 或 "key": 开头的行（单行匹配，不处理嵌套对象，我们约定 i18n 是扁平结构）
  const keys = []
  const regex = /^\s*['"]([^'"]+)['"]\s*:/gm
  let m
  while ((m = regex.exec(body)) !== null) {
    keys.push(m[1])
  }
  return keys
}

describe('component folder structure', () => {
  const dirs = listComponentDirs()

  if (dirs.length === 0) {
    test.skip('no component directories to check', () => {})
    return
  }

  describe.each(dirs)('component "%s"', (dir) => {
    test('must have index.js or index.jsx', () => {
      const dirPath = path.join(COMPONENTS_DIR, dir)
      const hasIndex =
        fs.existsSync(path.join(dirPath, 'index.js')) ||
        fs.existsSync(path.join(dirPath, 'index.jsx'))
      expect(hasIndex).toBe(true)
    })

    test('any scss file must be .module.scss', () => {
      const dirPath = path.join(COMPONENTS_DIR, dir)
      const badScss = fs.readdirSync(dirPath).filter(
        f => /\.scss$/.test(f) && !/\.module\.scss$/.test(f)
      )
      expect(badScss).toEqual([])
    })
  })
})

describe('i18n keys parity', () => {
  test('en-US and zh-CN must have identical key sets', () => {
    const enKeys = extractTopLevelKeys(I18N_EN).sort()
    const zhKeys = extractTopLevelKeys(I18N_ZH).sort()
    expect(enKeys.length).toBeGreaterThan(0)
    expect(zhKeys.length).toBeGreaterThan(0)
    const onlyInEn = enKeys.filter(k => !zhKeys.includes(k))
    const onlyInZh = zhKeys.filter(k => !enKeys.includes(k))
    expect({ onlyInEn, onlyInZh }).toEqual({ onlyInEn: [], onlyInZh: [] })
  })
})
