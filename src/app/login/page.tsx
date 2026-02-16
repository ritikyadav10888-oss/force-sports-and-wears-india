"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home and trigger login modal via query param
        router.replace('/?login=true');
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold animate-pulse text-muted-foreground uppercase tracking-widest">Redirecting to login...</p>
        </div>
    );
}
