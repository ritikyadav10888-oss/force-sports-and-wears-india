"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accessibility, Eye, Ear, Keyboard, ShieldCheck, Mail } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
};


export default function AccessibilityPage() {
    return (
        <main className="min-h-screen bg-background pt-40 pb-24 overflow-hidden">
            {/* Background Accent */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="mb-24">
                    <motion.div {...fadeInUp} className="mb-8">
                        <BrandLogo size="lg" />
                    </motion.div>
                    <motion.h1
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8"
                    >
                        Inclusive <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-500 italic">Access</span>
                    </motion.h1>
                    <motion.p
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.2 }}
                        className="text-xl text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-60"
                    >
                        Force Sports & Wears India • Commitment to Universal Excellence
                    </motion.p>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-32">
                    {/* Commitment Statement */}
                    <motion.section {...fadeInUp} className="max-w-3xl">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <ShieldCheck className="text-accent" size={32} />
                            Our Commitment
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Force Sports & Wears India is dedicated to providing a digital environment that is accessible to everyone, regardless of ability or technology. We believe that professional athletic gear should be within reach for all athletes, and we strive to ensure our platform reflects this elite standard of inclusion.
                        </p>
                    </motion.section>

                    {/* Feature Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Eye size={32} />,
                                title: "Visual Clarity",
                                description: "We utilize high-contrast color palettes and scalable typography to ensure content remains legible for users with visual impairments."
                            },
                            {
                                icon: <Keyboard size={32} />,
                                title: "Full Navigation",
                                description: "Every interaction on our platform is engineered for keyboard-only navigation, ensuring seamless access for all input methods."
                            },
                            {
                                icon: <Ear size={32} />,
                                title: "Screen Support",
                                description: "Our semantic HTML architecture is optimized for screen readers, providing clear context and descriptive alt-text for all visual assets."
                            },
                            {
                                icon: <Accessibility size={32} />,
                                title: "WCAG 2.1 Standard",
                                description: "We are continuously auditing our systems to align with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="p-10 glass rounded-[2.5rem] border border-white/10 hover:border-accent/30 transition-all group"
                            >
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 text-accent">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">{item.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </section>

                    {/* Feedback Section */}
                    <motion.div
                        {...fadeInUp}
                        className="p-12 md:p-20 bg-primary text-primary-foreground rounded-[3rem] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.2),transparent)]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-md">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6">Assistance Required?</h2>
                                <p className="text-primary-foreground/70 text-lg font-medium leading-relaxed">
                                    If you encounter any barriers on our site, our technical support force is ready to assist. Your feedback drives our continuous evolution.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <a
                                    href="mailto:accessibility@forcesports.in"
                                    className="px-10 py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 text-xs"
                                >
                                    <Mail size={18} /> Contact Support
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Legal */}
                <motion.div
                    {...fadeInUp}
                    className="mt-32 pt-8 border-t border-border/50 text-center"
                >
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        Force Sports & Wears India • Built for the Exceptional Athlete
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
