'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    Truck,
    Bell,
    LogOut,
    Shield,
    ChevronRight,
    Settings
} from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/customers', icon: Users, label: 'Customers' },
    { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/dashboard/products', icon: Package, label: 'Products' },
    { href: '/dashboard/shipments', icon: Truck, label: 'Shipments' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await adminAPI.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('admin_token');
            router.push('/login');
        }
    };

    return (
        <aside className="bg-[#0a0a0b] text-white w-72 min-h-screen p-6 flex flex-col border-r border-white/5 relative z-50">
            {/* Brand Logo */}
            <div className="mb-12 flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-accent/20">
                    <Shield className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                        Force<span className="text-accent underline decoration-2 underline-offset-4 ml-1">Admin</span>
                    </h1>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Control Hub</p>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 space-y-10">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 ml-4">Main Menu</h2>
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${isActive
                                            ? 'bg-accent text-white shadow-xl shadow-accent/20 translate-x-1'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/10'}`}>
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {isActive && <ChevronRight size={14} className="animate-pulse" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 ml-4">System</h2>
                    <nav className="space-y-2">
                        <Link href="/dashboard/notifications"
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white group transition-all">
                            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                <Bell size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Alerts</span>
                        </Link>
                        <Link href="/dashboard/settings"
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white group transition-all">
                            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                <Settings size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Settings</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Logout Section */}
            <div className="pt-8 border-t border-white/5 mt-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all w-full group"
                >
                    <div className="p-2 bg-red-500/5 rounded-xl group-hover:bg-red-500/20 transition-colors">
                        <LogOut size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}
