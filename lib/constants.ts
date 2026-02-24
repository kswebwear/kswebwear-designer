import type { ColorPreset, DesignPlacement, UVRegion } from "@/types/designer";

// Texture canvas size (pixels)
export const TEXTURE_SIZE = 2048;

/**
 * UV region pixel coordinates on the 2048x2048 canvas texture.
 * These MUST match the UV layout baked into the GLB model.
 *
 * Placeholder model UV layout (generate-placeholder-tshirt.mjs):
 *   Front body: U[0.12–0.88], V[0.38–0.92] → canvas x[246–1802], y[778–1884]
 *   Back body:  U[0.12–0.88], V[0.04–0.36] → canvas x[246–1802], y[82–737]
 *
 * When a Blender-exported GLB replaces the placeholder, update these values
 * to match that model's UV layout.
 */
export const UV_REGIONS: Record<"front" | "back", UVRegion> = {
  front: {
    x: 246,
    y: 778,
    width: 1556,
    height: 1106,
  },
  back: {
    x: 246,
    y: 82,
    width: 1556,
    height: 655,
  },
};

/**
 * How to place the user's design image within the UV panel.
 * Ratios are relative to the UV region dimensions.
 */
export const DESIGN_PLACEMENT: Record<"front" | "back", DesignPlacement> = {
  front: {
    offsetXRatio: 0.5,    // horizontally centered
    offsetYRatio: 0.65,   // upper chest: V≈0.73 on placeholder model UV layout
    maxWidthRatio: 0.55,  // up to 55% of panel width
    maxHeightRatio: 0.38, // up to 38% of panel height
  },
  back: {
    offsetXRatio: 0.5,
    offsetYRatio: 0.55,   // center-upper on back panel
    maxWidthRatio: 0.55,
    maxHeightRatio: 0.38,
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
