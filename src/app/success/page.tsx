"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

export default function SuccessPage() {
    const [latestOrder, setLatestOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentOrder = async () => {
            try {
                const data = await api.getMyOrders();
                if (data.orders && data.orders.length > 0) {
                    setLatestOrder(data.orders[0]);
                }
            } catch (error) {
                console.error("Failed to fetch confirmation details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentOrder();
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-secondary/10 overflow-hidden relative">
            {/* Background Polish */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-xl w-full bg-background border border-border/50 rounded-[4rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden z-10"
            >
                {/* Elite Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-accent" />

                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.3, damping: 15 }}
                    className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-10 text-accent border border-accent/20 shadow-lg shadow-accent/5"
                >
                    <CheckCircle2 size={48} />
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                    Order<br />Confirmed
                </h1>
                <p className="text-muted-foreground font-medium mb-12 max-w-sm mx-auto uppercase text-[10px] tracking-[0.2em] leading-relaxed opacity-60">
                    Your elite gear is being synchronized for dispatch. High-performance logistics have been initiated.
                </p>

                {loading ? (
                    <div className="py-12 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Authenticating Protocol...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        <div className="p-6 bg-secondary/50 rounded-3xl border border-border/20 text-left hover:bg-secondary/70 transition-colors">
                            <Package size={20} className="mb-4 text-accent" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Asset ID</h4>
                            <p className="font-black italic text-lg tracking-tight uppercase">
                                {latestOrder?.orderNumber ? `#${latestOrder.orderNumber}` : "#FSWI-PENDING"}
                            </p>
                        </div>
                        <div className="p-6 bg-secondary/50 rounded-3xl border border-border/20 text-left hover:bg-secondary/70 transition-colors">
                            <ShoppingBag size={20} className="mb-4 text-accent" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Protocol Status</h4>
                            <p className="font-black italic text-lg tracking-tight uppercase">
                                {latestOrder?.status || "INITIATED"}
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-5">
                    <Link
                        href="/"
                        className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all shadow-xl active:scale-95 group"
                    >
                        Back to Drops <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/help"
                        className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors underline underline-offset-8 decoration-2"
                    >
                        Review Logistics Support
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
