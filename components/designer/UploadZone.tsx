"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { useFileValidation } from "@/hooks/useFileValidation";
import { sanitizeFileName } from "@/lib/security";
import { areaCenter, DEFAULT_LAYER, FULL_AREA, MIN_LAYER_SIZE } from "@/lib/printArea";
import type { LayerKind } from "@/types/designer";

const COPY = {
  design: { title: "Your design", drop: "Drop an image or", alt: "Design preview" },
  logo: { title: "Logo", drop: "Drop your logo or", alt: "Logo preview" },
} as const;

export function UploadZone({ kind }: { kind: LayerKind }) {
  const side = useDesignerStore((s) => s.activeView);
  const layer = useDesignerStore((s) => s.layers[s.activeView][kind]);
  const setLayerImage = useDesignerStore((s) => s.setLayerImage);
  const clearLayer = useDesignerStore((s) => s.clearLayer);
  const updateLayer = useDesignerStore((s) => s.updateLayer);
  const copy = COPY[kind];
  const designImageURL = layer?.url ?? null;
  const designFileName = layer?.fileName ?? null;
  const { validate } = useFileValidation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);

      const result = await validate(file);

      if (!result.valid) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      // The store revokes the previous object URL for this slot
      setLayerImage(side, kind, result.objectURL, sanitizeFileName(file.name));
      setIsProcessing(false);
    },
    [validate, setLayerImage, side, kind]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset so same file can be selected again
      e.target.value = "";
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    clearLayer(side, kind);
    setError(null);
  }, [clearLayer, side, kind]);

  return (
    <div className="flex flex-col gap-3">
      {!designImageURL ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          aria-label={`Upload ${kind} image`}
          className={[
            "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1.5 border-[1.5px] border-dashed p-4 text-center",
            isDragging ? "border-ks-ink bg-ks-fog" : "border-ks-line-strong hover:bg-ks-fog",
            isProcessing ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <Upload size={22} aria-hidden="true" />
          <span className="text-[15px] font-bold">
            {isProcessing ? "Processing…" : copy.drop}{" "}
            {!isProcessing && <span className="underline">browse</span>}
          </span>
          <span className="font-ks-mono text-[11px] uppercase text-ks-muted">PNG, JPG or SVG · Max 10 MB</span>
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            onChange={handleInputChange}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-ks-line p-3">
          <div className="h-14 w-14 shrink-0 border border-ks-line bg-ks-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={designImageURL} alt={copy.alt} className="h-full w-full object-contain" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{designFileName || copy.title}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-ks-tap items-center text-sm font-bold text-ks-accent underline underline-offset-2"
            >
              Change
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            aria-label={`Remove ${kind}`}
            className="flex h-ks-tap w-ks-tap shrink-0 items-center justify-center border border-ks-line text-ks-ink hover:bg-ks-fog"
          >
            <X size={16} aria-hidden="true" />
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            onChange={handleInputChange}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      )}

      {kind === "design" && layer && (
        <label className="flex min-h-ks-tap cursor-pointer items-center gap-3 text-[15px] font-semibold">
          <input
            type="checkbox"
            checked={layer.full}
            onChange={(e) => {
              const full = e.target.checked;
              const reset = full ? { size: 1, ...areaCenter(FULL_AREA) } : DEFAULT_LAYER.design[side];
              updateLayer(side, kind, { full, ...reset });
            }}
            className="m-0 h-5 w-5 accent-ks-ink"
          />
          Full-size print (whole {side})
        </label>
      )}

      {layer && (
        <label className="flex min-h-ks-tap items-center gap-3 text-[15px]">
          <span className="w-9 font-semibold">Size</span>
          <input
            type="range"
            min={MIN_LAYER_SIZE}
            max={1}
            step={0.01}
            value={layer.size}
            onChange={(e) => updateLayer(side, kind, { size: Number(e.target.value) })}
            className="flex-1 accent-ks-ink"
            aria-label={`${copy.title} size`}
          />
        </label>
      )}

      {error && (
        <p role="alert" className="border border-ks-accent p-3 text-sm text-ks-accent">
          {error}
        </p>
      )}
    </div>
  );
}
