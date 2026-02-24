import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KS Webwear Designer | Custom T-Shirt Design Tool",
  description:
    "Upload your artwork and visualise it on a 3D t-shirt model in real time. Design custom t-shirts for your brand, team, or event.",
  keywords: ["custom t-shirt", "t-shirt designer", "3D t-shirt", "print on demand", "KS Webwear"],
  authors: [{ name: "KS Webwear" }],
  openGraph: {
    title: "KS Webwear Designer",
    description: "Design custom t-shirts in 3D — upload your artwork and see it live.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A1A2E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
