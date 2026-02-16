"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api-client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryPage() {
    const params = useParams();
    const categoryName = decodeURIComponent(params.category as string);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                const allProducts = data.products || [];
                const filtered = allProducts.filter((p: any) =>
                    p.category?.toLowerCase() === categoryName.toLowerCase()
                );
                setProducts(filtered);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    return (
        <main className="min-h-screen pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-accent mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Base
                </Link>

                <div className="mb-16">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] block mb-4">Collection</span>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">{categoryName}</h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-accent" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Loading Gear...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((p, idx) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard product={p} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-border rounded-3xl bg-secondary/10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No gear found for {categoryName} yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
