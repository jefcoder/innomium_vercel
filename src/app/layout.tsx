import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talent.innomium.com"),
  title: {
    default: "Innomium Talent | Verified AI/ML Expert Network",
    template: "%s | Innomium Talent",
  },
  description:
    "Innomium connects companies with verified AI/ML experts for consultation, confidential advisory, technical execution, and live competitions.",
  keywords: [
    "AI talent",
    "ML experts",
    "verified AI consultants",
    "AI competitions",
    "machine learning freelancers",
  ],
  openGraph: {
    title: "Innomium Talent | Verified AI/ML Expert Network",
    description:
      "Access trusted AI/ML experts for consultation, execution, and competition.",
    type: "website",
    siteName: "Innomium Talent",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
