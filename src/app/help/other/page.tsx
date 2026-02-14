"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function OtherHelpPage() {
    const faqs = [
        {
            question: "Do you offer gift cards?",
            answer: "Yes! We offer digital gift cards in various denominations. You can purchase them on our website and they'll be delivered via email instantly."
        },
        {
            question: "Can I use multiple discount codes on one order?",
            answer: "No, only one discount code can be applied per order. The system will automatically apply the code that gives you the best discount."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can reach our customer support team via email at support@forcesports.com, through our contact form, or by calling our helpline. We're available Monday-Saturday, 9 AM - 6 PM IST."
        },
        {
            question: "Do you have a size guide?",
            answer: "Yes! Each product page has a detailed size guide. Click on 'Size Guide' near the size selector to view measurements and find your perfect fit."
        },
        {
            question: "Are your products authentic?",
            answer: "Absolutely! We only sell 100% authentic products sourced directly from authorized distributors and brands. All items come with authenticity guarantees."
        },
        {
            question: "Do you offer wholesale or bulk orders?",
            answer: "Yes, we offer special pricing for bulk orders. Please contact our business team at business@forcesports.com with your requirements for a custom quote."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">OTHERS</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Other Questions</h1>

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
