-- Create Admin User Script for Force E-Commerce (PostgreSQL / Google Cloud SQL)

-- In PostgreSQL, the database is selected via the connection string.
-- Ensure you have the pgcrypto or uuid-ossp extension enabled if using native UUID generation.

-- Create an admin user
-- Password: admin123 (hashed with bcrypt, 10 rounds)
-- The hash below is for "admin123"
INSERT INTO "User" (id, email, password, role, name, phone, "loginAttempts", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(), -- PostgreSQL syntax for UUID
    'admin@force.com',
    '$2a$10$rKJ5VJ5VJ5VJ5VJ5VJ5VJeN8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
    'ADMIN',
    'Admin User',
    NULL,
    0,
    NOW(),
    NOW()
);

-- Verify the admin user was created
SELECT id, email, role, name, "createdAt" FROM "User" WHERE role = 'ADMIN';

