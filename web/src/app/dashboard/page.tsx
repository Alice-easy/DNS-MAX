"use client";
import { useState, useEffect, useCallback } from "react";
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
    domain_id: number;
    subdomain: string;
    type: string;
    value: string;
    ttl: number;
    status: string;
    created_at: string;
}

interface Domain {
    id: number;
    name: string;
    provider: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        domain_id: 0,
        subdomain: "",
        type: "A",
        value: "",
        ttl: 600,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const router = useRouter();

    const fetchUserData = useCallback(async (): Promise<User | null> => {
        try {
            const response = await fetch("/api/session/me", { cache: "no-store" });
            if (!response.ok) {
                router.push("/auth/login");
                return null;
            }
            const userData: User = await response.json();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            router.push("/auth/login");
            return null;
        }
    }, [router]);

    const fetchAllocations = useCallback(async () => {
        try {
            const response = await fetch("/api/allocations/mine", { cache: "no-store" });
            if (response.status === 401) {
                router.push("/auth/login");
                return;
            }
            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to fetch allocations:", text);
                return;
            }
            const data: Allocation[] = await response.json();
            setAllocations(data);
        } catch (error) {
            console.error("Failed to fetch allocations:", error);
        }
    }, [router]);

    const fetchDomains = useCallback(async () => {
        try {
            const response = await fetch("/api/domains", { cache: "no-store" });
            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to fetch domains:", text);
                return;
            }
            const data: Domain[] = await response.json();
            setDomains(data);
            // 设置默认选中第一个域名
            if (data.length > 0 && formData.domain_id === 0) {
                setFormData(prev => ({ ...prev, domain_id: data[0].id }));
            }
        } catch (error) {
            console.error("Failed to fetch domains:", error);
        }
    }, [formData.domain_id]);

    useEffect(() => {
        let cancelled = false;
        const bootstrap = async () => {
            setLoading(true);
            const currentUser = await fetchUserData();
            if (!currentUser || cancelled) {
                setLoading(false);
                return;
            }

            await Promise.all([fetchAllocations(), fetchDomains()]);

            if (!cancelled) {
                setLoading(false);
            }
        };

        void bootstrap();
        return () => {
            cancelled = true;
        };
    }, [fetchAllocations, fetchUserData, fetchDomains]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSubmitting(true);

        try {
            const response = await fetch("/api/allocations", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const text = await response.text();
                setFormError(text || "提交失败");
                return;
            }

            setShowForm(false);
            setFormData({ domain_id: domains[0]?.id || 0, subdomain: "", type: "A", value: "", ttl: 600 });
            await fetchAllocations();
        } catch (error) {
            console.error("Submit allocation failed", error);
            setFormError("网络错误，请重试");
        } finally {
            setFormSubmitting(false);
        }
    }, [fetchAllocations, formData]);

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
                        {domains.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                暂无可用域名，请联系管理员配置域名
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        选择域名
                                    </label>
                                    <select
                                        className="input"
                                        value={formData.domain_id}
                                        onChange={e => setFormData({ ...formData, domain_id: parseInt(e.target.value) })}
                                        required
                                    >
                                        {domains.map(domain => (
                                            <option key={domain.id} value={domain.id}>
                                                {domain.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        子域名
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            className="input flex-1"
                                            placeholder="例如：alice"
                                            value={formData.subdomain}
                                            onChange={e => setFormData({ ...formData, subdomain: e.target.value })}
                                            required
                                        />
                                        <span className="ml-2 text-gray-600">
                                            .{domains.find(d => d.id === formData.domain_id)?.name}
                                        </span>
                                    </div>
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

                                {formError && <p className="text-sm text-red-600">{formError}</p>}

                                <button type="submit" className="btn w-full" disabled={formSubmitting}>
                                    {formSubmitting ? "提交中..." : "提交申请"}
                                </button>
                            </form>
                        )}
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
