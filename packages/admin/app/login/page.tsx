'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/admin-api-client';
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await adminAPI.login(email, password);
            if (response.user.role !== 'ADMIN') {
                setError('Access denied. Admin privileges required.');
                localStorage.removeItem('admin_token');
                return;
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-48 -mb-48 animate-pulse" />

            <div className="w-full max-w-xl relative">
                {/* Logo & Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex p-4 bg-accent/10 border border-accent/20 rounded-3xl mb-4 group hover:scale-110 transition-transform duration-500">
                        <Shield className="text-accent" size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
                        Force<span className="text-accent">Admin</span>
                    </h1>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-[0.4em]">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-accent transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white px-14 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-white/20 font-bold"
                                    placeholder="ADMIN EMAIL"
                                />
                            </div>

                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-accent transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white px-14 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-white/20 font-bold"
                                    placeholder="PASSWORD"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-12 flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <span className="flex items-center gap-2 underline decoration-accent/30 decoration-2">Secure Connection</span>
                    <span className="flex items-center gap-2 underline decoration-accent/30 decoration-2">Restricted Access</span>
                </div>
            </div>
        </div>
    );
}
