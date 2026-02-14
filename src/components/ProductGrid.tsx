"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products for grid", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);

    return (
        <section id="shop" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div className="text-left">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase"
                    >
                        Explore Drops
                    </motion.h2>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-md font-medium">
                        Filter by category to find your perfect fit.
                        Engineered for style, optimized for the streets.
                    </p>
                </div>

                {!loading && products.length > 0 && (
                    <div className="flex flex-nowrap overflow-x-auto no-scrollbar md:flex-wrap gap-2 w-full md:w-auto bg-secondary/30 p-1.5 rounded-[2rem] border border-border/50 backdrop-blur-sm scroll-smooth">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative",
                                    activeCategory === cat
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="relative z-10">{cat}</span>
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="animate-spin text-accent" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Initializing Product Engine...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-border rounded-[40px] bg-secondary/10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Product Archive Offline. Check back soon for new drops.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </section>
    );
};
