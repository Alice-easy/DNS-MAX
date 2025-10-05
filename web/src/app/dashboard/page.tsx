'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <Sidebar role={user?.is_admin ? "admin" : "user"} />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <Header user={user ? { email: user.email, role: user.is_admin ? "admin" : "user" } : { email: "", role: "user" }} />
        
        <main className="p-4 md:p-6 lg:p-8">
          {alert && (
            <div className="mb-6 animate-in slide-in-from-top duration-300">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* 欢迎区域 */}
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    欢迎回来！👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    管理您的域名分配和申请
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">总域名数</p>
                    <p className="text-3xl font-bold text-gray-900">{domains.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">已批准</p>
                    <p className="text-3xl font-bold text-green-600">
                      {domains.filter(d => d.status === 'approved').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">待审批</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {domains.filter(d => d.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
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

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              {activeTab === 'domains' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        我的域名分配
                      </h2>
                      <p className="text-gray-500">管理和查看您的所有域名记录</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
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
                <div className="p-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        申请域名分配
                      </h2>
                      <p className="text-gray-500">填写以下信息申请您的专属域名</p>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          子域名前缀
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="例如: myapp"
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">只能包含字母、数字和连字符</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          记录类型
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer">
                          <option value="A">A记录 - IPv4 地址</option>
                          <option value="CNAME">CNAME记录 - 域名别名</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          记录值
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="IP地址或域名"
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">例如: 192.168.1.1 或 example.com</p>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          提交申请
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        帮助文档
                      </h2>
                      <p className="text-gray-500">了解如何使用域名分发系统</p>
                    </div>

                    <div className="space-y-8">
                      {/* 如何申请域名 */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">1</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">如何申请域名?</h3>
                            <ol className="space-y-3 text-gray-700">
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>点击&quot;申请域名&quot;标签页</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>填写子域名前缀(只能包含字母、数字和连字符)</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>选择记录类型（A记录或CNAME记录）</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>填写对应的记录值</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>提交申请等待管理员审批</span>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      {/* 记录类型说明 */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">2</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">记录类型说明</h3>
                            <div className="space-y-4">
                              <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">A</span>
                                  </div>
                                  <strong className="text-gray-900">A记录</strong>
                                </div>
                                <p className="text-gray-600 ml-11">将域名指向 IPv4 地址，例如：192.168.1.1</p>
                              </div>
                              <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-xs">CN</span>
                                  </div>
                                  <strong className="text-gray-900">CNAME记录</strong>
                                </div>
                                <p className="text-gray-600 ml-11">将域名指向另一个域名，例如：example.com</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 常见问题 */}
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">?</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">常见问题</h3>
                            <div className="space-y-3 text-gray-700">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <strong className="block mb-1">审批需要多长时间？</strong>
                                  <span className="text-gray-600">通常在 1-2 个工作日内完成审批</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <strong className="block mb-1">可以申请多个域名吗？</strong>
                                  <span className="text-gray-600">是的，您可以申请多个子域名</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
