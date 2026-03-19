"use client";

import { ChangeEvent, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { useBridge } from "@/hooks/bridge/useBridge";
import { toast } from "@/lib/toast";

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

  const { openModal } = useModal("DEFAULT_IMAGE_SELECT");
  const { openModal: openEditModal, hideModal: hideEditModal } =
    useModal("EDIT_PROFILE_IMAGE");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isNativeApp, openPhotoPicker, sendToNative } = useBridge();

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** 앱 환경: 네이티브 사진첩에서 이미지 선택 후 편집 모달로 연결 */
  const handleNativePhotoPick = useCallback(async () => {
    try {
      const { base64, mimeType } = await openPhotoPicker();
      const dataUrl = `data:${mimeType};base64,${base64}`;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      openEditModal({
        initialImage: objectUrl,
        onSave: (savedImage, savedFile) => {
          setPreview(savedImage);
          if (onFileSelect) onFileSelect(savedFile);
          hideEditModal();
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // 갤러리 취소는 짧게, 권한/설정 안내는 그대로 표시
      if (message.includes("설정에서 사진 접근을 허용해 주세요")) {
        toast.error(message, {
          action: {
            label: "설정 열기",
            onClick: () => sendToNative({ type: "OPEN_SETTINGS" }),
          },
          duration: 6000,
        });
      } else {
        toast.error(message);
      }
    }
  }, [openPhotoPicker, openEditModal, hideEditModal, onFileSelect, sendToNative]);

  const onPickPhoto = useCallback(() => {
    if (isNativeApp) {
      handleNativePhotoPick();
    } else {
      handleFileClick();
    }
  }, [isNativeApp, handleNativePhotoPick, handleFileClick]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      // Open edit modal directly instead of setting preview immediately
      openEditModal({
        initialImage: objectUrl,
        onSave: (savedImage, savedFile) => {
          setPreview(savedImage);
          if (onFileSelect) {
            onFileSelect(savedFile);
          }
          hideEditModal();
        },
      });
      // Reset input to allow selecting same file again
      e.target.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-y-12 px-4 ${className || ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="size-50 shrink-0 bg-bg-modal rounded-lg overflow-hidden relative mx-auto">
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
        <Button
          variant="line"
          size="m"
          className="flex-1"
          type="button"
          onClick={onPickPhoto}
        >
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
                onSave: (image) => {
                  setPreview(null); // Clear manual preview when default image is selected
                  onDefaultImageSelect(image);
                },
              });
            }
          }}
        >
          기본 이미지 변경
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
