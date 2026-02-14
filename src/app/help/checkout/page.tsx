"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CheckoutHelpPage() {
    const faqs = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and digital wallets like Apple Pay and Google Pay."
        },
        {
            question: "Is it safe to use my credit card on your website?",
            answer: "Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. All transactions are processed securely through our payment partners."
        },
        {
            question: "Can I save my payment information for future purchases?",
            answer: "Yes, you can securely save your payment methods in your account settings for faster checkout on future orders."
        },
        {
            question: "Why was my payment declined?",
            answer: "Payment declines can happen for various reasons including insufficient funds, incorrect card details, or security restrictions. Please contact your bank or try a different payment method."
        },
        {
            question: "Can I use multiple payment methods for one order?",
            answer: "Currently, we only support one payment method per order. You cannot split payment between multiple cards or methods."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">CHECKOUT AND PAYMENT</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Checkout and Payment</h1>

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
