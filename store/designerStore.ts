import { create } from "zustand";
import type { ActiveView, DesignerActions, DesignerState, Layer, LayerKind } from "@/types/designer";
import { DEFAULT_COLOR } from "@/lib/constants";
import { DEFAULT_LAYER } from "@/lib/printArea";

type DesignerStore = DesignerState & DesignerActions;

export const useDesignerStore = create<DesignerStore>((set, get) => {
  const setLayer = (side: ActiveView, kind: LayerKind, layer: Layer | undefined) => {
    const previous = get().layers[side][kind];
    if (previous && previous.url !== layer?.url) URL.revokeObjectURL(previous.url);
    set((s) => ({ layers: { ...s.layers, [side]: { ...s.layers[side], [kind]: layer } } }));
  };

  return {
    baseColor: DEFAULT_COLOR,
    layers: { front: {}, back: {} },
    activeView: "front",
    isLoading: true,
    sizes: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },

    setBaseColor: (color) => set({ baseColor: color }),

    setLayerImage: (side, kind, url, fileName) =>
      setLayer(side, kind, { url, fileName, full: false, ...DEFAULT_LAYER[kind][side] }),

    updateLayer: (side, kind, patch) => {
      const layer = get().layers[side][kind];
      if (layer) setLayer(side, kind, { ...layer, ...patch });
    },

    clearLayer: (side, kind) => setLayer(side, kind, undefined),

    setActiveView: (view) => set({ activeView: view }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    setSize: (size, qty) => set((s) => ({ sizes: { ...s.sizes, [size]: Math.max(0, qty) } })),
  };
});
