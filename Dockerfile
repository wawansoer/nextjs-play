ARG NODE=node:20-alpine
# Stage 1: Install dependencies
FROM ${NODE} AS deps
RUN apk update \
    && apk add --no-cache openssl libc6-compat\
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the app
FROM ${NODE} AS builder
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

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
    && apk add --no-cache openssl libc6-compat bash\
    && rm -rf /var/cache/apk/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create scheduler directory and log file
RUN mkdir -p /app/scheduler /app/logs
RUN touch /app/logs/scheduler.log
RUN chown -R nextjs:nodejs /app/logs

# Copy scheduler
COPY --from=builder --chown=nextjs:nodejs /app/cron ./cron
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh

# copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
ARG HOSTNAME="0.0.0.0"
ENV HOSTNAME=${HOSTNAME}
ARG PORT=3000
EXPOSE ${PORT}

# Use the startup script
CMD ["/app/start.sh"]
