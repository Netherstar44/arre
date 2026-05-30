import { useSceneStore } from "@/store/sceneStore";
import { useUIStore } from "@/store/uiStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GestureAssignmentPanel } from "@/components/GestureHUD/GestureAssignmentPanel";

export function RightPanel({ className = "" }: { className?: string }) {
  const { objects, selectedId, updateObject } = useSceneStore();
  const { rightPanelTab, setRightPanelTab } = useUIStore();

  const obj = objects.find((o) => o.id === selectedId);

  return (
    <div
      className={`w-72 border-l border-[#2a2a3a] glass-panel flex flex-col z-10 shrink-0 h-full ${className}`}
    >
      <Tabs
        value={rightPanelTab}
        onValueChange={(v: any) => setRightPanelTab(v)}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-[#2a2a3a] bg-transparent p-0 h-auto shrink-0">
          <TabsTrigger
            value="material"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00f0ff] data-[state=active]:bg-[#00f0ff]/10 py-3 text-[10px] flex-1"
          >
            Material
          </TabsTrigger>
          <TabsTrigger
            value="physics"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00f0ff] data-[state=active]:bg-[#00f0ff]/10 py-3 text-[10px] flex-1"
          >
            Física
          </TabsTrigger>
          <TabsTrigger
            value="gestures"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00f0ff] data-[state=active]:bg-[#00f0ff]/10 py-3 text-[10px] flex-1"
          >
            Gestos
          </TabsTrigger>
          <TabsTrigger
            value="modifiers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00f0ff] data-[state=active]:bg-[#00f0ff]/10 py-3 text-[10px] flex-1"
          >
            Mods
          </TabsTrigger>
        </TabsList>

        {/* ── MATERIAL ── */}
        <TabsContent value="material" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          {obj ? (
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <div className="p-3 border-b border-[#2a2a3a] -mx-4 -mt-4 mb-4 px-4 bg-[#0a0a0f]">
                  <Input
                    value={obj.name}
                    onChange={(e) => updateObject(obj.id, { name: e.target.value })}
                    className="bg-transparent border-none text-lg font-bold font-serif text-[#00f0ff] px-0 h-auto focus-visible:ring-0"
                  />
                  <div className="text-xs text-[#5a5a72] font-mono mt-1">{obj.type}</div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-mono text-[#5a5a72]">Color Base</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={obj.material.color}
                      onChange={(e) =>
                        updateObject(obj.id, { material: { ...obj.material, color: e.target.value } })
                      }
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <Input
                      value={obj.material.color}
                      onChange={(e) =>
                        updateObject(obj.id, { material: { ...obj.material, color: e.target.value } })
                      }
                      className="flex-1 bg-[#0a0a0f] border-[#2a2a3a] font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs font-mono text-[#5a5a72]">Rugosidad</Label>
                    <span className="text-xs text-[#e8e8f0]">{obj.material.roughness.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[obj.material.roughness]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([v]) =>
                      updateObject(obj.id, { material: { ...obj.material, roughness: v } })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs font-mono text-[#5a5a72]">Metalizado</Label>
                    <span className="text-xs text-[#e8e8f0]">{obj.material.metalness.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[obj.material.metalness]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([v]) =>
                      updateObject(obj.id, { material: { ...obj.material, metalness: v } })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs font-mono text-[#5a5a72]">Emisivo</Label>
                    <span className="text-xs text-[#e8e8f0]">{obj.material.emissive}</span>
                  </div>
                  <input
                    type="color"
                    value={obj.material.emissive}
                    onChange={(e) =>
                      updateObject(obj.id, { material: { ...obj.material, emissive: e.target.value } })
                    }
                    className="w-full h-8 rounded cursor-pointer bg-transparent border-[#2a2a3a] border p-0.5"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs font-mono text-[#5a5a72]">Opacidad</Label>
                    <span className="text-xs text-[#e8e8f0]">{obj.material.opacity.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[obj.material.opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([v]) =>
                      updateObject(obj.id, { material: { ...obj.material, opacity: v } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label className="text-xs font-mono text-[#5a5a72]">Wireframe</Label>
                  <Switch
                    checked={obj.material.wireframe}
                    onCheckedChange={(c) =>
                      updateObject(obj.id, { material: { ...obj.material, wireframe: c } })
                    }
                  />
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#5a5a72] text-sm text-center p-6">
              Selecciona un objeto para editar su material
            </div>
          )}
        </TabsContent>

        {/* ── FÍSICA ── */}
        <TabsContent value="physics" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          {obj ? (
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-[#5a5a72]">Activar Física</Label>
                  <Switch
                    checked={obj.physics.enabled}
                    onCheckedChange={(c) =>
                      updateObject(obj.id, { physics: { ...obj.physics, enabled: c } })
                    }
                  />
                </div>

                {obj.physics.enabled && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-xs font-mono text-[#5a5a72]">Tipo de Cuerpo</Label>
                      <select
                        value={obj.physics.bodyType}
                        onChange={(e) =>
                          updateObject(obj.id, {
                            physics: { ...obj.physics, bodyType: e.target.value as any },
                          })
                        }
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded-md p-2 text-sm text-[#e8e8f0]"
                      >
                        <option value="dynamic">Dinámico</option>
                        <option value="kinematicPosition">Cinemático</option>
                        <option value="fixed">Fijo</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs font-mono text-[#5a5a72]">Masa</Label>
                        <span className="text-xs text-[#e8e8f0]">{obj.physics.mass.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[obj.physics.mass]}
                        min={0.1}
                        max={100}
                        step={0.1}
                        onValueChange={([v]) =>
                          updateObject(obj.id, { physics: { ...obj.physics, mass: v } })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs font-mono text-[#5a5a72]">Rebote</Label>
                        <span className="text-xs text-[#e8e8f0]">{obj.physics.restitution.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[obj.physics.restitution]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={([v]) =>
                          updateObject(obj.id, { physics: { ...obj.physics, restitution: v } })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs font-mono text-[#5a5a72]">Fricción</Label>
                        <span className="text-xs text-[#e8e8f0]">{obj.physics.friction.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[obj.physics.friction]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={([v]) =>
                          updateObject(obj.id, { physics: { ...obj.physics, friction: v } })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#5a5a72] text-sm text-center p-6">
              Selecciona un objeto para configurar física
            </div>
          )}
        </TabsContent>

        {/* ── GESTOS ── */}
        <TabsContent value="gestures" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <GestureAssignmentPanel />
        </TabsContent>

        {/* ── MODIFICADORES ── */}
        <TabsContent value="modifiers" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <div className="p-4">
            <div className="p-4 border border-[#2a2a3a] border-dashed rounded-lg text-center bg-[#0a0a0f]">
              <span className="text-xs text-[#5a5a72]">Modificadores en desarrollo.</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
