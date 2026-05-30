import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SceneObject } from "@/types";

export interface AnchorEntry {
  id: string;
  name: string;
  createdAt: string;
  url: string;
  objectCount: number;
}

interface AnchorStore {
  anchors: AnchorEntry[];
  addAnchor: (entry: AnchorEntry) => void;
  removeAnchor: (id: string) => void;
}

export const useAnchorStore = create<AnchorStore>()(
  persist(
    (set) => ({
      anchors: [],
      addAnchor: (entry) =>
        set((state) => ({ anchors: [entry, ...state.anchors] })),
      removeAnchor: (id) =>
        set((state) => ({ anchors: state.anchors.filter((a) => a.id !== id) })),
    }),
    { name: "gestureforge-anchors" }
  )
);

// ── Codifica la escena en una URL auto-contenida ──
export interface AnchorSceneData {
  name: string;
  objects: SceneObject[];
  createdAt: string;
}

export function encodeSceneToUrl(data: AnchorSceneData): string {
  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "");
  return `${window.location.origin}/anchor?s=${encoded}`;
}

export function decodeSceneFromParam(s: string): AnchorSceneData | null {
  try {
    const json = decodeURIComponent(atob(s));
    return JSON.parse(json) as AnchorSceneData;
  } catch {
    return null;
  }
}
