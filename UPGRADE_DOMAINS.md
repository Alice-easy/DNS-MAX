# 域名管理功能升级说明

## 📋 更新内容

本次更新实现了**自动从 DNSPod 获取所有托管域名**的功能，用户无需再手动配置单个根域名。

## 🎯 主要变更

### 1. 后端变更

#### 新增 API 端点

- `GET /api/admin/domains` - 获取数据库中的域名列表
- `POST /api/admin/domains/sync` - 从 DNSPod 同步所有托管域名
- `GET /api/domains/` - 用户端获取可用域名列表（无需认证）

#### 修改的 API

- `POST /api/domains/allocations` - 现在需要传递 `domain_id` 参数选择域名
- `POST /api/admin/allocations/{id}/approve` - 审批时自动使用关联的域名

#### DNSPod 集成

- 新增 `list_domains()` 函数：获取 DNSPod 账号下所有域名
- 修改 `create_record()` 和 `delete_record()` 函数：支持指定域名参数

### 2. 前端变更

#### 管理后台新功能

- 新增「域名管理」标签页
- 「从 DNSPod 同步域名」按钮：一键获取所有托管域名
- 移除了「根域名」配置项（不再需要）
- 系统配置中增加了域名同步提示

#### 用户控制台改进

- 申请分配时可以**选择域名**（下拉列表）
- 实时显示完整域名预览（例如：`alice.example.com`）
- 如果没有可用域名，显示友好提示

### 3. 配置变更

#### 移除的配置项

- `DNS_ROOT_DOMAIN` - 不再需要配置单个根域名

#### 保留的配置项

- `DNSPOD_SECRET_ID` - DNSPod API 凭证
- `DNSPOD_SECRET_KEY` - DNSPod API 密钥
- `DNS_DEFAULT_TTL` - 默认 TTL 值（秒）

## 🚀 使用流程

### 管理员操作

#### 1. 配置 DNSPod 凭证

1. 登录管理后台
2. 进入「系统配置」标签页
3. 填写 `DNSPOD_SECRET_ID` 和 `DNSPOD_SECRET_KEY`
4. 点击「保存配置」

#### 2. 同步域名

1. 进入「域名管理」标签页
2. 点击「从 DNSPod 同步域名」按钮
3. 系统自动获取 DNSPod 账号下所有托管域名
4. 同步成功后显示域名列表

#### 3. 审批用户申请

- 用户申请会关联到选择的域名
- 审批通过后自动在对应域名下创建解析记录

### 用户操作

#### 申请域名分配

1. 登录用户控制台
2. 点击「申请新分发」
3. 从下拉列表中**选择域名**
4. 填写子域名（例如：`alice`）
5. 系统会显示完整域名预览（`alice.example.com`）
6. 选择记录类型（A/CNAME/TXT）
7. 填写指向值和 TTL
8. 提交申请等待管理员审批

## 🔄 升级步骤

### 对于已部署的系统

1. **拉取最新代码**

   ```bash
   git pull origin master
   ```

2. **重启服务**

   ```bash
   docker-compose restart api web
   ```

3. **管理员登录后台**

   - 进入「系统配置」确认 DNSPod 凭证
   - 进入「域名管理」点击「同步域名」

4. **验证功能**
   - 检查域名列表是否正确
   - 测试用户申请流程

### 数据迁移说明

**不需要数据库迁移**：

- `domains` 表已存在（由 `001_initial.py` 创建）
- 同步功能会自动填充域名数据
- 现有的 `allocations` 记录保持不变

### 兼容性说明

- ✅ 现有的分配记录完全兼容
- ✅ 无需修改数据库结构
- ✅ 用户数据不受影响
- ⚠️ 用户界面有变化，需要选择域名

## 📝 技术细节

### DNSPod API 集成

```python
def list_domains(db: Session) -> List[Dict[str, any]]:
    """获取 DNSPod 账号下所有托管域名"""
    client = get_client(db)
    req = models.DescribeDomainListRequest()
    req.Type = "ALL"
    req.Limit = 3000  # 支持最多 3000 个域名

    resp = client.DescribeDomainList(req)
    return [{"id": d.DomainId, "name": d.Name, ...} for d in resp.DomainList]
```

### 域名同步逻辑

1. 调用 DNSPod API 获取所有域名
2. 检查每个域名是否已存在于数据库
3. 仅添加新域名（避免重复）
4. 返回同步统计信息

### 申请流程变更

**之前**：

```json
{
  "subdomain": "alice",
  "type": "A",
  "value": "1.2.3.4",
  "ttl": 600
}
```

**现在**：

```json
{
  "domain_id": 1,
  "subdomain": "alice",
  "type": "A",
  "value": "1.2.3.4",
  "ttl": 600
}
```

## 🐛 故障排查

### 同步失败

**问题**：点击「同步域名」后提示失败

**解决方案**：

1. 检查 DNSPod 凭证是否正确
2. 查看 API 容器日志：`docker-compose logs api`
3. 验证 DNSPod API 访问权限
4. 确认网络连接正常

### 用户无法看到域名选项

**问题**：申请分配时没有可选域名

**解决方案**：

1. 管理员需要先同步域名
2. 检查 `domains` 表是否有数据
3. 验证前端 API 调用：`GET /api/domains/`

### 审批失败

**问题**：管理员审批时提示 DNS 记录创建失败

**解决方案**：

1. 检查域名是否真的托管在 DNSPod
2. 验证 DNSPod API 凭证权限
3. 查看错误详情确认具体原因
4. 确认子域名格式正确

## 📊 性能考虑

- DNSPod API 单次最多返回 3000 个域名
- 域名同步操作较快（通常 < 5 秒）
- 同步操作仅添加新域名，不会删除现有记录
- 建议在 DNSPod 域名变更后手动重新同步

## 🎉 优势

1. **零配置**：无需手动输入域名，自动获取
2. **多域名支持**：用户可选择任意托管域名
3. **灵活性**：支持同一 DNSPod 账号下的所有域名
4. **可维护性**：域名集中管理，统一维护
5. **用户友好**：直观的域名选择界面

## 📚 相关文档

- [快速开始](QUICKSTART.md)
- [配置说明](CONFIGURATION.md)
- [故障排查](TROUBLESHOOTING.md)
- [API 文档](http://localhost:8000/docs)
