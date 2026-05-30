import { useGestureStore } from "@/store/gestureStore";
import {
  ALL_GESTURE_NAMES,
  GESTURE_LABELS,
  GESTURE_FUNCTION_LABELS,
  GestureFunction,
  GestureName,
} from "@/utils/gestureRecognizer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const FUNCTIONS: GestureFunction[] = [
  "NINGUNA",
  "SELECCIONAR",
  "DESPLAZAR",
  "ROTAR",
  "ESCALAR",
  "CREAR_ANCLAJE",
  "DESHACER",
  "REHACER",
  "DUPLICAR",
  "ELIMINAR",
  "MODO_AR",
  "MODO_VR",
  "FISICA_TOGGLE",
  "CAPTURAR_PANTALLA",
];

const ONE_HAND_GESTURES: GestureName[] = [
  "PINZA_AGARRE",
  "PUNO_ROTAR",
  "PALMA_ABIERTA",
  "SENALAR",
  "SENAL_PAZ",
  "TRES_DEDOS",
  "CUATRO_DEDOS",
  "PULGAR_ARRIBA",
  "PULGAR_ABAJO",
];

const TWO_HAND_GESTURES: GestureName[] = [
  "BIMANUAL_ESCALAR",
  "BIMANUAL_ROTAR",
  "BIMANUAL_ONDA",
  "BIMANUAL_PORTAL",
  "MANOS_ORACION",
  "APLAUSO",
];

function GestureRow({ gesture }: { gesture: GestureName }) {
  const { assignments, currentGesture, setAssignment } = useGestureStore();
  const isActive = currentGesture === gesture;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-[#00f0ff]/10 border border-[#00f0ff]/30"
          : "border border-transparent hover:bg-[#1a1a25]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-mono truncate ${
            isActive ? "text-[#00f0ff]" : "text-[#e8e8f0]"
          }`}
        >
          {GESTURE_LABELS[gesture] ?? gesture}
          {isActive && (
            <span className="ml-2 text-[10px] text-[#00f0ff] animate-pulse">ACTIVO</span>
          )}
        </div>
      </div>
      <select
        value={assignments[gesture]}
        onChange={(e) => setAssignment(gesture, e.target.value as GestureFunction)}
        className="text-xs bg-[#0a0a0f] border border-[#2a2a3a] rounded-md px-2 py-1 text-[#e8e8f0] focus:border-[#00f0ff] focus:outline-none shrink-0"
        style={{ maxWidth: 130 }}
      >
        {FUNCTIONS.map((fn) => (
          <option key={fn} value={fn}>
            {GESTURE_FUNCTION_LABELS[fn]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function GestureAssignmentPanel() {
  const { resetAssignments } = useGestureStore();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3a] shrink-0">
        <span className="text-xs font-mono text-[#5a5a72] uppercase tracking-widest">
          Asignación de Gestos
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[#5a5a72] hover:text-[#ff3366] text-xs"
          onClick={resetAssignments}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Restaurar
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-[#5a5a72] uppercase tracking-widest px-3 pb-2">
              Una mano
            </div>
            <div className="space-y-1">
              {ONE_HAND_GESTURES.map((g) => (
                <GestureRow key={g} gesture={g} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#5a5a72] uppercase tracking-widest px-3 pb-2">
              Dos manos
            </div>
            <div className="space-y-1">
              {TWO_HAND_GESTURES.map((g) => (
                <GestureRow key={g} gesture={g} />
              ))}
            </div>
          </div>

          <div className="px-3 py-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] space-y-2">
            <div className="text-[10px] font-mono text-[#5a5a72] uppercase tracking-widest">
              Funciones disponibles
            </div>
            <div className="grid grid-cols-1 gap-1">
              {(["MODO_AR", "MODO_VR", "DESPLAZAR", "ROTAR", "ESCALAR"] as GestureFunction[]).map(
                (fn) => (
                  <div key={fn} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0" />
                    <span className="text-[10px] font-mono text-[#5a5a72]">
                      {GESTURE_FUNCTION_LABELS[fn]}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
