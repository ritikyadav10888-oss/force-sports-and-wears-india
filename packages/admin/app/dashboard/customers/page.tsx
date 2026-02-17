import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ArrowUpRight, Loader2, DollarSign } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const router = useRouter();
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

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">User ID</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Customer</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Contact</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Since</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Stats</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-10 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
                                    No customer profiles found.
                                </td>
                            </tr>
                        ) : (
                            customers.map((cust) => (
                                <tr
                                    key={cust.id}
                                    onClick={() => router.push(`/dashboard/customers/${cust.id}`)}
                                    className="hover:bg-accent/5 transition-all cursor-pointer group"
                                >
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                                                <Users size={18} />
                                            </div>
                                            <span className="text-sm font-black text-muted-foreground uppercase">{cust.id.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black italic uppercase tracking-tighter group-hover:text-accent transition-colors">{cust.name}</span>
                                            {cust.phone && (
                                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                    <Phone size={10} /> {cust.phone}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Mail size={14} className="text-accent" /> {cust.email}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Calendar size={14} /> {new Date(cust.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Orders</div>
                                                <div className="text-sm font-black">{cust.totalOrders}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Spent</div>
                                                <div className="text-sm font-black italic text-green-500">₹{cust.totalSpent.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
