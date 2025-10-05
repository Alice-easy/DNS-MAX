# DNS-Max 前端 UI 组件库

本文档介绍 DNS-Max 系统的现代化 UI 组件库。

## 🎨 组件总览

### 1. Sidebar - 侧边栏导航

**位置**: `/web/src/components/ui/sidebar.tsx`

**功能**:

- 📱 响应式设计，支持移动端折叠
- 👥 根据用户角色动态显示菜单
- 🎯 图标化菜单项
- 🎭 活动状态高亮

**使用示例**:

```tsx
import { Sidebar } from "@/components/ui/sidebar";

<Sidebar role={user.role as "user" | "admin"} />;
```

**适配**:

- 桌面: 固定显示
- 平板/手机: 可折叠显示，带遮罩层

---

### 2. Header - 页头组件

**位置**: `/web/src/components/ui/header.tsx`

**功能**:

- 👤 用户信息显示
- 🚪 退出登录
- 📱 响应式布局

**使用示例**:

```tsx
import { Header } from "@/components/ui/header";

<Header user={user} />;
```

**适配**:

- 桌面: 显示完整用户信息
- 手机: 只显示用户头像

---

### 3. Modal - 模态对话框

**位置**: `/web/src/components/ui/modal.tsx`

**功能**:

- 🪟 弹出式对话框
- 📏 多种尺寸选项 (sm/md/lg/xl)
- 🎭 遮罩层和关闭按钮
- 📱 响应式高度

**使用示例**:

```tsx
import { Modal } from "@/components/ui/modal";

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="标题"
  size="md"
>
  {/* 内容 */}
</Modal>;
```

---

### 4. Table - 数据表格

**位置**: `/web/src/components/ui/table.tsx`

**功能**:

- 📊 通用数据表格
- 🎨 自定义列渲染
- 📄 空状态显示
- 📱 横向滚动支持

**使用示例**:

```tsx
import { Table } from "@/components/ui/table";

const columns = [
  {
    key: "name",
    header: "名称",
    render: (item) => <strong>{item.name}</strong>,
  },
  {
    key: "email",
    header: "邮箱",
  },
];

<Table
  columns={columns}
  data={users}
  keyExtractor={(item) => item.id}
  emptyMessage="暂无数据"
/>;
```

---

### 5. Tabs - 标签页

**位置**: `/web/src/components/ui/tabs.tsx`

**功能**:

- 📑 标签页切换
- 🏷️ 支持图标和徽章
- 📱 横向滚动

**使用示例**:

```tsx
import { Tabs } from "@/components/ui/tabs";

const tabs = [
  { id: "tab1", label: "标签1", icon: <Icon />, badge: 5 },
  { id: "tab2", label: "标签2" },
];

<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />;
```

---

### 6. Alert - 提示信息

**位置**: `/web/src/components/ui/alert.tsx`

**功能**:

- ✅ 成功提示
- ❌ 错误提示
- ⚠️ 警告提示
- ℹ️ 信息提示
- ❎ 可关闭

**使用示例**:

```tsx
import { Alert } from "@/components/ui/alert";

<Alert type="success" message="操作成功！" onClose={() => setMessage(null)} />;
```

---

### 7. Loading - 加载状态

**位置**: `/web/src/components/ui/loading.tsx`

**功能**:

- 🔄 加载动画
- 📏 多种尺寸 (sm/md/lg)
- 📄 全屏/内联模式

**使用示例**:

```tsx
import { Loading, LoadingSpinner } from "@/components/ui/loading";

// 全屏加载
<Loading />

// 内联加载
<LoadingSpinner size="md" />
```

---

## 📐 响应式断点

```css
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏幕 */
```

## 🎨 颜色系统

```css
/* 主色调 */
--primary: #2563eb (blue-600)
--success: #16a34a (green-600)
--warning: #ca8a04 (yellow-600)
--danger: #dc2626 (red-600)

/* 中性色 */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-600: #4b5563
--gray-900: #111827
```

## 📱 移动端适配特性

### 触摸优化

- 按钮最小点击区域: 44x44px
- 增大间距提升可用性
- 优化手势操作

### 性能优化

- 按需加载组件
- 优化动画性能
- 减少重绘和重排

### 交互优化

- 侧边栏滑动展开
- 表格横向滚动
- 模态框自动滚动

## 🌐 浏览器支持

- ✅ Chrome/Edge (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ 移动浏览器 (iOS Safari, Chrome Mobile)

## 🛠️ 开发建议

### 1. 组件复用

尽可能使用已有组件，保持 UI 一致性。

### 2. 响应式优先

使用 Tailwind 的响应式类:

```tsx
className = "text-sm lg:text-base"; // 手机小号，桌面正常
className = "hidden md:block"; // 手机隐藏，平板以上显示
```

### 3. 颜色使用

使用 Tailwind 预设颜色，避免硬编码:

```tsx
// ✅ 推荐
className="bg-blue-600 hover:bg-blue-700"

// ❌ 不推荐
style={{ backgroundColor: "#2563eb" }}
```

### 4. 图标使用

使用内联 SVG 图标，确保响应式缩放:

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

## 📦 未来计划

- [ ] 添加暗色模式支持
- [ ] 国际化支持
- [ ] 更多图表组件
- [ ] 拖拽排序功能
- [ ] 虚拟滚动优化
- [ ] PWA 支持

## 🤝 贡献指南

创建新组件时：

1. 遵循现有组件的代码风格
2. 确保响应式设计
3. 添加 TypeScript 类型定义
4. 提供使用示例
5. 测试多端适配

## 📄 许可

MIT License
