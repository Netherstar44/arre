import { create } from "zustand";
import { Vec3 } from "@/types";
import {
  GestureFunction,
  GestureName,
  DEFAULT_GESTURE_ASSIGNMENTS,
} from "@/utils/gestureRecognizer";

interface GestureStore {
  active: boolean;
  currentGesture: string | null;
  currentGestureLabel: string | null;
  handPosition: Vec3 | null;
  landmarks: Array<{ x: number; y: number; z: number }> | null;
  // Segunda mano (bimanual)
  secondHandPosition: Vec3 | null;
  secondHandLandmarks: Array<{ x: number; y: number; z: number }> | null;
  handsCount: number;
  // Asignaciones de gestos a funciones
  assignments: Record<GestureName, GestureFunction>;
  // Modo AR/VR
  arMode: boolean;
  vrMode: boolean;

  setActive: (v: boolean) => void;
  setCurrentGesture: (g: string | null, label?: string | null) => void;
  setHandPosition: (pos: Vec3 | null) => void;
  setLandmarks: (landmarks: Array<{ x: number; y: number; z: number }> | null) => void;
  setSecondHand: (
    pos: Vec3 | null,
    landmarks: Array<{ x: number; y: number; z: number }> | null
  ) => void;
  setHandsCount: (n: number) => void;
  setAssignment: (gesture: GestureName, fn: GestureFunction) => void;
  resetAssignments: () => void;
  setArMode: (v: boolean) => void;
  setVrMode: (v: boolean) => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  active: false,
  currentGesture: null,
  currentGestureLabel: null,
  handPosition: null,
  landmarks: null,
  secondHandPosition: null,
  secondHandLandmarks: null,
  handsCount: 0,
  assignments: { ...DEFAULT_GESTURE_ASSIGNMENTS },
  arMode: false,
  vrMode: false,

  setActive: (v) => set({ active: v }),
  setCurrentGesture: (g, label) => set({ currentGesture: g, currentGestureLabel: label ?? g }),
  setHandPosition: (pos) => set({ handPosition: pos }),
  setLandmarks: (landmarks) => set({ landmarks }),
  setSecondHand: (pos, landmarks) =>
    set({ secondHandPosition: pos, secondHandLandmarks: landmarks }),
  setHandsCount: (n) => set({ handsCount: n }),
  setAssignment: (gesture, fn) =>
    set((state) => ({
      assignments: { ...state.assignments, [gesture]: fn },
    })),
  resetAssignments: () => set({ assignments: { ...DEFAULT_GESTURE_ASSIGNMENTS } }),
  setArMode: (v) => set({ arMode: v, vrMode: false }),
  setVrMode: (v) => set({ vrMode: v, arMode: false }),
}));
