"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            setIsUploading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-6 bg-secondary/30">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Product Catalog</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Add new premium products to your storefront.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background rounded-[2rem] border border-border p-8 md:p-12 shadow-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Urban Stealth v2"
                                    className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Price (INR)</label>
                                <input
                                    type="number"
                                    placeholder="15000"
                                    className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Description</label>
                            <textarea
                                rows={4}
                                placeholder="High-performance footwear..."
                                className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Product Image URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                                        required
                                    />
                                </div>
                                <button type="button" className="px-5 py-3 bg-secondary rounded-xl hover:bg-border transition-colors">
                                    <Upload size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isUploading}
                                type="submit"
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                                    success ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
                                )}
                            >
                                {isUploading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : success ? (
                                    <>Uploaded Successfully <CheckCircle2 size={22} /></>
                                ) : (
                                    <>Add Product to Catalog <Plus size={22} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
