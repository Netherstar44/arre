import { useEffect, useRef } from "react";
import { useGestureStore } from "@/store/gestureStore";
import { useGestures } from "@/hooks/useGestures";

// Conexiones del esqueleto de la mano según MediaPipe Hands
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Pulgar
  [0, 5], [5, 6], [6, 7], [7, 8],           // Índice
  [0, 9], [9, 10], [10, 11], [11, 12],       // Medio
  [0, 13], [13, 14], [14, 15], [15, 16],    // Anular
  [0, 17], [17, 18], [18, 19], [19, 20],    // Meñique
  [5, 9], [9, 13], [13, 17],                 // Palma
];

function drawHand(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number; z: number }[],
  w: number,
  h: number,
  lineColor: string,
  dotColor: string
) {
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  for (const [a, b] of HAND_CONNECTIONS) {
    const p1 = landmarks[a];
    const p2 = landmarks[b];
    ctx.beginPath();
    ctx.moveTo(p1.x * w, p1.y * h);
    ctx.lineTo(p2.x * w, p2.y * h);
    ctx.stroke();
  }

  ctx.fillStyle = dotColor;
  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function GestureOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { active, landmarks, secondHandLandmarks, handsCount, currentGesture } = useGestureStore();
  const { isLoading, error } = useGestures(videoRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!active) return;

    const w = canvas.width;
    const h = canvas.height;

    // Color según gesto
    const isGesture = !!currentGesture && currentGesture !== "MANO_DETECTADA";
    const lineColor1 = isGesture ? "#00f0ff" : "#5a5a72";
    const dotColor1 = isGesture ? "#00f0ff" : "#9a9ab0";

    if (landmarks) {
      drawHand(ctx, landmarks, w, h, lineColor1, dotColor1);
    }

    if (secondHandLandmarks) {
      drawHand(ctx, secondHandLandmarks, w, h, "#ff3366", "#ff3366");
    }

    // Indicador de cantidad de manos detectadas
    if (handsCount > 0) {
      ctx.fillStyle = "rgba(0,240,255,0.7)";
      ctx.font = "8px JetBrains Mono, monospace";
      ctx.fillText(`${handsCount} mano${handsCount > 1 ? "s" : ""}`, 4, 10);
    }
  }, [active, landmarks, secondHandLandmarks, handsCount, currentGesture]);

  if (!active) return null;

  return (
    <div className="absolute bottom-14 right-3 w-[200px] h-[150px] bg-black/50 rounded-xl overflow-hidden border border-[#2a2a3a] shadow-lg z-50 md:bottom-4">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 scale-x-[-1]"
        playsInline
        muted
        autoPlay
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
        width={200}
        height={150}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <span className="text-[#00f0ff] text-xs font-mono">Iniciando cámara...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-2 text-center">
          <span className="text-[#ff3366] text-xs font-mono">Error: {error}</span>
        </div>
      )}
      {!isLoading && !error && (
        <div className="absolute top-1 left-1 right-1 flex justify-between items-center pointer-events-none">
          <div className="text-[9px] font-mono text-[#00f0ff]/60 bg-black/40 px-1 py-0.5 rounded">
            CAM
          </div>
          {handsCount >= 2 && (
            <div className="text-[9px] font-mono text-[#ff3366]/80 bg-black/40 px-1 py-0.5 rounded">
              2 MANOS
            </div>
          )}
        </div>
      )}
    </div>
  );
}
