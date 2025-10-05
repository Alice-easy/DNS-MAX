# 域名管理功能测试验证

## ✅ 功能验证清单

### 1. 后端 API 验证

#### 域名相关 API

```bash
# 获取域名列表（无需认证）
curl http://localhost:8000/domains/
# 预期：返回 [] 或域名列表

# 同步 DNSPod 域名（需要管理员权限）
curl -X POST http://localhost:8000/admin/domains/sync \
  -H "Authorization: Bearer <管理员Token>"
# 预期：返回同步结果和域名列表

# 获取数据库中的域名
curl http://localhost:8000/admin/domains \
  -H "Authorization: Bearer <管理员Token>"
# 预期：返回域名列表
```

#### 分配相关 API

```bash
# 申请域名分配（需要用户权限，现在需要 domain_id）
curl -X POST http://localhost:8000/domains/allocations \
  -H "Authorization: Bearer <用户Token>" \
  -H "Content-Type: application/json" \
  -d '{
    "domain_id": 1,
    "subdomain": "test",
    "type": "A",
    "value": "1.2.3.4",
    "ttl": 600
  }'

# 获取我的分配列表
curl http://localhost:8000/domains/allocations/mine \
  -H "Authorization: Bearer <用户Token>"
```

### 2. 前端功能验证

#### 管理后台 (http://localhost:3000/admin)

**域名管理标签页**：

- [ ] 显示「域名管理」标签页
- [ ] 显示「从 DNSPod 同步域名」按钮
- [ ] 点击同步按钮后成功获取域名
- [ ] 域名列表正确显示（ID、域名、提供商）
- [ ] 空状态提示正确显示

**系统配置标签页**：

- [ ] 不再显示「根域名」输入框
- [ ] 显示域名同步提示文本
- [ ] DNSPod 配置正常保存

#### 用户控制台 (http://localhost:3000/dashboard)

**申请域名分配**：

- [ ] 点击「申请新分发」显示表单
- [ ] 显示「选择域名」下拉列表
- [ ] 下拉列表包含所有可用域名
- [ ] 输入子域名后显示完整域名预览（如：`alice.example.com`）
- [ ] 成功提交申请
- [ ] 如果没有域名，显示友好提示

### 3. 完整流程测试

#### 管理员配置流程

1. ✅ 登录管理后台
2. ✅ 进入「系统配置」
3. ✅ 配置 DNSPOD_SECRET_ID 和 DNSPOD_SECRET_KEY
4. ✅ 保存配置
5. ✅ 进入「域名管理」
6. ✅ 点击「从 DNSPod 同步域名」
7. ✅ 确认域名列表显示正确

#### 用户申请流程

1. ✅ 用户登录控制台
2. ✅ 点击「申请新分发」
3. ✅ 从下拉列表选择域名
4. ✅ 填写子域名和其他信息
5. ✅ 提交申请
6. ✅ 申请显示在列表中（状态：待审核）

#### 管理员审批流程

1. ✅ 进入「分发申请」标签页
2. ✅ 查看待审核申请
3. ✅ 点击「批准」
4. ✅ 系统自动在 DNSPod 创建记录
5. ✅ 申请状态变更为「已激活」

## 🔍 已验证的 API 路由

```
✅ GET    /domains/                      - 获取可用域名列表
✅ POST   /domains/allocations           - 申请域名分配（需要 domain_id）
✅ GET    /domains/allocations/mine      - 获取我的分配列表
✅ GET    /admin/domains                 - 获取域名列表（管理员）
✅ POST   /admin/domains/sync            - 同步 DNSPod 域名（管理员）
✅ GET    /admin/allocations             - 获取分配申请
✅ POST   /admin/allocations/{id}/approve - 审批分配
```

## 📋 API 路由变更对比

### 之前的路由

```
POST /allocations          -> 申请分配
GET  /allocations/mine     -> 我的分配
```

### 现在的路由

```
GET  /domains/                     -> 获取域名列表（新增）
POST /domains/allocations          -> 申请分配（修改，需要 domain_id）
GET  /domains/allocations/mine     -> 我的分配（路径变更）
GET  /admin/domains                -> 管理域名（新增）
POST /admin/domains/sync           -> 同步域名（新增）
```

## 🧪 测试用例

### 测试用例 1：域名同步

**前置条件**：已配置 DNSPod 凭证
**步骤**：

1. 访问管理后台 - 域名管理
2. 点击「从 DNSPod 同步域名」
   **预期结果**：

- 显示成功提示
- 域名列表更新
- 数据库中有对应记录

### 测试用例 2：用户选择域名申请

**前置条件**：数据库中至少有一个域名
**步骤**：

1. 用户登录控制台
2. 点击「申请新分发」
3. 选择域名：example.com
4. 输入子域名：alice
5. 填写其他信息并提交
   **预期结果**：

- 看到完整域名预览：alice.example.com
- 提交成功
- 申请记录显示正确的 domain_id

### 测试用例 3：管理员审批多域名

**前置条件**：

- 有多个域名
- 有来自不同域名的申请
  **步骤**：

1. 管理员查看待审核申请
2. 审批 alice.domain1.com 的申请
3. 审批 bob.domain2.com 的申请
   **预期结果**：

- 每个申请在对应的域名下创建记录
- 不会混淆域名

## 🎯 关键改进点

1. **自动域名发现**：无需手动配置根域名
2. **多域名支持**：支持 DNSPod 账号下所有域名
3. **用户友好**：直观的域名选择界面
4. **管理便捷**：一键同步所有域名
5. **扩展性强**：轻松添加新域名

## 🚨 注意事项

1. **首次配置**：

   - 必须先配置 DNSPod 凭证
   - 然后同步域名
   - 用户才能看到可选域名

2. **域名更新**：

   - 在 DNSPod 添加新域名后
   - 需要手动点击「同步域名」
   - 系统不会自动同步

3. **已存在的申请**：
   - 旧的申请记录仍然有效
   - domain_id 指向原有域名
   - 不影响现有功能

## 📝 下一步建议

1. **自动同步**：考虑添加定时任务自动同步域名
2. **域名过滤**：允许管理员禁用某些域名
3. **域名权限**：不同用户可用不同域名
4. **使用统计**：显示每个域名的使用情况
5. **批量操作**：支持批量审批同一域名下的申请
