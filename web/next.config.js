/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        PUBLIC_API_URL: process.env.PUBLIC_API_URL,
        PUBLIC_WEB_URL: process.env.PUBLIC_WEB_URL,
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
        ACCESS_TOKEN_TTL_MIN: process.env.ACCESS_TOKEN_TTL_MIN,
        REFRESH_TOKEN_TTL_DAYS: process.env.REFRESH_TOKEN_TTL_DAYS,
    }
}

module.exports = nextConfig
