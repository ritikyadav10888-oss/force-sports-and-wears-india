"use client";

import React from "react";
import { motion } from "framer-motion";

const spotlights = [
    {
        title: "Pro Series '26",
        tag: "In Stock",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c274f?q=80&w=2070&auto=format&fit=crop",
        description: "The next evolution of performance footwear. Engineered for the exceptional."
    },
    {
        title: "Winter Armour",
        tag: "New Drop",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
        description: "Thermal regulation redefined. Maintain peak intensity in any condition."
    }
];

export const Spotlights = () => {
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Force News</span>
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Force <br /> Spotlights</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {spotlights.map((item) => (
                        <div key={item.title} className="relative aspect-[16/9] rounded-[3rem] overflow-hidden group cursor-pointer border border-border/50">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute inset-0 p-12 flex flex-col justify-end gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{item.tag}</span>
                                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">{item.title}</h3>
                                <p className="text-white/60 font-bold uppercase tracking-widest text-xs max-w-sm">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
