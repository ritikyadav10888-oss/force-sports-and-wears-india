import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const isSqlite = (prisma as any)._activeProvider === 'sqlite' || process.env.DATABASE_URL?.includes('file:');

    const productsToAdd = [
        {
            name: 'Custom Team T-Shirt',
            description: 'Design your own premium team T-shirt. High-quality print and breathable fabric.',
            price: 1500.00,
            category: 'T-Shirts',
            stock: 500,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop']
        },
        {
            name: 'Custom Athletic Shorts',
            description: 'Personalized athletic shorts for ultimate comfort and mobility. Add your team logo or text.',
            price: 1200.00,
            category: 'Shorts',
            stock: 500,
            images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop']
        }
    ];

    for (const product of productsToAdd) {
        const { images, ...rest } = product;
        const productId = 'custom-' + product.name.replace(/\s+/g, '-').toLowerCase();

        await prisma.product.upsert({
            where: { id: productId },
            update: {
                ...rest,
                images: isSqlite ? JSON.stringify(images) : images as any,
            },
            create: {
                ...rest,
                id: productId,
                images: isSqlite ? JSON.stringify(images) : images as any,
            }
        });
    }

    console.log(`✅ Added ${productsToAdd.length} custom products.`);
}

main()
    .catch((e) => {
        console.error('❌ Failed to add custom products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
