'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Search, Filter, Plus, Clock, MapPin, Loader2, Link, X } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

const statusStyles: any = {
    'preparing': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'shipped': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'in transit': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        orderId: '',
        trackingNumber: '',
        carrier: '',
        status: 'SHIPPED',
        estimatedDate: ''
    });

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const [shipmentsData, ordersData] = await Promise.all([
                    adminAPI.getShipments(),
                    adminAPI.getOrders()
                ]);
                setShipments(shipmentsData.shipments || []);
                setOrders(ordersData.orders || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load logistics data');
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await adminAPI.createShipment(formData);
            const data = await adminAPI.getShipments();
            setShipments(data.shipments || []);
            setShowModal(false);
            setFormData({
                orderId: '',
                trackingNumber: '',
                carrier: '',
                status: 'SHIPPED',
                estimatedDate: ''
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create shipment');
        } finally {
            setCreating(false);
        }
    };

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
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Plus size={16} /> New Shipment
                    </button>
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

            {/* Create Shipment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-black p-8 rounded-3xl w-full max-w-lg relative border border-white/20 shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 gradient-text">
                            New Shipment
                        </h2>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Order</label>
                                <select
                                    required
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    <option value="">Select an Order...</option>
                                    {orders.map((order) => (
                                        <option key={order.id} value={order.id}>
                                            #{order.orderNumber} - {order.user?.name} (₹{order.total})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tracking Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.trackingNumber}
                                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="e.g. TRK-987654321"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Carrier</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.carrier}
                                        onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="e.g. FedEx"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Delivery</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.estimatedDate}
                                        onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black/90 transition-all disabled:opacity-50 mt-4"
                            >
                                {creating ? <Loader2 className="animate-spin mx-auto" /> : 'Create Shipment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
