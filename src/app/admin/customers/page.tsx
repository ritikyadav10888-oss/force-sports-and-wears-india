"use client";

import React from "react";
import Link from "next/link";
import { Search, Filter, UserPlus, Mail, Phone, MapPin, TrendingUp } from "lucide-react";

// Mock customer data
const customers = [
    {
        id: "CUST-001",
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 43210",
        location: "Mumbai, Maharashtra",
        totalOrders: 12,
        totalSpent: 45600,
        joinedDate: "2025-11-15",
        status: "active" as const
    },
    {
        id: "CUST-002",
        name: "Priya Patel",
        email: "priya.patel@email.com",
        phone: "+91 87654 32109",
        location: "Ahmedabad, Gujarat",
        totalOrders: 8,
        totalSpent: 32400,
        joinedDate: "2025-12-03",
        status: "active" as const
    },
    {
        id: "CUST-003",
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        phone: "+91 76543 21098",
        location: "Delhi, NCR",
        totalOrders: 15,
        totalSpent: 67800,
        joinedDate: "2025-10-22",
        status: "active" as const
    },
    {
        id: "CUST-004",
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 65432 10987",
        location: "Bangalore, Karnataka",
        totalOrders: 6,
        totalSpent: 28900,
        joinedDate: "2026-01-08",
        status: "active" as const
    },
    {
        id: "CUST-005",
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "+91 54321 09876",
        location: "Jaipur, Rajasthan",
        totalOrders: 3,
        totalSpent: 12400,
        joinedDate: "2026-01-20",
        status: "inactive" as const
    },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Customers
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                        {customers.length} Total Customers
                    </p>
                </div>
                <Link
                    href="/admin/customers/create"
                    className="px-8 py-4 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                             hover:bg-accent/90 transition-all flex items-center gap-3 w-fit"
                >
                    <UserPlus size={20} />
                    Add Customer
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                 focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                 placeholder:text-muted-foreground/50 uppercase tracking-wider text-sm"
                    />
                </div>
                <button className="px-8 py-5 bg-secondary/50 border border-border rounded-2xl font-black uppercase tracking-wider text-sm
                                 hover:bg-secondary transition-all flex items-center gap-3">
                    <Filter size={20} />
                    Filters
                </button>
            </div>

            {/* Customers Table */}
            <div className="bg-secondary/30 rounded-3xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Customer
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Contact
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Location
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Orders
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Total Spent
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
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-black text-sm">{customer.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{customer.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <Mail size={12} className="text-muted-foreground" />
                                                <span>{customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <Phone size={12} className="text-muted-foreground" />
                                                <span>{customer.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <MapPin size={14} />
                                            <span>{customer.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-sm">{customer.totalOrders}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-green-500" />
                                            <span className="font-black text-sm">₹{customer.totalSpent.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${customer.status === 'active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Link
                                            href={`/admin/customers/${customer.id}`}
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

                {filteredCustomers.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-muted-foreground font-bold uppercase tracking-wider">
                            No customers found matching your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
