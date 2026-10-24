import type { ActiveView, LayerKind } from "@/types/designer";

// Printable rectangle on the shirt, in model units (shirt is ~1.8 wide, ~1.9 tall)
export const PRINT_AREA = { left: -0.4, right: 0.4, bottom: -0.25, top: 0.6 };

// Whole-body print: nearly the full front or back panel
export const FULL_AREA = { left: -0.46, right: 0.46, bottom: -0.9, top: 0.78 };

export type Area = typeof PRINT_AREA;
export const areaOf = (full: boolean): Area => (full ? FULL_AREA : PRINT_AREA);
export const areaCenter = (a: Area) => ({ x: (a.left + a.right) / 2, y: (a.bottom + a.top) / 2 });

export const MIN_LAYER_SIZE = 0.1;

export const DEFAULT_LAYER: Record<LayerKind, Record<ActiveView, { size: number; x: number; y: number }>> = {
  design: {
    front: { size: 0.7, x: 0, y: 0.175 },
    back: { size: 0.7, x: 0, y: 0.175 },
  },
  logo: {
    front: { size: 0.3, x: 0.25, y: 0.45 },
    back: { size: 0.3, x: 0, y: 0.45 },
  },
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Width at size = 1: the biggest the image can be while fitting the print area */
export function maxFitWidth(aspect: number, area: Area = PRINT_AREA) {
  return Math.min(area.right - area.left, (area.top - area.bottom) * aspect);
}

export function layerWidth(size: number, aspect: number, area: Area = PRINT_AREA) {
  return clamp(size, MIN_LAYER_SIZE, 1) * maxFitWidth(aspect, area);
}

/** Keep a w×h box centred near (x, y) fully inside the print area */
export function clampCenter(x: number, y: number, w: number, h: number, area: Area = PRINT_AREA) {
  return {
    x: clamp(x, area.left + w / 2, area.right - w / 2),
    y: clamp(y, area.bottom + h / 2, area.top - h / 2),
  };
}

/** Widest the layer can grow around (x, y) without leaving the print area */
export function maxWidthAround(x: number, y: number, aspect: number, area: Area = PRINT_AREA) {
  const halfW = Math.min(area.right - x, x - area.left);
  const halfH = Math.min(area.top - y, y - area.bottom);
  return Math.max(0, Math.min(2 * halfW, 2 * halfH * aspect));
}
