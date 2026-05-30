import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useUIStore } from "@/store/uiStore";
import { useSceneStore } from "@/store/sceneStore";
import { Box, MousePointer2, Scissors, Hand, RefreshCw } from "lucide-react";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, togglePhysics } = useUIStore();
  const { setEditMode, setTransformMode } = useSceneStore();

  const runCommand = (cmd: () => void) => {
    cmd();
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Buscar comandos o herramientas..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        <CommandGroup heading="Modos">
          <CommandItem onSelect={() => runCommand(() => setEditMode("object"))}>
            <MousePointer2 className="mr-2 h-4 w-4" />
            <span>Modo Objeto</span>
            <span className="ml-auto text-xs text-[#5a5a72]">Tab</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setEditMode("edit"))}>
            <Box className="mr-2 h-4 w-4" />
            <span>Modo Edición</span>
            <span className="ml-auto text-xs text-[#5a5a72]">Tab</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setEditMode("sculpt"))}>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Modo Escultura</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Transformación">
          <CommandItem onSelect={() => runCommand(() => setTransformMode("translate"))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Trasladar</span>
            <span className="ml-auto text-xs text-[#5a5a72]">G</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTransformMode("rotate"))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Rotar</span>
            <span className="ml-auto text-xs text-[#5a5a72]">R</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTransformMode("scale"))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Escalar</span>
            <span className="ml-auto text-xs text-[#5a5a72]">S</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Física">
          <CommandItem onSelect={() => runCommand(() => togglePhysics())}>
            <Box className="mr-2 h-4 w-4" />
            <span>Alternar Simulación Física</span>
            <span className="ml-auto text-xs text-[#5a5a72]">Espacio</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
