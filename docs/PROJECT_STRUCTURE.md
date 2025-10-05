# 项目结构说明

## 📂 完整目录结构

```
DNS-Max/
│
├── 📁 api/                         # FastAPI 后端服务
│   ├── 📁 app/                     # 应用代码
│   │   ├── __init__.py
│   │   ├── main.py                 # 应用入口
│   │   ├── config.py               # 配置管理
│   │   ├── models.py               # SQLAlchemy 数据模型
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── auth.py                 # 认证逻辑（JWT）
│   │   ├── db.py                   # 数据库连接
│   │   ├── deps.py                 # FastAPI 依赖注入
│   │   ├── dnspod.py               # DNSPod API 集成
│   │   ├── emailer.py              # 邮件服务
│   │   │
│   │   ├── 📁 routers/             # API 路由
│   │   │   ├── __init__.py
│   │   │   ├── auth.py             # 认证路由（登录/注册）
│   │   │   ├── users.py            # 用户路由
│   │   │   ├── domains.py          # 域名路由
│   │   │   └── admin.py            # 管理员路由
│   │   │
│   │   └── 📁 migrations/          # Alembic 数据库迁移
│   │       ├── alembic.ini
│   │       ├── env.py
│   │       ├── script.py.mako
│   │       └── versions/           # 迁移版本
│   │           ├── 001_initial.py
│   │           └── 002_add_system_config.py
│   │
│   ├── Dockerfile                  # API 容器配置
│   ├── requirements.txt            # Python 依赖
│   └── start.sh                    # 启动脚本
│
├── 📁 web/                         # Next.js 前端应用
│   ├── 📁 src/
│   │   ├── middleware.ts           # Next.js 中间件
│   │   │
│   │   ├── 📁 app/                 # App Router
│   │   │   ├── layout.tsx          # 根布局
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── globals.css         # 全局样式
│   │   │   │
│   │   │   ├── 📁 auth/            # 认证页面
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx    # 登录页
│   │   │   │   └── register/
│   │   │   │       └── page.tsx    # 注册页
│   │   │   │
│   │   │   ├── 📁 dashboard/       # 用户控制台
│   │   │   │   └── page.tsx        # 用户主页
│   │   │   │
│   │   │   ├── 📁 admin/           # 管理员后台
│   │   │   │   └── page.tsx        # 管理员页面
│   │   │   │
│   │   │   ├── 📁 verify/          # 邮箱验证
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── 📁 api/             # API 路由处理器
│   │   │       ├── _helpers.ts     # 辅助函数
│   │   │       ├── 📁 session/     # 会话管理
│   │   │       │   ├── login/
│   │   │       │   ├── logout/
│   │   │       │   └── me/
│   │   │       ├── 📁 allocations/ # 分配管理
│   │   │       ├── 📁 domains/     # 域名管理
│   │   │       └── 📁 admin/       # 管理员API
│   │   │           ├── allocations/
│   │   │           ├── config/
│   │   │           ├── domains/
│   │   │           └── users/
│   │   │
│   │   ├── 📁 components/          # React 组件
│   │   │   └── 📁 ui/              # UI 组件库
│   │   │       ├── alert.tsx       # 提示组件
│   │   │       ├── button.tsx      # 按钮组件
│   │   │       ├── card.tsx        # 卡片组件
│   │   │       ├── header.tsx      # 顶部栏
│   │   │       ├── input.tsx       # 输入框
│   │   │       ├── loading.tsx     # 加载动画
│   │   │       ├── modal.tsx       # 模态框
│   │   │       ├── sidebar.tsx     # 侧边栏
│   │   │       ├── table.tsx       # 表格组件
│   │   │       └── tabs.tsx        # 标签页
│   │   │
│   │   └── 📁 lib/                 # 工具库
│   │       ├── api.ts              # API 客户端
│   │       ├── auth.ts             # 认证工具
│   │       └── utils.ts            # 通用工具
│   │
│   ├── 📁 public/                  # 静态资源
│   ├── Dockerfile                  # Web 容器配置
│   ├── package.json                # Node.js 依赖
│   ├── tsconfig.json               # TypeScript 配置
│   ├── next.config.js              # Next.js 配置
│   ├── tailwind.config.js          # Tailwind CSS 配置
│   ├── postcss.config.js           # PostCSS 配置
│   └── eslint.config.mjs           # ESLint 配置
│
├── 📁 docs/                        # 📚 项目文档
│   ├── QUICKSTART.md               # 快速开始指南
│   ├── CONFIGURATION.md            # 配置说明
│   ├── DEPLOYMENT.md               # 部署指南
│   ├── API.md                      # API 文档
│   └── TROUBLESHOOTING.md          # 故障排除
│
├── 📁 archive/                     # 📦 归档文件
│   ├── README.md                   # 归档说明
│   ├── ui-optimization/            # UI优化相关
│   ├── old-docs/                   # 旧文档
│   └── dev-pages/                  # 开发页面
│
├── 📄 README.md                    # 项目主文档
├── 📄 LICENSE                      # MIT 许可证
├── 📄 docker-compose.yml           # Docker Compose 配置
├── 📄 env.example                  # 环境变量模板
├── 📄 Makefile                     # Make 命令
├── 📄 .gitignore                   # Git 忽略规则
└── 📄 PROJECT_CLEANUP_REPORT.md    # 精简整理报告
```

## 🎯 核心目录说明

### api/ - 后端服务

**技术栈**: FastAPI + SQLAlchemy + PostgreSQL

**主要功能**:

- RESTful API 接口
- JWT 认证
- 数据库操作
- DNSPod 集成
- 邮件发送

**关键文件**:

- `main.py` - 应用入口，路由注册
- `models.py` - 数据模型定义
- `auth.py` - 认证和授权逻辑
- `routers/` - API 路由处理

### web/ - 前端应用

**技术栈**: Next.js 14 + TypeScript + Tailwind CSS

**主要功能**:

- 用户界面
- 状态管理
- API 调用
- 路由处理

**关键目录**:

- `app/` - Next.js App Router 页面
- `components/ui/` - 可复用 UI 组件
- `lib/` - 工具函数和 API 客户端

### docs/ - 文档

**内容**:

- 部署指南
- 配置说明
- API 文档
- 故障排除

## 📝 文件命名规范

### Python 文件（后端）

- **模块**: 小写字母，下划线分隔，如 `user_service.py`
- **类**: 大驼峰，如 `UserModel`
- **函数**: 小写字母，下划线分隔，如 `get_user_by_id()`
- **常量**: 大写字母，下划线分隔，如 `MAX_RETRY_COUNT`

### TypeScript 文件（前端）

- **组件**: 大驼峰 + `.tsx`，如 `UserProfile.tsx`
- **工具**: 小驼峰 + `.ts`，如 `apiClient.ts`
- **类型**: 大驼峰，如 `interface UserData`
- **常量**: 大写字母，下划线分隔，如 `API_BASE_URL`

### 目录命名

- **小写字母**: 使用短横线分隔，如 `user-profile/`
- **特殊情况**: `components/ui/` 使用斜杠分隔

## 🔧 配置文件说明

### 根目录配置

- `.env` - 环境变量（需创建，不提交）
- `env.example` - 环境变量模板
- `docker-compose.yml` - Docker 编排配置
- `.gitignore` - Git 忽略规则

### 后端配置

- `api/requirements.txt` - Python 依赖
- `api/Dockerfile` - API 容器构建
- `api/app/migrations/alembic.ini` - 数据库迁移配置

### 前端配置

- `web/package.json` - Node.js 依赖和脚本
- `web/tsconfig.json` - TypeScript 编译选项
- `web/next.config.js` - Next.js 配置
- `web/tailwind.config.js` - Tailwind CSS 配置

## 🗄️ 数据库结构

### 主要表

- `users` - 用户表
- `domains` - 域名表
- `allocations` - 域名分配记录表
- `system_config` - 系统配置表

详见: `api/app/models.py`

## 🌐 API 路由结构

### 公开路由

```
POST /auth/register      # 用户注册
POST /auth/login         # 用户登录
GET  /auth/verify        # 邮箱验证
GET  /healthz            # 健康检查
```

### 用户路由（需认证）

```
GET  /users/me           # 获取当前用户
GET  /allocations/mine   # 获取我的分配
POST /allocations        # 创建分配申请
```

### 管理员路由（需管理员权限）

```
GET    /admin/users           # 用户列表
PATCH  /admin/users/{id}      # 更新用户
GET    /admin/allocations     # 所有分配
POST   /admin/allocations/{id}/approve  # 批准
GET    /admin/domains         # 域名列表
POST   /admin/domains         # 添加域名
GET    /admin/config          # 系统配置
PUT    /admin/config          # 更新配置
```

详见: `docs/API.md`

## 🎨 UI 组件说明

### 布局组件

- `Header` - 顶部导航栏
- `Sidebar` - 侧边栏菜单
- `Layout` - 页面布局容器

### 表单组件

- `Input` - 输入框
- `Button` - 按钮
- `Select` - 下拉选择

### 展示组件

- `Card` - 卡片容器
- `Table` - 数据表格
- `Alert` - 提示消息
- `Modal` - 模态对话框
- `Tabs` - 标签页
- `Loading` - 加载动画

位置: `web/src/components/ui/`

## 📊 数据流向

```
用户浏览器
    ↓ HTTP请求
Next.js (web/)
    ↓ API调用
FastAPI (api/)
    ↓ SQL查询
PostgreSQL (db)
    ↓ DNS操作
DNSPod API
```

## 🔐 认证流程

```
1. 用户登录 → POST /auth/login
2. 后端验证 → 生成 JWT
3. 设置 Cookie → access_token, refresh_token
4. 后续请求 → 自动携带 Cookie
5. 后端验证 → 解析 JWT → 获取用户信息
```

## 🚀 部署架构

```
┌─────────────────┐
│   Nginx/Caddy   │  反向代理 + SSL
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│  Web  │ │ API  │  Docker 容器
└───┬───┘ └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │   DB    │  PostgreSQL
    └─────────┘
```

## 📚 扩展阅读

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)

---

返回 [README](../README.md) | 查看 [精简报告](../PROJECT_CLEANUP_REPORT.md)
