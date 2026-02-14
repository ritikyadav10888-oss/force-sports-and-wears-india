"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function RefundsHelpPage() {
    const faqs = [
        {
            question: "How do I request a refund?",
            answer: "To request a refund, go to your order history, select the order, and click 'Request Refund'. You'll need to provide a reason and any relevant details. Refunds are processed within 5-7 business days."
        },
        {
            question: "When will I receive my refund?",
            answer: "Refunds are typically processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method."
        },
        {
            question: "What is your refund policy?",
            answer: "We offer full refunds within 30 days of purchase for unworn, unwashed items with original tags attached. Sale items and personalized products are final sale and not eligible for refunds."
        },
        {
            question: "Can I get a refund if I changed my mind?",
            answer: "Yes, you can return items within 30 days if you changed your mind, as long as they meet our return conditions (unworn, unwashed, with tags)."
        },
        {
            question: "Will I be refunded for shipping costs?",
            answer: "Original shipping costs are non-refundable unless the return is due to our error (wrong item, defective product). Return shipping costs are the customer's responsibility."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">REFUNDS</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Refunds</h1>

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
