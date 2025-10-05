'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { Tabs } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Alert } from '@/components/ui/alert';
import { useState } from 'react';

export default function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlert, setShowAlert] = useState(true);

  const sampleData = [
    { id: '1', name: 'test1.example.com', status: 'approved', type: 'A', value: '192.168.1.1', created: '2024-01-01' },
    { id: '2', name: 'test2.example.com', status: 'pending', type: 'CNAME', value: 'example.com', created: '2024-01-02' },
  ];

  const columns = [
    { key: 'name', header: '域名' },
    { key: 'status', header: '状态' },
    { key: 'type', header: '类型' },
    { key: 'value', header: '值' },
    { key: 'created', header: '创建时间' },
  ];

  const tabs = [
    { id: 'overview', label: '概览', badge: 5 },
    { id: 'domains', label: '域名管理' },
    { id: 'settings', label: '设置' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role="user" />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <Header user={{ email: "test@example.com", role: "user" }} />
        
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">UI 组件展示</h1>
              <p className="text-gray-600">DNS-Max 前端UI组件库展示页面</p>
            </div>

            {showAlert && (
              <Alert
                type="success"
                message="UI组件已成功创建并优化！支持多端适配和响应式设计。"
                onClose={() => setShowAlert(false)}
              />
            )}

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">标签页组件</h2>
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">数据表格组件</h2>
                <div className="bg-white rounded-lg shadow">
                  <Table
                    data={sampleData}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    emptyMessage="暂无数据"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">模态框组件</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  显示模态框
                </button>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">加载状态</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-32 flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特性</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">📱 多端适配</h3>
                    <p className="text-gray-600 text-sm">响应式设计，支持移动端、平板和桌面端</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">🎨 现代UI</h3>
                    <p className="text-gray-600 text-sm">基于Tailwind CSS的现代化界面设计</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">🔧 组件化</h3>
                    <p className="text-gray-600 text-sm">模块化组件设计，易于维护和扩展</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="组件展示模态框"
        size="md"
      >
        <div className="p-6">
          <p>这是一个模态框示例，展示了我们创建的Modal组件功能。</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}