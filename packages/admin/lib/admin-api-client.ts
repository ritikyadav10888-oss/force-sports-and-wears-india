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

    private async request(url: string, options: RequestInit = {}) {
        const res = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
            credentials: 'include',
        });

        if (res.status === 401 || res.status === 403) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
                window.location.href = '/login';
            }
            throw new Error('Authentication failed');
        }

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || error.message || 'API Request Failed');
        }

        return res.json();
    }

    // Auth
    async login(email: string, password: string): Promise<LoginResponse> {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }).then(data => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_token', data.token);
            }
            return data;
        });
    }

    async logout(): Promise<void> {
        try {
            await this.request('/api/auth/logout', { method: 'POST' });
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
            }
        }
    }

    async getMe() {
        return this.request('/api/auth/me');
    }

    // Customers
    async getCustomers() {
        return this.request('/api/customers');
    }

    async getCustomer(id: string) {
        return this.request(`/api/customers/${id}`);
    }

    // Orders
    async getOrders() {
        return this.request('/api/orders');
    }

    async getOrder(id: string) {
        return this.request(`/api/orders/${id}`);
    }

    async updateOrderStatus(id: string, status: string) {
        return this.request(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Products
    async getProducts() {
        return this.request('/api/products');
    }

    async getProduct(id: string) {
        return this.request(`/api/products/${id}`);
    }

    async createProduct(data: any) {
        return this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id: string, data: any) {
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(id: string) {
        return this.request(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Shipments
    async getShipments() {
        return this.request('/api/shipments');
    }

    async getShipment(id: string) {
        return this.request(`/api/shipments/${id}`);
    }

    async createShipment(data: any) {
        return this.request('/api/shipments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateShipmentStatus(id: string, status: string) {
        return this.request(`/api/shipments/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async deleteShipment(id: string) {
        return this.request(`/api/shipments/${id}`, {
            method: 'DELETE',
        });
    }

    // Uploads
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: {
                // Determine Authorization header manually since generic request handles JSON
                'Authorization': typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('admin_token')}` : '',
                'X-API-Secret': API_SECRET || '',
            },
            body: formData,
        });

        if (res.status === 401 || res.status === 403) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
                window.location.href = '/login';
            }
            throw new Error('Authentication failed');
        }

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to upload image');
        }
        return res.json();
    }
}

export const adminAPI = new AdminAPIClient();
