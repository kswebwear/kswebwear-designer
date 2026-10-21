"use client";

import { ViewToggle } from "@/components/designer/ViewToggle";
import { ColorPicker } from "@/components/designer/ColorPicker";
import { UploadZone } from "@/components/designer/UploadZone";
import { MessageCircle } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function DesignControls() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const designFileName = useDesignerStore((s) => s.designFileName);

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const details = [`Shirt colour: ${baseColor}`, designFileName ? `Design file: ${designFileName}` : null]
      .filter(Boolean)
      .join("\n");
    const message = encodeURIComponent(
      `Hi! I used the KS Webwear Designer to create a custom t-shirt design. I'd like to place an order. 👕\n${details}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="font-sora font-bold text-xl text-brand-dark">
          Customise
        </h2>
        <p className="text-sm text-brand-muted font-inter mt-1">
          Upload your artwork and choose a colour.
        </p>
      </div>

      {/* View toggle */}
      <ViewToggle />

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Upload zone */}
      <UploadZone />

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Color picker */}
      <ColorPicker />

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA buttons */}
      <div className="space-y-3 pt-2">
        {WHATSAPP_NUMBER ? (
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-inter font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
          </button>
        ) : (
          <a
            href="https://kswebwear.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white font-inter font-semibold py-3 px-4 rounded-xl"
          >
            Contact us to order
          </a>
        )}

        <p className="text-center text-xs text-gray-400 font-inter">
          Your design is never uploaded to our servers.
        </p>
      </div>
    </div>
  );
}
