"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShippingHelpPage() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Delivery times may vary based on your location and product availability."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to most countries worldwide. International shipping times vary by destination, typically 10-15 business days. Additional customs fees may apply."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by signing in to your account and viewing order history."
        },
        {
            question: "What are the shipping costs?",
            answer: "Shipping costs vary based on your location and selected shipping method. Free standard shipping is available on orders over ₹2,999. Exact costs are calculated at checkout."
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "If your order hasn't shipped yet, contact our support team immediately to update the address. Once shipped, address changes are not possible."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">SHIPPING AND DISPATCH</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Shipping and Dispatch</h1>

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
