import { create } from "zustand";
import { SceneObject } from "@/types";

interface SceneStore {
  objects: SceneObject[];
  selectedId: string | null;
  transformMode: "translate" | "rotate" | "scale";
  editMode: "object" | "edit" | "sculpt";
  addObject: (obj: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
  setEditMode: (mode: "object" | "edit" | "sculpt") => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  objects: [],
  selectedId: null,
  transformMode: "translate",
  editMode: "object",
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  removeObject: (id) => set((state) => ({ objects: state.objects.filter((o) => o.id !== id), selectedId: state.selectedId === id ? null : state.selectedId })),
  selectObject: (id) => set({ selectedId: id }),
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map((o) => o.id === id ? { ...o, ...updates } : o)
  })),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setEditMode: (mode) => set({ editMode: mode }),
}));
