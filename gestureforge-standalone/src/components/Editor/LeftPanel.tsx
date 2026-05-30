import { useSceneStore } from "@/store/sceneStore";
import { useUIStore } from "@/store/uiStore";
import { useAnchorStore, encodeSceneToUrl } from "@/store/anchorStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SceneObject, SceneObjectType } from "@/types";
import { Box, Circle, Cylinder, Hexagon, Cone, Diamond, Combine, Link, QrCode, Trash2, Eye, EyeOff, Copy } from "lucide-react";

const PRIMITIVES: { type: SceneObjectType; label: string; icon: any }[] = [
  { type: "box", label: "Cubo", icon: Box },
  { type: "sphere", label: "Esfera", icon: Circle },
  { type: "cylinder", label: "Cilindro", icon: Cylinder },
  { type: "torus", label: "Toro", icon: Circle },
  { type: "cone", label: "Cono", icon: Cone },
  { type: "capsule", label: "Cápsula", icon: Cylinder },
  { type: "tetrahedron", label: "Tetraedro", icon: Diamond },
  { type: "icosahedron", label: "Icosaedro", icon: Hexagon },
  { type: "torusKnot", label: "Nudo Tórico", icon: Combine },
];

export function LeftPanel() {
  const { objects, selectedId, selectObject, addObject, removeObject, updateObject } = useSceneStore();
  const { setQRModalOpen } = useUIStore();
  const { anchors, addAnchor, removeAnchor } = useAnchorStore();

  const handleAddPrimitive = (type: SceneObjectType, label: string) => {
    const newObj: SceneObject = {
      id: crypto.randomUUID(),
      name: `${label} ${objects.length + 1}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: {
        color: "#e8e8f0",
        roughness: 0.5,
        metalness: 0.1,
        emissive: "#000000",
        opacity: 1,
        wireframe: false,
      },
      physics: {
        enabled: false,
        bodyType: "dynamic",
        mass: 1,
        restitution: 0.5,
        friction: 0.5,
      },
      visible: true,
    };
    addObject(newObj);
    selectObject(newObj.id);
  };

  const handleDuplicate = (obj: SceneObject) => {
    const newObj = {
      ...obj,
      id: crypto.randomUUID(),
      name: `${obj.name} (Copia)`,
      position: { x: obj.position.x + 1, y: obj.position.y, z: obj.position.z },
    };
    addObject(newObj);
    selectObject(newObj.id);
  };

  const handleCreateAnchor = () => {
    const id = crypto.randomUUID();
    const name = `Anclaje ${new Date().toLocaleString("es-ES")}`;
    const createdAt = new Date().toISOString();
    const url = encodeSceneToUrl({ name, objects, createdAt });

    addAnchor({ id, name, createdAt, url, objectCount: objects.length });
    setQRModalOpen(true, url);
  };

  const handleOpenQR = (url: string) => {
    setQRModalOpen(true, url);
  };

  return (
    <div className="w-72 border-r border-[#2a2a3a] glass-panel flex flex-col z-10 shrink-0 h-full">
      <div className="p-4 border-b border-[#2a2a3a]">
        <h2 className="text-xs font-mono text-[#5a5a72] uppercase tracking-wider mb-3">Agregar</h2>
        <div className="grid grid-cols-3 gap-2">
          {PRIMITIVES.map((p) => {
            const Icon = p.icon;
            return (
              <Button
                key={p.type}
                variant="outline"
                size="icon"
                className="w-full h-10 border-[#2a2a3a] bg-[#0a0a0f] hover:bg-[#2a2a3a] hover:border-[#00f0ff]/50"
                onClick={() => handleAddPrimitive(p.type, p.label)}
                title={p.label}
              >
                <Icon className="w-4 h-4 text-[#e8e8f0]" />
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-xs font-mono text-[#5a5a72] uppercase tracking-wider p-4 pb-2">Jerarquía</h2>
        <ScrollArea className="flex-1 px-2">
          {objects.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#5a5a72]">Escena vacía</div>
          ) : (
            <div className="space-y-1">
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors ${
                    selectedId === obj.id
                      ? "bg-[#00f0ff]/10 text-[#00f0ff]"
                      : "hover:bg-[#2a2a3a] text-[#e8e8f0]"
                  }`}
                  onClick={() => selectObject(obj.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Box className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">{obj.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 hover:text-[#00f0ff]"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateObject(obj.id, { visible: !obj.visible });
                      }}
                    >
                      {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 hover:text-[#00f0ff]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(obj);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 hover:text-[#ff3366]"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeObject(obj.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <Separator className="bg-[#2a2a3a]" />

      <div className="h-1/3 flex flex-col p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono text-[#5a5a72] uppercase tracking-wider">Anclajes QR</h2>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={handleCreateAnchor}
            title="Crear anclaje QR de la escena actual"
          >
            <QrCode className="w-4 h-4 text-[#00f0ff]" />
          </Button>
        </div>
        <ScrollArea className="flex-1 -mx-2 px-2">
          {anchors.length === 0 ? (
            <div className="text-center text-sm text-[#5a5a72] mt-4">Sin anclajes guardados</div>
          ) : (
            <div className="space-y-1">
              {anchors.map((anchor) => (
                <div
                  key={anchor.id}
                  className="flex items-center justify-between p-2 rounded-md bg-[#0a0a0f] border border-[#2a2a3a] text-sm"
                >
                  <button
                    className="flex items-center gap-2 truncate text-[#e8e8f0] hover:text-[#00f0ff] transition-colors text-left flex-1 min-w-0"
                    onClick={() => handleOpenQR(anchor.url)}
                    title="Ver código QR"
                  >
                    <Link className="w-3 h-3 text-[#7b2fff] shrink-0" />
                    <span className="truncate">{anchor.name}</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 hover:text-[#ff3366] shrink-0"
                    onClick={() => removeAnchor(anchor.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
