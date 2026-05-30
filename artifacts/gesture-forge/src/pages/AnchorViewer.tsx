import { useParams, Link } from "wouter";
import { useGetAnchor } from "@workspace/api-client-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box } from "lucide-react";
import * as THREE from "three";

export default function AnchorViewer() {
  const params = useParams();
  const id = params.id as string;

  const { data: anchor, isLoading, error } = useGetAnchor(id, { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0f] text-[#00f0ff] font-mono">
        Cargando anclaje...
      </div>
    );
  }

  if (error || !anchor) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0f] text-[#ff3366] font-mono gap-4">
        <div>Error al cargar anclaje o no encontrado.</div>
        <Link href="/">
          <Button variant="outline" className="border-[#2a2a3a] text-[#e8e8f0]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Editor
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] overflow-hidden relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#00f0ff] drop-shadow-md">{anchor.name}</h1>
          <p className="text-sm font-mono text-[#5a5a72] mt-2">Visor de Realidad Aumentada</p>
        </div>
        <div className="pointer-events-auto">
          <Link href="/">
            <Button variant="outline" className="bg-[#16161f]/80 backdrop-blur-md border-[#2a2a3a] text-[#e8e8f0] hover:bg-[#2a2a3a]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>
          </Link>
        </div>
      </div>

      <Canvas shadows camera={{ fov: 50, position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} />
        <Environment preset="exterior" />
        <Grid args={[20, 20]} cellColor="#2a2a3a" sectionColor="#3a3a4a" fadeDistance={20} />
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
        
        <group 
          position={[anchor.position.x, anchor.position.y, anchor.position.z]}
          rotation={[anchor.rotation.x, anchor.rotation.y, anchor.rotation.z]}
          scale={[anchor.scale.x, anchor.scale.y, anchor.scale.z]}
        >
          {/* Simple representation. If modelData exists, you'd parse GLTF here using useLoader(GLTFLoader, anchor.modelData) */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#7b2fff" metalness={0.6} roughness={0.2} />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}
