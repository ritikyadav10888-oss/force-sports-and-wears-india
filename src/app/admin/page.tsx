"use client";

import React from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import { IndianRupee, ShoppingBag, Users, TrendingUp, Package, Clock } from "lucide-react";
import Link from "next/link";

// Mock recent orders data
const recentOrders = [
    {
        id: "ORD-2026-0045",
        customer: "Rahul Sharma",
        items: 3,
        total: 12400,
        status: "confirmed" as const,
        date: "2026-02-12T14:30:00"
    },
    {
        id: "ORD-2026-0044",
        customer: "Priya Patel",
        items: 1,
        total: 4500,
        status: "shipped" as const,
        date: "2026-02-12T11:15:00"
    },
    {
        id: "ORD-2026-0043",
        customer: "Amit Kumar",
        items: 2,
        total: 8900,
        status: "processing" as const,
        date: "2026-02-12T09:45:00"
    },
    {
        id: "ORD-2026-0042",
        customer: "Sneha Reddy",
        items: 4,
        total: 15200,
        status: "delivered" as const,
        date: "2026-02-11T16:20:00"
    },
    {
        id: "ORD-2026-0041",
        customer: "Vikram Singh",
        items: 1,
        total: 2400,
        status: "pending" as const,
        date: "2026-02-11T13:10:00"
    },
];

const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    processing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    shipped: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminDashboard() {
    return (
        <div className="p-8 lg:p-16 space-y-12 bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen">
            {/* Header */}
            <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Live Dashboard</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none 
                               bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                    <span>Force Sports Admin</span>
                    <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                    <span className="text-accent">Control Center</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Today's Revenue"
                    value="₹43,200"
                    icon={IndianRupee}
                    trend={{ value: "12%", isPositive: true }}
                    color="green"
                />
                <StatsCard
                    title="Total Orders"
                    value="156"
                    icon={ShoppingBag}
                    trend={{ value: "8%", isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    title="New Customers"
                    value="24"
                    icon={Users}
                    trend={{ value: "3%", isPositive: false }}
                    color="purple"
                />
                <StatsCard
                    title="Pending Shipments"
                    value="12"
                    icon={Package}
                    color="orange"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-secondary/50 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-black/5">
                <div className="p-10 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-secondary/30 to-transparent">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-8 bg-accent rounded-full" />
                            <h2 className="text-3xl font-black italic uppercase tracking-tight">
                                Recent Orders
                            </h2>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-4">
                            Latest 5 orders • Updated in real-time
                        </p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="px-8 py-4 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-xs
                                 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105"
                    >
                        View All Orders
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/80 backdrop-blur-sm">
                            <tr>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Order ID
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Customer
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Items
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Total
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Status
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Date
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={order.id} className={`border-t border-border/30 hover:bg-accent/5 transition-all duration-200 group ${index % 2 === 0 ? 'bg-background/50' : 'bg-secondary/20'
                                    }`}>
                                    <td className="px-10 py-7">
                                        <span className="font-black text-sm tracking-tight group-hover:text-accent transition-colors">{order.id}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="font-bold text-sm">{order.customer}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg">
                                            <Package size={14} className="text-muted-foreground" />
                                            <span className="font-bold text-sm">{order.items}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="font-black text-base">₹{order.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold">
                                                {new Date(order.date).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-accent font-black text-xs uppercase tracking-[0.15em] hover:underline 
                                                     hover:text-accent/80 transition-colors"
                                        >
                                            View Details →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/orders/create"
                    className="group p-10 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent 
                             border-2 border-accent/20 rounded-3xl hover:border-accent/40 
                             hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 
                             hover:-translate-y-2 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl 
                                  group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 
                                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <ShoppingBag className="text-accent" size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight mb-3 group-hover:text-accent transition-colors">
                            Create Order
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Manually create a new order for phone or walk-in customers
                        </p>
                    </div>
                </Link>

                <Link
                    href="/admin/shipments/create"
                    className="group p-10 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent 
                             border-2 border-orange-500/20 rounded-3xl hover:border-orange-500/40 
                             hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 
                             hover:-translate-y-2 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl 
                                  group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 
                                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Package className="text-orange-500" size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight mb-3 group-hover:text-orange-500 transition-colors">
                            Create Shipment
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Generate tracking for confirmed orders
                        </p>
                    </div>
                </Link>

                <Link
                    href="/admin/notifications"
                    className="group p-10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent 
                             border-2 border-purple-500/20 rounded-3xl hover:border-purple-500/40 
                             hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 
                             hover:-translate-y-2 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl 
                                  group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 
                                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <TrendingUp className="text-purple-500" size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight mb-3 group-hover:text-purple-500 transition-colors">
                            Send Notification
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Notify customers about new products or updates
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
