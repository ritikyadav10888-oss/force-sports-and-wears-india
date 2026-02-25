import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    phone: string;
    email?: string;
    name?: string;
    role?: string;
    isVerified?: boolean;
    firstName?: string;
    lastName?: string;
    countryCode?: string;
    dialCode?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (userData: User) => {
                set({
                    user: userData,
                    isAuthenticated: true
                });
            },
            updateUser: (userData: Partial<User>) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null as any
                }));
            },
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false
                });
            }
        }),
        {
            name: 'auth-storage'
        }
    )
);
