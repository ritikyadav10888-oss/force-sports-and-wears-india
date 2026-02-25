'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    CreditCard,
    MapPin,
    User,
    Clock,
    CheckCircle,
    Loader2,
    Calendar,
    Phone,
    Mail,
    AlertCircle
} from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

const statusColors: any = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PROCESSING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    SHIPPED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getOrder(id);
            setOrder(data.order);
        } catch (err: any) {
            setError(err.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdating(true);
            await adminAPI.updateOrderStatus(id, newStatus);
            await fetchOrder();
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-12 text-center space-y-4">
                <AlertCircle className="mx-auto text-red-500" size={64} />
                <div className="text-xl font-black uppercase tracking-widest text-red-500">{error || 'Order not found'}</div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-accent text-white rounded-xl font-black uppercase tracking-widest text-xs"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
            {/* Header / Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Orders</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                            {order.orderNumber}
                        </h1>
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${statusColors[order.status]}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                        className="px-6 py-4 bg-white border border-border/50 rounded-2xl font-black uppercase tracking-widest text-[10px] focus:outline-none focus:ring-2 focus:ring-accent/50 outline-none disabled:opacity-50"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 border-b border-border/30 flex items-center justify-between bg-secondary/10">
                            <div className="flex items-center gap-3">
                                <Package size={20} className="text-accent" />
                                <h2 className="text-lg font-black italic uppercase tracking-tight">Order Items</h2>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{order.items.length} Units</span>
                        </div>
                        <div className="divide-y divide-border/30">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-accent/[0.02] transition-colors">
                                    <div className="w-20 h-20 bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-border/30">
                                        {item.product.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <Package className="text-muted-foreground/20" size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors">{item.product.name}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category: {item.product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Price</div>
                                        <div className="font-black">₹{parseFloat(item.price).toLocaleString()} <span className="text-accent ml-1 italic text-[10px]">x{item.quantity}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-secondary/5 space-y-4">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-white">₹{parseFloat(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Shipping</span>
                                <span className="text-white">₹{parseFloat(order.shipping).toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-border/30 flex justify-between items-end">
                                <span className="text-sm font-black uppercase tracking-tighter italic">Total Amount</span>
                                <span className="text-3xl font-black italic tracking-tighter text-accent">₹{parseFloat(order.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="glass-card">
                        <div className="p-6 border-b border-border/30 flex items-center justify-between bg-blue-500/5">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-blue-500" />
                                <h3 className="font-black italic uppercase tracking-tight">Customer</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-background/50 rounded-2xl border border-border/30 space-y-2">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Registered User</div>
                                    <div className="font-black text-lg italic uppercase">{order.user.name}</div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground group">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
                                            <Mail size={14} className="text-accent" />
                                        </div>
                                        <span className="truncate">{order.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground group">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
                                            <Phone size={14} className="text-accent" />
                                        </div>
                                        <span>{order.user.phone || 'No phone provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground group">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
                                            <Calendar size={14} className="text-accent" />
                                        </div>
                                        <span>Order placed {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="glass-card">
                        <div className="p-6 border-b border-border/30 flex items-center justify-between bg-orange-500/5">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-orange-500" />
                                <h3 className="font-black italic uppercase tracking-tight">Shipping</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-background/50 rounded-2xl border border-border/30 space-y-2">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Delivery Address</div>
                                    <div className="text-sm font-bold text-white leading-relaxed">
                                        {order.shippingAddress.name}<br />
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                        {order.shippingAddress.country}
                                    </div>
                                </div>

                                <div className="p-4 bg-background/50 rounded-2xl border border-border/30 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Method</div>
                                            <div className="text-xs font-black uppercase tracking-wider">{order.paymentMethod}</div>
                                        </div>
                                        <CreditCard size={20} className="text-muted-foreground/30" />
                                    </div>
                                    <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Payment Status</div>
                                        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                            {order.paymentStatus}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
