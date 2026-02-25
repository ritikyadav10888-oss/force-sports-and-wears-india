// Direct Prisma seed — bypasses HTTP API
// Run: node packages/api/seed-tshirts-direct.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const tshirts = [
    {
        name: "Force Sports Pro Training T-Shirt",
        description: "Premium compression-fit training tee engineered for high-intensity workouts. Features moisture-wicking DryForce fabric, flatlock seams to prevent chafing, and a sleek athletic silhouette. Ideal for gym, running, and multi-sport training.",
        price: 999,
        category: "T-Shirts",
        stock: 50,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
        images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80"]),
        returnPolicy: "RETURNABLE",
        deliveryDays: 5,
    },
    {
        name: "Force Sports Squad Team Jersey",
        description: "Team-ready jersey with sublimation-ready fabric for custom printing. Lightweight, breathable mesh construction with side vents for maximum airflow. Perfect for cricket, football, and all team sports. Available for bulk orders.",
        price: 1299,
        category: "T-Shirts",
        stock: 40,
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL", "XXXL"]),
        images: JSON.stringify(["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80", "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80"]),
        returnPolicy: "EXCHANGE_ONLY",
        deliveryDays: 7,
    },
    {
        name: "Force Sports Everyday Athletic Tee",
        description: "The ultimate everyday sports tee. 100% premium ring-spun cotton with a relaxed athletic fit. Features the iconic Force Sports chest graphic. From the gym to the streets, this tee does it all.",
        price: 699,
        category: "T-Shirts",
        stock: 75,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
        images: JSON.stringify(["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80", "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"]),
        returnPolicy: "RETURNABLE",
        deliveryDays: 4,
    }
];

async function main() {
    console.log('Seeding 3 T-shirt products...');
    for (const t of tshirts) {
        const product = await prisma.product.create({ data: t });
        console.log(`Created: "${product.name}" — ID: ${product.id}`);
    }
    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
