"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Package, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";

// Mock order detail data
const orderData = {
    id: "ORD-2026-0045",
    orderNumber: "ORD-2026-0045",
    customer: {
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 43210"
    },
    shippingAddress: {
        street: "123, MG Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400058",
        country: "India"
    },
    items: [
        {
            id: "1",
            name: "Apex Precision Oversized Tee",
            price: 2400,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400"
        },
        {
            id: "3",
            name: "Echelon Tactical Hoodie",
            price: 4500,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400"
        },
        {
            id: "2",
            name: "Vantage Stealth Logo Cap",
            price: 1800,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=400"
        }
    ],
    subtotal: 11100,
    shipping: 0,
    total: 11100,
    paymentMethod: "Card",
    paymentStatus: "completed",
    status: "confirmed" as const,
    createdAt: "2026-02-12T14:30:00",
    timeline: [
        { status: "Order Placed", date: "2026-02-12T14:30:00", completed: true },
        { status: "Payment Confirmed", date: "2026-02-12T14:31:00", completed: true },
        { status: "Processing", date: "2026-02-12T15:00:00", completed: true },
        { status: "Shipped", date: "", completed: false },
        { status: "Delivered", date: "", completed: false },
    ]
};

const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    processing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    shipped: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrderDetailPage() {
    const params = useParams();
    const [selectedStatus, setSelectedStatus] = React.useState(orderData.status);

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent hover:opacity-70 transition-all"
                    >
                        <ArrowLeft size={14} />
                        Back to Orders
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        {orderData.orderNumber}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border ${statusColors[orderData.status]}`}>
                            {orderData.status}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                            {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
                <Link
                    href="/admin/shipments/create"
                    className="px-6 py-3 bg-accent text-background rounded-xl font-black uppercase tracking-wider text-xs
                             hover:bg-accent/90 transition-all flex items-center gap-2"
                >
                    <Truck size={16} />
                    Create Shipment
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-secondary/30 rounded-3xl border border-border/50 overflow-hidden">
                        <div className="p-8 border-b border-border/50">
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">
                                Order Items
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            {orderData.items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center pb-6 border-b border-border/30 last:border-0 last:pb-0">
                                    <div className="w-24 h-24 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-lg uppercase tracking-tight mb-2">{item.name}</h3>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-muted-foreground font-medium">Qty: {item.quantity}</span>
                                            <span className="w-1 h-1 bg-border rounded-full" />
                                            <span className="font-black">₹{item.price.toLocaleString()} each</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-2xl italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 border-t border-border/50 space-y-4">
                            <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground">₹{orderData.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-accent">{orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping.toLocaleString()}`}</span>
                            </div>
                            <div className="flex justify-between text-3xl font-black italic pt-4 border-t border-border/50">
                                <span className="uppercase">Total</span>
                                <span className="text-accent">₹{orderData.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight mb-8">
                            Order Timeline
                        </h2>
                        <div className="space-y-6">
                            {orderData.timeline.map((event, index) => (
                                <div key={index} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed ? 'bg-accent text-background' : 'bg-secondary border-2 border-border'
                                            }`}>
                                            {event.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 bg-border rounded-full" />}
                                        </div>
                                        {index < orderData.timeline.length - 1 && (
                                            <div className={`w-0.5 h-12 ${event.completed ? 'bg-accent' : 'bg-border'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <h3 className="font-black text-sm uppercase tracking-tight mb-1">{event.status}</h3>
                                        {event.date && (
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {new Date(event.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Update Status */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Update Status
                        </h2>
                        <div className="space-y-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as any)}
                                className="w-full px-6 py-4 bg-secondary/50 border border-border rounded-2xl font-bold
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer uppercase tracking-wider text-sm"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button className="w-full px-6 py-4 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                                             hover:bg-accent/90 transition-all">
                                Update Status
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Customer
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Name</p>
                                    <p className="font-bold text-sm">{orderData.customer.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                                    <p className="font-bold text-sm">{orderData.customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-accent mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                                    <p className="font-bold text-sm">{orderData.customer.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Shipping Address
                        </h2>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-accent mt-1" size={18} />
                            <p className="font-bold text-sm leading-relaxed">
                                {orderData.shippingAddress.street}<br />
                                {orderData.shippingAddress.city}, {orderData.shippingAddress.state}<br />
                                {orderData.shippingAddress.postalCode}<br />
                                {orderData.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Payment
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Method</span>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-accent" />
                                    <span className="font-black text-sm">{orderData.paymentMethod}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                                    {orderData.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
