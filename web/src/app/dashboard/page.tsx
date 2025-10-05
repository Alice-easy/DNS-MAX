'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { Tabs } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';

import { Alert } from '@/components/ui/alert';
import { Loading } from '@/components/ui/loading';

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  expired_at?: string;
  record_type: string;
  record_value: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('domains');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchDomains();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/session/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/allocations/mine');
      if (response.ok) {
        const data = await response.json();
        setDomains(data);
      }
    } catch (error) {
      console.error('获取域名失败:', error);
      setAlert({ type: 'error', message: '获取域名数据失败' });
    } finally {
      setLoading(false);
    }
  };
  const tabItems = [
    { id: 'domains', label: '我的域名', count: domains.length },
    { id: 'apply', label: '申请域名' },
    { id: 'help', label: '帮助文档' }
  ];

  const domainColumns = [
    { key: 'domain', header: '域名' },
    { 
      key: 'status', 
      header: '状态', 
      render: (item: Domain) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'approved' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status === 'approved' ? '已批准' : item.status === 'pending' ? '待审批' : '已拒绝'}
        </span>
      )
    },
    { key: 'record_type', header: '记录类型' },
    { key: 'record_value', header: '记录值' },
    { 
      key: 'created_at', 
      header: '申请时间',
      render: (item: Domain) => new Date(item.created_at).toLocaleDateString('zh-CN')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={user?.is_admin ? "admin" : "user"} />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <Header user={user ? { email: user.email, role: user.is_admin ? "admin" : "user" } : { email: "", role: "user" }} />
        
        <main className="p-4 md:p-6 lg:p-8">
          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                仪表板
              </h1>
              <p className="text-gray-600">
                管理您的域名分配和申请
              </p>
            </div>

            <div className="mb-6">
              <Tabs
                tabs={tabItems.map(item => ({ 
                  id: item.id, 
                  label: item.label, 
                  badge: item.count 
                }))}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              {activeTab === 'domains' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      我的域名分配
                    </h2>
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      申请新域名
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-12">
                      <Loading />
                    </div>
                  ) : (
                    <Table
                      data={domains}
                      columns={domainColumns}
                      keyExtractor={(item) => item.id}
                      emptyMessage="暂无域名分配记录"
                    />
                  )}
                </div>
              )}

              {activeTab === 'apply' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    申请域名分配
                  </h2>
                  <div className="max-w-md">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          子域名前缀
                        </label>
                        <input
                          type="text"
                          placeholder="例如: myapp"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          记录类型
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="A">A记录</option>
                          <option value="CNAME">CNAME记录</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          记录值
                        </label>
                        <input
                          type="text"
                          placeholder="IP地址或域名"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        提交申请
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    帮助文档
                  </h2>
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-3">如何申请域名？</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-6">
                      <li>点击&ldquo;申请域名&rdquo;标签页</li>
                      <li>填写子域名前缀（只能包含字母、数字和连字符）</li>
                      <li>选择记录类型（A记录或CNAME记录）</li>
                      <li>填写对应的记录值</li>
                      <li>提交申请等待管理员审批</li>
                    </ol>
                    
                    <h3 className="text-lg font-semibold mb-3">记录类型说明</h3>
                    <div className="space-y-2">
                      <p><strong>A记录</strong>：将域名指向IPv4地址</p>
                      <p><strong>CNAME记录</strong>：将域名指向另一个域名</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
