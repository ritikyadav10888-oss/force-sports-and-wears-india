-- ============================================
-- Force E-Commerce - Complete Database Setup
-- ============================================
-- Run this in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/ezqugfwpuuhavdevzgvo/sql/new

-- 1. Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    name TEXT NOT NULL,
    phone TEXT,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutUntil" TIMESTAMP,
    "lastLoginAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Create RefreshToken table
CREATE TABLE IF NOT EXISTS "RefreshToken" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    token TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX IF NOT EXISTS "RefreshToken_token_idx" ON "RefreshToken"(token);

-- 3. Create AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT,
    action TEXT NOT NULL,
    details TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    total DECIMAL(10,2) NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- 6. Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE
);

-- 7. Create Shipment table
CREATE TABLE IF NOT EXISTS "Shipment" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT UNIQUE NOT NULL,
    "trackingNumber" TEXT,
    carrier TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    "estimatedDelivery" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE
);

-- 8. Create Admin User
-- Email: admin@force.com
-- Password: admin123 (bcrypt hashed)
INSERT INTO "User" (id, email, password, role, name, "loginAttempts", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@force.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    'Admin User',
    0,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify setup
SELECT 
    'Database setup complete!' as status,
    COUNT(*) as admin_users_created
FROM "User" 
WHERE role = 'ADMIN';
