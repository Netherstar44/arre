export type SceneObjectType = "box" | "sphere" | "cylinder" | "torus" | "cone" | "capsule" | "tetrahedron" | "icosahedron" | "torusKnot" | "lathe" | "imported";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: string;
  name: string;
  type: SceneObjectType;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  material: {
    color: string;
    roughness: number;
    metalness: number;
    emissive: string;
    opacity: number;
    wireframe: boolean;
  };
  physics: {
    enabled: boolean;
    bodyType: "dynamic" | "kinematicPosition" | "fixed";
    mass: number;
    restitution: number;
    friction: number;
  };
  visible: boolean;
}

export interface GestureState {
  active: boolean;
  currentGesture: string | null;
  handPosition: Vec3 | null;
  landmarks: Array<{x: number; y: number; z: number}> | null;
}
