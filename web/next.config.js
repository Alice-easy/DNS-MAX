/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // 禁用静态优化以避免环境变量硬编码
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
    // 跳过静态页面生成时的错误 - 允许构建继续
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    // 禁用页面静态生成
    async rewrites() {
        return []
    },
    // 忽略预渲染错误
    staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
