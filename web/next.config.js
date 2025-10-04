/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // 禁用静态优化以避免环境变量硬编码
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
}

module.exports = nextConfig
