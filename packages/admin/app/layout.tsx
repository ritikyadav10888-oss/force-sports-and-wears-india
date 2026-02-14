import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Force E-Commerce - Admin Panel",
    description: "Admin dashboard for Force E-Commerce platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
