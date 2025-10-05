# 快速开始指南

## 🚀 3 分钟快速部署

### 前置要求

- Docker 和 Docker Compose
- Git

### 快速启动

```bash
# 1. 克隆项目
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max

# 2. 配置环境变量
cp env.example .env

# 3. 启动服务
docker-compose up -d --build

# 4. 访问应用
# 前端: http://localhost:3000
# API文档: http://localhost:8000/docs
```

### 首次使用

1. **注册账号**

   - 访问 http://localhost:3000
   - 点击"注册"按钮
   - 第一个注册的用户自动成为管理员

2. **配置系统**（可选）

   - 登录后访问"管理员后台"
   - 进入"系统配置"标签
   - 配置邮件服务（SMTP/Resend）
   - 配置 DNSPod API

3. **开始使用**
   - 申请域名分发
   - 管理员审核
   - 自动创建 DNS 记录

### 默认端口

| 服务   | 端口 | 说明               |
| ------ | ---- | ------------------ |
| 前端   | 3000 | Next.js Web 界面   |
| API    | 8000 | FastAPI 后端       |
| 数据库 | 5432 | PostgreSQL（内部） |

### 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f api
docker-compose logs -f web

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新服务
git pull && docker-compose up -d --build
```

### 验证部署

```bash
# 检查API健康状态
curl http://localhost:8000/healthz

# 应该返回: {"status":"ok"}
```

### 下一步

- [完整部署指南](DEPLOYMENT.md) - 生产环境部署
- [故障排除](TROUBLESHOOTING.md) - 常见问题解决
- [README](../README.md) - 项目总览

---

遇到问题？查看 [故障排除文档](TROUBLESHOOTING.md)
