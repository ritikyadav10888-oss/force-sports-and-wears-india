# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy workspace configuration
COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/

# Install dependencies (hoisted)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build API using workspace command
RUN npm run build --workspace=force-api
# Generate Prisma client
RUN npx prisma generate --schema=packages/api/prisma/schema.prisma

# --- STAGE 2: Runtime ---
FROM node:20-slim AS runner

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/prisma ./packages/api/prisma
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Start the application using workspace command
CMD ["npm", "start", "--workspace=force-api"]


