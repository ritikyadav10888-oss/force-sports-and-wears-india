'use client';

import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Users, Package, Clock, TrendingUp, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';
import { adminAPI } from '@/lib/admin-api-client';

const statusColors: any = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PROCESSING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    SHIPPED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function DashboardPage() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, customersData, productsData] = await Promise.all([
                    adminAPI.getOrders(),
                    adminAPI.getCustomers(),
                    adminAPI.getProducts()
                ]);

                const orders = ordersData.orders || [];
                const revenue = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);

                setStats({
                    revenue,
                    orders: orders.length,
                    customers: (customersData.customers || []).length,
                    products: (productsData.products || []).length
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 space-y-12">
            {/* Top Bar / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">System Online</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Force Sports Admin</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Administration</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today</span>
                        <span className="text-sm font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={IndianRupee}
                    trend={{ value: "Live", isPositive: true }}
                    color="green"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingBag}
                    trend={{ value: "All Time", isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    title="Customers"
                    value={stats.customers}
                    icon={Users}
                    trend={{ value: "Active", isPositive: true }}
                    color="purple"
                />
                <StatsCard
                    title="Products"
                    value={stats.products}
                    icon={Package}
                    color="orange"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 glass-card overflow-hidden">
                    <div className="p-8 border-b border-border/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-1">
                                Recent Orders
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Latest transactions
                            </p>
                        </div>
                        <Link href="/dashboard/orders" className="text-xs font-black uppercase tracking-widest text-accent hover:underline decoration-2">
                            View All Orders →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">ID</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Customer</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Total</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">No recent orders found.</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-border/20 hover:bg-accent/5 transition-colors group">
                                            <td className="px-8 py-5 text-sm font-black tracking-tight">{order.orderNumber}</td>
                                            <td className="px-8 py-5 text-sm font-bold">{order.user?.name || 'Guest'}</td>
                                            <td className="px-8 py-5 text-sm font-black">₹{Number(order.total).toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusColors[order.status] || statusColors.PENDING}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card p-8 flex-1">
                        <h2 className="text-xl font-black italic uppercase tracking-tight mb-6 flex items-center gap-3">
                            <TrendingUp className="text-accent" size={20} />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Add Product', icon: Package, href: '/dashboard/products' },
                                { label: 'Shipments', icon: ArrowUpRight, href: '/dashboard/shipments' },
                                { label: 'Customers', icon: Users, href: '/dashboard/customers' },
                            ].map((action) => (
                                <Link key={action.label} href={action.href}
                                    className="flex items-center justify-between p-4 bg-white border border-border/50 rounded-2xl hover:border-accent/50 hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-accent/5 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                                            <action.icon size={18} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                                    </div>
                                    <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-accent transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-accent p-8 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 relative">Support</h3>
                        <p className="text-xs font-bold text-white/70 mb-6 relative">Analytics and reports are ready.</p>
                        <button className="w-full py-4 bg-white text-accent rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform relative">
                            System Status: Good
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
