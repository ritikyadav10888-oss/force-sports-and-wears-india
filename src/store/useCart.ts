"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            addItem: (product, quantity = 1) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                            isOpen: true
                        };
                    }
                    return { items: [...state.items, { ...product, quantity }], isOpen: true };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            updateQuantity: (id, delta) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                            : item
                    ),
                })),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
        }
    )
);
