"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn, getValidImageSrc, MOCK_EMBLEM_SRC } from "@/lib/utils";

/** next/image 기준 SVG는 벡터라 최적화 이점이 없고, 공식 문서에서 unoptimized 사용을 권장 */
function srcIsSvg(url: string): boolean {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
}

export type EmblemImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  /** 원본 엠블럼 URL·경로. 무효하면 MOCK_EMBLEM_SRC로 정규화 후 렌더 */
  src: string | null | undefined;
  alt: string;
  onError?: ImageProps["onError"];
};

type EmblemImageInnerProps = Omit<EmblemImageProps, "src"> & {
  normalizedSrc: string;
};

/** `key={src}`로 감싼 인스턴스만 리마운트되어 로드 실패 상태가 초기화됨 (effect + setState 불필요) */
function EmblemImageInner({
  normalizedSrc,
  alt,
  className,
  fill = true,
  sizes,
  quality = 100,
  unoptimized: unoptimizedProp,
  onError,
  ...rest
}: EmblemImageInnerProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const displaySrc = loadFailed ? MOCK_EMBLEM_SRC : normalizedSrc;
  const unoptimized = unoptimizedProp ?? srcIsSvg(displaySrc);

  return (
    <Image
      {...rest}
      src={displaySrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      quality={quality}
      className={cn("object-cover", className)}
      unoptimized={unoptimized}
      onError={(e) => {
        setLoadFailed(true);
        onError?.(e);
      }}
    />
  );
}

/**
 * 팀 엠블럼 전용 next/image 래퍼.
 * - `getValidImageSrc`로 잘못된 src는 즉시 기본 엠블럼으로 교체
 * - 로드 실패 시 `onError`로 기본 엠블럼(`/images/teamemblum_default.webp`) 표시
 * - `fill` 기본값 true: 부모에 `relative`와 명시적 크기(h/w 또는 size-*) 필요
 * - `fill` 사용 시 `sizes`를 넘기지 않으면 브라우저가 100vw로 가정할 수 있어 작은 배지에서도 명시 권장
 */
export function EmblemImage({
  src,
  alt,
  className,
  fill = true,
  sizes,
  quality = 100,
  unoptimized: unoptimizedProp,
  onError,
  ...rest
}: EmblemImageProps) {
  const normalizedSrc = getValidImageSrc(src, MOCK_EMBLEM_SRC);

  return (
    <EmblemImageInner
      key={src ?? ""}
      normalizedSrc={normalizedSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      quality={quality}
      unoptimized={unoptimizedProp}
      onError={onError}
      {...rest}
    />
  );
}
