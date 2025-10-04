"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("两次输入的密码不一致");
            return;
        }

        if (password.length < 8) {
            setError("密码长度至少8位");
            return;
        }

        setLoading(true);

        try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (r.ok) {
                setSuccess(true);
            } else {
                const errorText = await r.text();
                setError(errorText || "注册失败");
            }
        } catch (error) {
            console.error("Register request failed", error);
            setError("网络错误，请重试");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
                <div className="card text-center">
                    <h1 className="text-2xl font-semibold text-green-600 mb-4">注册成功！</h1>
                    <p className="text-gray-600 mb-6">
                        我们已向您的邮箱发送了验证链接，请点击链接完成邮箱验证。
                    </p>
                    <Link href="/auth/login" className="btn">
                        去登录
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
            <div className="w-full max-w-sm">
                <form onSubmit={onSubmit} className="card space-y-4">
                    <h1 className="text-2xl font-semibold text-center">注册</h1>

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
                            placeholder="请输入密码（至少8位）"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            确认密码
                        </label>
                        <input
                            className="input"
                            type="password"
                            placeholder="请再次输入密码"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="btn w-full"
                        disabled={loading}
                    >
                        {loading ? "注册中..." : "注册"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        已有账号？{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            立即登录
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
