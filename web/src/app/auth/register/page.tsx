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
            <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
                {/* 渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
                
                {/* 装饰性动画球 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                
                <div className="glass rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-md relative z-10">
                    {/* 成功图标 */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl mb-6 animate-bounce">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        注册成功！
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        🎉 我们已向您的邮箱发送了验证链接<br />
                        请点击链接完成邮箱验证后即可登录
                    </p>
                    <Link 
                        href="/auth/login" 
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <span>立即登录</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50" />
            
            {/* 装饰性动画球 */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-400/20 to-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            
            <div className="w-full max-w-md relative z-10">
                {/* Logo 区域 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        创建新账号
                    </h1>
                    <p className="text-gray-600">加入域名分发系统</p>
                </div>

                <form onSubmit={onSubmit} className="glass rounded-2xl shadow-xl border border-white/20 p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            邮箱地址
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                className="input pl-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            密码
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                className="input pl-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                type="password"
                                placeholder="至少8位字符"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>密码长度至少8位，建议包含字母和数字</span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            确认密码
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <input
                                className="input pl-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                type="password"
                                placeholder="请再次输入密码"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>注册中...</span>
                            </span>
                        ) : (
                            "立即注册"
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white rounded-full text-gray-500">或</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        已有账号？{" "}
                        <Link href="/auth/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                            立即登录 →
                        </Link>
                    </p>
                </form>

                {/* 底部提示 */}
                <div className="mt-8 text-center space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        注册即表示您已阅读并同意我们的<br />
                        <a 
                            href="https://github.com/Alice-easy/DNS-Max/blob/master/docs/TERMS_OF_SERVICE.md" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-dotted underline-offset-2 transition-colors"
                        >
                            服务条款
                        </a>
                        {" "}和{" "}
                        <a 
                            href="https://github.com/Alice-easy/DNS-Max/blob/master/docs/PRIVACY_POLICY.md" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-dotted underline-offset-2 transition-colors"
                        >
                            隐私政策
                        </a>
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 max-w-md mx-auto">
                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>禁止用于违法活动，违规后果由用户自行承担</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
