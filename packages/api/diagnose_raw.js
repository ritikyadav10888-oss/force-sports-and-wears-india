const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
        console.log('Tables in database:');
        console.log(tables);

        const hasSupportMessage = tables.some(t => t.name === 'SupportMessage');
        console.log('\nHas SupportMessage table:', hasSupportMessage);

        if (hasSupportMessage) {
            const messages = await prisma.$queryRaw`SELECT * FROM SupportMessage LIMIT 5`;
            console.log('Sample messages:', messages);
        }
    } catch (error) {
        console.error('Diagnostic error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
