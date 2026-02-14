"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AccountHelpPage() {
    const faqs = [
        {
            question: "How do I create an account?",
            answer: "Click on the 'Sign In' button in the top right corner, then select 'Join Us' to create a new account. Fill in your email, password, and personal details to complete registration."
        },
        {
            question: "Can I change my account details?",
            answer: "Yes, sign in to your account and go to 'Account Settings' where you can update your name, email, password, and other personal information."
        },
        {
            question: "How can I delete my account?",
            answer: "To delete your account, go to Account Settings > Privacy > Delete Account. Please note this action is permanent and cannot be undone."
        },
        {
            question: "How can I deactivate my account?",
            answer: "You can temporarily deactivate your account from Account Settings > Privacy > Deactivate Account. You can reactivate it anytime by signing in again."
        },
        {
            question: "I forgot my password, what should I do?",
            answer: "Click 'Sign In' and then 'Forgot Password'. Enter your email address and we'll send you a link to reset your password."
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-foreground transition-colors">HELP CENTER</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">ACCOUNT SETTINGS AND SHOPPING</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">Account Settings</h1>

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
