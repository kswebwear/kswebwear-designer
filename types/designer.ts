export type ActiveView = "front" | "back";

export type SizeKey = "S" | "M" | "L" | "XL" | "2XL";

export type LayerKind = "design" | "logo";

export interface Layer {
  url: string;
  fileName: string;
  /** Design uses the whole front/back panel (image scaled to the largest size that fits, never cropped) */
  full: boolean;
  /** Fraction (0–1) of the largest size that fits the print area */
  size: number;
  /** Centre offset in model units, in screen terms (+x right, +y up) */
  x: number;
  y: number;
}

export type SideLayers = Partial<Record<LayerKind, Layer>>;

export interface ColorPreset {
  label: string;
  hex: string;
}

export interface UVRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignPlacement {
  offsetXRatio: number;
  offsetYRatio: number;
  maxWidthRatio: number;
  maxHeightRatio: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface DesignerState {
  baseColor: string;
  layers: Record<ActiveView, SideLayers>;
  activeView: ActiveView;
  isLoading: boolean;
  sizes: Record<SizeKey, number>;
}

export interface DesignerActions {
  setBaseColor: (color: string) => void;
  setLayerImage: (side: ActiveView, kind: LayerKind, url: string, fileName: string) => void;
  updateLayer: (side: ActiveView, kind: LayerKind, patch: Partial<Pick<Layer, "size" | "x" | "y" | "full">>) => void;
  clearLayer: (side: ActiveView, kind: LayerKind) => void;
  setActiveView: (view: ActiveView) => void;
  setIsLoading: (loading: boolean) => void;
  setSize: (size: SizeKey, qty: number) => void;
}
