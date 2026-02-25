import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);

    return {
        title: `${categoryName} Collection | Force Sports`,
        description: `Shop the exclusive ${categoryName} collection at Force Sports India. High-performance gear designed for excellence.`,
        openGraph: {
            title: `${categoryName} | Force Sports`,
            description: `Discover the ${categoryName} range. Premium quality, elite performance.`,
        }
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);

    let products: any[] = [];
    try {
        const data = await api.getProducts();
        const allProducts = data.products || [];
        products = allProducts.filter((p: any) =>
            p.category?.toLowerCase() === categoryName.toLowerCase()
        );
    } catch (error) {
        console.error("Failed to fetch products", error);
    }

    // Breadcrumb JSON-LD
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
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: categoryName,
                item: `https://forcesports.in/collections/${category}`
            }
        ]
    };

    return (
        <main className="min-h-screen pt-32 pb-24 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-accent mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Collections
                </Link>

                <div className="mb-16">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] block mb-4">Collection</span>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">{categoryName}</h1>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((p, idx) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-border rounded-3xl bg-secondary/10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No gear found for {categoryName} yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
