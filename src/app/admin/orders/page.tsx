"use client";

import React from "react";
import Link from "next/link";
import { Search, Filter, Plus, Download, Clock, User } from "lucide-react";

// Mock orders data
const orders = [
    {
        id: "ORD-2026-0045",
        orderNumber: "ORD-2026-0045",
        customer: { name: "Rahul Sharma", email: "rahul.sharma@email.com" },
        items: 3,
        total: 12400,
        status: "confirmed" as const,
        date: "2026-02-12T14:30:00",
        paymentMethod: "Card"
    },
    {
        id: "ORD-2026-0044",
        orderNumber: "ORD-2026-0044",
        customer: { name: "Priya Patel", email: "priya.patel@email.com" },
        items: 1,
        total: 4500,
        status: "shipped" as const,
        date: "2026-02-12T11:15:00",
        paymentMethod: "Card"
    },
    {
        id: "ORD-2026-0043",
        orderNumber: "ORD-2026-0043",
        customer: { name: "Amit Kumar", email: "amit.kumar@email.com" },
        items: 2,
        total: 8900,
        status: "processing" as const,
        date: "2026-02-12T09:45:00",
        paymentMethod: "UPI"
    },
    {
        id: "ORD-2026-0042",
        orderNumber: "ORD-2026-0042",
        customer: { name: "Sneha Reddy", email: "sneha.reddy@email.com" },
        items: 4,
        total: 15200,
        status: "delivered" as const,
        date: "2026-02-11T16:20:00",
        paymentMethod: "Card"
    },
    {
        id: "ORD-2026-0041",
        orderNumber: "ORD-2026-0041",
        customer: { name: "Vikram Singh", email: "vikram.singh@email.com" },
        items: 1,
        total: 2400,
        status: "pending" as const,
        date: "2026-02-11T13:10:00",
        paymentMethod: "Card"
    },
    {
        id: "ORD-2026-0040",
        orderNumber: "ORD-2026-0040",
        customer: { name: "Ananya Iyer", email: "ananya.iyer@email.com" },
        items: 2,
        total: 7300,
        status: "cancelled" as const,
        date: "2026-02-11T10:05:00",
        paymentMethod: "UPI"
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

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Orders
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                        {orders.length} Total Orders
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-4 bg-secondary/50 border border-border rounded-2xl font-black uppercase tracking-wider text-sm
                                     hover:bg-secondary transition-all flex items-center gap-3">
                        <Download size={20} />
                        Export
                    </button>
                    <Link
                        href="/admin/orders/create"
                        className="px-8 py-4 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                                 hover:bg-accent/90 transition-all flex items-center gap-3"
                    >
                        <Plus size={20} />
                        Create Order
                    </Link>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                 focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                 placeholder:text-muted-foreground/50 uppercase tracking-wider text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-5 bg-secondary/50 border border-border rounded-2xl font-black uppercase tracking-wider text-sm
                             focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-secondary/30 rounded-3xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Order ID
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Customer
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Items
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Total
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Payment
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Date
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-sm tracking-tight">{order.orderNumber}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                                <User size={14} className="text-accent" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{order.customer.name}</p>
                                                <p className="text-xs text-muted-foreground font-medium">{order.customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-sm">{order.items}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-sm">₹{order.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-muted-foreground">{order.paymentMethod}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
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
                                    <td className="px-8 py-6">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-accent font-black text-xs uppercase tracking-wider hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-muted-foreground font-bold uppercase tracking-wider">
                            No orders found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
