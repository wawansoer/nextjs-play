ARG NODE=node:20-slim

# Stage 1: Install dependencies
FROM ${NODE} AS deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl libc6-compat \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the app
FROM ${NODE} AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 3: Run the production
FROM ${NODE} AS runner
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

ARG HOSTNAME="0.0.0.0"
ENV HOSTNAME=${HOSTNAME}

ARG PORT=3000
EXPOSE ${PORT}

# Serve the app
CMD ["node", "server.js"]
