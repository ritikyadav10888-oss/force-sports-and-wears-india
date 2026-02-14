import React from "react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">Force Sports & Wears India • LAST UPDATED FEB 2026</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">01. DATA COLLECTION</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            At Force Sports & Wears India, we collect information that helps us provide you with the most elite athletic gear and a seamless shopping experience. This includes your name, shipping address, and payment information during checkout.
                        </p>
                    </section>
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">02. PERFORMANCE TRACKING</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We use cookies and similar technologies to understand how you navigate our platform. This allows us to optimize our digital infrastructure and ensure you receive early access to the drops you care about most.
                        </p>
                    </section>
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">03. SECURITY PROTOCOLS</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Your data is stored using industry-standard encryption protocols. We do not sell your personal information to third parties. Your trust is the foundation of the Force Sports & Wears India Collective.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
