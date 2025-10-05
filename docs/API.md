# API 文档

## 📚 接口文档

### 在线文档

启动服务后，访问以下地址查看完整 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔐 认证

所有需要认证的接口使用 JWT 令牌，通过 Cookie 传递。

### 令牌获取

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

响应会设置 `access_token` 和 `refresh_token` Cookie。

## 📡 主要接口

### 认证相关

| 方法 | 路径             | 说明     | 认证 |
| ---- | ---------------- | -------- | ---- |
| POST | `/auth/register` | 用户注册 | ❌   |
| POST | `/auth/login`    | 用户登录 | ❌   |
| POST | `/auth/logout`   | 用户登出 | ✅   |
| POST | `/auth/refresh`  | 刷新令牌 | ✅   |
| GET  | `/auth/verify`   | 邮箱验证 | ❌   |

### 用户相关

| 方法 | 路径        | 说明             | 认证 |
| ---- | ----------- | ---------------- | ---- |
| GET  | `/users/me` | 获取当前用户信息 | ✅   |

### 域名分发

| 方法 | 路径                | 说明             | 认证 | 角色 |
| ---- | ------------------- | ---------------- | ---- | ---- |
| POST | `/allocations/`     | 创建分配申请     | ✅   | 用户 |
| GET  | `/allocations/mine` | 获取我的申请列表 | ✅   | 用户 |

### 管理员 - 用户管理

| 方法  | 路径                | 说明         | 认证 | 角色   |
| ----- | ------------------- | ------------ | ---- | ------ |
| GET   | `/admin/users`      | 获取用户列表 | ✅   | 管理员 |
| PATCH | `/admin/users/{id}` | 更新用户     | ✅   | 管理员 |

### 管理员 - 分配管理

| 方法 | 路径                              | 说明         | 认证 | 角色   |
| ---- | --------------------------------- | ------------ | ---- | ------ |
| GET  | `/admin/allocations`              | 获取所有申请 | ✅   | 管理员 |
| POST | `/admin/allocations/{id}/approve` | 批准申请     | ✅   | 管理员 |
| POST | `/admin/allocations/{id}/disable` | 禁用申请     | ✅   | 管理员 |

### 管理员 - 域名管理

| 方法 | 路径                  | 说明             | 认证 | 角色   |
| ---- | --------------------- | ---------------- | ---- | ------ |
| GET  | `/admin/domains`      | 获取域名列表     | ✅   | 管理员 |
| POST | `/admin/domains`      | 添加域名         | ✅   | 管理员 |
| POST | `/admin/domains/sync` | 同步 DNSPod 域名 | ✅   | 管理员 |

### 管理员 - 系统配置

| 方法 | 路径            | 说明         | 认证 | 角色   |
| ---- | --------------- | ------------ | ---- | ------ |
| GET  | `/admin/config` | 获取系统配置 | ✅   | 管理员 |
| PUT  | `/admin/config` | 更新系统配置 | ✅   | 管理员 |

## 📝 请求示例

### 注册用户

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 用户登录

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 创建分配申请

```bash
curl -X POST http://localhost:8000/allocations/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "domain_id": 1,
    "subdomain": "myapp",
    "type": "A",
    "value": "192.168.1.100",
    "ttl": 600
  }'
```

### 获取我的申请

```bash
curl -X GET http://localhost:8000/allocations/mine \
  -b cookies.txt
```

### 管理员批准申请

```bash
curl -X POST http://localhost:8000/admin/allocations/1/approve \
  -b cookies.txt
```

## 🔍 响应格式

### 成功响应

```json
{
  "id": 1,
  "subdomain": "myapp",
  "type": "A",
  "value": "192.168.1.100",
  "ttl": 600,
  "status": "pending",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### 错误响应

```json
{
  "detail": "错误描述信息"
}
```

## 🎯 状态码

| 状态码 | 说明         |
| ------ | ------------ |
| 200    | 成功         |
| 201    | 创建成功     |
| 400    | 请求参数错误 |
| 401    | 未认证       |
| 403    | 权限不足     |
| 404    | 资源不存在   |
| 422    | 验证错误     |
| 500    | 服务器错误   |

## 🔧 数据模型

### User（用户）

```typescript
{
  id: number;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
}
```

### Allocation（分配）

```typescript
{
  id: number;
  user_id: number;
  domain_id: number;
  subdomain: string;
  type: "A" | "AAAA" | "CNAME" | "TXT";
  value: string;
  ttl: number;
  status: "pending" | "active" | "rejected";
  created_at: string;
  updated_at: string;
}
```

### Domain（域名）

```typescript
{
  id: number;
  name: string;
  provider: "dnspod";
  provider_id: string;
  is_active: boolean;
  created_at: string;
}
```

## 🛠️ 开发工具

### 使用 Postman

1. 导入 OpenAPI 规范：http://localhost:8000/openapi.json
2. 配置环境变量：
   - `base_url`: http://localhost:8000
3. 使用 Cookie 认证

### 使用 curl 测试

```bash
# 登录并保存Cookie
curl -c cookies.txt -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 使用Cookie访问受保护接口
curl -b cookies.txt http://localhost:8000/users/me
```

## 📖 更多资源

- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [Swagger UI 使用指南](https://swagger.io/tools/swagger-ui/)
- [OpenAPI 规范](https://spec.openapis.org/oas/latest.html)

---

返回 [README](../README.md)
