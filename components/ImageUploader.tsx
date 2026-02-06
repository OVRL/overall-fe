"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  className?: string;
  previewHeight?: string;
  currentImage?: string;
  onDefaultImageSelect?: (image: string) => void;
}

const ImageUploader = ({
  onFileSelect,
  className,
  previewHeight,
  currentImage,
  onDefaultImageSelect,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect?.(file);
    }
  };

  const { openModal } = useModal("DEFAULT_IMAGE_SELECT");

  return (
    <label
      className={`flex flex-col gap-y-12 px-4 cursor-pointer ${className || ""}`}
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div
        className="w-full aspect-square bg-bg-modal rounded-lg overflow-hidden relative mx-auto"
        style={{
          maxHeight: previewHeight,
          maxWidth: previewHeight,
        }}
      >
        {(preview || currentImage) && (
          <Image
            src={preview || currentImage || ""}
            alt="Preview"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 h-23.5">
        <Button variant="line" size="m" className="flex-1" type="button">
          사진 불러오기
        </Button>
        <Button
          variant="line"
          size="m"
          className="flex-1"
          type="button"
          onClick={(e) => {
            e.preventDefault(); // label 클릭 방지
            if (currentImage && onDefaultImageSelect) {
              openModal({
                initialImage: currentImage,
                onSave: onDefaultImageSelect,
              });
            }
          }}
        >
          기본 이미지 변경
        </Button>
      </div>
    </label>
  );
};

export default ImageUploader;
