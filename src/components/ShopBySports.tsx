"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const sports = [
    { name: "Cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop" },
    { name: "Football", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2036&auto=format&fit=crop" },
    { name: "Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop" },
    { name: "Training", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" }
];

export const ShopBySports = () => {
    return (
        <section className="py-32 px-6 bg-secondary/10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 space-y-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Discipline Driven</span>
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Shop By <br className="md:hidden" /> Sports</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sports.map((sport) => (
                        <motion.div
                            key={sport.name}
                            whileHover={{ y: -10 }}
                            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer border border-border/50"
                        >
                            <img
                                src={sport.image}
                                alt={sport.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">{sport.name}</h3>
                                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
