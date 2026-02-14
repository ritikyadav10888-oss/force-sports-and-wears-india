"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function CollectionsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch collections", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-accent" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Cataloging Archive...</p>
            </div>
        );
    }

    const categories = Array.from(new Set(products.map((p) => p.category)));

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-4">Collections</h1>
                <p className="text-muted-foreground font-medium text-xl uppercase tracking-widest opacity-60">Force Sports & Wears India • Curated Editions</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {categories.length > 0 ? (
                    categories.map((category, idx) => {
                        const categoryProducts = products.filter(p => p.category === category).slice(0, 4);
                        return (
                            <section key={category} className="space-y-12">
                                <div className="flex justify-between items-end border-b border-border/50 pb-8">
                                    <div>
                                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2 block">EDITION 0{idx + 1}</span>
                                        <h2 className="text-5xl font-black italic tracking-tighter uppercase">{category}</h2>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-8 hover:text-accent transition-colors">
                                        Browse Full Drop
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                                    {categoryProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            </section>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No collections discovered at this time</p>
                    </div>
                )}
            </div>
        </main>
    );
}
