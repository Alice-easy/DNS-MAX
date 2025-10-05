"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Modal } from "@/components/ui/modal";
import { Table } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Loading, LoadingSpinner } from "@/components/ui/loading";

// 这是一个组件展示页面，用于查看和测试所有UI组件
export default function ComponentsShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("alerts");
  const [showAlert, setShowAlert] = useState(true);

  const mockUser = {
    email: "demo@example.com",
    role: "admin",
  };

  const mockTableData = [
    { id: 1, name: "示例1", status: "active", date: "2025-10-01" },
    { id: 2, name: "示例2", status: "pending", date: "2025-10-02" },
    { id: 3, name: "示例3", status: "inactive", date: "2025-10-03" },
  ];

  const tableColumns = [
    {
      key: "name",
      header: "名称",
      render: (item: any) => <strong>{item.name}</strong>,
    },
    {
      key: "status",
      header: "状态",
      render: (item: any) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.status === "active"
              ? "bg-green-100 text-green-800"
              : item.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "date",
      header: "日期",
    },
  ];

  const tabs = [
    { id: "alerts", label: "提示信息", badge: 4 },
    { id: "tables", label: "表格" },
    { id: "modals", label: "模态框" },
    { id: "loading", label: "加载状态" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={mockUser} />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">UI 组件展示</h1>
            <p className="mt-2 text-gray-600">
              这里展示了所有可用的UI组件及其不同状态
            </p>
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-6 space-y-6">
            {activeTab === "alerts" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Alert 组件</h2>
                <div className="space-y-4">
                  <Alert
                    type="success"
                    message="这是一条成功消息！操作已完成。"
                    onClose={showAlert ? () => setShowAlert(false) : undefined}
                  />
                  <Alert
                    type="error"
                    message="这是一条错误消息！请检查您的输入。"
                  />
                  <Alert
                    type="warning"
                    message="这是一条警告消息！请注意相关风险。"
                  />
                  <Alert type="info" message="这是一条信息提示，供您参考。" />
                </div>
              </div>
            )}

            {activeTab === "tables" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Table 组件</h2>
                <div className="card">
                  <h3 className="text-lg font-medium mb-4">数据表格示例</h3>
                  <Table
                    columns={tableColumns}
                    data={mockTableData}
                    keyExtractor={(item) => item.id}
                  />
                </div>

                <div className="card mt-6">
                  <h3 className="text-lg font-medium mb-4">空状态表格</h3>
                  <Table
                    columns={tableColumns}
                    data={[]}
                    keyExtractor={(item) => item.id}
                    emptyMessage="这里还没有数据"
                  />
                </div>
              </div>
            )}

            {activeTab === "modals" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Modal 组件</h2>
                <div className="card">
                  <h3 className="text-lg font-medium mb-4">模态框示例</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn"
                    >
                      打开模态框
                    </button>
                    <p className="text-sm text-gray-600">
                      点击按钮查看模态框效果
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "loading" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Loading 组件</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card text-center">
                    <h3 className="text-lg font-medium mb-4">小尺寸</h3>
                    <LoadingSpinner size="sm" />
                  </div>
                  <div className="card text-center">
                    <h3 className="text-lg font-medium mb-4">中尺寸</h3>
                    <LoadingSpinner size="md" />
                  </div>
                  <div className="card text-center">
                    <h3 className="text-lg font-medium mb-4">大尺寸</h3>
                    <LoadingSpinner size="lg" />
                  </div>
                </div>
              </div>
            )}

            {/* 统计卡片示例 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">统计卡片</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">总用户数</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">活跃域名</p>
                      <p className="text-2xl font-bold text-green-600">56</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">待审核</p>
                      <p className="text-2xl font-bold text-yellow-600">8</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">系统状态</p>
                      <p className="text-2xl font-bold text-blue-600">正常</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 按钮样式示例 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">按钮样式</h2>
              <div className="card">
                <div className="flex flex-wrap gap-3">
                  <button className="btn">主要按钮</button>
                  <button className="btn-secondary">次要按钮</button>
                  <button className="btn" disabled>
                    禁用按钮
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    边框按钮
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md">
                    危险按钮
                  </button>
                </div>
              </div>
            </div>

            {/* 表单元素示例 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">表单元素</h2>
              <div className="card">
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输入框
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入内容"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      下拉选择
                    </label>
                    <select className="input">
                      <option>选项 1</option>
                      <option>选项 2</option>
                      <option>选项 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      文本域
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="请输入多行文本"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="示例模态框"
        size="md"
      >
        <div className="space-y-4">
          <p>这是一个模态框的示例内容。</p>
          <p>您可以在这里放置任何内容，如表单、信息展示等。</p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 btn"
            >
              确认
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
