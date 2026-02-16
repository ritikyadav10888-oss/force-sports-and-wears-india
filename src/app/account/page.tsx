"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, MapPin, LogOut, Settings, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { api } from "@/lib/api-client";
import Link from "next/link";

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);

    // Sync tab with URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['profile', 'orders', 'addresses', 'settings'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [router]);

    const [orders, setOrders] = useState<any[]>([]);
    const [fetchingOrders, setFetchingOrders] = useState(false);

    useEffect(() => {
        // Sync user data and validate session
        const validateSession = async () => {
            if (isAuthenticated) {
                try {
                    // Verify token and update user details
                    const data = await api.getMe();

                    if (data.user) {
                        const firstName = data.user.name?.split(' ')[0] || '';
                        const lastName = data.user.name?.split(' ').slice(1).join(' ') || '';

                        updateUser({
                            firstName,
                            lastName,
                            email: data.user.email,
                            phone: data.user.phone,
                            // If your API returns address, map it here too
                        });
                    }

                } catch (err) {
                    console.error("Session invalid:", err);
                    // If 401, logout
                    logout();
                    // Force a hard navigation to ensure state is fresh
                    window.location.href = '/account';
                    // Don't redirect to login immediately to avoid loops, just kick to home
                }
            }
        };

        validateSession();
    }, [isAuthenticated, logout, router, updateUser]);

    // Fetch orders when tab changes
    useEffect(() => {
        if (activeTab === "orders" && isAuthenticated) {
            setFetchingOrders(true);
            api.getMyOrders()
                .then((data) => {
                    setOrders(data);
                })
                .catch((err) => console.error("Failed to fetch orders:", err))
                .finally(() => setFetchingOrders(false));
        }
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        // Simple auth check
        if (!isAuthenticated) {
            const timer = setTimeout(() => {
                if (!isAuthenticated) router.push('/?login=true');
            }, 3000); // Wait 3 seconds to allow hydration/fetch
            return () => clearTimeout(timer);
        }
        setLoading(false);
    }, [isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (err) {
            console.error("Logout failed:", err);
        }
        logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading Account...
                </p>
            </div>
        );
    }

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "orders", label: "Orders", icon: Package },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 relative">
                    <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full -z-10" />
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
                        My Account
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                            Welcome back, {user?.firstName}
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="p-6 bg-secondary/10 border border-border/50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Membership</p>
                        <p className="text-xl font-black italic uppercase">Elite Tier</p>
                    </div>
                    <div className="p-6 bg-secondary/10 border border-border/50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Orders</p>
                        <p className="text-xl font-black italic uppercase">{orders.length}</p>
                    </div>
                    <div className="p-6 bg-secondary/10 border border-border/50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Saved Items</p>
                        <p className="text-xl font-black italic uppercase">0</p>
                    </div>
                    <div className="p-6 bg-secondary/10 border border-border/50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Points</p>
                        <p className="text-xl font-black italic uppercase text-accent">1,250</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold uppercase tracking-wider text-xs ${activeTab === tab.id
                                    ? "bg-accent text-background shadow-lg scale-[1.02]"
                                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold uppercase tracking-wider text-xs text-red-500 hover:bg-red-500/10 mt-8"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-secondary/10 border border-border/50 rounded-3xl p-8 md:p-12 min-h-[500px]"
                        >
                            {activeTab === "profile" && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-secondary/50 to-transparent rounded-3xl border border-border/50">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-background shadow-xl">
                                            <span className="text-3xl font-black italic">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{user?.firstName} {user?.lastName}</h2>
                                            <p className="text-sm font-bold text-muted-foreground">{user?.email}</p>
                                            <div className="flex gap-2 mt-3">
                                                <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-widest">Verified Athlete</span>
                                                <span className="px-3 py-1 bg-secondary border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">India</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-hover:text-accent transition-colors">First Name</label>
                                            <div className="p-5 bg-secondary/30 border border-border rounded-2xl font-bold text-sm uppercase tracking-wide">
                                                {user?.firstName}
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-hover:text-accent transition-colors">Last Name</label>
                                            <div className="p-5 bg-secondary/30 border border-border rounded-2xl font-bold text-sm uppercase tracking-wide">
                                                {user?.lastName}
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-hover:text-accent transition-colors">Email Address</label>
                                            <div className="p-5 bg-secondary/30 border border-border rounded-2xl font-bold text-sm lowercase tracking-wide flex justify-between items-center">
                                                {user?.email}
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-hover:text-accent transition-colors">Phone Number</label>
                                            <div className="p-5 bg-secondary/30 border border-border rounded-2xl font-bold text-sm tracking-wide">
                                                {user?.countryCode} {user?.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Order History</h3>

                                    {fetchingOrders ? (
                                        <div className="flex justify-center py-20">
                                            <Loader2 className="animate-spin text-accent" size={32} />
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order: any) => (
                                                <div key={order.id} className="p-6 bg-background border border-border rounded-2xl flex flex-col md:flex-row justify-between gap-4 group hover:border-accent/50 transition-colors">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="font-black text-lg uppercase">#{order.id.slice(-6)}</span>
                                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                    'bg-secondary text-muted-foreground'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm font-bold mt-1">
                                                            {order.items?.length || 0} items • ₹{order.totalAmount?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Link href={`/orders/${order.id}`} className="px-6 py-3 bg-secondary hover:bg-accent hover:text-background rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Package className="text-muted-foreground" size={32} />
                                            </div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">No Orders Yet</h3>
                                            <p className="text-sm text-muted-foreground mb-8">You haven't placed any orders yet.</p>
                                            <Link
                                                href="/"
                                                className="inline-block px-8 py-4 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                                            >
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "addresses" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Saved Addresses</h3>
                                        <button className="text-xs font-black uppercase tracking-widest text-accent hover:underline">
                                            + Add New
                                        </button>
                                    </div>

                                    {/* Placeholder Address Card */}
                                    <div className="p-6 border border-accent/20 bg-accent/5 rounded-2xl relative group">
                                        <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                                            Default
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-sm uppercase">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-muted-foreground">123 Street Name, Apartment 4B</p>
                                            <p className="text-sm text-muted-foreground">Mumbai, Maharashtra 400001</p>
                                            <p className="text-sm text-muted-foreground">India</p>
                                            <p className="text-sm text-muted-foreground mt-2">Phone: {user?.phone}</p>
                                        </div>
                                        <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs font-bold text-foreground hover:underline">Edit</button>
                                            <button className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "settings" && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Account Settings</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                            <div>
                                                <p className="font-bold text-sm uppercase">Email Notifications</p>
                                                <p className="text-xs text-muted-foreground">Receive updates about your orders and promotions</p>
                                            </div>
                                            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                            <div>
                                                <p className="font-bold text-sm uppercase">Two-Factor Authentication</p>
                                                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                                            </div>
                                            <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-8 border-t border-border/50">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-red-500 mb-4">Danger Zone</h4>
                                        <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
