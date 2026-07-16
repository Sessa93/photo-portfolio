# Shared base: bun runtime + installed dependencies + the bootstrap/admin
# scripts. Pushed to ghcr as a standalone image and used directly by the
# docker-compose `setup` service (it runs scripts/*.mjs, which need pg +
# bcryptjs). Also the build base for the webapp image below.
FROM oven/bun:1-alpine AS base

WORKDIR /app

COPY package.json bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --no-save --frozen-lockfile

COPY scripts ./scripts

FROM base AS builder

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

USER bun
EXPOSE 3000

CMD ["bun", "server.js"]
