/**
 * 비로그인 사용자 전용. 로그인 상태로 접근하면 /home 으로 보냄.
 * (privacy-policy / privacy-consent 는 로그인 여부와 관계없이 또는 로그인 필수이므로 여기 넣지 않음)
 */
export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/$/, // 메인 페이지
  /^\/social\/callback(\/.*)?$/, // 소셜 로그인 콜백 (및 하위 경로)
];

/**
 * 비로그인도 접근 가능. 로그인해도 접근 가능(isPrivate 아님).
 * privacy-consent 는 여기 없음 → Private → 토큰 필요(소셜 pending 동의 플로우).
 */
export const PUBLIC_ROUTES = [
  /^\/calculation(\/.*)?$/,
  /^\/player(\/.*)?$/,
  /^\/privacy-policy(\/.*)?$/,
  /^\/terms(\/.*)?$/,
  /^\/marketing-notice(\/.*)?$/,
];

const TEAM_MANAGEMENT_PATH = /^\/team-management(\/.*)?$/;

/** 팀 관리 및 하위 경로 — RBAC·리다이렉트용 */
export function isTeamManagementPath(pathname: string): boolean {
  return TEAM_MANAGEMENT_PATH.test(pathname);
}

// 로그인 + 팀이 있어야만 접근 가능한 경로 (팀 없으면 /landing으로 리다이렉트)
export const TEAM_REQUIRED_ROUTES = [
  /^\/home(\/.*)?$/,
  /^\/team-data(\/.*)?$/,
  TEAM_MANAGEMENT_PATH,
  /^\/formation(\/.*)?$/,
  /^\/player(\/.*)?$/,
];
