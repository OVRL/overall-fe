"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useProfileImageUploadFlow } from "@/hooks/useProfileImageUploadFlow";
import { getValidImageSrc, isNextImageUnoptimizedSrc } from "@/lib/utils";

type Props = {
  currentImage?: string | null;
  onFileSelect?: (file: File) => void;
  onDefaultImageSelect?: (image: string) => void;
};

/**
 * `ImageUploader`와 동일한 모달·파일 플로우, 프로필 편집 UI(원형 프리뷰·카피)만 분리.
 */
export default function UserProfileEditImageBlock({
  currentImage,
  onFileSelect,
  onDefaultImageSelect,
}: Props) {
  const {
    displaySrc,
    fileInputRef,
    pickFromAlbum,
    onHiddenFileChange,
    pickDefaultImage,
  } = useProfileImageUploadFlow({
    currentImage: currentImage ?? undefined,
    onFileSelect,
    onDefaultImageSelect,
  });

  const resolvedSrc = displaySrc ? getValidImageSrc(displaySrc) : null;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="text-sm text-left font-semibold text-Label-Primary w-full">
        프로필 사진
      </p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/*"
        onChange={onHiddenFileChange}
      />
      <div className="relative size-37.5 shrink-0 overflow-hidden">
        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt="프로필 미리보기"
            fill
            sizes="150px"
            className="object-cover"
            unoptimized={isNextImageUnoptimizedSrc(resolvedSrc)}
          />
        ) : null}
      </div>
      <p className="text-left w-full text-xs text-Label-Tertiary">
        JPG, PNG 파일을 업로드하세요 (최대 5MB)
      </p>
      <div className="flex w-full flex-col gap-2">
        <Button
          type="button"
          variant="line"
          size="m"
          className="w-full border-gray-1000 text-Label-Secondary"
          onClick={pickFromAlbum}
        >
          앨범에서 사진 선택
        </Button>
        <Button
          type="button"
          variant="line"
          size="m"
          className="w-full border-gray-1000 text-Label-Secondary"
          onClick={(e) => {
            e.preventDefault();
            pickDefaultImage();
          }}
        >
          기본이미지로 변경
        </Button>
      </div>
    </div>
  );
}
