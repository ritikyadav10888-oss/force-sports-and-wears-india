import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ take: 1 });
    const p = products[0];
    console.log('Type of images:', typeof p.images);
    console.log('Value of images:', p.images);

    // Test parsing
    try {
        const parsed = JSON.parse(p.images as any);
        console.log('Parsed images:', parsed);
        console.log('Type of parsed:', Array.isArray(parsed) ? 'array' : typeof parsed);
    } catch (e) {
        console.log('Failed to parse:', e);
    }
}

main().finally(() => prisma.$disconnect());
