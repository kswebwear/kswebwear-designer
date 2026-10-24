"use client";

import { useCallback } from "react";
import { TShirtViewer } from "@/components/designer/TShirtViewer";
import { DesignControls } from "@/components/designer/DesignControls";
import { ViewToggle } from "@/components/designer/ViewToggle";
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
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full h-full min-h-[560px]">
      {/* 3D Viewer panel */}
      <div className="relative flex-none h-[440px] lg:flex-1 lg:h-auto lg:min-h-0 rounded-3xl overflow-hidden border border-white/10">
        <TShirtViewer
          baseColor={baseColor}
          layers={layers}
          activeView={activeView}
          onModelLoaded={handleModelLoaded}
        />
        {isLoading && <LoadingOverlay />}
        <p className="hidden sm:block absolute top-4 left-5 text-xs font-inter text-white/50 pointer-events-none">
          Drag to rotate · scroll or +/− to zoom
        </p>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 z-10">
          <ViewToggle />
        </div>
      </div>

      {/* Controls sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-[#14141f] rounded-3xl p-5 border border-white/10 flex flex-col min-h-0">
        <DesignControls />
      </div>
    </div>
  );
}
