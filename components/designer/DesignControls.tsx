"use client";

import { ColorPicker } from "@/components/designer/ColorPicker";
import { UploadZone } from "@/components/designer/UploadZone";
import { MessageCircle } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { TSHIRT_COLOR_PRESETS } from "@/lib/constants";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function DesignControls() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const designFileName = useDesignerStore((s) => s.designFileName);
  const activeView = useDesignerStore((s) => s.activeView);

  const colourName = TSHIRT_COLOR_PRESETS.find((c) => c.hex === baseColor)?.label ?? baseColor;

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const details = [`Shirt colour: ${colourName}`, designFileName ? `Print position: ${activeView}` : null, designFileName ? `Design file: ${designFileName}` : null]
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
        <h2 className="font-sora font-bold text-xl text-white">
          Customise
        </h2>
        <p className="text-sm text-white/60 font-inter mt-1">
          Preview your artwork on a 3D tee, then order on WhatsApp.
        </p>
      </div>

      {/* Upload zone */}
      <UploadZone />

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Color picker */}
      <ColorPicker />

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA buttons */}
      <div className="space-y-3 pt-2 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:p-3 max-lg:space-y-0 max-lg:bg-[#0b0b12]/95 max-lg:backdrop-blur max-lg:border-t max-lg:border-white/10">
        {WHATSAPP_NUMBER ? (
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-sora font-semibold py-3 px-4 rounded-full transition-colors duration-200"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
          </button>
        ) : (
          <a
            href="https://www.kswebwear.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white text-brand-dark font-sora font-semibold py-3 px-4 rounded-full"
          >
            Contact us to order
          </a>
        )}

        <p className="text-center text-xs text-white/40 font-inter max-lg:hidden">
          Your design stays on your device. Minimum 2 shirts.
        </p>
      </div>
    </div>
  );
}
