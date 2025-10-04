# DNS-Max 域名分发管理系统

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![Node](https://img.shields.io/badge/node-20-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

基于 Next.js + FastAPI + DNSPod 的现代化域名解析分发管理平台

[功能特性](#功能特性) • [快速开始](#快速开始) • [部署指南](#部署指南) • [API 文档](#api文档)

</div>

---

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [部署指南](#部署指南)
- [使用说明](#使用说明)
- [开发指南](#开发指南)
- [API 文档](#api文档)
- [常见问题](#常见问题)
- [许可证](#许可证)

---

## ✨ 功能特性

### 核心功能

- 🔐 **安全认证** - JWT 身份验证 + Argon2 密码加密
- � **用户管理** - 角色权限控制（管理员/普通用户）
- 🌐 **域名分发** - 自动化 DNS 记录创建与管理
- ✅ **审批流程** - 管理员审核域名分配申请
- 📧 **邮件通知** - 支持 SMTP 和 Resend 邮件服务
- � **数据统计** - 域名使用情况可视化

### 技术特性

- 🚀 **一键部署** - Docker Compose 快速启动
- � **自动迁移** - 数据库 Schema 自动更新
- 📱 **响应式设计** - 完美适配各种设备
- �🔒 **生产就绪** - 内置安全最佳实践
- 📖 **API 文档** - Swagger/OpenAPI 自动生成
- 🐛 **详细日志** - 便于调试和监控

---

## 🛠 技术栈

### 后端技术

| 技术       | 版本   | 说明                   |
| ---------- | ------ | ---------------------- |
| FastAPI    | 0.104+ | 高性能 Python Web 框架 |
| PostgreSQL | 16     | 关系型数据库           |
| SQLAlchemy | 2.0+   | ORM 框架               |
| Alembic    | 1.12+  | 数据库迁移工具         |
| PyJWT      | 2.8+   | JWT 令牌处理           |
| Passlib    | 1.7+   | 密码哈希（Argon2）     |

### 前端技术

| 技术            | 版本 | 说明            |
| --------------- | ---- | --------------- |
| Next.js         | 14   | React 全栈框架  |
| TypeScript      | 5.0+ | 类型安全        |
| Tailwind CSS    | 3.0+ | 原子化 CSS 框架 |
| React Hook Form | 7.0+ | 表单管理        |

### 基础设施

- **Docker** & **Docker Compose** - 容器化部署
- **DNSPod API** - 腾讯云 DNS 解析服务

---

## 🏗 系统架构

```
┌─────────────────────────────────────────────────────┐
│                     用户浏览器                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)           │
│  • SSR/CSR                                          │
│  • API Routes (BFF层)                               │
│  • Cookie管理                                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)            │
│  • RESTful API                                      │
│  • JWT认证                                          │
│  • 数据验证                                          │
└─────────────┬───────────────┬───────────────────────┘
              │               │
              ▼               ▼
    ┌─────────────────┐  ┌──────────────┐
    │   PostgreSQL    │  │  DNSPod API  │
    │   (Port 5432)   │  │  (External)  │
    └─────────────────┘  └──────────────┘
```

---

## 🚀 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 可选：DNSPod 账号（用于实际 DNS 管理）

### 一键部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max

# 2. 复制并配置环境变量
cp env.example .env
# 编辑 .env 文件（见下方配置说明）

# 3. 启动所有服务
docker compose up -d --build

# 4. 查看服务状态
docker compose ps

# 5. 查看日志
docker compose logs -f
```

### 访问应用

- **前端界面**: http://localhost:3000
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/healthz

### 首次使用

1. 访问 http://localhost:3000
2. 点击"注册"创建账号
3. **第一个注册的用户将自动成为管理员** 🎉
4. 登录后即可开始使用

---

## ⚙️ 环境变量配置

### 必需配置

```bash
# 数据库配置
POSTGRES_DB=domainapp
POSTGRES_USER=domainapp
POSTGRES_PASSWORD=your_secure_password_here  # ⚠️ 请修改

# JWT密钥（必须修改！）
JWT_SECRET=your_jwt_secret_at_least_32_chars  # ⚠️ 请修改
JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_chars  # ⚠️ 请修改
ACCESS_TOKEN_TTL_MIN=30
REFRESH_TOKEN_TTL_DAYS=14

# 应用URL
PUBLIC_WEB_URL=http://localhost:3000
PUBLIC_API_URL=http://localhost:8000
```

### 邮件配置（可选）

**选项 1: 使用 Resend（推荐）**

```bash
MAIL_PROVIDER=RESEND
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM="DNS-Max <no-reply@yourdomain.com>"
```

**选项 2: 使用 SMTP**

```bash
MAIL_PROVIDER=SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="DNS-Max <your-email@gmail.com>"
```

### DNSPod 配置（可选）

```bash
DNSPOD_SECRET_ID=your_dnspod_secret_id
DNSPOD_SECRET_KEY=your_dnspod_secret_key
DNS_ROOT_DOMAIN=example.com  # 你要管理的主域名
DNS_DEFAULT_TTL=600
```

> 💡 **提示**: 不配置 DNSPod 也可以使用系统的其他功能，只是无法自动创建 DNS 记录。

### Cookie 配置

```bash
COOKIE_DOMAIN=  # 开发环境留空
COOKIE_SECURE=false  # 生产环境改为true
```

---

## 📦 部署指南

### 开发环境部署

已在上面的[快速开始](#快速开始)中说明。

### 生产环境部署

#### 1. 服务器准备

```bash
# 系统要求
- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- 2GB+ RAM
- 10GB+ 磁盘空间
- 公网IP

# 安装Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

#### 2. 安全配置

```bash
# 生成强密钥
openssl rand -base64 32  # 用于JWT_SECRET
openssl rand -base64 32  # 用于JWT_REFRESH_SECRET

# 更新.env文件
vim .env
```

**必须修改的配置**:

- ✅ `POSTGRES_PASSWORD` - 数据库密码
- ✅ `JWT_SECRET` - JWT 密钥
- ✅ `JWT_REFRESH_SECRET` - 刷新令牌密钥
- ✅ `PUBLIC_WEB_URL` - 你的前端域名
- ✅ `PUBLIC_API_URL` - 你的 API 域名
- ✅ `COOKIE_SECURE=true` - 启用 HTTPS cookie
- ✅ 邮件服务配置
- ✅ DNSPod API 配置（如需使用）

#### 3. 域名配置

```bash
# DNS设置（在你的域名服务商处）
A记录: yourdomain.com -> 服务器IP
A记录: api.yourdomain.com -> 服务器IP
```

#### 4. 启动服务

```bash
# 拉取最新代码
git pull origin main

# 启动服务
docker compose up -d --build

# 验证服务
docker compose ps
docker compose logs -f
```

#### 5. 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 常用管理命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs api          # API日志
docker compose logs web          # Web日志
docker compose logs db           # 数据库日志
docker compose logs -f           # 实时查看所有日志

# 重启服务
docker compose restart           # 重启所有服务
docker compose restart api       # 只重启API

# 停止服务
docker compose down              # 停止并删除容器
docker compose down -v           # 同时删除数据卷（⚠️ 会删除数据）

# 更新服务
git pull
docker compose up -d --build

# 数据库备份
docker compose exec db pg_dump -U domainapp domainapp > backup_$(date +%Y%m%d).sql

# 数据库恢复
docker compose exec -T db psql -U domainapp domainapp < backup_20251004.sql
```

---

## 📖 使用说明

### 用户角色

| 角色     | 权限                             |
| -------- | -------------------------------- |
| 管理员   | 审批申请、用户管理、查看所有记录 |
| 普通用户 | 提交申请、查看自己的记录         |

### 域名分发流程

```
┌──────────────┐
│ 用户提交申请   │  填写子域名、记录类型、指向值
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 状态：待审核   │  显示在"我的域名分发"列表中
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 管理员审核     │  管理员在后台审批
└──────┬───────┘
       │
       ├──拒绝──→ 状态：已禁用
       │
       └──通过──→ 状态：已激活 + 自动创建DNS记录
```

### 功能演示

#### 1. 注册账号

```
访问: http://localhost:3000
点击: 注册
填写: 邮箱和密码（至少8位）
注意: 第一个注册的用户自动成为管理员
```

#### 2. 申请域名分发

```
登录后 → 点击"申请新分发" → 填写表单：
- 子域名: test
- 类型: A记录
- 指向值: 192.168.1.100
- TTL: 600
→ 提交申请
```

#### 3. 管理员审批

```
以管理员身份登录 → 点击"管理后台" → 查看待审核申请 → 批准
```

---

## 💻 开发指南

### 本地开发环境

#### 后端开发

```bash
cd api

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动数据库（使用Docker）
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=domainapp \
  -e POSTGRES_USER=domainapp \
  -e POSTGRES_PASSWORD=dev123 \
  -p 5432:5432 \
  postgres:16

# 设置环境变量
export DATABASE_URL=postgresql://domainapp:dev123@localhost/domainapp
export JWT_SECRET=dev-secret-key

# 运行迁移
alembic upgrade head

# 启动开发服务器
uvicorn app.main:app --reload --port 8000
```

#### 前端开发

```bash
cd web

# 安装依赖
npm install

# 设置环境变量
echo "PUBLIC_API_URL=http://localhost:8000" > .env.local

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 代码风格

```bash
# Python (后端)
pip install black flake8
black api/
flake8 api/

# TypeScript (前端)
cd web
npm run lint
npm run format
```

### 数据库迁移

```bash
cd api

# 创建新迁移
alembic revision --autogenerate -m "描述你的改动"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

---

## 📚 API 文档

启动服务后访问:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### 主要 API 端点

#### 认证相关

```
POST   /auth/register     注册用户
POST   /auth/login        登录
POST   /auth/refresh      刷新令牌
GET    /auth/verify       邮箱验证
```

#### 用户相关

```
GET    /users/me          获取当前用户信息
```

#### 域名分发

```
POST   /allocations/      创建分配申请
GET    /allocations/mine  获取我的申请列表
```

#### 管理员

```
GET    /admin/users                     获取用户列表
PATCH  /admin/users/{id}                更新用户
GET    /admin/allocations               获取所有申请
POST   /admin/allocations/{id}/approve  批准申请
POST   /admin/allocations/{id}/disable  禁用申请
```

---

## ❓ 常见问题

### Q: 登录后提示"Token verification failed"怎么办？

**A**: 这个问题已经在最新版本修复。确保使用最新代码，JWT 的`sub`字段已正确转换为字符串类型。

### Q: 邮件发送失败怎么办？

**A**:

1. 检查邮件配置是否正确
2. 如果使用 Gmail，需要开启"应用专用密码"
3. 如果暂时不需要邮件功能，可以直接在数据库中验证用户：

```sql
UPDATE users SET email_verified_at = NOW() WHERE email = 'your@email.com';
```

### Q: 如何重置管理员密码？

**A**:

```bash
# 进入数据库
docker compose exec db psql -U domainapp domainapp

# 重置密码（密码将被设为 "newpassword123"）
UPDATE users SET password_hash = '$argon2id$...' WHERE role = 'admin';
```

### Q: 端口被占用怎么办？

**A**: 修改`docker-compose.yml`中的端口映射：

```yaml
ports:
  - "3001:3000" # 前端改为3001
  - "8001:8000" # API改为8001
```

### Q: 如何查看详细错误信息？

**A**:

```bash
# 查看API日志
docker compose logs api -f

# 查看Web日志
docker compose logs web -f
```

---

## 🔧 故障排除

### 服务无法启动

```bash
# 检查端口占用
netstat -tuln | grep -E '3000|8000|5432'

# 清理旧容器
docker compose down -v
docker system prune -a

# 重新构建
docker compose up -d --build
```

### 数据库连接失败

```bash
# 检查数据库状态
docker compose exec db pg_isready -U domainapp

# 查看数据库日志
docker compose logs db

# 重启数据库
docker compose restart db
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.0.0 (2025-10-04)

- ✅ 修复 JWT token 验证问题
- ✅ 完善用户认证流程
- ✅ 优化 Docker 部署配置
- ✅ 更新文档

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [DNSPod](https://www.dnspod.cn/)

---

<div align="center">

**[⬆ 回到顶部](#dns-max-域名分发管理系统)**

Made with ❤️ by DNS-Max Team

</div>
