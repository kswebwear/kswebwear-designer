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
    <div className="flex flex-col gap-3">
      <label className="flex min-h-ks-tap cursor-pointer items-center gap-3 text-[15px] font-semibold">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggle(e.target.checked)}
          className="m-0 h-5 w-5 accent-ks-ink"
        />
        Add a small logo (chest or sleeve)
      </label>
      {enabled && <UploadZone kind="logo" />}
    </div>
  );
}
