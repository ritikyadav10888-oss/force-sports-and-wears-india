// Seed 3 T-shirt products via the admin API
// Run: node packages/api/seed-tshirts.js

const API_URL = process.env.API_URL || 'http://localhost:5000';
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

const tshirts = [
    {
        name: "Force Sports Pro Training T-Shirt",
        description: "Premium compression-fit training tee engineered for high-intensity workouts. Features moisture-wicking DryForce™ fabric, flatlock seams to prevent chafing, and a sleek athletic silhouette. Ideal for gym, running, and multi-sport training.",
        price: 999,
        category: "T-Shirts",
        stock: 50,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80"
        ],
        returnPolicy: "RETURNABLE",
        deliveryDays: 5
    },
    {
        name: "Force Sports Squad Jersey",
        description: "Team-ready jersey with sublimation-ready fabric for custom printing. Lightweight, breathable mesh construction with side vents for maximum airflow. Perfect for cricket, football, and all team sports.",
        price: 1299,
        category: "T-Shirts",
        stock: 40,
        sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
        images: [
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
        ],
        returnPolicy: "EXCHANGE_ONLY",
        deliveryDays: 7
    },
    {
        name: "Force Sports Everyday Athletic Tee",
        description: "The ultimate everyday sports tee. 100% premium ring-spun cotton construction with a relaxed athletic fit. Features the iconic Force Sports chest graphic. From the gym to the streets — this tee does it all.",
        price: 699,
        category: "T-Shirts",
        stock: 75,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"
        ],
        returnPolicy: "RETURNABLE",
        deliveryDays: 4
    }
];

async function seedTshirts() {
    console.log('🏋️ Seeding T-shirt products...\n');
    for (const product of tshirts) {
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Secret': API_SECRET,
                },
                body: JSON.stringify(product),
            });

            if (!res.ok) {
                const err = await res.text();
                console.error(`❌ Failed to create "${product.name}":`, err);
            } else {
                const data = await res.json();
                console.log(`✅ Created: "${data.product?.name || product.name}" (ID: ${data.product?.id})`);
            }
        } catch (err) {
            console.error(`❌ Error creating "${product.name}":`, err.message);
        }
    }
    console.log('\nDone! Check the admin panel to see the new products.');
}

seedTshirts();
