# 📚 DNS-Max 完整文档索引

## 快速导航

| 文档                                               | 说明           | 适用场景          |
| -------------------------------------------------- | -------------- | ----------------- |
| [README.md](README.md)                             | 项目主文档     | 了解项目概况      |
| [QUICKSTART.md](QUICKSTART.md)                     | 5 分钟快速部署 | 快速测试和开发    |
| [DEPLOYMENT.md](DEPLOYMENT.md)                     | 生产环境部署   | 正式上线部署      |
| [CONFIGURATION.md](CONFIGURATION.md)               | 配置详细说明   | 配置邮件和 DNSPod |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md)           | 故障排除       | 遇到问题时查阅    |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | 部署检查清单   | 验证部署完整性    |
| [UPGRADE.md](UPGRADE.md)                           | 升级指南       | 从旧版本升级      |
| [CHANGELOG_v2.0.md](CHANGELOG_v2.0.md)             | 更新日志       | 了解版本变化      |

---

## 📖 按使用场景分类

### 🚀 新用户入门

1. **首次接触项目** → [README.md](README.md)

   - 了解功能特性
   - 查看技术栈
   - 快速开始指南

2. **快速部署测试** → [QUICKSTART.md](QUICKSTART.md)

   - 3 分钟部署
   - 默认配置启动
   - 基础功能测试

3. **详细配置** → [CONFIGURATION.md](CONFIGURATION.md)
   - 邮件服务配置
   - DNSPod 配置
   - 管理员后台使用

### 🏢 生产环境部署

1. **部署前准备** → [DEPLOYMENT.md](DEPLOYMENT.md) 第一章

   - 服务器要求
   - 依赖安装
   - 环境准备

2. **执行部署** → [DEPLOYMENT.md](DEPLOYMENT.md) 第二章

   - 详细部署步骤
   - SSL/HTTPS 配置
   - 安全加固

3. **验证部署** → [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
   - 逐项检查
   - 功能测试
   - 性能验证

### 🔧 日常维护

1. **配置管理** → [CONFIGURATION.md](CONFIGURATION.md)

   - 修改系统配置
   - 更新邮件设置
   - 调整 DNS 参数

2. **监控和备份** → [DEPLOYMENT.md](DEPLOYMENT.md) 监控章节

   - 日志查看
   - 数据备份
   - 性能监控

3. **故障排除** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - 常见问题
   - 错误排查
   - 解决方案

### 🔄 版本升级

1. **了解变更** → [CHANGELOG_v2.0.md](CHANGELOG_v2.0.md)

   - 新功能
   - 破坏性变更
   - API 变化

2. **执行升级** → [UPGRADE.md](UPGRADE.md)

   - 升级步骤
   - 数据迁移
   - 回滚方案

3. **升级验证** → [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
   - 功能测试
   - 配置检查
   - 性能对比

---

## 🎯 按问题类型查找

### 部署问题

| 问题                   | 查阅文档                                           | 章节     |
| ---------------------- | -------------------------------------------------- | -------- |
| 如何快速部署？         | [QUICKSTART.md](QUICKSTART.md)                     | 快速开始 |
| 生产环境怎么部署？     | [DEPLOYMENT.md](DEPLOYMENT.md)                     | 部署步骤 |
| 需要配置哪些环境变量？ | [CONFIGURATION.md](CONFIGURATION.md)               | 必需配置 |
| 如何配置 HTTPS？       | [DEPLOYMENT.md](DEPLOYMENT.md)                     | SSL 配置 |
| 如何验证部署成功？     | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | 全文     |

### 配置问题

| 问题               | 查阅文档                                 | 章节        |
| ------------------ | ---------------------------------------- | ----------- |
| 如何配置邮件服务？ | [CONFIGURATION.md](CONFIGURATION.md)     | 邮件配置    |
| 如何配置 DNSPod？  | [CONFIGURATION.md](CONFIGURATION.md)     | DNSPod 配置 |
| 配置在哪里修改？   | [CONFIGURATION.md](CONFIGURATION.md)     | 管理员后台  |
| Gmail 怎么配置？   | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 8      |

### 运行问题

| 问题             | 查阅文档                                 | 章节      |
| ---------------- | ---------------------------------------- | --------- |
| 服务启动失败     | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 1    |
| 无法登录         | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 4-6  |
| 邮件发送失败     | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 7-8  |
| DNS 记录创建失败 | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 9-10 |
| 端口被占用       | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题 2    |

### 维护问题

| 问题           | 查阅文档                                 | 章节       |
| -------------- | ---------------------------------------- | ---------- |
| 如何备份数据？ | [DEPLOYMENT.md](DEPLOYMENT.md)           | 数据库备份 |
| 如何查看日志？ | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 调试技巧   |
| 如何监控服务？ | [DEPLOYMENT.md](DEPLOYMENT.md)           | 监控和维护 |
| 如何更新版本？ | [UPGRADE.md](UPGRADE.md)                 | 升级步骤   |

---

## 📝 文档详细说明

### README.md - 项目主文档

**内容概览**:

- ✨ 功能特性
- 🚀 快速开始（3 分钟部署）
- ⚙️ 基础配置说明
- 🛠 技术栈介绍
- 📖 文档索引

**适合阅读者**: 所有用户  
**阅读时长**: 5-10 分钟

---

### QUICKSTART.md - 快速开始指南

**内容概览**:

- 最快部署方式（3 分钟）
- 首次使用步骤
- 基础配置说明
- 常用命令
- 验证部署

**适合阅读者**: 新用户、想快速测试的用户  
**阅读时长**: 5 分钟

---

### DEPLOYMENT.md - 生产环境部署指南

**内容概览**:

- 服务器准备和要求
- 详细部署步骤（8 步）
- SSL/HTTPS 配置
- 安全加固措施
- 监控和维护方案
- 性能优化建议

**适合阅读者**: 运维人员、生产环境部署  
**阅读时长**: 30-45 分钟

---

### CONFIGURATION.md - 配置说明文档

**内容概览**:

- 配置方式变更说明（v2.0）
- 部署步骤
- 邮件服务配置（SMTP/Resend）
- DNSPod 配置
- 配置项详细说明
- 故障排查

**适合阅读者**: 需要配置邮件和 DNS 的用户  
**阅读时长**: 15-20 分钟

---

### TROUBLESHOOTING.md - 故障排除指南

**内容概览**:

- 15+常见问题解决方案
- 详细的排查步骤
- 调试技巧和工具
- 日志分析方法
- 完全重置指南

**适合阅读者**: 遇到问题的用户  
**阅读时长**: 按需查阅

---

### DEPLOYMENT_CHECKLIST.md - 部署检查清单

**内容概览**:

- 部署前检查（环境、配置）
- 部署步骤检查
- 首次使用检查
- 系统配置检查
- 功能测试检查
- 安全检查
- 监控检查

**适合阅读者**: 部署后需要验证的用户  
**阅读时长**: 边做边查

---

### UPGRADE.md - 升级指南

**内容概览**:

- 从旧版本升级步骤
- 数据备份和恢复
- 配置迁移说明
- 验证功能
- 回滚方案

**适合阅读者**: 需要升级的现有用户  
**阅读时长**: 10-15 分钟

---

### CHANGELOG_v2.0.md - 版本更新日志

**内容概览**:

- v2.0 主要变更
- 技术实现细节
- API 签名变更
- 受影响的文件
- 优势和未来计划

**适合阅读者**: 开发者、关注版本变化的用户  
**阅读时长**: 10-15 分钟

---

## 💡 推荐阅读路径

### 路径 1: 新用户快速上手

```
README.md (了解项目)
    ↓
QUICKSTART.md (快速部署)
    ↓
CONFIGURATION.md (配置系统)
    ↓
开始使用！
```

**总时长**: 约 30 分钟

---

### 路径 2: 生产环境部署

```
README.md (了解项目)
    ↓
DEPLOYMENT.md (详细部署)
    ↓
CONFIGURATION.md (配置系统)
    ↓
DEPLOYMENT_CHECKLIST.md (验证部署)
    ↓
生产环境就绪！
```

**总时长**: 约 1-2 小时

---

### 路径 3: 问题排查

```
遇到问题
    ↓
TROUBLESHOOTING.md (查找解决方案)
    ↓
如果未解决 → 查看相关详细文档
    ↓
仍未解决 → 提交Issue
```

---

### 路径 4: 版本升级

```
CHANGELOG_v2.0.md (了解变更)
    ↓
UPGRADE.md (执行升级)
    ↓
DEPLOYMENT_CHECKLIST.md (验证功能)
    ↓
升级完成！
```

**总时长**: 约 30-60 分钟

---

## 🔗 快速链接

### 在线资源

- **项目仓库**: https://github.com/Alice-easy/DNS-Max
- **提交 Issue**: https://github.com/Alice-easy/DNS-Max/issues
- **讨论区**: https://github.com/Alice-easy/DNS-Max/discussions

### API 文档

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### 相关技术文档

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)
- [DNSPod API](https://docs.dnspod.cn/)

---

## 📞 获取帮助

### 1. 查阅文档

首先查看本文档索引，找到相关主题的文档。

### 2. 搜索 Issues

访问 [Issues 页面](https://github.com/Alice-easy/DNS-Max/issues) 搜索类似问题。

### 3. 提交 Issue

如果找不到解决方案，[提交新 Issue](https://github.com/Alice-easy/DNS-Max/issues/new)，并提供：

- 详细的问题描述
- 复现步骤
- 错误日志
- 环境信息

### 4. 参与讨论

加入 [Discussions](https://github.com/Alice-easy/DNS-Max/discussions) 与社区交流。

---

## 🤝 贡献文档

发现文档问题或想要改进？欢迎提交 PR：

1. Fork 本仓库
2. 修改文档
3. 提交 Pull Request

---

<div align="center">

**感谢使用 DNS-Max！**

如果这个项目对你有帮助，请给个 ⭐ Star

[返回主页](README.md)

</div>
