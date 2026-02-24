"use client";

import { ViewToggle } from "@/components/designer/ViewToggle";
import { ColorPicker } from "@/components/designer/ColorPicker";
import { UploadZone } from "@/components/designer/UploadZone";
import { MessageCircle, Download } from "lucide-react";

export function DesignControls() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi! I used the KS Webwear Designer to create a custom t-shirt design. I'd like to place an order. 👕"
    );
    window.open(`https://wa.me/61450000000?text=${message}`, "_blank", "noopener,noreferrer");
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
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-inter font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          aria-label="Order via WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          Order via WhatsApp
        </button>

        <p className="text-center text-xs text-gray-400 font-inter">
          Your design is never uploaded to our servers.
        </p>
      </div>
    </div>
  );
}
