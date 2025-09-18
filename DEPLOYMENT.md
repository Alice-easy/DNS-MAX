# DNS Max 部署指南

本文档提供了 DNS Max 系统在不同环境下的详细部署指南，包括开发环境、测试环境和生产环境的完整部署流程。

## 📋 部署准备

### 系统要求

| 环境         | 最低配置                  | 推荐配置                   |
| ------------ | ------------------------- | -------------------------- |
| **开发环境** | 2GB RAM, 1 CPU, 10GB 存储 | 4GB RAM, 2 CPU, 20GB SSD   |
| **测试环境** | 4GB RAM, 2 CPU, 20GB 存储 | 8GB RAM, 4 CPU, 40GB SSD   |
| **生产环境** | 8GB RAM, 4 CPU, 50GB 存储 | 16GB RAM, 8 CPU, 100GB SSD |

### 软件依赖

```bash
# 必需软件
- Docker: 20.0+
- Docker Compose: 2.0+
- Git: 2.0+

# 可选软件（本地开发）
- Node.js: 18.0+
- Python: 3.11+
- PostgreSQL Client: 15+
- Redis CLI: 7.0+
```

## 🚀 快速部署

### 方式一：一键部署脚本

```bash
#!/bin/bash
# quick-deploy.sh

echo "DNS Max 快速部署脚本"

# 1. 检查系统要求
echo "检查系统要求..."
command -v docker >/dev/null 2>&1 || { echo "Docker未安装" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose未安装" >&2; exit 1; }

# 2. 克隆项目
if [ ! -d "dns-max" ]; then
    git clone https://github.com/yourusername/dns-max.git
fi
cd dns-max

# 3. 配置环境变量
echo "配置环境变量..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "请编辑 .env 文件配置您的环境变量"
    read -p "按回车键继续..."
fi

# 4. 启动服务
echo "启动服务..."
docker-compose up -d

# 5. 等待服务就绪
echo "等待服务启动..."
sleep 30

# 6. 验证部署
echo "验证部署状态..."
curl -f http://localhost:8000/health && echo "后端服务正常"
curl -f http://localhost:3000 && echo "前端服务正常"

echo "部署完成！访问 http://localhost:3000 开始使用"
```

### 方式二：手动部署

```bash
# 1. 获取项目代码
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 2. 选择环境配置
# 开发环境
cp .env.dev .env

# 生产环境
cp .env.prod .env
# 然后编辑 .env 文件

# 3. 启动服务
# 开发环境（仅数据库和缓存）
docker-compose -f docker-compose.dev.yml up -d

# 生产环境（完整服务栈）
docker-compose up -d
```

## 🔧 环境特定部署

### 开发环境部署

#### 步骤 1：启动基础服务

```bash
# 启动数据库和Redis
docker-compose -f docker-compose.dev.yml up -d

# 验证服务状态
docker-compose -f docker-compose.dev.yml ps
```

#### 步骤 2：设置 Python 环境

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 或使用Poetry
poetry install
poetry shell
```

#### 步骤 3：数据库初始化

```bash
# 运行数据库迁移
alembic upgrade head

# 创建测试数据（可选）
python scripts/create_test_data.py
```

#### 步骤 4：启动后端服务

```bash
# 开发模式启动
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 或使用脚本
./scripts/start_dev.sh
```

#### 步骤 5：设置前端环境

```bash
# 新终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 步骤 6：访问应用

```bash
# 应用地址
echo "前端: http://localhost:3000"
echo "后端: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"

# 开发工具（如果启用）
echo "pgAdmin: http://localhost:5050"
echo "Redis Commander: http://localhost:8081"
echo "MailHog: http://localhost:8025"
```

### 测试环境部署

#### 自动化测试部署

```bash
#!/bin/bash
# deploy-test.sh

# 1. 清理环境
docker-compose -f docker-compose.test.yml down -v

# 2. 构建测试镜像
docker-compose -f docker-compose.test.yml build

# 3. 启动测试环境
docker-compose -f docker-compose.test.yml up -d

# 4. 等待服务就绪
./scripts/wait-for-services.sh

# 5. 运行数据库迁移
docker-compose -f docker-compose.test.yml exec backend alembic upgrade head

# 6. 运行测试
docker-compose -f docker-compose.test.yml exec backend pytest

# 7. 生成测试报告
docker-compose -f docker-compose.test.yml exec backend pytest --html=reports/test_report.html

echo "测试环境部署完成"
```

#### 持续集成配置

```yaml
# .github/workflows/test.yml
name: Test Environment Deploy

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Deploy Test Environment
        run: |
          cp .env.test .env
          docker-compose -f docker-compose.test.yml up -d
          ./scripts/wait-for-services.sh

      - name: Run Tests
        run: |
          docker-compose -f docker-compose.test.yml exec -T backend pytest --junitxml=test-results.xml

      - name: Publish Test Results
        uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: Test Results
          path: test-results.xml
          reporter: java-junit
```

### 生产环境部署

#### 步骤 1：服务器准备

```bash
#!/bin/bash
# prepare-server.sh

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 安装其他工具
sudo apt install -y git curl wget htop fail2ban ufw

# 配置防火墙
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 创建应用目录
sudo mkdir -p /opt/dns-max
sudo chown $USER:$USER /opt/dns-max

echo "服务器准备完成"
```

#### 步骤 2：安全配置

```bash
#!/bin/bash
# security-setup.sh

# 1. 生成强密钥
SECRET_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -base64 32)

# 2. 创建生产配置
cp .env.prod .env
sed -i "s/CHANGE_THIS_TO_STRONG_PASSWORD/$DB_PASSWORD/g" .env
sed -i "s/CHANGE_THIS_TO_A_VERY_STRONG_RANDOM_KEY_AT_LEAST_32_CHARS/$SECRET_KEY/g" .env

# 3. 设置文件权限
chmod 600 .env
chown $USER:$USER .env

# 4. 配置SSL证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

echo "安全配置完成"
```

#### 步骤 3：生产部署

```bash
#!/bin/bash
# deploy-production.sh

echo "开始生产环境部署..."

# 1. 进入项目目录
cd /opt/dns-max

# 2. 拉取最新代码
git pull origin main

# 3. 构建生产镜像
docker-compose build --no-cache

# 4. 启动生产服务
docker-compose up -d

# 5. 等待服务启动
sleep 60

# 6. 运行数据库迁移
docker-compose exec backend alembic upgrade head

# 7. 创建管理员用户（如果需要）
docker-compose exec backend python scripts/create_admin.py

# 8. 验证部署
./scripts/health-check.sh

# 9. 配置自动启动
sudo systemctl enable docker
sudo cp scripts/dns-max.service /etc/systemd/system/
sudo systemctl enable dns-max.service

echo "生产环境部署完成"
```

#### 步骤 4：监控和日志

```bash
#!/bin/bash
# setup-monitoring.sh

# 1. 启动监控服务
docker-compose --profile monitoring up -d

# 2. 配置日志轮转
sudo cp scripts/dns-max-logrotate /etc/logrotate.d/dns-max

# 3. 设置备份任务
sudo cp scripts/backup.sh /usr/local/bin/dns-max-backup
sudo chmod +x /usr/local/bin/dns-max-backup

# 添加定时任务
echo "0 2 * * * /usr/local/bin/dns-max-backup" | sudo crontab -

# 4. 配置告警
cp monitoring/alertmanager.yml monitoring/alertmanager.yml.backup
# 编辑告警配置

echo "监控配置完成"
```

## 🔄 滚动更新

### 零停机更新脚本

```bash
#!/bin/bash
# rolling-update.sh

echo "开始滚动更新..."

# 1. 拉取最新代码
git pull origin main

# 2. 构建新镜像
docker-compose build

# 3. 滚动更新后端服务
docker-compose up -d --no-deps --scale backend=2 backend
sleep 30
docker-compose up -d --no-deps --scale backend=1 backend

# 4. 更新前端服务
docker-compose up -d --no-deps frontend

# 5. 更新Nginx配置
docker-compose up -d --no-deps nginx

# 6. 验证更新
./scripts/health-check.sh

echo "滚动更新完成"
```

### 蓝绿部署

```bash
#!/bin/bash
# blue-green-deploy.sh

CURRENT_ENV=${1:-blue}
NEW_ENV=$([ "$CURRENT_ENV" = "blue" ] && echo "green" || echo "blue")

echo "从 $CURRENT_ENV 切换到 $NEW_ENV 环境"

# 1. 启动新环境
docker-compose -f docker-compose.$NEW_ENV.yml up -d

# 2. 等待新环境就绪
./scripts/wait-for-services.sh $NEW_ENV

# 3. 运行健康检查
./scripts/health-check.sh $NEW_ENV

# 4. 切换流量
./scripts/switch-traffic.sh $NEW_ENV

# 5. 验证流量切换
sleep 30
./scripts/verify-traffic.sh $NEW_ENV

# 6. 停止旧环境
docker-compose -f docker-compose.$CURRENT_ENV.yml down

echo "蓝绿部署完成"
```

## 🛡️ 安全部署指南

### SSL/TLS 配置

```bash
# 1. 获取Let's Encrypt证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 2. 配置强化SSL
cat > /etc/nginx/ssl.conf << 'EOF'
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
EOF

# 3. 设置自动续期
echo "0 2 * * * root certbot renew --quiet" >> /etc/crontab
```

### 防火墙配置

```bash
#!/bin/bash
# firewall-setup.sh

# 重置防火墙规则
sudo ufw --force reset

# 默认策略
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许SSH
sudo ufw allow ssh

# 允许HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 限制SSH连接频率
sudo ufw limit ssh

# 禁止直接访问数据库端口
sudo ufw deny 5432/tcp
sudo ufw deny 6379/tcp

# 启用防火墙
sudo ufw --force enable

# 显示状态
sudo ufw status verbose
```

### 入侵检测

```bash
#!/bin/bash
# setup-ids.sh

# 安装Fail2Ban
sudo apt install fail2ban -y

# 配置Fail2Ban
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[dns-max-api]
enabled = true
filter = dns-max-api
port = 8000
logpath = /opt/dns-max/logs/api.log
maxretry = 10
bantime = 1800
EOF

# 创建自定义过滤器
cat > /etc/fail2ban/filter.d/dns-max-api.conf << 'EOF'
[Definition]
failregex = ^.*\[.*\] "POST /api/v1/auth/login HTTP/.*" 401 .*$
            ^.*\[.*\] Authentication failed for user.*$
ignoreregex =
EOF

# 启动服务
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 部署验证

### 自动化健康检查

```bash
#!/bin/bash
# health-check.sh

ENVIRONMENT=${1:-production}
TIMEOUT=30

echo "开始健康检查 ($ENVIRONMENT)..."

# 1. 检查容器状态
echo "检查容器状态..."
CONTAINERS=$(docker-compose ps -q)
for container in $CONTAINERS; do
    if [ "$(docker inspect -f '{{.State.Health.Status}}' $container 2>/dev/null)" != "healthy" ]; then
        echo "❌ 容器 $container 不健康"
        exit 1
    fi
done
echo "✅ 所有容器健康"

# 2. 检查API端点
echo "检查API端点..."
API_ENDPOINTS=(
    "http://localhost:8000/health"
    "http://localhost:8000/api/v1/health"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if ! curl -f -s --max-time $TIMEOUT "$endpoint" > /dev/null; then
        echo "❌ API端点 $endpoint 不可访问"
        exit 1
    fi
done
echo "✅ API端点正常"

# 3. 检查前端服务
echo "检查前端服务..."
if ! curl -f -s --max-time $TIMEOUT "http://localhost:3000" > /dev/null; then
    echo "❌ 前端服务不可访问"
    exit 1
fi
echo "✅ 前端服务正常"

# 4. 检查数据库连接
echo "检查数据库连接..."
if ! docker-compose exec -T postgres pg_isready -U dns_max_user > /dev/null; then
    echo "❌ 数据库连接失败"
    exit 1
fi
echo "✅ 数据库连接正常"

# 5. 检查Redis连接
echo "检查Redis连接..."
if ! docker-compose exec -T redis redis-cli ping > /dev/null; then
    echo "❌ Redis连接失败"
    exit 1
fi
echo "✅ Redis连接正常"

echo "🎉 所有健康检查通过"
```

### 性能测试

```bash
#!/bin/bash
# performance-test.sh

echo "开始性能测试..."

# 1. API性能测试
echo "API性能测试..."
ab -n 1000 -c 10 http://localhost:8000/health

# 2. 前端性能测试
echo "前端性能测试..."
lighthouse --chrome-flags="--headless" --output html --output-path ./reports/lighthouse.html http://localhost:3000

# 3. 数据库性能测试
echo "数据库性能测试..."
docker-compose exec postgres pgbench -i -s 10 dns_max
docker-compose exec postgres pgbench -c 10 -T 60 dns_max

# 4. 生成性能报告
echo "生成性能报告..."
# 这里可以添加自定义的性能分析脚本

echo "性能测试完成"
```

## 🔧 故障排除

### 常见部署问题

#### 1. 容器启动失败

```bash
# 检查容器日志
docker-compose logs [service_name]

# 检查容器状态
docker-compose ps

# 重新构建镜像
docker-compose build --no-cache [service_name]

# 清理并重新启动
docker-compose down -v
docker-compose up -d
```

#### 2. 数据库连接问题

```bash
# 检查数据库容器
docker-compose exec postgres pg_isready

# 检查连接参数
docker-compose exec backend python -c "
import os
print('DATABASE_URL:', os.getenv('DATABASE_URL'))
"

# 手动测试连接
docker-compose exec postgres psql -U dns_max_user -d dns_max
```

#### 3. 网络连接问题

```bash
# 检查网络配置
docker network ls
docker network inspect dns-max_default

# 测试容器间连通性
docker-compose exec backend ping postgres
docker-compose exec backend ping redis

# 检查端口占用
netstat -tlnp | grep :8000
netstat -tlnp | grep :3000
```

### 部署回滚

```bash
#!/bin/bash
# rollback.sh

VERSION=${1:-previous}

echo "回滚到版本: $VERSION"

# 1. 停止当前服务
docker-compose down

# 2. 切换到指定版本
git checkout $VERSION

# 3. 恢复配置文件
cp .env.backup .env

# 4. 启动服务
docker-compose up -d

# 5. 验证回滚
./scripts/health-check.sh

echo "回滚完成"
```

## 📈 扩展部署

### 水平扩展

```bash
# 扩展后端服务
docker-compose up -d --scale backend=3

# 扩展前端服务
docker-compose up -d --scale frontend=2

# 配置负载均衡
# 编辑 nginx.conf 添加upstream配置
```

### 多环境部署

```bash
# 不同环境使用不同的compose文件
docker-compose -f docker-compose.staging.yml up -d  # 预发布环境
docker-compose -f docker-compose.prod.yml up -d     # 生产环境
docker-compose -f docker-compose.dr.yml up -d       # 灾备环境
```

通过以上详细的部署指南，您可以在不同环境中成功部署 DNS Max 系统，确保系统的稳定性、安全性和可扩展性。
