FROM node:18-slim AS base

# Install OpenSSL - Add this to fix the Prisma error
RUN apt-get update -y && apt-get install -y openssl ca-certificates

FROM base AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm ci

# Copy the full source
COPY --from=builder /app/out/full/ .

# Manually copy the Prisma schema if it's not included in the pruned output
# Adjust the path based on your project structure
COPY --from=builder /app/packages/db/prisma/schema.prisma ./prisma/schema.prisma

# Now generate the Prisma client
RUN npx prisma generate
RUN npx turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/bash nextjs
USER nextjs

# In the runner stage:
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
# Copy Prisma generated files
COPY --from=installer --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=installer --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

CMD ["node", "apps/web/server.js"]
