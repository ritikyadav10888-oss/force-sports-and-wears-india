"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import { useCart } from "@/store/useCart";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export const QuickView = ({ product, isOpen, onClose }: QuickViewProps) => {
    const { rate, symbol } = useCurrency();
    const { addItem } = useCart();
    const [quantity, setQuantity] = React.useState(1);
    const [selectedSize, setSelectedSize] = React.useState("M");
    const [activeImage, setActiveImage] = React.useState(0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-background rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-background/50 backdrop-blur-md rounded-full border border-border hover:bg-secondary transition-all"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Section */}
                        <div className="md:w-1/2 relative bg-secondary overflow-hidden group/gallery">
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={product.images[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Quick Mini Thumbnails */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(idx);
                                        }}
                                        className={cn(
                                            "w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                                            activeImage === idx ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 p-10 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="space-y-4 mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[.3em] text-accent">{product.category}</span>
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{product.name}</h2>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed">{product.description}</p>

                                <ul className="space-y-2 pt-4">
                                    {(product.highlights || []).slice(0, 3).map((highlight, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/60">
                                            <div className="w-1 h-1 rounded-full bg-accent" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-border/10">
                                    <span className="text-3xl font-black italic tracking-tighter">{formatPrice(product.price, rate, symbol)}</span>
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground">Select Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["S", "M", "L", "XL"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl font-black transition-all flex items-center justify-center border-2",
                                                    selectedSize === size
                                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                        : "bg-transparent border-border hover:border-accent text-foreground"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 flex items-center gap-6">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground mb-3">Quantity</h4>
                                        <div className="flex items-center w-fit bg-secondary rounded-xl p-1 border border-border/50">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center hover:text-accent transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-black italic">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:text-accent transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-6">
                                        <button
                                            onClick={() => {
                                                addItem(product, quantity);
                                                onClose();
                                            }}
                                            className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg active:scale-[0.98]"
                                        >
                                            Add to Bag <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    href={`/product/${product.id}`}
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors py-4 group"
                                >
                                    View Full Technical Specs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
