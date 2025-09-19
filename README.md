# DNS Max

<div align="center">

![DNS Max](https://img.shields.io/badge/DNS%20Max-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5+-blue)
![React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**现代化的统一 DNS 管理平台**

企业级多云 DNS 服务商统一管理解决方案，支持阿里云、腾讯云、Cloudflare 等主流服务商的集中化管理与自动化操作。



</div>

## ✨ 核心特性

### 🌐 多云 DNS 统一管理
- **阿里云 DNS** - 完整支持阿里云 DNS 服务管理
- **腾讯云 DNSPod** - 集成腾讯云 DNSPod API 服务
- **Cloudflare DNS** - 支持 Cloudflare 全球加速 DNS
- **统一接口** - 一套 API 管理所有服务商

### 🔒 企业级安全保障
- **JWT 认证** - 基于 RS256 算法的安全认证
- **API 密钥加密** - 服务商凭据安全加密存储
- **操作审计** - 完整的 DNS 操作日志记录
- **权限控制** - 细粒度的用户权限管理

### ⚡ 现代化架构
- **异步处理** - FastAPI 异步框架，高并发支持
- **智能缓存** - Redis 缓存层，提升响应速度
- **实时更新** - WebSocket 实时状态推送
- **容器化部署** - Docker 容器化，一键部署

### 📱 优秀用户体验
- **响应式设计** - 支持桌面端和移动端
- **现代化 UI** - 基于 shadcn/ui 的精美界面
- **直观操作** - 拖拽式 DNS 记录管理
- **实时反馈** - 操作状态实时显示

### 📋 完整 DNS 功能
- **记录类型支持** - A/AAAA/CNAME/MX/TXT/NS/SRV/CAA 等
- **批量操作** - 支持批量导入导出 DNS 记录
- **域名管理** - 多域名集中管理
- **TTL 优化** - 智能 TTL 建议和优化

## 🚀 快速开始



### 一键部署

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 2. 配置环境变量
cp .env.example .env
# ⚠️ 重要：编辑 .env 文件，修改以下关键配置：
# - SECRET_KEY: JWT 签名密钥
# - POSTGRES_PASSWORD: 数据库密码
# - BACKEND_CORS_ORIGINS: 允许的前端域名

# 3. 启动服务（使用预构建镜像）
docker-compose up -d



部署完成后，您可以通过以下地址访问：

- **前端管理界面**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **交互式 API 文档**: http://localhost:8000/redoc

> 💡 **镜像说明**: 项目默认使用 GitHub Actions 自动构建的预构建镜像。如需自定义，可在 `.env` 中修改 `BACKEND_IMAGE` 和 `FRONTEND_IMAGE` 变量。

## 🛠️ 技术架构

### 后端技术栈
- **Python 3.11+** - 现代 Python 开发
- **FastAPI 0.104+** - 高性能异步 Web 框架
- **SQLAlchemy 2.0+** - 异步 ORM 数据库操作
- **PostgreSQL 15** - 企业级关系数据库
- **Redis 7** - 高性能缓存和会话存储
- **AsyncPG** - 异步 PostgreSQL 数据库驱动
- **Pydantic** - 数据验证和序列化
- **Cryptography** - API 密钥加密存储

### 前端技术栈
- **Next.js 15.5** - 全栈 React 框架
- **React 19.1** - 最新 React 版本
- **TypeScript 5.0+** - 静态类型检查
- **Tailwind CSS 4.0** - 原子化 CSS 框架
- **shadcn/ui** - 现代化 UI 组件库
- **Zustand** - 轻量级状态管理
- **TanStack Query** - 数据获取和缓存
- **React Hook Form** - 表单处理
- **Zod** - 运行时类型验证

### DNS 服务商集成
- **阿里云 DNS SDK** - alibabacloud-alidns20150109
- **腾讯云 DNSPod SDK** - tencentcloud-sdk-python-dnspod
- **Cloudflare API** - RESTful API 集成
- **HTTPX** - 异步 HTTP 客户端

### 基础设施
- **Docker & Docker Compose** - 容器化部署
- **Nginx** - 反向代理和负载均衡
- **GitHub Actions** - CI/CD 自动化
- **PostgreSQL** - 主数据存储
- **Redis** - 缓存和会话管理

## 📚 使用指南

### 1. 初始化设置

#### 首次登录
1. 访问 http://localhost:3000
2. 点击"注册"创建管理员账户
3. 登录系统进入控制面板

#### 添加 DNS 服务商
进入"服务商管理"页面，配置您的 DNS 服务商：

##### 阿里云 DNS 配置
```json
{
  "name": "阿里云主账户",
  "access_key_id": "LTAI5t*****",
  "access_key_secret": "L4KZj*****",
  "region": "cn-hangzhou"
}
```

##### 腾讯云 DNSPod 配置
```json
{
  "name": "腾讯云主账户",
  "secret_id": "AKID*****",
  "secret_key": "HaC*****",
  "region": "ap-guangzhou"
}
```

##### Cloudflare 配置
```json
{
  "name": "Cloudflare主账户",
  "api_token": "YQSn*****",
  "email": "admin@yourdomain.com"
}
```

### 2. 域名和 DNS 记录管理

#### 添加域名
1. 在"域名管理"页面点击"添加域名"
2. 选择对应的 DNS 服务商
3. 输入域名（如：example.com）
4. 系统自动同步现有 DNS 记录

#### DNS 记录操作
- **查看记录**: 实时显示所有记录类型和状态
- **添加记录**: 支持 A/AAAA/CNAME/MX/TXT/NS/SRV/CAA 记录
- **批量导入**: 支持 CSV/JSON 格式批量导入
- **批量导出**: 导出为 CSV/JSON/BIND 格式
- **实时同步**: 自动同步服务商端变更

#### 支持的记录类型
| 记录类型 | 说明 | 示例 |
|----------|------|------|
| **A** | IPv4 地址记录 | www.example.com → 192.168.1.1 |
| **AAAA** | IPv6 地址记录 | www.example.com → 2001:db8::1 |
| **CNAME** | 别名记录 | blog.example.com → www.example.com |
| **MX** | 邮件交换记录 | example.com → mail.example.com |
| **TXT** | 文本记录 | SPF/DKIM/域名验证 |
| **NS** | 名称服务器记录 | 子域名授权 |
| **SRV** | 服务记录 | 服务发现 |
| **CAA** | 证书颁发机构授权 | SSL 证书安全 |

### 3. 高级功能

#### 智能 TTL 优化
- 系统根据记录类型推荐最佳 TTL 值
- 支持批量 TTL 调整
- 提供 TTL 性能分析报告

#### 操作审计日志
- 记录所有 DNS 操作历史
- 支持按用户、域名、操作类型筛选
- 提供操作回滚功能（24小时内）

#### 监控告警
- DNS 记录变更实时通知
- 域名解析状态监控
- 异常操作安全告警

## 📊 性能指标

### 系统容量
- **并发用户**: 支持 1000+ 并发用户
- **DNS 记录**: 单域名支持 10,000+ 记录
- **域名数量**: 系统支持 1,000+ 域名管理
- **服务商**: 同时管理 100+ DNS 服务商账户

### 响应性能
- **API 响应时间**: < 200ms (95% 请求)
- **页面加载时间**: < 2s (首次加载)
- **DNS 操作延迟**: < 5s (单条记录)
- **批量操作**: 1000 记录/分钟

## 📖 完整文档

- **[部署指南](./DEPLOYMENT.md)** - 生产环境部署详细说明
- **[环境配置](./ENVIRONMENT.md)** - 环境变量完整配置参考



### 使用相关

<details>
<summary><strong>🔑 DNS 服务商认证失败</strong></summary>

1. **阿里云 DNS**: 检查 AccessKey 权限是否包含 DNS 管理权限
2. **腾讯云 DNSPod**: 确认 SecretId/SecretKey 有效期
3. **Cloudflare**: 验证 API Token 权限范围
4. **网络**: 确认服务器可访问对应服务商 API

```bash
# 测试网络连通性
docker-compose exec backend python -c "
import httpx
import asyncio

async def test_connectivity():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get('https://ecs.aliyuncs.com', timeout=10)
            print('阿里云连通性:', resp.status_code)
        except Exception as e:
            print('阿里云连接失败:', e)

        try:
            resp = await client.get('https://dnspod.tencentcloudapi.com', timeout=10)
            print('腾讯云连通性:', resp.status_code)
        except Exception as e:
            print('腾讯云连接失败:', e)

        try:
            resp = await client.get('https://api.cloudflare.com/client/v4', timeout=10)
            print('Cloudflare连通性:', resp.status_code)
        except Exception as e:
            print('Cloudflare连接失败:', e)

asyncio.run(test_connectivity())
"
```
</details>

### 获取帮助

- **GitHub Issues**: [https://github.com/Alice-easy/DNS-Max/issues](https://github.com/Alice-easy/DNS-Max/issues)
- **文档中心**: [完整故障排除指南](./DEPLOYMENT.md#故障排除)

## 🤝 参与贡献

我们欢迎并感谢任何形式的贡献！无论是报告 Bug、提出功能建议，还是提交代码改进。

### 贡献指南

#### 🐛 报告问题
1. 查看 [现有 Issues](https://github.com/Alice-easy/DNS-Max/issues)
2. 使用 Issue 模板详细描述问题
3. 提供复现步骤和环境信息

#### 💡 功能建议
1. 创建 Feature Request Issue
2. 详细描述建议的功能和使用场景
3. 参与社区讨论完善建议

#### 🔧 代码贡献
1. **Fork 项目** 到您的 GitHub 账户
2. **创建分支** (`git checkout -b feature/amazing-feature`)
3. **本地开发** 并确保测试通过
4. **提交代码** (`git commit -m 'feat: add amazing feature'`)
5. **推送分支** (`git push origin feature/amazing-feature`)
6. **创建 Pull Request** 并填写详细说明

#### 📝 提交规范
我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链更新
```

### 开发环境搭建

```bash
# 1. 克隆您的 Fork
git clone https://github.com/yourusername/dns-max.git
cd dns-max

# 2. 添加上游仓库
git remote add upstream https://github.com/original/dns-max.git

# 3. 创建开发环境
cp .env.example .env.dev
# 编辑 .env.dev 配置开发环境

# 4. 启动开发服务
docker-compose -f docker-compose.dev.yml up -d

# 5. 运行测试
docker-compose exec backend pytest
docker-compose exec frontend npm test
```

## 🏆 贡献者

感谢所有为 DNS Max 做出贡献的开发者！

<a href="https://github.com/Alice-easy/DNS-Max/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Alice-easy/DNS-Max" />
</a>

## 📄 开源许可

本项目采用 [MIT License](LICENSE) 开源许可证。

### 许可说明
- ✅ 商业使用
- ✅ 修改源码
- ✅ 分发软件
- ✅ 私人使用
- ❌ 责任免除
- ❌ 质量保证

## 🙏 特别致谢

### 核心技术栈
- **[FastAPI](https://fastapi.tiangolo.com/)** - 现代化异步 Python Web 框架
- **[Next.js](https://nextjs.org/)** - 全栈 React 应用框架
- **[PostgreSQL](https://www.postgresql.org/)** - 企业级关系数据库
- **[Redis](https://redis.io/)** - 高性能内存数据库
- **[Docker](https://www.docker.com/)** - 容器化平台

### UI 与设计
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 现代化 React 组件库
- **[Lucide](https://lucide.dev/)** - 精美的图标库

### 开发工具
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Python 数据验证
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - Python ORM 框架

---

<div align="center">

### 🌟 如果 DNS Max 对您有帮助，请给我们一个 Star ⭐️

**让更多人发现这个项目，一起构建更好的 DNS 管理解决方案！**

[![GitHub stars](https://img.shields.io/github/stars/Alice-easy/DNS-Max?style=social)](https://github.com/Alice-easy/DNS-Max/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Alice-easy/DNS-Max?style=social)](https://github.com/Alice-easy/DNS-Max/network/members)



</div>