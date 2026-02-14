"use client";

import React from "react";
import { useAdminAuth } from "@/store/useAdminAuth";
import { Lock, Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const { login } = useAdminAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const success = login(email, password);

            if (success) {
                router.push("/admin");
            } else {
                setError("Invalid email or password");
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-3xl mb-4">
                        <Lock className="text-background" size={40} />
                    </div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                        Admin Login
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Force Sports Control Center
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-sm font-bold text-red-500 text-center uppercase tracking-wider">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@force.com"
                                className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                         placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                         placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                                 hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isLoading ? "Logging in..." : "Login to Admin Panel"}
                    </button>

                    {/* Demo Credentials */}
                    <div className="pt-6 border-t border-border/50">
                        <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wider mb-3">
                            Demo Credentials
                        </p>
                        <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                            <p className="text-xs font-medium">
                                <span className="text-muted-foreground">Email:</span> admin@force.com
                            </p>
                            <p className="text-xs font-medium">
                                <span className="text-muted-foreground">Password:</span> admin123
                            </p>
                        </div>
                    </div>
                </form>

                {/* Back to Store */}
                <div className="text-center">
                    <a
                        href="/"
                        className="text-sm font-bold text-accent hover:underline uppercase tracking-wider"
                    >
                        ← Back to Store
                    </a>
                </div>
            </div>
        </div>
    );
}
