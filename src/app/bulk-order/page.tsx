"use client";
import React, { useState } from "react";
import { BulkOrderModal } from "@/components/BulkOrderModal";
import { motion } from "framer-motion";
import { Package, Wrench, Star, Truck, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function BulkOrderPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"BULK_ORDER" | "CUSTOM_MANUFACTURING">("BULK_ORDER");

    const openModal = (type: "BULK_ORDER" | "CUSTOM_MANUFACTURING") => {
        setModalType(type);
        setModalOpen(true);
    };

    const features = [
        { icon: Package, title: "Bulk Orders", desc: "Minimum 10 units. Special pricing for teams, clubs, and academies." },
        { icon: Wrench, title: "Custom Manufacturing", desc: "Your logo, your colors, your design. Full customization available." },
        { icon: Star, title: "Premium Quality", desc: "Same quality as our regular products — no compromise on bulk orders." },
        { icon: Truck, title: "Fast Delivery", desc: "Dedicated logistics for bulk orders. Pan-India delivery." },
        { icon: ShieldCheck, title: "Satisfaction Guarantee", desc: "Quality approved before dispatch. Pre-shipment samples available." },
        { icon: Users, title: "Dedicated Account Manager", desc: "A dedicated manager handles your order from inquiry to delivery." },
    ];

    const useCases = [
        { emoji: "🏏", title: "Cricket Academies", desc: "Full kit with branded jerseys, gloves, pads & accessories" },
        { emoji: "⚽", title: "Football Clubs", desc: "Team jerseys, training kits, custom sportswear" },
        { emoji: "🏃", title: "Corporate Events", desc: "Running events, marathons, branded giveaways" },
        { emoji: "🏫", title: "Schools & Colleges", desc: "Sports day uniforms, annual games bulk supply" },
        { emoji: "🏋️", title: "Gyms & Fitness", desc: "Branded gym wear, training gear for your members" },
        { emoji: "🛍️", title: "Resellers", desc: "Reseller pricing for sports retailers and distributors" },
    ];

    return (
        <main className="min-h-screen bg-background pt-20">
            {/* Hero */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
                <div className="max-w-4xl mx-auto relative text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-black uppercase tracking-widest"
                    >
                        <Package size={14} /> Bulk & Custom Orders
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none"
                    >
                        Power Your<br />
                        <span className="text-accent">Team</span> &amp; Brand
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Custom logos, team kits, bulk pricing — for academies, clubs, corporates, and resellers.
                        Get premium sports gear at scale.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <button
                            onClick={() => openModal("BULK_ORDER")}
                            className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl text-base"
                        >
                            <Package size={20} /> Get Bulk Pricing
                        </button>
                        <button
                            onClick={() => openModal("CUSTOM_MANUFACTURING")}
                            className="px-10 py-5 bg-secondary border border-border rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-accent transition-all text-base"
                        >
                            <Wrench size={20} /> Custom Manufacturing
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-8 bg-secondary/30 border-y border-border">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
                    {[
                        { value: "10+", label: "Min. Units" },
                        { value: "48hr", label: "Response Time" },
                        { value: "100%", label: "Custom Print" },
                        { value: "PAN IN", label: "Delivery" },
                        { value: "500+", label: "Teams Served" },
                        { value: "24/7", label: "Support" },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-2xl font-black text-accent italic">{s.value}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic text-center mb-12">Why Choose Us for Bulk Orders?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="p-6 bg-secondary/20 rounded-2xl border border-border/50 hover:border-accent/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                    <f.icon size={22} />
                                </div>
                                <h3 className="font-black uppercase tracking-tight text-sm mb-2">{f.title}</h3>
                                <p className="text-muted-foreground text-sm">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 px-6 bg-secondary/20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic text-center mb-10">Perfect For</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {useCases.map((u, i) => (
                            <div key={i} className="p-5 bg-background rounded-2xl border border-border/50 flex items-start gap-4">
                                <span className="text-3xl">{u.emoji}</span>
                                <div>
                                    <h3 className="font-black uppercase tracking-tight text-sm">{u.title}</h3>
                                    <p className="text-muted-foreground text-xs mt-1">{u.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic mb-12">How It Works</h2>
                    <div className="space-y-4">
                        {[
                            { step: "01", title: "Submit Inquiry", desc: "Fill the form with your requirements — quantity, customization, delivery date." },
                            { step: "02", title: "Get a Quote", desc: "Our team responds within 24–48 hours with a detailed quotation." },
                            { step: "03", title: "Approve Sample", desc: "We send a pre-production sample for your approval." },
                            { step: "04", title: "Production & Dispatch", desc: "Full production begins and is dispatched with tracking." },
                        ].map((s, i) => (
                            <div key={i} className="flex items-start gap-6 p-6 bg-secondary/20 rounded-2xl border border-border/50 text-left">
                                <span className="text-4xl font-black text-accent/30 italic min-w-[60px]">{s.step}</span>
                                <div>
                                    <h3 className="font-black uppercase tracking-tight">{s.title}</h3>
                                    <p className="text-muted-foreground text-sm mt-1">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-black uppercase tracking-tight italic">Ready to Place a Bulk Order?</h2>
                    <p className="text-muted-foreground">Get in touch now and our team will guide you through the entire process.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => openModal("BULK_ORDER")}
                            className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
                        >
                            <Package size={20} /> Start Bulk Order
                        </button>
                        <button
                            onClick={() => openModal("CUSTOM_MANUFACTURING")}
                            className="px-10 py-5 bg-secondary border border-border rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-accent transition-all"
                        >
                            <Wrench size={20} /> Custom Design
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Or <Link href="/contact" className="text-accent hover:underline font-bold">contact us directly</Link> for urgent orders
                    </p>
                </div>
            </section>

            <BulkOrderModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                defaultType={modalType}
            />
        </main>
    );
}
