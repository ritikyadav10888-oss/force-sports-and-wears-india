"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
    const [query, setQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filteredProducts = query.trim() !== ""
        ? products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    const trendingSearches = ["Essential Tee", "Oversized Hoodie", "Tracksuit Set", "Stealth Cap"];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl flex flex-col p-8 md:p-20"
                >
                    <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-2xl font-black italic tracking-tighter uppercase">Global Search</span>
                            <button
                                onClick={onClose}
                                className="w-16 h-16 flex items-center justify-center hover:bg-secondary rounded-full border border-border transition-all active:scale-90"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-16">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground w-10 h-10" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SEARCH Force Sports & Wears India"
                                className="w-full bg-transparent border-b-4 border-muted-foreground/20 focus:border-accent text-2xl sm:text-4xl md:text-7xl font-black italic tracking-tighter uppercase py-8 pl-14 outline-none transition-colors placeholder:text-muted-foreground/30"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {query.trim() === "" ? (
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <TrendingUp size={16} />
                                            <h4 className="text-xs font-black uppercase tracking-[0.3em]">Trending Now</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {trendingSearches.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setQuery(s)}
                                                    className="px-8 py-4 bg-secondary/50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all border border-border/50"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Link
                                            href="/new"
                                            onClick={onClose}
                                            className="p-10 bg-primary text-primary-foreground rounded-[2rem] space-y-4 group cursor-pointer overflow-hidden relative"
                                        >
                                            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 transition-transform group-hover:translate-x-2">
                                                <h4 className="text-3xl font-black italic tracking-tighter uppercase">New Arrivals</h4>
                                                <p className="text-primary-foreground/60 font-medium">Explore the latest drops.</p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/collections"
                                            onClick={onClose}
                                            className="p-10 border border-border rounded-[2rem] space-y-4 group cursor-pointer hover:border-accent transition-colors"
                                        >
                                            <h4 className="text-3xl font-black italic tracking-tighter uppercase">Collections</h4>
                                            <p className="text-muted-foreground font-medium">Shop by theme and style.</p>
                                            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.4em] text-center opacity-30 mt-20 uppercase">
                                                Force Sports & Wears India • Excellence in Motion
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        {filteredProducts.length} Results Found
                                    </h4>
                                    <div className="space-y-4">
                                        {filteredProducts.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/product/${p.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-6 p-6 hover:bg-secondary rounded-[2.5rem] transition-all group border border-transparent hover:border-border/50 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]"
                                            >
                                                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-secondary flex-shrink-0 relative">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">{p.category}</span>
                                                        <span className="w-1 h-1 bg-border rounded-full" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">In Stock</span>
                                                    </div>
                                                    <h5 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase group-hover:text-accent transition-colors leading-none mb-1">{p.name}</h5>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 line-clamp-1">{p.description}</p>
                                                </div>
                                                <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all bg-white dark:bg-black shadow-lg">
                                                    <ArrowRight size={24} className="text-accent" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {filteredProducts.length === 0 && (
                                        <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                                            <p className="text-xl font-bold opacity-40">NO RESULTS FOR "{query.toUpperCase()}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
