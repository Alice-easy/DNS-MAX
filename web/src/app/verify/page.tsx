"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("缺少验证令牌");
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    async function verifyEmail(token: string) {
        try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/verify?token=${token}`);
            if (r.ok) {
                setStatus("success");
                setMessage("邮箱验证成功！");
                // 3秒后跳转到登录页
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else {
                const errorText = await r.text();
                setStatus("error");
                setMessage(errorText || "验证失败");
            }
        } catch (err) {
            setStatus("error");
            setMessage("网络错误，请重试");
        }
    }

    return (
        <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
            <div className="card text-center">
                {status === "loading" && (
                    <>
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <h1 className="text-xl font-semibold mb-2">验证中...</h1>
                        <p className="text-gray-600">正在验证您的邮箱，请稍候</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-green-600 mb-2">验证成功！</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">页面将在3秒后自动跳转到登录页...</p>
                        <Link href="/auth/login" className="btn mt-4 inline-block">
                            立即登录
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-red-600 mb-2">验证失败</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <div className="space-x-4">
                            <Link href="/auth/register" className="btn-secondary">
                                重新注册
                            </Link>
                            <Link href="/auth/login" className="btn">
                                去登录
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
                <div className="card text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold mb-2">加载中...</h1>
                </div>
            </main>
        }>
            <VerifyContent />
        </Suspense>
    );
}
