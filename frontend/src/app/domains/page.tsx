'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle, Globe, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api, Domain } from '@/lib/api';
import Link from 'next/link';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDomains();
      setDomains(data);
    } catch (err) {
      setError('获取域名列表失败');
      console.error('Fetch domains error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个域名吗？这将同时删除相关的DNS记录。')) {
      return;
    }

    try {
      await api.deleteDomain(id);
      await fetchDomains(); // 重新获取列表
    } catch (err) {
      console.error('Delete domain error:', err);
      alert('删除域名失败');
    }
  };

  const getProviderTypeName = (type: string) => {
    switch (type) {
      case 'aliyun':
        return '阿里云';
      case 'cloudflare':
        return 'Cloudflare';
      case 'tencent':
        return '腾讯云';
      default:
        return type;
    }
  };

  const getProviderTypeColor = (type: string) => {
    switch (type) {
      case 'aliyun':
        return 'bg-orange-100 text-orange-800';
      case 'cloudflare':
        return 'bg-blue-100 text-blue-800';
      case 'tencent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">域名管理</h1>
            <p className="mt-2 text-gray-600">
              管理您的域名和DNS解析
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            添加域名
          </Button>
        </div>

        {/* 错误提示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button variant="link" size="sm" onClick={fetchDomains} className="text-red-800">
                  重试
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 域名列表 */}
        {domains.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无域名</h3>
                <p className="text-gray-500 mb-6">
                  您还没有添加任何域名。请先添加域名，然后就可以管理DNS记录了。
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个域名
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <Card key={domain.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{domain.name}</CardTitle>
                      <CardDescription className="mt-1">
                        服务商: {domain.provider?.name || '未知'}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getProviderTypeColor(domain.provider?.type || 'unknown')}
                    >
                      {getProviderTypeName(domain.provider?.type || 'unknown')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">状态</span>
                      <Badge variant={domain.is_active ? "default" : "secondary"}>
                        {domain.is_active ? '启用' : '禁用'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">创建时间</span>
                      <span className="text-sm text-gray-900">
                        {new Date(domain.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">更新时间</span>
                      <span className="text-sm text-gray-900">
                        {new Date(domain.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Link href={`/dns-records?domain=${domain.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          DNS记录
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(domain.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* 统计信息 */}
        {domains.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总域名数</p>
                    <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">启用域名</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {domains.filter(d => d.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">⏸</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">禁用域名</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {domains.filter(d => !d.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>域名管理说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">添加域名</h4>
                <p className="text-sm text-gray-600">
                  选择已配置的DNS服务商，添加需要管理的域名
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">管理DNS记录</h4>
                <p className="text-sm text-gray-600">
                  点击&ldquo;DNS记录&rdquo;按钮进入记录管理页面，添加、修改或删除DNS记录
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">监控状态</h4>
                <p className="text-sm text-gray-600">
                  实时查看域名状态，及时发现和解决解析问题
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}