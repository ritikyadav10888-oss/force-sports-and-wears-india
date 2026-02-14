import React from "react";

export default function SizeGuidePage() {
    return (
        <main className="min-h-screen pt-40 pb-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">Size Guide</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">Force Sports & Wears India • ELITE FIT PROTOCOL</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-secondary/30 p-10 rounded-[3rem] border border-border/50">
                        <h3 className="text-2xl font-black italic uppercase mb-6 tracking-tight">T-SHIRTS & HOODIES</h3>
                        <div className="space-y-4 font-bold text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE S</span>
                                <span>36-38" CHEST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE M</span>
                                <span>38-40" CHEST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE L</span>
                                <span>40-42" CHEST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XL</span>
                                <span>42-44" CHEST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XXL</span>
                                <span>44-46" CHEST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XXXL</span>
                                <span>46-48" CHEST</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-secondary/30 p-10 rounded-[3rem] border border-border/50">
                        <h3 className="text-2xl font-black italic uppercase mb-6 tracking-tight">TROUSERS & JOGGERS</h3>
                        <div className="space-y-4 font-bold text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE S</span>
                                <span>28-30" WAIST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE M</span>
                                <span>30-32" WAIST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE L</span>
                                <span>32-34" WAIST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XL</span>
                                <span>34-36" WAIST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XXL</span>
                                <span>36-38" WAIST</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">SIZE XXXL</span>
                                <span>38-40" WAIST</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50">
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        * All measurements are in inches and refers to body measurements. Force Sports & Wears India gear is designed with an "Elite Kinetic Fit" – slightly tailored for motion while maintaining a structured silhouette. If you prefer a more relaxed fit, we recommend sizing up.
                    </p>
                </div>
            </div>
        </main>
    );
}
