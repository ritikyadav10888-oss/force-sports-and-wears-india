import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

// Set the base URL for metadata
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : new URL('https://forcesports.in');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Force Sports & Wears India | Premium Athletic Gear",
    template: "%s | Force Sports India"
  },
  description: "Discover high-performance sports apparel and wear designed for the modern athlete in India. Shop premium activewear, jerseys, and accessories.",
  keywords: ["sports wear in India", "athletic apparel", "sports jersey India", "Force Sports", "activewear", "performance gear", "custom jerseys"],
  authors: [{ name: "Force Sports Team" }],
  creator: "Force Sports India",
  publisher: "Force Sports India",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    title: "Force Sports & Wears India",
    description: "High-performance sports apparel and wear designed for the modern athlete in India.",
    siteName: "Force Sports India",
    images: [{
      url: "/logo.png",
      width: 800,
      height: 600,
      alt: "Force Sports India Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Force Sports & Wears India",
    description: "Premium athletic gear for the modern athlete.",
    images: ["/logo.png"],
    creator: "@forcesports_in",
  },
  alternates: {
    canonical: './',
  }
};

import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased font-sans flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
