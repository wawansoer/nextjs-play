# Dockerfile
ARG NODE=node:20-alpine
# Stage 1: Install dependencies
FROM ${NODE} AS deps
RUN apk update \
    && apk add --no-cache openssl libc6-compat\
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev


# Stage 2: Build the app
FROM ${NODE} AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN apk update \
    && apk add --no-cache openssl libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app
COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 3: Run the production
FROM ${NODE} AS runner
RUN apk update \
    && apk add --no-cache openssl libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 300
# Serve the app
CMD ["node", "server.js"]
