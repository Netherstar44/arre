import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Editor() {
  useKeyboardShortcuts();

  // Estado de paneles en móvil
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const closeBoth = () => {
    setLeftOpen(false);
    setRightOpen(false);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] overflow-hidden">
      <Toolbar />

      {/* ── Botones móvil para abrir paneles ── */}
      <div className="absolute top-14 left-0 right-0 flex justify-between px-3 py-2 z-30 pointer-events-none md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-[#2a2a3a] bg-[#0a0a0f]/90 pointer-events-auto"
          onClick={() => { setLeftOpen(!leftOpen); setRightOpen(false); }}
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-[#2a2a3a] bg-[#0a0a0f]/90 pointer-events-auto"
          onClick={() => { setRightOpen(!rightOpen); setLeftOpen(false); }}
        >
          <PanelRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* ── Panel izquierdo: fijo en desktop, drawer en móvil ── */}
        <div className="hidden md:block h-full">
          <LeftPanel />
        </div>

        {/* ── Drawer móvil izquierdo ── */}
        <AnimatePresence>
          {leftOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-40 md:hidden"
                onClick={closeBoth}
              />
              <motion.div
                initial={{ x: -290 }}
                animate={{ x: 0 }}
                exit={{ x: -290 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute top-0 left-0 h-full z-50 md:hidden"
              >
                <div className="relative h-full">
                  <LeftPanel />
                  <button
                    onClick={closeBoth}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-[#2a2a3a] text-[#5a5a72] hover:text-[#e8e8f0]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Canvas principal ── */}
        <main className="flex-1 relative min-w-0">
          <SceneCanvas />
          <GestureHUD />
          <GestureOverlay />
        </main>

        {/* ── Panel derecho: fijo en desktop, drawer en móvil ── */}
        <div className="hidden md:block h-full">
          <RightPanel />
        </div>

        {/* ── Drawer móvil derecho ── */}
        <AnimatePresence>
          {rightOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-40 md:hidden"
                onClick={closeBoth}
              />
              <motion.div
                initial={{ x: 290 }}
                animate={{ x: 0 }}
                exit={{ x: 290 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute top-0 right-0 h-full z-50 md:hidden"
              >
                <div className="relative h-full">
                  <RightPanel />
                  <button
                    onClick={closeBoth}
                    className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full bg-[#2a2a3a] text-[#5a5a72] hover:text-[#e8e8f0]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <BottomPanel />
      <QRModal />
      <CommandPalette />
    </div>
  );
}
