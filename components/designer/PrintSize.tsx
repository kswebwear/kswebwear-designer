"use client";

import { useDesignerStore } from "@/store/designerStore";
import type { PrintSize as Size } from "@/types/designer";

const SIZES: { id: Size; label: string }[] = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

export function PrintSize() {
  const printSize = useDesignerStore((s) => s.printSize);
  const setPrintSize = useDesignerStore((s) => s.setPrintSize);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-inter font-semibold text-white/60 uppercase tracking-wide">
        <span className="text-brand-red mr-1.5">3</span>Print size
      </h3>
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
        {SIZES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPrintSize(id)}
            aria-pressed={printSize === id}
            className={[
              "flex-1 py-1.5 rounded-full text-sm font-inter font-medium transition-colors",
              printSize === id ? "bg-brand-red text-white" : "text-white/70 hover:text-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
