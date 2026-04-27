import { isValid, parse, parseISO } from "date-fns";

/**
 * 스키마 `GraphQLDateTime` 설명(Y-m-d H:i:s) 및 ISO 문자열을 허용합니다.
 * 파싱 실패 시 null — 호출부에서 만료로 오판하지 않도록 합니다.
 */
export function parseGraphQLDateTime(value: string): Date | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const fromIso = parseISO(trimmed);
  if (isValid(fromIso)) return fromIso;

  const fromYmd = parse(trimmed, "yyyy-MM-dd HH:mm:ss", new Date(0));
  if (isValid(fromYmd)) return fromYmd;

  return null;
}

/** 현재 시각이 만료 시각 이상이면 true (동일 시각도 만료로 간주) */
export function isInviteExpired(
  expiredAt: string,
  now: Date = new Date(),
): boolean {
  const expiry = parseGraphQLDateTime(expiredAt);
  if (expiry == null) return false;
  return now.getTime() >= expiry.getTime();
}
