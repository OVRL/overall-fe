import { useState, useCallback, useEffect } from "react";
import type { Area } from "react-easy-crop";
import getCroppedImg from "@/utils/canvasUtils";

interface UseProfileImageCanvasProps {
  imageSrc: string;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

const useProfileImageCanvas = ({
  imageSrc,
  isAnimating,
  onAnimationComplete,
}: UseProfileImageCanvasProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const getCroppedImage = async () => {
    if (!croppedAreaPixels) return null;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      return croppedImage;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleMediaLoaded = () => {
    if (isAnimating) {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (isAnimating && isLoaded) {
      const timer = setTimeout(() => {
        onAnimationComplete?.();
        setIsLoaded(false); // 다음을 위해 초기화
      }, 500); // transition-opacity 지속 시간과 일치
      return () => clearTimeout(timer);
    }
  }, [isAnimating, isLoaded, onAnimationComplete]);

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    getCroppedImage,
    isLoaded,
    handleMediaLoaded,
  };
};

export default useProfileImageCanvas;
