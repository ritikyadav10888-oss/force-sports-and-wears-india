"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, Package, MapPin, Clock } from "lucide-react";

// Mock shipments data
const shipments = [
    {
        id: "SHIP-001",
        trackingNumber: "TRK123456789IN",
        orderId: "ORD-2026-0044",
        customer: "Priya Patel",
        carrier: "Blue Dart",
        status: "in_transit" as const,
        origin: "Mumbai, MH",
        destination: "Ahmedabad, GJ",
        estimatedDelivery: "2026-02-15",
        createdAt: "2026-02-12T12:00:00"
    },
    {
        id: "SHIP-002",
        trackingNumber: "TRK987654321IN",
        orderId: "ORD-2026-0042",
        customer: "Sneha Reddy",
        carrier: "Delhivery",
        status: "delivered" as const,
        origin: "Mumbai, MH",
        destination: "Bangalore, KA",
        estimatedDelivery: "2026-02-11",
        createdAt: "2026-02-10T10:30:00"
    },
    {
        id: "SHIP-003",
        trackingNumber: "TRK456789123IN",
        orderId: "ORD-2026-0040",
        customer: "Amit Kumar",
        carrier: "FedEx",
        status: "preparing" as const,
        origin: "Mumbai, MH",
        destination: "Delhi, NCR",
        estimatedDelivery: "2026-02-16",
        createdAt: "2026-02-12T14:00:00"
    },
    {
        id: "SHIP-004",
        trackingNumber: "TRK789123456IN",
        orderId: "ORD-2026-0038",
        customer: "Vikram Singh",
        carrier: "Blue Dart",
        status: "out_for_delivery" as const,
        origin: "Mumbai, MH",
        destination: "Jaipur, RJ",
        estimatedDelivery: "2026-02-13",
        createdAt: "2026-02-11T09:15:00"
    },
];

const statusColors = {
    preparing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    dispatched: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_transit: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    out_for_delivery: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
};

export default function ShipmentsPage() {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredShipments = shipments.filter(shipment =>
        shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Shipments
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                        {shipments.length} Total Shipments
                    </p>
                </div>
                <Link
                    href="/admin/shipments/create"
                    className="px-8 py-4 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                             hover:bg-accent/90 transition-all flex items-center gap-3 w-fit"
                >
                    <Plus size={20} />
                    Create Shipment
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search by tracking number, order ID, or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                             focus:outline-none focus:ring-2 focus:ring-accent transition-all
                             placeholder:text-muted-foreground/50 uppercase tracking-wider text-sm"
                />
            </div>

            {/* Shipments Table */}
            <div className="bg-secondary/30 rounded-3xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Tracking Number
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Order ID
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Customer
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Carrier
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Route
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    ETA
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments.map((shipment) => (
                                <tr key={shipment.id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-accent" />
                                            <span className="font-black text-sm tracking-tight">{shipment.trackingNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Link
                                            href={`/admin/orders/${shipment.orderId}`}
                                            className="font-bold text-sm text-accent hover:underline"
                                        >
                                            {shipment.orderId}
                                        </Link>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-sm">{shipment.customer}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-medium text-sm text-muted-foreground">{shipment.carrier}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <MapPin size={12} />
                                            <span>{shipment.origin} → {shipment.destination}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[shipment.status]}`}>
                                            {shipment.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold">
                                                {new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Link
                                            href={`/admin/shipments/${shipment.id}`}
                                            className="text-accent font-black text-xs uppercase tracking-wider hover:underline"
                                        >
                                            Track
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredShipments.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-muted-foreground font-bold uppercase tracking-wider">
                            No shipments found matching your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
