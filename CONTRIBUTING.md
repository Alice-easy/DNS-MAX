# 贡献指南

欢迎为域名分发系统项目做出贡献！

## 🛠️ 开发环境设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd DNS-Max
```

### 2. 启动开发环境
```bash
# 复制环境变量
cp env.example .env

# 启动开发服务
make dev
# 或
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 3. 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 📝 开发规范

### 代码风格
- **Python**: 遵循 PEP 8 规范，使用 black 格式化
- **TypeScript**: 使用 Prettier 格式化，遵循 ESLint 规则
- **提交信息**: 使用中文，格式为 `类型: 简短描述`

### 提交类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例提交信息
```bash
feat: 添加邮件验证功能
fix: 修复用户注册时的权限问题
docs: 更新API文档
```

## 🔄 开发流程

### 1. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

### 2. 进行开发
- 编写代码
- 添加测试
- 更新文档

### 3. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能描述"
git push origin feature/your-feature-name
```

### 4. 创建Pull Request
提交PR时请包含：
- 功能描述
- 测试结果
- 相关截图（如有UI变更）

## 🧪 测试

### 后端测试
```bash
cd api
python -m pytest
```

### 前端测试
```bash
cd web
npm run test
```

## 📖 项目结构说明

```
DNS-Max/
├── api/                 # FastAPI后端
│   ├── app/
│   │   ├── routers/     # API路由
│   │   ├── models.py    # 数据模型
│   │   ├── schemas.py   # Pydantic模式
│   │   ├── auth.py      # 认证模块
│   │   ├── emailer.py   # 邮件模块
│   │   └── dnspod.py    # DNSPod集成
│   └── requirements.txt
├── web/                 # Next.js前端
│   ├── src/
│   │   ├── app/         # App Router页面
│   │   ├── components/  # React组件
│   │   └── lib/         # 工具函数
│   └── package.json
├── proxy/               # Caddy配置
│   └── Caddyfile
└── docker-compose.yml   # Docker编排
```

## 🐛 问题报告

提交bug时请包含：
- 问题描述
- 复现步骤  
- 预期行为
- 实际行为
- 系统环境
- 相关日志

## 💡 功能建议

欢迎提交新功能建议，请在Issue中详细描述：
- 功能用途
- 使用场景
- 技术实现思路
- 对现有功能的影响

## 📞 联系方式

如有问题，可以通过以下方式联系：
- 提交GitHub Issue
- 发送邮件到项目维护者

感谢您的贡献！
