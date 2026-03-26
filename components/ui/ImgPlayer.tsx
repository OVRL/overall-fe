"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, getValidImageSrc, MOCK_IMAGE_SRC } from "@/lib/utils";

interface ImgPlayerInnerProps {
  normalizedSrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
}

/** `key={src}`로 리마운트되어 로드 실패 상태가 초기화됨 (EmblemImage와 동일 패턴) */
function ImgPlayerInner({
  normalizedSrc,
  fallbackSrc,
  alt,
  className,
  sizes = "(max-width: 640px) 80px, (max-width: 1024px) 120px, 160px",
  priority,
  onError,
}: ImgPlayerInnerProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const displaySrc = loadFailed ? fallbackSrc : normalizedSrc;

  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image
        src={displaySrc}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        quality={100}
        onError={() => {
          setLoadFailed(true);
          onError?.();
        }}
        {...(priority && { priority: true })}
      />
    </div>
  );
}

interface ImgPlayerProps {
  /** 원본 프로필 등. 무효·빈 값이면 `fallbackSrc`로 정규화 */
  src?: string | null;
  /** 로드 실패·무효 URL 시 사용 (인물별 플레이스홀더 URL 권장) */
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
}

const ImgPlayer = ({
  src,
  fallbackSrc = MOCK_IMAGE_SRC,
  alt,
  className,
  sizes,
  priority,
  onError,
}: ImgPlayerProps) => {
  const normalizedSrc = getValidImageSrc(src, fallbackSrc);

  return (
    <ImgPlayerInner
      key={String(src ?? "")}
      normalizedSrc={normalizedSrc}
      fallbackSrc={fallbackSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={onError}
    />
  );
};

export default ImgPlayer;
