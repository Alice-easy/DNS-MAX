'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: '', // 由于API类型中没有email字段，暂时设为空字符串
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: '', // 由于API类型中没有email字段，暂时设为空字符串
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // 这里应该调用更新用户信息的API
      // const updatedUser = await api.updateUser(formData);
      // updateUser(updatedUser);

      // 暂时模拟更新，因为没有对应的API
      const updatedUser: User = {
        ...user!,
        username: formData.username,
        // 注意：email字段不在User类型中，暂时忽略
      };
      updateUser(updatedUser);

      setIsEditing(false);
    } catch (err) {
      setError('更新用户信息失败');
      console.error('Update user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: '', // 由于API类型中没有email字段，暂时设为空字符串
    });
    setIsEditing(false);
    setError(null);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
          <p className="mt-2 text-gray-600">管理您的账户信息和设置</p>
        </div>

        {/* 基本信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>您的账户基本信息</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    取消
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像和基本信息 */}
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-gray-500" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        用户名
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={e =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入用户名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500">用户名</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">未设置</p>
                        <p className="text-sm text-gray-500">邮箱地址</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 账户状态 */}
        <Card>
          <CardHeader>
            <CardTitle>账户状态</CardTitle>
            <CardDescription>您的账户当前状态信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">账户类型</p>
                  <p className="text-sm text-gray-500">当前用户权限级别</p>
                </div>
              </div>
              <Badge variant={user.is_admin ? "default" : "secondary"}>
                {user.is_admin ? "管理员" : "普通用户"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">账户状态</p>
                  <p className="text-sm text-gray-500">当前账户状态</p>
                </div>
              </div>
              <Badge variant="default">正常</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">注册时间</p>
                  <p className="text-sm text-gray-500">账户创建日期</p>
                </div>
              </div>
              <span className="text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">最后登录</p>
                  <p className="text-sm text-gray-500">最后登录时间</p>
                </div>
              </div>
              <span className="text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 安全设置 */}
        <Card>
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
            <CardDescription>管理您的账户安全选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">修改密码</p>
                <p className="text-sm text-gray-500">
                  定期更改密码以保护账户安全
                </p>
              </div>
              <Button variant="outline">修改密码</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">双因素认证</p>
                <p className="text-sm text-gray-500">
                  启用双因素认证增强账户安全
                </p>
              </div>
              <Badge variant="secondary">未启用</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">登录记录</p>
                <p className="text-sm text-gray-500">查看最近的登录活动</p>
              </div>
              <Button variant="outline">查看记录</Button>
            </div>
          </CardContent>
        </Card>

        {/* 系统偏好 */}
        <Card>
          <CardHeader>
            <CardTitle>系统偏好</CardTitle>
            <CardDescription>个性化您的使用体验</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">主题设置</p>
                <p className="text-sm text-gray-500">选择您喜欢的界面主题</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="light">浅色模式</option>
                <option value="dark">深色模式</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">语言设置</p>
                <p className="text-sm text-gray-500">选择界面显示语言</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">邮件通知</p>
                <p className="text-sm text-gray-500">接收系统重要通知</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
