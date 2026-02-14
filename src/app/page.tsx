import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ShopBySports } from "@/components/ShopBySports";
import { Spotlights } from "@/components/Spotlights";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedSection />
      <ShopBySports />
      <Spotlights />
      <NewsletterSignup />
    </main>
  );
}
