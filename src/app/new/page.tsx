"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function NewArrivalsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-accent" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing New Drops...</p>
            </div>
        );
    }

    // Since the database might not have an 'isNew' flag yet, we'll take the 8 most recent ones
    // Orders are usually descending by default from backend
    const newArrivals = products.slice(0, 8);

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.3),transparent)] rounded-[3rem]" />
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block px-4 py-1.5 bg-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 relative z-10"
                    >
                        Just Landed
                    </motion.span>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8 relative z-10 py-2">
                        New<br />Arrivals
                    </h1>
                    <p className="max-w-md text-primary-foreground/60 font-medium text-lg leading-relaxed relative z-10">
                        The latest evolution of Indian athletic performance. Precision engineered for the exceptional.
                    </p>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-6">
                {newArrivals.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">The next drop is synchronized. Check back shortly.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
