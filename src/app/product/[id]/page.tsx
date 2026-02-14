"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus, Minus, ShieldCheck, Truck, RotateCcw, Loader2 } from "lucide-react";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import { useCart } from "@/store/useCart";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useRecentlyViewed } from "@/store/useRecentlyViewed";
import { api } from "@/lib/api-client";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { rate, symbol } = useCurrency();
    const { addItem } = useCart();
    const { addProduct } = useRecentlyViewed();

    const [product, setProduct] = useState<any>(null);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const [productData, allProductsData] = await Promise.all([
                    api.getProduct(params.id as string),
                    api.getProducts()
                ]);
                setProduct(productData.product);
                setAllProducts(allProductsData.products || []);
                if (productData.product) {
                    addProduct(productData.product);
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProductData();
        }
    }, [params.id, addProduct]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-accent" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Accessing Archive...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-red-500">Asset Not Found</h1>
                <p className="text-muted-foreground font-medium">The requested item has been delisted or moved.</p>
                <Link href="/" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">
                    Return to Drops
                </Link>
            </div>
        );
    }

    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.png'];
    const specs = product.specs || [
        { label: "Material", value: "Premium Composite" },
        { label: "Fit", value: "Athletic/Performance" },
        { label: "Season", value: "Collection 2026" }
    ];
    const highlights = product.highlights || [
        "High-performance engineering",
        "Moisture-wicking technology",
        "Durability-tested materials"
    ];

    return (
        <main className="min-h-screen pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back Link */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                    {/* Image Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-secondary shadow-2xl"
                        >
                            <img
                                src={images[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-8 left-8">
                                <span className="px-6 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                                    {product.category}
                                </span>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-secondary",
                                            activeImage === idx ? "border-accent scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col"
                    >
                        <div className="space-y-6 mb-12">
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
                                {product.name}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                                {product.description}
                            </p>

                            {/* Highlights */}
                            <ul className="space-y-3 pt-4">
                                {highlights.map((highlight: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        {highlight}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-8 border-t border-border/10">
                                <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-accent">
                                    {formatPrice(product.price, rate, symbol)}
                                </span>
                            </div>
                        </div>

                        {/* Selection Section */}
                        <div className="space-y-10 mb-12">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Size</h4>
                                    <button className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-4 hover:text-accent transition-colors">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {["S", "M", "L", "XL"].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "w-16 h-16 rounded-2xl font-black transition-all flex items-center justify-center border-2",
                                                selectedSize === size
                                                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                                    : "bg-transparent border-border hover:border-accent text-foreground"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 flex items-center gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Quantity</h4>
                                    <div className="flex items-center w-fit bg-secondary rounded-2xl p-2 border border-border/50">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 flex items-center justify-center hover:text-accent transition-all active:scale-90"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-12 text-center font-black text-xl italic">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 flex items-center justify-center hover:text-accent transition-all active:scale-90"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 pt-8">
                                    <button
                                        onClick={() => addItem(product, quantity)}
                                        className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98] shadow-lg group"
                                    >
                                        Add to Bag <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Technical Specs Section */}
                        <div className="mt-12 space-y-6 pt-12 border-t border-border/50">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Technical Specifications</h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                                {specs.map((spec: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-border/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{spec.label}</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border/50">
                            {[
                                { icon: Truck, label: "Fast Shipping", detail: "2-4 Business Days" },
                                { icon: RotateCcw, label: "Easy Returns", detail: "30-Day Window" },
                                { icon: ShieldCheck, label: "100% Secure", detail: "Encrypted Data" },
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
                                        <feature.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">{feature.label}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">{feature.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Style with These</h2>
                                <p className="text-muted-foreground font-medium">Complete your look with our curated essentials.</p>
                            </div>
                            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-8 hover:text-accent transition-colors">
                                View Entire Drop
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
