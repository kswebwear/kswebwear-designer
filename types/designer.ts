export type ActiveView = "front" | "back";

export type PrintSize = "small" | "medium" | "large";

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
  designImageURL: string | null;
  designFileName: string | null;
  activeView: ActiveView;
  printSize: PrintSize;
  isLoading: boolean;
}

export interface DesignerActions {
  setBaseColor: (color: string) => void;
  setDesignImage: (url: string | null, fileName: string | null) => void;
  setActiveView: (view: ActiveView) => void;
  setPrintSize: (size: PrintSize) => void;
  setIsLoading: (loading: boolean) => void;
  clearDesign: () => void;
}
