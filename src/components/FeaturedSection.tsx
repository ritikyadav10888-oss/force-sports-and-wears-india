"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

export const FeaturedSection = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch featured gear", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const featuredProducts = products.length > 0 ? products.slice(0, 4) : [];

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block"
                        >
                            Elite Selection
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none"
                        >
                            Featured <br /> Gear
                        </motion.h2>
                    </div>
                    <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-accent transition-colors group">
                        View Full Arsenal <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-accent" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Weaponry...</p>
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-border rounded-3xl">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Arsenal currently empty. Check back for fresh drops.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
