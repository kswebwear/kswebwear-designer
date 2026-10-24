"use client";

import { ColorPicker } from "@/components/designer/ColorPicker";
import { LogoSection } from "@/components/designer/LogoSection";
import { UploadZone } from "@/components/designer/UploadZone";
import { MessageCircle } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { TSHIRT_COLOR_PRESETS } from "@/lib/constants";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function DesignControls() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const layers = useDesignerStore((s) => s.layers);
  const activeView = useDesignerStore((s) => s.activeView);

  const colourName = TSHIRT_COLOR_PRESETS.find((c) => c.hex === baseColor)?.label ?? baseColor;

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const printLines = (["front", "back"] as const).flatMap((side) =>
      (["design", "logo"] as const).flatMap((kind) => {
        const layer = layers[side][kind];
        return layer ? [`${side} ${kind}: ${layer.fileName}`] : [];
      })
    );
    const details = [`Shirt colour: ${colourName}`, ...printLines].join("\n");
    const message = encodeURIComponent(
      `Hi! I used the KS Webwear Designer to create a custom t-shirt design. I'd like to place an order. 👕\n${details}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto lg:-mr-4 lg:pr-4 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
      {/* Header */}
      <div>
        <h2 className="font-sora font-bold text-xl text-white">
          Customise
        </h2>
      </div>

      {/* Upload zone */}
      <p className="text-xs font-inter text-white/60">
        Editing the <span className="font-semibold text-white capitalize">{activeView}</span> of the shirt. Drag a print to move it, or its red corner dot to resize. Use the Front / Back switch to change sides.
      </p>
      <UploadZone kind="design" />
      <LogoSection key={activeView} />

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Color picker */}
      <ColorPicker />

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA buttons */}
      <div className="space-y-3 pt-2 lg:sticky lg:bottom-0 lg:bg-[#14141f] max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:p-3 max-lg:space-y-0 max-lg:bg-[#0b0b12]/95 max-lg:backdrop-blur max-lg:border-t max-lg:border-white/10">
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

        <p className="text-center text-xs text-white/60 font-inter max-lg:hidden">
          Your design stays on your device. Minimum 2 shirts.
        </p>
      </div>
    </div>
  );
}
