const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    token: string;
}

class AdminAPIClient {
    private getHeaders(): HeadersInit {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'X-API-Secret': API_SECRET || '',
        };
    }

    // Auth
    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();

        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_token', data.token);
        }

        return data;
    }

    async logout(): Promise<void> {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
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

    // Customers
    async getCustomers() {
        const res = await fetch(`${API_URL}/api/customers`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch customers');
        return res.json();
    }

    async getCustomer(id: string) {
        const res = await fetch(`${API_URL}/api/customers/${id}`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch customer');
        return res.json();
    }

    // Orders
    async getOrders() {
        const res = await fetch(`${API_URL}/api/orders`, {
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

    async updateOrderStatus(id: string, status: string) {
        const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
            method: 'PUT',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        if (!res.ok) throw new Error('Failed to update order status');
        return res.json();
    }

    // Products
    async getProducts() {
        const res = await fetch(`${API_URL}/api/products`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    }

    async getProduct(id: string) {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    }

    async createProduct(data: any) {
        const res = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create product');
        return res.json();
    }

    async updateProduct(id: string, data: any) {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
    }

    async deleteProduct(id: string) {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to delete product');
        return res.json();
    }

    // Shipments
    async getShipments() {
        const res = await fetch(`${API_URL}/api/shipments`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch shipments');
        return res.json();
    }

    async getShipment(id: string) {
        const res = await fetch(`${API_URL}/api/shipments/${id}`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch shipment');
        return res.json();
    }

    async createShipment(data: any) {
        const res = await fetch(`${API_URL}/api/shipments`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create shipment');
        return res.json();
    }

    async updateShipmentStatus(id: string, status: string) {
        const res = await fetch(`${API_URL}/api/shipments/${id}/status`, {
            method: 'PUT',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        if (!res.ok) throw new Error('Failed to update shipment status');
        return res.json();
    }

    // Uploads
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData,
            // Browser sets content-type to multipart/form-data automatically
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to upload image');
        }
        return res.json();
    }
}

export const adminAPI = new AdminAPIClient();
