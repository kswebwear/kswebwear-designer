"use client";

import { useDesignerStore } from "@/store/designerStore";
import type { ActiveView } from "@/types/designer";

const views: { id: ActiveView; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
];

export function ViewToggle() {
  const activeView = useDesignerStore((s) => s.activeView);
  const setActiveView = useDesignerStore((s) => s.setActiveView);

  return (
    <div role="group" aria-label="Shirt side" className="flex border border-ks-line bg-ks-paper p-1">
      {views.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActiveView(id)}
          aria-pressed={activeView === id}
          className={[
            "min-h-ks-tap min-w-[5.5rem] px-4 text-[15px] font-bold",
            activeView === id ? "bg-ks-ink text-ks-paper" : "bg-transparent text-ks-ink hover:bg-ks-fog",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
