"use client";

import React, { useState } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
    initialData?: { id: string; rating: number; comment: string };
    onCancel?: () => void;
}

export function ReviewForm({ productId, onSuccess, initialData, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(initialData?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }
        if (comment.length < 3) {
            setError("Comment must be at least 3 characters");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            if (initialData) {
                await api.updateReview(initialData.id, { rating, comment });
            } else {
                await api.submitReview({ productId, rating, comment });
                setRating(0);
                setComment("");
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 rounded-[2rem] bg-secondary/30 border border-border/50 space-y-6">
            <h3 className="text-xl font-black italic uppercase tracking-tighter">
                {initialData ? "Update Intel" : "Submit a Review"}
            </h3>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={28}
                                className={cn(
                                    "transition-colors",
                                    (hover || rating) >= star
                                        ? "fill-accent text-accent shadow-[0_0_15px_rgba(var(--accent),0.3)]"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Feedback</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience..."
                    className="w-full h-32 px-5 py-4 rounded-2xl bg-background border border-border/50 focus:border-accent outline-none transition-all font-medium text-sm resize-none"
                    disabled={isSubmitting}
                />
            </div>

            {error && (
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
            )}

            <div className="flex gap-4">
                {initialData && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-4 bg-secondary/50 text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all"
                    >
                        Cancel Verification
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            Processing...
                        </>
                    ) : (
                        <>
                            {initialData ? "Update Intel" : "Post Review"} <Send size={16} />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
