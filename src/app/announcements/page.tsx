import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Calendar, ArrowRight } from "lucide-react";

export default function AnnouncementsPage() {
    // Featured product announcements
    const announcements = [
        {
            id: 1,
            title: "Elite Pro Training Jersey",
            description: "Revolutionary moisture-wicking technology meets premium athletic design. Engineered for peak performance.",
            image: "/api/placeholder/600/800",
            launchDate: "February 15, 2026",
            category: "Training Gear",
            productLink: "/product/1"
        },
        {
            id: 2,
            title: "Velocity Running Shorts",
            description: "Ultra-lightweight construction with integrated compression. Built for speed and endurance.",
            image: "/api/placeholder/600/800",
            launchDate: "February 20, 2026",
            category: "Running",
            productLink: "/product/2"
        },
        {
            id: 3,
            title: "Force Flex Joggers",
            description: "Premium comfort meets street-ready style. Four-way stretch fabric for unrestricted movement.",
            image: "/api/placeholder/600/800",
            launchDate: "February 25, 2026",
            category: "Lifestyle",
            productLink: "/product/3"
        },
        {
            id: 4,
            title: "Performance Compression Tights",
            description: "Advanced muscle support technology. Designed for athletes who demand excellence.",
            image: "/api/placeholder/600/800",
            launchDate: "March 1, 2026",
            category: "Training Gear",
            productLink: "/product/4"
        },
        {
            id: 5,
            title: "Elite Track Jacket",
            description: "Weather-resistant shell with thermal regulation. Premium athletic sophistication.",
            image: "/api/placeholder/600/800",
            launchDate: "March 5, 2026",
            category: "Outerwear",
            productLink: "/product/5"
        },
        {
            id: 6,
            title: "Pro Athlete Hoodie",
            description: "Heavyweight fleece construction. Engineered for champions, designed for comfort.",
            image: "/api/placeholder/600/800",
            launchDate: "March 10, 2026",
            category: "Lifestyle",
            productLink: "/product/6"
        }
    ];

    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-24">
                {/* Hero Section */}
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 rounded-full border border-accent/20">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Latest Launches</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        New Product<br />Announcements
                    </h1>

                    <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover the latest innovations in athletic performance. Each product is meticulously crafted
                        to push the boundaries of what's possible.
                    </p>
                </div>

                {/* Announcements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="group bg-secondary/30 rounded-3xl overflow-hidden border border-border/50 
                                     hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-secondary flex items-center justify-center">
                                    <span className="text-6xl font-black text-muted-foreground/10 italic uppercase">
                                        Force
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                        {announcement.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {announcement.launchDate}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black italic uppercase tracking-tight leading-tight">
                                    {announcement.title}
                                </h3>

                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    {announcement.description}
                                </p>

                                <Link
                                    href={announcement.productLink}
                                    className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] 
                                             text-foreground hover:text-accent transition-colors group/link"
                                >
                                    View Product
                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="pt-16">
                    <NewsletterSignup />
                </div>
            </div>
        </main>
    );
}
