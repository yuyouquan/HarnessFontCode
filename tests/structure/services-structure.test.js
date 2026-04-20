const fs = require('fs')
const path = require('path')

const SERVICES_DIR = path.resolve(__dirname, '../../src/services')
const EXEMPT_DOMAINS = new Set(['xhr'])

function listDomains() {
  return fs.readdirSync(SERVICES_DIR).filter(entry => {
    const full = path.join(SERVICES_DIR, entry)
    // 只承认目录（跳过 AGENTS.md 等文件）
    return fs.statSync(full).isDirectory()
  })
}

function listServiceFiles(domain) {
  const domainDir = path.join(SERVICES_DIR, domain)
  return fs.readdirSync(domainDir).filter(f => {
    const full = path.join(domainDir, f)
    return fs.statSync(full).isFile() && /\.js$/.test(f)
  })
}

function hasNestedDirs(domain) {
  const domainDir = path.join(SERVICES_DIR, domain)
  return fs.readdirSync(domainDir).some(entry =>
    fs.statSync(path.join(domainDir, entry)).isDirectory()
  )
}

describe('services directory structure', () => {
  const domains = listDomains().filter(d => !EXEMPT_DOMAINS.has(d))

  if (domains.length === 0) {
    test.skip('no non-xhr domains to check', () => {})
    return
  }

  describe.each(domains)('domain "%s"', (domain) => {
    test('must not contain nested subdirectories', () => {
      expect(hasNestedDirs(domain)).toBe(false)
    })

    const serviceFiles = listServiceFiles(domain)
    if (serviceFiles.length === 0) {
      test.skip('(no .js files in this domain)', () => {})
    } else {
      test.each(serviceFiles)(
        'file "%s" must end with Service.js',
        (file) => {
          expect(file).toMatch(/Service\.js$/)
        }
      )
    }
  })
})
