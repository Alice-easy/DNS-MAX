# 环境配置说明

本文档详细说明了 DNS Max 系统的环境配置方法和最佳实践。

## 📁 配置文件说明

系统提供了多个环境配置文件模板：

- `.env.example` - 通用配置模板，包含所有可配置项的说明
- `.env.dev` - 开发环境配置模板
- `.env.prod` - 生产环境配置模板
- `.env` - 实际使用的配置文件（需要手动创建）

## 🚀 快速配置

### 开发环境

```bash
# 复制开发环境配置
cp .env.dev .env

# 根据需要修改配置
vim .env
```

### 生产环境

```bash
# 复制生产环境配置
cp .env.prod .env

# 重要：修改所有安全相关配置
vim .env
```

## 🔧 配置项详解

### 1. 数据库配置

#### PostgreSQL 配置

```bash
# 基本格式
DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名

# 开发环境示例
DATABASE_URL=postgresql://dns_max_user:dns_max_password@localhost:5432/dns_max_dev

# 生产环境示例（启用SSL）
DATABASE_URL=postgresql://dns_max_user:STRONG_PASSWORD@postgres:5432/dns_max?sslmode=require
```

**注意事项：**

- 生产环境必须使用强密码
- 建议启用 SSL 连接
- 确保数据库用户权限最小化

### 2. Redis 配置

```bash
# 基本格式
REDIS_URL=redis://主机:端口/数据库编号

# 本地Redis
REDIS_URL=redis://localhost:6379

# 带密码的Redis
REDIS_URL=redis://:密码@主机:端口

# Redis集群
REDIS_URL=redis://主机1:端口1,主机2:端口2,主机3:端口3
```

### 3. JWT 认证配置

```bash
# 密钥生成方法
openssl rand -hex 32

# 开发环境（简单密钥）
SECRET_KEY=dev_secret_key_only_for_development

# 生产环境（强密钥，至少32字符）
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**安全建议：**

- 生产环境必须使用强随机密钥
- 定期轮换密钥
- 密钥长度不少于 32 字符

### 4. 跨域配置

```bash
# 开发环境（允许本地开发）
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# 生产环境（只允许信任域名）
BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

### 5. 前端 API 配置

```bash
# 开发环境
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# 生产环境
NEXT_PUBLIC_API_URL=https://yourdomain.com/api/v1
```

### 6. 邮件配置

#### Gmail 配置示例

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password  # 使用应用密码，不是登录密码
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

#### 企业邮箱配置示例

```bash
SMTP_HOST=smtp.exmail.qq.com  # 腾讯企业邮箱
SMTP_PORT=587
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your_mailbox_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### 7. 监控配置

#### Sentry 错误监控

```bash
# 在 https://sentry.io 创建项目获取DSN
SENTRY_DSN=https://your_key@sentry.io/your_project_id

# 启用性能监控
ENABLE_METRICS=true
```

#### 日志级别

```bash
# 可选值：DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO  # 开发环境使用DEBUG，生产环境使用WARNING
```

## 🔒 安全配置最佳实践

### 1. 密钥管理

```bash
# 生成强密钥
openssl rand -base64 32

# 生成UUID作为密钥
python -c "import uuid; print(uuid.uuid4().hex)"

# 生成64位随机字符串
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 2. 数据库安全

```bash
# 创建专用数据库用户
CREATE USER dns_max_user WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE dns_max OWNER dns_max_user;

# 授予最小权限
GRANT CONNECT ON DATABASE dns_max TO dns_max_user;
GRANT USAGE ON SCHEMA public TO dns_max_user;
GRANT CREATE ON SCHEMA public TO dns_max_user;
```

### 3. 生产环境额外配置

```bash
# 强制HTTPS
FORCE_HTTPS=true

# 安全Cookie
SECURE_COOKIES=true

# 启用限流
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60

# 文件上传限制
MAX_UPLOAD_SIZE=5242880  # 5MB
```

## 🐳 Docker 环境变量

### docker-compose.yml 中的环境变量

```yaml
services:
  backend:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - SECRET_KEY=${SECRET_KEY}
    env_file:
      - .env
```

### 使用 Docker secrets（推荐生产环境）

```yaml
version: "3.8"

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

services:
  backend:
    secrets:
      - db_password
      - jwt_secret
    environment:
      - DATABASE_URL=postgresql://dns_max_user:$(cat /run/secrets/db_password)@postgres:5432/dns_max
```

## 🔧 配置验证

### 1. 检查配置文件语法

```bash
# 检查环境变量是否正确加载
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DATABASE_URL:', os.getenv('DATABASE_URL'))
print('SECRET_KEY:', os.getenv('SECRET_KEY')[:10] + '...')
"
```

### 2. 测试数据库连接

```bash
# 使用psql测试连接
psql "postgresql://dns_max_user:password@localhost:5432/dns_max"

# 使用Python测试连接
python -c "
import asyncpg
import asyncio

async def test_db():
    conn = await asyncpg.connect('postgresql://dns_max_user:password@localhost:5432/dns_max')
    result = await conn.fetchval('SELECT version()')
    print('Database connection successful:', result)
    await conn.close()

asyncio.run(test_db())
"
```

### 3. 测试 Redis 连接

```bash
# 使用redis-cli测试
redis-cli ping

# 使用Python测试
python -c "
import redis
r = redis.from_url('redis://localhost:6379')
print('Redis connection successful:', r.ping())
"
```

## 🚀 部署环境配置

### 1. 开发环境启动

```bash
# 复制开发配置
cp .env.dev .env

# 启动开发数据库
docker-compose -f docker-compose.dev.yml up -d

# 启动后端
cd backend && poetry run uvicorn app.main:app --reload

# 启动前端
cd frontend && npm run dev
```

### 2. 生产环境部署

```bash
# 复制并修改生产配置
cp .env.prod .env
vim .env  # 修改所有密钥和密码

# 启动生产服务
docker-compose up -d

# 检查服务状态
docker-compose ps
docker-compose logs -f
```

## 📋 配置检查清单

部署前请确认以下配置项：

### 开发环境

- [ ] 数据库连接正常
- [ ] Redis 连接正常
- [ ] JWT 密钥已设置
- [ ] 跨域配置包含开发域名
- [ ] 日志级别设为 DEBUG

### 生产环境

- [ ] 使用强数据库密码
- [ ] JWT 密钥为强随机字符串（32+字符）
- [ ] 跨域只允许生产域名
- [ ] 启用 HTTPS
- [ ] 配置错误监控
- [ ] 邮件配置正确
- [ ] 日志级别适当
- [ ] 启用限流保护
- [ ] 文件上传大小限制合理

## 🆘 常见问题

### Q: 如何生成安全的密钥？

```bash
# 方法1：使用openssl
openssl rand -hex 32

# 方法2：使用Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 方法3：使用uuidgen
uuidgen | tr -d '-'
```

### Q: 数据库连接失败怎么办？

1. 检查数据库是否启动
2. 验证连接字符串格式
3. 确认用户名密码正确
4. 检查网络连接和防火墙

### Q: 如何在 Docker 中使用环境变量？

```yaml
# 方法1：直接在docker-compose.yml中设置
environment:
  - SECRET_KEY=your_secret_key

# 方法2：使用.env文件
env_file:
  - .env

# 方法3：在命令行传递
docker run -e SECRET_KEY=your_secret_key your_image
```

### Q: 如何在生产环境轮换密钥？

1. 生成新的密钥
2. 更新配置文件
3. 重启服务
4. 验证服务正常
5. 通知用户重新登录（如果更换 JWT 密钥）

---

**重要提醒**：生产环境部署前，请务必仔细检查所有配置项，确保安全性！
