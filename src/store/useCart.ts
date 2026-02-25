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
                    // Block out-of-stock products entirely
                    const stock = (product as any).stock;
                    if (stock !== undefined && stock <= 0) return state;

                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        // Cap quantity at available stock
                        const newQty = stock !== undefined
                            ? Math.min(stock, existingItem.quantity + quantity)
                            : existingItem.quantity + quantity;
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: newQty }
                                    : item
                            ),
                            isOpen: true
                        };
                    }
                    const addQty = stock !== undefined ? Math.min(stock, quantity) : quantity;
                    return { items: [...state.items, { ...product, quantity: addQty }], isOpen: true };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            updateQuantity: (id, delta) =>
                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.id !== id) return item;
                        const stock = (item as any).stock;
                        const newQty = Math.max(1, item.quantity + delta);
                        return {
                            ...item,
                            quantity: stock !== undefined ? Math.min(stock, newQty) : newQty
                        };
                    }),
                })),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
        }
    )
);
