"use client";

import React from "react";
import Link from "next/link";
import { Send, Mail, Users, Sparkles } from "lucide-react";

export default function NotificationsPage() {
    const [emailSubject, setEmailSubject] = React.useState("");
    const [emailMessage, setEmailMessage] = React.useState("");
    const [recipientType, setRecipientType] = React.useState("all");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock send notification
        alert("Notification sent successfully!");
        setEmailSubject("");
        setEmailMessage("");
    };

    return (
        <div className="p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                    Notifications
                </h1>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                    Send product announcements and updates to customers
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Send Notification Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                            <div className="p-3 bg-accent/10 rounded-2xl">
                                <Sparkles className="text-accent" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tight">
                                    Send Notification
                                </h2>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                    Broadcast to your customers
                                </p>
                            </div>
                        </div>

                        {/* Recipient Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                                Recipients
                            </label>
                            <select
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-full px-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer uppercase tracking-wider text-sm"
                            >
                                <option value="all">All Customers</option>
                                <option value="active">Active Customers Only</option>
                                <option value="recent">Recent Customers (Last 30 Days)</option>
                                <option value="vip">VIP Customers (₹50,000+)</option>
                            </select>
                        </div>

                        {/* Email Subject */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                                Email Subject
                            </label>
                            <input
                                type="text"
                                required
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="NEW DROP: Elite Performance Collection"
                                className="w-full px-6 py-5 bg-secondary/50 border border-border rounded-2xl font-bold
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                         placeholder:text-muted-foreground/50 uppercase tracking-wider"
                            />
                        </div>

                        {/* Email Message */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                                Message
                            </label>
                            <textarea
                                required
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                rows={10}
                                placeholder="Introducing our latest collection of elite performance gear..."
                                className="w-full px-6 py-5 bg-secondary/50 border border-border rounded-2xl font-medium
                                         focus:outline-none focus:ring-2 focus:ring-accent transition-all
                                         placeholder:text-muted-foreground/50 resize-none"
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            className="w-full py-6 bg-accent text-background rounded-2xl font-black uppercase tracking-wider text-sm
                                     hover:bg-accent/90 transition-all flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Send size={20} />
                            Send Notification
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Customers</span>
                                </div>
                                <span className="text-2xl font-black italic">156</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="text-green-500" size={18} />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active</span>
                                </div>
                                <span className="text-2xl font-black italic">142</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mail className="text-purple-500" size={18} />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Sent Today</span>
                                </div>
                                <span className="text-2xl font-black italic">0</span>
                            </div>
                        </div>
                    </div>

                    {/* Templates */}
                    <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tight border-b border-border/50 pb-4">
                            Quick Templates
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setEmailSubject("NEW DROP: Elite Performance Collection");
                                    setEmailMessage("Introducing our latest collection of elite performance gear. Engineered for champions, designed for excellence. Shop now and elevate your game.");
                                }}
                                className="w-full p-4 bg-accent/10 border border-accent/20 rounded-xl text-left hover:bg-accent/20 transition-all"
                            >
                                <p className="font-black text-sm uppercase tracking-tight">New Product Launch</p>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Announce new arrivals</p>
                            </button>
                            <button
                                onClick={() => {
                                    setEmailSubject("EXCLUSIVE SALE: 20% OFF Everything");
                                    setEmailMessage("Limited time offer! Get 20% off on all Force Sports gear. Use code FORCE20 at checkout. Offer valid for 48 hours only.");
                                }}
                                className="w-full p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-left hover:bg-green-500/20 transition-all"
                            >
                                <p className="font-black text-sm uppercase tracking-tight">Sale Announcement</p>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Promote special offers</p>
                            </button>
                            <button
                                onClick={() => {
                                    setEmailSubject("BACK IN STOCK: Your Favorites Return");
                                    setEmailMessage("Great news! Popular items are back in stock. Don't miss out this time. Shop your favorites before they're gone again.");
                                }}
                                className="w-full p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-left hover:bg-purple-500/20 transition-all"
                            >
                                <p className="font-black text-sm uppercase tracking-tight">Restock Alert</p>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Notify about restocks</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
