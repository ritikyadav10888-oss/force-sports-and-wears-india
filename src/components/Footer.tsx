"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export const Footer = () => {
    return (
        <footer className="border-t border-border pt-32 pb-16 px-6 bg-secondary/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="col-span-1 md:col-span-1 space-y-6">
                    <Link href="/" className="relative z-50">
                        <BrandLogo size="lg" showImage={false} />
                    </Link>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        Redefining the boundaries of professional athletic performance across India.
                        Designed for those who crave the exceptional.
                    </p>
                </div>
                <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Navigation</h4>
                    <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                        <Link href="/" className="hover:text-accent transition-colors">Shop All</Link>
                        <Link href="/new" className="hover:text-accent transition-colors">Latest Drops</Link>
                        <Link href="/collections" className="hover:text-accent transition-colors">Collections</Link>
                        <Link href="/about" className="hover:text-accent transition-colors">Our Story</Link>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Support</h4>
                    <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                        <Link href="/contact" className="hover:text-accent transition-colors">Contact Expert</Link>
                        <Link href="/shipping" className="hover:text-accent transition-colors">Order Tracking</Link>
                        <Link href="/returns" className="hover:text-accent transition-colors">Returns & Exchanges</Link>
                        <Link href="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Connect</h4>
                    <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Instagram</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter (X)</a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Discord Community</a>
                        <Link href="/announcements" className="hover:text-accent transition-colors">Newsletter</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-border/50 pt-12">
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                    <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link>
                    <Link href="/accessibility" className="hover:text-foreground">Accessibility</Link>
                </div>
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">© 2026 FORCE SPORTS & WEARS INDIA. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
};
