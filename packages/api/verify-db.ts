import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { name: true, email: true, role: true }
    });
    console.log(JSON.stringify(users, null, 2));

    const orders = await prisma.order.findMany();
    console.log('Total Orders:', orders.length);
}

main().finally(() => prisma.$disconnect());
