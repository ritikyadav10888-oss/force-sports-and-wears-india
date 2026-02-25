import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collections | Force Sports India",
    description: "Explore our curated collections of premium athletic gear. Shop exclusively designed sports apparel for men, women, and accessories.",
};

export default async function CollectionsPage() {
    const { products } = await api.getProducts().catch(() => ({ products: [] }));

    const categories = Array.from(new Set(products.map((p: any) => p.category)));

    // Create a structured data BreadcrumbList
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://forcesports.in'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Collections',
                item: 'https://forcesports.in/collections'
            }
        ]
    };

    return (
        <main className="min-h-screen pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-4">Collections</h1>
                <p className="text-muted-foreground font-medium text-xl uppercase tracking-widest opacity-60">Force Sports & Wears India • Curated Editions</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {categories.length > 0 ? (
                    categories.map((category: any, idx: number) => {
                        const categoryProducts = products.filter((p: any) => p.category === category).slice(0, 4);
                        return (
                            <section key={category} className="space-y-12">
                                <div className="flex justify-between items-end border-b border-border/50 pb-8">
                                    <div>
                                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2 block">EDITION 0{idx + 1}</span>
                                        <h2 className="text-5xl font-black italic tracking-tighter uppercase">{category}</h2>
                                    </div>
                                    <a href={`/collections/${category}`} className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-8 hover:text-accent transition-colors">
                                        Browse Full Drop
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                                    {categoryProducts.map((p: any) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            </section>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No collections discovered at this time</p>
                    </div>
                )}
            </div>
        </main>
    );
}
