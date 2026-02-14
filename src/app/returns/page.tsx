import React from "react";
import { Truck, RotateCcw, Package, ShieldCheck } from "lucide-react";

export default function ShippingReturnsPage() {
    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">Fulfillment</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">LOGISTICS • RETURNS • EXCHANGES</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-secondary/30 rounded-[3rem] border border-border/50 space-y-6">
                        <Truck className="text-accent" size={40} />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Shipping</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Elite logistics across India. Standard delivery arrives in 2-4 business days. Express shipping options available at checkout.
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            Live Tracking Protocol
                        </div>
                    </div>
                    <div className="p-10 bg-secondary/30 rounded-[3rem] border border-border/50 space-y-6">
                        <RotateCcw className="text-accent" size={40} />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Returns</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Zero compromises. 30-day return window for all elite gear in original condition. Complimentary return shipping on exchanges.
                        </p>
                    </div>
                </div>

                <section className="space-y-12 pt-16 border-t border-border/50">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Common Inquiries</h2>
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-lg font-black italic uppercase mb-2">How do I track my drop?</h4>
                            <p className="text-muted-foreground font-medium">Once dispatched, a tracking protocol link will be sent to your elite member email.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-black italic uppercase mb-2">International Shipping</h4>
                            <p className="text-muted-foreground font-medium">Currently, Force Sports & Wears India focus is on the subcontinent. Stay tuned for global expansion.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
