import { useEffect, useState, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useGestureStore } from "@/store/gestureStore";
import {
  detectSingleHandGesture,
  detectBimanualGesture,
  type LM,
} from "@/utils/gestureRecognizer";

export function useGestures(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const {
    active,
    setCurrentGesture,
    setHandPosition,
    setLandmarks,
    setSecondHand,
    setHandsCount,
  } = useGestureStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Throttle: no procesar más de 30fps
  const lastProcessedRef = useRef(0);
  const THROTTLE_MS = 33; // ~30fps

  useEffect(() => {
    if (!active || !videoRef.current) {
      setCurrentGesture(null);
      setHandPosition(null);
      setLandmarks(null);
      setSecondHand(null, null);
      setHandsCount(0);
      return;
    }

    let camera: Camera | null = null;
    setIsLoading(true);
    setError(null);

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const now = performance.now();
      if (now - lastProcessedRef.current < THROTTLE_MS) return;
      lastProcessedRef.current = now;

      const multiLM = results.multiHandLandmarks ?? [];
      const count = multiLM.length;
      setHandsCount(count);

      if (count === 0) {
        setCurrentGesture(null);
        setHandPosition(null);
        setLandmarks(null);
        setSecondHand(null, null);
        return;
      }

      // Primera mano
      const lm1 = multiLM[0] as LM[];
      setLandmarks(lm1);
      const center1 = lm1[9];
      setHandPosition({
        x: (center1.x - 0.5) * 10,
        y: -(center1.y - 0.5) * 10,
        z: center1.z * 10,
      });

      // Segunda mano
      if (count >= 2) {
        const lm2 = multiLM[1] as LM[];
        const center2 = lm2[9];
        setSecondHand(
          { x: (center2.x - 0.5) * 10, y: -(center2.y - 0.5) * 10, z: center2.z * 10 },
          lm2
        );

        // Intentar gesto bimanual primero
        const bimanual = detectBimanualGesture(lm1, lm2);
        if (bimanual) {
          setCurrentGesture(bimanual.name, bimanual.label);
          return;
        }
      } else {
        setSecondHand(null, null);
      }

      // Gesto de una mano
      const single = detectSingleHandGesture(lm1);
      if (single) {
        setCurrentGesture(single.name, single.label);
      } else {
        setCurrentGesture(null);
      }
    });

    try {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().then(() => setIsLoading(false)).catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }

    return () => {
      if (camera) camera.stop();
      hands.close();
    };
  }, [active, videoRef]);

  return { isLoading, error };
}
