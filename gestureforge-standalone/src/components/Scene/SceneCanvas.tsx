import { useRef, Component, type ReactNode } from "react";
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

function Scene3D() {
  const { objects, selectedId, transformMode, selectObject } = useSceneStore();
  const { handPosition, active } = useGestureStore();
  const orbitRef = useRef<any>(null);

  return (
    <Canvas shadows camera={{ fov: 60, position: [5, 5, 5] }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-bias={-0.0001} />

      <Grid args={[30, 30]} cellColor="#2a2a3a" sectionColor="#3a3a4a" fadeDistance={30} />

      <OrbitControls ref={orbitRef} makeDefault />

      <GizmoHelper alignment="top-right" margin={[80, 80]}>
        <GizmoViewport axisColors={["#ff3366", "#00ff88", "#00f0ff"]} labelColor="#0a0a0f" />
      </GizmoHelper>

      <Environment preset="studio" />

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
    </Canvas>
  );
}

export function SceneCanvas() {
  return (
    <div className="w-full h-full bg-[#0a0a0f]">
      <WebGLErrorBoundary>
        <Scene3D />
      </WebGLErrorBoundary>
    </div>
  );
}
