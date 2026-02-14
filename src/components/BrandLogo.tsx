"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl" | "hero";
    variant?: "default" | "light" | "dark";
    showImage?: boolean;
}

export const BrandLogo = ({ className, size = "md", variant = "default", showImage = false }: BrandLogoProps) => {
    const sizeClasses = {
        sm: {
            main: "text-lg",
            sub: "text-[7px] tracking-[0.3em] mt-0.5",
            img: 32
        },
        md: {
            main: "text-2xl font-black italic",
            sub: "text-[9px] tracking-[0.35em] mt-1 font-black",
            img: 48
        },
        lg: {
            main: "text-4xl font-black italic",
            sub: "text-[10px] tracking-[0.4em] mt-1 font-black",
            img: 64
        },
        xl: {
            main: "text-6xl md:text-8xl font-black italic",
            sub: "text-xl md:text-2xl tracking-[0.5em] mt-2 font-black",
            img: 120
        },
        hero: {
            main: "text-5xl md:text-7xl font-black italic leading-[0.9] tracking-tighter",
            sub: "text-sm md:text-lg tracking-[0.4em] mt-3 font-black",
            img: 80
        }
    };

    const colorClasses = {
        default: "text-foreground group-hover:text-accent",
        light: "text-white group-hover:text-blue-500",
        dark: "text-black group-hover:text-blue-500",
    };

    return (
        <div className={cn("flex items-center gap-4 group leading-none", className)}>
            {showImage && (
                <div className="relative flex-shrink-0 rounded-full overflow-hidden border-2 border-blue-400/40 shadow-lg shadow-blue-400/30">
                    <Image
                        src="/logo.png"
                        alt="Force Sports Logo"
                        width={sizeClasses[size].img}
                        height={sizeClasses[size].img}
                        className="object-contain"
                    />
                </div>
            )}
            <div className="flex flex-col">
                <span className={cn(
                    "font-black tracking-tighter uppercase italic transition-all",
                    colorClasses[variant],
                    sizeClasses[size].main
                )}>
                    FORCE
                </span>
                <span
                    className={cn(
                        "font-black uppercase leading-none",
                        sizeClasses[size].sub
                    )}
                    style={{
                        color: '#3b82f6',
                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    Sports & Wears India
                </span>
            </div>
        </div>
    );
};
