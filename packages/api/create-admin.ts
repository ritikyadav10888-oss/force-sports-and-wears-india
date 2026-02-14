import bcrypt from 'bcryptjs';
import prisma from './src/config/database';

async function createAdmin() {
    try {
        // Hash the password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@force.com',
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Admin User',
                loginAttempts: 0,
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin123');
        console.log('👤 Role:', admin.role);
        console.log('\nYou can now login to the admin panel at http://localhost:3002');
    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@force.com');
            console.log('🔑 Password: admin123');
        } else {
            console.error('❌ Error creating admin:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
