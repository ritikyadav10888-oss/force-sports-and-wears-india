"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, Clock, AlertCircle, User, Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI } from "@/lib/admin-api-client";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    content: string;
    senderName: string;
    isAdmin: boolean;
    createdAt: string;
}

interface AdminSupportChatProps {
    ticketId: string;
    onClose: () => void;
}

export const AdminSupportChat = ({ ticketId, onClose }: AdminSupportChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (silent = false) => {
        try {
            const data = await adminAPI.getSupportMessages(ticketId);
            setMessages(data.messages);
            setError(null);
        } catch (err: any) {
            if (!silent) setError("Failed to fetch logs.");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), 3000);
        return () => clearInterval(interval);
    }, [ticketId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await adminAPI.sendSupportMessage(ticketId, newMessage.trim());
            setNewMessage("");
            fetchMessages(true);
        } catch (err: any) {
            setError(err.message || "Failed to transmit message.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                        <Shield className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">Secure Support Terminal</h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {ticketId.slice(-12).toUpperCase()}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Encrypted Data...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <AlertCircle size={32} className="text-accent" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">No previous logs found.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}
                        >
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${msg.isAdmin ? 'text-accent' : 'text-muted-foreground'}`}>
                                    {msg.isAdmin ? <Shield size={8} /> : <User size={8} />}
                                    {msg.senderName}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground/50">
                                    {formatDistanceToNow(new Date(msg.createdAt))} ago
                                </span>
                            </div>
                            <div className={`
                                max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed
                                ${msg.isAdmin
                                    ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-accent/20'
                                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-white/5">
                {error && (
                    <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">
                        <AlertCircle size={10} />
                        {error}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type reply to mission control..."
                        className="w-full p-4 pr-14 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none font-medium text-sm transition-all text-white"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-accent text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-accent/20"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
};
