# 域名分发系统

基于 Next.js + FastAPI + DNSPod 的域名分发管理平台

## 功能特性

- 🔐 用户注册登录（邮箱验证）
- 👑 首个注册用户自动成为管理员
- 🌐 域名解析记录分发申请与审批
- 📧 支持 SMTP 和 Resend 邮件发送
- 🛡️ 基于角色的权限控制
- 🚀 Docker 一键部署
- 🔒 生产环境安全配置

## 技术栈

### 后端
- **FastAPI**: Python 异步 Web 框架
- **PostgreSQL**: 数据库
- **SQLAlchemy**: ORM
- **Alembic**: 数据库迁移
- **JWT**: 身份认证
- **Argon2**: 密码哈希
- **DNSPod API**: 域名解析服务

### 前端
- **Next.js 14**: React 框架 (App Router)
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **React Hook Form**: 表单处理

### 基础设施
- **Docker Compose**: 容器编排
- **Caddy**: 反向代理 + 自动HTTPS
- **Redis**: 缓存（可选）

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd DNS-Max
```

### 2. 配置环境变量
```bash
cp env.example .env
# 编辑 .env 文件，配置您的域名、邮件服务和DNSPod凭据
```

### 3. 启动服务
```bash
docker compose up -d --build
```

### 4. 访问应用
- 前端：https://yourdomain.com
- API文档：https://api.yourdomain.com/docs

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `POSTGRES_DB` | 数据库名 | `domainapp` |
| `POSTGRES_USER` | 数据库用户 | `domainapp` |
| `POSTGRES_PASSWORD` | 数据库密码 | `strongpassword` |
| `JWT_SECRET` | JWT密钥 | `change_me_super_long` |
| `PUBLIC_WEB_URL` | 前端地址 | `https://yourdomain.com` |
| `PUBLIC_API_URL` | API地址 | `https://api.yourdomain.com` |
| `MAIL_PROVIDER` | 邮件服务商 | `RESEND` 或 `SMTP` |
| `RESEND_API_KEY` | Resend API密钥 | `re_xxx` |
| `DNSPOD_SECRET_ID` | DNSPod Secret ID | `xxx` |
| `DNSPOD_SECRET_KEY` | DNSPod Secret Key | `yyy` |
| `DNS_ROOT_DOMAIN` | 主域名 | `example.com` |

## 使用说明

### 初始化设置
1. 首个注册的用户将自动成为管理员
2. 用户注册后需要验证邮箱才能使用
3. 管理员可以审批域名分发申请

### 域名分发流程
1. 普通用户提交分发申请（子域名 + 解析记录）
2. 管理员在后台审核申请
3. 审核通过后自动创建DNSPod解析记录
4. 用户可以使用分配的子域名

### 管理员功能
- 用户管理（角色分配、账号启用/禁用）
- 分发申请审批
- 域名记录管理

## 开发

### 本地开发环境
```bash
# 后端
cd api
pip install -r requirements.txt
uvicorn app.main:app --reload

# 前端
cd web
npm install
npm run dev
```

### 数据库迁移
```bash
cd api
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 部署说明

### 生产环境安全要点
- 修改默认JWT密钥
- 配置强密码策略
- 使用HTTPS（Caddy自动配置）
- 定期备份数据库
- 监控系统日志

### 域名配置
1. 将域名DNS指向服务器IP
2. 更新 `.env` 中的域名配置
3. 重启服务让Caddy生成SSL证书

## API文档

启动服务后访问 `https://api.yourdomain.com/docs` 查看完整的API文档。

## 许可证

MIT License
