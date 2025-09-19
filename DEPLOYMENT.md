# DNS Max 生产部署指南

本文档提供 DNS Max 统一 DNS 管理平台的完整生产环境部署指南，包含详细的配置说明、安全加固、性能优化和运维监控。

## 📋 部署环境规划

### 硬件配置要求

| 环境类型 | CPU | 内存 | 存储 | 网络 | 说明 |
|----------|-----|------|------|------|------|
| **开发环境** | 2核 | 4GB | 20GB | 100Mbps | 单机部署 |
| **测试环境** | 4核 | 8GB | 50GB | 500Mbps | 镜像生产环境 |
| **生产环境（小型）** | 8核 | 16GB | 100GB SSD | 1Gbps | < 1000 域名 |
| **生产环境（中型）** | 16核 | 32GB | 500GB SSD | 10Gbps | < 10000 域名 |
| **生产环境（大型）** | 32核+ | 64GB+ | 1TB+ NVMe | 10Gbps+ | 10000+ 域名 |

### 软件环境要求

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| **操作系统** | Ubuntu 20.04+ / CentOS 8+ / RHEL 8+ | 推荐 Ubuntu 22.04 LTS |
| **Docker** | 20.0+ | 容器运行时 |
| **Docker Compose** | 2.0+ | 容器编排工具 |
| **Git** | 2.0+ | 代码版本控制 |
| **curl/wget** | 最新版本 | 网络工具 |
| **防火墙** | ufw/firewalld | 安全防护 |

## 🚀 生产环境部署

### 部署前准备

#### 1. 服务器初始化

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装必要的工具
sudo apt install -y curl wget git htop vim ufw fail2ban

# 配置时区
sudo timedatectl set-timezone Asia/Shanghai

# 创建专用用户
sudo adduser dns-max
sudo usermod -aG docker dns-max
sudo usermod -aG sudo dns-max
```

#### 2. Docker 环境安装

```bash
# 安装 Docker 官方脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 3. 安全配置

```bash
# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 配置 fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 应用部署

#### 1. 获取项目代码

```bash
# 切换到专用用户
sudo su - dns-max

# 克隆项目到生产目录
git clone https://github.com/yourusername/dns-max.git /opt/dns-max
cd /opt/dns-max

# 检出稳定版本（建议使用 tag 而非 master）
git checkout v1.0.0
```

#### 2. 生产环境配置

```bash
# 创建生产环境配置
cp .env.example .env.production

# 编辑生产配置（见下方配置指南）
vim .env.production
```

**关键生产配置**：

```bash
# ===========================================
# 安全配置（必须修改）
# ===========================================
SECRET_KEY=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# ===========================================
# 数据库配置
# ===========================================
DATABASE_URL=postgresql://dns_max_user:${POSTGRES_PASSWORD}@postgres:5432/dns_max

# ===========================================
# 安全选项
# ===========================================
FORCE_HTTPS=true
SECURE_COOKIES=true
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]

# ===========================================
# 性能配置
# ===========================================
WORKERS_COUNT=8
RATE_LIMIT_ENABLED=true
CACHE_DEFAULT_TTL=600

# ===========================================
# 监控配置
# ===========================================
LOG_LEVEL=INFO
SENTRY_DSN=your_sentry_dsn_here
```

#### 3. SSL 证书配置

```bash
# 安装 Certbot
sudo apt install -y certbot

# 申请 SSL 证书
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# 创建证书目录
mkdir -p ./nginx/ssl

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
sudo chown -R dns-max:dns-max ./nginx/ssl/
```

#### 4. 启动生产服务

```bash
# 使用生产配置启动
docker-compose --env-file .env.production up -d

# 启动监控服务（可选）
docker-compose --env-file .env.production --profile monitoring up -d

# 等待服务完全启动
sleep 60

# 验证所有服务状态
docker-compose ps
```

### 自动化部署脚本

为简化部署流程，项目提供了一键部署脚本：

```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/.env.production"

echo "🚀 DNS Max 生产环境部署开始..."

# 检查运行环境
check_requirements() {
    echo "📋 检查部署环境..."

    # 检查是否为 root 用户
    if [[ $EUID -eq 0 ]]; then
        echo "❌ 请不要使用 root 用户运行此脚本"
        exit 1
    fi

    # 检查必要命令
    for cmd in docker docker-compose git curl; do
        if ! command -v $cmd &> /dev/null; then
            echo "❌ $cmd 未安装或不在 PATH 中"
            exit 1
        fi
    done

    # 检查 Docker 权限
    if ! docker ps &> /dev/null; then
        echo "❌ 当前用户无 Docker 权限，请运行: sudo usermod -aG docker $USER"
        exit 1
    fi

    echo "✅ 环境检查通过"
}

# 配置环境变量
setup_environment() {
    echo "⚙️ 配置生产环境..."

    if [[ ! -f "$ENV_FILE" ]]; then
        cp "${PROJECT_DIR}/.env.example" "$ENV_FILE"

        # 自动生成安全密钥
        SECRET_KEY=$(openssl rand -hex 32)
        POSTGRES_PASSWORD=$(openssl rand -base64 32)

        # 更新配置文件
        sed -i "s/SECRET_KEY=.*/SECRET_KEY=${SECRET_KEY}/" "$ENV_FILE"
        sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${POSTGRES_PASSWORD}/" "$ENV_FILE"
        sed -i "s/FORCE_HTTPS=false/FORCE_HTTPS=true/" "$ENV_FILE"
        sed -i "s/SECURE_COOKIES=false/SECURE_COOKIES=true/" "$ENV_FILE"

        echo "🔐 已生成安全配置，请编辑 $ENV_FILE 完成其他配置"
        echo "⚠️ 特别注意修改 BACKEND_CORS_ORIGINS 为您的实际域名"

        read -p "编辑完成后按回车继续..."
    fi
}

# 拉取最新镜像
pull_images() {
    echo "📦 拉取生产镜像..."
    docker-compose --env-file "$ENV_FILE" pull --ignore-pull-failures
}

# 启动服务
start_services() {
    echo "🔄 启动生产服务..."

    # 停止现有服务
    docker-compose --env-file "$ENV_FILE" down

    # 启动核心服务
    docker-compose --env-file "$ENV_FILE" up -d postgres redis

    # 等待数据库启动
    echo "⏳ 等待数据库启动..."
    sleep 20

    # 启动应用服务
    docker-compose --env-file "$ENV_FILE" up -d backend frontend nginx

    # 启动监控服务（可选）
    if [[ "${ENABLE_MONITORING:-false}" == "true" ]]; then
        docker-compose --env-file "$ENV_FILE" --profile monitoring up -d
    fi

    echo "⏳ 等待所有服务启动..."
    sleep 30
}

# 健康检查
health_check() {
    echo "🔍 执行健康检查..."

    # 检查容器状态
    if ! docker-compose --env-file "$ENV_FILE" ps | grep -q "Up"; then
        echo "❌ 部分容器未正常启动"
        docker-compose --env-file "$ENV_FILE" ps
        exit 1
    fi

    # 检查后端 API
    if ! curl -f http://localhost:8000/health &> /dev/null; then
        echo "❌ 后端 API 健康检查失败"
        docker-compose --env-file "$ENV_FILE" logs backend
        exit 1
    fi

    # 检查前端服务
    if ! curl -f http://localhost:3000 &> /dev/null; then
        echo "❌ 前端服务健康检查失败"
        docker-compose --env-file "$ENV_FILE" logs frontend
        exit 1
    fi

    echo "✅ 所有服务健康检查通过"
}

# 显示部署信息
show_deployment_info() {
    echo ""
    echo "🎉 DNS Max 生产环境部署完成！"
    echo ""
    echo "📍 访问地址："
    echo "   前端管理界面: http://localhost:3000"
    echo "   后端 API:    http://localhost:8000"
    echo "   API 文档:    http://localhost:8000/docs"
    echo ""
    echo "📊 管理命令："
    echo "   查看状态: docker-compose --env-file $ENV_FILE ps"
    echo "   查看日志: docker-compose --env-file $ENV_FILE logs -f [service]"
    echo "   停止服务: docker-compose --env-file $ENV_FILE down"
    echo ""
    echo "🔧 下一步："
    echo "   1. 配置域名和 SSL 证书"
    echo "   2. 设置定时备份任务"
    echo "   3. 配置监控告警"
    echo ""
}

# 执行部署流程
main() {
    cd "$PROJECT_DIR"

    check_requirements
    setup_environment
    pull_images
    start_services
    health_check
    show_deployment_info
}

# 运行主函数
main "$@"
```

**使用方式**：

```bash
# 赋予执行权限
chmod +x scripts/deploy-production.sh

# 运行部署脚本
./scripts/deploy-production.sh
```

## 📚 运维管理

### 常用管理命令

```bash
# ===========================================
# 服务管理
# ===========================================

# 查看所有服务状态
docker-compose --env-file .env.production ps

# 查看服务日志
docker-compose --env-file .env.production logs -f [service_name]

# 重启特定服务
docker-compose --env-file .env.production restart [service_name]

# 停止所有服务
docker-compose --env-file .env.production down

# 完全清理（包括数据卷）
docker-compose --env-file .env.production down -v

# ===========================================
# 更新服务
# ===========================================

# 拉取最新镜像
docker-compose --env-file .env.production pull

# 滚动更新（零停机）
docker-compose --env-file .env.production up -d --no-deps backend
docker-compose --env-file .env.production up -d --no-deps frontend

# 完整更新流程
git pull origin main
docker-compose --env-file .env.production pull
docker-compose --env-file .env.production up -d

# ===========================================
# 数据管理
# ===========================================

# 数据库备份
docker-compose --env-file .env.production exec postgres pg_dump -U dns_max_user dns_max > backup_$(date +%Y%m%d_%H%M%S).sql

# 数据库还原
cat backup_20240101_000000.sql | docker-compose --env-file .env.production exec -T postgres psql -U dns_max_user dns_max

# 清理未使用的镜像和卷
docker system prune -af
docker volume prune -f
```

### 服务端口说明

| 服务 | 内部端口 | 外部端口 | 用途 | 生产建议 |
|------|----------|----------|------|----------|
| **Nginx** | 80/443 | 80/443 | HTTP/HTTPS 入口 | 保持开放 |
| **前端** | 3000 | 3000 | Web 管理界面 | 通过 Nginx 代理 |
| **后端 API** | 8000 | 8000 | REST API 服务 | 通过 Nginx 代理 |
| **PostgreSQL** | 5432 | 5432 | 数据库服务 | 仅内网访问 |
| **Redis** | 6379 | 6379 | 缓存服务 | 仅内网访问 |
| **Prometheus** | 9090 | 9090 | 监控数据收集 | VPN 访问 |
| **Grafana** | 3000 | 3001 | 监控面板 | VPN 访问 |

### 性能调优建议

#### 数据库优化
```bash
# PostgreSQL 配置优化（根据服务器配置调整）
docker-compose --env-file .env.production exec postgres psql -U dns_max_user -d dns_max -c "
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
"
```

#### Redis 内存优化
```bash
# 设置 Redis 最大内存使用
docker-compose --env-file .env.production exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose --env-file .env.production exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

#### 应用程序优化
```bash
# 根据服务器配置调整工作进程数量
# 在 .env.production 中设置：
WORKERS_COUNT=8  # CPU 核心数量
MAX_WORKERS=16   # 最大工作进程数
```

## 📊 部署验证

### 自动化健康检查

项目提供了完整的健康检查脚本，确保部署质量：

```bash
#!/bin/bash
# scripts/health-check.sh

set -e

ENV_FILE="${1:-.env.production}"
TIMEOUT=30
RETRY_COUNT=3
CHECK_INTERVAL=10

echo "🔍 DNS Max 健康检查开始..."
echo "📁 使用配置文件: $ENV_FILE"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_with_retry() {
    local check_name="$1"
    local check_command="$2"
    local retry_count=0

    echo -n "🔸 检查 $check_name..."

    while [ $retry_count -lt $RETRY_COUNT ]; do
        if eval "$check_command" &> /dev/null; then
            echo -e " ${GREEN}✅ 通过${NC}"
            return 0
        fi

        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $RETRY_COUNT ]; then
            echo -n " 重试($retry_count/$RETRY_COUNT)..."
            sleep $CHECK_INTERVAL
        fi
    done

    echo -e " ${RED}❌ 失败${NC}"
    return 1
}

# 1. 检查 Docker 服务
echo "📦 检查容器服务..."

check_containers() {
    local unhealthy_containers=0
    local containers

    containers=$(docker-compose --env-file "$ENV_FILE" ps -q)

    for container in $containers; do
        local container_name
        container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/\///')

        local state
        state=$(docker inspect --format='{{.State.Status}}' "$container")

        if [ "$state" != "running" ]; then
            echo -e "   ${RED}❌ $container_name: $state${NC}"
            unhealthy_containers=$((unhealthy_containers + 1))
        else
            # 检查健康状态（如果有健康检查）
            local health
            health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")

            if [ "$health" = "unhealthy" ]; then
                echo -e "   ${RED}❌ $container_name: unhealthy${NC}"
                unhealthy_containers=$((unhealthy_containers + 1))
            elif [ "$health" = "healthy" ] || [ "$health" = "none" ]; then
                echo -e "   ${GREEN}✅ $container_name: $state${NC}"
            else
                echo -e "   ${YELLOW}⏳ $container_name: $health${NC}"
            fi
        fi
    done

    return $unhealthy_containers
}

if ! check_with_retry "容器状态" "check_containers"; then
    echo -e "${RED}❌ 容器健康检查失败${NC}"
    docker-compose --env-file "$ENV_FILE" ps
    exit 1
fi

# 2. 检查网络连通性
echo ""
echo "🌐 检查网络连通性..."

check_with_retry "后端 API 健康" "curl -f -s --max-time $TIMEOUT http://localhost:8000/health"
check_with_retry "前端服务" "curl -f -s --max-time $TIMEOUT http://localhost:3000"

# 3. 检查数据库连接
echo ""
echo "🗄️ 检查数据库连接..."

check_with_retry "PostgreSQL 连接" "docker-compose --env-file $ENV_FILE exec -T postgres pg_isready -U dns_max_user"
check_with_retry "Redis 连接" "docker-compose --env-file $ENV_FILE exec -T redis redis-cli ping"

# 4. 检查 API 功能
echo ""
echo "🔧 检查核心 API 功能..."

check_with_retry "API 文档访问" "curl -f -s --max-time $TIMEOUT http://localhost:8000/docs"
check_with_retry "API 版本信息" "curl -f -s --max-time $TIMEOUT http://localhost:8000/api/v1/"

# 5. 检查日志中的错误
echo ""
echo "📋 检查服务日志..."

check_service_logs() {
    local has_errors=0
    local services=("backend" "frontend" "postgres" "redis")

    for service in "${services[@]}"; do
        echo -n "   🔸 检查 $service 日志..."

        # 获取最近 50 行日志并检查错误
        local error_count
        error_count=$(docker-compose --env-file "$ENV_FILE" logs --tail=50 "$service" 2>/dev/null | \
                     grep -iE "(error|fatal|exception|fail)" | \
                     grep -v "health" | \
                     wc -l)

        if [ "$error_count" -gt 0 ]; then
            echo -e " ${YELLOW}⚠️ 发现 $error_count 个错误${NC}"
            has_errors=1
        else
            echo -e " ${GREEN}✅ 正常${NC}"
        fi
    done

    return $has_errors
}

if ! check_service_logs; then
    echo -e "${YELLOW}⚠️ 服务日志中发现错误，请检查具体日志${NC}"
fi

# 6. 性能检查
echo ""
echo "⚡ 性能检查..."

check_performance() {
    echo -n "   🔸 API 响应时间..."
    local response_time
    response_time=$(curl -o /dev/null -s -w "%{time_total}" --max-time $TIMEOUT http://localhost:8000/health)

    if (( $(echo "$response_time > 2.0" | bc -l) )); then
        echo -e " ${YELLOW}⚠️ ${response_time}s (较慢)${NC}"
    else
        echo -e " ${GREEN}✅ ${response_time}s${NC}"
    fi

    echo -n "   🔸 内存使用..."
    local memory_usage
    memory_usage=$(docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | grep -E "(backend|frontend|postgres|redis)" | head -4)
    echo -e " ${GREEN}✅ 正常${NC}"
}

check_performance

# 7. 生成健康报告
echo ""
echo "📊 生成健康报告..."

generate_health_report() {
    local report_file="/tmp/dns-max-health-$(date +%Y%m%d_%H%M%S).txt"

    {
        echo "=== DNS Max 健康检查报告 ==="
        echo "检查时间: $(date)"
        echo "配置文件: $ENV_FILE"
        echo ""

        echo "=== 容器状态 ==="
        docker-compose --env-file "$ENV_FILE" ps
        echo ""

        echo "=== 系统资源使用 ==="
        docker stats --no-stream
        echo ""

        echo "=== 最近日志（最后 10 行）==="
        for service in backend frontend postgres redis; do
            echo "--- $service ---"
            docker-compose --env-file "$ENV_FILE" logs --tail=10 "$service" 2>/dev/null | tail -5
            echo ""
        done

    } > "$report_file"

    echo "   📄 健康报告已保存: $report_file"
}

generate_health_report

echo ""
echo -e "${GREEN}🎉 DNS Max 健康检查完成！${NC}"
echo ""
echo "📍 服务访问地址:"
echo "   🌐 前端管理: http://localhost:3000"
echo "   🔧 API 服务: http://localhost:8000"
echo "   📚 API 文档: http://localhost:8000/docs"
echo ""
echo "📊 管理命令:"
echo "   docker-compose --env-file $ENV_FILE ps          # 查看状态"
echo "   docker-compose --env-file $ENV_FILE logs -f     # 查看日志"
echo "   docker-compose --env-file $ENV_FILE restart     # 重启服务"
echo ""
```

**使用方式**：

```bash
# 使用默认配置检查
./scripts/health-check.sh

# 使用指定配置文件检查
./scripts/health-check.sh .env.production

# 定时健康检查（添加到 crontab）
*/10 * * * * /opt/dns-max/scripts/health-check.sh >/dev/null 2>&1
```

## 🔧 故障排除

### 常见部署问题

#### 1. 容器启动失败

<details>
<summary><strong>问题：容器无法启动或频繁重启</strong></summary>

**诊断步骤**：
```bash
# 1. 查看详细的容器状态
docker-compose --env-file .env.production ps

# 2. 检查特定服务的日志
docker-compose --env-file .env.production logs --tail=50 -f [service_name]

# 3. 检查容器退出原因
docker inspect [container_id] --format='{{.State}}'

# 4. 检查系统资源
df -h          # 磁盘空间
free -h        # 内存使用
docker system df  # Docker 磁盘使用
```

**解决方案**：
```bash
# 清理 Docker 系统
docker system prune -af
docker volume prune -f

# 重新拉取镜像
docker-compose --env-file .env.production pull --ignore-pull-failures

# 完全重新部署
docker-compose --env-file .env.production down -v
docker-compose --env-file .env.production up -d
```
</details>

#### 2. 数据库连接问题

<details>
<summary><strong>问题：应用无法连接到数据库</strong></summary>

**诊断步骤**：
```bash
# 1. 检查数据库容器状态
docker-compose --env-file .env.production exec postgres pg_isready -U dns_max_user

# 2. 验证数据库连接信息
docker-compose --env-file .env.production exec backend python -c "
import os
print('DATABASE_URL:', os.getenv('DATABASE_URL', '未设置'))
"

# 3. 测试网络连通性
docker-compose --env-file .env.production exec backend ping postgres

# 4. 检查数据库日志
docker-compose --env-file .env.production logs postgres | tail -50
```

**解决方案**：
```bash
# 重启数据库服务
docker-compose --env-file .env.production restart postgres

# 检查并修复数据库权限
docker-compose --env-file .env.production exec postgres psql -U postgres -c "
ALTER USER dns_max_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE dns_max TO dns_max_user;
"

# 重新初始化数据库（仅在开发环境）
docker-compose --env-file .env.production down postgres
docker volume rm dns-max_postgres_data
docker-compose --env-file .env.production up -d postgres
```
</details>

#### 3. 性能问题

<details>
<summary><strong>问题：API 响应缓慢或超时</strong></summary>

**诊断步骤**：
```bash
# 1. 检查 API 响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/health

# 2. 监控系统资源
docker stats --no-stream

# 3. 检查数据库性能
docker-compose --env-file .env.production exec postgres psql -U dns_max_user -d dns_max -c "
SELECT query, calls, mean_exec_time, rows, 100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
"

# 4. 检查慢查询日志
docker-compose --env-file .env.production logs backend | grep "slow"
```

**优化建议**：
```bash
# 调整工作进程数量
echo "WORKERS_COUNT=$(nproc)" >> .env.production

# 优化数据库配置
docker-compose --env-file .env.production exec postgres psql -U dns_max_user -d dns_max -c "
ALTER SYSTEM SET shared_buffers = '512MB';
ALTER SYSTEM SET effective_cache_size = '2GB';
SELECT pg_reload_conf();
"

# 启用 Redis 缓存优化
docker-compose --env-file .env.production exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```
</details>

#### 4. SSL/HTTPS 配置问题

<details>
<summary><strong>问题：HTTPS 无法正常工作</strong></summary>

**诊断步骤**：
```bash
# 1. 检查证书文件
ls -la ./nginx/ssl/
openssl x509 -in ./nginx/ssl/fullchain.pem -text -noout

# 2. 验证 Nginx 配置
docker-compose --env-file .env.production exec nginx nginx -t

# 3. 检查 SSL 端口
netstat -tlnp | grep :443
```

**解决方案**：
```bash
# 重新申请证书
sudo certbot renew --force-renewal

# 更新证书到项目目录
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
sudo chown -R dns-max:dns-max ./nginx/ssl/

# 重启 Nginx 服务
docker-compose --env-file .env.production restart nginx
```
</details>

### 高可用部署

#### 数据库高可用

```bash
# PostgreSQL 主从复制配置
# 主库配置
docker-compose --env-file .env.production exec postgres psql -U postgres -c "
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET wal_keep_segments = 64;
SELECT pg_reload_conf();
"

# 创建复制用户
docker-compose --env-file .env.production exec postgres psql -U postgres -c "
CREATE USER replica_user REPLICATION LOGIN ENCRYPTED PASSWORD 'replica_password';
"
```

#### 负载均衡配置

```bash
# Nginx 负载均衡配置示例
cat > ./nginx/conf.d/load-balance.conf << 'EOF'
upstream backend_pool {
    server backend-1:8000 weight=3;
    server backend-2:8000 weight=2;
    server backend-3:8000 backup;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

### 安全加固

#### 生产环境安全检查

```bash
#!/bin/bash
# scripts/security-check.sh

echo "🔒 执行安全检查..."

# 1. 检查敏感配置
echo "🔸 检查环境配置安全性..."

check_env_security() {
    local env_file=".env.production"
    local issues=0

    # 检查默认密码
    if grep -q "dns_max_password" "$env_file"; then
        echo "❌ 发现默认数据库密码"
        issues=$((issues + 1))
    fi

    # 检查弱密钥
    if grep -q "CHANGE_THIS" "$env_file"; then
        echo "❌ 发现未修改的默认密钥"
        issues=$((issues + 1))
    fi

    # 检查 HTTP 配置
    if grep -q "FORCE_HTTPS=false" "$env_file"; then
        echo "❌ HTTPS 未强制启用"
        issues=$((issues + 1))
    fi

    if [ $issues -eq 0 ]; then
        echo "✅ 环境配置安全检查通过"
    fi

    return $issues
}

check_env_security

# 2. 检查容器安全
echo "🔸 检查容器安全配置..."

docker-compose --env-file .env.production config | grep -E "(privileged|user)" | while read -r line; do
    echo "🔍 $line"
done

# 3. 检查网络安全
echo "🔸 检查网络端口开放..."
netstat -tlnp | grep -E ":(3000|8000|5432|6379)" | while read -r line; do
    echo "🔍 $line"
done

echo "✅ 安全检查完成"
```

### 备份与恢复

#### 自动备份脚本

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/opt/dns-max/backups"
DATE=$(date +%Y%m%d_%H%M%S)
ENV_FILE=".env.production"

mkdir -p "$BACKUP_DIR"

echo "🗄️ 开始数据备份..."

# 1. 数据库备份
echo "📁 备份 PostgreSQL 数据库..."
docker-compose --env-file "$ENV_FILE" exec -T postgres pg_dump -U dns_max_user dns_max | gzip > "$BACKUP_DIR/database_$DATE.sql.gz"

# 2. Redis 备份
echo "📁 备份 Redis 数据..."
docker-compose --env-file "$ENV_FILE" exec redis redis-cli BGSAVE
docker cp $(docker-compose --env-file "$ENV_FILE" ps -q redis):/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# 3. 配置文件备份
echo "📁 备份配置文件..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" .env.production docker-compose.yml nginx/

# 4. 清理旧备份（保留 30 天）
echo "🧹 清理旧备份文件..."
find "$BACKUP_DIR" -name "*.gz" -o -name "*.rdb" -o -name "*.tar.gz" | sort | head -n -30 | xargs rm -f

echo "✅ 备份完成: $BACKUP_DIR"
```

#### 恢复脚本

```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE=$1
BACKUP_DIR="/opt/dns-max/backups"
ENV_FILE=".env.production"

if [ -z "$BACKUP_FILE" ]; then
    echo "使用方法: $0 <backup_file>"
    echo "可用备份:"
    ls -la "$BACKUP_DIR"
    exit 1
fi

echo "⚠️ 准备从备份恢复: $BACKUP_FILE"
read -p "确认继续？这将覆盖现有数据 (y/N): " confirm

if [ "$confirm" != "y" ]; then
    echo "取消恢复操作"
    exit 0
fi

# 停止服务
echo "🛑 停止服务..."
docker-compose --env-file "$ENV_FILE" down

# 恢复数据库
echo "📥 恢复数据库..."
docker-compose --env-file "$ENV_FILE" up -d postgres
sleep 10
zcat "$BACKUP_DIR/$BACKUP_FILE" | docker-compose --env-file "$ENV_FILE" exec -T postgres psql -U dns_max_user dns_max

# 启动所有服务
echo "🚀 启动服务..."
docker-compose --env-file "$ENV_FILE" up -d

echo "✅ 恢复完成"
```

### 监控和告警

#### Prometheus 监控配置

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'dns-max-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

---

## 📞 获取支持

### 官方支持渠道

- **📚 文档中心**: 完整的部署和使用文档
- **🐛 问题报告**: [GitHub Issues](https://github.com/yourusername/dns-max/issues)
- **💬 社区讨论**: [GitHub Discussions](https://github.com/yourusername/dns-max/discussions)
- **📧 邮件支持**: support@yourdomain.com（企业用户）

### 常用资源

- **🏠 项目主页**: https://github.com/yourusername/dns-max
- **📖 API 文档**: http://localhost:8000/docs
- **🔧 配置参考**: [ENVIRONMENT.md](./ENVIRONMENT.md)
- **🔍 故障排除**: 本文档故障排除部分

通过以上详细的部署指南，您可以成功地在生产环境中部署和运维 DNS Max 统一管理平台，确保系统的高可用性、安全性和稳定性。
