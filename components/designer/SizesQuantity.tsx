"use client";

import { Minus, Plus } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { SIZES } from "@/lib/constants";

const stepper = "flex min-h-ks-tap flex-1 items-center justify-center bg-transparent text-ks-ink hover:bg-ks-fog";

export function SizesQuantity() {
  const sizes = useDesignerStore((s) => s.sizes);
  const setSize = useDesignerStore((s) => s.setSize);

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center border border-ks-line">
          <span className="ks-label pt-2 text-ks-muted">{size}</span>
          <span className="py-0.5 text-xl font-extrabold" aria-live="polite" aria-label={`${size} quantity`}>
            {sizes[size]}
          </span>
          <div className="flex w-full border-t border-ks-line">
            <button
              type="button"
              onClick={() => setSize(size, sizes[size] - 1)}
              aria-label={`One fewer ${size}`}
              className={`${stepper} border-r border-ks-line`}
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setSize(size, sizes[size] + 1)} aria-label={`One more ${size}`} className={stepper}>
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
