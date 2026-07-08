FROM node:22-alpine AS base

# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate prisma client before building
RUN pnpm exec prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

# Instalar dependencias del sistema necesarias para sharp y bash
RUN apk add --no-cache bash libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Copy the entrypoint script
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Instalar sharp nativamente en Alpine para que Next.js pueda optimizar imágenes
# Se hace ANTES de cambiar al usuario sin privilegios
RUN rm -rf node_modules/sharp && \
    mkdir -p /tmp/sharp-install && \
    cd /tmp/sharp-install && \
    npm init -y && \
    npm install --cpu=x64 --os=linux --libc=musl sharp prisma@6.4.1 && \
    cp -a node_modules/. /app/node_modules/ && \
    cd /app && \
    rm -rf /tmp/sharp-install && \
    chown -R nextjs:nodejs /app/node_modules

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
