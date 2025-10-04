# DNS-Max 快速启动指南

5 分钟快速部署 DNS-Max 域名分发管理系统！

---

## 🚀 最快部署方式

### 1. 克隆项目

```bash
git clone https://github.com/Alice-easy/DNS-Max.git
cd DNS-Max
```

### 2. 一键启动

```bash
# 复制环境变量
cp env.example .env

# 启动所有服务
docker compose up -d --build
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000

就这么简单！🎉

---

## 📝 首次使用

### 注册账号

1. 点击"注册"按钮
2. 输入邮箱和密码（至少 8 位）
3. **第一个注册的用户自动成为管理员！**

### 验证邮箱（如果没配置邮件服务）

```bash
# 进入数据库
docker compose exec db psql -U domainapp domainapp

# 验证邮箱
UPDATE users SET email_verified_at = NOW() WHERE email = 'your@email.com';

# 退出
\q
```

### 开始使用

1. 登录系统
2. 点击"申请新分发"
3. 填写子域名信息
4. 提交申请

---

## 🔧 配置说明

### 默认配置

默认配置已经可以运行，无需修改：

```bash
# 数据库
POSTGRES_PASSWORD=strongpassword

# JWT密钥
JWT_SECRET=change_me_super_long
JWT_REFRESH_SECRET=change_me_even_longer

# 应用URL
PUBLIC_WEB_URL=http://localhost:3000
PUBLIC_API_URL=http://localhost:8000
```

### 可选配置

如果需要完整功能，可以配置：

#### 邮件服务（用于邮箱验证）

编辑`.env`文件：

```bash
# 使用Resend（推荐）
MAIL_PROVIDER=RESEND
RESEND_API_KEY=re_your_api_key

# 或使用SMTP
MAIL_PROVIDER=SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### DNSPod 配置（用于自动创建 DNS 记录）

```bash
DNSPOD_SECRET_ID=your_secret_id
DNSPOD_SECRET_KEY=your_secret_key
DNS_ROOT_DOMAIN=yourdomain.com
```

---

## 🎯 访问地址

| 服务     | 地址                          | 说明       |
| -------- | ----------------------------- | ---------- |
| 前端     | http://localhost:3000         | Web 界面   |
| API      | http://localhost:8000         | 后端 API   |
| API 文档 | http://localhost:8000/docs    | Swagger UI |
| 健康检查 | http://localhost:8000/healthz | 状态检查   |

---

## 🛠 常用命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 更新代码后重启
git pull
docker compose up -d --build
```

---

## 📊 验证部署

### 检查服务

```bash
# 检查所有服务是否运行
docker compose ps

# 应该看到3个服务都是"Up"状态：
# - dns-max-db-1
# - dns-max-api-1
# - dns-max-web-1
```

### 测试 API

```bash
curl http://localhost:8000/healthz

# 应该返回：
# {"status":"ok"}
```

### 测试前端

打开浏览器访问 http://localhost:3000，应该看到登录页面。

---

## ⚠️ 常见问题

### Q: 端口已被占用？

修改`docker-compose.yml`中的端口：

```yaml
ports:
  - "3001:3000" # 前端改为3001
  - "8001:8000" # API改为8001
```

### Q: 登录后又跳转回登录页？

确保使用最新版本代码，JWT token 验证问题已修复。

```bash
git pull
docker compose up -d --build
```

### Q: 忘记管理员密码？

```bash
# 重置第一个用户的密码为 "newpass123"
docker compose exec db psql -U domainapp domainapp -c \
  "UPDATE users SET password_hash = '\$argon2id\$v=19\$m=65536,t=3,p=4\$...' WHERE id = 1;"
```

### Q: 如何清除所有数据重新开始？

```bash
docker compose down -v
docker compose up -d --build
```

⚠️ 警告：这会删除所有数据！

---

## 🎓 下一步

- 📖 查看[完整文档](README.md)
- 🚀 阅读[部署指南](DEPLOYMENT.md)
- 💡 查看[API 文档](http://localhost:8000/docs)

---

## 🆘 需要帮助？

- 📝 [提交 Issue](https://github.com/Alice-easy/DNS-Max/issues)
- 📧 联系开发者

---

<div align="center">

**享受使用 DNS-Max！** 🎉

Made with ❤️ by DNS-Max Team

</div>
