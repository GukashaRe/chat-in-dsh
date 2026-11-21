# 测试

原则：**能写成自动测试的行为，就写成测试；文档不替测试做判断。**

## 自动化

```bash
node --test test/protocol.test.js test/dsh-import.test.js
```

- `test/protocol.test.js`：端点根、令牌头、路径越界
- `test/dsh-import.test.js`：DSH 日志解析、导入暂存与 `importId` ACK 匹配

新增可自动化的逻辑时，优先补对应 `test/*.test.js`，不要先在文档里写一套“让 Agent 自己看”的验收标准。

## 系统自检

- `GET /webchat/api/self-test`：入口页、静态资源、一次真实生成
- `npm pack --dry-run`：确认入口文件和 `webview/dist` 都在包内

## 人工 gate

只有自动化覆盖不了的场景才留给人工：

- 真实 DSH 桌面/Go 宿主里的视觉效果和交互
- 真实 DeepSeek 服务的端到端对话
- 浏览器原生能力（截图粘贴、页面缩放等）
- 最终包安装后的发布前 smoke

发布前由维护者/用户本地安装最终包确认核心流程，具体发布门槛见 [release.md](release.md)。

## 维护规则

- 可自动化的行为：写测试。
- 测试命令、测试分层、无法自动化的缺口：写本文件。
- 不要把逐条功能验收步骤搬进 `AGENTS.md` 或本文件；那样只会让文档和真实测试脱节。
