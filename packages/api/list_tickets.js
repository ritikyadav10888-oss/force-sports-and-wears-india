const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const tickets = await prisma.supportTicket.findMany({
            select: { id: true, status: true, userId: true },
            take: 20
        });
        console.log('--- SUPPORT TICKETS ---');
        console.table(tickets);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
