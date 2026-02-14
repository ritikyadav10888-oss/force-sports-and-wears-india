"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
    email: string;
    name: string;
    role: "admin";
}

interface AdminAuthState {
    admin: AdminUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

// Mock admin credentials (in production, this would be handled by backend)
const ADMIN_CREDENTIALS = {
    email: "admin@force.com",
    password: "admin123"
};

export const useAdminAuth = create<AdminAuthState>()(
    persist(
        (set) => ({
            admin: null,
            isAuthenticated: false,
            login: (email: string, password: string) => {
                // Mock authentication - replace with real API call
                if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                    set({
                        admin: {
                            email: ADMIN_CREDENTIALS.email,
                            name: "Admin User",
                            role: "admin"
                        },
                        isAuthenticated: true
                    });
                    return true;
                }
                return false;
            },
            logout: () => set({ admin: null, isAuthenticated: false })
        }),
        {
            name: "admin-auth-storage"
        }
    )
);
