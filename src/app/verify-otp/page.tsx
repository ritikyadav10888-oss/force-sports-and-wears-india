"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyOTPPage() {
    const router = useRouter();

    useEffect(() => {
        // This page is legacy. Redirecting to consolidated Secure Login.
        const timer = setTimeout(() => {
            router.push('/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Loader2 className="animate-spin text-accent" size={32} />
                </div>

                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                    Security Update
                </h1>

                <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-widest opacity-60">
                    We've upgraded our authentication protocol for enhanced security. Redirecting you to the Secure Member Portal...
                </p>

                <div className="pt-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:opacity-70 transition-all group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Go to Portal Now
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
