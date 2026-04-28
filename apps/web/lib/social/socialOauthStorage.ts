/**
 * 소셜 OAuth 직후 프론트에 잠시 보관하는 스냅샷 (회원가입/추가 입력 퍼널용).
 * 민감정보이므로 sessionStorage만 사용하고, 퍼널 종료 후 반드시 제거하는 것을 권장합니다.
 */
export const SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY = "overall_social_oauth_snapshot";

export type SocialOauthSnapshot = {
  provider: "kakao" | "naver" | "google";
  accessToken: string;
  email: string | null;
  /** 카카오/네이버/구글 각 프로필 API 원본(JSON 직렬화 가능 객체) */
  userMe: unknown | null;
  savedAt: string;
};
