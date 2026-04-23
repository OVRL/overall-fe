import React, { useState, useCallback, useRef } from "react";
import type { Area } from "react-easy-crop";
import getCroppedImg from "@/utils/canvasUtils";
import useModal from "@/hooks/useModal";

interface UseEditEmblemImageProps {
  initialImage: string;
  onSave: (image: string, file: File) => void;
}

const useEditEmblemImage = ({
  initialImage,
  onSave,
}: UseEditEmblemImageProps) => {
  const { hideModal } = useModal();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImage(url);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        currentImage,
        croppedAreaPixels,
        0,
        {
          horizontal: false,
          vertical: false,
        },
        "image/webp",
        { width: 200, height: 200 },
      );

      if (croppedImage) {
        // croppedImage is already a Blob
        const previewUrl = URL.createObjectURL(croppedImage);
        const file = new File([croppedImage], "emblem-cropped.webp", {
          type: "image/webp",
        });

        onSave(previewUrl, file);
        hideModal();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    currentImage,
    fileInputRef,
    handleFileClick,
    handleFileChange,
    onCropComplete,
    handleSave,
  };
};

export default useEditEmblemImage;
