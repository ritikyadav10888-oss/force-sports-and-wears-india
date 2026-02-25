const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const ticketId = 'ac373c77-8809-4887-be4e-65746e7771ea';
        const tickets = await prisma.supportTicket.findMany({
            include: { messages: true }
        });

        console.log(`Total tickets: ${tickets.length}`);

        const target = tickets.find(t => t.id === ticketId);
        if (target) {
            console.log('--- TARGET TICKET FOUND ---');
            console.log(JSON.stringify(target, null, 2));
        } else {
            console.log('--- TARGET TICKET NOT FOUND ---');
            console.log('Available Ticket IDs:');
            tickets.forEach(t => console.log(`- ${t.id} (${t.status})`));
        }
    } catch (error) {
        console.error('Diagnostic error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
