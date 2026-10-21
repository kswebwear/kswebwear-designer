"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { useFileValidation } from "@/hooks/useFileValidation";
import { sanitizeFileName } from "@/lib/security";

export function UploadZone() {
  const { designImageURL, designFileName, setDesignImage, clearDesign } =
    useDesignerStore();
  const { validate } = useFileValidation();
  const inputRef = useRef<HTMLInputElement>(null);
  const prevURLRef = useRef<string | null>(null);

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

      // Revoke previous object URL to prevent memory leaks
      if (prevURLRef.current) {
        URL.revokeObjectURL(prevURLRef.current);
      }
      prevURLRef.current = result.objectURL;

      setDesignImage(result.objectURL, sanitizeFileName(file.name));
      setIsProcessing(false);
    },
    [validate, setDesignImage]
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
    if (prevURLRef.current) {
      URL.revokeObjectURL(prevURLRef.current);
      prevURLRef.current = null;
    }
    clearDesign();
    setError(null);
  }, [clearDesign]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-inter font-semibold text-white/60 uppercase tracking-wide">
        <span className="text-brand-red mr-1.5">1</span>Your design
      </h3>

      {!designImageURL ? (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload design image"
          className={[
            "relative border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200",
            isDragging
              ? "border-brand-red bg-brand-red/5 scale-[1.01]"
              : "border-white/20 hover:border-brand-red/70 hover:bg-white/5",
            isProcessing ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
            {isProcessing ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-brand-red animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-white/60" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-inter font-medium text-white">
              {isProcessing ? "Processing…" : "Drop your design here"}
            </p>
            <p className="text-xs text-white/50 mt-0.5">or click to browse</p>
          </div>

          <p className="text-xs text-white/40">PNG, JPG or SVG · Max 10MB</p>


          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
          />
        </div>
      ) : (
        /* Design preview */
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
          {/* Thumbnail */}
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={designImageURL}
              alt="Design preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-inter font-medium text-white truncate">
              {designFileName || "Design"}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-brand-red underline underline-offset-2 mt-0.5"
            >
              Change
            </button>
          </div>

          <button
            onClick={handleClear}
            aria-label="Remove design"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 bg-red-950/40 border border-red-500/40 rounded-lg"
        >
          <ImageIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
