# 部署指南

## 📋 部署前准备

### 1. 服务器要求
- **操作系统**: Linux (Ubuntu 20.04+ 推荐)
- **内存**: 最少 2GB RAM
- **存储**: 最少 10GB 可用空间
- **网络**: 公网IP，开放80和443端口

### 2. 安装依赖
```bash
# 安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# 确保用户在docker组中
sudo usermod -aG docker $USER
```

## 🚀 快速部署

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd DNS-Max
```

### 2. 配置环境变量
```bash
cp env.example .env
nano .env  # 编辑配置
```

**重要配置项**:
- `POSTGRES_PASSWORD`: 设置强密码
- `JWT_SECRET`: 生成长随机字符串
- `JWT_REFRESH_SECRET`: 生成另一个长随机字符串  
- `PUBLIC_WEB_URL`: 您的前端域名
- `PUBLIC_API_URL`: 您的API域名
- `CADDY_EMAIL`: Let's Encrypt证书邮箱
- `DNSPOD_SECRET_ID/KEY`: DNSPod API凭据
- `DNS_ROOT_DOMAIN`: 要分发的主域名

### 3. 启动服务
```bash
# Windows用户
start.cmd

# Linux/Mac用户
chmod +x deploy.sh
./deploy.sh

# 或使用Makefile
make init  # 初始化配置
make start # 启动服务
```

## 🔧 域名配置

### 1. DNS设置
将以下域名的A记录指向服务器IP：
- `yourdomain.com` → 服务器IP
- `api.yourdomain.com` → 服务器IP

### 2. 更新配置
修改 `.env` 文件中的域名配置，然后重启：
```bash
docker compose restart
```

## 📊 服务管理

### 查看日志
```bash
make logs                    # 查看所有服务日志
docker compose logs api      # 只看API日志
docker compose logs web      # 只看前端日志
```

### 数据库操作
```bash
make db-shell               # 进入数据库
make backup-db              # 备份数据库
```

### 服务控制
```bash
make stop                   # 停止服务
make start                  # 启动服务
make restart                # 重启服务
make clean                  # 清理所有容器和镜像
```

## 🛡️ 安全配置

### 1. 防火墙设置
```bash
# Ubuntu UFW示例
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw enable
```

### 2. SSL证书
Caddy会自动申请和续期Let's Encrypt证书，确保：
- 域名已正确解析到服务器
- 80和443端口开放
- `CADDY_EMAIL` 配置正确

### 3. 定期维护
```bash
# 设置定时备份
echo "0 2 * * * cd /path/to/DNS-Max && make backup-db" | crontab -

# 监控磁盘空间
df -h

# 查看容器状态
docker compose ps
```

## 🔍 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   ```

2. **数据库连接失败**
   ```bash
   docker compose logs db
   ```

3. **证书申请失败**
   ```bash
   docker compose logs proxy
   ```

4. **API无法访问**
   ```bash
   docker compose logs api
   curl http://localhost:8000/healthz
   ```

### 日志位置
- API日志: `docker compose logs api`
- Web日志: `docker compose logs web`
- 代理日志: `docker compose logs proxy`
- 数据库日志: `docker compose logs db`

## 📈 性能优化

### 1. 数据库优化
```sql
-- 在PostgreSQL中创建索引
CREATE INDEX IF NOT EXISTS idx_allocations_user_status ON allocations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified_at);
```

### 2. 缓存配置
考虑添加Redis缓存：
```yaml
# 在docker-compose.yml中添加
redis:
  image: redis:7-alpine
  volumes:
    - redisdata:/data
```

### 3. 监控告警
建议集成：
- Prometheus + Grafana（系统监控）
- Sentry（错误追踪）
- 日志聚合系统

## 🔄 更新部署

```bash
git pull                    # 拉取最新代码
docker compose build        # 重新构建镜像
docker compose up -d        # 重启服务
```

## 💾 数据备份与恢复

### 备份
```bash
make backup-db              # 快速备份
docker compose exec db pg_dump -U domainapp domainapp > backup.sql
```

### 恢复
```bash
docker compose exec -T db psql -U domainapp domainapp < backup.sql
```
