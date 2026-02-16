"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const router = useRouter();
    const { login: setAuthLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.login(email, password);
            // Sync with Zustand store
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

            // Close modal and redirect to account
            onClose();
            // Force a hard navigation to ensure state is fresh
            window.location.href = '/account';
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden border border-border/50"
                    >
                        {/* Premium Header Decoration */}
                        <div className="h-2 bg-accent w-full" />

                        <div className="p-8 md:p-12">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Logo */}
                            <div className="flex justify-center mb-10">
                                <Image
                                    src="/logo.png"
                                    alt="Force Sports & Wears"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>

                            {/* Title */}
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">
                                    Welcome Back
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Log in to your account
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                                >
                                    {error}
                                    {error.includes("verify") && (
                                        <div className="mt-2">
                                            <Link
                                                href={`/verify-otp?email=${encodeURIComponent(email)}`}
                                                className="underline hover:text-red-400 transition-colors"
                                                onClick={onClose}
                                            >
                                                Verify Now
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="athlete@forcesports.com"
                                            className="w-full pl-12 pr-6 py-4 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
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
                                            className="w-full pl-12 pr-6 py-4 bg-secondary/50 border border-border rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !email || !password}
                                    className="w-full mt-6 bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-xl active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            Log In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Signup Link */}
                            <div className="mt-10 pt-8 border-t border-border/50 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Not a member yet?{" "}
                                    <Link href="/signup" className="text-accent hover:underline decoration-2 ml-2" onClick={onClose}>
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
