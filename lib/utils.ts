import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAssetCdnConfig } from "@/lib/assetCdnOrigin";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** next/image용: 유효한 절대 URL 또는 선행 슬래시 경로만 허용. 그 외는 fallback 반환. */
export const MOCK_IMAGE_SRC = "/images/player/img_player_2.webp";

/** 엠블럼/로고 등 기본 이미지 (getValidImageSrc fallback으로 사용) */
export const MOCK_EMBLEM_SRC = "/images/teamemblum_default.webp";

/** 백엔드가 객체 키만 줄 때 로컬 `public/` 과 혼동되지 않게 CDN 절대 URL로 만듦 */
const CDN_OBJECT_KEY_PREFIXES = [/^users\//, /^teams\//] as const;

function isCdnObjectKey(trimmed: string): boolean {
  return CDN_OBJECT_KEY_PREFIXES.some((re) => re.test(trimmed));
}

/**
 * `https://호스트` + `example.webp` 처럼 슬래시 없이 붙은 URL을 `https://호스트/example.webp` 로 고칩니다.
 */
function fixMissingSlashAfterCdnHost(url: string): string {
  const { prefixes } = getAssetCdnConfig();
  let s = url;
  for (const prefix of prefixes) {
    if (!s.startsWith(prefix) || s.length <= prefix.length) continue;
    const rest = s.slice(prefix.length);
    if (rest.startsWith("/") || rest.startsWith("?") || rest.startsWith("#")) continue;
    s = `${prefix}/${rest}`;
  }
  return s;
}

/** 스킴 없는 CDN 키·상대 경로에만 선행 `/` 를 붙임 (임의 문자열은 fallback 유지) */
const RELATIVE_IMAGE_PATH =
  /\.(webp|png|jpe?g|gif|svg|avif)(\?.*)?$/i;

function shouldPrependSlashAsRootRelative(s: string): boolean {
  if (s.includes(":")) return false;
  if (s.startsWith(".")) return false;
  if (isCdnObjectKey(s)) return false;
  if (RELATIVE_IMAGE_PATH.test(s)) return true;
  if (s.includes("/")) return true;
  return false;
}

/**
 * `users/...`, `teams/emblem/팀명/...` 등 CDN 객체 키(또는 잘못 `/`만 붙은 동일 경로) → CloudFront URL.
 * 세그먼트에 공백·한글 등이 있으면 `encodeURIComponent`로 이스케이프합니다.
 */
function resolveCdnObjectKeyUrl(t: string): string | null {
  const trimmed = t.replace(/^\/+/, "");
  if (!isCdnObjectKey(trimmed)) return null;
  const path = trimmed
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  const url = `${getAssetCdnConfig().httpsOrigin}/${path}`;
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

/**
 * next/image에 넘길 src. 도메인 없는 경로·잘못된 URL·빈 값이면 fallback 반환해 Invalid URL 오류를 방지합니다.
 * @param fallback 기본값 MOCK_IMAGE_SRC. 엠블럼 등은 MOCK_EMBLEM_SRC 권장.
 */
export function getValidImageSrc(
  src: string | null | undefined,
  fallback: string = MOCK_IMAGE_SRC,
): string {
  if (src == null || typeof src !== "string") return fallback;
  let t = src.trim();
  if (!t) return fallback;
  t = fixMissingSlashAfterCdnHost(t);
  if (t.startsWith("http://") || t.startsWith("https://")) {
    try {
      new URL(t);
      return t;
    } catch {
      return fallback;
    }
  }
  const cdnFromKey = resolveCdnObjectKeyUrl(t);
  if (cdnFromKey) return cdnFromKey;
  if (t.startsWith("/")) return t;
  // 스킴 없는 `example.webp`, `dir/a.png` 등은 루트 상대 경로로 취급 (선행 `/` 보강)
  if (shouldPrependSlashAsRootRelative(t)) {
    return `/${t.replace(/^\.\//, "")}`;
  }
  return fallback;
}
