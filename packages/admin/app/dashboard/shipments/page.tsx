'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Search, Filter, Plus, Clock, MapPin, Loader2, Link } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

const statusStyles: any = {
    'preparing': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'shipped': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'in transit': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const data = await adminAPI.getShipments();
                setShipments(data.shipments || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load logistics data');
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Shipments
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Logistics Tracking</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Distribution Node</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Tracking ID</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Order Ref</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Carrier</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Est. Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {shipments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-10 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
                                    No active shipments found in logistics hub.
                                </td>
                            </tr>
                        ) : (
                            shipments.map((shp) => (
                                <tr key={shp.id} className="hover:bg-accent/5 transition-all">
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black">{shp.trackingNumber}</span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{shp.id.split('-')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-sm font-bold text-accent">
                                        <div className="flex flex-col">
                                            <span className="font-black">#{shp.order?.orderNumber || 'PENDING'}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">{shp.order?.user?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[shp.status.toLowerCase()] || 'bg-muted text-muted-foreground border-border/50'}`}>
                                            {shp.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-sm font-bold">{shp.carrier}</td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                                            <Clock size={14} className="text-accent" /> {new Date(shp.estimatedDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
