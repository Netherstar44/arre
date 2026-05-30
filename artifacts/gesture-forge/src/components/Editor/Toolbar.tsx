import { useUIStore } from "@/store/uiStore";
import { useSceneStore } from "@/store/sceneStore";
import { useGestureStore } from "@/store/gestureStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FolderPlus, FolderOpen, Save, Download, Hand, Box, MousePointer2, Scissors } from "lucide-react";

export function Toolbar() {
  const { physicsEnabled, togglePhysics } = useUIStore();
  const { editMode, setEditMode } = useSceneStore();
  const { active, setActive } = useGestureStore();

  return (
    <div className="h-14 border-b border-[#2a2a3a] glass-panel flex items-center justify-between px-4 z-10 shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="font-serif text-xl font-bold text-[#00f0ff] tracking-wider">GestureForge 3D</h1>
        
        <div className="flex bg-[#0a0a0f] p-1 rounded-lg border border-[#2a2a3a]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${editMode === "object" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "text-[#5a5a72]"}`}
                onClick={() => setEditMode("object")}
              >
                <MousePointer2 className="w-4 h-4 mr-2" />
                Objeto
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo Objeto (Tab)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${editMode === "edit" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "text-[#5a5a72]"}`}
                onClick={() => setEditMode("edit")}
              >
                <Box className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo Edición (Tab)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${editMode === "sculpt" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "text-[#5a5a72]"}`}
                onClick={() => setEditMode("sculpt")}
              >
                <Scissors className="w-4 h-4 mr-2" />
                Esculpir
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo Escultura</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 mr-4 border-r border-[#2a2a3a] pr-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a5a72] hover:text-[#e8e8f0]">
            <FolderPlus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a5a72] hover:text-[#e8e8f0]">
            <FolderOpen className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a5a72] hover:text-[#e8e8f0]">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a5a72] hover:text-[#e8e8f0]">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`border-[#2a2a3a] ${active ? "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]" : "text-[#5a5a72]"}`}
              onClick={() => setActive(!active)}
            >
              <Hand className="w-4 h-4 mr-2" />
              {active ? "Gestos ON" : "Gestos OFF"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control por Gestos (C)</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          className={`border-[#2a2a3a] ${physicsEnabled ? "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]" : "text-[#5a5a72]"}`}
          onClick={togglePhysics}
        >
          Física {physicsEnabled ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
