# 文档索引

仓库文档按读者和用途分层，避免把产品说明、工程约定和功能验收混在一个文件里。

| 文档 | 读者 | 内容 |
|---|---|---|
| [README.md](../README.md) | 用户 | 安装、使用、能做什么 |
| [AGENTS.md](../AGENTS.md) | 开发 Agent / 贡献者 | 仓库结构、命令、工作约定、硬约束、文档入口 |
| [product.md](product.md) | 产品 / 开发 | 产品定位、非目标、官方网页版对齐原则 |
| [architecture.md](architecture.md) | 开发 | 宿主/前端/补丁/存储/导入/转发链路 |
| [testing.md](testing.md) | 开发 / 测试 | 自动化测试、系统自检、人工 gate |
| [release.md](release.md) | 维护者 | 版本、发布流程、发布前门槛 |

## 维护规则

- `AGENTS.md` 只放长期有效的工程约定，不堆功能验收细节。
- 可自动化的行为写成测试；测试说明和人工 gate 写入 `testing.md`。
- 架构或数据流变化写入 `architecture.md`。
- 发布流程、版本策略变化写入 `release.md`。
- 用户可见说明只写 `README.md`，不展开内部实现。
