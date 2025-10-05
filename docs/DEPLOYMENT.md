# 生产环境部署指南

本文档详细说明如何在生产环境部署 DNS-Max。

## 📋 部署前准备

### 服务器要求

| 项目     | 要求                                   |
| -------- | -------------------------------------- |
| 操作系统 | Ubuntu 20.04+ / CentOS 8+ / Debian 11+ |
| CPU      | 2 核心以上                             |
| 内存     | 2GB 以上（推荐 4GB）                   |
| 磁盘空间 | 10GB 以上（推荐 20GB）                 |
| 网络     | 公网 IP 地址                           |
| 域名     | 可选，建议配置                         |

### 需要准备的信息

- [x] 服务器 IP 地址
- [x] 域名（如果使用）
- [x] SSL 证书（如果使用 HTTPS）
- [x] DNSPod API 密钥（可选）
- [x] 邮件服务配置（可选）

---

## 🚀 部署步骤

### 第一步：准备服务器

#### 1.1 更新系统

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 1.2 安装 Docker

```bash
# 使用官方脚本安装
curl -fsSL https://get.docker.com | sh

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker

# 验证安装
docker --version
docker-compose --version
```

#### 1.3 配置防火墙

```bash
# Ubuntu/Debian (使用 ufw)
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable

# CentOS/RHEL (使用 firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 第二步：克隆项目

```bash
# 克隆代码
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max

# 或者下载特定版本
git clone -b v2.0.0 https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max
```

### 第三步：配置环境变量

```bash
# 复制示例文件
cp env.example .env

# 编辑配置文件
nano .env  # 或使用 vim .env
```

#### 3.1 必须修改的配置

```bash
# 数据库密码（使用强密码）
POSTGRES_PASSWORD=your_very_strong_password_here

# JWT 密钥（至少 32 字符）
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 应用 URL（替换为你的域名）
PUBLIC_WEB_URL=https://yourdomain.com
PUBLIC_API_URL=https://api.yourdomain.com

# Cookie 安全设置
COOKIE_DOMAIN=.yourdomain.com  # 注意前面有点
COOKIE_SECURE=true             # 生产环境必须为 true
```

#### 3.2 生成强密钥

```bash
# 生成 32 字节的 base64 密钥
openssl rand -base64 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**示例 .env 文件**:

```bash
# Database
POSTGRES_DB=domainapp
POSTGRES_USER=domainapp
POSTGRES_PASSWORD=Xk9$mN2@pQ7#wR5!vL8&tY3^bH6*dG1

# JWT
JWT_SECRET=5K8mQw2pXr9vYt3nL6bH4dG7zF1cV0aS8jK5mN2qW9r
JWT_REFRESH_SECRET=9R2wQ5pM8tY3nL6bH4dG7zF1cV0aS8jK5mN2qW9rX1v
ACCESS_TOKEN_TTL_MIN=30
REFRESH_TOKEN_TTL_DAYS=14

# URLs
PUBLIC_WEB_URL=https://dns.example.com
PUBLIC_API_URL=https://api.example.com

# Cookies
COOKIE_DOMAIN=.example.com
COOKIE_SECURE=true
```

### 第四步：配置域名 DNS

在你的域名服务商处添加 A 记录：

```
dns.example.com    A    你的服务器IP
api.example.com    A    你的服务器IP
```

等待 DNS 生效（通常 5-30 分钟）：

```bash
# 验证 DNS 解析
nslookup dns.example.com
nslookup api.example.com
```

### 第五步：启动服务

```bash
# 启动所有服务
docker-compose up -d --build

# 查看启动状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**预期输出**:

```
NAME                COMMAND                  SERVICE   STATUS
dns-max-api-1       "sh start.sh"            api       Up
dns-max-db-1        "docker-entrypoint.s…"   db        Up
dns-max-web-1       "docker-entrypoint.s…"   web       Up
```

### 第六步：运行数据库迁移

```bash
# 运行迁移
docker-compose exec api alembic upgrade head

# 验证迁移
docker-compose exec api alembic current
```

### 第七步：配置 SSL/HTTPS

#### 方案 1: 使用 Let's Encrypt（推荐）

安装 Certbot:

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

获取证书:

```bash
# 获取证书
sudo certbot certonly --standalone -d dns.example.com -d api.example.com

# 证书路径
# /etc/letsencrypt/live/dns.example.com/fullchain.pem
# /etc/letsencrypt/live/dns.example.com/privkey.pem
```

配置自动续期:

```bash
# 测试续期
sudo certbot renew --dry-run

# 添加自动续期任务（已自动添加到 crontab）
crontab -l | grep certbot
```

#### 方案 2: 使用 Caddy（最简单）

创建 `Caddyfile`:

```bash
cat > Caddyfile << 'EOF'
dns.example.com {
    reverse_proxy web:3000
}

api.example.com {
    reverse_proxy api:8000
}
EOF
```

更新 `docker-compose.yml` 添加 Caddy:

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
      - api

volumes:
  caddy_data:
  caddy_config:
```

重启服务:

```bash
docker-compose up -d
```

Caddy 会自动获取和续期 SSL 证书！

### 第八步：首次访问配置

1. 访问 `https://dns.example.com`
2. 注册第一个用户（自动成为管理员）
3. 登录后访问"管理员后台"
4. 进入"系统配置"标签
5. 配置邮件服务和 DNSPod

---

## 🔒 安全加固

### 1. 限制 SSH 访问

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 修改以下配置
Port 2222                    # 更改默认端口
PermitRootLogin no          # 禁止 root 登录
PasswordAuthentication no   # 仅允许密钥登录
MaxAuthTries 3              # 限制认证尝试次数

# 重启 SSH 服务
sudo systemctl restart sshd
```

### 2. 配置防火墙规则

```bash
# 使用 iptables 限制访问
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2222 -j ACCEPT  # 新的 SSH 端口
sudo iptables -A INPUT -j DROP

# 保存规则
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

### 3. 启用 Fail2ban

```bash
# 安装 Fail2ban
sudo apt install fail2ban -y

# 配置 Fail2ban
sudo nano /etc/fail2ban/jail.local
```

添加配置:

```ini
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
```

启动服务:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. 定期更新系统

```bash
# 启用自动安全更新
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 监控和维护

### 1. 设置日志轮转

创建 `/etc/logrotate.d/dns-max`:

```bash
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

### 2. 数据库备份

创建备份脚本 `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backup/dns-max"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
cd /path/to/DNS-Max
docker-compose exec -T db pg_dump -U domainapp domainapp > $BACKUP_DIR/backup_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/backup_$DATE.sql

# 删除 30 天前的备份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# 备份 .env 文件
cp .env $BACKUP_DIR/.env_$DATE
```

添加到 crontab:

```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

### 3. 监控脚本

创建 `monitor.sh`:

```bash
#!/bin/bash

# 检查服务状态
if ! docker-compose ps | grep -q "Up"; then
    echo "Service is down! Restarting..."
    docker-compose restart
    # 发送告警邮件或钉钉通知
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is high: ${DISK_USAGE}%"
    # 发送告警
fi

# 检查内存使用
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "Memory usage is high: ${MEM_USAGE}%"
    # 发送告警
fi
```

添加到 crontab（每 5 分钟检查一次）:

```bash
*/5 * * * * /path/to/monitor.sh
```

### 4. 性能优化

#### PostgreSQL 优化

编辑 `docker-compose.yml`:

```yaml
services:
  db:
    command: postgres -c shared_buffers=256MB -c max_connections=200
```

#### 启用 Gzip 压缩

在 Caddy 配置中（默认已启用）或 Nginx 中：

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 🔄 更新和升级

### 更新到新版本

```bash
# 1. 备份数据
./backup.sh

# 2. 拉取最新代码
git fetch --all
git checkout v2.1.0  # 或 git pull

# 3. 停止服务
docker-compose down

# 4. 更新依赖和镜像
docker-compose pull
docker-compose build --no-cache

# 5. 运行数据库迁移
docker-compose up -d db
sleep 10
docker-compose run --rm api alembic upgrade head

# 6. 启动所有服务
docker-compose up -d

# 7. 验证
docker-compose ps
docker-compose logs -f
```

### 回滚到旧版本

```bash
# 停止服务
docker-compose down

# 回滚代码
git checkout v2.0.0

# 回滚数据库（如果需要）
docker-compose up -d db
docker-compose exec api alembic downgrade <revision>

# 重新启动
docker-compose up -d --build
```

---

## 📈 扩展和优化

### 使用 Nginx 作为反向代理

创建 `nginx.conf`:

```nginx
upstream web {
    server localhost:3000;
}

upstream api {
    server localhost:8000;
}

server {
    listen 80;
    server_name dns.example.com api.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dns.example.com;

    ssl_certificate /etc/letsencrypt/live/dns.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dns.example.com/privkey.pem;

    location / {
        proxy_pass http://web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 Docker Swarm 或 Kubernetes

适用于高可用部署（未来版本支持）

---

## 🆘 故障排除

遇到问题？查看 [故障排除指南](TROUBLESHOOTING.md)

---

## ✅ 部署检查清单

完成部署后，使用 [部署检查清单](DEPLOYMENT_CHECKLIST.md) 验证所有功能。

---

<div align="center">

**部署成功！** 🎉

[返回主文档](README.md) • [配置说明](CONFIGURATION.md) • [故障排除](TROUBLESHOOTING.md)

</div>
