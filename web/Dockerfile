FROM node:20-alpine AS deps
WORKDIR /app
COPY web/package.json web/pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
COPY --from=build /app ./
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
