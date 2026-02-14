"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import Link from "next/link";

export const CartDrawer = () => {
    const { items, isOpen, toggleCart, updateQuantity, removeItem } = useCart();
    const { rate, symbol } = useCurrency();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-screen w-full sm:max-w-md bg-background z-[80] shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col border-l border-border"
                    >
                        <div className="p-6 md:p-10 border-b border-border flex justify-between items-center bg-secondary/10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3 italic uppercase">
                                    YOUR BAG
                                </h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                    {items.length} {items.length === 1 ? 'Item' : 'Items'} selected
                                </p>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-secondary rounded-full transition-all active:scale-90"
                            >
                                <X size={20} className="md:size-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                                        <ShoppingBag size={40} className="text-muted-foreground/50" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold tracking-tight">Your bag is empty</p>
                                        <p className="text-sm text-muted-foreground mt-2">Discover our new arrivals and <br />find your next favorite piece.</p>
                                    </div>
                                    <button onClick={toggleCart} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:opacity-90 transition-all">
                                        Explore Shop
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-start group">
                                        <div className="w-24 h-32 bg-secondary rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg tracking-tight leading-tight">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground font-medium">{item.category}</p>
                                                </div>
                                                <p className="font-black text-lg tracking-tighter">
                                                    {formatPrice(item.price * item.quantity, rate, symbol)}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center bg-secondary/50 rounded-xl px-2 py-1 border border-border/50">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-widest underline underline-offset-4"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-border bg-secondary/10 backdrop-blur-xl">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Subtotal</p>
                                        <p className="text-3xl font-black italic tracking-tighter">{formatPrice(subtotal, rate, symbol)}</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Tax Included</p>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={toggleCart}
                                    className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 group shadow-lg"
                                >
                                    PROCEED TO PROTOCOL <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-[0.2em] mt-6 opacity-40">
                                    Secure Checkout • Global Logistics
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
