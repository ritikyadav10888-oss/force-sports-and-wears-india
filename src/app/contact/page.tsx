"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message sent! Our experts will contact you soon.");
    };

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-4 block"
                    >
                        Force Sports & Wears India • Excellence in Motion
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.85]"
                    >
                        GET IN <br className="hidden md:block" /> TOUCH
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <div className="card p-10 md:p-12 space-y-12">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase border-b border-white/5 pb-8">Support Excellence</h3>

                            <div className="space-y-10">
                                <div className="flex gap-8 items-start group/contact">
                                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent flex-shrink-0 border border-accent/20 transition-transform group-hover/contact:scale-110">
                                        <Mail size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Email us</h4>
                                        <p className="font-black italic text-xl tracking-tight">elite@forceindia.sport</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group/contact">
                                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent flex-shrink-0 border border-accent/20 transition-transform group-hover/contact:scale-110">
                                        <Phone size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Call us</h4>
                                        <p className="font-black italic text-xl tracking-tight">+91 1800-FORCE-WEAR</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group/contact">
                                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent flex-shrink-0 border border-accent/20 transition-transform group-hover/contact:scale-110">
                                        <MapPin size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">HQ Location</h4>
                                        <p className="font-black italic text-xl tracking-tight leading-tight">FORCE TOWER, BKC,<br />MUMBAI, INDIA</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-8">Social HQ</p>
                                <div className="flex gap-4">
                                    {["Instagram", "Twitter", "LinkedIn"].map((social) => (
                                        <span key={social} className="px-6 py-3 bg-secondary/50 border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:bg-accent hover:text-white hover:border-accent transition-all active:scale-95 shadow-sm">
                                            {social}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit}
                            className="card p-10 md:p-16 space-y-12 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] -mr-48 -mt-48 transition-opacity opacity-50 group-hover:opacity-100" />

                            <h2 className="text-4xl font-black italic tracking-tighter uppercase relative z-10 border-b border-white/5 pb-8">Direct Message</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 mb-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Your Name</label>
                                    <input required type="text" placeholder="JOE DOE" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Your Email</label>
                                    <input required type="email" placeholder="JOE@EXAMPLE.COM" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest text-[10px]" />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Message</label>
                                    <textarea required rows={5} placeholder="TELL US ABOUT YOUR REQUIREMENTS..." className="w-full bg-secondary/50 border border-border rounded-3xl px-6 py-6 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 resize-none uppercase tracking-widest text-[12px] leading-relaxed"></textarea>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-7 bg-primary text-primary-foreground rounded-2xl font-black text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-6 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] shadow-2xl group">
                                SEND PROTOCOL <Send size={24} className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </main>
    );
}
