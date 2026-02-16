"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { api } from "@/lib/api-client";
import { Loader2, Package, User as UserIcon, Calendar, MapPin, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: string;
        product: {
            name: string;
            images: string[];
        };
    }[];
}

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await api.getMyOrders();
                setOrders(data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/20 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">
                            My Account
                        </h1>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Manage your profile and orders
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                        className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-xl shadow-black/5 h-fit">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                                <UserIcon size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                    <UserIcon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                                    <p className="font-medium">{user?.dialCode} {user?.phone}</p>
                                </div>
                            </div>

                            {user?.address && (
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</p>
                                        <p className="font-medium">
                                            {user.address.street}, {user.address.city}, {user.address.state} {user.address.postalCode}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="text-accent" />
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">Order History</h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-background rounded-3xl p-12 text-center border border-border/50">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package className="text-muted-foreground" size={40} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                                <p className="text-muted-foreground mb-8">Start shopping to see your orders here.</p>
                                <Link
                                    href="/"
                                    className="inline-block px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-background rounded-3xl p-6 border border-border/50 hover:border-accent/50 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-accent">{order.orderNumber}</span>
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                                                        ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                          order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                          'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar size={14} />
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</p>
                                                <p className="text-xl font-black">₹{Number(order.total).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-xl">
                                                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                        {/* Ensure image exists or fallback */}
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={item.product?.images?.[0] || '/placeholder.png'}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{item.product?.name}</p>
                                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
