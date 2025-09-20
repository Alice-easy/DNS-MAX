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
import { Plus, Edit, Trash2, AlertCircle, Server } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api, Provider } from '@/lib/api';
import { getProviderTypeName, getProviderTypeColor } from '@/lib/provider-utils';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProviders();
      setProviders(data);
    } catch (err) {
      setError('获取服务商列表失败');
      console.error('Fetch providers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个服务商吗？这将同时删除相关的域名和DNS记录。')) {
      return;
    }

    try {
      await api.deleteProvider(id);
      await fetchProviders(); // 重新获取列表
    } catch (err) {
      console.error('Delete provider error:', err);
      alert('删除服务商失败');
    }
  };

  if (loading) {
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
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center px-2 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              DNS服务商管理
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              管理您的DNS服务商配置
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button className="w-full sm:w-auto touch-manipulation">
              <Plus className="h-4 w-4 mr-2" />
              添加服务商
              <kbd className="hidden lg:inline ml-2 px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">
                Ctrl+N
              </kbd>
            </Button>
            <Button
              variant="outline"
              className="hidden lg:inline-flex w-auto touch-manipulation"
            >
              批量导入
            </Button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={fetchProviders}
                  className="text-red-800"
                >
                  重试
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 服务商列表 */}
        {providers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无DNS服务商
                </h3>
                <p className="text-gray-500 mb-6">
                  您还没有配置任何DNS服务商。添加服务商后，您就可以管理域名和DNS记录了。
                </p>
                <Button className="touch-manipulation min-h-[44px]">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个服务商
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {providers.map(provider => (
              <Card
                key={provider.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={getProviderTypeColor(provider.type)}
                    >
                      {getProviderTypeName(provider.type)}
                    </Badge>
                  </div>
                  <CardDescription>
                    创建时间:{' '}
                    {new Date(provider.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">状态</span>
                      <Badge
                        variant={provider.is_active ? 'default' : 'secondary'}
                      >
                        {provider.is_active ? '启用' : '禁用'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">配置状态</span>
                      <Badge variant="outline">
                        {Object.keys(provider.config || {}).length > 0
                          ? '已配置'
                          : '未配置'}
                      </Badge>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 touch-manipulation min-h-[36px]"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">编辑</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(provider.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation min-h-[36px] px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">添加服务商</h4>
                <p className="text-sm text-gray-600">
                  配置您的DNS服务商API密钥，支持阿里云、Cloudflare、腾讯云等主流服务商
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">管理域名</h4>
                <p className="text-sm text-gray-600">
                  为每个服务商添加需要管理的域名
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">管理DNS记录</h4>
                <p className="text-sm text-gray-600">
                  为域名添加、修改、删除DNS记录，支持A、AAAA、CNAME、MX、TXT等记录类型
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
