import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ShopBySports } from "@/components/ShopBySports";
import { Spotlights } from "@/components/Spotlights";
import { NewsletterSignup } from "@/components/NewsletterSignup";

import { api } from "@/lib/api-client";

export default async function Home() {
  const { products } = await api.getProducts().catch(() => ({ products: [] }));

  return (
    <main className="min-h-screen">
      <Hero />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': 'https://forcesports.in/#organization',
                name: 'Force Sports & Wears India',
                url: 'https://forcesports.in',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://forcesports.in/logo.png',
                  width: 112,
                  height: 112
                },
                sameAs: [
                  'https://www.instagram.com/forcesports_india/',
                  'https://facebook.com/forcesportsindia'
                ]
              },
              {
                '@type': 'WebSite',
                '@id': 'https://forcesports.in/#website',
                url: 'https://forcesports.in',
                name: 'Force Sports India',
                description: 'Premium Athletic Gear and Sports Apparel',
                publisher: {
                  '@id': 'https://forcesports.in/#organization'
                }
              }
            ]
          })
        }}
      />
      <FeaturedSection products={products} />
      <ShopBySports />
      <Spotlights />
      <NewsletterSignup />
    </main>
  );
}
