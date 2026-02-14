"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function OrdersHelpPage() {
    const faqs = [
        {
            question: "How can I track my order?",
            answer: "Sign in to your account and go to 'Order History' to view all your orders. Click on any order to see detailed tracking information and current status."
        },
        {
            question: "My order hasn't arrived, what should I do?",
            answer: "First, check your tracking information to see the current status. If the delivery date has passed, contact our support team with your order number and we'll investigate immediately."
        },
        {
            question: "Can I cancel my order?",
            answer: "You can cancel your order within 24 hours of placing it, as long as it hasn't shipped yet. Go to Order History, select the order, and click 'Cancel Order'."
        },
        {
            question: "I received the wrong item, what should I do?",
            answer: "We apologize for the error. Please contact our support team immediately with your order number and photos of the item received. We'll arrange a replacement at no additional cost."
        },
        {
            question: "Can I modify my order after placing it?",
            answer: "Orders can only be modified within 1 hour of placement and before they're processed for shipping. Contact support immediately if you need to make changes."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">ORDER STATUS AND ISSUES</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Order Status and Issues</h1>

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
