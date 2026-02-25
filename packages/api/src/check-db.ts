import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    const reviewCount = await prisma.review.count();

    console.log('--- Database Stats ---');
    console.log(`Products: ${productCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Reviews: ${reviewCount}`);

    if (productCount > 0) {
        const firstProduct = await prisma.product.findFirst();
        console.log('Sample Product ID:', firstProduct?.id);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
