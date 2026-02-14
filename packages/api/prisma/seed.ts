import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // 1. Create Admin User
    const adminEmail = 'admin@force.com';
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Force Admin',
            role: 'ADMIN',
            phone: '+91 9999999999'
        }
    });

    console.log('✅ Admin user ready:', admin.email);

    // 2. Create Sample Products
    const products = [
        {
            name: 'Elite Performance Jersey',
            description: 'Professional grade moisture-wicking jersey for high-intensity training.',
            price: 1299.00,
            category: 'Apparel',
            stock: 50,
            images: ['https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=2070&auto=format&fit=crop']
        },
        {
            name: 'Pro Dynamic Cricket Bat',
            description: 'Grade 1 English Willow perfectly balanced for explosive power.',
            price: 8500.00,
            category: 'Equipment',
            stock: 15,
            images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop']
        },
        {
            name: 'AeroStrike Football',
            description: 'FIFA quality professional match ball with optimized flight technology.',
            price: 1800.00,
            category: 'Equipment',
            stock: 30,
            images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop']
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: 'temp-' + product.name.replace(/\s+/g, '-').toLowerCase() }, // Just for upsert uniqueness in seed
            update: product,
            create: {
                ...product,
                id: undefined // Let Prisma generate the UUID
            }
        });
    }

    console.log(`✅ Seeded ${products.length} sample products.`);
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

