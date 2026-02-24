import type { Metadata } from "next";
import { Suspense } from "react";
import { DesignerShell } from "@/components/designer/DesignerShell";

export const metadata: Metadata = {
  title: "Designer | KS Webwear",
  description: "Customise your t-shirt with your own artwork. Upload a PNG, JPG or SVG and see it on a 3D model instantly.",
};

export default function DesignerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="section-container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
              <span className="text-white font-sora font-bold text-sm">KS</span>
            </div>
            <div>
              <span className="font-sora font-bold text-brand-dark">KS Webwear</span>
              <span className="hidden sm:inline text-brand-muted font-inter text-sm ml-2">Designer</span>
            </div>
          </div>
          <a
            href="https://kswebwear.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-inter text-brand-muted hover:text-brand-dark transition-colors"
          >
            Visit Store ↗
          </a>
        </div>
      </header>

      {/* Main designer area */}
      <div className="section-container py-6 lg:py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="font-sora font-bold text-2xl lg:text-3xl text-brand-dark">
            T-Shirt Designer
          </h1>
          <p className="font-inter text-brand-muted mt-1 text-sm lg:text-base">
            Upload your artwork to preview it on a 3D t-shirt. Use the controls to choose colours and toggle views.
          </p>
        </div>

        {/* Designer shell — client component with 3D viewer */}
        <Suspense
          fallback={
            <div className="w-full h-[600px] bg-gray-100 rounded-xl animate-pulse" />
          }
        >
          <DesignerShell />
        </Suspense>

        {/* Instructions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Upload Artwork",
              desc: "Drop your PNG, JPG, or SVG design file into the upload zone.",
            },
            {
              step: "2",
              title: "Customise",
              desc: "Choose your t-shirt colour and toggle between front and back views.",
            },
            {
              step: "3",
              title: "Order",
              desc: "Happy with the preview? Hit 'Order via WhatsApp' to get in touch.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <span className="w-7 h-7 rounded-full bg-brand-red text-white text-sm font-sora font-bold flex items-center justify-center flex-shrink-0">
                {step}
              </span>
              <div>
                <h3 className="font-sora font-semibold text-brand-dark text-sm">{title}</h3>
                <p className="font-inter text-brand-muted text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 py-6">
        <div className="section-container text-center">
          <p className="text-xs text-brand-muted font-inter">
            © {new Date().getFullYear()} KS Webwear · Your design stays on your device and is never uploaded to our servers.
          </p>
        </div>
      </footer>
    </main>
  );
}
