import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    phone: string;
    countryCode: string;
    dialCode: string;
    firstName?: string;
    lastName?: string;
    email?: string;
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
    login: (phone: string, countryCode: string, dialCode: string, userData?: Partial<User>) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (phone: string, countryCode: string, dialCode: string, userData?: Partial<User>) => {
                set({
                    user: { phone, countryCode, dialCode, ...userData },
                    isAuthenticated: true
                });
            },
            updateUser: (userData: Partial<User>) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null
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
