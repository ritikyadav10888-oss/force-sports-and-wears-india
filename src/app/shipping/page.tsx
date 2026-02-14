import React from "react";
import { Truck, RotateCcw, Package, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">Shipping</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">LOGISTICS • FULFILLMENT PROTOCOL</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-secondary/30 rounded-[3rem] border border-border/50 space-y-6">
                        <Truck className="text-accent" size={40} />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Delivery</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Elite logistics across India. Standard delivery arrives in 2-4 business days. Express shipping options available at checkout.
                        </p>
                    </div>
                    <div className="p-10 bg-secondary/30 rounded-[3rem] border border-border/50 space-y-6">
                        <Package className="text-accent" size={40} />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Tracking</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Once dispatched, a tracking protocol link will be sent to your elite member email for real-time monitoring.
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50">
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        * Force Sports & Wears India focuses on the subcontinent. Currently providing professional-grade fulfillment within India. Stay tuned for global expansion.
                    </p>
                </div>
            </div>
        </main>
    );
}
