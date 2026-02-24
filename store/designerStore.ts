import { create } from "zustand";
import type { ActiveView, DesignerActions, DesignerState } from "@/types/designer";
import { DEFAULT_COLOR } from "@/lib/constants";

type DesignerStore = DesignerState & DesignerActions;

export const useDesignerStore = create<DesignerStore>((set) => ({
  // Initial state
  baseColor: DEFAULT_COLOR,
  designImageURL: null,
  designFileName: null,
  activeView: "front",
  isLoading: true,

  // Actions
  setBaseColor: (color: string) => set({ baseColor: color }),

  setDesignImage: (url: string | null, fileName: string | null) =>
    set({ designImageURL: url, designFileName: fileName }),

  setActiveView: (view: ActiveView) => set({ activeView: view }),

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  clearDesign: () => set({ designImageURL: null, designFileName: null }),
}));
