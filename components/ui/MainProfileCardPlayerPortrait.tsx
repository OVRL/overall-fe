"use client";

import { useState } from "react";
import Image from "next/image";
import { getValidImageSrc, MOCK_IMAGE_SRC } from "@/lib/utils";

interface MainProfileCardPlayerPortraitInnerProps {
  normalizedSrc: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  imagePriority?: boolean;
  className?: string;
}

function MainProfileCardPlayerPortraitInner({
  normalizedSrc,
  fallbackSrc,
  alt,
  sizes,
  imagePriority,
  className,
}: MainProfileCardPlayerPortraitInnerProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const displaySrc = loadFailed ? fallbackSrc : normalizedSrc;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setLoadFailed(true)}
      {...(imagePriority && { loading: "eager" as const })}
    />
  );
}

export interface MainProfileCardPlayerPortraitProps {
  /** 원본 이미지 URL */
  imgUrl?: string | null;
  /** 무효·로드 실패 시 */
  imgFallbackSrc?: string;
  alt: string;
  sizes: string;
  imagePriority?: boolean;
  className?: string;
}

/**
 * MainProfileCard 전면 선수 이미지: 정규화 + 로드 실패 시 플레이스홀더 (EmblemImage·ImgPlayer와 동일 패턴)
 */
export function MainProfileCardPlayerPortrait({
  imgUrl,
  imgFallbackSrc = MOCK_IMAGE_SRC,
  alt,
  sizes,
  imagePriority,
  className = "object-contain object-bottom z-10",
}: MainProfileCardPlayerPortraitProps) {
  const normalizedSrc = getValidImageSrc(imgUrl, imgFallbackSrc);

  return (
    <MainProfileCardPlayerPortraitInner
      key={String(imgUrl ?? "")}
      normalizedSrc={normalizedSrc}
      fallbackSrc={imgFallbackSrc}
      alt={alt}
      sizes={sizes}
      imagePriority={imagePriority}
      className={className}
    />
  );
}
