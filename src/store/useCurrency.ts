"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyState {
    currency: string;
    symbol: string;
    rate: number;
    setCurrency: (currency: string, symbol: string, rate: number) => void;
    detectCurrency: () => Promise<void>;
}

export const useCurrency = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: "INR",
            symbol: "₹",
            rate: 1,
            setCurrency: (currency, symbol, rate) => set({ currency, symbol, rate }),
            detectCurrency: async () => {
                try {
                    const res = await fetch("https://ipapi.co/json/");
                    const data = await res.json();

                    if (data.country_code === "US") {
                        set({ currency: "USD", symbol: "$", rate: 0.012 }); // 1 INR = 0.012 USD approx
                    } else if (data.country_code === "GB") {
                        set({ currency: "GBP", symbol: "£", rate: 0.0094 });
                    } else if (["FR", "DE", "IT", "ES"].includes(data.country_code)) {
                        set({ currency: "EUR", symbol: "€", rate: 0.011 });
                    } else {
                        set({ currency: "INR", symbol: "₹", rate: 1 });
                    }
                } catch (error) {
                    console.error("Failed to detect location:", error);
                }
            },
        }),
        {
            name: "currency-storage",
        }
    )
);

export const formatPrice = (priceInInr: number, rate: number, symbol: string) => {
    const converted = priceInInr * rate;
    return `${symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};
