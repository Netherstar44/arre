import { useUIStore } from "@/store/uiStore";
import { useSceneStore } from "@/store/sceneStore";
import { useGestureStore } from "@/store/gestureStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FolderPlus, FolderOpen, Save, Download, Hand, Box, MousePointer2, Scissors, Camera, Glasses } from "lucide-react";

export function Toolbar() {
  const { physicsEnabled, togglePhysics, setRightPanelTab } = useUIStore();
  const { editMode, setEditMode } = useSceneStore();
  const { active, setActive, arMode, setArMode, vrMode, setVrMode } = useGestureStore();

  return (
    <div className="h-14 border-b border-[#2a2a3a] glass-panel flex items-center justify-between px-3 sm:px-4 z-10 shrink-0 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <h1
          className="text-base sm:text-xl font-bold text-[#00f0ff] tracking-wider whitespace-nowrap"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          GestureForge 3D
        </h1>

        {/* Modos — oculto en móvil pequeño */}
        <div className="hidden sm:flex bg-[#0a0a0f] p-1 rounded-lg border border-[#2a2a3a]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${editMode === "object" ? "bg-[#2a2a3a] text-[#e8e8f0]" : "text-[#5a5a72]"}`}
                onClick={() => setEditMode("object")}
              >
                <MousePointer2 className="w-4 h-4 mr-1.5" />
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
                <Box className="w-4 h-4 mr-1.5" />
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
                <Scissors className="w-4 h-4 mr-1.5" />
                Esculpir
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo Escultura</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Acciones del lado derecho */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Operaciones de archivo — solo desktop */}
        <div className="hidden sm:flex gap-1 mr-2 border-r border-[#2a2a3a] pr-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5a5a72] hover:text-[#e8e8f0]">
            <FolderPlus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5a5a72] hover:text-[#e8e8f0]">
            <FolderOpen className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5a5a72] hover:text-[#e8e8f0]">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5a5a72] hover:text-[#e8e8f0]">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Modo AR */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`border-[#2a2a3a] h-8 px-2 sm:px-3 ${
                arMode
                  ? "bg-[#7b2fff]/20 text-[#7b2fff] border-[#7b2fff]"
                  : "text-[#5a5a72] hover:text-[#7b2fff]"
              }`}
              onClick={() => setArMode(!arMode)}
            >
              <Camera className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">AR</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Modo Realidad Aumentada</TooltipContent>
        </Tooltip>

        {/* Modo VR */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`border-[#2a2a3a] h-8 px-2 sm:px-3 ${
                vrMode
                  ? "bg-[#ff3366]/20 text-[#ff3366] border-[#ff3366]"
                  : "text-[#5a5a72] hover:text-[#ff3366]"
              }`}
              onClick={() => setVrMode(!vrMode)}
            >
              <Glasses className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">VR</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Modo Realidad Virtual</TooltipContent>
        </Tooltip>

        {/* Gestos */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`border-[#2a2a3a] h-8 px-2 sm:px-3 ${
                active
                  ? "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]"
                  : "text-[#5a5a72]"
              }`}
              onClick={() => {
                setActive(!active);
                if (!active) setRightPanelTab("gestures");
              }}
            >
              <Hand className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">{active ? "Gestos ON" : "Gestos OFF"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control por Gestos (C)</TooltipContent>
        </Tooltip>

        {/* Física */}
        <Button
          variant="outline"
          size="sm"
          className={`border-[#2a2a3a] h-8 px-2 sm:px-3 ${
            physicsEnabled
              ? "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]"
              : "text-[#5a5a72]"
          }`}
          onClick={togglePhysics}
        >
          <span className="hidden sm:inline">Física </span>
          {physicsEnabled ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
