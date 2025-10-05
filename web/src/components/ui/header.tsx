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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">域名分发系统</h1>
          </div>

          {/* 用户信息和操作 */}
          <div className="flex items-center space-x-4">
            {/* 用户信息 - 在小屏幕上隐藏邮箱 */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">
                  {user.role === "admin" ? "管理员" : "用户"}
                </p>
              </div>
            </div>

            {/* 移动端用户图标 */}
            <div className="md:hidden">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
            </div>

            {/* 退出按钮 */}
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
