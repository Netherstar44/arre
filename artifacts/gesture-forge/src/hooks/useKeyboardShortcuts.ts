import { useEffect } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { useUIStore } from "@/store/uiStore";
import { useGestureStore } from "@/store/gestureStore";

export function useKeyboardShortcuts() {
  const { setTransformMode, setEditMode, editMode, removeObject, selectedId } = useSceneStore();
  const { setCommandPaletteOpen, setQRModalOpen, togglePhysics } = useUIStore();
  const { setActive, active } = useGestureStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case "g":
          setTransformMode("translate");
          break;
        case "r":
          setTransformMode("rotate");
          break;
        case "s":
          setTransformMode("scale");
          break;
        case "tab":
          e.preventDefault();
          setEditMode(editMode === "object" ? "edit" : "object");
          break;
        case "delete":
        case "backspace":
          if (selectedId) removeObject(selectedId);
          break;
        case "k":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCommandPaletteOpen(true);
          }
          break;
        case "q":
          setQRModalOpen(true);
          break;
        case " ":
          e.preventDefault();
          togglePhysics();
          break;
        case "c":
          setActive(!active);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTransformMode, setEditMode, editMode, removeObject, selectedId, setCommandPaletteOpen, setQRModalOpen, togglePhysics, setActive, active]);
}
