"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/store/useAdminAuth";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
        // Allow access to login page
        if (pathname === "/admin/login") {
            setIsChecking(false);
            return;
        }

        // Check authentication for all other admin routes
        if (!isAuthenticated) {
            router.push("/admin/login");
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, router, pathname]);

    // Show login page without layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show loading state while checking auth
    if (isChecking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Verifying Access...
                    </p>
                </div>
            </div>
        );
    }

    // Show admin panel only if authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="lg:ml-72 min-h-screen">
                {children}
            </main>
        </div>
    );
}
