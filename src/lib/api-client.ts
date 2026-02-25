const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        phone?: string;
        otp?: string; // Optional: For development only
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
            const error = await res.json().catch(() => ({}));
            const errorMessage = error.error || error.message || 'Registration failed';
            const details = error.details ? ` Details: ${error.details}` : '';
            throw new Error(`${errorMessage}${details} [${res.status}]`);
        }

        const response = await res.json();

        // Note: Register no longer returns a token immediately if verification is required
        // But if it does (e.g. for some cases), we store it.
        // In our case, we expect 'message' and 'user' with isVerified: false

        if (response.token && typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async verifyOtp(email: string, otp: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, otp }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            const errorMessage = error.error || error.message || 'Verification failed';
            const details = error.details ? ` Details: ${error.details}` : '';
            throw new Error(`${errorMessage}${details} [${res.status}]`);
        }

        const response = await res.json();

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async resendOtp(email: string): Promise<{ message: string; user?: { otp?: string } }> {
        const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            const errorMessage = error.error || error.message || 'Failed to resend OTP';
            const details = error.details ? ` Details: ${error.details}` : '';
            throw new Error(`${errorMessage}${details} [${res.status}]`);
        }

        return res.json();
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            const errorMessage = error.error || error.message || 'Login failed';
            const details = error.details ? ` Details: ${error.details}` : '';
            throw new Error(`${errorMessage}${details} [${res.status}]`);
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

    async deleteAccount(): Promise<void> {
        const res = await fetch(`${API_URL}/api/auth/account`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to delete account');
        }

        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
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

    // Support
    async submitSupportTicket(data: { orderId?: string, issueType: string, description: string }) {
        const res = await fetch(`${API_URL}/api/support`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to submit support ticket');
        }

        return res.json();
    }

    // Reviews
    async getProductReviews(productId: string) {
        const res = await fetch(`${API_URL}/api/reviews/products/${productId}`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
    }

    async submitReview(data: { productId: string, rating: number, comment: string }) {
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to submit review');
        }

        return res.json();
    }

    async updateReview(id: string, data: { rating: number, comment: string }) {
        const res = await fetch(`${API_URL}/api/reviews/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to update review');
        }

        return res.json();
    }

    async deleteReview(id: string) {
        const res = await fetch(`${API_URL}/api/reviews/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to delete review');
        }

        return res.json();
    }

    // Support Messages
    async getSupportMessages(ticketId: string) {
        const res = await fetch(`${API_URL}/api/support/${ticketId}/messages`, {
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || 'Failed to fetch messages');
        }

        return res.json();
    }

    async sendSupportMessage(ticketId: string, content: string) {
        const res = await fetch(`${API_URL}/api/support/${ticketId}/messages`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ content }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to send message');
        }

        return res.json();
    }
}

export const api = new APIClient();
