"use client";

import { useCallback } from "react";
import { TShirtViewer } from "@/components/designer/TShirtViewer";
import { DesignControls } from "@/components/designer/DesignControls";
import { LoadingOverlay } from "@/components/designer/LoadingOverlay";
import { useDesignerStore } from "@/store/designerStore";

export function DesignerShell() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const layers = useDesignerStore((s) => s.layers);
  const activeView = useDesignerStore((s) => s.activeView);
  const isLoading = useDesignerStore((s) => s.isLoading);
  const setIsLoading = useDesignerStore((s) => s.setIsLoading);

  const handleModelLoaded = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="flex flex-wrap items-start gap-6">
      <section
        aria-label="Shirt preview"
        className="relative h-[27.5rem] min-w-0 flex-[999_1_40rem] bg-ks-fog lg:h-[47.5rem]"
      >
        <TShirtViewer baseColor={baseColor} layers={layers} activeView={activeView} onModelLoaded={handleModelLoaded} />
        {isLoading && <LoadingOverlay />}
      </section>
      <DesignControls />
    </div>
  );
}
