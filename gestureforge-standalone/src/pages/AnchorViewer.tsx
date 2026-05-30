import { useEffect, useRef, useState } from "react";
import { useSearch, Link } from "wouter";
import { decodeSceneFromParam, AnchorSceneData } from "@/store/anchorStore";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Maximize2 } from "lucide-react";
import { Component, type ReactNode } from "react";
import type { SceneObject } from "@/types";

// ── Error boundary para WebGL ──
class WebGLBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
          <div className="text-center p-6" style={{ color: "#5a5a72", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            <div style={{ color: "#00f0ff", fontSize: 32, marginBottom: 12 }}>⬡</div>
            WebGL no disponible en este entorno.
            <br />
            <span style={{ color: "#3a3a4a" }}>Abre en un navegador móvil para AR.</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Renderiza un objeto de la escena por tipo ──
function SceneMesh({ obj }: { obj: SceneObject }) {
  if (!obj.visible) return null;
  return (
    <group
      position={[obj.position.x, obj.position.y, obj.position.z]}
      rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
      scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
    >
      <mesh castShadow receiveShadow>
        {obj.type === "box" && <boxGeometry args={[1, 1, 1]} />}
        {obj.type === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
        {obj.type === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {obj.type === "torus" && <torusGeometry args={[0.5, 0.2, 16, 64]} />}
        {obj.type === "cone" && <coneGeometry args={[0.5, 1, 32]} />}
        {obj.type === "capsule" && <capsuleGeometry args={[0.3, 0.7, 8, 16]} />}
        {obj.type === "tetrahedron" && <tetrahedronGeometry args={[0.7]} />}
        {obj.type === "icosahedron" && <icosahedronGeometry args={[0.7]} />}
        {obj.type === "torusKnot" && <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />}
        {!["box","sphere","cylinder","torus","cone","capsule","tetrahedron","icosahedron","torusKnot"].includes(obj.type) && (
          <boxGeometry args={[1, 1, 1]} />
        )}
        <meshStandardMaterial
          color={obj.material.color}
          roughness={obj.material.roughness}
          metalness={obj.material.metalness}
          emissive={obj.material.emissive}
          opacity={obj.material.opacity}
          transparent={obj.material.opacity < 1}
          wireframe={obj.material.wireframe}
        />
      </mesh>
    </group>
  );
}

// ── Escena 3D completa con todos los objetos del anclaje ──
function Scene3D({ sceneData, transparent }: { sceneData: AnchorSceneData; transparent: boolean }) {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, position: [0, 2, 5] }}
      style={{ background: transparent ? "transparent" : "#0a0a0f" }}
      gl={{ alpha: transparent, antialias: true }}
    >
      <ambientLight intensity={transparent ? 0.8 : 0.5} />
      <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} />
      {!transparent && <Environment preset="sunset" />}
      {!transparent && (
        <Grid args={[20, 20]} cellColor="#2a2a3a" sectionColor="#3a3a4a" fadeDistance={20} />
      )}
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      {sceneData.objects.map((obj) => (
        <SceneMesh key={obj.id} obj={obj} />
      ))}
    </Canvas>
  );
}

// ── Modo AR: superpone el canvas 3D sobre el feed de cámara trasera ──
function AROverlay({ sceneData }: { sceneData: AnchorSceneData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [camReady, setCamReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
          setCamReady(true);
        }
      })
      .catch((err) => setCamError("No se pudo acceder a la cámara: " + err.message));

    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  return (
    <div className="absolute inset-0">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay />
      <div className="absolute inset-0">
        <WebGLBoundary>
          <Scene3D sceneData={sceneData} transparent />
        </WebGLBoundary>
      </div>
      {camError && (
        <div className="absolute bottom-20 left-4 right-4 bg-[#ff3366]/90 text-white text-xs font-mono p-3 rounded-lg text-center">
          {camError}
        </div>
      )}
      {!camReady && !camError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/80">
          <div className="text-[#00f0ff] font-mono text-sm animate-pulse">Iniciando cámara AR...</div>
        </div>
      )}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#00f0ff] text-[#0a0a0f] text-[10px] font-mono font-bold px-3 py-1 rounded-full tracking-widest pointer-events-none">
        REALIDAD AUMENTADA
      </div>
    </div>
  );
}

export default function AnchorViewer() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const encoded = params.get("s");

  const [arMode, setArMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneData = encoded ? decodeSceneFromParam(encoded) : null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!encoded || !sceneData) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0a0a0f] text-[#ff3366] font-mono gap-4 p-6">
        <div className="text-center">
          <div className="text-2xl text-[#00f0ff] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>GestureForge 3D</div>
          <p className="text-sm">Anclaje no encontrado o enlace inválido.</p>
          <p className="text-xs text-[#3a3a4a] mt-2">Genera un nuevo anclaje QR desde el editor.</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="border-[#2a2a3a] text-[#e8e8f0]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Editor
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] overflow-hidden relative"
      style={{ touchAction: "none" }}
    >
      {/* ── Barra superior ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#16161f]/80 backdrop-blur-md border-[#2a2a3a] text-[#e8e8f0] hover:bg-[#2a2a3a] h-9"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
          </Link>
        </div>

        <div className="text-center pointer-events-none">
          <h1 className="text-base sm:text-xl font-bold text-[#00f0ff] drop-shadow-md" style={{ fontFamily: "Syne, sans-serif" }}>
            {sceneData.name}
          </h1>
          <p className="text-[10px] font-mono text-[#5a5a72]">
            {sceneData.objects.length} objeto{sceneData.objects.length !== 1 ? "s" : ""}
            {arMode && " · AR activo"}
          </p>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            className={`backdrop-blur-md border-[#2a2a3a] h-9 ${
              arMode ? "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]" : "bg-[#16161f]/80 text-[#e8e8f0] hover:bg-[#2a2a3a]"
            }`}
            onClick={() => setArMode(!arMode)}
          >
            <Camera className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{arMode ? "Salir AR" : "Modo AR"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#16161f]/80 backdrop-blur-md border-[#2a2a3a] text-[#e8e8f0] hover:bg-[#2a2a3a] h-9 w-9 p-0"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <div className="absolute inset-0">
        {arMode ? (
          <AROverlay sceneData={sceneData} />
        ) : (
          <WebGLBoundary>
            <Scene3D sceneData={sceneData} transparent={false} />
          </WebGLBoundary>
        )}
      </div>

      {/* ── Info del anclaje ── */}
      {!arMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="px-4 py-2 rounded-full text-[10px] font-mono text-[#5a5a72] border border-[#2a2a3a]"
            style={{ background: "rgba(10,10,15,0.7)", backdropFilter: "blur(8px)" }}
          >
            Arrastra para orbitar · Pinza para zoom
          </div>
        </div>
      )}
    </div>
  );
}
