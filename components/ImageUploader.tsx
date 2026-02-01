"use client";

import { ChangeEvent, useState } from "react";
import { buttonVariants } from "@/components/ui/Button";

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

const ImageUploader = ({ onFileSelect, className }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect?.(file);
    }
  };

  return (
    <label
      className={`flex flex-col gap-y-2 p-4 border border-gray-800 rounded-3xl cursor-pointer ${className}`}
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden relative">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div
        className={buttonVariants({ variant: "line", size: "xl" })}
        role="button"
      >
        사진 불러오기
      </div>
    </label>
  );
};

export default ImageUploader;
