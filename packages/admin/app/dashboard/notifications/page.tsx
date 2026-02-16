'use client';

import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const alerts = [
    {
        id: 1,
        type: 'critical',
        title: 'Low Stock Allocation',
        message: 'Pro Cricket Bat (SKU-1029) is below reorder level (2 units remaining). Immediate restock advised.',
        time: '2 mins ago',
    },
    {
        id: 2,
        type: 'info',
        title: 'New Order Received',
        message: 'Order #ORD-2024-001 has been placed by Customer (Ritwik). Value: ₹12,500.',
        time: '12 mins ago',
    },
    {
        id: 3,
        type: 'warning',
        title: 'Payment Gateway Sync',
        message: 'Stripe webhook latency detected (320ms). Monitoring system active.',
        time: '1 hour ago',
    },
    {
        id: 4,
        type: 'success',
        title: 'Backup Completed',
        message: 'Daily database snapshot (pg_dump) completed successfully. Size: 45MB.',
        time: '4 hours ago',
    },
];

const iconMap: any = {
    'critical': <AlertTriangle className="text-red-500" size={24} />,
    'info': <Info className="text-blue-500" size={24} />,
    'warning': <AlertTriangle className="text-orange-500" size={24} />, // Reusing AlertTriangle
    'success': <CheckCircle className="text-green-500" size={24} />,
};

const bgMap: any = {
    'critical': 'bg-red-500/10 border-red-500/20',
    'info': 'bg-blue-500/10 border-blue-500/20',
    'warning': 'bg-orange-500/10 border-orange-500/20',
    'success': 'bg-green-500/10 border-green-500/20',
};

export default function NotificationsPage() {
    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Alerts
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>System Notifications</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Live Feed</span>
                    </p>
                </div>

                <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors flex items-center gap-2">
                    <CheckCircle size={14} /> Mark All Read
                </button>
            </div>

            {/* Alerts Grid */}
            <div className="grid gap-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-6 rounded-3xl border ${bgMap[alert.type]} hover:scale-[1.01] transition-transform duration-300 group relative overflow-hidden`}>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className={`p-4 rounded-2xl bg-background/50 backdrop-blur-md shadow-lg`}>
                                {iconMap[alert.type]}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground/90">
                                        {alert.title}
                                    </h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/30 px-3 py-1 rounded-full">
                                        {alert.time}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-2xl">
                                    {alert.message}
                                </p>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                <X size={16} className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* Decorative Background Icon */}
                        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 pointer-events-none">
                            {iconMap[alert.type]}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    -- End of Feed --
                </p>
            </div>
        </div>
    );
}
