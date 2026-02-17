"use client";
import React, { useState } from "react";
import { X, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: string;
}

export const SupportModal = ({ isOpen, onClose, orderId }: SupportModalProps) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        issueType: "Defect",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Support Ticket Submitted:", { orderId, ...formData });
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ issueType: "Defect", description: "" });
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-background w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">
                                {success ? "Request Sent" : "Support Request"}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight">We're On It!</h3>
                                    <p className="text-muted-foreground font-medium">
                                        Your support ticket for Order #{orderId?.slice(-6)} has been created. <br />
                                        Our team will contact you shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {orderId && (
                                        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order Context</p>
                                            <p className="font-bold text-sm">Order #{orderId}</p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Issue Type</label>
                                        <select
                                            value={formData.issueType}
                                            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                            className="w-full p-4 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-bold text-sm"
                                        >
                                            <option value="Defect">Damaged / Defective Item</option>
                                            <option value="Return">Return Request</option>
                                            <option value="Exchange">Exchange Request</option>
                                            <option value="Shipping">Shipping Issue</option>
                                            <option value="Other">Other Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-4 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium resize-none"
                                            placeholder="Please describe the issue in detail..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-foreground text-background rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Submit Ticket"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
