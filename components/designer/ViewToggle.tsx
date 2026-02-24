"use client";

import { useDesignerStore } from "@/store/designerStore";
import type { ActiveView } from "@/types/designer";

export function ViewToggle() {
  const activeView = useDesignerStore((s) => s.activeView);
  const setActiveView = useDesignerStore((s) => s.setActiveView);

  const views: { id: ActiveView; label: string }[] = [
    { id: "front", label: "Front" },
    { id: "back", label: "Back" },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full">
      {views.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveView(id)}
          className={[
            "flex-1 py-2 px-4 rounded-md text-sm font-inter font-medium transition-all duration-200",
            activeView === id
              ? "bg-brand-red text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60",
          ].join(" ")}
          aria-pressed={activeView === id}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
