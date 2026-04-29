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
    <div className={`flex flex-col gap-y-12 px-4 ${className || ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onHiddenFileChange}
      />
      {/* previewHeight: 뷰포트에 맞춘 최대 한 변 — height만 주면 가로(size-50)와 불일치해 세로로 찌그러진 프레임이 됨 → 정사각형 유지 */}
      <div
        className={
          previewHeight
            ? "aspect-square w-full max-w-125 shrink-0 bg-bg-modal rounded-lg overflow-hidden relative mx-auto"
            : "size-125 max-w-full shrink-0 bg-bg-modal rounded-lg overflow-hidden relative mx-auto"
        }
        style={
          previewHeight
            ? { width: `min(100%, min(31.25rem, ${previewHeight}))` }
            : undefined
        }
      >
        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt="Preview"
            fill
            priority={priority}
            sizes="(max-width: 48rem) min(calc(100vw - 2rem), 31.25rem), 31.25rem"
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
  );
};

export default ImageUploader;
