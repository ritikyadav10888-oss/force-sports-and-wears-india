"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, TrendingUp, Edit, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

// Mock customer detail data
const customerData = {
    id: "CUST-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    address: {
        street: "123, MG Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400058",
        country: "India"
    },
    totalOrders: 12,
    totalSpent: 45600,
    joinedDate: "2025-11-15",
    status: "active" as const,
    recentOrders: [
        {
            id: "ORD-2026-0045",
            date: "2026-02-12",
            items: 3,
            total: 12400,
            status: "confirmed"
        },
        {
            id: "ORD-2026-0038",
            date: "2026-02-08",
            items: 2,
            total: 8900,
            status: "delivered"
        },
        {
            id: "ORD-2026-0031",
            date: "2026-02-01",
            items: 1,
            total: 4500,
            status: "delivered"
        },
    ]
};

export default function CustomerDetailPage() {
    const params = useParams();

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <Link
                        href="/admin/customers"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent hover:opacity-70 transition-all"
                    >
                        <ArrowLeft size={14} />
                        Back to Customers
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        {customerData.name}
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                        Customer ID: {customerData.id}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-accent/10 border border-accent/20 text-accent rounded-xl font-black uppercase tracking-wider text-xs
                                     hover:bg-accent/20 transition-all flex items-center gap-2">
                        <Edit size={16} />
                        Edit
                    </button>
                    <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-black uppercase tracking-wider text-xs
                                     hover:bg-red-500/20 transition-all flex items-center gap-2">
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                                    <p className="font-bold text-sm">{customerData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                                    <p className="font-bold text-sm">{customerData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Address</p>
                                    <p className="font-bold text-sm leading-relaxed">
                                        {customerData.address.street}<br />
                                        {customerData.address.city}, {customerData.address.state}<br />
                                        {customerData.address.postalCode}, {customerData.address.country}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Joined</p>
                                    <p className="font-bold text-sm">
                                        {new Date(customerData.joinedDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Statistics
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Orders</span>
                                </div>
                                <span className="text-2xl font-black italic">{customerData.totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-green-500" size={18} />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Spent</span>
                                </div>
                                <span className="text-2xl font-black italic">₹{customerData.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg Order Value</span>
                                <span className="text-2xl font-black italic">₹{Math.round(customerData.totalSpent / customerData.totalOrders).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary/30 rounded-3xl border border-border/50 overflow-hidden">
                        <div className="p-8 border-b border-border/50">
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">
                                Order History
                            </h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                                Recent {customerData.recentOrders.length} orders
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Order ID
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Date
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Items
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Total
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerData.recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="font-black text-sm tracking-tight">{order.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-sm text-muted-foreground">
                                                    {new Date(order.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-sm">{order.items}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-sm">₹{order.total.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${order.status === 'delivered'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-accent font-black text-xs uppercase tracking-wider hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
