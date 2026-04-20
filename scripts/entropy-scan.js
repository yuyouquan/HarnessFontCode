#!/usr/bin/env node
/**
 * 熵扫描：扫描仓库的技术债信号。
 *
 *   ① TODO/FIXME/XXX/HACK 注释 + git blame 存活天数
 *   ② 未使用的导出 / 死代码（通过 knip）
 *
 * 输出 JSON 到 stdout。
 *
 * 用法：
 *   node scripts/entropy-scan.js > entropy.json
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const TODO_PATTERN = /\b(TODO|FIXME|XXX|HACK)\b/

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full, acc)
    } else if (/\.(js|jsx|scss)$/.test(name)) {
      acc.push(full)
    }
  }
  return acc
}

function scanTodos() {
  const files = walk(SRC)
  const todos = []
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const lines = fs.readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (TODO_PATTERN.test(line)) {
        const lineNo = i + 1
        let ageDays = null
        try {
          const blame = execSync(
            `git blame -L ${lineNo},${lineNo} --date=short -- "${rel}"`,
            { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
          )
          const dateMatch = blame.match(/(\d{4}-\d{2}-\d{2})/)
          if (dateMatch) {
            const written = new Date(dateMatch[1])
            ageDays = Math.floor((Date.now() - written.getTime()) / 86400000)
          }
        } catch (_) {
          // 文件未 tracked 或 blame 失败 → ageDays 保持 null
        }
        todos.push({
          file: rel,
          line: lineNo,
          content: line.trim(),
          ageDays
        })
      }
    })
  }
  // 最老的排在最前
  return todos.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0))
}

function scanDeadCode() {
  try {
    const raw = execSync('npx --no-install knip --reporter json', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    })
    return JSON.parse(raw)
  } catch (err) {
    // knip 在发现问题时会退出非零 —— 但仍然输出 JSON 到 stdout
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout.toString())
      } catch (_) {
        return { error: '解析 knip 输出失败', raw: err.stdout.toString().slice(0, 500) }
      }
    }
    return { error: err.message }
  }
}

function main() {
  const result = {
    scannedAt: new Date().toISOString(),
    todos: scanTodos(),
    deadCode: scanDeadCode()
  }
  process.stdout.write(JSON.stringify(result, null, 2))
}

main()
