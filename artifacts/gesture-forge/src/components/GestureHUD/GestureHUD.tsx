import { useGestureStore } from "@/store/gestureStore";
import { motion, AnimatePresence } from "framer-motion";

export function GestureHUD() {
  const { currentGesture, active } = useGestureStore();

  if (!active) return null;

  return (
    <AnimatePresence>
      {currentGesture && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="absolute top-20 right-4 px-4 py-2 bg-[#16161f]/90 border border-[#00f0ff]/50 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.2)] z-40 backdrop-blur-md"
        >
          <span className="text-[#00f0ff] font-sans font-bold tracking-wider">{currentGesture}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
