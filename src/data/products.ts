export interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // Base price in INR
    image: string;
    images: string[];
    category: string;
    specs: { label: string; value: string }[];
    highlights: string[];
    isNew?: boolean;
    isFeatured?: boolean;
}

export const products: Product[] = [
    {
        id: "1",
        name: "Apex Precision Oversized Tee",
        description: "The definitive standard in athletic-casual layering. Engineered with our proprietary Apex-Weight cotton, this tee offers a structured silhouette that maintains its form throughout high-intensity movements. A fusion of street-ready aesthetics and pure performance ergonomics.",
        price: 2400,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1780&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1554568212-3c1a4e6747f1?q=80&w=1780&auto=format&fit=crop"
        ],
        category: "T-Shirts",
        specs: [
            { label: "Fabric", value: "100% Heavyweight Combed Cotton" },
            { label: "Weight", value: "280 GSM" },
            { label: "Fit", value: "Professional Oversized" },
            { label: "Origin", value: "Engineered in India" }
        ],
        highlights: [
            "Drop-shoulder ergonomic construction",
            "Reinforced crew-neck ribbing",
            "Signature heat-pressed force detailing",
            "Pre-shrunk for consistent fit"
        ],
        isNew: true,
        isFeatured: true,
    },
    {
        id: "2",
        name: "Vantage Stealth Logo Cap",
        description: "A masterclass in minimalist headwear. The Vantage Stealth combines a low-profile 6-panel silhouette with high-performance breathable fabrics. Designed for the athlete who commands presence through subtlety. Featuring a precision-curved brim and laser-etched hardware.",
        price: 1800,
        image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1936&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1936&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1936&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1572427735460-3f74971de307?q=80&w=1936&auto=format&fit=crop"
        ],
        category: "Caps",
        specs: [
            { label: "Material", value: "Cotton-Polyester Performance Blend" },
            { label: "Strap", value: "Adjustable Genuine Leather" },
            { label: "Structure", value: "6-Panel Structured Crown" },
            { label: "Internal", value: "Moisture-Wicking Sweatband" }
        ],
        highlights: [
            "Water-resistant finish",
            "Ventilated eyelets for thermal regulation",
            "Matte-black hardware",
            "Discreet interior branding"
        ],
        isNew: true,
    },
    {
        id: "3",
        name: "Echelon Tactical Hoodie",
        description: "Unrivaled thermal protection and comfort. The Echelon Tactical Hoodie is built with ultra-dense double-faced fleece, providing a barrier against the elements without sacrificing breathability. Its structured silhouette ensures you look elite whether you're in pre-match focus or post-training recovery.",
        price: 4500,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512446813987-430332b7aee0?q=80&w=1887&auto=format&fit=crop"
        ],
        category: "Hoodies",
        specs: [
            { label: "Lining", value: "Brushed Micro-Fleece" },
            { label: "Outer", value: "Elite-Grade Cotton Blend" },
            { label: "Pocket", value: "Kangaroo with Hidden Zip" },
            { label: "Cuffs", value: "Double-Stitched Ribbed" }
        ],
        highlights: [
            "Heavyweight 450 GSM fleece",
            "3-panel crossover ergonomic hood",
            "Articulated sleeve construction",
            "Tone-on-tone silicon branding"
        ],
        isFeatured: true,
    },
    {
        id: "4",
        name: "Vector Tech Utility Trousers",
        description: "Mobility redefined. The Vector Tech Trousers integrate 4-way stretch ripstop fabric with a tapered athletic cut. Water-repellent and wind-resistant, these trousers are built for the athlete who refuses to let conditions dictate their training routine. Elite utility for every terrain.",
        price: 6500,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop"
        ],
        category: "Trousers",
        specs: [
            { label: "Fabric", value: "Nylon-Spandex Ripstop" },
            { label: "Closure", value: "Elasticated Waist with Drawstring" },
            { label: "Pockets", value: "Dual Side Welts + Cargo Zip" },
            { label: "Finish", value: "DWR Water-Repellent Coating" }
        ],
        highlights: [
            "Anatomical knee articulation",
            "Reinforced high-stress seams",
            "Adjustable snap-cuff ankles",
            "Lightweight yet high-durability weave"
        ],
    },
    {
        id: "5",
        name: "Force Elite Tracksuit Set",
        description: "The peak of performance coordination. Our Force Elite Tracksuit is a two-piece systems-build designed for total synergy. High-wicking aero-fabrics manage thermal output during warmup, while the precision tailoring ensures zero drag during heavy motion. A uniform for the serious competitor.",
        price: 9500,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1920&auto=format&fit=crop"
        ],
        category: "Tracksuits",
        specs: [
            { label: "Composition", value: "Premium Aero-Stretch Poly" },
            { label: "Set", value: "Jacket + Tapered Joggers" },
            { label: "Breathability", value: "Laser-Cut Zone Ventilation" },
            { label: "Zips", value: "YKK Semi-Auto Lock" }
        ],
        highlights: [
            "Advanced moisture-management technology",
            "Reflective safety detailing for low light",
            "Ergonomic fit-to-frame silhouette",
            "The professional's choice for international travel and warmups"
        ],
        isFeatured: true,
    },
];
