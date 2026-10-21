"use client";

import { useState, useCallback } from "react";
import { TShirtViewer } from "@/components/designer/TShirtViewer";
import { DesignControls } from "@/components/designer/DesignControls";
import { LoadingOverlay } from "@/components/designer/LoadingOverlay";
import { useDesignerStore } from "@/store/designerStore";

export function DesignerShell() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const designImageURL = useDesignerStore((s) => s.designImageURL);
  const activeView = useDesignerStore((s) => s.activeView);
  const isLoading = useDesignerStore((s) => s.isLoading);
  const setIsLoading = useDesignerStore((s) => s.setIsLoading);

  const handleModelLoaded = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full h-full min-h-[600px]">
      {/* 3D Viewer panel */}
      <div className="relative flex-none h-[440px] lg:flex-1 lg:h-auto lg:min-h-0 rounded-xl overflow-hidden">
        <TShirtViewer
          baseColor={baseColor}
          designImageURL={designImageURL}
          activeView={activeView}
          onModelLoaded={handleModelLoaded}
        />
        {isLoading && <LoadingOverlay />}
      </div>

      {/* Controls sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
        <DesignControls />
      </div>
    </div>
  );
}
