# 域名自动同步功能 - 快速使用指南

## 🚀 5 分钟快速上手

### 第一步：配置 DNSPod 凭证

1. 访问管理后台：http://localhost:3000/admin
2. 点击「系统配置」标签页
3. 找到「DNSPod 配置」区域
4. 填写以下信息：
   - **Secret ID**：你的 DNSPod API Secret ID
   - **Secret Key**：你的 DNSPod API Secret Key
5. 点击「保存配置」按钮

> 💡 如何获取 DNSPod API 凭证？
>
> 1. 登录 [DNSPod 控制台](https://console.dnspod.cn/)
> 2. 进入「API 密钥」页面
> 3. 创建新的密钥对
> 4. 复制 Secret ID 和 Secret Key

### 第二步：同步域名

1. 在管理后台，点击「域名管理」标签页
2. 点击右上角的「从 DNSPod 同步域名」按钮
3. 等待几秒钟，系统会自动：
   - 连接到 DNSPod API
   - 获取你账号下的所有托管域名
   - 保存到数据库
4. 同步成功后，你会看到：
   - 弹出提示：`同步成功！共 X 个域名，新增 Y 个`
   - 域名列表自动更新

### 第三步：用户申请域名

#### 用户操作：

1. 登录用户控制台：http://localhost:3000/dashboard
2. 点击「申请新分发」按钮
3. 在表单中：
   - **选择域名**：从下拉列表选择一个域名（如：`example.com`）
   - **子域名**：输入你想要的子域名（如：`alice`）
   - 系统会显示完整域名预览：`alice.example.com`
   - **记录类型**：选择 A、CNAME 或 TXT
   - **指向值**：填写 IP 地址或域名
   - **TTL**：设置缓存时间（默认 600 秒）
4. 点击「提交申请」

#### 管理员审批：

1. 返回管理后台
2. 点击「分发申请」标签页
3. 查看待审核的申请
4. 点击「批准」按钮
5. 系统自动在 DNSPod 创建 DNS 记录

## 📸 界面预览

### 管理后台 - 域名管理

```
┌─────────────────────────────────────────┐
│ 域名管理              [从DNSPod同步域名] │
├─────────────────────────────────────────┤
│ ID │ 域名            │ 提供商            │
├────┼─────────────────┼──────────────────┤
│ 1  │ example.com     │ DNSPod           │
│ 2  │ mydomain.net    │ DNSPod           │
│ 3  │ testsite.org    │ DNSPod           │
└─────────────────────────────────────────┘
```

### 用户控制台 - 申请表单

```
┌─────────────────────────────────────────┐
│ 申请域名分发                             │
├─────────────────────────────────────────┤
│ 选择域名：                               │
│ ┌─────────────────────────────────────┐ │
│ │ example.com              ▼          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 子域名：                                 │
│ ┌──────────────┬──────────────────────┐ │
│ │ alice        │ .example.com         │ │
│ └──────────────┴──────────────────────┘ │
│                                         │
│ 记录类型：                               │
│ ┌─────────────────────────────────────┐ │
│ │ A记录                      ▼        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 指向值：                                 │
│ ┌─────────────────────────────────────┐ │
│ │ 192.168.1.100                       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ TTL：                                   │
│ ┌─────────────────────────────────────┐ │
│ │ 600                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│          [ 提交申请 ]                    │
└─────────────────────────────────────────┘
```

## ❓ 常见问题

### Q1: 同步域名后看不到域名列表？

**A**: 检查以下几点：

1. DNSPod 凭证是否正确
2. 查看浏览器控制台是否有错误
3. 查看后端日志：`docker-compose logs api`
4. 确认 DNSPod 账号确实有托管域名

### Q2: 用户看不到可选域名？

**A**: 确保：

1. 管理员已经同步了域名
2. 数据库中有域名记录
3. 刷新页面重新加载

### Q3: 审批时提示 DNS 记录创建失败？

**A**: 可能的原因：

1. DNSPod API 凭证权限不足
2. 域名未在 DNSPod 托管
3. 子域名已存在冲突
4. 网络连接问题

### Q4: 如何添加新域名？

**A**: 两种方式：

1. **在 DNSPod 添加后同步**：
   - 在 DNSPod 控制台添加新域名
   - 回到系统，点击「同步域名」按钮
2. **手动添加**（暂不支持）

### Q5: 域名可以删除吗？

**A**: 当前版本不支持从界面删除域名。如需删除：

```sql
-- 连接到数据库执行
DELETE FROM domains WHERE id = <域名ID>;
```

### Q6: 支持多少个域名？

**A**:

- DNSPod API 单次最多返回 3000 个域名
- 系统理论上支持无限个域名
- 实际建议不超过 100 个（性能考虑）

## 🎯 最佳实践

### 1. 域名命名建议

- 使用易记的域名
- 避免过长的域名
- 统一域名后缀（如都用 .com）

### 2. 定期同步

- 每次在 DNSPod 添加新域名后同步
- 建议每月同步一次确保一致性

### 3. 权限管理

- 仅授权信任的用户为管理员
- 定期审查域名使用情况

### 4. 监控建议

- 定期检查 DNS 记录状态
- 监控 API 调用频率
- 备份域名配置

## 🔧 高级用法

### API 直接调用

#### 获取域名列表

```bash
curl http://localhost:8000/domains/
```

#### 同步域名（需要管理员 Token）

```bash
curl -X POST http://localhost:8000/admin/domains/sync \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### 申请域名分配

```bash
curl -X POST http://localhost:8000/domains/allocations \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domain_id": 1,
    "subdomain": "test",
    "type": "A",
    "value": "1.2.3.4",
    "ttl": 600
  }'
```

### 数据库直接操作

#### 查看所有域名

```sql
SELECT * FROM domains;
```

#### 查看域名使用统计

```sql
SELECT
    d.name,
    COUNT(a.id) as allocation_count
FROM domains d
LEFT JOIN allocations a ON a.domain_id = d.id
GROUP BY d.id, d.name
ORDER BY allocation_count DESC;
```

#### 查找某个域名下的所有分配

```sql
SELECT
    a.*,
    u.email as user_email
FROM allocations a
JOIN users u ON u.id = a.user_id
WHERE a.domain_id = 1;
```

## 📚 相关文档

- [完整实现说明](IMPLEMENTATION_SUMMARY.md)
- [升级指南](UPGRADE_DOMAINS.md)
- [测试文档](TESTING_DOMAINS.md)
- [故障排查](TROUBLESHOOTING.md)
- [API 文档](http://localhost:8000/docs)

## 💡 技术支持

遇到问题？

1. 查看 [故障排查文档](TROUBLESHOOTING.md)
2. 检查服务日志：`docker-compose logs -f`
3. 访问 API 文档：http://localhost:8000/docs
4. 提交 Issue 到 GitHub

---

**享受自动域名管理带来的便利！** 🎉
