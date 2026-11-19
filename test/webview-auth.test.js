import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveUpstreamAuth } from '../src/webview.js'

const accountCtx = {
  get(name) {
    if (name === 'deepseekAccount') return { resolveToken: async () => 'account-token' }
    return undefined
  },
}

test('账户登录时使用 x-dsh-auth-token', async () => {
  const auth = await resolveUpstreamAuth(accountCtx, 'https://api.deepseek.com/anthropic')
  assert.equal(auth?.source, 'account')
  assert.deepEqual(auth?.headers, { 'x-dsh-auth-token': 'account-token' })
})

test('账户未登录时按设置里的 apiKeyEnv 取 API Key，用 x-api-key', async () => {
  const ctx = {
    get(name) {
      if (name === 'deepseekAccount') return { resolveToken: async () => undefined }
      if (name === 'settings') {
        return {
          describe: () => [
            {
              ns: 'llm-deepseek-api-key',
              value: { baseURL: 'https://api.deepseek.com/anthropic', apiKeyEnv: 'MY_DEEPSEEK_KEY' },
            },
          ],
        }
      }
      if (name === 'credentials') {
        return {
          resolve: async ref => (ref === 'MY_DEEPSEEK_KEY' ? { value: 'sk-test', source: 'stored' } : undefined),
        }
      }
      return undefined
    },
  }
  const auth = await resolveUpstreamAuth(ctx, 'https://api.deepseek.com/anthropic')
  assert.equal(auth?.source, 'api-key')
  assert.deepEqual(auth?.headers, { 'x-api-key': 'sk-test' })
})

test('设置里没有 apiKeyEnv 时回退 DEEPSEEK_API_KEY', async () => {
  const seen = []
  const ctx = {
    get(name) {
      if (name === 'deepseekAccount') return { resolveToken: async () => undefined }
      if (name === 'settings') return { describe: () => [] }
      if (name === 'credentials') {
        return {
          resolve: async ref => {
            seen.push(ref)
            return { value: 'sk-default', source: 'stored' }
          },
        }
      }
      return undefined
    },
  }
  const auth = await resolveUpstreamAuth(ctx, 'https://api.deepseek.com/anthropic')
  assert.deepEqual(seen, ['DEEPSEEK_API_KEY'])
  assert.equal(auth?.headers['x-api-key'], 'sk-default')
})

test('凭据服务缺失时读取环境变量', async () => {
  const previous = process.env.DEEPSEEK_API_KEY
  process.env.DEEPSEEK_API_KEY = 'sk-env'
  try {
    const ctx = {
      get(name) {
        if (name === 'deepseekAccount') return { resolveToken: async () => undefined }
        return undefined
      },
    }
    const auth = await resolveUpstreamAuth(ctx, 'https://api.deepseek.com/anthropic')
    assert.equal(auth?.headers['x-api-key'], 'sk-env')
  } finally {
    if (previous === undefined) delete process.env.DEEPSEEK_API_KEY
    else process.env.DEEPSEEK_API_KEY = previous
  }
})

test('账户和 API Key 都没有时返回 undefined', async () => {
  const previous = process.env.DEEPSEEK_API_KEY
  delete process.env.DEEPSEEK_API_KEY
  try {
    const ctx = {
      get(name) {
        if (name === 'deepseekAccount') return { resolveToken: async () => undefined }
        return undefined
      },
    }
    assert.equal(await resolveUpstreamAuth(ctx, 'https://api.deepseek.com/anthropic'), undefined)
  } finally {
    if (previous !== undefined) process.env.DEEPSEEK_API_KEY = previous
  }
})
