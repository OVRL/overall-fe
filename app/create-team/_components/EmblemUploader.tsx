"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import circleLogoDefault from "@/public/icons/circle_logo_default.svg";

import useModal from "@/hooks/useModal";

interface EmblemUploaderProps {
  onImageSelected: (file: File | null) => void;
}

export default function EmblemUploader({
  onImageSelected,
}: EmblemUploaderProps) {
  const [emblemPreview, setEmblemPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal("EDIT_EMBLEM_IMAGE");

  // createObjectURL 해제 — 메모리 누수 방지 (Vercel best practice)
  useEffect(() => {
    return () => {
      if (emblemPreview) URL.revokeObjectURL(emblemPreview);
    };
  }, [emblemPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // 모달을 통한 크롭 진행
    openModal({
      initialImage: url,
      onSave: (croppedImagePreview, croppedFile) => {
        setEmblemPreview(croppedImagePreview);
        onImageSelected(croppedFile);
      },
    });

    // 선택 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
