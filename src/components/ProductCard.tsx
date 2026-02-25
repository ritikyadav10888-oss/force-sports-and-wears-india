"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import { useCart } from "@/store/useCart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

import { QuickView } from "./QuickView";

import Image from "next/image";

// ... existing imports

export const ProductCard = ({ product }: ProductCardProps) => {
    const { rate, symbol } = useCurrency();
    const { addItem } = useCart();
    const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);

    return (
        <>
            <QuickView
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                className="group relative p-4 card flex flex-col h-full"
            >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary relative shadow-sm group-hover:shadow-xl transition-all duration-500 mb-6 flex-shrink-0">
                    <Link href={`/product/${product.id}`} className="block w-full h-full relative">
                        <Image
                            src={product.image || product.images?.[0] || '/placeholder-product.svg'}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="eager"
                        />
                    </Link>

                    {/* Out of Stock Overlay */}
                    {(product as any).stock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 rounded-2xl">
                            <span className="px-5 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Overlay Actions (Desktop) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex flex-col justify-end p-6 gap-3">
                        {(product as any).stock > 0 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addItem(product)}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-colors"
                            >
                                <Plus size={18} /> Quick Add
                            </motion.button>
                        ) : (
                            <div className="w-full py-4 bg-white/20 text-white/60 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                Out of Stock
                            </div>
                        )}
                        <button
                            onClick={() => setIsQuickViewOpen(true)}
                            className="w-full py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
                        >
                            Quick View
                        </button>
                    </div>

                    {/* Mobile Quick Add */}
                    {(product as any).stock > 0 && (
                        <button
                            onClick={() => addItem(product)}
                            className="md:hidden absolute bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-20 border border-white/10"
                        >
                            <Plus size={24} />
                        </button>
                    )}

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-black/80 backdrop-blur-md text-[9px] text-white font-black uppercase tracking-[0.2em] rounded-lg shadow-2xl border border-white/10">
                            {product.category}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between px-1">
                    <div className="space-y-1">
                        <Link href={`/product/${product.id}`}>
                            <h3 className="font-black text-lg md:text-xl tracking-tighter group-hover:text-accent transition-colors leading-tight uppercase italic">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60 line-clamp-1">{product.description}</p>
                    </div>
                    <div className="pt-4 border-t border-border/10 mt-4 flex items-center justify-between">
                        <p className="font-black text-2xl md:text-3xl tracking-tighter italic">
                            {formatPrice(product.price, rate, symbol)}
                        </p>
                        {(product as any).stock <= 0 && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-500/30 px-2 py-1 rounded-lg bg-red-500/5">
                                OOS
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};
