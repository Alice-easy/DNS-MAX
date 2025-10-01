"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const r = await fetch("/api/session/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (r.ok) {
                const next = searchParams.get("next") || "/dashboard";
                router.push(next);
            } else {
                const errorText = await r.text();
                setError(errorText || "登录失败");
            }
        } catch (err) {
            setError("网络错误，请重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
            <div className="w-full max-w-sm">
                <form onSubmit={onSubmit} className="card space-y-4">
                    <h1 className="text-2xl font-semibold text-center">登录</h1>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            邮箱
                        </label>
                        <input
                            className="input"
                            type="email"
                            placeholder="请输入邮箱"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            密码
                        </label>
                        <input
                            className="input"
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="btn w-full"
                        disabled={loading}
                    >
                        {loading ? "登录中..." : "登录"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        还没有账号？{" "}
                        <Link href="/auth/register" className="text-blue-600 hover:underline">
                            立即注册
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
                <div className="w-full max-w-sm">
                    <div className="card space-y-4">
                        <h1 className="text-2xl font-semibold text-center">加载中...</h1>
                    </div>
                </div>
            </main>
        }>
            <LoginContent />
        </Suspense>
    );
}
