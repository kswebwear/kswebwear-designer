"use client";

import { MessageCircle } from "lucide-react";
import Button from "@/components/ks/Button";
import { useDesignerStore } from "@/store/designerStore";
import { SIZES, TSHIRT_COLOR_PRESETS, WHATSAPP_NUMBER } from "@/lib/constants";
import { estimate, estimateBreakdown, estimateTotal } from "@/lib/pricing";

export function OrderSummary() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const sizes = useDesignerStore((s) => s.sizes);
  const layers = useDesignerStore((s) => s.layers);

  const qty = SIZES.reduce((sum, size) => sum + sizes[size], 0);
  const hasFront = Object.keys(layers.front).length > 0;
  const hasBack = Object.keys(layers.back).length > 0;
  const result = estimate(qty, hasBack);

  const colourName = TSHIRT_COLOR_PRESETS.find((c) => c.hex === baseColor)?.label ?? baseColor;
  const sizeLine = SIZES.filter((size) => sizes[size] > 0)
    .map((size) => `${size} × ${sizes[size]}`)
    .join(", ");
  const sidesLine = hasFront && hasBack ? "front and back" : hasBack ? "back only" : "front only";

  const message = [
    "Hi! I used the KS Web & Wear designer and I'd like to order.",
    `Shirt colour: ${colourName}`,
    `Sizes: ${sizeLine || "not chosen yet"}`,
    `Print: ${sidesLine}`,
    `Estimate: ${estimateTotal(result)} (${estimateBreakdown(result)})`,
  ].join("\n");
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col gap-4 bg-ks-fog p-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="ks-label text-ks-muted">Estimate</span>
          <span className="text-sm text-ks-body">{estimateBreakdown(result)}</span>
        </div>
        <span className="ks-display text-4xl leading-none" aria-live="polite">
          {estimateTotal(result)}
        </span>
      </div>
      <Button href={href} size="lg" className="w-full" icon={<MessageCircle size={20} aria-hidden="true" />}>
        Send order on WhatsApp
      </Button>
      <p className="text-center text-[13px] leading-normal text-ks-muted">
        Your design stays on your device until you send it. We reply with a proof before printing.
      </p>
    </div>
  );
}
