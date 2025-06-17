FROM node:18-slim AS base

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune docs --docker

FROM base AS installer
WORKDIR /app

# First install dependencies
COPY --from=builder /app/out/json/ .
RUN npm ci

# Copy source files
COPY --from=builder /app/out/full/ .

# Create directory structure for the utils file
RUN mkdir -p ./apps/web/app/lib
# Create a minimal version of utils.ts (using single quotes to avoid issues)
RUN echo '// Placeholder utils file' > ./apps/web/app/lib/utils.ts
# Try to copy the real file if it exists (this will overwrite the placeholder)
COPY --from=builder /app/apps/web/app/lib/utils.ts ./apps/web/app/lib/utils.ts

# Copy Prisma schema to a location Prisma can find by default
COPY --from=builder /app/packages/db/prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma client and build
RUN npx prisma generate
RUN npx turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/bash nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public
# Copy Prisma generated files
COPY --from=installer --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=installer --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

CMD ["node", "apps/docs/server.js"]