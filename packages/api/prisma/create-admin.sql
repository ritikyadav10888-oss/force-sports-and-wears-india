-- Create Admin User
-- Email: admin@force.com
-- Password: Admin@123

INSERT INTO "User" (id, email, password, role, name, phone, "loginAttempts", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'admin@force.com',
    '$2a$10$eumeq.NzsAmCE75/SnKfIGIK9mYFQBz.fM1GorUT5xKhZ3/n',
    'ADMIN',
    'Admin',
    '+1234567890',
    0,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;
