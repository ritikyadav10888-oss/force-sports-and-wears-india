# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy API source
COPY packages/api ./packages/api

# Install and build
WORKDIR /app/packages/api
RUN npm install
RUN npx prisma generate
RUN npm run build

# --- STAGE 2: Runtime ---
FROM node:20-slim AS runner

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production dependencies
COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/prisma ./packages/api/prisma
COPY --from=builder /app/packages/api/node_modules ./packages/api/node_modules


# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Ensure we are in the correct directory for the app to find its node_modules
WORKDIR /app/packages/api

# Start the application
CMD ["node", "dist/index.js"]


