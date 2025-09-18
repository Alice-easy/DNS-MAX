# DNS 分发系统 (DNS Max)

一个现代化的域名二次分发系统，支持多家 DNS 服务商的统一管理，提供友好的 Web 界面进行域名和 DNS 记录的管理。

## 🚀 功能特性

### 核心功能

- **多 DNS 服务商支持**：集成阿里云、Cloudflare、腾讯云等主流 DNS 服务商
- **统一管理界面**：通过 Web 界面统一管理所有 DNS 服务商的域名和记录
- **用户认证系统**：安全的 JWT 认证，支持用户注册、登录、权限管理
- **实时 DNS 管理**：支持 A、AAAA、CNAME、MX、TXT、NS、SRV 等多种 DNS 记录类型
- **批量操作**：支持批量添加、修改、删除 DNS 记录
- **操作日志**：详细记录所有 DNS 操作，便于审计和故障排查

### 技术特点

- **现代化技术栈**：采用 FastAPI + Next.js 15 的全栈架构
- **容器化部署**：完整的 Docker 支持，一键部署
- **高性能**：异步处理，Redis 缓存，高并发支持
- **安全可靠**：加密存储 API 密钥，安全的认证机制
- **响应式设计**：适配各种设备，优秀的用户体验

## 📋 系统要求

### 最低配置

- **CPU**: 2 核心
- **内存**: 2GB RAM
- **存储**: 10GB 可用空间
- **操作系统**: Linux/Windows/macOS

### 推荐配置

- **CPU**: 4 核心或更多
- **内存**: 4GB RAM 或更多
- **存储**: 20GB SSD
- **网络**: 1Mbps 上行带宽

## 🛠️ 技术栈

### 后端

- **框架**: FastAPI 0.104+
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **异步处理**: asyncio, SQLAlchemy 2.0
- **认证**: JWT Token
- **API 文档**: OpenAPI/Swagger

### 前端

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **表单处理**: React Hook Form + Zod

### 部署

- **容器**: Docker & Docker Compose
- **反向代理**: Nginx
- **进程管理**: systemd/Docker

## 📦 快速开始

### 方式一：Docker Compose（推荐）

1. **克隆项目**

```bash
git clone https://github.com/yourusername/dns-max.git
cd dns-max
```

2. **配置环境变量**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

3. **启动服务**

```bash
# 生产环境
docker-compose up -d

# 开发环境（仅启动数据库）
docker-compose -f docker-compose.dev.yml up -d
```

4. **访问应用**

- 前端界面: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 方式二：本地开发

#### 后端启动

1. **安装 Python 依赖**

```bash
cd backend

# 使用Poetry（推荐）
poetry install

# 或使用pip
pip install -r requirements.txt
```

2. **配置数据库**

```bash
# 启动PostgreSQL和Redis
docker-compose -f docker-compose.dev.yml up -d

# 运行数据库迁移
alembic upgrade head
```

3. **启动后端服务**

```bash
# 开发模式
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 或使用Poetry
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端启动

1. **安装 Node.js 依赖**

```bash
cd frontend
npm install
```

2. **启动前端服务**

```bash
npm run dev
```

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```bash
# 数据库配置
DATABASE_URL=postgresql://dns_max_user:dns_max_password@localhost:5432/dns_max

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT密钥（请修改为复杂的随机字符串）
SECRET_KEY=your_super_secret_key_here_change_in_production

# Token过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 跨域配置
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# 前端API地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### DNS 服务商配置

系统支持以下 DNS 服务商，需要在 Web 界面中配置相应的 API 密钥：

#### 阿里云 DNS

```json
{
  "access_key_id": "your_access_key_id",
  "access_key_secret": "your_access_key_secret",
  "region": "cn-hangzhou"
}
```

#### Cloudflare DNS

```json
{
  "api_token": "your_api_token",
  "email": "your_email@example.com",
  "api_key": "your_global_api_key"
}
```

#### 腾讯云 DNS

```json
{
  "secret_id": "your_secret_id",
  "secret_key": "your_secret_key",
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

## 🚀 部署指南

### Docker 生产部署

1. **准备服务器**

```bash
# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **克隆项目并配置**

```bash
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 配置生产环境变量
cp .env.example .env
vim .env
```

3. **启动服务**

```bash
docker-compose up -d
```

4. **配置 Nginx（可选）**

```bash
# 使用内置的Nginx配置
docker-compose exec nginx nginx -t
docker-compose exec nginx nginx -s reload
```

### 系统服务配置

创建 systemd 服务文件以自动启动：

```bash
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

sudo systemctl enable dns-max
sudo systemctl start dns-max
```

## 🔍 监控和日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 健康检查

```bash
# 检查服务状态
docker-compose ps

# 检查健康状态
curl http://localhost:8000/health
```

### 性能监控

系统提供以下监控端点：

- `/health` - 服务健康状态
- `/metrics` - Prometheus 格式的监控指标

## 🔒 安全注意事项

### 生产环境安全配置

1. **修改默认密钥**

```bash
# 生成强密码
openssl rand -hex 32

# 更新.env文件中的SECRET_KEY
```

2. **配置 HTTPS**

```bash
# 获取SSL证书（使用Let's Encrypt）
certbot --nginx -d yourdomain.com
```

3. **防火墙配置**

```bash
# 只开放必要端口
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

4. **定期备份**

```bash
# 数据库备份
docker-compose exec postgres pg_dump -U dns_max_user dns_max > backup.sql

# 完整备份
tar -czf dns-max-backup-$(date +%Y%m%d).tar.gz .env docker-compose.yml data/
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

## 🆘 常见问题

### Q: 如何重置管理员密码？

A: 可以通过以下命令重置：

```bash
docker-compose exec backend python -c "
from app.crud.user import create_user
from app.core.security import get_password_hash
# 创建新的管理员用户
"
```

### Q: 如何迁移数据？

A: 使用以下命令进行数据库迁移：

```bash
docker-compose exec backend alembic upgrade head
```

### Q: 如何扩展服务？

A: 修改 docker-compose.yml 中的 replicas 配置：

```yaml
services:
  backend:
    deploy:
      replicas: 3
```

### Q: 如何查看详细错误日志？

A: 查看特定服务的详细日志：

```bash
docker-compose logs --tail=100 -f backend
```

## 📞 支持

- 📧 邮箱: support@dnsmax.com
- 🐛 问题反馈: [GitHub Issues](https://github.com/yourusername/dns-max/issues)
- 📖 文档: [在线文档](https://docs.dnsmax.com)
- 💬 社区讨论: [Discussions](https://github.com/yourusername/dns-max/discussions)

---

**DNS Max** - 让 DNS 管理变得简单高效！🚀
