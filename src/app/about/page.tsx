"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Shield, Zap, Users, Globe, ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as Easing };

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                        alt="Athletic Training"
                        className="w-full h-full object-cover opacity-30 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        {...fadeInUp}
                    >
                        <BrandLogo size="hero" className="items-center" />
                    </motion.div>
                    <motion.p
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Redefining the standards of professional athletic gear
                        for the modern Indian athlete.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-8">
                        The Mission
                    </h2>
                    <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                        <p>
                            Founded in the heart of India's sporting revolution, Force Sports & Wears India was born
                            from a simple realization: the professional athlete deserves zero compromises.
                        </p>
                        <p>
                            We bridge the gap between premium global utility and the unique demands of the
                            Indian terrain and climate. Every stitch, fabric blend, and silhouette is
                            engineered for peak performance under pressure.
                        </p>
                        <div className="pt-8 grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-4xl font-black text-foreground">100%</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-accent mt-2">Performance Focus</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground">2026</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-accent mt-2">Est. In India</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Manufacturing"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
                </motion.div>
            </section>

            {/* Core Values */}
            <section className="bg-secondary/20 py-32 border-y border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
                            Core Ethos
                        </h2>
                        <p className="text-muted-foreground font-medium">The pillars of our professional standard.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="text-accent" size={32} />,
                                title: "Innovation",
                                description: "Proprietary fabric tech designed for thermal regulation and moisture management."
                            },
                            {
                                icon: <Shield className="text-accent" size={32} />,
                                title: "Durability",
                                description: "Tested in high-intensity environments to ensure long-lasting peak performance."
                            },
                            {
                                icon: <Users className="text-accent" size={32} />,
                                title: "Community",
                                description: "Building an elite movement of Indian athletes who push beyond limits."
                            }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="p-10 glass rounded-[2.5rem] border border-white/20 hover:border-accent/30 transition-all group"
                            >
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">{value.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Vision Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-accent/5 rounded-full blur-[120px] animate-pulse" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <Award className="w-20 h-20 text-accent mx-auto mb-10 opacity-50" />
                        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-12">
                            Join the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-500 italic">Professional</span> Force Sports & Wears India
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium mb-16 leading-relaxed">
                            We don't just sell apparel; we provide the gear for your greatest achievements.
                            Experience the future of Indian athletic wear today.
                        </p>
                        <Link href="/">
                            <button className="px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 mx-auto group">
                                Explore the Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
