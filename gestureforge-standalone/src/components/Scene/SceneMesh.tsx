import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneObject } from "@/types";

interface SceneMeshProps {
  object: SceneObject;
  isSelected: boolean;
}

export function SceneMesh({ object, isSelected }: SceneMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const Geometry = useMemo(() => {
    switch (object.type) {
      case "box": return <boxGeometry args={[1, 1, 1]} />;
      case "sphere": return <sphereGeometry args={[0.5, 32, 32]} />;
      case "cylinder": return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case "torus": return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case "cone": return <coneGeometry args={[0.5, 1, 32]} />;
      case "capsule": return <capsuleGeometry args={[0.5, 1, 4, 16]} />;
      case "tetrahedron": return <tetrahedronGeometry args={[0.5]} />;
      case "icosahedron": return <icosahedronGeometry args={[0.5]} />;
      case "torusKnot": return <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />;
      case "lathe": return <latheGeometry />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [object.type]);

  const matProps = {
    color: new THREE.Color(object.material.color),
    roughness: object.material.roughness,
    metalness: object.material.metalness,
    emissive: isSelected ? new THREE.Color("#00f0ff") : new THREE.Color(object.material.emissive),
    emissiveIntensity: isSelected ? 0.5 : 1,
    transparent: object.material.opacity < 1,
    opacity: object.material.opacity,
    wireframe: object.material.wireframe,
  };

  return (
    <mesh
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      visible={object.visible}
      castShadow
      receiveShadow
    >
      {Geometry}
      <meshStandardMaterial {...matProps} />
    </mesh>
  );
}
