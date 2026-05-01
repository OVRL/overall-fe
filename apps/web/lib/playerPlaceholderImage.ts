import { getValidImageSrc } from "@/lib/utils";

/** `public/images/player/` 기준 플레이스홀더 (순서 고정 — 해시 인덱싱용) */
export const PLAYER_PLACEHOLDER_IMAGES = [
  "/images/player/img_player_1.webp",
  "/images/player/img_player_2.webp",
  "/images/player/img_player_3.webp",
  "/images/player/img_player_4.webp",
  "/images/player/img_player_5.webp",
  "/images/player/img_player_6.webp",
  "/images/player/img_player_7.webp",
  "/images/player/img_player_8.webp",
  "/images/player/img_player_9.webp",
] as const;

const PLACEHOLDER_PATH_SET = new Set<string>(PLAYER_PLACEHOLDER_IMAGES);

/**
 * `next/image`가 동일 WebP를 다시 q=75로 인코딩하지 않도록 구분할 때 사용합니다.
 * (공식 문서: 이미 최종 포맷·손실 압축된 에셋은 `unoptimized`가 적합한 경우가 있음)
 */
export function isPlayerPlaceholderWebpSrc(src: string): boolean {
  const raw = src.trim();
  if (!raw) return false;
  let path = raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      path = new URL(raw).pathname;
    } catch {
      return false;
    }
  } else {
    path = raw.split("?")[0] ?? raw;
  }
  return PLACEHOLDER_PATH_SET.has(path);
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

/**
 * 시드 문자열에 따라 항상 동일한 로컬 플레이스홀더 경로를 반환합니다.
 * (로스터·베스트11·팀데이터·감독 UI 간 동일 인물 = 동일 이미지)
 */
export function getPlayerPlaceholderSrc(seed: string): string {
  const s = seed.trim();
  if (!s) return PLAYER_PLACEHOLDER_IMAGES[0];
  const idx = djb2Hash(s) % PLAYER_PLACEHOLDER_IMAGES.length;
  return PLAYER_PLACEHOLDER_IMAGES[idx];
}

/**
 * GraphQL `user.id`(Int), `"14"`, Relay 글로벌 ID `"UserModel:14"` 모두
 * 동일 DB 유저면 같은 플레이스홀더가 나오도록 정규화합니다.
 * (`hooks/useUserId`의 parseUserId와 동일 규칙)
 */
export function normalizeUserIdForAvatarSeed(
  raw: string | number | null | undefined,
): string | null {
  if (raw == null) return null;
  if (typeof raw === "number") {
    return Number.isInteger(raw) && !Number.isNaN(raw) ? String(raw) : null;
  }
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isNaN(n)) return String(n);
  const last = s.split(":").pop();
  if (last == null) return s;
  const num = Number(last);
  if (!Number.isNaN(num)) return String(num);
  return s;
}

/**
 * 플레이스홀더 해시용 시드 `u:<정규화 id>` (없으면 null).
 */
export function getUserAvatarSeedFromGraphqlId(
  graphqlUserId: string | number | null | undefined,
): string | null {
  const normalized = normalizeUserIdForAvatarSeed(graphqlUserId);
  if (normalized == null) return null;
  return `u:${normalized}`;
}

/**
 * 팀 멤버 아바타 시드: 유저 ID가 있으면 정규화한 `u:` 우선,
 * 없으면 팀멤버 ID 기준 `m:` (유저 미연동 레코드 등)
 */
export function getTeamMemberAvatarSeed(member: {
  id: number;
  user?: { id: string | number | null } | null;
}): string {
  const userSeed = getUserAvatarSeedFromGraphqlId(member.user?.id ?? undefined);
  if (userSeed) return userSeed;
  return `m:${member.id}`;
}

/** 팀 멤버 프로필 **원본** URL만 (트림, 없으면 빈 문자열). UI는 `fallbackSrc`와 함께 전달. */
export function getTeamMemberProfileImageRawUrl(member: {
  profileImg?: string | null;
  user?: { id: string | number | null; profileImage?: string | null } | null;
}): string {
  return (member.profileImg ?? member.user?.profileImage ?? "").trim();
}

/** 팀 멤버별 결정론적 플레이스홀더 URL만. */
export function getTeamMemberProfileImageFallbackUrl(member: {
  id: number;
  user?: { id: string | number | null } | null;
}): string {
  return getPlayerPlaceholderSrc(getTeamMemberAvatarSeed(member));
}

/** 로그인 유저 프로필 원본 URL만. */
export function getUserProfileImageRawUrl(
  user: { profileImage?: string | null } | null | undefined,
): string {
  return (user?.profileImage ?? "").trim();
}

/** 로그인 유저용 플레이스홀더 URL만 (감독 카드 등). */
export function getUserProfileImageFallbackUrl(
  user: { id?: string | number | null } | null | undefined,
): string {
  const userSeed = getUserAvatarSeedFromGraphqlId(user?.id ?? undefined);
  if (userSeed) return getPlayerPlaceholderSrc(userSeed);
  return getPlayerPlaceholderSrc("manager:anonymous");
}

/** 명예의 전당 등: 원본 이미지 URL만. */
export function getHallOfFamePlayerImageRawUrl(player: {
  image?: string | null;
}): string {
  return (player.image ?? "").trim();
}

/** 명예의 전당 등: 플레이스홀더 URL만. */
export function getHallOfFamePlayerImageFallbackUrl(player: {
  id?: number;
  name: string;
}): string {
  if (player.id != null) return getPlayerPlaceholderSrc(`m:${player.id}`);
  return getPlayerPlaceholderSrc(`n:${player.name}`);
}

/**
 * 한 문자열로 합친 표시용 URL (레거시·비 UI 경로용).
 * 화면에서는 `getTeamMemberProfileImageRawUrl` + `getTeamMemberProfileImageFallbackUrl` + ImgPlayer 권장.
 */
export function resolveTeamMemberProfileImage(member: {
  id: number;
  profileImg?: string | null;
  user?: { id: string | number | null; profileImage?: string | null } | null;
}): string {
  const fallback = getTeamMemberProfileImageFallbackUrl(member);
  const raw = getTeamMemberProfileImageRawUrl(member);
  if (!raw) return fallback;
  return getValidImageSrc(raw, fallback);
}

/** 로그인 유저 단일 URL (비 UI 경로용). */
export function resolveUserAvatarImage(user: {
  id: string | number;
  profileImage?: string | null;
}): string {
  const fallback = getUserProfileImageFallbackUrl(user);
  const raw = getUserProfileImageRawUrl(user);
  if (!raw) return fallback;
  return getValidImageSrc(raw, fallback);
}

/** Player 행: 한 문자열 (image만 있을 때 등). UI는 image + imageFallbackUrl 권장. */
export function resolvePlayerRowImage(player: {
  id: number;
  image?: string | null;
  imageFallbackUrl?: string | null;
}): string {
  const raw = (player.image ?? "").trim();
  const fallback =
    player.imageFallbackUrl?.trim() ||
    getPlayerPlaceholderSrc(`m:${player.id}`);
  if (!raw) return fallback;
  return getValidImageSrc(raw, fallback);
}

/** 명예의 전당: 한 문자열. */
export function resolveHallOfFamePlayerImage(player: {
  id?: number;
  name: string;
  image?: string | null;
}): string {
  const fallback = getHallOfFamePlayerImageFallbackUrl(player);
  const raw = getHallOfFamePlayerImageRawUrl(player);
  if (!raw) return fallback;
  return getValidImageSrc(raw, fallback);
}
