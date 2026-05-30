import { useEffect, useRef } from "react";
import { useGestureStore } from "@/store/gestureStore";
import { useGestures } from "@/hooks/useGestures";

export function GestureOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { active, landmarks } = useGestureStore();
  const { isLoading, error } = useGestures(videoRef);

  useEffect(() => {
    if (!active || !canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (landmarks) {
      // Draw landmarks
      ctx.fillStyle = "#00f0ff";
      ctx.strokeStyle = "#ff3366";
      ctx.lineWidth = 2;

      landmarks.forEach((l) => {
        ctx.beginPath();
        ctx.arc(l.x * canvasRef.current!.width, l.y * canvasRef.current!.height, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw connections (simplified for brevity)
      const drawLine = (p1: any, p2: any) => {
        ctx.beginPath();
        ctx.moveTo(p1.x * canvasRef.current!.width, p1.y * canvasRef.current!.height);
        ctx.lineTo(p2.x * canvasRef.current!.width, p2.y * canvasRef.current!.height);
        ctx.stroke();
      };

      // Thumb
      for(let i=1; i<=4; i++) drawLine(landmarks[i-1], landmarks[i]);
      // Index
      drawLine(landmarks[0], landmarks[5]);
      for(let i=6; i<=8; i++) drawLine(landmarks[i-1], landmarks[i]);
      // Middle
      drawLine(landmarks[9], landmarks[10]);
      for(let i=11; i<=12; i++) drawLine(landmarks[i-1], landmarks[i]);
      // Ring
      drawLine(landmarks[13], landmarks[14]);
      for(let i=15; i<=16; i++) drawLine(landmarks[i-1], landmarks[i]);
      // Pinky
      drawLine(landmarks[17], landmarks[18]);
      for(let i=19; i<=20; i++) drawLine(landmarks[i-1], landmarks[i]);
      
      // Palm base
      drawLine(landmarks[0], landmarks[17]);
      drawLine(landmarks[5], landmarks[9]);
      drawLine(landmarks[9], landmarks[13]);
      drawLine(landmarks[13], landmarks[17]);
    }
  }, [active, landmarks]);

  if (!active) return null;

  return (
    <div className="absolute bottom-4 right-4 w-[200px] h-[150px] bg-black/50 rounded-lg overflow-hidden border border-[#2a2a3a] shadow-lg z-50">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        width={200}
        height={150}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <span className="text-[#00f0ff] text-xs">Iniciando cámara...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-2 text-center">
          <span className="text-[#ff3366] text-xs">Error: {error}</span>
        </div>
      )}
    </div>
  );
}
