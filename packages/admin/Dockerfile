# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /app

# Build arguments for admin
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy root package.json for workspace definition if needed
COPY package.json package-lock.json ./

# Copy packages/admin package.json
COPY packages/admin/package.json ./packages/admin/

# Install root dependencies (hoisted)
RUN npm install --legacy-peer-deps

# Copy entire source code (simplest for monorepo context)
COPY . .

# Build Admin from root using workspace
# This ensures all hoisting is respected
RUN npm run build --workspace=@force-ecommerce/admin



# --- STAGE 2: Runtime ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

# Copy built admin app
COPY --from=builder /app/packages/admin/.next ./packages/admin/.next
COPY --from=builder /app/packages/admin/package.json ./packages/admin/package.json
COPY --from=builder /app/packages/admin/node_modules ./packages/admin/node_modules

# Also copy root node_modules if needed
COPY --from=builder /app/node_modules ./node_modules

# COPY ROOT PACKAGE JSON (Check workspace definition)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json


# Start application
WORKDIR /app
CMD ["npm", "start", "--workspace=@force-ecommerce/admin"]

