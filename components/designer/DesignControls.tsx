"use client";

import { ColorPicker } from "@/components/designer/ColorPicker";
import { LogoSection } from "@/components/designer/LogoSection";
import { UploadZone } from "@/components/designer/UploadZone";
import { PanelStep } from "@/components/designer/PanelStep";
import { SizesQuantity } from "@/components/designer/SizesQuantity";
import { OrderSummary } from "@/components/designer/OrderSummary";
import { useDesignerStore } from "@/store/designerStore";
import { SIZES, TSHIRT_COLOR_PRESETS } from "@/lib/constants";

export function DesignControls() {
  const activeView = useDesignerStore((s) => s.activeView);
  const baseColor = useDesignerStore((s) => s.baseColor);
  const sizes = useDesignerStore((s) => s.sizes);

  const colourName = TSHIRT_COLOR_PRESETS.find((c) => c.hex === baseColor)?.label ?? baseColor;
  const qty = SIZES.reduce((sum, size) => sum + sizes[size], 0);

  return (
    <aside aria-label="Customise" className="flex min-w-0 flex-[1_1_23.75rem] flex-col border border-ks-line">
      <div className="flex flex-col gap-1.5 px-6 pb-2 pt-6">
        <h1 className="ks-display text-3xl leading-none tracking-[-0.02em]">Design your shirt</h1>
        <p className="text-[15px] leading-normal text-ks-muted">
          Editing the <strong className="text-ks-ink">{activeView}</strong>. Drag the print to move it; drag the red
          corner to resize.
        </p>
      </div>

      <PanelStep number="01" title="Your design">
        <UploadZone kind="design" />
        <LogoSection key={activeView} />
      </PanelStep>

      <PanelStep number="02" title="Shirt colour" aside={colourName}>
        <ColorPicker />
      </PanelStep>

      <PanelStep number="03" title="Sizes & quantity" aside={`${qty} ${qty === 1 ? "shirt" : "shirts"}`}>
        <SizesQuantity />
      </PanelStep>

      <div className="sticky bottom-0 z-30">
        <OrderSummary />
      </div>
    </aside>
  );
}
