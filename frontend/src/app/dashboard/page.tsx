'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  Globe,
  Settings,
  AlertCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
// import { apiClient } from '@/lib/api'; // 暂时未使用
import Link from 'next/link';

interface DashboardStats {
  total_providers: number;
  total_domains: number;
  total_records: number;
  recent_activities: Array<{
    id: number;
    type: string;
    description: string;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // 模拟获取统计数据，实际应用中需要从API获取
      const mockStats: DashboardStats = {
        total_providers: 0,
        total_domains: 0,
        total_records: 0,
        recent_activities: [],
      };

      // 这里可以调用实际的API
      // const response = await apiClient.get('/dashboard/stats');
      // setStats(response.data);

      setStats(mockStats);
    } catch (err) {
      setError('获取仪表盘数据失败');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-gray-600">{error}</div>
            <Button onClick={fetchDashboardStats} className="mt-4">
              重试
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* 页面标题 */}
        <div className="px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            仪表盘
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            欢迎回来，{user?.username}！这里是您的DNS分发系统概览。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DNS服务商</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_providers || 0}
              </div>
              <p className="text-xs text-muted-foreground">+0 新增本月</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">管理域名</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_domains || 0}
              </div>
              <p className="text-xs text-muted-foreground">+0 新增本月</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DNS记录</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_records || 0}
              </div>
              <p className="text-xs text-muted-foreground">+0 新增本月</p>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用的操作快捷方式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/providers">
                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 w-full min-h-[80px] sm:min-h-[100px] touch-manipulation"
                >
                  <div className="text-center">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                    <div className="font-medium text-xs sm:text-sm">
                      添加服务商
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      配置DNS服务商
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/domains">
                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 w-full min-h-[80px] sm:min-h-[100px] touch-manipulation"
                >
                  <div className="text-center">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                    <div className="font-medium text-xs sm:text-sm">
                      管理域名
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      添加或管理域名
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/dns-records">
                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 w-full min-h-[80px] sm:min-h-[100px] touch-manipulation"
                >
                  <div className="text-center">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                    <div className="font-medium text-xs sm:text-sm">
                      DNS记录
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      管理DNS记录
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 w-full min-h-[80px] sm:min-h-[100px] touch-manipulation"
                >
                  <div className="text-center">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                    <div className="font-medium text-xs sm:text-sm">
                      个人资料
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      账户设置
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 桌面端布局：最近活动和系统信息并排 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* 最近活动 */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>系统操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recent_activities &&
              stats.recent_activities.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_activities.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">暂无活动记录</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 桌面端系统信息面板 */}
          <Card className="hidden xl:block">
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
              <CardDescription>当前系统运行情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">系统版本</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">在线状态</span>
                <Badge className="bg-green-100 text-green-800">正常</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">上次同步</span>
                <span className="text-sm text-gray-900">刚刚</span>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  系统设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
