"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Clock, MapPin, Truck, CreditCard, ChevronRight, Download } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const data = await api.getOrder(id as string);
                if (data.order) {
                    setOrder(data.order);
                } else {
                    setError("Order not found");
                }
            } catch (err: any) {
                console.error("Failed to fetch order:", err);
                setError(err.message || "Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrder();
        } else {
            // Wait slightly for auth check, though middleware might handle it?
            // Client-side fallback
            const timer = setTimeout(() => {
                if (!isAuthenticated) router.push('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [id, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading Order Details...
                </p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-black italic uppercase text-red-500 mb-4">Error</h1>
                <p className="text-muted-foreground mb-8">{error || "Order not found"}</p>
                <Link href="/account" className="px-8 py-3 bg-foreground text-background rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Account
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'SHIPPED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'PROCESSING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-muted-foreground bg-secondary border-border';
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/account" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-4">
                            <ArrowLeft size={14} /> Back to Orders
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
                            Order <span className="text-accent">#{order.orderNumber}</span>
                        </h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <Clock size={12} /> Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className={`px-6 py-3 rounded-full border ${getStatusColor(order.status)} font-black uppercase tracking-widest text-xs inline-flex items-center gap-2`}>
                        <Package size={14} /> {order.status}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Items) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <div className="bg-secondary/30 border border-border/50 rounded-3xl p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                            <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                                <Package size={20} className="text-accent" /> Items ({order.items.length})
                            </h2>
                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 md:gap-6 items-start group">
                                        <div className="w-20 h-24 bg-background rounded-xl overflow-hidden border border-border flex-shrink-0 group-hover:border-accent/50 transition-colors">
                                            {/* Image placeholder if product images exist */}
                                            {item.product.images && item.product.images[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg md:text-xl leading-tight truncate">{item.product.name}</h3>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                                                Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-lg">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipment Info */}
                        {order.shipment && (
                            <div className="bg-secondary/30 border border-border/50 rounded-3xl p-8">
                                <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                                    <Truck size={20} className="text-accent" /> Shipment Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Carrier</p>
                                        <p className="font-bold">{order.shipment.carrier}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tracking Number</p>
                                        <p className="font-bold font-mono text-accent">{order.shipment.trackingNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                        <p className="font-bold">{order.shipment.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Estimated Delivery</p>
                                        <p className="font-bold">{formatDate(order.shipment.estimatedDate)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Summary & Address) */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-secondary/30 border border-border/50 rounded-3xl p-8">
                            <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                                <MapPin size={20} className="text-accent" /> Delivery To
                            </h2>
                            {order.shippingAddress ? (
                                <div className="space-y-1 text-sm">
                                    <p className="font-bold text-lg">{order.shippingAddress.name}</p>
                                    <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                    <p className="text-muted-foreground">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    </p>
                                    <p className="text-muted-foreground font-medium mt-2">{order.shippingAddress.country}</p>
                                    <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
                                        <span className="text-accent">📞</span> {order.shippingAddress.phone}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">No shipping address provided</p>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-secondary/30 border border-border/50 rounded-3xl p-8">
                            <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                                <CreditCard size={20} className="text-accent" /> Payment
                            </h2>

                            <div className="space-y-4 text-sm border-b border-border/50 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">Subtotal</span>
                                    <span className="font-bold">₹{Number(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">Shipping</span>
                                    <span className="font-bold">
                                        {Number(order.shipping) > 0 ? `₹${Number(order.shipping).toLocaleString()}` : "Free"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-widest text-sm">Total</span>
                                <span className="font-black text-2xl text-accent">₹{Number(order.total).toLocaleString()}</span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Payment Method</p>
                                <p className="font-bold capitalize">{order.paymentMethod}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <button className="w-full py-4 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 group">
                            <Download size={16} /> Download Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
