"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
}

interface Allocation {
    id: number;
    user_id: number;
    subdomain: string;
    type: string;
    value: string;
    ttl: number;
    status: string;
    created_at: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("allocations");
    const router = useRouter();

    useEffect(() => {
        checkAdminAccess();
        if (activeTab === "users") fetchUsers();
        if (activeTab === "allocations") fetchPendingAllocations();
    }, [activeTab]);

    async function checkAdminAccess() {
        try {
            const r = await fetch("/api/session/me");
            if (r.ok) {
                const user = await r.json();
                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }
            } else {
                router.push("/auth/login");
            }
        } catch (err) {
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    }

    async function fetchUsers() {
        try {
            const token = await getAccessToken();
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (r.ok) {
                const data = await r.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    }

    async function fetchPendingAllocations() {
        try {
            const token = await getAccessToken();
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/allocations?status=pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (r.ok) {
                const data = await r.json();
                setAllocations(data);
            }
        } catch (err) {
            console.error("Failed to fetch allocations:", err);
        }
    }

    async function getAccessToken() {
        // 由于Cookie是httpOnly，需要通过API获取
        const r = await fetch("/api/session/me");
        if (!r.ok) throw new Error("Unauthorized");
        return ""; // 实际需要从服务端获取token
    }

    async function approveAllocation(id: number) {
        try {
            const token = await getAccessToken();
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/allocations/${id}/approve`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (r.ok) {
                fetchPendingAllocations(); // 刷新列表
            } else {
                alert("审批失败");
            }
        } catch (err) {
            alert("网络错误");
        }
    }

    async function updateUserRole(userId: number, newRole: string) {
        try {
            const token = await getAccessToken();
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: newRole })
            });
            if (r.ok) {
                fetchUsers(); // 刷新列表
            } else {
                alert("更新失败");
            }
        } catch (err) {
            alert("网络错误");
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">管理员后台</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="text-blue-600 hover:underline">
                            返回控制台
                        </Link>
                        <button
                            onClick={() => {
                                fetch("/api/session/logout", { method: "POST" });
                                router.push("/");
                            }}
                            className="text-red-600 hover:underline"
                        >
                            退出登录
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex space-x-1 mb-6">
                    <button
                        onClick={() => setActiveTab("allocations")}
                        className={`px-4 py-2 rounded ${activeTab === "allocations" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        分发申请
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        用户管理
                    </button>
                </div>

                {activeTab === "allocations" && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">待审核的分发申请</h3>
                        {allocations.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">暂无待审核申请</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">用户ID</th>
                                            <th className="text-left p-2">子域名</th>
                                            <th className="text-left p-2">类型</th>
                                            <th className="text-left p-2">指向值</th>
                                            <th className="text-left p-2">TTL</th>
                                            <th className="text-left p-2">申请时间</th>
                                            <th className="text-left p-2">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allocations.map(alloc => (
                                            <tr key={alloc.id} className="border-b">
                                                <td className="p-2">{alloc.user_id}</td>
                                                <td className="p-2">{alloc.subdomain}</td>
                                                <td className="p-2">{alloc.type}</td>
                                                <td className="p-2">{alloc.value}</td>
                                                <td className="p-2">{alloc.ttl}</td>
                                                <td className="p-2">{new Date(alloc.created_at).toLocaleDateString()}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => approveAllocation(alloc.id)}
                                                        className="btn text-xs"
                                                    >
                                                        批准
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">用户管理</h3>
                        {users.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">暂无用户</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">ID</th>
                                            <th className="text-left p-2">邮箱</th>
                                            <th className="text-left p-2">角色</th>
                                            <th className="text-left p-2">状态</th>
                                            <th className="text-left p-2">邮箱验证</th>
                                            <th className="text-left p-2">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="border-b">
                                                <td className="p-2">{user.id}</td>
                                                <td className="p-2">{user.email}</td>
                                                <td className="p-2">
                                                    <select
                                                        value={user.role}
                                                        onChange={e => updateUserRole(user.id, e.target.value)}
                                                        className="text-xs border rounded px-2 py-1"
                                                    >
                                                        <option value="user">普通用户</option>
                                                        <option value="admin">管理员</option>
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}>
                                                        {user.is_active ? "活跃" : "禁用"}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    {user.email_verified_at ? (
                                                        <span className="text-green-600 text-xs">已验证</span>
                                                    ) : (
                                                        <span className="text-red-600 text-xs">未验证</span>
                                                    )}
                                                </td>
                                                <td className="p-2">
                                                    <button className="text-blue-600 hover:underline text-xs">
                                                        编辑
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
