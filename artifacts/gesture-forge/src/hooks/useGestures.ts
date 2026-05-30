import { useEffect, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useGestureStore } from "@/store/gestureStore";
import { gestureRecognizer } from "@/utils/gestureRecognizer";

export function useGestures(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { active, setCurrentGesture, setHandPosition, setLandmarks } = useGestureStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !videoRef.current) {
      setCurrentGesture(null);
      setHandPosition(null);
      setLandmarks(null);
      return;
    }

    let camera: Camera | null = null;
    setIsLoading(true);

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const marks = results.multiHandLandmarks[0];
        setLandmarks(marks);
        
        // Map center of palm (landmark 9 is index base, roughly centerish)
        const center = marks[9];
        setHandPosition({ x: (center.x - 0.5) * 10, y: -(center.y - 0.5) * 10, z: center.z * 10 });
        
        const gesture = gestureRecognizer.detectGesture(marks);
        setCurrentGesture(gesture);
      } else {
        setCurrentGesture(null);
        setHandPosition(null);
        setLandmarks(null);
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
        height: 480
      });
      camera.start().then(() => setIsLoading(false));
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }

    return () => {
      if (camera) {
        camera.stop();
      }
      hands.close();
    };
  }, [active, videoRef]);

  return { isLoading, error };
}
