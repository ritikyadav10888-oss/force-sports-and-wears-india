const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        phone?: string;
    };
    token: string;
}


interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

class APIClient {
    private getHeaders(): HeadersInit {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    // Auth
    async register(data: RegisterData): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Registration failed');
        }

        const response = await res.json();

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Login failed');
        }

        const response = await res.json();

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async logout(): Promise<void> {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }

    async getMe() {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
    }

    // Products (Public)
    async getProducts() {
        const res = await fetch(`${API_URL}/api/products`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    }

    async getProduct(id: string) {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    }

    // Orders (Customer)
    async createOrder(data: any) {
        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to create order');
        }

        return res.json();
    }

    async getMyOrders() {
        const res = await fetch(`${API_URL}/api/orders/my-orders`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    }

    async getOrder(id: string) {
        const res = await fetch(`${API_URL}/api/orders/${id}`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
    }

    // Payments
    async createPaymentIntent(amount: number, orderId: string) {
        const res = await fetch(`${API_URL}/api/payments/create-intent`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ amount, orderId }),
        });

        if (!res.ok) throw new Error('Failed to create payment intent');
        return res.json();
    }
}

export const api = new APIClient();
