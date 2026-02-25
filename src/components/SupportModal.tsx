"use client";
import React, { useState } from "react";
import { X, Loader2, Send, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api-client";
import { SupportChat } from "./SupportChat";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: string;
    initialTicketId?: string;
}

export const SupportModal = ({ isOpen, onClose, orderId, initialTicketId }: SupportModalProps) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(initialTicketId || null);
    const [formData, setFormData] = useState({
        issueType: "Defect",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await api.submitSupportTicket({
                orderId,
                ...formData
            });
            setLoading(false);
            setSuccess(true);
            setActiveTicketId(data.ticket.id);
            // Transition to chat after a short delay to show success
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        } catch (error: any) {
            setLoading(false);
            alert(error.message || "Failed to submit support ticket");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-background w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                                    <Send className="text-white" size={20} />
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">
                                    {activeTicketId && !success ? "Secure Comms" : success ? "Request Sent" : "Support Link"}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {activeTicketId && !success ? (
                                <SupportChat
                                    ticketId={activeTicketId}
                                    onBack={() => {
                                        if (!initialTicketId) setActiveTicketId(null);
                                    }}
                                />
                            ) : success ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 px-8">
                                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center animate-bounce">
                                        <Send size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Handshake Complete</h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">
                                            Ticket #{activeTicketId?.slice(-6).toUpperCase()} encoded. <br />
                                            Initializing secure chat session...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {orderId && (
                                            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Target Asset</p>
                                                    <p className="font-bold text-sm">Order #{orderId.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center">
                                                    <AlertCircle size={16} className="text-accent" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Intel Type</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Defect", "Return", "Exchange", "Shipping"].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, issueType: type })}
                                                        className={`p-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.issueType === type
                                                            ? 'bg-foreground text-background border-transparent scale-[0.98]'
                                                            : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Details</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full p-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none font-medium resize-none transition-all"
                                                placeholder="Describe the anomaly..."
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="group w-full py-5 bg-foreground text-background rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 overflow-hidden"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <>
                                                        Initialize Transmission
                                                        <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
