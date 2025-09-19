# DNS Max

<div align="center">

![DNS Max](https://img.shields.io/badge/DNS%20Max-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.0+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**统一 DNS 管理平台**

一个现代化的多 DNS 服务商统一管理平台，支持阿里云、Cloudflare、腾讯云等主流服务商的集中化管理。

[快速开始](#-快速开始) • [完整文档](./DEPLOYMENT.md)

</div>

## ✨ 主要特性

- **🌐 多平台统一管理** - 支持阿里云、Cloudflare、腾讯云 DNS 服务
- **🔒 安全可靠** - JWT 认证、API 密钥加密存储、操作审计
- **⚡ 高性能** - FastAPI + Next.js 架构、异步处理、Redis 缓存
- **📱 优秀体验** - 响应式设计、直观界面、实时反馈
- **🚀 一键部署** - Docker 容器化，支持快速部署
- **📋 完整功能** - 支持所有常用 DNS 记录类型的 CRUD 操作

## 🚀 快速开始

### 前置要求

- Docker 20.0+
- Docker Compose 2.0+
- Git

### 部署步骤

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，修改数据库密码和 JWT 密钥

# 3. 拉取预构建镜像
#    （如需使用自定义镜像，可在 .env 中设置 BACKEND_IMAGE、FRONTEND_IMAGE 或使用环境变量覆盖）
docker-compose pull backend frontend

# 4. 启动服务
docker-compose up -d

# 5. 访问应用
echo "前端界面: http://localhost:3000"
echo "后端 API: http://localhost:8000"
echo "API 文档: http://localhost:8000/docs"
```

> 💡 `docker-compose.yml` 默认指向由 `Auto Package` GitHub Actions 工作流产出的预构建镜像（示例：`ghcr.io/your-org/dns-max-backend:latest` 与 `ghcr.io/your-org/dns-max-frontend:latest`）。如需使用其他版本，可在 `.env` 中设置 `BACKEND_IMAGE`、`FRONTEND_IMAGE` 或通过环境变量覆盖。

### 验证部署

```bash
# 检查服务状态
docker-compose ps

# 健康检查
curl http://localhost:8000/health
```

## 🛠️ 技术栈

### 后端
- **Python 3.11+** - 主要开发语言
- **FastAPI** - 现代化 Web 框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **SQLAlchemy** - ORM 数据库操作

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Zustand** - 状态管理

### 部署
- **Docker** - 容器化
- **Docker Compose** - 容器编排
- **Nginx** - 反向代理

## 📚 使用指南

### 1. 添加 DNS 服务商

登录后，进入"服务商管理"页面添加您的 DNS 服务商配置：

#### 阿里云 DNS
```json
{
  "access_key_id": "your_access_key_id",
  "access_key_secret": "your_access_key_secret",
  "region": "cn-hangzhou"
}
```

#### Cloudflare DNS
```json
{
  "api_token": "your_api_token",
  "email": "your_email@example.com"
}
```

#### 腾讯云 DNS
```json
{
  "secret_id": "your_secret_id",
  "secret_key": "your_secret_key",
  "region": "ap-guangzhou"
}
```

### 2. 管理域名和记录

1. 添加域名到对应的 DNS 服务商
2. 查看和管理 DNS 记录
3. 支持 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA 等记录类型
4. 批量操作和实时同步

## 📋 系统要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核心 | 4 核心 |
| 内存 | 4GB RAM | 8GB RAM |
| 存储 | 20GB | 50GB SSD |
| 系统 | Linux/Windows/macOS | Ubuntu 20.04+ |

## 📖 文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署说明
- [环境配置](./ENVIRONMENT.md) - 环境变量配置说明

## 🔧 故障排除

### 常见问题

**容器启动失败**
```bash
# 查看日志
docker-compose logs -f

# 重新构建
docker-compose down
docker-compose pull --include-deps
docker-compose up -d
```

**数据库连接失败**
```bash
# 检查数据库状态
docker-compose ps postgres
docker-compose exec postgres pg_isready
```

更多故障排除信息请参考 [部署指南](./DEPLOYMENT.md#-故障排除)。

## 🤝 贡献

我们欢迎各种形式的贡献！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：
- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的 Python Web 框架
- [Next.js](https://nextjs.org/) - React 生产级框架
- [PostgreSQL](https://www.postgresql.org/) - 先进的开源数据库
- [Redis](https://redis.io/) - 内存数据结构存储

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️**

</div>