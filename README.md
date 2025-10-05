# DNS-Max 域名分发管理系统

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![Node](https://img.shields.io/badge/node-20-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

**基于 Next.js + FastAPI + DNSPod 的现代化域名解析分发管理平台**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [文档](#-文档)

</div>

---

## ✨ 功能特性

- 🔐 **安全认证** - JWT + Argon2 密码加密
- 👥 **用户管理** - 角色权限控制
- 🌐 **域名分发** - 自动化 DNS 记录管理
- ✅ **审批流程** - 管理员审核机制
- 📧 **邮件通知** - SMTP/Resend 双支持
- ⚙️ **后台配置** - Web 界面管理系统配置
- 🚀 **一键部署** - Docker Compose

## 🚀 快速开始

### 3 分钟部署

```bash
# 1. 克隆项目
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max

# 2. 配置并启动
cp env.example .env
docker-compose up -d --build

# 3. 访问应用
# 前端: http://localhost:3000
# API: http://localhost:8000/docs
```

### 首次使用

1. 访问 http://localhost:3000 注册账号
2. **第一个用户自动成为管理员**
3. 登录后访问"管理员后台" → "系统配置"
4. 配置邮件服务和 DNSPod（可选）

> 💡 **提示**: 邮件和 DNSPod 可在部署后通过 Web 界面配置，无需修改环境变量

## 📖 文档

| 文档 | 说明 |
|------|------|
| [快速开始](docs/QUICKSTART.md) | 详细部署指南 |
| [配置说明](docs/CONFIGURATION.md) | 环境变量和系统配置 |
| [部署指南](docs/DEPLOYMENT.md) | 生产环境部署 |
| [API文档](docs/API.md) | 接口文档 |
| [项目结构](docs/PROJECT_STRUCTURE.md) | 代码结构说明 |
| [故障排除](docs/TROUBLESHOOTING.md) | 常见问题 |

## 🛠 技术栈

**后端**: FastAPI + PostgreSQL + SQLAlchemy + Alembic  
**前端**: Next.js 14 + TypeScript + Tailwind CSS  
**部署**: Docker + Docker Compose  
**集成**: DNSPod API + Resend/SMTP

## 📦 项目结构

```
DNS-Max/
├── api/              # FastAPI 后端
│   ├── app/
│   │   ├── routers/  # API 路由
│   │   ├── models.py # 数据模型
│   │   └── main.py   # 应用入口
│   └── requirements.txt
├── web/              # Next.js 前端
│   ├── src/
│   │   ├── app/      # 页面和路由
│   │   └── components/ # UI组件
│   └── package.json
├── docs/             # 文档
├── docker-compose.yml
└── env.example
```

## 🔧 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 更新服务
git pull && docker-compose up -d --build

# 停止服务
docker-compose down
```

## ❓ 常见问题

### 部署后无法访问？
检查端口是否被占用，查看日志：`docker-compose logs`

### 邮件发送失败？
在管理员后台检查邮件配置，或查看 API 日志获取详细错误

### 如何重置管理员密码？
```bash
docker-compose exec db psql -U domainapp domainapp
UPDATE users SET password_hash = '...' WHERE role = 'admin';
```

更多问题 → [故障排除文档](docs/TROUBLESHOOTING.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [DNSPod](https://www.dnspod.cn/)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star ⭐**

Made with ❤️ by DNS-Max Team

</div>
