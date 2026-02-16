import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Force Sports & Wears India",
  description: "High-performance sports apparel and wear designed for the modern athlete in India.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
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
