# 故障排除指南

## 🔍 常见问题解决方案

### 部署相关

#### 1. Docker 容器无法启动

**症状**: 运行 `docker-compose up` 后容器立即退出

**解决方案**:

```bash
# 查看容器日志
docker-compose logs

# 查看特定服务日志
docker-compose logs api
docker-compose logs db
docker-compose logs web

# 检查端口占用
netstat -tuln | grep -E '3000|8000|5432'

# 清理并重新启动
docker-compose down -v
docker-compose up -d --build
```

#### 2. 端口已被占用

**症状**: `Error: Port 3000 is already in use`

**解决方案**:

修改 `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "3001:3000" # 修改为其他端口
  api:
    ports:
      - "8001:8000" # 修改为其他端口
```

或者找到并停止占用端口的进程:

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 3. 数据库连接失败

**症状**: API 日志显示 `could not connect to server`

**解决方案**:

```bash
# 检查数据库容器状态
docker-compose ps db

# 检查数据库是否就绪
docker-compose exec db pg_isready -U domainapp

# 等待数据库启动（初次启动可能需要几秒）
sleep 10
docker-compose restart api

# 检查 .env 文件中的数据库配置
grep POSTGRES .env
```

---

### 认证相关

#### 4. 登录后立即跳转回登录页

**症状**: 登录成功但无法保持登录状态

**原因**: Cookie 设置问题或 JWT 配置错误

**解决方案**:

```bash
# 1. 确保使用最新代码
git pull
docker-compose up -d --build

# 2. 检查 JWT 配置
grep JWT .env

# 3. 清除浏览器 Cookie
# 在浏览器中: 开发者工具 → Application → Cookies → 删除所有

# 4. 检查 COOKIE_DOMAIN 设置
# 本地开发应该留空或设为 localhost
```

#### 5. Token 验证失败

**症状**: API 返回 `Token verification failed`

**解决方案**:

```bash
# 确保 JWT_SECRET 和 JWT_REFRESH_SECRET 已配置
grep -E 'JWT_SECRET|JWT_REFRESH_SECRET' .env

# 如果密钥已更改，需要重新登录
# 密钥至少 32 个字符

# 生成新的密钥
openssl rand -base64 32
```

#### 6. 邮箱未验证无法登录

**症状**: `Email not verified`

**解决方案**:

手动验证邮箱:

```bash
docker-compose exec db psql -U domainapp domainapp

# 在 psql 中执行
UPDATE users SET email_verified_at = NOW() WHERE email = 'user@example.com';
\q
```

---

### 邮件相关

#### 7. 邮件发送失败

**症状**: 注册后未收到验证邮件

**排查步骤**:

1. **检查配置**:

   ```bash
   # 登录管理员后台 → 系统配置 → 检查邮件配置
   ```

2. **查看日志**:

   ```bash
   docker-compose logs api | grep -i mail
   ```

3. **测试 SMTP 连接**:
   ```bash
   # 使用 telnet 测试 SMTP 服务器
   telnet smtp.gmail.com 587
   ```

**常见问题**:

- **Gmail**: 需要开启"应用专用密码"
- **Resend**: 检查 API Key 是否正确
- **SMTP**: 确认用户名、密码、主机和端口

**临时方案**:

如果邮件服务暂时无法配置，可以手动验证用户（见问题 6）

#### 8. 使用 Gmail SMTP 失败

**症状**: `Authentication failed` 或 `Username and Password not accepted`

**解决方案**:

1. 开启两步验证
2. 生成应用专用密码: https://myaccount.google.com/apppasswords
3. 使用应用专用密码而不是账号密码

在管理员后台配置:

```
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USER: your-email@gmail.com
SMTP_PASS: [应用专用密码，16位，无空格]
```

---

### DNS 相关

#### 9. DNS 记录创建失败

**症状**: 审批通过但 DNS 记录未创建

**解决方案**:

1. **检查 DNSPod 配置**:

   ```bash
   # 登录管理员后台 → 系统配置 → DNSPod 配置
   ```

2. **验证 API 密钥权限**:

   - 登录腾讯云 DNSPod 控制台
   - 确认 API 密钥有 DNS 管理权限
   - 确认域名已托管在 DNSPod

3. **查看详细错误**:
   ```bash
   docker-compose logs api | grep -i dnspod
   ```

**常见错误**:

- `Domain not found`: 域名未在 DNSPod 托管
- `Permission denied`: API 密钥权限不足
- `Invalid credentials`: Secret ID/Key 错误

#### 10. DNS 记录不生效

**症状**: DNS 记录已创建但无法解析

**排查**:

```bash
# 检查 DNS 记录
nslookup subdomain.yourdomain.com

# 或使用 dig
dig subdomain.yourdomain.com

# 检查 DNSPod 控制台
# 登录 DNSPod → 查看记录列表
```

**可能原因**:

- DNS 缓存未更新（TTL 时间未到）
- 本地 DNS 缓存：`ipconfig /flushdns` (Windows) 或 `sudo killall -HUP mDNSResponder` (Mac)

---

### 前端相关

#### 11. 前端页面空白

**症状**: 访问前端只看到空白页面

**解决方案**:

```bash
# 查看 web 容器日志
docker-compose logs web

# 重新构建前端
docker-compose up -d --build web

# 检查浏览器控制台错误
# F12 → Console 查看错误信息
```

#### 12. API 请求失败 (CORS 错误)

**症状**: 浏览器控制台显示 CORS 错误

**解决方案**:

检查环境变量:

```bash
# 确保这两个 URL 配置正确
PUBLIC_WEB_URL=http://localhost:3000
PUBLIC_API_URL=http://localhost:8000
```

如果使用域名:

```bash
PUBLIC_WEB_URL=https://yourdomain.com
PUBLIC_API_URL=https://api.yourdomain.com
COOKIE_SECURE=true
```

---

### 数据库相关

#### 13. 数据库迁移失败

**症状**: `alembic upgrade head` 报错

**解决方案**:

```bash
# 查看当前迁移状态
docker-compose exec api alembic current

# 查看迁移历史
docker-compose exec api alembic history

# 回滚到上一个版本
docker-compose exec api alembic downgrade -1

# 重新应用迁移
docker-compose exec api alembic upgrade head

# 如果仍然失败，检查数据库连接
docker-compose exec db psql -U domainapp -d domainapp -c "\dt"
```

#### 14. 数据丢失或损坏

**症状**: 用户数据不见了或数据库错误

**解决方案**:

```bash
# 恢复备份
docker-compose exec -T db psql -U domainapp domainapp < backup.sql

# 如果没有备份，检查数据卷
docker volume ls
docker volume inspect dns-max_postgres-data
```

**预防措施**:

定期备份数据库:

```bash
# 添加到 crontab
0 2 * * * cd /path/to/DNS-Max && docker-compose exec -T db pg_dump -U domainapp domainapp > backup_$(date +\%Y\%m\%d).sql
```

---

### 性能相关

#### 15. 响应缓慢

**症状**: 页面加载或 API 响应很慢

**排查**:

```bash
# 检查容器资源使用
docker stats

# 查看数据库连接
docker-compose exec db psql -U domainapp domainapp -c "SELECT count(*) FROM pg_stat_activity;"

# 查看慢查询
docker-compose exec db psql -U domainapp domainapp -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

**优化建议**:

- 增加 Docker 资源限制
- 添加数据库索引
- 启用 Redis 缓存（未来版本）

---

## 🛠 调试技巧

### 查看完整日志

```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db

# 查看最近 100 行
docker-compose logs --tail=100 api

# 包含时间戳
docker-compose logs -t api
```

### 进入容器调试

```bash
# 进入 API 容器
docker-compose exec api bash

# 进入数据库容器
docker-compose exec db psql -U domainapp domainapp

# 进入 Web 容器
docker-compose exec web sh
```

### 检查环境变量

```bash
# 在容器中检查环境变量
docker-compose exec api env | grep -E 'JWT|POSTGRES|MAIL'
```

### 网络调试

```bash
# 从 API 容器测试数据库连接
docker-compose exec api ping db

# 测试 API 是否可访问
curl http://localhost:8000/healthz

# 测试前端是否可访问
curl http://localhost:3000
```

---

## 📞 获取帮助

如果以上方法都无法解决问题:

1. **查看详细日志**: `docker-compose logs > logs.txt`
2. **收集环境信息**:
   ```bash
   docker --version
   docker-compose --version
   cat .env | grep -v PASSWORD | grep -v SECRET
   ```
3. **提交 Issue**: https://github.com/Alice-easy/DNS-Max/issues
   - 附上日志文件
   - 描述复现步骤
   - 说明环境信息

---

## 🔄 重置指南

### 完全重置（删除所有数据）

```bash
# ⚠️ 警告：这会删除所有数据！
docker-compose down -v
docker system prune -a --volumes
rm -rf .env

# 重新开始
cp env.example .env
# 编辑 .env
docker-compose up -d --build
```

### 只重置数据库

```bash
docker-compose down
docker volume rm dns-max_postgres-data
docker-compose up -d
```

### 只重置应用（保留数据）

```bash
docker-compose down
docker-compose up -d --build
```

---

## 💡 最佳实践

1. **定期备份**: 设置自动备份脚本
2. **监控日志**: 定期检查错误日志
3. **更新系统**: 及时更新到最新版本
4. **安全配置**: 使用强密码和 HTTPS
5. **资源监控**: 监控服务器资源使用

---

<div align="center">

**需要更多帮助？**

[提交 Issue](https://github.com/Alice-easy/DNS-Max/issues) • [查看文档](README.md) • [加入讨论](https://github.com/Alice-easy/DNS-Max/discussions)

</div>
