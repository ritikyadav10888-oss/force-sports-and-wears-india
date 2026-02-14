"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/store/useCart";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import { useAuth } from "@/store/useAuth";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { rate, symbol } = useCurrency();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Address state
    const [address, setAddress] = useState({
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "Maharashtra",
        postalCode: user?.address?.postalCode || "",
        country: user?.address?.country || "India"
    });

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Create the order on the backend
            const orderItems = items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: Number(item.price)
            }));

            const orderData = {
                items: orderItems,
                subtotal: Number(subtotal),
                shipping: Number(shipping),
                total: Number(total),
                paymentMethod: "CREDIT_CARD",
                shippingAddress: {
                    name: `${firstName} ${lastName}`,
                    address: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.postalCode,
                    country: address.country,
                    phone: user?.phone || ""
                }
            };

            await api.createOrder(orderData);

            clearCart();
            router.push("/success");
        } catch (err: any) {
            setError(err.message || "Failed to finalize order. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag size={40} className="text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Your Bag is Empty</h1>
                <p className="text-muted-foreground max-w-xs mb-8">Add some elite performance gear to your bag to proceed with checkout.</p>
                <Link href="/" className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-xl">
                    Back to Drops
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:opacity-70 transition-all group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Protocol
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none block">
                            Checkout
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 py-4 px-8 glass rounded-2xl border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-accent" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.35em]">Secure Terminal</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-sm font-black uppercase tracking-widest text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="card p-8 md:p-12 space-y-12"
                        >
                            <section className="space-y-10">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase border-b border-white/5 pb-6">Shipping Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="JOE"
                                            className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="DOE"
                                            className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Universal Address</label>
                                        <input
                                            required
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            placeholder="123 STREET NAME, APARTMENT 4B"
                                            className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">City</label>
                                        <input
                                            required
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            placeholder="MUMBAI"
                                            className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Postal Code</label>
                                        <input
                                            required
                                            type="text"
                                            value={address.postalCode}
                                            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                            placeholder="400001"
                                            className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 uppercase tracking-widest"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-10">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase border-b border-white/5 pb-6">Payment Method</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-8 rounded-2xl border-2 border-accent bg-accent/5 flex items-center justify-between cursor-pointer group/pay">
                                        <div className="flex items-center gap-4">
                                            <CreditCard className="text-accent" />
                                            <span className="font-black italic text-sm tracking-tight">CREDIT / DEBIT CARD</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-accent border-4 border-background shadow-lg" />
                                    </div>
                                    <div className="p-8 rounded-2xl border-2 border-border/50 flex items-center justify-between cursor-not-allowed opacity-20 group/pay grayscale">
                                        <div className="flex items-center gap-4">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" className="h-4 object-contain" alt="UPI" />
                                            <span className="font-black italic text-sm tracking-tight">UPI PAYMENT</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 pt-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Card Number</label>
                                        <input required type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 tracking-[0.2em]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Expiry</label>
                                            <input required type="text" placeholder="MM/YY" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 tracking-widest" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">CVV</label>
                                            <input required type="password" placeholder="***" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:opacity-20 tracking-[0.5em]" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-7 bg-primary text-primary-foreground rounded-2xl font-black text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-6 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <>
                                        INITIATING... <Loader2 className="animate-spin" size={24} />
                                    </>
                                ) : (
                                    <>
                                        COMMIT PURCHASE <Truck size={28} className="group-hover:translate-x-3 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="card p-8 md:p-10 overflow-hidden">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-10 border-b border-white/5 pb-6">Order Protocol</h3>
                                <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 items-center group/item">
                                            <div className="w-24 h-28 bg-secondary rounded-2xl overflow-hidden flex-shrink-0 border border-border transition-transform group-hover/item:scale-105">
                                                <img
                                                    src={item.images?.[0] || item.image || '/placeholder-product.png'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h4 className="font-black italic text-base uppercase leading-tight line-clamp-1 tracking-tight">{item.name}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">{item.category}</span>
                                                    <span className="w-1 h-1 bg-border rounded-full" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">QTY: {item.quantity}</span>
                                                </div>
                                                <p className="font-black text-lg tracking-tighter italic">{formatPrice(item.price * item.quantity, rate, symbol)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-5 pt-10 border-t border-border/10">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                        <span>Subtotal</span>
                                        <span className="text-foreground tracking-tight">{formatPrice(subtotal, rate, symbol)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                        <span>Logistics</span>
                                        <span className="text-accent tracking-tight">{shipping === 0 ? "FREE" : formatPrice(shipping, rate, symbol)}</span>
                                    </div>
                                    <div className="flex justify-between text-4xl font-black italic tracking-tighter pt-8 border-t border-white/5 mt-5">
                                        <span className="uppercase">Total</span>
                                        <span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-[12px]">{formatPrice(total, rate, symbol)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 glass rounded-3xl flex gap-6 items-start border-accent/20">
                                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-accent/20">
                                    <Truck size={24} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Elite Dispatch Guaranteed</p>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider opacity-60">
                                        Free Delivery Over {formatPrice(5000, rate, symbol)} • Global Coverage
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
