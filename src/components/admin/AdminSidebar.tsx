"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Truck,
    Bell,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useAdminAuth } from "@/store/useAdminAuth";

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/admin/shipments", icon: Truck, label: "Shipments" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const { admin, logout } = useAdminAuth();

    const handleLogout = () => {
        logout();
        router.push("/admin/login");
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-accent rounded-xl shadow-lg"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen w-72 bg-secondary border-r border-border
                flex flex-col transition-transform duration-300 z-40
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-8 border-b border-border">
                    <Link href="/admin" className="block">
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                            Force Admin
                        </h1>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Control Center
                        </p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                                    flex items-center gap-4 px-6 py-4 rounded-2xl font-bold
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-accent text-background shadow-lg'
                                        : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                                    }
                                `}
                            >
                                <Icon size={20} />
                                <span className="uppercase tracking-wider text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Info & Logout */}
                <div className="p-6 border-t border-border/50 space-y-4 bg-gradient-to-t from-secondary/50 to-transparent">
                    <div className="flex items-center gap-4 px-4 py-3 bg-secondary/50 rounded-2xl border border-border/30">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 
                                      flex items-center justify-center font-black text-background text-lg shadow-lg">
                            {admin?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm uppercase tracking-tight truncate">
                                {admin?.name || "Admin User"}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium truncate">
                                {admin?.email || "admin@force.com"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-sm w-full
                                 bg-red-500/10 text-red-500 border-2 border-red-500/20
                                 hover:bg-red-500 hover:text-white hover:border-red-500
                                 hover:shadow-lg hover:shadow-red-500/20
                                 transition-all duration-300 uppercase tracking-[0.15em] group"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                />
            )}
        </>
    );
};
