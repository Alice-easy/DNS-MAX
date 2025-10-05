FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# 设置环境变量供Next.js构建时使用
ENV NEXT_PUBLIC_API_URL=http://localhost:8000 \
    PUBLIC_API_URL=http://localhost:8000 \
    PUBLIC_WEB_URL=http://localhost:3000 \
    COOKIE_DOMAIN="" \
    COOKIE_SECURE="false" \
    SKIP_ENV_VALIDATION=1
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000

# Copy public directory if it exists
COPY --from=build /app/public ./public

# Copy the standalone server files
COPY --from=build /app/.next/standalone ./

# Copy the static files
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
