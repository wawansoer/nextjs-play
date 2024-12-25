# Dockerfile

ARG NODE=node:18-alpine

# Stage 1: Install dependencies
FROM ${NODE} AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
# Stage 2: Build the app
FROM ${NODE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Run the production
FROM ${NODE} AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Serve the app
CMD ["node", "server.js"]
