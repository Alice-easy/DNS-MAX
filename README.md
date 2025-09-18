# DNS Max - 统一 DNS 管理平台

<div align="center">

![DNS Max](https://img.shields.io/badge/DNS%20Max-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.0+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

一个现代化的多 DNS 服务商统一管理平台，支持阿里云、Cloudflare、腾讯云等主流 DNS 服务商的集中化管理。通过友好的 Web 界面，轻松管理多个域名和 DNS 记录，提高运维效率。

## ✨ 核心优势

### 🌐 多平台统一管理

- **多服务商支持**：集成阿里云 DNS、Cloudflare、腾讯云 DNS
- **统一操作界面**：一个平台管理所有 DNS 服务商
- **批量操作**：支持域名和 DNS 记录的批量导入、修改、删除
- **实时同步**：与各 DNS 服务商实时同步，确保数据一致性

### 🔒 安全可靠

- **JWT 认证**：安全的用户认证和权限管理
- **API 密钥加密**：所有 DNS 服务商密钥均加密存储
- **操作审计**：完整的操作日志记录，支持审计追踪
- **权限控制**：细粒度的用户权限管理

### ⚡ 高性能架构

- **现代技术栈**：FastAPI + Next.js 15 全栈架构
- **异步处理**：高并发异步 DNS 操作
- **Redis 缓存**：智能缓存提升响应速度
- **容器化部署**：Docker 容器化，一键部署

### 📱 优秀体验

- **响应式设计**：完美适配桌面端和移动端
- **直观界面**：简洁友好的用户界面
- **实时反馈**：操作结果实时显示
- **多语言支持**：支持中文和英文界面

## 🚀 快速特性

### 📋 支持的 DNS 记录类型

- **A 记录**：IPv4 地址解析
- **AAAA 记录**：IPv6 地址解析
- **CNAME 记录**：别名记录
- **MX 记录**：邮件交换记录
- **TXT 记录**：文本记录（SPF、DKIM 等）
- **NS 记录**：域名服务器记录
- **SRV 记录**：服务记录
- **CAA 记录**：证书授权记录

### 🔧 支持的 DNS 服务商

- **阿里云 DNS**：完整支持阿里云域名解析服务
- **Cloudflare DNS**：支持 Cloudflare 的全球 DNS 服务
- **腾讯云 DNS**：支持腾讯云域名解析服务
- **更多支持**：可扩展架构，轻松添加新的 DNS 服务商

## 📋 系统要求

### 最低配置要求

| 组件           | 最低要求            | 推荐配置                  |
| -------------- | ------------------- | ------------------------- |
| CPU            | 1 核心              | 2 核心以上                |
| 内存           | 1GB RAM             | 4GB RAM                   |
| 存储           | 5GB 可用空间        | 20GB SSD                  |
| 操作系统       | Linux/Windows/macOS | Ubuntu 20.04+ / CentOS 8+ |
| Docker         | 20.0+               | 最新版本                  |
| Docker Compose | 2.0+                | 最新版本                  |

### 网络要求

- **出站网络**：访问各 DNS 服务商 API（443 端口）
- **带宽要求**：最小 1Mbps 上行带宽
- **域名要求**：可选，用于配置 HTTPS 和自定义域名

## 🛠️ 技术架构

### 后端技术栈

| 技术           | 版本   | 用途             |
| -------------- | ------ | ---------------- |
| **Python**     | 3.11+  | 主要开发语言     |
| **FastAPI**    | 0.104+ | Web 框架和 API   |
| **SQLAlchemy** | 2.0+   | ORM 数据库操作   |
| **PostgreSQL** | 15+    | 主数据库         |
| **Redis**      | 7+     | 缓存和会话存储   |
| **Pydantic**   | 2.0+   | 数据验证和序列化 |
| **JWT**        | -      | 用户认证         |

### 前端技术栈

| 技术                | 版本  | 用途       |
| ------------------- | ----- | ---------- |
| **Next.js**         | 15.0+ | React 框架 |
| **TypeScript**      | 5.0+  | 类型安全   |
| **Tailwind CSS**    | 3.0+  | 样式框架   |
| **shadcn/ui**       | 最新  | UI 组件库  |
| **Zustand**         | 4.0+  | 状态管理   |
| **React Hook Form** | 7.0+  | 表单处理   |
| **Zod**             | 3.0+  | 数据验证   |

### 部署和运维

| 技术               | 版本  | 用途     |
| ------------------ | ----- | -------- |
| **Docker**         | 20.0+ | 容器化   |
| **Docker Compose** | 2.0+  | 容器编排 |
| **Nginx**          | 1.20+ | 反向代理 |
| **systemd**        | -     | 进程管理 |

## ⚡ 快速开始

### 🐳 方式一：Docker 一键部署（推荐）

这是最简单快速的部署方式，适合生产环境和快速体验。

#### 步骤 1：准备环境

```bash
# 确保已安装 Docker 和 Docker Compose
docker --version
docker-compose --version

# 如果未安装，请参考官方文档安装
```

#### 步骤 2：获取项目代码

```bash
# 克隆项目
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 检查项目结构
ls -la
```

#### 步骤 3：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件（重要：修改密钥和密码）
vim .env

# 关键配置项：
# - SECRET_KEY: JWT 密钥（必须修改）
# - POSTGRES_PASSWORD: 数据库密码（建议修改）
# - BACKEND_CORS_ORIGINS: 前端域名（根据实际情况修改）
```

#### 步骤 4：启动服务

```bash
# 启动所有服务（首次启动会自动构建镜像）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看启动日志
docker-compose logs -f
```

#### 步骤 5：验证部署

```bash
# 检查服务健康状态
curl http://localhost:8000/health

# 访问应用
echo "前端界面: http://localhost:3000"
echo "后端 API: http://localhost:8000"
echo "API 文档: http://localhost:8000/docs"
```

### 💻 方式二：本地开发环境

适合开发人员进行代码开发和调试。

#### 后端开发环境设置

```bash
# 1. 启动基础服务（数据库和Redis）
docker-compose -f docker-compose.dev.yml up -d

# 2. 进入后端目录
cd backend

# 3. 安装 Python 依赖（推荐使用 Poetry）
# 使用 Poetry
poetry install
poetry shell

# 或使用 pip
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 4. 运行数据库迁移
alembic upgrade head

# 5. 启动后端服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端开发环境设置

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装 Node.js 依赖
npm install
# 或使用 yarn
yarn install

# 3. 启动前端开发服务器
npm run dev
# 或使用 yarn
yarn dev

# 4. 访问开发服务器
echo "前端开发服务器: http://localhost:3000"
```

### 🚀 生产环境部署

#### 使用 Docker 部署到服务器

```bash
# 1. 在服务器上安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. 克隆项目到服务器
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 4. 配置生产环境变量
cp .env.example .env
vim .env

# 5. 启动生产服务
docker-compose up -d

# 6. 配置开机自启动
sudo systemctl enable docker
```

#### 域名和 HTTPS 配置（可选）

```bash
# 1. 配置域名解析
# 将您的域名 A 记录指向服务器 IP

# 2. 安装 Certbot（Let's Encrypt）
sudo apt install certbot python3-certbot-nginx

# 3. 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com

# 4. 设置自动续期
sudo crontab -e
# 添加：0 2 * * * certbot renew --quiet
```

## ⚙️ 详细配置说明

### 环境变量配置

创建 `.env` 文件并配置以下核心变量：

```bash
# ===========================================
# 数据库配置
# ===========================================
# PostgreSQL 数据库连接字符串
DATABASE_URL=postgresql://dns_max_user:your_strong_password@localhost:5432/dns_max

# ===========================================
# Redis 缓存配置
# ===========================================
# Redis 连接字符串
REDIS_URL=redis://localhost:6379

# ===========================================
# JWT 安全配置
# ===========================================
# JWT 密钥（⚠️ 生产环境必须修改为复杂随机字符串）
SECRET_KEY=your_super_secret_key_here_change_in_production

# Token 过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ===========================================
# 跨域配置
# ===========================================
# 前端允许的来源域名
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# ===========================================
# 前端配置
# ===========================================
# 前端 API 请求地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# ===========================================
# 可选配置
# ===========================================
# 日志级别（DEBUG, INFO, WARNING, ERROR, CRITICAL）
LOG_LEVEL=INFO

# 是否启用 API 限流
RATE_LIMIT_ENABLED=true

# 每分钟最大请求数
RATE_LIMIT_REQUESTS_PER_MINUTE=60
```

> 🔒 **安全提醒**：生产环境部署前，请务必修改 `SECRET_KEY` 和数据库密码！

### 生成安全密钥

```bash
# 方法 1：使用 OpenSSL
openssl rand -hex 32

# 方法 2：使用 Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 方法 3：使用 UUID
python -c "import uuid; print(uuid.uuid4().hex)"
```

### DNS 服务商 API 配置

系统支持以下 DNS 服务商，需要在 Web 界面中配置相应的 API 密钥：

#### 🌐 阿里云 DNS

访问 [阿里云控制台](https://usercenter.console.aliyun.com/) 获取 AccessKey：

```json
{
  "access_key_id": "LTAIxxxxxxxxx",
  "access_key_secret": "xxxxxxxxxxxxxxxxxxxxx",
  "region": "cn-hangzhou"
}
```

#### ☁️ Cloudflare DNS

访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) 创建 Token：

```json
{
  "api_token": "xxxxxxxxxxxxxxxxxxxxx",
  "email": "your_email@example.com"
}
```

#### 🔵 腾讯云 DNS

访问 [腾讯云控制台](https://console.cloud.tencent.com/cam/capi) 获取密钥：

```json
{
  "secret_id": "AKIDxxxxxxxxx",
  "secret_key": "xxxxxxxxxxxxxxxxxxxxx",
  "region": "ap-guangzhou"
}
```

## 📚 使用指南

### 1. 用户注册和登录

1. 访问 http://localhost:3000
2. 点击"注册"创建账户
3. 使用用户名和密码登录系统

### 2. 添加 DNS 服务商

1. 进入"服务商管理"页面
2. 点击"添加服务商"
3. 选择服务商类型并填入 API 配置
4. 保存配置

### 3. 管理域名

1. 进入"域名管理"页面
2. 点击"添加域名"
3. 选择 DNS 服务商并输入域名
4. 确认添加

### 4. 管理 DNS 记录

1. 在域名列表中点击"DNS 记录"
2. 查看当前记录列表
3. 点击"添加记录"创建新记录
4. 支持编辑和删除现有记录

### 5. 批量操作

- 支持批量导入域名和 DNS 记录
- 支持批量修改记录的 TTL 值
- 支持批量启用/禁用记录

## 🔧 API 文档

完整的 API 文档可通过以下地址访问：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 主要 API 端点

#### 认证相关

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

#### DNS 服务商管理

- `GET /api/v1/providers` - 获取服务商列表
- `POST /api/v1/providers` - 添加服务商
- `PUT /api/v1/providers/{id}` - 更新服务商
- `DELETE /api/v1/providers/{id}` - 删除服务商

#### 域名管理

- `GET /api/v1/domains` - 获取域名列表
- `POST /api/v1/domains` - 添加域名
- `PUT /api/v1/domains/{id}` - 更新域名
- `DELETE /api/v1/domains/{id}` - 删除域名

#### DNS 记录管理

- `GET /api/v1/dns-records` - 获取 DNS 记录列表
- `POST /api/v1/dns-records` - 添加 DNS 记录
- `PUT /api/v1/dns-records/{id}` - 更新 DNS 记录
- `DELETE /api/v1/dns-records/{id}` - 删除 DNS 记录

## 🚀 生产环境部署指南

### 🖥️ 服务器准备

#### 最低服务器配置

```bash
# 系统要求
OS: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
CPU: 2 核心
RAM: 4GB
磁盘: 20GB SSD
网络: 1Mbps 上行带宽
```

#### 安装 Docker 环境

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 🔧 部署步骤

#### 1. 获取项目代码

```bash
# 克隆到生产目录
sudo mkdir -p /opt/dns-max
sudo chown $USER:$USER /opt/dns-max
cd /opt/dns-max

git clone https://github.com/yourusername/dns-max.git .
```

#### 2. 配置生产环境

```bash
# 复制并编辑配置文件
cp .env.example .env
vim .env

# 关键生产配置：
# 1. 修改 SECRET_KEY 为强随机字符串
# 2. 修改数据库密码
# 3. 设置正确的 CORS 域名
# 4. 配置邮件服务（可选）
```

#### 3. 启动生产服务

```bash
# 启动所有服务
docker-compose up -d

# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 4. 配置系统服务（开机自启）

```bash
# 创建 systemd 服务文件
sudo tee /etc/systemd/system/dns-max.service > /dev/null <<EOF
[Unit]
Description=DNS Max Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/dns-max
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
sudo systemctl daemon-reload
sudo systemctl enable dns-max
sudo systemctl start dns-max

# 检查服务状态
sudo systemctl status dns-max
```

#### 5. 配置防火墙

```bash
# 配置 UFW 防火墙
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 检查防火墙状态
sudo ufw status
```

### 🌐 域名和 HTTPS 配置

#### 域名解析配置

```bash
# 1. 在域名提供商控制台添加 A 记录
# 类型: A
# 主机记录: @ 或 www
# 记录值: 您的服务器 IP 地址
# TTL: 600

# 2. 验证域名解析
nslookup yourdomain.com
```

#### SSL 证书配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 验证证书
sudo certbot certificates

# 设置自动续期
echo "0 2 * * * root certbot renew --quiet" | sudo tee -a /etc/crontab
```

#### 更新 Nginx 配置

```bash
# 编辑 Nginx 配置
vim nginx/nginx.conf

# 添加 HTTPS 重定向和安全头
# 重启 Nginx
docker-compose restart nginx
```

## 🔍 监控和维护

### 服务健康监控

```bash
# 检查所有服务状态
docker-compose ps

# 查看服务资源使用情况
docker stats

# 检查各服务健康状态
curl http://localhost:8000/health
curl http://localhost:3000/api/health

# 查看详细的服务日志
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 frontend
docker-compose logs -f --tail=100 postgres
```

### 日志管理

```bash
# 查看实时日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 查看最近的错误日志
docker-compose logs --tail=50 backend | grep ERROR

# 日志清理（当日志文件过大时）
docker system prune -f
docker-compose down && docker-compose up -d
```

### 数据备份

```bash
# 1. 数据库备份
# 创建备份目录
mkdir -p /opt/dns-max/backups

# 备份 PostgreSQL 数据库
docker-compose exec postgres pg_dump -U dns_max_user dns_max > backups/dns-max-db-$(date +%Y%m%d_%H%M%S).sql

# 2. 完整项目备份
tar -czf /opt/backups/dns-max-full-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='__pycache__' \
  --exclude='.git' \
  /opt/dns-max

# 3. 定期备份脚本
cat > /opt/dns-max/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/dns-max/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 数据库备份
docker-compose exec -T postgres pg_dump -U dns_max_user dns_max > $BACKUP_DIR/db-$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "db-*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db-$DATE.sql"
EOF

chmod +x /opt/dns-max/backup.sh

# 添加定时任务（每天凌晨2点备份）
echo "0 2 * * * /opt/dns-max/backup.sh" | sudo crontab -
```

### 性能优化

```bash
# 1. 清理无用的 Docker 资源
docker system prune -f
docker volume prune -f

# 2. 重启服务刷新缓存
docker-compose restart redis
docker-compose restart backend

# 3. 查看资源使用情况
htop  # 或 top
df -h  # 磁盘使用
free -h  # 内存使用
```

### 故障处理

```bash
# 服务启动失败时的诊断
docker-compose ps  # 查看服务状态
docker-compose logs backend  # 查看错误日志

# 重启特定服务
docker-compose restart backend
docker-compose restart frontend

# 完全重新部署
docker-compose down
docker-compose pull
docker-compose up -d

# 数据库连接问题诊断
docker-compose exec postgres psql -U dns_max_user -d dns_max -c "\dt"

# Redis 连接测试
docker-compose exec redis redis-cli ping
```

## 🔒 安全最佳实践

### 🛡️ 生产环境安全配置

#### 1. 强化密钥和密码

```bash
# 生成强密钥（选择其中一种方法）
openssl rand -hex 32
python -c "import secrets; print(secrets.token_urlsafe(32))"
uuidgen | tr -d '-'

# 更新 .env 文件
SECRET_KEY=生成的强密钥
POSTGRES_PASSWORD=强数据库密码
```

#### 2. 数据库安全

```bash
# 创建数据库专用用户
CREATE USER dns_max_user WITH PASSWORD 'strong_password_here';
CREATE DATABASE dns_max OWNER dns_max_user;

# 限制数据库用户权限
GRANT CONNECT ON DATABASE dns_max TO dns_max_user;
GRANT USAGE ON SCHEMA public TO dns_max_user;
GRANT CREATE ON SCHEMA public TO dns_max_user;

# 禁用不必要的数据库扩展
ALTER DATABASE dns_max SET log_statement = 'all';
```

#### 3. 网络安全配置

```bash
# 防火墙配置
sudo ufw deny 5432  # 禁止外部访问数据库端口
sudo ufw deny 6379  # 禁止外部访问 Redis 端口
sudo ufw allow 80   # 允许 HTTP
sudo ufw allow 443  # 允许 HTTPS

# 只允许必要的出站连接
# DNS 服务商 API 访问（443 端口）
```

#### 4. Docker 安全配置

```yaml
# docker-compose.yml 安全配置
services:
  postgres:
    # 不暴露端口到主机（仅容器间访问）
    # ports:
    #   - "5432:5432"

    # 使用非 root 用户
    user: "999:999"

    # 限制容器权限
    cap_drop:
      - ALL
    cap_add:
      - DAC_OVERRIDE
      - SETUID
      - SETGID
```

#### 5. 应用安全配置

```bash
# .env 生产配置
FORCE_HTTPS=true
SECURE_COOKIES=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
MAX_UPLOAD_SIZE=5242880  # 5MB
```

### 🔐 SSL/TLS 配置

#### 免费 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo crontab -e
# 添加：0 2 * * * certbot renew --quiet
```

#### 强化 SSL 配置

```nginx
# nginx/nginx.conf 安全配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # 安全协议
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # 安全头部
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 📊 安全审计

#### 定期安全检查

```bash
# 1. 检查开放端口
sudo netstat -tlnp

# 2. 检查登录日志
sudo journalctl -u ssh -f

# 3. 检查系统更新
sudo apt update && sudo apt list --upgradable

# 4. Docker 安全扫描
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v $PWD:/root/.cache/ aquasec/trivy image dns-max_backend:latest
```

#### 备份安全

```bash
# 加密备份
gpg --symmetric --cipher-algo AES256 backup.sql
```

## 🛠️ 开发指南

### 项目结构

```
dns-max/
├── backend/                 # 后端API
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置
│   │   ├── crud/           # 数据库操作
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # Pydantic模式
│   │   ├── services/       # 业务逻辑
│   │   └── utils/          # 工具函数
│   ├── alembic/            # 数据库迁移
│   ├── tests/              # 测试文件
│   └── Dockerfile
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── app/            # Next.js页面
│   │   ├── components/     # React组件
│   │   ├── lib/            # 工具库
│   │   ├── stores/         # 状态管理
│   │   └── types/          # TypeScript类型
│   └── Dockerfile
├── nginx/                  # Nginx配置
├── docker-compose.yml      # 生产环境编排
├── docker-compose.dev.yml  # 开发环境编排
└── README.md
```

### 添加新的 DNS 服务商

1. **创建适配器**

```python
# backend/app/services/dns_providers/new_provider.py
from .base import BaseDNSProvider

class NewProviderAdapter(BaseDNSProvider):
    def __init__(self, config: dict):
        self.config = config

    async def create_record(self, domain: str, record: dict):
        # 实现创建记录逻辑
        pass

    async def update_record(self, domain: str, record_id: str, record: dict):
        # 实现更新记录逻辑
        pass

    async def delete_record(self, domain: str, record_id: str):
        # 实现删除记录逻辑
        pass
```

2. **注册适配器**

```python
# backend/app/services/dns_factory.py
from .dns_providers.new_provider import NewProviderAdapter

DNS_PROVIDERS = {
    'aliyun': AliyunDNSAdapter,
    'cloudflare': CloudflareDNSAdapter,
    'tencent': TencentDNSAdapter,
    'new_provider': NewProviderAdapter,  # 添加新服务商
}
```

### 运行测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 故障排除和常见问题

### 🚨 常见启动问题

#### Q: Docker 容器启动失败

```bash
# 1. 检查 Docker 服务状态
sudo systemctl status docker

# 2. 查看容器日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# 3. 检查端口占用
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5432

# 4. 重新构建镜像
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Q: 数据库连接失败

```bash
# 1. 检查 PostgreSQL 容器状态
docker-compose ps postgres

# 2. 测试数据库连接
docker-compose exec postgres psql -U dns_max_user -d dns_max

# 3. 检查环境变量
echo $DATABASE_URL

# 4. 重置数据库
docker-compose down -v  # ⚠️ 这会删除所有数据
docker-compose up -d
```

#### Q: Redis 连接问题

```bash
# 1. 检查 Redis 容器
docker-compose ps redis

# 2. 测试 Redis 连接
docker-compose exec redis redis-cli ping

# 3. 清空 Redis 缓存
docker-compose exec redis redis-cli FLUSHALL
```

### 🔧 配置问题

#### Q: 前端无法访问后端 API

```bash
# 1. 检查 CORS 配置
# 确保 .env 中的 BACKEND_CORS_ORIGINS 包含前端域名

# 2. 检查 API 地址配置
# 前端环境变量：NEXT_PUBLIC_API_URL

# 3. 测试 API 连接
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/health
```

#### Q: JWT 认证失败

```bash
# 1. 检查 SECRET_KEY 配置
# 确保后端和前端使用相同的密钥

# 2. 清除浏览器存储
# 清除 localStorage 和 cookies

# 3. 重启后端服务
docker-compose restart backend
```

### 🐛 DNS 操作问题

#### Q: DNS 服务商 API 调用失败

```bash
# 1. 检查 API 密钥配置
# 确保在 Web 界面中正确配置了 DNS 服务商密钥

# 2. 测试网络连接
curl -I https://dns.aliyuncs.com
curl -I https://api.cloudflare.com
curl -I https://dnspod.tencentcloudapi.com

# 3. 查看详细错误日志
docker-compose logs backend | grep ERROR
```

#### Q: 域名同步失败

```bash
# 1. 检查域名权限
# 确保 DNS 服务商账户有域名管理权限

# 2. 手动触发同步
# 在 Web 界面点击"刷新"按钮

# 3. 检查域名状态
# 确保域名已正确添加到 DNS 服务商
```

### 🚀 性能问题

#### Q: 系统响应缓慢

```bash
# 1. 检查系统资源
htop
df -h
free -h

# 2. 查看容器资源使用
docker stats

# 3. 清理 Docker 缓存
docker system prune -f
docker volume prune -f

# 4. 重启 Redis 缓存
docker-compose restart redis
```

#### Q: 数据库查询慢

```bash
# 1. 查看数据库连接数
docker-compose exec postgres psql -U dns_max_user -d dns_max -c "SELECT count(*) FROM pg_stat_activity;"

# 2. 分析慢查询
docker-compose exec postgres psql -U dns_max_user -d dns_max -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# 3. 重启数据库
docker-compose restart postgres
```

### 📱 Web 界面问题

#### Q: 页面无法加载

```bash
# 1. 检查前端服务状态
docker-compose ps frontend

# 2. 查看前端日志
docker-compose logs frontend

# 3. 清除浏览器缓存
# Ctrl+Shift+R 强制刷新

# 4. 检查网络连接
ping localhost
telnet localhost 3000
```

#### Q: 功能按钮无响应

```bash
# 1. 打开浏览器开发者工具
# F12 查看控制台错误信息

# 2. 检查网络请求
# 在 Network 选项卡查看 API 请求状态

# 3. 查看后端日志
docker-compose logs backend | tail -50
```

### 🛠️ 恢复操作

#### 完全重置系统

```bash
# ⚠️ 警告：此操作将删除所有数据
docker-compose down -v
docker system prune -a -f
git pull origin main
docker-compose up -d
```

#### 恢复数据库备份

```bash
# 停止服务
docker-compose down

# 恢复数据库
docker-compose up -d postgres
sleep 10
docker-compose exec -T postgres psql -U dns_max_user -d dns_max < backup.sql

# 启动所有服务
docker-compose up -d
```

## 📞 获取帮助

如果以上方法都无法解决问题：

1. **查看日志文件**：`docker-compose logs -f`
2. **检查系统状态**：`docker-compose ps`
3. **提交 Issue**：[GitHub Issues](https://github.com/yourusername/dns-max/issues)
4. **社区讨论**：[GitHub Discussions](https://github.com/yourusername/dns-max/discussions)

### 📋 问题报告模板

提交问题时请包含以下信息：

````markdown
## 环境信息

- 操作系统：
- Docker 版本：
- Docker Compose 版本：
- 浏览器：

## 问题描述

详细描述遇到的问题

## 重现步骤

1.
2.
3.

## 错误日志

```bash
docker-compose logs
```
````

## 期望行为

描述期望的正确行为

````

## � 文档索引

| 文档 | 说明 | 适用对象 |
|------|------|----------|
| **README.md** | 项目概述和快速开始 | 所有用户 |
| **ENVIRONMENT.md** | 详细的环境配置指南 | 开发者和运维 |
| **DEPLOYMENT.md** | 完整的部署指南 | 运维人员 |
| **.env.example** | 环境变量配置模板 | 配置人员 |
| **.env.dev** | 开发环境配置 | 开发者 |
| **.env.prod** | 生产环境配置模板 | 运维人员 |
| **.env.test** | 测试环境配置 | 测试人员 |

### � 相关链接

- **项目主页**：[DNS Max 官网](https://dnsmax.com)
- **在线文档**：[完整文档](https://docs.dnsmax.com)
- **API 文档**：[API 参考](https://api.dnsmax.com/docs)
- **更新日志**：[CHANGELOG.md](CHANGELOG.md)
- **贡献指南**：[CONTRIBUTING.md](CONTRIBUTING.md)
- **安全策略**：[SECURITY.md](SECURITY.md)

### 📋 快速参考

#### 常用命令

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d    # 启动开发服务
npm run dev                                        # 启动前端开发
uvicorn app.main:app --reload                     # 启动后端开发

# 生产环境
docker-compose up -d                               # 启动生产服务
docker-compose ps                                  # 查看服务状态
docker-compose logs -f                             # 查看日志

# 维护操作
docker-compose down                                # 停止服务
docker-compose restart                             # 重启服务
docker system prune -f                             # 清理系统
````

#### 默认端口

| 服务   | 端口   | 用途       |
| ------ | ------ | ---------- |
| 前端   | 3000   | Web 界面   |
| 后端   | 8000   | API 服务   |
| 数据库 | 5432   | PostgreSQL |
| 缓存   | 6379   | Redis      |
| 代理   | 80/443 | Nginx      |
| 监控   | 3001   | Grafana    |
| 指标   | 9090   | Prometheus |

#### 默认账户

```bash
# 开发环境默认管理员账户
用户名: admin@localhost
密码: admin123

# 数据库管理工具
pgAdmin: admin@localhost / admin123
Redis Commander: admin / admin123
```

## 🎉 快速部署检查清单

### 部署前检查

- [ ] 已安装 Docker 和 Docker Compose
- [ ] 已克隆项目代码
- [ ] 已复制并配置环境变量文件
- [ ] 已修改默认密钥和密码
- [ ] 已配置 DNS 服务商密钥（如需要）
- [ ] 已检查端口占用情况
- [ ] 已配置防火墙规则（生产环境）

### 部署后验证

- [ ] 所有容器状态正常
- [ ] 前端页面可以访问
- [ ] 后端 API 响应正常
- [ ] 数据库连接成功
- [ ] 缓存服务正常
- [ ] 用户注册和登录功能正常
- [ ] DNS 服务商连接测试通过
- [ ] 域名和记录管理功能正常

### 生产环境额外检查

- [ ] SSL 证书配置正确
- [ ] 备份策略已配置
- [ ] 监控告警已设置
- [ ] 日志轮转已配置
- [ ] 性能优化已完成
- [ ] 安全扫描已通过

## 🔄 版本更新

### 当前版本

- **版本号**: v1.0.0
- **发布日期**: 2024-01-01
- **主要特性**:
  - 多 DNS 服务商支持
  - 统一管理界面
  - 完整的用户认证系统
  - Docker 一键部署

### 升级指南

```bash
# 1. 备份数据
docker-compose exec postgres pg_dump -U dns_max_user dns_max > backup.sql

# 2. 停止服务
docker-compose down

# 3. 拉取最新代码
git pull origin main

# 4. 更新配置（如需要）
# 检查 .env.example 中的新配置项

# 5. 重新部署
docker-compose up -d

# 6. 运行数据库迁移（如需要）
docker-compose exec backend alembic upgrade head
```

### 版本兼容性

| 版本   | Node.js | Python | PostgreSQL | Redis | Docker |
| ------ | ------- | ------ | ---------- | ----- | ------ |
| v1.0.x | 18+     | 3.11+  | 15+        | 7+    | 20+    |

## � 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献

我们欢迎各种形式的贡献：

1. **提交 Bug 报告** - 发现问题请及时报告
2. **功能建议** - 欢迎提出新功能建议
3. **代码贡献** - 提交 Pull Request
4. **文档改进** - 帮助完善文档
5. **测试** - 帮助测试新功能和修复

详细的贡献指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 🙏 致谢

感谢以下开源项目为 DNS Max 提供支持：

- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的 Python Web 框架
- [Next.js](https://nextjs.org/) - React 生产级框架
- [PostgreSQL](https://www.postgresql.org/) - 先进的开源数据库
- [Redis](https://redis.io/) - 内存数据结构存储
- [Docker](https://www.docker.com/) - 容器化平台
- [Tailwind CSS](https://tailwindcss.com/) - 实用程序优先的 CSS 框架

特别感谢所有贡献者和社区成员的支持！

## 📞 支持

- 📧 邮箱: support@dnsmax.com
- �🐛 问题反馈: [GitHub Issues](https://github.com/yourusername/dns-max/issues)
- 📖 文档: [在线文档](https://docs.dnsmax.com)
- 💬 社区讨论: [Discussions](https://github.com/yourusername/dns-max/discussions)

---

<div align="center">

**DNS Max** - 让 DNS 管理变得简单高效！🚀

如果这个项目对您有帮助，请给我们一个 ⭐️

[🏠 首页](https://dnsmax.com) |
[📖 文档](https://docs.dnsmax.com) |
[💬 讨论](https://github.com/yourusername/dns-max/discussions) |
[🐛 报告问题](https://github.com/yourusername/dns-max/issues)

</div>
