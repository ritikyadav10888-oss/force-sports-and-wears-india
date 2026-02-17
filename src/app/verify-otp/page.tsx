"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otpParam = searchParams.get("otp");
    const { login: setAuthLogin } = useAuth();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    useEffect(() => {
        if (otpParam && otpParam.length === 6) {
            setOtp(otpParam.split(""));
        }
    }, [otpParam]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            router.push('/?login=true');
        }

        // Focus first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }

        // Timer for resend
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);

        if (inputRefs.current[Math.min(5, pastedData.length - 1)]) {
            inputRefs.current[Math.min(5, pastedData.length - 1)]?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.verifyOtp(email!, otpString);

            // Login success
            setAuthLogin(
                response.user.phone || '',
                'IN',
                '+91',
                {
                    firstName: response.user.name?.split(' ')[0] || '',
                    lastName: response.user.name?.split(' ').slice(1).join(' ') || '',
                    email: response.user.email,
                    // Note: Address might be missing in verification response if not sent.
                    // But usually user object has it if we fetched it.
                    // Here we assume basic user info.
                }
            );

            // Force hard reload to ensure auth state is fresh
            window.location.href = '/account';
        } catch (err: any) {
            setError(err.message || "Invalid OTP. Please try again.");
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendTimer(60);
        setError("");

        try {
            if (email) {
                const response = await api.resendOtp(email);
                setError(response.message || "New code sent");

                // Auto-fill in dev mode
                if (response.user?.otp) {
                    setOtp(response.user.otp.split(""));
                    if (inputRefs.current[5]) {
                        // Focus verification button or last input
                        inputRefs.current[5]?.focus();
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to resend code");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

                    <div className="text-center mb-8">
                        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors mb-6">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                            Verify Email
                        </h1>
                        <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                            Enter the code sent to <span className="text-accent">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-10 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-black bg-secondary/50 border border-border rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all uppercase"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading || otp.join("").length !== 6}
                                className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-xl active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Verify <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendTimer > 0}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
                            >
                                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Verification Code"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
