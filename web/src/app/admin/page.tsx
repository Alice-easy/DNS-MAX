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
    user_id: number;
    subdomain: string;
    type: string;
    value: string;
    ttl: number;
    status: string;
    created_at: string;
}

interface SystemConfig {
    MAIL_PROVIDER: string;
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    DNSPOD_SECRET_ID: string;
    DNSPOD_SECRET_KEY: string;
    DNS_DEFAULT_TTL: string;
}

interface Domain {
    id: number;
    name: string;
    provider: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("allocations");
    const router = useRouter();

    const checkAdminAccess = useCallback(async (): Promise<boolean> => {
        try {
            const response = await fetch("/api/session/me", { cache: "no-store" });
            if (!response.ok) {
                router.push("/auth/login");
                return false;
            }
            const user = await response.json();
            if (user.role !== "admin") {
                router.push("/dashboard");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Check admin access failed", error);
            router.push("/auth/login");
            return false;
        }
    }, [router]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/users", { cache: "no-store" });
            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to fetch users:", text);
                return;
            }
            const data: User[] = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }, []);

    const fetchPendingAllocations = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/allocations?status=pending", { cache: "no-store" });
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
    }, []);

    const fetchConfig = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/config", { cache: "no-store" });
            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to fetch config:", text);
                return;
            }
            const data: SystemConfig = await response.json();
            setConfig(data);
        } catch (error) {
            console.error("Failed to fetch config:", error);
        }
    }, []);

    const fetchDomains = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/domains", { cache: "no-store" });
            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to fetch domains:", text);
                return;
            }
            const data: Domain[] = await response.json();
            setDomains(data);
        } catch (error) {
            console.error("Failed to fetch domains:", error);
        }
    }, []);

    const syncDomains = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/domains/sync", {
                method: "POST",
            });
            if (!response.ok) {
                const text = await response.text();
                alert(text || "同步失败");
                return;
            }
            const result = await response.json();
            alert(`同步成功！共 ${result.total} 个域名，新增 ${result.synced} 个`);
            await fetchDomains();
        } catch (error) {
            console.error("Sync domains failed", error);
            alert("网络错误");
        }
    }, [fetchDomains]);

    const updateConfig = useCallback(async (updates: Partial<SystemConfig>) => {
        try {
            const response = await fetch("/api/admin/config", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                const text = await response.text();
                alert(text || "配置更新失败");
                return;
            }
            await fetchConfig();
            alert("配置已更新");
        } catch (error) {
            console.error("Update config failed", error);
            alert("网络错误");
        }
    }, [fetchConfig]);

    const approveAllocation = useCallback(async (id: number) => {
        try {
            const response = await fetch(`/api/admin/allocations/${id}/approve`, {
                method: "POST",
            });
            if (!response.ok) {
                const text = await response.text();
                alert(text || "审批失败");
                return;
            }
            await fetchPendingAllocations();
        } catch (error) {
            console.error("Approve allocation failed", error);
            alert("网络错误");
        }
    }, [fetchPendingAllocations]);

    const updateUserRole = useCallback(async (userId: number, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (!response.ok) {
                const text = await response.text();
                alert(text || "更新失败");
                return;
            }
            await fetchUsers();
        } catch (error) {
            console.error("Update user role failed", error);
            alert("网络错误");
        }
    }, [fetchUsers]);

    useEffect(() => {
        let cancelled = false;
        const bootstrap = async () => {
            setLoading(true);
            const isAdmin = await checkAdminAccess();
            if (!isAdmin || cancelled) {
                setLoading(false);
                return;
            }

            if (activeTab === "users") {
                await fetchUsers();
            } else if (activeTab === "config") {
                await fetchConfig();
            } else if (activeTab === "domains") {
                await fetchDomains();
            } else {
                await fetchPendingAllocations();
            }

            if (!cancelled) {
                setLoading(false);
            }
        };

        void bootstrap();
        return () => {
            cancelled = true;
        };
    }, [activeTab, checkAdminAccess, fetchPendingAllocations, fetchUsers, fetchConfig, fetchDomains]);

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
                                void fetch("/api/session/logout", { method: "POST" });
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
                        onClick={() => setActiveTab("domains")}
                        className={`px-4 py-2 rounded ${activeTab === "domains" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        域名管理
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        用户管理
                    </button>
                    <button
                        onClick={() => setActiveTab("config")}
                        className={`px-4 py-2 rounded ${activeTab === "config" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        系统配置
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
                                                        onClick={() => {
                                                            void approveAllocation(alloc.id);
                                                        }}
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

                {activeTab === "domains" && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">域名管理</h3>
                            <button
                                onClick={() => {
                                    void syncDomains();
                                }}
                                className="btn"
                            >
                                从 DNSPod 同步域名
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            点击「同步域名」按钮从 DNSPod 账号自动获取所有托管域名
                        </p>
                        {domains.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                暂无域名，请先配置 DNSPod 凭证后点击「同步域名」按钮
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">ID</th>
                                            <th className="text-left p-2">域名</th>
                                            <th className="text-left p-2">提供商</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {domains.map(domain => (
                                            <tr key={domain.id} className="border-b">
                                                <td className="p-2">{domain.id}</td>
                                                <td className="p-2 font-mono">{domain.name}</td>
                                                <td className="p-2">{domain.provider}</td>
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
                                                        onChange={e => {
                                                            void updateUserRole(user.id, e.target.value);
                                                        }}
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

                {activeTab === "config" && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">系统配置</h3>
                        {!config ? (
                            <p className="text-gray-500 text-center py-8">加载中...</p>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const updates: Record<string, string> = {};
                                    formData.forEach((value, key) => {
                                        updates[key] = value.toString();
                                    });
                                    void updateConfig(updates);
                                }}
                                className="space-y-6"
                            >
                                <div className="border-b pb-4">
                                    <h4 className="font-semibold mb-3">邮件配置</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">邮件提供商</label>
                                            <select
                                                name="MAIL_PROVIDER"
                                                defaultValue={config.MAIL_PROVIDER}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="SMTP">SMTP</option>
                                                <option value="RESEND">Resend</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">发件人</label>
                                            <input
                                                name="EMAIL_FROM"
                                                type="text"
                                                defaultValue={config.EMAIL_FROM}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="DomainApp <no-reply@yourdomain.com>"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Resend API Key</label>
                                            <input
                                                name="RESEND_API_KEY"
                                                type="password"
                                                defaultValue={config.RESEND_API_KEY}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="留空则使用 SMTP"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">SMTP 主机</label>
                                            <input
                                                name="SMTP_HOST"
                                                type="text"
                                                defaultValue={config.SMTP_HOST}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="smtp.sendgrid.net"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">SMTP 端口</label>
                                            <input
                                                name="SMTP_PORT"
                                                type="text"
                                                defaultValue={config.SMTP_PORT}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="587"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">SMTP 用户名</label>
                                            <input
                                                name="SMTP_USER"
                                                type="text"
                                                defaultValue={config.SMTP_USER}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">SMTP 密码</label>
                                            <input
                                                name="SMTP_PASS"
                                                type="password"
                                                defaultValue={config.SMTP_PASS}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <h4 className="font-semibold mb-3">DNSPod 配置</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Secret ID</label>
                                            <input
                                                name="DNSPOD_SECRET_ID"
                                                type="text"
                                                defaultValue={config.DNSPOD_SECRET_ID}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Secret Key</label>
                                            <input
                                                name="DNSPOD_SECRET_KEY"
                                                type="password"
                                                defaultValue={config.DNSPOD_SECRET_KEY}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">默认 TTL (秒)</label>
                                            <input
                                                name="DNS_DEFAULT_TTL"
                                                type="text"
                                                defaultValue={config.DNS_DEFAULT_TTL}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="600"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        配置 DNSPod 凭证后，在「域名管理」标签页点击「同步域名」按钮自动获取所有托管域名
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="btn">
                                        保存配置
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
