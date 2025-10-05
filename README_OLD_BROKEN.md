# DNS-Max 域名分发管理系统# DNS-Max 域名分发管理系统

<div align="center"><div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)![License](https://img.shields.io/badge/license-MIT-blue.svg)

![Python](https://img.shields.io/badge/python-3.12-blue.svg)![Python](https://img.shields.io/badge/python-3.12-blue.svg)

![Node](https://img.shields.io/badge/node-20-green.svg)![Node](https://img.shields.io/badge/node-20-green.svg)

![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

**基于 Next.js + FastAPI + DNSPod 的现代化域名解析分发管理平台\*\***基于 Next.js + FastAPI + DNSPod 的现代化域名解析分发管理平台\*\*

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [文档](#-文档)[快速开始](#-快速开始) • [功能特性](#-功能特性) • [在线演示](#) • [文档](#-文档)

</div></div>

---

## ✨ 功能特性## ✨ 功能特性

- 🔐 **安全认证** - JWT + Argon2 密码加密- 🔐 **安全认证** - JWT + Argon2 密码加密

- 👥 **用户管理** - 角色权限控制- 👥 **用户管理** - 角色权限控制

- 🌐 **域名分发** - 自动化 DNS 记录管理- 🌐 **域名分发** - 自动化 DNS 记录管理

- ✅ **审批流程** - 管理员审核机制- ✅ **审批流程** - 管理员审核机制

- 📧 **邮件通知** - SMTP/Resend 双支持- 📧 **邮件通知** - SMTP/Resend 双支持

- ⚙️ **后台配置** - Web 界面管理系统配置- ⚙️ **后台配置** - Web 界面管理系统配置

- 🚀 **一键部署** - Docker Compose- 🚀 **一键部署** - Docker Compose

## 🚀 快速开始## 🚀 快速开始

### 3 分钟部署### 3 分钟部署

`bash`bash

# 1. 克隆项目# 1. 克隆项目

git clone https://github.com/Alice-easy/DNS-Max.gitgit clone https://github.com/Alice-easy/DNS-Max.git

cd DNS-Maxcd DNS-Max

# 2. 配置并启动# 2. 启动服务（使用默认配置）

cp env.example .envcp env.example .env

docker-compose up -d --builddocker-compose up -d --build

# 3. 访问应用# 3. 访问应用

# http://localhost:3000# 打开浏览器访问 http://localhost:3000

````



### 首次使用**就这么简单！** 🎉



1. 注册账号（第一个用户自动成为管理员）### 首次使用

2. 访问"管理员后台" → "系统配置"

3. 配置邮件和 DNSPod（可选）1. 访问 http://localhost:3000 注册账号

2. **第一个用户自动成为管理员**

> 💡 配置可在部署后通过 Web 界面完成，无需修改环境变量3. 登录后访问"管理员后台" → "系统配置"

4. 配置邮件服务和 DNSPod（可选）

### 访问地址

> � **提示**: 邮件和 DNSPod 可在部署后通过 Web 界面配置，无需修改环境变量

| 服务 | 地址 |

|------|------|### 访问地址

| 前端 | http://localhost:3000 |

| API | http://localhost:8000/docs || 服务     | 地址                          |

| -------- | ----------------------------- |

## 📖 文档| 前端     | http://localhost:3000         |

| API 文档 | http://localhost:8000/docs    |

| 文档 | 说明 || 健康检查 | http://localhost:8000/healthz |

|------|------|

| [快速开始](docs/QUICKSTART.md) | 详细部署指南 |## ⚙️ 配置说明

| [配置说明](docs/CONFIGURATION.md) | 环境变量和系统配置 |

| [部署指南](docs/DEPLOYMENT.md) | 生产环境部署 |### 必需配置（.env 文件）

| [API文档](docs/API.md) | 接口文档 |

| [故障排除](docs/TROUBLESHOOTING.md) | 常见问题 |```bash

# 数据库

## 🛠 技术栈POSTGRES_PASSWORD=strongpassword123  # 请修改



**后端**: FastAPI + PostgreSQL + SQLAlchemy + Alembic  # JWT 密钥（必须修改）

**前端**: Next.js 14 + TypeScript + Tailwind CSS  JWT_SECRET=your_32_chars_secret_key_here

**部署**: Docker + Docker Compose  JWT_REFRESH_SECRET=your_32_chars_refresh_secret_here

**集成**: DNSPod API + Resend/SMTP

# 应用 URL

## 📦 项目结构PUBLIC_WEB_URL=http://localhost:3000

PUBLIC_API_URL=http://localhost:8000

````

DNS-Max/

├── api/ # FastAPI 后端### 可选配置（管理员后台）

│ ├── app/

│ │ ├── routers/ # API 路由**从 v2.0 开始，以下配置已移至 Web 界面管理：**

│ │ ├── models.py # 数据模型

│ │ └── main.py # 应用入口- ✅ 邮件服务（SMTP / Resend）

│ └── requirements.txt- ✅ DNSPod API 密钥

├── web/ # Next.js 前端- ✅ DNS 根域名和 TTL

│ ├── src/

│ │ ├── app/ # 页面和路由**优势**:

│ │ └── components/ # UI 组件

│ └── package.json- 无需重启服务

├── docs/ # 文档- Web 界面管理

├── docker-compose.yml- 敏感信息自动脱敏

└── env.example

````详见 → [配置文档](CONFIGURATION.md)



## 🔧 常用命令## 📖 文档



```bash| 文档                                    | 说明               |

# 查看服务状态| --------------------------------------- | ------------------ |

docker-compose ps| [快速开始](QUICKSTART.md)               | 5 分钟快速部署指南 |

| [配置说明](CONFIGURATION.md)            | 详细配置文档       |

# 查看日志| [部署指南](DEPLOYMENT.md)               | 生产环境部署       |

docker-compose logs -f| [升级指南](UPGRADE.md)                  | 版本升级说明       |

| [部署检查清单](DEPLOYMENT_CHECKLIST.md) | 部署验证清单       |

# 重启服务| [API 文档](http://localhost:8000/docs)  | 交互式 API 文档    |

docker-compose restart| [更新日志](CHANGELOG_v2.0.md)           | v2.0 版本变更      |



# 更新服务## 🛠 技术栈

git pull && docker-compose up -d --build

**后端**: FastAPI + PostgreSQL + SQLAlchemy + Alembic

# 停止服务**前端**: Next.js 14 + TypeScript + Tailwind CSS

docker-compose down**部署**: Docker + Docker Compose

```**集成**: DNSPod API + Resend/SMTP



## ❓ 常见问题## 📦 项目结构



### 部署后无法访问？```

检查端口是否被占用，查看日志：`docker-compose logs`DNS-Max/

├── api/              # FastAPI 后端

### 邮件发送失败？│   ├── app/

在管理员后台检查邮件配置，或查看 API 日志获取详细错误│   │   ├── routers/  # API 路由

│   │   ├── models.py # 数据模型

### 如何重置管理员密码？│   │   └── main.py   # 应用入口

```bash│   └── requirements.txt

docker-compose exec db psql -U domainapp domainapp├── web/              # Next.js 前端

UPDATE users SET password_hash = '...' WHERE role = 'admin';│   ├── src/

```│   │   ├── app/      # 页面和 API 路由

│   │   └── components/

更多问题 → [故障排除文档](docs/TROUBLESHOOTING.md)│   └── package.json

├── docker-compose.yml

## 🤝 贡献└── env.example

````

欢迎提交 Issue 和 Pull Request！

## 🎯 使用场景

1. Fork 本仓库

2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)- 🏢 **企业内网** - 为员工分配测试子域名

3. 提交改动 (`git commit -m 'Add AmazingFeature'`)- 🎓 **教育机构** - 为学生提供个人域名

4. 推送分支 (`git push origin feature/AmazingFeature`)- 💼 **开发团队** - 管理开发/测试环境域名

5. 提交 Pull Request- 🌐 **服务提供商** - 域名分发即服务

## 📄 许可证## 📸 界面预览

[MIT License](LICENSE)> 待添加截图

## 🙏 致谢## 🔧 常用命令

- [FastAPI](https://fastapi.tiangolo.com/)```bash

- [Next.js](https://nextjs.org/)# 查看服务状态

- [PostgreSQL](https://www.postgresql.org/)docker-compose ps

- [DNSPod](https://www.dnspod.cn/)

# 查看日志

---docker-compose logs -f api

<div align="center"># 重启服务

docker-compose restart

**⭐ 如果这个项目对你有帮助，请给个 Star ⭐**

# 更新服务

Made with ❤️ by DNS-Max Teamgit pull && docker-compose up -d --build

</div># 数据库备份

docker-compose exec db pg_dump -U domainapp domainapp > backup.sql

# 停止服务

docker-compose down

````

## ❓ 常见问题

### Q: 部署后无法访问？

检查端口是否被占用，查看日志：`docker-compose logs`

### Q: 邮件发送失败？

在管理员后台检查邮件配置，或查看 API 日志获取详细错误

### Q: 如何重置管理员密码？

```bash
docker-compose exec db psql -U domainapp domainapp
UPDATE users SET password_hash = '...' WHERE role = 'admin';
````

### Q: 如何手动验证用户邮箱？

```bash
docker-compose exec db psql -U domainapp domainapp
UPDATE users SET email_verified_at = NOW() WHERE email = 'user@example.com';
```

更多问题 → [常见问题文档](TROUBLESHOOTING.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## � 许可证

[MIT License](LICENSE)

## � 致谢

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [DNSPod](https://www.dnspod.cn/)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star ⭐**

Made with ❤️ by DNS-Max Team

</div>
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
