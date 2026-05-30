export class GestureRecognizer {
  detectGesture(landmarks: any[]): string | null {
    if (!landmarks || landmarks.length < 21) return null;

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Simple heuristic for distance
    const dist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const thumbIndexDist = dist(thumbTip, indexTip);
    
    if (thumbIndexDist < 0.05) {
      return "PINZA_AGARRE";
    }

    // Very basic checks for now to simulate recognition
    // In a real scenario we'd check angles and extensions of all fingers
    const isIndexExtended = landmarks[8].y < landmarks[6].y;
    const isMiddleExtended = landmarks[12].y < landmarks[10].y;
    
    if (isIndexExtended && !isMiddleExtended) return "SEÑALAR";
    if (isIndexExtended && isMiddleExtended) return "SEÑAL_PAZ";

    return "PALMA_ABIERTA"; // Fallback
  }
}

export const gestureRecognizer = new GestureRecognizer();
