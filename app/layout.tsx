import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
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
    description: "Design custom t-shirts in 3D. Upload your artwork and see it live.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
