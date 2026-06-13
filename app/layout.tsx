import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura AI – Scholarship Finder for African Students",
  description:
    "AI-powered scholarship discovery. Opportunities find you — not the other way around.",
  keywords: ["scholarship", "Africa", "AI", "fellowship", "grant", "funding"],
  openGraph: {
    title: "Aura AI",
    description: "AI-powered scholarship discovery for African students",
    siteName: "Aura AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased custom-scrollbar">{children}</body>
    </html>
  );
}
