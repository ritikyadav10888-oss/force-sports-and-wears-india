"use client";

import React, { useEffect, useState } from 'react';
import { Bell, Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSupportChat } from '@/components/AdminSupportChat';

const statusStyles: any = {
    'OPEN': 'bg-red-500/10 text-red-500 border-red-500/20',
    'IN_PROGRESS': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'RESOLVED': 'bg-green-500/10 text-green-500 border-green-500/20',
    'CLOSED': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusIcons: any = {
    'OPEN': <AlertCircle size={14} />,
    'IN_PROGRESS': <Clock size={14} />,
    'RESOLVED': <CheckCircle size={14} />,
    'CLOSED': <CheckCircle size={14} />,
};

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getSupportTickets();
            setTickets(data.tickets || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await adminAPI.updateTicketStatus(id, newStatus);
            fetchTickets();
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    if (loading && !tickets.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text text-white">
                        Tickets
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 text-white/60">
                        <span>Support Requests</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Customer Assistance</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            <div className="grid gap-6">
                {tickets.length === 0 ? (
                    <div className="glass-card py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-white/50">
                        No support tickets found. All quiet!
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="glass-card hover:border-accent/30 transition-all duration-300 group bg-white/5 border-white/10 rounded-[2.5rem]">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${statusStyles[ticket.status]}`}>
                                                {statusIcons[ticket.status]} {ticket.status}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-white/40">ID: {ticket.id}</span>
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-accent transition-colors text-white">
                                            {ticket.issueType}
                                        </h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 text-white/60">
                                            <Clock size={12} /> {new Date(ticket.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                                            className="bg-secondary/20 border border-border/50 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/50 outline-none text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                                        >
                                            <option value="OPEN">Open</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>

                                        <button
                                            onClick={() => setSelectedTicketId(ticket.id)}
                                            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                        >
                                            <MessageSquare size={12} /> Reply
                                        </button>

                                        {ticket.orderId && (
                                            <Link
                                                href={`/dashboard/orders/${ticket.orderId}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                            >
                                                <ExternalLink size={12} /> Order Info
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 text-white/40">
                                        <MessageSquare size={12} /> Description
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-white/80">
                                        {ticket.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-6">
                                        {ticket.order && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-white/40">Order Number</p>
                                                <p className="text-sm font-black text-white">{ticket.order.orderNumber}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-white/40">Operative ID</p>
                                            <p className="text-sm font-black text-white">{ticket.userId || 'Guest Agent'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Chat Overlays */}
            <AnimatePresence>
                {selectedTicketId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-2xl"
                        >
                            <AdminSupportChat
                                ticketId={selectedTicketId}
                                onClose={() => setSelectedTicketId(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
