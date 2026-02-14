"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, MapPin, ArrowRight, Loader2, ShieldCheck, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

export default function SignupPage() {
    const router = useRouter();
    const { login: setAuthLogin } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "Maharashtra",
            postalCode: "",
            country: "India"
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Personal, 2: Address

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as any),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });


            // Auto login after signup
            setAuthLogin(
                formData.phone,
                'IN',
                '+91',
                {
                    firstName: formData.name.split(' ')[0],
                    lastName: formData.name.split(' ').slice(1).join(' '),
                    email: formData.email,
                    address: formData.address
                }
            );

            router.push('/');
        } catch (err: any) {
            setError(err.message || "Registration failed. This account may already exist.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <Image
                            src="/logo.png"
                            alt="Force Sports & Wears"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Signup Card */}
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[3.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Join Force</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Step {step} of 2</p>
                        </div>
                        <div className="flex gap-2">
                            <div className={`w-12 h-1.5 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-secondary'}`} />
                            <div className={`w-12 h-1.5 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-secondary'}`} />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="ELITE ATHLETE"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Protocol</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="ATHLETE@FORCESPORTS.COM"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Terminal</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="9876543210"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Secure Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                required
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Street Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                name="address.street"
                                                value={formData.address.street}
                                                onChange={handleInputChange}
                                                placeholder="123 ELITE BOULEVARD"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="address.city"
                                                value={formData.address.city}
                                                onChange={handleInputChange}
                                                placeholder="MUMBAI"
                                                className="w-full px-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm uppercase"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Postal Code</label>
                                            <input
                                                required
                                                type="text"
                                                name="address.postalCode"
                                                value={formData.address.postalCode}
                                                onChange={handleInputChange}
                                                placeholder="400001"
                                                className="w-full px-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 mt-10">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-8 py-5 bg-secondary border border-border rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary/80 transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group shadow-xl active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {step === 1 ? "Next Protocol" : "Complete Induction"}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-10 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Secure Connection Verified <ShieldCheck size={12} className="inline ml-1 text-accent" />
                    </p>
                </div>

                <div className="text-center mt-10">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Returning member?{" "}
                        <Link href="/login" className="text-accent hover:underline decoration-2 ml-2 transition-colors">
                            Authenticate Entry
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
