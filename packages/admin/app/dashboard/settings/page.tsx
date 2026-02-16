'use client';

import React, { useState } from 'react';
import { Settings, Save, Lock, Monitor, Store, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [storeName, setStoreName] = useState('Force Sports');
    const [currency, setCurrency] = useState('INR');
    const [maintenance, setMaintenance] = useState(false);
    const [reviews, setReviews] = useState(true);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500); // Mock save
    };

    return (
        <div className="p-8 lg:p-12 space-y-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Settings
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Configuration</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Admin Panel</span>
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-accent/30 transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8">
                {/* Store Section */}
                <div className="glass-card p-8 space-y-8 relative overflow-hidden group">
                    <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent">
                            <Store size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">General Store</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Basic Information</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store Name</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="w-full p-4 bg-background/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-bold uppercase tracking-wide"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full p-4 bg-background/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-bold uppercase tracking-wide appearance-none"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Toggles / Features */}
                <div className="glass-card p-8 space-y-8">
                    <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">System Controls</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Feature Flags</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="space-y-1">
                                <h3 className="font-bold uppercase text-sm">Maintenance Mode</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Disable store access for customers</p>
                            </div>
                            <button onClick={() => setMaintenance(!maintenance)} className={`text-2xl transition-colors ${maintenance ? 'text-accent' : 'text-muted-foreground'}`}>
                                {maintenance ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="space-y-1">
                                <h3 className="font-bold uppercase text-sm">Allow Product Reviews</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Enable customers to leave feedback</p>
                            </div>
                            <button onClick={() => setReviews(!reviews)} className={`text-2xl transition-colors ${reviews ? 'text-accent' : 'text-muted-foreground'}`}>
                                {reviews ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account / Security */}
                <div className="glass-card p-8 space-y-8 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Security</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Access Control</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Email</label>
                            <input
                                type="email"
                                value="admin@force-sports.com"
                                disabled
                                className="w-full p-4 bg-background/20 border border-border/30 rounded-xl outline-none font-bold text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full p-4 border border-border/50 rounded-xl font-black uppercase tracking-widest hover:bg-white/5 transition-colors text-xs">
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
