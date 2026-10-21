import type { Metadata } from "next";
import { Suspense } from "react";
import { DesignerShell } from "@/components/designer/DesignerShell";

export const metadata: Metadata = {
  title: "Designer | KS Webwear",
  description: "Customise your t-shirt with your own artwork. Upload a PNG, JPG or SVG and see it on a 3D model instantly.",
};

export default function DesignerPage() {
  return (
    <main className="min-h-screen lg:h-screen flex flex-col bg-[#0b0b12] text-white">
      <header className="border-b border-white/10 bg-[#0b0b12]/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="section-container py-3 flex items-center justify-between gap-4">
          <a href="https://www.kswebwear.com.au" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <span className="text-brand-navy font-sora font-extrabold text-sm">KS</span>
            </div>
            <span className="font-sora font-bold">
              KS Webwear <span className="hidden sm:inline text-white/50 font-medium ml-1">Designer</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-inter text-white/80">
            <a href="https://www.kswebwear.com.au/#services" className="hover:text-white transition-colors">Services</a>
            <a href="https://www.kswebwear.com.au/#work" className="hover:text-white transition-colors">Our Work</a>
            <a href="https://www.kswebwear.com.au/#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <a
            href="https://www.kswebwear.com.au"
            className="text-sm font-sora font-semibold rounded-full border-2 border-white/80 px-4 py-1.5 hover:bg-white hover:text-brand-dark transition-colors"
          >
            Back to store
          </a>
        </div>
      </header>

      <div className="section-container w-full flex-1 min-h-0 py-4 pb-24 lg:py-5">
        <h1 className="sr-only">T-Shirt Designer</h1>
        <Suspense
          fallback={<div className="w-full h-[600px] bg-white/5 rounded-3xl animate-pulse" />}
        >
          <DesignerShell />
        </Suspense>
      </div>
    </main>
  );
}
