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
    subdomain: string;
    type: string;
    value: string;
    ttl: number;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subdomain: "",
        type: "A",
        value: "",
        ttl: 600
    });
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
        fetchAllocations();
    }, []);

    async function fetchUserData() {
        try {
            const r = await fetch("/api/session/me");
            if (r.ok) {
                const userData = await r.json();
                setUser(userData);
            } else {
                router.push("/auth/login");
            }
        } catch (err) {
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    }

    async function fetchAllocations() {
        try {
            const token = getCookie("access_token");
            if (!token) return;

            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/allocations/mine`, {
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

    function getCookie(name: string) {
        // 这里需要从服务端获取，因为Cookie是httpOnly
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // 实现提交逻辑
        console.log("Submit allocation:", formData);
    }

    async function logout() {
        await fetch("/api/session/logout", { method: "POST" });
        router.push("/");
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">域名分发系统</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">欢迎，{user?.email}</span>
                        {user?.role === "admin" && (
                            <Link href="/admin" className="btn-secondary">
                                管理后台
                            </Link>
                        )}
                        <button onClick={logout} className="text-red-600 hover:underline">
                            退出登录
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">我的域名分发</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn"
                    >
                        {showForm ? "取消" : "申请新分发"}
                    </button>
                </div>

                {showForm && (
                    <div className="card mb-6">
                        <h3 className="text-lg font-semibold mb-4">申请域名分发</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    子域名
                                </label>
                                <input
                                    className="input"
                                    placeholder="例如：alice"
                                    value={formData.subdomain}
                                    onChange={e => setFormData({ ...formData, subdomain: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    记录类型
                                </label>
                                <select
                                    className="input"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="A">A记录</option>
                                    <option value="CNAME">CNAME记录</option>
                                    <option value="TXT">TXT记录</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    指向值
                                </label>
                                <input
                                    className="input"
                                    placeholder="IP地址或域名"
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    TTL（秒）
                                </label>
                                <input
                                    className="input"
                                    type="number"
                                    min="60"
                                    max="86400"
                                    value={formData.ttl}
                                    onChange={e => setFormData({ ...formData, ttl: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn w-full">
                                提交申请
                            </button>
                        </form>
                    </div>
                )}

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">分发记录</h3>
                    {allocations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">暂无分发记录</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">子域名</th>
                                        <th className="text-left p-2">类型</th>
                                        <th className="text-left p-2">指向值</th>
                                        <th className="text-left p-2">状态</th>
                                        <th className="text-left p-2">创建时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocations.map(alloc => (
                                        <tr key={alloc.id} className="border-b">
                                            <td className="p-2">{alloc.subdomain}</td>
                                            <td className="p-2">{alloc.type}</td>
                                            <td className="p-2">{alloc.value}</td>
                                            <td className="p-2">
                                                <span className={`px-2 py-1 rounded text-xs ${alloc.status === "active" ? "bg-green-100 text-green-800" :
                                                    alloc.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                    }`}>
                                                    {alloc.status === "active" ? "已激活" :
                                                        alloc.status === "pending" ? "待审核" : "已禁用"}
                                                </span>
                                            </td>
                                            <td className="p-2">{new Date(alloc.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
