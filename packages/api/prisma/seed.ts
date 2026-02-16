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
            name: 'Pro Dynamic Cricket Bat',
            description: 'Grade 1 English Willow perfectly balanced for explosive power. Designed for professional play.',
            price: 8500.00,
            category: 'Cricket',
            stock: 15,
            images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop']
        },
        {
            name: 'Impact Cricket Helmet',
            description: 'Advanced impact protection technology with titanium grill and airflow system.',
            price: 3200.00,
            category: 'Cricket',
            stock: 25,
            images: ['https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?q=80&w=2070&auto=format&fit=crop'] // Placeholder: Cricket Helmet
        },
        {
            name: 'Leather Match Ball (Red)',
            description: 'Hand-stitched 4-piece leather ball for official matches. Superior seam and swing.',
            price: 1200.00,
            category: 'Cricket',
            stock: 100,
            images: ['https://images.unsplash.com/photo-1589793463308-658b52d96696?q=80&w=2072&auto=format&fit=crop']
        },
        {
            name: 'Match Day Cricket Whites',
            description: 'Comfortable and breathable cricket whites for all-day performance on the field.',
            price: 1599.00,
            category: 'Cricket',
            stock: 50,
            images: ['https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=2070&auto=format&fit=crop']
        },
        {
            name: 'Carbon Pro Badminton Racket',
            description: 'Ultralight carbon fiber frame with high-tension string support for smash power.',
            price: 4500.00,
            category: 'Badminton',
            stock: 30,
            images: ['https://images.unsplash.com/photo-1626224583764-84786c71971e?q=80&w=2000&auto=format&fit=crop']
        },
        {
            name: 'Elite Shuttlecock Tube (12)',
            description: 'Feather shuttlecocks designed for durability and stable flight path.',
            price: 899.00,
            category: 'Badminton',
            stock: 100,
            images: ['https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=2070&auto=format&fit=crop']
        },
        {
            name: 'Marathon Running Shoes',
            description: 'Responsive cushioning and breathable mesh for long-distance comfort.',
            price: 5999.00,
            category: 'Running',
            stock: 40,
            images: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop']
        },
        {
            name: 'Reflective Running Shorts',
            description: 'Safety-focused running shorts with high-visibility strips and zipped pockets.',
            price: 1299.00,
            category: 'Running',
            stock: 60,
            images: ['https://images.unsplash.com/photo-1595861198533-3156299b823e?q=80&w=2000&auto=format&fit=crop']
        },
        {
            name: 'Pro Graphite Pickleball Paddle',
            description: 'Textured surface for spin control and honeycomb core for soft touch.',
            price: 3499.00,
            category: 'Pickleball',
            stock: 20,
            images: ['https://images.unsplash.com/photo-1628109673832-624268e37d57?q=80&w=2000&auto=format&fit=crop']
        },
        {
            name: 'AeroStrike Football',
            description: 'FIFA quality professional match ball with optimized flight technology.',
            price: 1800.00,
            category: 'Football',
            stock: 30,
            images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop']
        },
        {
            name: 'Performance Compression Top',
            description: 'Muscle support and recovery compression wear for intense training sessions.',
            price: 1499.00,
            category: 'Training',
            stock: 80,
            images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop']
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

