'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, Trash2, Loader2, User, Package, Calendar, BarChart3, TrendingUp, Filter, ArrowLeft, ExternalLink } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [summaries, setSummaries] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'feed' | 'summaries' | 'ranking'>('feed');
    const [filterProductId, setFilterProductId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getReviews();
            setReviews(data.reviews || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummaries = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getReviewSummaries();
            setSummaries(data.summaries || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load review summaries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === 'feed') {
            fetchReviews();
        } else {
            fetchSummaries();
        }
    }, [viewMode]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        setIsDeleting(id);
        try {
            await adminAPI.deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete review');
        } finally {
            setIsDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Feedback
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                        <span>Intelligence Report</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">
                            {viewMode === 'feed' ? 'Live Operational Feed' : viewMode === 'summaries' ? 'Asset Intelligence' : 'Performance Rankings'}
                        </span>
                    </p>
                </div>

                <div className="flex items-center p-1.5 bg-secondary/20 rounded-2xl border border-white/5 self-start md:self-auto">
                    <button
                        onClick={() => setViewMode('feed')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'feed' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <MessageSquare size={14} /> Feed
                    </button>
                    <button
                        onClick={() => setViewMode('summaries')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'summaries' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <BarChart3 size={14} /> Assets
                    </button>
                    <button
                        onClick={() => setViewMode('ranking')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'ranking' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <TrendingUp size={14} /> Rankings
                    </button>
                </div>
            </div>

            {filterProductId && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <button
                        onClick={() => { setFilterProductId(null); setViewMode('feed'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors border border-white/5"
                    >
                        <ArrowLeft size={12} /> Clear Filter
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent italic">
                        Filtering by Product: {reviews.find(r => r.productId === filterProductId)?.product.name || 'Selected Asset'}
                    </span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {viewMode === 'feed' ? (
                    reviews.filter(r => !filterProductId || r.productId === filterProductId).length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-secondary/10 rounded-[3rem] border border-dashed border-border/50 text-center">
                            <MessageSquare size={48} className="text-muted-foreground/20 mb-6" />
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-muted-foreground">Silence in the Field</h2>
                            <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-2">No product reviews match your current parameters.</p>
                        </div>
                    ) : (
                        reviews.filter(r => !filterProductId || r.productId === filterProductId).map((review) => (
                            <div key={review.id} className="glass-card p-10 space-y-8 group hover:border-accent/30 transition-all duration-500 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                                {/* Header: User & Rating */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-accent">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={14}
                                                    className={review.rating >= s ? "fill-current" : "opacity-20"}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">
                                            {review.rating >= 4 ? 'Positive Intel' : review.rating <= 2 ? 'Critical Alert' : 'Neutral Feedback'}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={isDeleting === review.id}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {isDeleting === review.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>

                                {/* Comment */}
                                <p className="text-lg font-medium leading-relaxed italic text-white/80">
                                    "{review.comment}"
                                </p>

                                {/* Metadata Footer */}
                                <div className="pt-8 border-t border-white/5 flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Asset</span>
                                        <div
                                            onClick={() => { setFilterProductId(review.productId); setViewMode('feed'); }}
                                            className="flex items-center gap-2 group/link cursor-pointer"
                                        >
                                            <Package size={12} className="text-accent" />
                                            <span className="text-[11px] font-black uppercase text-white/70 group-hover/link:text-accent transition-colors">{review.product.name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Operative</span>
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-accent" />
                                            <span className="text-[11px] font-black uppercase text-white/70">{review.user.name}</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-end">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                            <Calendar size={12} />
                                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-2 -right-2 opacity-[0.02] text-8xl font-black italic uppercase select-none pointer-events-none tracking-tighter">
                                    {review.id.slice(0, 4)}
                                </div>
                            </div>
                        ))
                    )
                ) : viewMode === 'summaries' ? (
                    summaries.map((summary) => (
                        <div key={summary.id} className="glass-card p-10 space-y-8 group hover:border-accent/30 transition-all duration-500 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex gap-8">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                                    <img src={summary.image} alt={summary.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={12} className={Math.round(summary.averageRating) >= s ? "fill-current" : "opacity-20"} />
                                        ))}
                                        <span className="text-xs font-black ml-1 italic">{summary.averageRating.toFixed(1)}</span>
                                    </div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{summary.name}</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{summary.totalReviews} Intelligence Reports</p>
                                </div>
                            </div>

                            {summary.latestReview && (
                                <div className="p-6 bg-white/5 rounded-2xl space-y-3 relative">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent">
                                        <User size={10} /> {summary.latestReview.user.name}
                                        <span className="mx-2 text-white/10">|</span>
                                        <Calendar size={10} /> {formatDistanceToNow(new Date(summary.latestReview.createdAt), { addSuffix: true })}
                                    </div>
                                    <p className="text-sm font-medium italic text-white/60 line-clamp-2 leading-relaxed">
                                        "{summary.latestReview.comment}"
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setFilterProductId(summary.id); setViewMode('feed'); }}
                                    className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all group/btn"
                                >
                                    Review Logs <ExternalLink size={12} className="inline ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-6 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-white/20 transition-all">
                                    Asset Profile
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full space-y-4">
                        {[...summaries]
                            .sort((a, b) => (b.averageRating * b.totalReviews) - (a.averageRating * a.totalReviews))
                            .map((summary, index) => (
                                <div key={summary.id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-accent/30 transition-all animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="text-4xl font-black italic text-white/10 w-16 text-center">#{index + 1}</div>
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                        <img src={summary.image} alt={summary.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter">{summary.name}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-4 mt-1">
                                            <div className="flex items-center gap-1 text-accent">
                                                <Star size={10} className="fill-current" />
                                                <span className="text-[11px] font-black">{summary.averageRating.toFixed(1)}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{summary.totalReviews} Reports</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-64 h-2 bg-white/5 rounded-full overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(summary.averageRating / 5) * 100}%` }}
                                            className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => { setFilterProductId(summary.id); setViewMode('feed'); }}
                                        className="p-4 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all"
                                    >
                                        <Filter size={16} />
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
