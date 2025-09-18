# DNS Max 部署指南

本文档提供了 DNS Max 系统的快速部署指南，包含完整的部署流程和故障排除指南。

## 📋 部署准备

### 系统要求

| 配置类型 | 最低要求                  | 推荐配置                   |
| -------- | ------------------------- | -------------------------- |
| **硬件** | 4GB RAM, 2 CPU, 20GB 存储 | 8GB RAM, 4 CPU, 50GB SSD   |

### 软件依赖

```bash
# 必需软件
- Docker: 20.0+
- Docker Compose: 2.0+
- Git: 2.0+
```

## 🚀 快速部署

### 部署步骤

#### 1. 获取项目代码

```bash
git clone https://github.com/yourusername/dns-max.git
cd dns-max
```

#### 2. 配置环境变量

```bash
# 复制环境配置文件
cp .env.example .env

# 编辑配置文件，设置数据库密码、API密钥等
nano .env
```

#### 3. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 等待服务启动完成
sleep 30
```

#### 4. 验证部署

```bash
# 检查服务状态
docker-compose ps

# 验证健康状态
curl -f http://localhost:8000/health && echo "后端服务正常"
curl -f http://localhost:3000 && echo "前端服务正常"
```

#### 5. 访问系统

```bash
echo "部署完成！"
echo "前端地址: http://localhost:3000"
echo "后端API: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
```

### 一键部署脚本

如果您希望自动化部署，可以使用以下脚本：

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 开始部署 DNS Max..."

# 检查依赖
command -v docker >/dev/null 2>&1 || { echo "❌ Docker未安装" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose未安装" >&2; exit 1; }

# 配置环境
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置环境变量"
    read -p "按回车键继续..."
fi

# 启动服务
echo "📦 启动服务..."
docker-compose up -d

# 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 30

# 验证部署
echo "✅ 验证部署..."
./scripts/health-check.sh

echo "🎉 部署完成！访问 http://localhost:3000 开始使用"
```

## 📚 快速参考

### 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f [service_name]

# 重启服务
docker-compose restart [service_name]

# 查看服务状态
docker-compose ps

# 更新并重启
git pull && docker-compose pull && docker-compose up -d
```

### 重要端口

| 服务     | 端口  | 用途       |
| -------- | ----- | ---------- |
| 前端     | 3000  | Web界面    |
| 后端API  | 8000  | REST API   |
| 数据库   | 5432  | PostgreSQL |
| 缓存     | 6379  | Redis      |

## 📊 部署验证

### 自动化健康检查

```bash
#!/bin/bash
# health-check.sh

TIMEOUT=30

echo "开始健康检查..."

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
if ! curl -f -s --max-time $TIMEOUT "http://localhost:8000/health" > /dev/null; then
    echo "❌ API端点不可访问"
    exit 1
fi
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

通过以上部署指南，您可以快速部署 DNS Max 系统，确保系统的稳定性和可用性。
