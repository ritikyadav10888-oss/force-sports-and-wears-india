"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center lg:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <BrandLogo size="hero" className="items-center lg:items-start" />
                    </motion.div>
                    <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-12 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                        Professional grade athletic wear engineered for peak performance.
                        Join the elite force in Indian sports culture.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-5 justify-center lg:justify-start">
                        <button className="px-10 py-6 bg-primary text-primary-foreground rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 group border border-white/10">
                            Explore Drops <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-6 glass rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] hover:bg-secondary/80 transition-all active:scale-95 border border-border">
                            Lookbook <ShoppingBag size={18} />
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="relative"
                >
                    <div className="relative z-10 aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group">
                        <img
                            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop"
                            alt="Premium Hoodie"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Floating Performance Stats Card */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-6 md:-right-12 glass p-6 rounded-3xl shadow-2xl z-20 hidden sm:block border border-white/30"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                <ArrowRight size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Heat Retention</p>
                                <p className="text-xl font-black">+25%</p>
                            </div>
                        </div>
                        <p className="text-xs font-semibold opacity-70">AeroThermal Fleece Tech</p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -bottom-10 -left-6 md:-left-12 glass p-6 rounded-3xl shadow-2xl z-20 border border-white/30"
                    >
                        <p className="text-xs font-bold text-accent mb-1 uppercase tracking-tighter">Limited Release</p>
                        <p className="text-lg font-black italic">Core Oversized Hoodie</p>
                        <p className="text-sm font-bold mt-2 opacity-80">$89.00</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
