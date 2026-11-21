import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const roots = [
  {
    dir: path.join(project, 'webview', 'vendor', 'chat-demo', 'src'),
    match: /\.(ts|tsx)$/,
  },
  {
    dir: path.join(project, 'webview', 'dist', 'static', 'js'),
    match: /\.js$/,
  },
]
const files = []
const walk = (dir, match) => {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file, match)
    else if (match.test(entry.name)) files.push(file)
  }
}
for (const { dir, match } of roots) walk(dir, match)

test('前端兼容：源码或构建产物不使用 ES2023 数组方法', { skip: files.length === 0 }, () => {
  const offenders = []
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    for (const pattern of [/\.toSorted\(/, /\.toReversed\(/, /\.toSpliced\(/, /\.findLast\(/, /\.findLastIndex\(/]) {
      if (pattern.test(text)) {
        offenders.push(`${path.relative(project, file)}: ${pattern}`)
      }
    }
  }
  assert.deepEqual(offenders, [], `旧内核不支持的数组方法: ${offenders.join(', ')}`)
})
