import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('🧹 Deleting all products...');
    const result = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${result.count} products.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
