"use client";

import { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { TSHIRT_COLOR_PRESETS } from "@/lib/constants";

function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function ColorPicker() {
  const baseColor = useDesignerStore((s) => s.baseColor);
  const setBaseColor = useDesignerStore((s) => s.setBaseColor);
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState(false);

  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.trim();
      if (!value.startsWith("#")) value = `#${value}`;
      setHexInput(value);

      if (isValidHex(value)) {
        setHexError(false);
        setBaseColor(value.toUpperCase());
      } else {
        setHexError(value.length > 1);
      }
    },
    [setBaseColor]
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-inter font-semibold text-gray-700 uppercase tracking-wide">
        Shirt Color
      </h3>

      {/* Preset swatches */}
      <div className="grid grid-cols-4 gap-2">
        {TSHIRT_COLOR_PRESETS.map(({ label, hex }) => (
          <button
            key={hex}
            title={label}
            onClick={() => {
              setBaseColor(hex);
              setHexInput("");
              setHexError(false);
            }}
            className={[
              "relative w-10 h-10 rounded-full border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2",
              baseColor === hex
                ? "border-brand-red scale-110 shadow-md"
                : "border-gray-200 hover:scale-105 hover:border-gray-400",
            ].join(" ")}
            style={{ backgroundColor: hex }}
            aria-label={`Select ${label} color`}
            aria-pressed={baseColor === hex}
          >
            {baseColor === hex && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check
                  className="w-4 h-4 drop-shadow"
                  style={{ color: isColorDark(hex) ? "#fff" : "#000" }}
                  strokeWidth={3}
                />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Custom hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border border-gray-200 flex-shrink-0 transition-colors"
          style={{ backgroundColor: baseColor }}
          aria-hidden="true"
        />
        <input
          type="text"
          value={hexInput || baseColor}
          onChange={handleHexChange}
          placeholder="#FFFFFF"
          maxLength={7}
          className={[
            "flex-1 text-sm font-mono px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-colors",
            hexError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white",
          ].join(" ")}
          aria-label="Custom hex color"
          aria-invalid={hexError}
        />
      </div>
      {hexError && (
        <p className="text-xs text-red-500" role="alert">
          Enter a valid hex color (e.g. #FF5733)
        </p>
      )}
    </div>
  );
}

function isColorDark(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
