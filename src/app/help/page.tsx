"use client";

import React from "react";
import Link from "next/link";
import { User, CreditCard, Truck, RotateCcw, Package, RefreshCw, Info, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpPage() {
    const helpTopics = [
        { icon: User, title: "Account Protocol", href: "/help/account", detail: "Member induction and settings" },
        { icon: CreditCard, title: "Checkout Terminal", href: "/checkout", detail: "Commitment and payment" },
        { icon: Truck, title: "Logistics", href: "/help/shipping", detail: "Shipping and dispatch" },
        { icon: RotateCcw, title: "Asset Recovery", href: "/help/refunds", detail: "Refund protocols" },
        { icon: Package, title: "Order History", href: "/help/orders", detail: "Status and issues" },
        { icon: RefreshCw, title: "Exchanges", href: "/help/returns", detail: "Return and size swaps" },
        { icon: Info, title: "Reference", href: "/help/other", detail: "Policy and information" }
    ];

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-6 overflow-hidden relative">
            {/* Background Polish */}
            <div className="absolute top-0 right-0 w-full h-[50%] bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.05),transparent)]" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        Force Support Terminal
                    </motion.span>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8">
                        How Can We<br />Assist?
                    </h1>
                    <p className="text-muted-foreground font-medium text-xl uppercase tracking-widest opacity-60">
                        Operational excellence from drop to dispatch.
                    </p>
                </div>

                {/* Secure Sign In Prompt */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-secondary/30 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 md:p-14 mb-20 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-background border border-border flex items-center justify-center shadow-xl">
                            <ShieldCheck size={32} className="text-accent" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Authorize for Support</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 max-w-xs">
                                Verification unlocks real-time order history and personalized logistics assistance.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/login"
                        className="w-full md:w-auto px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                    >
                        Authenticate <ArrowRight size={18} />
                    </Link>
                </motion.div>

                {/* Browse Topics */}
                <div className="space-y-10">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 ml-4">Browse Protocols</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {helpTopics.map((topic, i) => (
                            <Link
                                key={topic.title}
                                href={topic.href}
                                className="group relative bg-secondary/20 border border-border/50 rounded-[2.5rem] p-10 hover:bg-secondary/40 hover:border-accent/30 hover:shadow-2xl transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-20 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
                                    <topic.icon size={80} strokeWidth={8} />
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all">
                                    <topic.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{topic.title}</h3>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{topic.detail}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-32 pt-20 border-t border-border/50 text-center space-y-8">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Still Enquiring?</h2>
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] opacity-60">
                        Human operators standing by for critical support requests.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:opacity-70 transition-all group"
                    >
                        Open Direct Protocol <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
