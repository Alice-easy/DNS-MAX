# 配置说明

## 📝 环境变量配置

### 必需配置（.env 文件）

```bash
# 数据库配置
POSTGRES_DB=domainapp
POSTGRES_USER=domainapp
POSTGRES_PASSWORD=your_strong_password  # ⚠️ 必须修改

# JWT密钥（至少32字符）
JWT_SECRET=your_jwt_secret_key_here     # ⚠️ 必须修改
JWT_REFRESH_SECRET=your_refresh_key     # ⚠️ 必须修改
ACCESS_TOKEN_TTL_MIN=30
REFRESH_TOKEN_TTL_DAYS=14

# 应用URL
PUBLIC_WEB_URL=http://localhost:3000
PUBLIC_API_URL=http://localhost:8000

# Cookie设置
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false  # 生产环境设为true
```

### 生成安全密钥

```bash
# 方法1: 使用openssl
openssl rand -base64 32

# 方法2: 使用Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## ⚙️ 系统配置（Web 界面）

从 v2.0 开始，以下配置通过 Web 界面管理：

### 1. 邮件服务配置

登录后访问：**管理员后台 → 系统配置 → 邮件配置**

#### SMTP 配置

```
SMTP服务器: smtp.gmail.com
SMTP端口: 587
发件人邮箱: your-email@gmail.com
SMTP密码: your-app-password
启用TLS: 是
```

#### Resend 配置

```
Resend API Key: re_xxxxxxxxxxxx
发件人邮箱: noreply@yourdomain.com
```

### 2. DNSPod 配置

访问：**管理员后台 → 系统配置 → DNSPod 配置**

```
API ID: 你的DNSPod API ID
API Token: 你的DNSPod API Token
根域名: example.com
默认TTL: 600
```

获取 DNSPod API 密钥：https://console.dnspod.cn/account/token

### 3. 域名管理

访问：**管理员后台 → 域名管理**

- 添加新域名
- 同步 DNSPod 域名
- 启用/禁用域名

## 🔧 高级配置

### 数据库连接池

编辑 `docker-compose.yml`:

```yaml
services:
  db:
    command: >
      postgres
      -c max_connections=200
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
```

### API 性能优化

编辑 `api/app/config.py`:

```python
# Worker数量
WORKERS = 4

# 数据库连接池
POOL_SIZE = 10
MAX_OVERFLOW = 20
```

### 前端环境变量

编辑 `web/.env.local`:

```bash
# API地址（可选，默认使用相对路径）
NEXT_PUBLIC_API_URL=http://localhost:8000

# 其他配置
NEXT_PUBLIC_SITE_NAME=DNS-Max
```

## 📁 配置文件位置

```
DNS-Max/
├── .env                    # 环境变量（需手动创建）
├── env.example             # 环境变量模板
├── docker-compose.yml      # Docker配置
├── api/
│   └── app/
│       └── config.py       # API配置
└── web/
    ├── .env.local          # 前端环境变量（可选）
    └── next.config.js      # Next.js配置
```

## 🔐 生产环境安全配置

### 1. 强密码策略

```bash
# 使用复杂密码
POSTGRES_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

### 2. HTTPS 配置

```bash
# 更新 .env
PUBLIC_WEB_URL=https://yourdomain.com
PUBLIC_API_URL=https://api.yourdomain.com
COOKIE_DOMAIN=.yourdomain.com
COOKIE_SECURE=true
```

### 3. 防火墙规则

```bash
# 仅开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## ❓ 常见配置问题

### Q: 配置修改后不生效？

**A**: 重启服务

```bash
docker-compose down
docker-compose up -d
```

### Q: 忘记 JWT 密钥怎么办？

**A**: 重新生成并更新.env，所有用户需要重新登录

### Q: 如何查看当前配置？

**A**:

```bash
# 查看环境变量
cat .env

# 查看系统配置
docker-compose exec api python -c "from app.config import settings; print(settings.dict())"
```

---

更多问题？查看 [故障排除文档](TROUBLESHOOTING.md)
