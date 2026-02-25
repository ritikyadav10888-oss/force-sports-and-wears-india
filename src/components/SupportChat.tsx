"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, Clock, AlertCircle, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    content: string;
    senderName: string;
    isAdmin: boolean;
    createdAt: string;
}

interface SupportChatProps {
    ticketId: string;
    onBack?: () => void;
}

export const SupportChat = ({ ticketId, onBack }: SupportChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (silent = false) => {
        try {
            const data = await api.getSupportMessages(ticketId);
            setMessages(data.messages);
            setError(null);
            setIsExpired(false);
        } catch (err: any) {
            if (err.message?.includes("Expired")) {
                setIsExpired(true);
            } else if (!silent) {
                setError("Failed to sync intel.");
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), 3000); // Blinkit-style polling
        return () => clearInterval(interval);
    }, [ticketId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || isExpired) return;

        setSending(true);
        try {
            await api.sendSupportMessage(ticketId, newMessage.trim());
            setNewMessage("");
            fetchMessages(true);
        } catch (err: any) {
            setError(err.message || "Transmission failed.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Establishing Secure Link...</p>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Link Expired</h3>
                    <p className="text-xs text-muted-foreground font-medium px-8 leading-relaxed">
                        Security protocol: Conversation history is purged 24 hours after resolution.
                        Please initiate a new request for further assistance.
                    </p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="py-3 px-8 bg-secondary/50 hover:bg-secondary text-foreground rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        Return to Dashboard
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px]">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <AlertCircle size={32} className="text-accent" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Response...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}
                        >
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                    {msg.isAdmin ? <Shield size={8} className="text-accent" /> : <User size={8} />}
                                    {msg.senderName}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground/50">
                                    {formatDistanceToNow(new Date(msg.createdAt))} ago
                                </span>
                            </div>
                            <div className={`
                                max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed
                                ${msg.isAdmin
                                    ? 'bg-accent/10 border border-accent/20 text-foreground rounded-tl-none'
                                    : 'bg-foreground text-background rounded-tr-none shadow-lg shadow-background/20'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-secondary/10">
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
                        placeholder="Type your message..."
                        className="w-full p-4 pr-14 bg-secondary/30 border border-border rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none font-medium text-sm transition-all"
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
