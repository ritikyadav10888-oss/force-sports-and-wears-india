'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await adminAPI.getCustomers();
                setCustomers(data.customers || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Residents
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Customer Registry</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">User Directory</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customers.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
                        No customer profiles detected in registry.
                    </div>
                ) : (
                    customers.map((cust) => (
                        <div key={cust.id} className="glass-card p-8 group hover:border-accent/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                                    <Users size={32} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[100px]">ID: {cust.id.split('-')[0]}</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-accent transition-colors">{cust.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground truncate">
                                        <Mail size={14} className="text-accent" /> {cust.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <Calendar size={14} className="text-accent" /> Member Since: {new Date(cust.createdAt).toLocaleDateString()}
                                    </div>
                                    {cust.phone && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Phone size={14} className="text-accent" /> {cust.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/30">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Orders</p>
                                    <p className="text-xl font-black">{cust.totalOrders}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">LTV</p>
                                    <p className="text-xl font-black italic underline decoration-accent/30">₹{cust.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
