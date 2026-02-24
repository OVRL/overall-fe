"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import circleLogoDefault from "@/public/icons/circle_logo_default.svg";

interface EmblemUploaderProps {
  onImageSelected: (file: File | null) => void;
}

export default function EmblemUploader({
  onImageSelected,
}: EmblemUploaderProps) {
  const [emblemPreview, setEmblemPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = url;

    img.onload = () => {
      // 256x256 정사각형 해상도 검증
      if (img.width === 256 && img.height === 256) {
        setEmblemPreview(url);
        onImageSelected(file);
      } else {
        alert("로고 이미지 해상도는 256x256 정사각형이어야 합니다.");
        setEmblemPreview(null);
        onImageSelected(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
  };

  return (
    <div className="flex flex-col px-3">
      <span className="text-sm text-Label-Primary leading-4">클럽 엠블럼</span>
      <div className="flex gap-x-3 py-3">
        <div className="relative size-10 bg-gray-900 rounded-sm p-0.5 overflow-hidden flex items-center justify-center">
          {emblemPreview ? (
            <Image
              src={emblemPreview}
              alt="엠블럼 미리보기"
              fill
              unoptimized
              className="object-cover rounded-sm z-10"
            />
          ) : (
            <Icon
              src={circleLogoDefault}
              alt="기본 엠블럼"
              nofill
              className="w-full h-full"
            />
          )}
        </div>
        <Button
          type="button"
          variant="line"
          size="m"
          className="max-w-70.5"
          onClick={() => fileInputRef.current?.click()}
        >
          앨범에서 사진 선택
        </Button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}
