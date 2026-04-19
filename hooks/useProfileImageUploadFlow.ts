"use client";

import { ChangeEvent, useCallback, useRef, useState } from "react";
import useModal from "@/hooks/useModal";
import { useBridge } from "@/hooks/bridge/useBridge";
import { toast } from "@/lib/toast";

export type ProfileImageUploadFlowOptions = {
  currentImage?: string;
  onFileSelect?: (file: File) => void;
  onDefaultImageSelect?: (image: string) => void;
};

/** `components/ImageUploader.tsx`와 동일한 흐름(편집·기본 이미지 모달·네이티브 사진첩). */
export function useProfileImageUploadFlow({
  currentImage,
  onFileSelect,
  onDefaultImageSelect,
}: ProfileImageUploadFlowOptions) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal("DEFAULT_IMAGE_SELECT");
  const { openModal: openEditModal, hideModal: hideEditModal } =
    useModal("EDIT_PROFILE_IMAGE");
  const { isNativeApp, openPhotoPicker, sendToNative } = useBridge();

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
          onFileSelect?.(savedFile);
          hideEditModal();
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
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

  const pickFromAlbum = useCallback(() => {
    if (isNativeApp) {
      void handleNativePhotoPick();
    } else {
      handleFileClick();
    }
  }, [isNativeApp, handleNativePhotoPick, handleFileClick]);

  const onHiddenFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        openEditModal({
          initialImage: objectUrl,
          onSave: (savedImage, savedFile) => {
            setPreview(savedImage);
            onFileSelect?.(savedFile);
            hideEditModal();
          },
        });
        e.target.value = "";
      }
    },
    [openEditModal, hideEditModal, onFileSelect],
  );

  const pickDefaultImage = useCallback(() => {
    if (currentImage && onDefaultImageSelect) {
      openModal({
        initialImage: currentImage,
        onSave: (image) => {
          setPreview(null);
          onDefaultImageSelect(image);
        },
      });
    }
  }, [currentImage, onDefaultImageSelect, openModal]);

  const trimmedCurrent =
    currentImage != null && String(currentImage).trim() !== ""
      ? String(currentImage).trim()
      : undefined;
  const displaySrc = preview ?? trimmedCurrent ?? null;

  return {
    preview,
    setPreview,
    displaySrc,
    fileInputRef,
    pickFromAlbum,
    onHiddenFileChange,
    pickDefaultImage,
  };
}
