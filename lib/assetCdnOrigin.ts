/**
 * CDN 원점 (호스트·접두사). createEnv를 쓰지 않아 Jest 등에서 @t3-oss ESM 로드 문제를 피합니다.
 * 값은 lib/env 의 NEXT_PUBLIC_ASSET_CDN_ORIGIN 과 동일해야 합니다 (빌드 시 NEXT_PUBLIC_* 인라인).
 */
let cached: { httpsOrigin: string; prefixes: readonly string[] } | null = null;

function resolve(): { httpsOrigin: string; prefixes: readonly string[] } {
  const raw = process.env.NEXT_PUBLIC_ASSET_CDN_ORIGIN?.trim().replace(/\/$/, "");
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_ASSET_CDN_ORIGIN이 없습니다. .env·Vercel에 설정하세요.",
    );
  }
  const parsed = new URL(raw);
  const host = parsed.host;
  return {
    httpsOrigin: `https://${host}`,
    prefixes: [`https://${host}`, `http://${host}`, `//${host}`] as const,
  };
}

export function getAssetCdnConfig(): {
  httpsOrigin: string;
  prefixes: readonly string[];
} {
  if (!cached) cached = resolve();
  return cached;
}
