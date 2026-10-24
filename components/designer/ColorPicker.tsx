"use client";

import { useState, useCallback } from "react";
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 p-1">
        {TSHIRT_COLOR_PRESETS.map(({ label, hex }) => {
          const selected = baseColor === hex;
          return (
            <button
              key={hex}
              type="button"
              title={label}
              onClick={() => {
                setBaseColor(hex);
                setHexInput("");
                setHexError(false);
              }}
              className={[
                "relative h-ks-tap w-ks-tap border border-ks-line-strong p-0",
                selected ? "ring-2 ring-ks-ink ring-offset-2 ring-offset-ks-paper" : "",
              ].join(" ")}
              style={{ backgroundColor: hex }}
              aria-label={label}
              aria-pressed={selected}
            >
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-ks-tap w-ks-tap shrink-0 border border-ks-line-strong" style={{ backgroundColor: baseColor }} aria-hidden="true" />
        <input
          type="text"
          value={hexInput || baseColor}
          onChange={handleHexChange}
          onBlur={() => {
            setHexInput("");
            setHexError(false);
          }}
          placeholder="#FFFFFF"
          maxLength={7}
          className={[
            "min-h-ks-tap flex-1 border bg-ks-paper px-3 font-ks-mono text-sm uppercase",
            hexError ? "border-ks-accent" : "border-ks-line-strong",
          ].join(" ")}
          aria-label="Custom hex colour"
          aria-invalid={hexError}
        />
      </div>
      {hexError && (
        <p className="text-sm text-ks-accent" role="alert">
          Enter a valid hex colour (e.g. #FF5733)
        </p>
      )}
    </div>
  );
}
