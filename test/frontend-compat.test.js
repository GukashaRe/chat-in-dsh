import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'webview', 'vendor', 'chat-demo', 'src')
const files = []
const walk = (dir) => {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(file)
  }
}
walk(root)

test('前端兼容：旧 WebView 不使用 ES2023 数组方法', { skip: files.length === 0 }, () => {
  const offenders = []
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    for (const pattern of [/\.toSorted\(/, /\.toReversed\(/, /\.toSpliced\(/, /\.findLast\(/, /\.findLastIndex\(/]) {
      if (pattern.test(text)) {
        offenders.push(`${path.relative(root, file)}: ${pattern}`)
      }
    }
  }
  assert.deepEqual(offenders, [], `旧内核不支持的数组方法: ${offenders.join(', ')}`)
})
