const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const ticketId = 'ac373c77-8809-4887-be4e-65746e7771ea';
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId }
        });

        console.log('Ticket query result:', ticket);

        if (ticket) {
            console.log('Ticket found! Status:', ticket.status);
            console.log('ClosedAt:', ticket.closedAt);
        } else {
            console.log('Ticket NOT found in database.');
            const allTickets = await prisma.supportTicket.findMany({ take: 5 });
            console.log('Recent tickets in DB:', allTickets.map(t => t.id));
        }
    } catch (error) {
        console.error('Error during diagnostic:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
