"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  user: {
    email: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/session/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 backdrop-blur-lg bg-opacity-95">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              域名分发系统
            </h1>
          </div>

          {/* 用户信息和操作 */}
          <div className="flex items-center space-x-4">
            {/* 用户信息 - 在小屏幕上隐藏邮箱 */}
            <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user.email ? user.email[0].toUpperCase() : '?'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{user.email}</p>
                <p className="text-xs">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role === "admin" ? "👑 管理员" : "👤 用户"}
                  </span>
                </p>
              </div>
            </div>

            {/* 移动端用户图标 */}
            <div className="md:hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user.email ? user.email[0].toUpperCase() : '?'}
                </span>
              </div>
            </div>

            {/* 退出按钮 */}
            <button
              onClick={logout}
              className="group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-600 shadow-sm hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
