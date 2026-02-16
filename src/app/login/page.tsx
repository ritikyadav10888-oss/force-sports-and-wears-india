"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { login: setAuthLogin } = useAuth();

    const [mode, setMode] = useState<'password' | 'otp'>('password');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (mode === 'password') {
                const response = await api.login(email, password);
                setAuthLogin(
                    response.user.phone || '',
                    'IN',
                    '+91',
                    {
                        firstName: response.user.name?.split(' ')[0] || '',
                        lastName: response.user.name?.split(' ').slice(1).join(' ') || '',
                        email: response.user.email
                    }
                );
                router.push('/');
            } else {
                // Send OTP
                await api.sendOtp(phone);
                router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please try again.");
            setLoading(false);
        } finally {
            if (mode === 'password') setLoading(false);
            // For OTP mode, we redirect, so loading state persists visually until nav
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <Image
                            src="/logo.png"
                            alt="Force Sports & Wears"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                            Member Login
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Access your elite athlete profile
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'password' ? (
                                <motion.div
                                    key="password-mode"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="athlete@forcesports.com"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                                            <button type="button" className="text-[9px] font-black tracking-widest text-accent uppercase hover:underline">Forgot?</button>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp-mode"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="9876543210"
                                                className="w-full pl-12 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-xl active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {mode === 'password' ? 'Authorize Entry' : 'Send Verification Code'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                         <button
                            type="button"
                            onClick={() => setMode(mode === 'password' ? 'otp' : 'password')}
                            className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline decoration-2"
                         >
                            {mode === 'password' ? 'Login via Mobile OTP' : 'Login via Email/Password'}
                         </button>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-12 pt-10 border-t border-border/50 text-center">
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            Not a member yet?{" "}
                            <Link href="/signup" className="text-accent hover:underline decoration-2 ml-2 transition-colors">
                                Join The Force
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-10">
                    <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors group flex items-center justify-center gap-2">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Drops
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
