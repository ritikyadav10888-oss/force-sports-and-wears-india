"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ReturnsHelpPage() {
    const faqs = [
        {
            question: "How do I return an item?",
            answer: "Sign in to your account, go to Order History, select the order, and click 'Return Item'. Follow the instructions to print a return label and ship the item back to us."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have all original tags attached. Some items like personalized products are not eligible for return."
        },
        {
            question: "Do I have to pay for return shipping?",
            answer: "Return shipping is free if the return is due to our error (wrong item, defective product). For other returns, you're responsible for return shipping costs."
        },
        {
            question: "Can I exchange an item instead of returning it?",
            answer: "Yes! When initiating a return, select 'Exchange' and choose your preferred size or color. We'll ship the replacement as soon as we receive your return."
        },
        {
            question: "How long does it take to process a return?",
            answer: "Once we receive your return, it takes 3-5 business days to inspect and process. You'll receive a confirmation email once the return is approved and your refund is issued."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">RETURNS AND REPLACEMENT</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Returns and Replacement</h1>

                {/* FAQs */}
                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-border pb-8">
                            <h2 className="text-xl font-semibold mb-4">{faq.question}</h2>
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                {/* Back to Help Center */}
                <div className="mt-12">
                    <Link
                        href="/help"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:text-foreground/60 transition-colors"
                    >
                        ← Back to Help Center
                    </Link>
                </div>
            </div>
        </div>
    );
}
