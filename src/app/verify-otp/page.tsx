"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone') || '';
    const { login: setAuthLogin } = useAuth();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit code.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.verifyOtp(phone, otpString);

            // Sync with Zustand store
            setAuthLogin(
                response.user.phone || phone,
                'IN',
                '+91',
                {
                    firstName: response.user.name?.split(' ')[0] || '',
                    lastName: response.user.name?.split(' ').slice(1).join(' ') || '',
                    email: response.user.email
                }
            );

            router.push('/');
        } catch (err: any) {
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!phone) {
        return (
            <div className="text-center">
                <p className="text-red-500 mb-4">Invalid Access. Phone number missing.</p>
                <Link href="/login" className="text-accent hover:underline">Return to Login</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8"
        >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShieldCheck className="text-accent" size={32} />
            </div>

            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                Verify Identity
            </h1>

            <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-widest opacity-60">
                Enter the 6-digit secure code sent to <span className="text-foreground font-bold">{phone}</span>
            </p>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleVerify} className="space-y-8">
                <div className="flex justify-center gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className="w-12 h-14 text-center text-2xl font-bold bg-secondary/50 border border-border rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-xl active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Verify & Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Didn't receive code?{" "}
                    <button
                        onClick={() => alert("Resend functionality not implemented yet.")} // TODO: Implement resend
                        className="text-accent hover:underline decoration-2 ml-1 transition-colors"
                    >
                        Resend Protocol
                    </button>
                </p>
            </div>
        </motion.div>
    );
}

export default function VerifyOTPPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
            <Suspense fallback={<Loader2 className="animate-spin" />}>
                <VerifyOTPContent />
            </Suspense>
        </div>
    );
}
