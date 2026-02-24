ARG NODE_VERSION=24.13.1-alpine


FROM node:${NODE_VERSION} AS base

WORKDIR /app

COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force


FROM base AS builder

COPY . .
RUN npm run build


FROM node:${NODE_VERSION} AS runner

ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1

WORKDIR /app

COPY --from=builder /app/.next/standalone ./      
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public              

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]