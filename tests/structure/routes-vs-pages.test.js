const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.resolve(__dirname, '../../src/pages')
const ROUTER_CONFIG = path.resolve(__dirname, '../../src/router/config.js')

function getPageFolders() {
  return fs.readdirSync(PAGES_DIR).filter(name => {
    const full = path.join(PAGES_DIR, name)
    if (!fs.statSync(full).isDirectory()) return false
    // 只承认有 index.js/jsx 入口的目录
    return (
      fs.existsSync(path.join(full, 'index.js')) ||
      fs.existsSync(path.join(full, 'index.jsx'))
    )
  })
}

function extractPageNamesFromRouter() {
  const src = fs.readFileSync(ROUTER_CONFIG, 'utf8')
  // 只匹配 @/pages/ 或 ./pages/ 开头的路径；忽略 @/components/ 等
  const regex = /['"](?:@\/|\.\.?\/)pages\/([^'"/]+)/g
  const names = new Set()
  let m
  while ((m = regex.exec(src)) !== null) {
    names.add(m[1])
  }
  return Array.from(names)
}

describe('routes-vs-pages consistency', () => {
  const pageFolders = getPageFolders()
  const routedPages = extractPageNamesFromRouter()

  if (pageFolders.length === 0) {
    test.skip('no page folders to check', () => {})
  } else {
    test.each(pageFolders)(
      'page folder "%s" must be registered in src/router/config.js',
      (pageName) => {
        expect(routedPages).toContain(pageName)
      }
    )
  }

  if (routedPages.length === 0) {
    test.skip('no page references in router config', () => {})
  } else {
    test.each(routedPages)(
      'router reference "%s" must correspond to a real page folder',
      (pageName) => {
        expect(pageFolders).toContain(pageName)
      }
    )
  }
})
