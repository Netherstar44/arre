export type LM = { x: number; y: number; z: number };

export type GestureResult = {
  name: string;
  label: string;
  confidence: number;
  isBimanual: boolean;
};

// Distancia euclidiana 3D
function dist3d(a: LM, b: LM): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

// Distancia 2D (más estable para detección plana)
function dist2d(a: LM, b: LM): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Determina si un dedo está extendido.
 * Estrategia: la punta del dedo debe estar más lejos de la muñeca que el nudo (MCP).
 * Esto funciona para cualquier orientación de la mano.
 */
function isFingerExtended(lm: LM[], tipIdx: number, mcpIdx: number): boolean {
  const tipDist = dist3d(lm[0], lm[tipIdx]);
  const mcpDist = dist3d(lm[0], lm[mcpIdx]);
  return tipDist > mcpDist * 1.25;
}

/**
 * El pulgar es especial — usa la distancia punta-palma vs MCP-palma.
 * Umbral menor porque el pulgar no se extiende tanto.
 */
function isThumbExtended(lm: LM[]): boolean {
  const tipDist = dist3d(lm[0], lm[4]);
  const mcpDist = dist3d(lm[0], lm[2]);
  return tipDist > mcpDist * 1.3;
}

/** Estado de cada dedo: [pulgar, índice, medio, anular, meñique] */
function getFingerStates(lm: LM[]): [boolean, boolean, boolean, boolean, boolean] {
  // MCP indices: pulgar=2, índice=5, medio=9, anular=13, meñique=17
  // TIP indices: pulgar=4, índice=8, medio=12, anular=16, meñique=20
  return [
    isThumbExtended(lm),
    isFingerExtended(lm, 8, 5),
    isFingerExtended(lm, 12, 9),
    isFingerExtended(lm, 16, 13),
    isFingerExtended(lm, 20, 17),
  ];
}

function isPinching(lm: LM[]): boolean {
  return dist2d(lm[4], lm[8]) < 0.07;
}

function countExtended(states: boolean[]): number {
  return states.filter(Boolean).length;
}

/**
 * Detecta el gesto de una sola mano a partir de 21 landmarks de MediaPipe.
 */
export function detectSingleHandGesture(lm: LM[]): GestureResult | null {
  if (!lm || lm.length < 21) return null;

  const [thumb, index, middle, ring, pinky] = getFingerStates(lm);
  const pinch = isPinching(lm);
  const allCurled = !index && !middle && !ring && !pinky;
  const allExtended = index && middle && ring && pinky;

  // Detectar dirección del pulgar cuando el puño está cerrado
  const thumbPointingUp = thumb && lm[4].y < lm[0].y - 0.05;
  const thumbPointingDown = thumb && lm[4].y > lm[0].y + 0.05;

  // Puño cerrado (todos los dedos cerrados, pulgar indiferente)
  const isFist = allCurled;

  // --- Orden de precedencia: del más específico al menos específico ---

  // Pinza (pulgar + índice juntos)
  if (pinch) {
    return { name: "PINZA_AGARRE", label: "Pinza: Agarrar", confidence: 0.95, isBimanual: false };
  }

  // Pulgar arriba (puño + pulgar apunta arriba)
  if (isFist && thumbPointingUp) {
    return { name: "PULGAR_ARRIBA", label: "Pulgar Arriba", confidence: 0.9, isBimanual: false };
  }

  // Pulgar abajo (puño + pulgar apunta abajo)
  if (isFist && thumbPointingDown) {
    return { name: "PULGAR_ABAJO", label: "Pulgar Abajo", confidence: 0.9, isBimanual: false };
  }

  // Puño cerrado (todos los dedos cerrados, sin pulgar destacado)
  if (isFist && !thumb) {
    return { name: "PUNO_ROTAR", label: "Puño: Rotar", confidence: 0.88, isBimanual: false };
  }

  // Señal de paz (índice + medio extendidos, los demás cerrados)
  if (index && middle && !ring && !pinky) {
    return { name: "SENAL_PAZ", label: "Señal de Paz", confidence: 0.9, isBimanual: false };
  }

  // Solo señalar (solo índice extendido)
  if (index && !middle && !ring && !pinky) {
    return { name: "SENALAR", label: "Señalar", confidence: 0.92, isBimanual: false };
  }

  // Tres dedos (índice + medio + anular)
  if (index && middle && ring && !pinky) {
    return { name: "TRES_DEDOS", label: "Tres Dedos", confidence: 0.85, isBimanual: false };
  }

  // Cuatro dedos (todos menos pulgar)
  if (index && middle && ring && pinky && !thumb) {
    return { name: "CUATRO_DEDOS", label: "Cuatro Dedos", confidence: 0.85, isBimanual: false };
  }

  // Palma abierta (los 5 dedos extendidos)
  if (allExtended && thumb) {
    const palmCenter = lm[9];
    const prevPalmY = palmCenter.y;
    // No podemos detectar velocidad en una sola frame; la palma abierta es solo escalar
    return { name: "PALMA_ABIERTA", label: "Palma Abierta: Escalar", confidence: 0.85, isBimanual: false };
  }

  // Mano relajada / transición
  return { name: "MANO_DETECTADA", label: "Mano Detectada", confidence: 0.5, isBimanual: false };
}

/**
 * Detecta gestos bimanales a partir de dos arrays de landmarks.
 * handedness: "Left" | "Right" por mano
 */
export function detectBimanualGesture(
  lm1: LM[],
  lm2: LM[]
): GestureResult | null {
  if (!lm1 || !lm2 || lm1.length < 21 || lm2.length < 21) return null;

  const [t1, i1, m1, r1, p1] = getFingerStates(lm1);
  const [t2, i2, m2, r2, p2] = getFingerStates(lm2);
  const pinch1 = isPinching(lm1);
  const pinch2 = isPinching(lm2);
  const allCurled1 = !i1 && !m1 && !r1 && !p1;
  const allCurled2 = !i2 && !m2 && !r2 && !p2;
  const allExt1 = i1 && m1 && r1 && p1;
  const allExt2 = i2 && m2 && r2 && p2;

  // Distancia entre centros de palma
  const palmDist = dist2d(lm1[9], lm2[9]);

  // Palmas juntas (oración)
  if (allExt1 && allExt2 && palmDist < 0.15) {
    return { name: "MANOS_ORACION", label: "Manos en Oración: Congelar", confidence: 0.88, isBimanual: true };
  }

  // Ambas pinzas → Escalar bimanual
  if (pinch1 && pinch2) {
    return { name: "BIMANUAL_ESCALAR", label: "Bimanual: Escalar", confidence: 0.9, isBimanual: true };
  }

  // Ambos puños → Rotar bimanual
  if (allCurled1 && allCurled2) {
    return { name: "BIMANUAL_ROTAR", label: "Bimanual: Rotar", confidence: 0.88, isBimanual: true };
  }

  // Ambas palmas abiertas → Simular onda elástica
  if (allExt1 && t1 && allExt2 && t2 && palmDist > 0.25) {
    return { name: "BIMANUAL_ONDA", label: "Bimanual: Onda Elástica", confidence: 0.82, isBimanual: true };
  }

  // Una pinza + una palma → Portal / Anclaje QR
  if ((pinch1 && allExt2) || (pinch2 && allExt1)) {
    return { name: "BIMANUAL_PORTAL", label: "Bimanual: Crear Anclaje QR", confidence: 0.85, isBimanual: true };
  }

  // Aplaudir (ambas palmas cerradas y muy cerca)
  if (allCurled1 && allCurled2 && palmDist < 0.1) {
    return { name: "APLAUSO", label: "Aplauso: Resetear Escena", confidence: 0.87, isBimanual: true };
  }

  return null;
}

// --- Gestos disponibles para asignación ---

export type GestureFunction =
  | "NINGUNA"
  | "DESPLAZAR"
  | "ROTAR"
  | "ESCALAR"
  | "SELECCIONAR"
  | "CREAR_ANCLAJE"
  | "DESHACER"
  | "REHACER"
  | "DUPLICAR"
  | "ELIMINAR"
  | "MODO_AR"
  | "MODO_VR"
  | "FISICA_TOGGLE"
  | "CAPTURAR_PANTALLA";

export const GESTURE_FUNCTION_LABELS: Record<GestureFunction, string> = {
  NINGUNA: "Sin función",
  DESPLAZAR: "Desplazar objeto",
  ROTAR: "Rotar objeto",
  ESCALAR: "Escalar objeto",
  SELECCIONAR: "Seleccionar objeto",
  CREAR_ANCLAJE: "Crear Anclaje QR",
  DESHACER: "Deshacer",
  REHACER: "Rehacer",
  DUPLICAR: "Duplicar objeto",
  ELIMINAR: "Eliminar objeto",
  MODO_AR: "Modo Realidad Aumentada",
  MODO_VR: "Modo Realidad Virtual",
  FISICA_TOGGLE: "Activar / Pausar Física",
  CAPTURAR_PANTALLA: "Capturar Pantalla",
};

export const ALL_GESTURE_NAMES = [
  "PINZA_AGARRE",
  "PUNO_ROTAR",
  "PALMA_ABIERTA",
  "SENALAR",
  "SENAL_PAZ",
  "TRES_DEDOS",
  "CUATRO_DEDOS",
  "PULGAR_ARRIBA",
  "PULGAR_ABAJO",
  "MANO_DETECTADA",
  "BIMANUAL_ESCALAR",
  "BIMANUAL_ROTAR",
  "BIMANUAL_ONDA",
  "BIMANUAL_PORTAL",
  "MANOS_ORACION",
  "APLAUSO",
] as const;

export type GestureName = typeof ALL_GESTURE_NAMES[number];

export const DEFAULT_GESTURE_ASSIGNMENTS: Record<GestureName, GestureFunction> = {
  PINZA_AGARRE: "SELECCIONAR",
  PUNO_ROTAR: "ROTAR",
  PALMA_ABIERTA: "ESCALAR",
  SENALAR: "SELECCIONAR",
  SENAL_PAZ: "DESPLAZAR",
  TRES_DEDOS: "DESPLAZAR",
  CUATRO_DEDOS: "NINGUNA",
  PULGAR_ARRIBA: "REHACER",
  PULGAR_ABAJO: "DESHACER",
  MANO_DETECTADA: "NINGUNA",
  BIMANUAL_ESCALAR: "ESCALAR",
  BIMANUAL_ROTAR: "ROTAR",
  BIMANUAL_ONDA: "NINGUNA",
  BIMANUAL_PORTAL: "CREAR_ANCLAJE",
  MANOS_ORACION: "FISICA_TOGGLE",
  APLAUSO: "MODO_AR",
};

export const GESTURE_LABELS: Record<string, string> = {
  PINZA_AGARRE: "Pinza: Agarrar",
  PUNO_ROTAR: "Puño: Rotar",
  PALMA_ABIERTA: "Palma Abierta",
  SENALAR: "Señalar",
  SENAL_PAZ: "Señal de Paz",
  TRES_DEDOS: "Tres Dedos",
  CUATRO_DEDOS: "Cuatro Dedos",
  PULGAR_ARRIBA: "Pulgar Arriba",
  PULGAR_ABAJO: "Pulgar Abajo",
  MANO_DETECTADA: "Mano Detectada",
  BIMANUAL_ESCALAR: "Bimanual: Escalar",
  BIMANUAL_ROTAR: "Bimanual: Rotar",
  BIMANUAL_ONDA: "Bimanual: Onda",
  BIMANUAL_PORTAL: "Bimanual: Portal QR",
  MANOS_ORACION: "Manos en Oración",
  APLAUSO: "Aplauso",
};
