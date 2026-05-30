import { useEffect, useRef } from "react";
import { useGestureStore } from "@/store/gestureStore";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { GESTURE_FUNCTION_LABELS } from "@/utils/gestureRecognizer";

export function GestureHUD() {
  const { currentGesture, currentGestureLabel, active, assignments, handsCount } = useGestureStore();
  const { setQRModalOpen } = useUIStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGestureRef = useRef<string | null>(null);

  // Ejecutar función asignada cuando cambia el gesto
  useEffect(() => {
    if (!currentGesture || !active) return;
    if (currentGesture === lastGestureRef.current) return;
    if (currentGesture === "MANO_DETECTADA") return;
    lastGestureRef.current = currentGesture;

    // Cooldown: ignorar el mismo gesto 1.5s después de ejecutarlo
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lastGestureRef.current = null;
    }, 1500);

    const fn = assignments[currentGesture as keyof typeof assignments];
    if (!fn || fn === "NINGUNA") return;

    // Acciones que pueden ejecutarse directamente
    if (fn === "CREAR_ANCLAJE") {
      // Señal para crear anclaje (el LeftPanel lo maneja)
      window.dispatchEvent(new CustomEvent("gesture:action", { detail: { fn } }));
    } else if (fn === "MODO_AR" || fn === "MODO_VR" || fn === "DESHACER" || fn === "REHACER") {
      window.dispatchEvent(new CustomEvent("gesture:action", { detail: { fn } }));
    } else {
      window.dispatchEvent(new CustomEvent("gesture:action", { detail: { fn } }));
    }
  }, [currentGesture, active, assignments]);

  if (!active) return null;

  const assignedFn =
    currentGesture && currentGesture !== "MANO_DETECTADA"
      ? assignments[currentGesture as keyof typeof assignments]
      : null;

  return (
    <>
      {/* Badge de gesto activo */}
      <AnimatePresence mode="wait">
        {currentGesture && currentGesture !== "MANO_DETECTADA" && (
          <motion.div
            key={currentGesture}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="px-4 py-2 bg-[#0a0a0f]/90 border border-[#00f0ff]/50 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
                <span className="text-[#00f0ff] font-mono text-sm font-bold tracking-widest">
                  {currentGestureLabel ?? currentGesture}
                </span>
              </div>
              {assignedFn && assignedFn !== "NINGUNA" && (
                <div className="px-3 py-1 bg-[#0a0a0f]/80 border border-[#7b2fff]/40 rounded-full backdrop-blur-md">
                  <span className="text-[#7b2fff] font-mono text-[10px] tracking-wider">
                    {GESTURE_FUNCTION_LABELS[assignedFn]}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de manos detectadas (esquina sup izq) */}
      <div className="absolute top-16 left-3 z-40 pointer-events-none">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(handsCount, 2) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#00f0ff]" : "bg-[#ff3366]"}`}
            />
          ))}
          {handsCount === 0 && (
            <div className="w-2 h-2 rounded-full bg-[#2a2a3a]" />
          )}
        </div>
      </div>
    </>
  );
}
