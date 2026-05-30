import { useRef, useState, useEffect, Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Grid, GizmoHelper, GizmoViewport, Environment } from "@react-three/drei";
import { useSceneStore } from "@/store/sceneStore";
import { useGestureStore } from "@/store/gestureStore";
import { SceneMesh } from "./SceneMesh";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0f]" style={{ color: "#e8e8f0" }}>
          <div style={{
            background: "rgba(22,22,31,0.92)",
            border: "1px solid #00f0ff44",
            borderRadius: 12,
            padding: "2rem 2.5rem",
            maxWidth: 420,
            textAlign: "center",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16, color: "#00f0ff" }}>⬡</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              WebGL no disponible
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#5a5a72", marginBottom: 16 }}>
              El canvas 3D requiere WebGL. En algunos entornos sandbox el soporte está limitado.
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#00f0ff88", padding: "8px 12px", background: "#00f0ff11", borderRadius: 6 }}>
              Para la experiencia completa, abre la app en una pestaña del navegador →
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Scene3D({ transparent, vrEye }: { transparent?: boolean; vrEye?: "left" | "right" }) {
  const { objects, selectedId, transformMode, selectObject } = useSceneStore();
  const { handPosition, active } = useGestureStore();
  const orbitRef = useRef<any>(null);

  return (
    <Canvas
      shadows
      camera={{ fov: 60, position: [5, 5, 5] }}
      style={{ background: transparent ? "transparent" : "#0a0a0f" }}
      gl={{ alpha: transparent, antialias: true }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <ambientLight intensity={transparent ? 0.8 : 0.4} />
      <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-bias={-0.0001} />

      {!transparent && !vrEye && (
        <Grid args={[30, 30]} cellColor="#2a2a3a" sectionColor="#3a3a4a" fadeDistance={30} />
      )}

      <OrbitControls ref={orbitRef} makeDefault />

      {!vrEye && (
        <GizmoHelper alignment="top-right" margin={[80, 80]}>
          <GizmoViewport axisColors={["#ff3366", "#00ff88", "#00f0ff"]} labelColor="#0a0a0f" />
        </GizmoHelper>
      )}

      {!transparent && <Environment preset="studio" />}

      {/* Offset global de la escena para simular distancia interpupilar en modo VR estereoscópico */}
      <group position={[vrEye === "left" ? -0.12 : vrEye === "right" ? 0.12 : 0, 0, 0]}>
        {objects.map((obj) => (
          <group key={obj.id} onClick={(e) => { e.stopPropagation(); selectObject(obj.id); }}>
            {selectedId === obj.id ? (
              <TransformControls
                mode={transformMode}
                onMouseDown={() => { if (orbitRef.current) orbitRef.current.enabled = false; }}
                onMouseUp={() => { if (orbitRef.current) orbitRef.current.enabled = true; }}
              >
                <SceneMesh object={obj} isSelected={true} />
              </TransformControls>
            ) : (
              <SceneMesh object={obj} isSelected={false} />
            )}
          </group>
        ))}

        {active && handPosition && (
          <mesh position={[handPosition.x, handPosition.y, handPosition.z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </Canvas>
  );
}

export function SceneCanvas() {
  const { arMode, vrMode } = useGestureStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camError, setCamError] = useState<string | null>(null);

  useEffect(() => {
    if (!arMode) return;

    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Camera access failed for AR:", err);
        setCamError("Permiso de cámara denegado o no disponible.");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [arMode]);

  return (
    <div className="w-full h-full bg-[#0a0a0f] relative overflow-hidden">
      {/* Feed de cámara web de fondo en modo AR */}
      {arMode && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          playsInline
          muted
          autoPlay
        />
      )}

      {/* Contenedor del canvas 3D */}
      <div className="absolute inset-0 z-10">
        <WebGLErrorBoundary>
          {vrMode ? (
            <div className="w-full h-full flex bg-[#0a0a0f]">
              {/* Ojo Izquierdo */}
              <div className="w-1/2 h-full border-r border-[#2a2a3a]/40 relative">
                <Scene3D vrEye="left" />
                <div className="absolute top-4 left-4 bg-black/60 text-[#00f0ff] font-mono text-[9px] px-2 py-0.5 rounded border border-[#2a2a3a]">
                  OJO IZQUIERDO
                </div>
              </div>
              {/* Ojo Derecho */}
              <div className="w-1/2 h-full relative">
                <Scene3D vrEye="right" />
                <div className="absolute top-4 left-4 bg-black/60 text-[#ff3366] font-mono text-[9px] px-2 py-0.5 rounded border border-[#2a2a3a]">
                  OJO DERECHO
                </div>
              </div>
            </div>
          ) : (
            <Scene3D transparent={arMode} />
          )}
        </WebGLErrorBoundary>
      </div>

      {/* Indicador de carga de AR / Error de cámara */}
      {arMode && (
        <div className="absolute top-4 left-4 z-20 bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-[10px] px-3 py-1 rounded-full border border-[#00f0ff]/30 tracking-wider">
          MUNDO AUMENTADO (AR)
        </div>
      )}

      {arMode && camError && (
        <div className="absolute bottom-20 left-4 right-4 z-20 bg-[#ff3366]/90 text-white text-[11px] font-mono p-3 rounded-lg text-center shadow-lg">
          {camError}
        </div>
      )}
    </div>
  );
}
