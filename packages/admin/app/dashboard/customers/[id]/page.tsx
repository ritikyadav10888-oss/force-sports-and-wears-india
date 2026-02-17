'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    User, Mail, Phone, Calendar, Package, DollarSign,
    ArrowLeft, ShoppingBag, Clock, MapPin
} from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

export default function CustomerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data = await adminAPI.getCustomer(id);
                setCustomer(data.customer);
            } catch (err: any) {
                setError(err.message || 'Failed to load customer details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCustomer();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="p-12 text-center">
                <div className="text-red-500 font-bold mb-4">{error || 'Customer not found'}</div>
                <button
                    onClick={() => router.back()}
                    className="text-accent underline hover:text-accent/80"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { stats } = customer;

    return (
        <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
            {/* Header / Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Back to Customers</span>
            </button>

            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 p-8 lg:p-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-center">
                    <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <User size={40} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                            {customer.name}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-accent" />
                                {customer.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-accent" />
                                {customer.phone || 'No Phone'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-accent" />
                                Joined {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Spent</span>
                        <DollarSign className="text-green-500 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter">
                        ₹{stats.totalSpent.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Orders</span>
                        <ShoppingBag className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter">
                        {stats.totalOrders}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg. Order Value</span>
                        <DollarSign className="text-purple-500 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter">
                        ₹{Math.round(stats.avgOrderValue).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                    Order History
                </h2>

                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Order ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {customer.orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground font-bold uppercase tracking-widest">
                                        No recent orders
                                    </td>
                                </tr>
                            ) : (
                                customer.orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-accent/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold font-mono">#{order.id.slice(0, 8)}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <Clock size={12} className="text-muted-foreground" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-bold">
                                            ₹{parseFloat(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {order.items?.map((i: any) => `${i.product.name} (x${i.quantity})`).join(', ') || 'Processing...'}
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
