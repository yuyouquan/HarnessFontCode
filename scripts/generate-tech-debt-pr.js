#!/usr/bin/env node
/**
 * 把 entropy-scan.js 的 JSON 输出格式化为 markdown，并开一个 GitLab MR。
 *
 * 依赖环境变量（GitLab CI 自动注入）：
 *   CI_API_V4_URL       e.g. https://gitlab.example.com/api/v4
 *   CI_PROJECT_ID       数字 ID
 *   GITLAB_BOT_TOKEN    需要在 GitLab 项目 Settings → CI/CD → Variables 配置（api scope）
 *   CI_DEFAULT_BRANCH   通常 develop 或 main（默认 develop）
 *
 * 用法：
 *   node scripts/generate-tech-debt-pr.js entropy.json
 */

const fs = require('fs')
const https = require('https')
const http = require('http')
const { URL } = require('url')
const { execSync } = require('child_process')

const {
  CI_API_V4_URL,
  CI_PROJECT_ID,
  GITLAB_BOT_TOKEN,
  CI_DEFAULT_BRANCH = 'develop'
} = process.env

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

if (!CI_API_V4_URL) fail('缺少环境变量 CI_API_V4_URL')
if (!CI_PROJECT_ID) fail('缺少环境变量 CI_PROJECT_ID')
if (!GITLAB_BOT_TOKEN) fail('缺少环境变量 GITLAB_BOT_TOKEN')

const scanPath = process.argv[2] || 'entropy.json'
if (!fs.existsSync(scanPath)) fail(`找不到扫描文件：${scanPath}`)
const scan = JSON.parse(fs.readFileSync(scanPath, 'utf8'))

// 格式化 markdown body
function formatMarkdown(scan) {
  const date = scan.scannedAt.slice(0, 10)
  const todoRows = (scan.todos || []).slice(0, 50).map(t => {
    const age = t.ageDays == null ? '?' : (t.ageDays > 90 ? `${t.ageDays} ⚠️` : t.ageDays)
    const content = String(t.content || '').replace(/\|/g, '\\|').slice(0, 80)
    return `| \`${t.file}:${t.line}\` | ${content} | ${age} |`
  })
  const todoSection = (scan.todos || []).length === 0
    ? '_无_'
    : ['| 文件:行 | 内容 | 存活天数 |', '|---|---|---|', ...todoRows].join('\n')

  let deadCodeSection
  if (!scan.deadCode || scan.deadCode.error) {
    deadCodeSection = `_扫描失败: ${scan.deadCode && scan.deadCode.error || 'unknown'}_`
  } else {
    // knip 输出 { issues: [...] }
    const issues = scan.deadCode.issues || []
    if (issues.length === 0) {
      deadCodeSection = '_无_'
    } else {
      // 取前 20 条摘要
      const preview = JSON.stringify(issues.slice(0, 20), null, 2).slice(0, 3000)
      deadCodeSection = '```json\n' + preview + '\n```'
    }
  }

  return [
    `# 熵扫描报告 — ${date}`,
    '',
    '本报告由 `scripts/entropy-scan.js` 每周一自动生成。',
    '挑能清理的改掉即可，**不强制全部处理**。',
    '',
    '## TODO 债务',
    '',
    todoSection,
    '',
    '## 死代码 / 未使用导出',
    '',
    '> 注意：由于 qiankun 微前端和 `@/` 路径别名，部分"死代码"可能实际被动态引用。',
    '> 请配合实际业务场景判断。',
    '',
    deadCodeSection,
    '',
    '---',
    `生成时间：${scan.scannedAt}`
  ].join('\n')
}

// 调用 GitLab API 发请求
function request(method, url, token, payload) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const lib = parsed.protocol === 'http:' ? http : https
    const body = payload ? JSON.stringify(payload) : null
    const req = lib.request(
      {
        method,
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        headers: {
          'PRIVATE-TOKEN': token,
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
        }
      },
      res => {
        const chunks = []
        res.on('data', c => chunks.push(c))
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8')
          if (res.statusCode >= 400) {
            return reject(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 500)}`))
          }
          try { resolve(JSON.parse(text)) } catch (_) { resolve(text) }
        })
      }
    )
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function main() {
  const body = formatMarkdown(scan)
  const date = scan.scannedAt.slice(0, 10)
  const branch = `tech-debt/entropy-${date}`
  const title = `tech-debt/entropy-report-${date}`

  // 1. 在本地仓库创建分支，把 entropy.json 存进去
  try {
    execSync(`git checkout -b ${branch}`, { cwd: process.cwd(), stdio: 'inherit' })
    const copyPath = `entropy-${date}.json`
    fs.copyFileSync(scanPath, copyPath)
    execSync(`git add ${copyPath}`, { cwd: process.cwd(), stdio: 'inherit' })
    execSync(
      `git -c user.email=ci@example.com -c user.name=EntropyBot commit -m "chore(entropy): scan ${date}"`,
      { cwd: process.cwd(), stdio: 'inherit' }
    )
    execSync(`git push origin ${branch}`, { cwd: process.cwd(), stdio: 'inherit' })
  } catch (err) {
    fail(`分支创建/推送失败: ${err.message}`)
  }

  // 2. 通过 GitLab API 开 MR
  const url = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests`
  try {
    const mr = await request('POST', url, GITLAB_BOT_TOKEN, {
      source_branch: branch,
      target_branch: CI_DEFAULT_BRANCH,
      title,
      description: body,
      remove_source_branch: true
    })
    console.log(`✓ MR 已创建：${mr.web_url || mr.id || JSON.stringify(mr).slice(0, 200)}`)
  } catch (err) {
    fail(`MR 创建失败: ${err.message}`)
  }
}

main().catch(err => fail(err.message))
