import React from "react";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">Terms of Service</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">Force Sports & Wears India • LAST UPDATED FEB 2026</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">01. ELIGIBILITY</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            By accessing the Force Sports & Wears India platform, you agree to abide by our professional standards. Our elite drops are available to athletes who provide accurate shipping and billing information.
                        </p>
                    </section>
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">02. INTELLECTUAL PROPERTY</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            The Force logo, brand designs, and high-performance product silhouettes are the exclusive property of Force Sports & Wears India. Unauthorized use or reproduction is strictly prohibited.
                        </p>
                    </section>
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">03. LIMITATION OF LIABILITY</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Force Sports & Wears India provides the gear; your performance is your own. We are not liable for any injuries sustained while wearing our gear, as individual training protocols vary.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
