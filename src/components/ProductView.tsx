"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus, Minus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCurrency, formatPrice } from "@/store/useCurrency";
import { useCart } from "@/store/useCart";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useRecentlyViewed } from "@/store/useRecentlyViewed";
import { Star, MessageSquare, Loader2, Edit2, Trash2 } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { api } from "@/lib/api-client";
import { useAuth } from "@/store/useAuth";
import { formatDistanceToNow } from "date-fns";
import { BulkOrderModal } from "@/components/BulkOrderModal";

interface ProductViewProps {
    product: any;
    relatedProducts: any[];
}

export function ProductView({ product, relatedProducts }: ProductViewProps) {
    const router = useRouter();
    const { rate, symbol } = useCurrency();
    const { addItem } = useCart();
    const { addProduct } = useRecentlyViewed();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [activeImage, setActiveImage] = useState(0);

    // Live stock — refreshed from API on mount so SSR cache doesn't show stale stock
    const [liveStock, setLiveStock] = useState<number>(product?.stock ?? 0);
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    useEffect(() => {
        if (!product?.id) return;
        // Re-fetch stock from API so we always have the latest value
        api.getProduct(product.id)
            .then((data) => {
                if (data?.product?.stock !== undefined) {
                    setLiveStock(data.product.stock);
                    // Also cap quantity if stock dropped
                    setQuantity(q => Math.min(q, Math.max(1, data.product.stock)));
                }
            })
            .catch(() => {/* silently use SSR stock on error */ });
    }, [product?.id]);

    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [editingReview, setEditingReview] = useState<any>(null);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const data = await api.getProductReviews(product.id);
            setReviews(data.reviews || []);
            setStats(data.stats || null);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete this gear report?")) return;
        try {
            await api.deleteReview(reviewId);
            fetchReviews();
        } catch (err) {
            console.error("Failed to delete review:", err);
            alert("Failed to delete review");
        }
    };

    useEffect(() => {
        if (product?.id) {
            fetchReviews();
        }
    }, [product?.id]);

    // Add to recently viewed on mount
    useEffect(() => {
        if (product) {
            addProduct(product);
        }
    }, [product, addProduct]);

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

    const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.svg'];
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
        <main className="min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back Link */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
                    {/* Image Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-secondary shadow-2xl"
                        >
                            <Image
                                src={images[activeImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, 50vw"
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
                                            "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-secondary relative",
                                            activeImage === idx ? "border-accent scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
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
                            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
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
                                <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-accent">
                                    {formatPrice(product.price, rate, symbol)}
                                </span>
                            </div>
                        </div>

                        {/* Selection Section */}
                        <div className="space-y-10 mb-12">
                            {/* Size Selection - Only if sizes exist */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Size</h4>
                                        <button className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-4 hover:text-accent transition-colors">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size: string) => (
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
                            )}

                            {/* Stock Status Badge */}
                            {liveStock <= 0 ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Out of Stock</span>
                                </div>
                            ) : liveStock <= 5 ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Only {liveStock} left</span>
                                </div>
                            ) : null}

                            <div className="space-y-4 flex items-center gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Quantity</h4>
                                    <div className="flex items-center w-fit bg-secondary rounded-2xl p-2 border border-border/50">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={liveStock <= 0}
                                            className="w-12 h-12 flex items-center justify-center hover:text-accent transition-all active:scale-90 disabled:opacity-30"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-12 text-center font-black text-xl italic">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(liveStock, quantity + 1))}
                                            disabled={liveStock <= 0 || quantity >= liveStock}
                                            className="w-12 h-12 flex items-center justify-center hover:text-accent transition-all active:scale-90 disabled:opacity-30"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 pt-8">
                                    {liveStock <= 0 ? (
                                        <button
                                            disabled
                                            className="w-full py-6 bg-muted text-muted-foreground rounded-[2rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 cursor-not-allowed opacity-60"
                                        >
                                            Out of Stock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const itemToAdd = {
                                                    ...product,
                                                    selectedSize: product.sizes?.length ? selectedSize : undefined
                                                };
                                                addItem(itemToAdd, quantity);
                                                // Optimistically decrement live stock after adding to cart
                                                setLiveStock(s => Math.max(0, s - quantity));
                                            }}
                                            className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98] shadow-lg group"
                                        >
                                            Add to Bag <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bulk Order Inquiry Button */}
                        <div className="mt-4 pt-4 border-t border-border/30">
                            <button
                                onClick={() => setIsBulkOpen(true)}
                                className="w-full py-4 bg-secondary/60 hover:bg-secondary border border-border rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.01] text-foreground/80 hover:text-foreground group"
                            >
                                <span className="text-lg">📦</span>
                                Bulk Order / Custom Manufacturing
                                <span className="text-[9px] bg-accent/10 text-accent px-2 py-1 rounded-md border border-accent/20 font-black uppercase tracking-widest">Inquiry</span>
                            </button>
                            <p className="text-[9px] text-muted-foreground text-center mt-2">MOQ 10+ units · Branded kits available · Custom logo printing</p>
                        </div>

                        <BulkOrderModal
                            isOpen={isBulkOpen}
                            onClose={() => setIsBulkOpen(false)}
                            product={product ? { id: product.id, name: product.name } : null}
                        />

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

                        {/* Trust Badges & Policies */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border/50">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Fast Delivery</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Est. {product.deliveryDays || 7} Days</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
                                    <RotateCcw size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        {product.returnPolicy === 'NON_RETURNABLE' ? 'Non-Returnable' :
                                            product.returnPolicy === 'EXCHANGE_ONLY' ? 'Exchange Only' : 'Easy Returns'}
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                                        {product.returnPolicy === 'NON_RETURNABLE' ? 'Final Sale' : 'Tags Required'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">100% Secure</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Encrypted Data</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <section className="mb-32 pt-24 border-t border-border/50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="flex-1 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Feedback & Rating</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={18}
                                                className={cn(
                                                    "transition-colors",
                                                    (stats?.averageRating || 0) >= s ? "fill-accent text-accent" : "text-muted-foreground/30"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                        {stats?.averageRating ? stats.averageRating.toFixed(1) : "No ratings yet"} • {stats?.totalReviews || 0} Reviews
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {loadingReviews ? (
                                    <div className="flex items-center gap-3 text-muted-foreground py-12">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span className="text-xs font-black uppercase tracking-widest">Loading Reviews...</span>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews.map((review) => (
                                            <motion.div
                                                key={review.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                className="p-8 rounded-[2rem] bg-secondary/20 border border-border/30 space-y-4 hover:border-accent/30 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-black uppercase text-xs italic">{review.user.name}</p>
                                                            {review.userId === user?.id && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setEditingReview(review)}
                                                                        className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
                                                                        title="Edit Report"
                                                                    >
                                                                        <Edit2 size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteReview(review.id)}
                                                                        className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                                        title="Delete Report"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest">
                                                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                size={10}
                                                                className={cn(
                                                                    review.rating >= s ? "fill-accent text-accent" : "text-muted-foreground/20"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed text-foreground/80">
                                                    "{review.comment}"
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 bg-secondary/10 rounded-[3rem] border border-dashed border-border/50 text-center">
                                        <MessageSquare size={40} className="text-muted-foreground/30 mb-4" />
                                        <h3 className="font-black uppercase italic text-muted-foreground">No Field Reports Yet</h3>
                                        <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mt-2">Become the first to verify this gear.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-[400px]" id="review-form-container">
                            {isAuthenticated ? (
                                editingReview ? (
                                    <ReviewForm
                                        productId={product.id}
                                        onSuccess={() => {
                                            fetchReviews();
                                            setEditingReview(null);
                                        }}
                                        initialData={{
                                            id: editingReview.id,
                                            rating: editingReview.rating,
                                            comment: editingReview.comment
                                        }}
                                        onCancel={() => setEditingReview(null)}
                                    />
                                ) : reviews.some(r => r.userId === user?.id) ? (
                                    <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
                                            <ShieldCheck className="text-white" size={32} />
                                        </div>
                                        <h3 className="text-lg font-black italic uppercase tracking-tighter">Status: Verified</h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
                                            Your intel has been recorded for this asset. You can find and manage your report in the feedback feed.
                                        </p>
                                        <button
                                            onClick={() => {
                                                const myReview = reviews.find(r => r.userId === user?.id);
                                                if (myReview) setEditingReview(myReview);
                                            }}
                                            className="w-full py-4 bg-accent/10 text-accent rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all"
                                        >
                                            Modify Your Report
                                        </button>
                                    </div>
                                ) : (
                                    <ReviewForm productId={product.id} onSuccess={fetchReviews} />
                                )
                            ) : (
                                <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/50 text-center space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Share Your Gear Report</h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
                                            Only authenticated operatives can verify gear performance.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            className="block w-full py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                                        >
                                            Sign In to Post
                                        </Link>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">New to the field? <Link href="/register" className="text-accent underline underline-offset-4 decoration-2">Create Account</Link></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

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
