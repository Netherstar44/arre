import { create } from "zustand";
import { Vec3 } from "@/types";

interface GestureStore {
  active: boolean;
  currentGesture: string | null;
  handPosition: Vec3 | null;
  landmarks: Array<{x: number; y: number; z: number}> | null;
  setActive: (v: boolean) => void;
  setCurrentGesture: (g: string | null) => void;
  setHandPosition: (pos: Vec3 | null) => void;
  setLandmarks: (landmarks: Array<{x: number; y: number; z: number}> | null) => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  active: false,
  currentGesture: null,
  handPosition: null,
  landmarks: null,
  setActive: (v) => set({ active: v }),
  setCurrentGesture: (g) => set({ currentGesture: g }),
  setHandPosition: (pos) => set({ handPosition: pos }),
  setLandmarks: (landmarks) => set({ landmarks }),
}));
