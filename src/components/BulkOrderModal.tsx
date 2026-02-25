"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, Package, Wrench, ChevronDown } from "lucide-react";

interface BulkOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: { id: string; name: string } | null;
    defaultType?: "BULK_ORDER" | "CUSTOM_MANUFACTURING";
}

export function BulkOrderModal({ isOpen, onClose, product, defaultType = "BULK_ORDER" }: BulkOrderModalProps) {
    const [type, setType] = useState<"BULK_ORDER" | "CUSTOM_MANUFACTURING">(defaultType);
    const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", quantity: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bulk-inquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    quantity: parseInt(form.quantity),
                    type,
                    productId: product?.id,
                    productName: product?.name,
                }),
            });
            if (!res.ok) throw new Error("Failed to submit");
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); setForm({ name: "", email: "", phone: "", company: "", quantity: "", message: "" }); }, 3000);
        } catch {
            setError("Failed to submit inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                        className="w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex justify-between items-start bg-gradient-to-r from-primary/5 to-accent/5">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight italic">
                                    {type === "BULK_ORDER" ? "Bulk Order Inquiry" : "Custom Manufacturing"}
                                </h2>
                                {product && (
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        For: <span className="text-foreground">{product.name}</span>
                                    </p>
                                )}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {success ? (
                            <div className="p-10 flex flex-col items-center gap-4 text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </motion.div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Inquiry Received!</h3>
                                <p className="text-muted-foreground text-sm">Our team will contact you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                {/* Type toggle */}
                                <div className="flex rounded-xl overflow-hidden border border-border bg-secondary/30 p-1 gap-1">
                                    {[
                                        { value: "BULK_ORDER", label: "Bulk Order", Icon: Package },
                                        { value: "CUSTOM_MANUFACTURING", label: "Custom Mfg.", Icon: Wrench },
                                    ].map(({ value, label, Icon }) => (
                                        <button
                                            key={value} type="button"
                                            onClick={() => setType(value as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${type === value ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                                        >
                                            <Icon size={14} /> {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Full Name *</label>
                                        <input required type="text" value={form.name} onChange={f("name")}
                                            className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium"
                                            placeholder="Rahul Sharma" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Phone *</label>
                                        <input required type="tel" value={form.phone} onChange={f("phone")}
                                            className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium"
                                            placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Email *</label>
                                    <input required type="email" value={form.email} onChange={f("email")}
                                        className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium"
                                        placeholder="you@company.com" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Company / Club</label>
                                        <input type="text" value={form.company} onChange={f("company")}
                                            className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium"
                                            placeholder="Optional" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Quantity *</label>
                                        <input required type="number" min="2" value={form.quantity} onChange={f("quantity")}
                                            className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium"
                                            placeholder="Minimum 2" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        {type === "CUSTOM_MANUFACTURING" ? "Custom Requirements *" : "Additional Details *"}
                                    </label>
                                    <textarea required rows={3} value={form.message} onChange={f("message")}
                                        className="w-full p-2.5 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/50 font-medium resize-none"
                                        placeholder={type === "CUSTOM_MANUFACTURING"
                                            ? "Describe your custom requirements: logo, colors, material, sizes needed..."
                                            : "Any specific requirements, delivery timeline, customization needed..."} />
                                </div>

                                {error && (
                                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button type="submit" disabled={loading}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    {loading ? "Submitting..." : "Submit Inquiry"}
                                </button>

                                <p className="text-[9px] text-muted-foreground text-center">
                                    Our team responds within 24 hours · MOQ varies by product
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
