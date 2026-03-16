import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** next/image용: 유효한 절대 URL 또는 선행 슬래시 경로만 허용. 그 외는 fallback 반환. */
export const MOCK_IMAGE_SRC = "/images/player/img_player_2.webp";

/** 엠블럼/로고 등 기본 이미지 (getValidImageSrc fallback으로 사용) */
export const MOCK_EMBLEM_SRC = "/icons/teamemblum_default.svg";

/**
 * next/image에 넘길 src. 도메인 없는 경로·잘못된 URL·빈 값이면 fallback 반환해 Invalid URL 오류를 방지합니다.
 * @param fallback 기본값 MOCK_IMAGE_SRC. 엠블럼 등은 MOCK_EMBLEM_SRC 권장.
 */
export function getValidImageSrc(
  src: string | null | undefined,
  fallback: string = MOCK_IMAGE_SRC,
): string {
  if (src == null || typeof src !== "string") return fallback;
  const t = src.trim();
  if (!t) return fallback;
  if (t.startsWith("/")) return t;
  if (t.startsWith("http://") || t.startsWith("https://")) {
    try {
      new URL(t);
      return t;
    } catch {
      return fallback;
    }
  }
  return fallback;
}
