async function test() {
    try {
        console.log('Attempting login...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@force.com',
                password: 'Admin@123'
            })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-API-Secret': 'force-sports-api-secret-1234567890'
        };

        console.log('Fetching all orders...');
        const ordersRes = await fetch('http://localhost:5000/api/orders', { headers });
        const ordersData = await ordersRes.json();

        if (!ordersRes.ok) {
            console.error('API Error:', ordersData);
            return;
        }

        const orders = ordersData.orders || [];
        console.log(`Found ${orders.length} orders.`);

        const ordersWithoutUser = orders.filter(o => !o.user);
        if (ordersWithoutUser.length > 0) {
            console.log(`WARNING: Found ${ordersWithoutUser.length} orders with no user!`);
            console.log('Sample IDs:', ordersWithoutUser.slice(0, 5).map(o => o.id));
        } else {
            console.log('All orders have user relations.');
        }

    } catch (error) {
        console.error('Test script error:', error.message);
    }
}

test();
