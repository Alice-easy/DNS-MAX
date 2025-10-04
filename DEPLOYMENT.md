# DNS-Max 部署指南

本文档提供详细的部署说明，包括开发环境和生产环境的完整部署流程。

---

## 📋 目录

- [系统要求](#系统要求)
- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [Docker 部署详解](#docker部署详解)
- [环境变量详解](#环境变量详解)
- [常用运维命令](#常用运维命令)
- [监控与日志](#监控与日志)
- [备份与恢复](#备份与恢复)
- [性能优化](#性能优化)
- [故障排除](#故障排除)

---

## 🖥 系统要求

### 硬件要求

| 环境     | CPU   | 内存  | 磁盘   |
| -------- | ----- | ----- | ------ |
| 开发环境 | 2 核  | 4GB   | 10GB   |
| 小型生产 | 2 核  | 4GB   | 20GB   |
| 中型生产 | 4 核  | 8GB   | 50GB   |
| 大型生产 | 8 核+ | 16GB+ | 100GB+ |

### 软件要求

#### 必需软件

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git** 2.0+

#### 操作系统支持

- ✅ Ubuntu 20.04 / 22.04 / 24.04
- ✅ Debian 11 / 12
- ✅ CentOS 8 / Rocky Linux 8+
- ✅ macOS 12+
- ✅ Windows 10/11 + WSL2

---

## 🚀 开发环境部署

### 方法一：Docker 部署（推荐）

#### 1. 克隆项目

```bash
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max
```

#### 2. 配置环境变量

```bash
cp env.example .env
```

编辑`.env`文件，最小化配置：

```bash
# 数据库配置
POSTGRES_DB=domainapp
POSTGRES_USER=domainapp
POSTGRES_PASSWORD=dev123  # 开发环境密码

# JWT密钥（开发环境）
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production

# 应用URL（开发环境）
PUBLIC_WEB_URL=http://localhost:3000
PUBLIC_API_URL=http://localhost:8000

# 邮件配置（可选，留空则跳过邮件验证）
MAIL_PROVIDER=RESEND
RESEND_API_KEY=  # 留空

# Cookie配置
COOKIE_DOMAIN=
COOKIE_SECURE=false
```

#### 3. 启动服务

```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

#### 4. 验证部署

```bash
# 检查API健康状态
curl http://localhost:8000/healthz

# 输出应该是：
# {"status":"ok"}

# 检查前端
curl http://localhost:3000

# 应该返回HTML页面
```

#### 5. 首次使用

1. 打开浏览器访问: http://localhost:3000
2. 点击"注册"创建账号
3. 第一个注册的用户将自动成为管理员
4. 如果没有配置邮件服务，手动验证邮箱：

```bash
# 进入数据库
docker compose exec db psql -U domainapp domainapp

# 验证用户邮箱
UPDATE users SET email_verified_at = NOW() WHERE email = 'your@email.com';

# 退出
\q
```

### 方法二：本地开发（不使用 Docker）

#### 后端设置

```bash
cd api

# 创建Python虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动PostgreSQL（使用Docker）
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=domainapp \
  -e POSTGRES_USER=domainapp \
  -e POSTGRES_PASSWORD=dev123 \
  -p 5432:5432 \
  postgres:16

# 设置环境变量
export DATABASE_URL="postgresql://domainapp:dev123@localhost/domainapp"
export JWT_SECRET="dev-jwt-secret"
export JWT_REFRESH_SECRET="dev-refresh-secret"

# 运行数据库迁移
cd api
alembic upgrade head

# 启动API服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端设置

```bash
cd web

# 安装依赖
npm install

# 创建环境变量文件
cat > .env.local << EOF
PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
PUBLIC_WEB_URL=http://localhost:3000
COOKIE_SECURE=false
EOF

# 启动开发服务器
npm run dev
```

---

## 🌐 生产环境部署

### 前置准备

#### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl git wget vim ufw

# 安装Docker
curl -fsSL https://get.docker.com | sh

# 将当前用户添加到docker组
sudo usermod -aG docker $USER

# 重新登录以使组权限生效
exit
# 重新SSH登录
```

#### 2. 配置防火墙

```bash
# 启用防火墙
sudo ufw enable

# 开放必要端口
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS

# 查看状态
sudo ufw status
```

### 部署步骤

#### 1. 克隆项目

```bash
# 创建部署目录
sudo mkdir -p /opt/apps
cd /opt/apps

# 克隆代码
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max

# 设置权限
sudo chown -R $USER:$USER /opt/apps/DNS-Max
```

#### 2. 配置生产环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置文件
vim .env
```

**生产环境必须修改的配置**：

```bash
# ===== 数据库配置 =====
POSTGRES_DB=domainapp
POSTGRES_USER=domainapp
POSTGRES_PASSWORD=<生成强密码>  # ⚠️ 必须修改

# ===== JWT密钥（必须修改）=====
JWT_SECRET=<生成32+字符的随机密钥>  # ⚠️ 必须修改
JWT_REFRESH_SECRET=<生成32+字符的随机密钥>  # ⚠️ 必须修改
ACCESS_TOKEN_TTL_MIN=30
REFRESH_TOKEN_TTL_DAYS=14

# ===== 应用URL =====
PUBLIC_WEB_URL=https://yourdomain.com  # ⚠️ 修改为你的域名
PUBLIC_API_URL=https://api.yourdomain.com  # ⚠️ 修改为你的API域名

# ===== 邮件配置 =====
# 选项1: Resend（推荐）
MAIL_PROVIDER=RESEND
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx  # ⚠️ 填写你的API密钥
EMAIL_FROM="DNS-Max <no-reply@yourdomain.com>"

# 选项2: SMTP
# MAIL_PROVIDER=SMTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM="DNS-Max <your-email@gmail.com>"

# ===== DNSPod配置 =====
DNSPOD_SECRET_ID=<你的DNSPod Secret ID>  # ⚠️ 填写
DNSPOD_SECRET_KEY=<你的DNSPod Secret Key>  # ⚠️ 填写
DNS_ROOT_DOMAIN=yourdomain.com  # ⚠️ 你要管理的主域名
DNS_DEFAULT_TTL=600

# ===== Cookie配置 =====
COOKIE_DOMAIN=yourdomain.com  # 顶级域名，用于跨子域共享
COOKIE_SECURE=true  # ⚠️ 生产环境必须true
```

#### 3. 生成安全密钥

```bash
# 生成JWT密钥
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)"

# 生成数据库密码
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"

# 将生成的值复制到.env文件中
```

#### 4. DNS 配置

在你的域名服务商处添加 DNS 记录：

```
类型    主机记录    记录值
A      @          服务器IP
A      api        服务器IP
A      www        服务器IP
```

等待 DNS 解析生效（通常 5-30 分钟）：

```bash
# 验证DNS解析
nslookup yourdomain.com
nslookup api.yourdomain.com
```

#### 5. 启动服务

```bash
# 构建并启动服务
docker compose up -d --build

# 查看启动日志
docker compose logs -f

# 等待所有服务启动完成
# 看到以下日志表示成功：
# api-1  | INFO:     Uvicorn running on http://0.0.0.0:8000
# web-1  | Ready in ...ms
```

#### 6. 验证部署

```bash
# 检查服务状态
docker compose ps

# 应该看到所有服务都是 "Up" 状态

# 测试API
curl https://api.yourdomain.com/healthz

# 测试前端
curl https://yourdomain.com
```

#### 7. 创建管理员账号

1. 访问 https://yourdomain.com
2. 点击"注册"
3. 填写邮箱和密码
4. 第一个注册的用户自动成为管理员
5. 如果配置了邮件服务，检查邮箱验证邮件
6. 如果没有邮件服务，手动验证：

```bash
docker compose exec db psql -U domainapp domainapp -c \
  "UPDATE users SET email_verified_at = NOW() WHERE id = 1;"
```

---

## 🐳 Docker 部署详解

### docker-compose.yml 说明

```yaml
version: "3.9"

services:
  # PostgreSQL 数据库
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # FastAPI 后端
  api:
    build: ./api
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 10
    restart: unless-stopped

  # Next.js 前端
  web:
    build: ./web
    environment:
      - PUBLIC_API_URL=http://api:8000
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - PUBLIC_WEB_URL=${PUBLIC_WEB_URL}
      - COOKIE_SECURE=${COOKIE_SECURE}
      # ... 其他环境变量
    ports:
      - "3000:3000"
    depends_on:
      - api
    restart: unless-stopped

volumes:
  dbdata: # 持久化数据库数据
```

### 容器健康检查

所有服务都配置了健康检查，确保服务正常运行：

```bash
# 查看健康状态
docker compose ps

# 单独检查某个服务
docker inspect dns-max-api-1 | grep -A 10 "Health"
```

---

## 🔧 环境变量详解

### 数据库配置

```bash
# 数据库名称
POSTGRES_DB=domainapp

# 数据库用户
POSTGRES_USER=domainapp

# 数据库密码（必须修改）
POSTGRES_PASSWORD=your_secure_password_here
```

### JWT 认证配置

```bash
# 访问令牌密钥（至少32字符）
JWT_SECRET=your_jwt_secret_at_least_32_characters

# 刷新令牌密钥（至少32字符）
JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_characters

# 访问令牌有效期（分钟）
ACCESS_TOKEN_TTL_MIN=30

# 刷新令牌有效期（天）
REFRESH_TOKEN_TTL_DAYS=14
```

### 应用 URL 配置

```bash
# 前端访问地址
PUBLIC_WEB_URL=http://localhost:3000  # 开发环境
# PUBLIC_WEB_URL=https://yourdomain.com  # 生产环境

# API访问地址
PUBLIC_API_URL=http://localhost:8000  # 开发环境
# PUBLIC_API_URL=https://api.yourdomain.com  # 生产环境
```

### 邮件服务配置

#### Resend 配置（推荐）

```bash
MAIL_PROVIDER=RESEND
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM="DNS-Max <no-reply@yourdomain.com>"
```

#### SMTP 配置

```bash
MAIL_PROVIDER=SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="DNS-Max <your-email@gmail.com>"
```

#### Gmail SMTP 配置步骤

1. 启用 2FA：https://myaccount.google.com/security
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 使用生成的密码作为`SMTP_PASS`

### DNSPod 配置

```bash
# DNSPod API凭据
DNSPOD_SECRET_ID=your_secret_id
DNSPOD_SECRET_KEY=your_secret_key

# 要管理的主域名
DNS_ROOT_DOMAIN=example.com

# DNS记录默认TTL（秒）
DNS_DEFAULT_TTL=600
```

#### 获取 DNSPod 凭据

1. 登录 DNSPod 控制台：https://console.dnspod.cn/
2. 访问 API 密钥管理：https://console.dnspod.cn/account/token/apikey
3. 创建密钥，获取 Secret ID 和 Secret Key

### Cookie 配置

```bash
# Cookie域名（留空则使用当前域名）
COOKIE_DOMAIN=  # 开发环境
# COOKIE_DOMAIN=yourdomain.com  # 生产环境

# 是否启用安全Cookie（HTTPS环境必须为true）
COOKIE_SECURE=false  # 开发环境
# COOKIE_SECURE=true  # 生产环境
```

---

## 🛠 常用运维命令

### 服务管理

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务
docker compose down

# 重启所有服务
docker compose restart

# 重启单个服务
docker compose restart api
docker compose restart web
docker compose restart db

# 查看服务状态
docker compose ps

# 查看资源使用
docker stats
```

### 日志管理

```bash
# 查看所有服务日志
docker compose logs

# 实时跟踪日志
docker compose logs -f

# 查看特定服务日志
docker compose logs api
docker compose logs web
docker compose logs db

# 查看最近100行日志
docker compose logs --tail=100

# 查看带时间戳的日志
docker compose logs -t

# 过滤日志
docker compose logs api | grep ERROR
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker compose up -d --build

# 查看更新日志
docker compose logs -f
```

### 容器管理

```bash
# 进入容器
docker compose exec api bash     # API容器
docker compose exec web sh       # Web容器
docker compose exec db bash      # 数据库容器

# 在容器中执行命令
docker compose exec api python -c "print('Hello')"

# 查看容器资源使用
docker compose top

# 清理未使用的资源
docker system prune -a
```

---

## 📊 监控与日志

### 健康检查

```bash
# API健康检查
curl http://localhost:8000/healthz

# 数据库健康检查
docker compose exec db pg_isready -U domainapp

# 查看所有服务健康状态
docker compose ps
```

### 日志级别配置

编辑`api/app/main.py`修改日志级别：

```python
import logging

# 设置日志级别
logging.basicConfig(
    level=logging.INFO,  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    format='%(asctime)s | %(levelname)s | %(message)s'
)
```

### 日志文件持久化

修改`docker-compose.yml`添加日志卷：

```yaml
services:
  api:
    volumes:
      - ./logs:/app/logs
```

---

## 💾 备份与恢复

### 数据库备份

#### 手动备份

```bash
# 创建备份目录
mkdir -p backups

# 备份数据库
docker compose exec db pg_dump -U domainapp domainapp > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# 压缩备份
gzip backups/backup_*.sql
```

#### 自动备份脚本

创建`backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/opt/apps/DNS-Max/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.sql"

# 创建备份
docker compose exec -T db pg_dump -U domainapp domainapp > "${BACKUP_DIR}/${FILENAME}"

# 压缩
gzip "${BACKUP_DIR}/${FILENAME}"

# 删除30天前的备份
find "${BACKUP_DIR}" -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${FILENAME}.gz"
```

设置定时任务：

```bash
chmod +x backup.sh

# 添加到crontab（每天凌晨2点备份）
crontab -e

# 添加以下行
0 2 * * * cd /opt/apps/DNS-Max && ./backup.sh >> /var/log/dns-max-backup.log 2>&1
```

### 数据库恢复

```bash
# 从备份恢复
gunzip -c backups/backup_20251004_020000.sql.gz | \
  docker compose exec -T db psql -U domainapp domainapp

# 或者不解压直接恢复
docker compose exec -T db psql -U domainapp domainapp < backups/backup_20251004_020000.sql
```

### 完整系统备份

```bash
# 备份配置和数据
tar -czf dns-max-backup-$(date +%Y%m%d).tar.gz \
  .env \
  backups/ \
  docker-compose.yml

# 备份Docker卷
docker run --rm \
  -v dns-max_dbdata:/data \
  -v $(pwd)/backups:/backup \
  alpine tar -czf /backup/dbdata-$(date +%Y%m%d).tar.gz /data
```

---

## ⚡ 性能优化

### 数据库优化

#### PostgreSQL 配置调优

创建`postgresql.conf`：

```ini
# 连接设置
max_connections = 100
shared_buffers = 256MB

# 查询优化
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# WAL设置
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

挂载到容器：

```yaml
services:
  db:
    volumes:
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
```

#### 创建索引

```sql
-- 进入数据库
docker compose exec db psql -U domainapp domainapp

-- 创建常用索引
CREATE INDEX IF NOT EXISTS idx_allocations_user_status
  ON allocations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_allocations_status
  ON allocations(status);

CREATE INDEX IF NOT EXISTS idx_users_email
  ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_email_verified
  ON users(email_verified_at);
```

### 应用优化

#### API 并发配置

编辑`api/start.sh`：

```bash
#!/bin/bash
# 等待数据库就绪
# ...

# 启动API服务器（调整workers数量）
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --loop uvloop \
  --http httptools
```

#### 前端构建优化

编辑`web/next.config.js`：

```javascript
module.exports = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};
```

---

## 🔍 故障排除

### 问题：服务无法启动

**症状**：`docker compose up -d`后服务状态为 Exit

**解决方案**：

```bash
# 查看详细错误
docker compose logs api
docker compose logs web
docker compose logs db

# 检查端口占用
netstat -tuln | grep -E '3000|8000|5432'

# 清理并重启
docker compose down -v
docker compose up -d --build
```

### 问题：数据库连接失败

**症状**：API 日志显示数据库连接错误

**解决方案**：

```bash
# 检查数据库状态
docker compose ps db

# 检查数据库日志
docker compose logs db

# 测试数据库连接
docker compose exec db pg_isready -U domainapp

# 检查环境变量
docker compose exec api env | grep POSTGRES

# 重启数据库
docker compose restart db
```

### 问题：Token 验证失败

**症状**：登录后立即跳转回登录页

**解决方案**：

```bash
# 检查JWT密钥是否配置
docker compose exec api env | grep JWT

# 查看API日志中的详细错误
docker compose logs api | grep -i token

# 确保JWT_SECRET已正确配置
vim .env

# 重启API服务
docker compose restart api
```

### 问题：前端无法连接 API

**症状**：前端显示网络错误

**解决方案**：

```bash
# 检查API是否运行
curl http://localhost:8000/healthz

# 检查环境变量
docker compose exec web env | grep API_URL

# 查看网络连接
docker compose exec web ping api

# 重启服务
docker compose restart web api
```

### 问题：邮件发送失败

**症状**：注册后没收到验证邮件

**解决方案**：

```bash
# 查看邮件发送日志
docker compose logs api | grep -i mail

# 检查邮件配置
docker compose exec api env | grep -E 'MAIL|SMTP|RESEND'

# 手动验证用户
docker compose exec db psql -U domainapp domainapp -c \
  "UPDATE users SET email_verified_at = NOW() WHERE email = 'user@example.com';"
```

### 问题：磁盘空间不足

**解决方案**：

```bash
# 查看磁盘使用
df -h

# 查看Docker磁盘使用
docker system df

# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 清理构建缓存
docker builder prune
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看本文档的[故障排除](#故障排除)部分
2. 查看[常见问题](README.md#常见问题)
3. 提交 Issue：https://github.com/Alice-easy/DNS-Max/issues
4. 查看详细日志：`docker compose logs -f`

---

## 🔄 更新日志

### v1.0.0 (2025-10-04)

- ✅ 初始版本发布
- ✅ 完整的 Docker 部署支持
- ✅ 详细的部署文档
- ✅ 生产环境配置指南

---

<div align="center">

**[⬆ 返回顶部](#dns-max-部署指南)**

</div>
