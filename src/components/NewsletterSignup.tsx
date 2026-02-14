"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export const NewsletterSignup = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setStatus("error");
            setMessage("Please enter a valid email address");
            return;
        }

        // TODO: Implement actual email collection logic (e.g., API call to backend)
        // For now, simulate success
        setStatus("success");
        setMessage("You're in! Check your inbox for exclusive drops.");
        setEmail("");

        // Reset after 5 seconds
        setTimeout(() => {
            setStatus("idle");
            setMessage("");
        }, 5000);
    };

    return (
        <section className="py-32 px-6 bg-gradient-to-br from-accent/5 via-background to-secondary/20 border-y border-border/50">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 rounded-full border border-accent/20">
                        <Mail className="w-5 h-5 text-accent" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Exclusive Access</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Never Miss<br />A Drop
                    </h2>

                    <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        Be the first to know about new product launches, limited editions, and exclusive athlete collaborations.
                        Join the elite Force Sports community.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-8 py-6 bg-background border-2 border-border rounded-2xl font-bold text-lg 
                                     focus:outline-none focus:border-accent transition-all duration-300
                                     placeholder:text-muted-foreground/50 placeholder:font-medium"
                            disabled={status === "success"}
                        />
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "success"}
                        className="w-full bg-accent hover:bg-accent/90 text-background font-black uppercase tracking-[0.2em] 
                                 py-6 rounded-2xl transition-all duration-300 text-sm
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {status === "success" ? "Subscribed!" : "Join the Movement"}
                    </button>

                    {status !== "idle" && (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${status === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-600"
                                : "bg-red-500/10 border-red-500/20 text-red-600"
                            }`}>
                            {status === "success" ? (
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            <p className="font-bold text-sm">{message}</p>
                        </div>
                    )}
                </form>

                <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    No spam. Unsubscribe anytime. Your data is protected.
                </p>
            </div>
        </section>
    );
};
