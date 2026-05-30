import { create } from "zustand";

export type RightPanelTab = "material" | "physics" | "gestures" | "modifiers" | "environment";

interface UIStore {
  commandPaletteOpen: boolean;
  qrModalOpen: boolean;
  qrAnchorId: string | null;
  rightPanelTab: RightPanelTab;
  gestureHUDCollapsed: boolean;
  physicsEnabled: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  setQRModalOpen: (v: boolean, anchorId?: string) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setGestureHUDCollapsed: (v: boolean) => void;
  togglePhysics: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  commandPaletteOpen: false,
  qrModalOpen: false,
  qrAnchorId: null,
  rightPanelTab: "material",
  gestureHUDCollapsed: false,
  physicsEnabled: false,
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setQRModalOpen: (v, anchorId) => set({ qrModalOpen: v, qrAnchorId: anchorId ?? null }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setGestureHUDCollapsed: (v) => set({ gestureHUDCollapsed: v }),
  togglePhysics: () => set((state) => ({ physicsEnabled: !state.physicsEnabled })),
}));
