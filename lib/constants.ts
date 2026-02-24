import type { ColorPreset, DesignPlacement, UVRegion } from "@/types/designer";

// Texture canvas size (pixels)
export const TEXTURE_SIZE = 2048;

/**
 * UV region pixel coordinates on the 2048x2048 canvas texture.
 * These MUST match the UV layout defined in the Blender model.
 * Front panel occupies the upper half, back panel the lower half.
 *
 * If you re-export the GLB with a different UV layout, update these values.
 */
export const UV_REGIONS: Record<"front" | "back", UVRegion> = {
  front: {
    x: 307,
    y: 205,
    width: 1434,
    height: 921,
  },
  back: {
    x: 307,
    y: 1331,
    width: 1434,
    height: 615,
  },
};

/**
 * How to place the user's design image within the UV panel.
 * Ratios are relative to the UV region dimensions.
 */
export const DESIGN_PLACEMENT: Record<"front" | "back", DesignPlacement> = {
  front: {
    offsetXRatio: 0.5,   // horizontally centered
    offsetYRatio: 0.28,  // upper chest area
    maxWidthRatio: 0.65, // up to 65% of panel width
    maxHeightRatio: 0.45, // up to 45% of panel height
  },
  back: {
    offsetXRatio: 0.5,
    offsetYRatio: 0.28,
    maxWidthRatio: 0.65,
    maxHeightRatio: 0.45,
  },
};

export const MAX_FILE_SIZE_BYTES = 10_000_000; // 10 MB
export const MAX_IMAGE_DIMENSION = 4096; // pixels

export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
] as const;

export const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

export const TSHIRT_COLOR_PRESETS: ColorPreset[] = [
  { label: "White", hex: "#FFFFFF" },
  { label: "Black", hex: "#1A1A1A" },
  { label: "Navy", hex: "#1A1A2E" },
  { label: "Red", hex: "#E63946" },
  { label: "Grey", hex: "#6C757D" },
  { label: "Sage", hex: "#87A878" },
  { label: "Sky", hex: "#87CEEB" },
  { label: "Cream", hex: "#FFF8E7" },
];

export const DEFAULT_COLOR = "#FFFFFF";

// Camera positions for front/back views in Three.js scene
export const CAMERA_POSITIONS = {
  front: [0, 0.1, 2.8] as [number, number, number],
  back: [0, 0.1, -2.8] as [number, number, number],
};
