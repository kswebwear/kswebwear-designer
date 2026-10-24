"use client";

import { useState } from "react";
import { UploadZone } from "@/components/designer/UploadZone";
import { useDesignerStore } from "@/store/designerStore";

export function LogoSection() {
  const side = useDesignerStore((s) => s.activeView);
  const hasLogo = useDesignerStore((s) => !!s.layers[s.activeView].logo);
  const clearLayer = useDesignerStore((s) => s.clearLayer);
  const [enabled, setEnabled] = useState(hasLogo);

  const toggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) clearLayer(side, "logo");
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-inter font-semibold text-white/60 uppercase tracking-wide cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggle(e.target.checked)}
          className="accent-brand-red w-4 h-4"
        />
        <span>
          <span className="text-brand-red mr-1.5">2</span>Add a logo
        </span>
      </label>
      {enabled && <UploadZone kind="logo" hideTitle />}
    </div>
  );
}
