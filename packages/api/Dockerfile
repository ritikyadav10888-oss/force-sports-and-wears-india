# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy API source
COPY . .

# Install and build
RUN npm install
RUN npx prisma generate
RUN npm run build

# --- STAGE 2: Runtime ---
FROM node:20-slim AS runner

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules


# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]


