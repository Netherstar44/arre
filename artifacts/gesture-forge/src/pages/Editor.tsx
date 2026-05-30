import { Toolbar } from "@/components/Editor/Toolbar";
import { LeftPanel } from "@/components/Editor/LeftPanel";
import { RightPanel } from "@/components/Editor/RightPanel";
import { BottomPanel } from "@/components/Editor/BottomPanel";
import { SceneCanvas } from "@/components/Scene/SceneCanvas";
import { GestureOverlay } from "@/components/GestureHUD/GestureOverlay";
import { GestureHUD } from "@/components/GestureHUD/GestureHUD";
import { QRModal } from "@/components/QRModal/QRModal";
import { CommandPalette } from "@/components/CommandPalette/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Editor() {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden relative">
        <LeftPanel />
        
        <main className="flex-1 relative">
          <SceneCanvas />
          <GestureHUD />
          <GestureOverlay />
        </main>

        <RightPanel />
      </div>
      <BottomPanel />

      <QRModal />
      <CommandPalette />
    </div>
  );
}
