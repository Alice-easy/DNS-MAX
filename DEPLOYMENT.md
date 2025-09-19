# DNS-Max Docker 部署指南

## 概述

DNS-Max 项目现在支持两种部署模式：

1. **开发模式** - 本地构建镜像用于开发和测试
2. **生产模式** - 从 GitHub Container Registry 拉取预构建镜像

## 文件说明

- `docker-compose.yml` - 本地开发环境配置，使用本地构建
- `docker-compose.registry.yml` - 生产环境配置，从镜像仓库拉取
- `deploy.sh` / `deploy.bat` - 部署脚本，简化常用操作
- `.github/workflows/docker-build.yml` - GitHub Actions 自动构建和推送 Docker 镜像

## 快速开始

### 使用部署脚本 (推荐)

#### Linux/macOS:
```bash
# 启动本地开发环境
./deploy.sh dev

# 启动生产环境
./deploy.sh prod

# 查看帮助
./deploy.sh help
```

#### Windows:
```cmd
# 启动本地开发环境
deploy.bat dev

# 启动生产环境  
deploy.bat prod

# 查看帮助
deploy.bat help
```

## CI/CD 工作流

### 自动镜像构建

当代码推送到 `master` 分支时，GitHub Actions 会自动：

1. 构建后端和前端 Docker 镜像
2. 推送镜像到 GitHub Container Registry
3. 更新 `docker-compose.registry.yml` 中的镜像标签
4. 提交更新到仓库

### 镜像标签策略

- `latest` - 最新的主分支构建
- `<branch>-<sha>` - 特定提交的镜像
- `<tag>` - 发布版本标签

## 服务访问地址

启动后可通过以下地址访问服务：

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432 (仅开发环境)
- **Redis**: localhost:6379 (仅开发环境)
