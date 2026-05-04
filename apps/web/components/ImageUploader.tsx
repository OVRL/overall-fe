"use client";

import { Button } from "@/components/ui/Button";
import { useProfileImageUploadFlow } from "@/hooks/useProfileImageUploadFlow";
import Image from "next/image";
import { isPlayerPlaceholderWebpSrc } from "@/lib/playerPlaceholderImage";
import { getValidImageSrc, isNextImageUnoptimizedSrc } from "@/lib/utils";

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  className?: string;
  previewHeight?: string;
  currentImage?: string;
  onDefaultImageSelect?: (image: string) => void;
  /** LCP 등 핵심 히어로 이미지일 때 `true` — Next 권장: `priority` + 즉시 로드 */
  priority?: boolean;
}

const ImageUploader = ({
  onFileSelect,
  className,
  previewHeight,
  currentImage,
  onDefaultImageSelect,
  priority = false,
}: ImageUploaderProps) => {
  const {
    displaySrc,
    fileInputRef,
    pickFromAlbum,
    onHiddenFileChange,
    pickDefaultImage,
  } = useProfileImageUploadFlow({
    currentImage,
    onFileSelect,
    onDefaultImageSelect,
  });

  const resolvedSrc = displaySrc ? getValidImageSrc(displaySrc) : null;
  const unoptimized =
    (resolvedSrc != null && isNextImageUnoptimizedSrc(resolvedSrc)) ||
    (resolvedSrc != null && isPlayerPlaceholderWebpSrc(resolvedSrc));

  return (
    <div className={`flex flex-col px-4 items-center ${className || ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onHiddenFileChange}
      />
      {/* 이미지 + 버튼을 같은 너비 컨테이너로 묶음
          모바일: previewHeight 기반 너비 상한 유지
          PC(md+): 화면 높이의 30% = 30dvh 로 고정 */}
      <div
        className="w-full md:w-[30dvh] flex flex-col gap-y-6 mx-auto"
        style={
          previewHeight
            ? { maxWidth: `min(100%, min(31.25rem, ${previewHeight}))` }
            : undefined
        }
      >
        <div className="aspect-square w-full shrink-0 bg-bg-modal rounded-3xl overflow-hidden relative">
          {resolvedSrc ? (
            <Image
              src={resolvedSrc}
              alt="Preview"
              fill
              priority={priority}
              sizes="(max-width: 48rem) min(calc(100vw - 2rem), 31.25rem), 30dvh"
              quality={100}
              className="object-cover"
              unoptimized={unoptimized}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2 h-23.5">
          <Button
            variant="line"
            size="m"
            className="flex-1"
            type="button"
            onClick={pickFromAlbum}
          >
            사진 불러오기
          </Button>
          <Button
            variant="line"
            size="m"
            className="flex-1"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              pickDefaultImage();
            }}
          >
            기본 이미지 변경
          </Button>
        </div>
      </div>
    </div>
  );

};

export default ImageUploader;
