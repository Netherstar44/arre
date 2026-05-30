import { useSceneStore } from "@/store/sceneStore";
import { Button } from "@/components/ui/button";
import { Monitor, Square, GripHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomPanel() {
  const { transformMode, setTransformMode, selectedId, editMode } = useSceneStore();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const loop = () => {
      frameCount++;
      const time = performance.now();
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="h-10 border-t border-[#2a2a3a] glass-panel flex items-center justify-between px-4 z-10 shrink-0 text-xs text-[#5a5a72] font-mono">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Monitor className="w-3 h-3" />
          <span className="uppercase">{editMode} MODE</span>
        </div>

        <div className="flex items-center gap-1 bg-[#0a0a0f] rounded px-1 py-0.5 border border-[#2a2a3a]">
          <button 
            className={`px-2 py-1 rounded ${transformMode === "translate" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "hover:text-[#e8e8f0]"}`}
            onClick={() => setTransformMode("translate")}
          >Tr (G)</button>
          <button 
            className={`px-2 py-1 rounded ${transformMode === "rotate" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "hover:text-[#e8e8f0]"}`}
            onClick={() => setTransformMode("rotate")}
          >Rot (R)</button>
          <button 
            className={`px-2 py-1 rounded ${transformMode === "scale" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "hover:text-[#e8e8f0]"}`}
            onClick={() => setTransformMode("scale")}
          >Esc (S)</button>
        </div>

        {selectedId ? (
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88]">Obj ID:</span> {selectedId.slice(0, 8)}
          </div>
        ) : (
          <span>Ningún objeto seleccionado</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <span>{fps} FPS</span>
        </div>
      </div>
    </div>
  );
}
