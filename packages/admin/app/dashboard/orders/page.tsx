'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Filter, Download, Plus, MoreHorizontal, Eye, Clock, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

const statusColors: any = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PROCESSING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    SHIPPED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await adminAPI.getOrders();
                setOrders(data.orders || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
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
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Orders
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Transaction Management</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Monitor Station</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-border/50 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-accent/30 transition-all hover:scale-105">
                        <Plus size={14} /> New Order
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH ORDERS (ID, CUSTOMER, EMAIL)..."
                        className="w-full bg-white/50 border border-border/30 rounded-xl px-12 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/50 transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            {/* Orders Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Order Number</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Customer Info</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Amount</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Date</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-10 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
                                        No transactions recorded in database.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-accent/5 transition-all group">
                                        <td className="px-10 py-7">
                                            <span className="font-black text-sm tracking-tight group-hover:text-accent transition-colors">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-sm tracking-tight">{order.user?.name || 'Guest User'}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium lowercase italic">{order.user?.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 font-black text-base">₹{Number(order.total).toLocaleString()}</td>
                                        <td className="px-10 py-7">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${statusColors[order.status] || statusColors.PENDING}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 font-bold text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2">
                                                <button className="p-3 bg-white border border-border/50 rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-all">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-3 bg-white border border-border/50 rounded-xl hover:bg-muted transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
