import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        域名分发系统
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                        基于DNSPod的专业域名解析分发管理平台
                    </p>

                    <div className="flex justify-center space-x-4">
                        <Link href="/auth/login" className="btn">
                            登录
                        </Link>
                        <Link href="/auth/register" className="btn-secondary">
                            注册
                        </Link>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card text-center">
                        <h3 className="text-lg font-semibold mb-4">简单易用</h3>
                        <p className="text-gray-600">直观的界面设计，轻松管理域名解析记录</p>
                    </div>

                    <div className="card text-center">
                        <h3 className="text-lg font-semibold mb-4">安全可靠</h3>
                        <p className="text-gray-600">多重身份验证，确保您的域名安全</p>
                    </div>

                    <div className="card text-center">
                        <h3 className="text-lg font-semibold mb-4">专业服务</h3>
                        <p className="text-gray-600">基于DNSPod，提供稳定的域名解析服务</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
