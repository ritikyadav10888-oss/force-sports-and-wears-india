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

                    if (!data.country_code || !data.currency) {
                        return; // Keep default (INR)
                    }

                    // If user is in India, strictly show INR
                    if (data.country_code === "IN") {
                        set({ currency: "INR", symbol: "₹", rate: 1 });
                        return;
                    }

                    // Fetch dynamic exchange rates from INR
                    const ratesRes = await fetch("https://open.er-api.com/v6/latest/INR");
                    const ratesData = await ratesRes.json();

                    const userCurrency = data.currency;
                    const rate = ratesData.rates[userCurrency] || 1;

                    // Get correct currency symbol
                    let symbol = userCurrency;
                    try {
                        const parts = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: userCurrency,
                        }).formatToParts(0);
                        const currencyPart = parts.find(p => p.type === 'currency');
                        if (currencyPart) {
                            symbol = currencyPart.value;
                        }
                    } catch (e) {
                        console.error("Failed to get symbol:", e);
                    }

                    set({ currency: userCurrency, symbol, rate });

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
