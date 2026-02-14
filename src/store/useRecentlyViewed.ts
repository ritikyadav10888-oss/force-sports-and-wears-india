import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

interface RecentlyViewedState {
    recentlyViewed: Product[];
    addProduct: (product: Product) => void;
    clearRecentlyViewed: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
    persist(
        (set) => ({
            recentlyViewed: [],
            addProduct: (product) => {
                set((state) => {
                    // Remove if already exists to move to top
                    const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
                    // Keep only last 10
                    const updated = [product, ...filtered].slice(0, 10);
                    return { recentlyViewed: updated };
                });
            },
            clearRecentlyViewed: () => set({ recentlyViewed: [] }),
        }),
        {
            name: "recently-viewed-storage",
        }
    )
);
