/**
 * 비로그인 사용자 전용. 로그인 상태로 접근하면 /(앱 루트)로 보냄.
 * (privacy-policy / privacy-consent 는 로그인 여부와 관계없이 또는 로그인 필수이므로 여기 넣지 않음)
 */
export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/login\/social$/,
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
  /^\/onboarding(\/.*)?$/, // 소셜 미가입 사용자 회원가입 퍼널(소셜 스냅샷이 있으면 social-register 모드)
  /^\/social\/[^/]+\/callback(\/.*)?$/, // FE 소셜 콜백(코드 수신 등): 비로그인 접근 허용
];

const TEAM_MANAGEMENT_PATH = /^\/team-management(\/.*)?$/;

/** 팀 관리 및 하위 경로 — RBAC·리다이렉트용 */
export function isTeamManagementPath(pathname: string): boolean {
  return TEAM_MANAGEMENT_PATH.test(pathname);
}

// 로그인 + 팀이 있어야만 접근 가능한 경로 (팀 없으면 /join-team으로 리다이렉트)
export const TEAM_REQUIRED_ROUTES = [
  /^\/$/,
  /^\/team-data(\/.*)?$/,
  TEAM_MANAGEMENT_PATH,
  /^\/formation(\/.*)?$/,
  /^\/player(\/.*)?$/,
  /^\/match-record(\/.*)?$/,
];

/**
 * app/layout 등에서 사용: 해당 경로는 소속 팀이 있어야 함.
 */
export function requiresTeamMembershipForPath(pathname: string): boolean {
  return TEAM_REQUIRED_ROUTES.some((pattern) => pattern.test(pathname));
}

/**
 * 로그인(private)만 필요하고 팀 소속은 불필요한 경로인지.
 * - proxy: GUEST_ONLY·PUBLIC이 아님 → 토큰 검사 대상
 * - layout: TEAM_REQUIRED가 아님 → 팀 없을 때 /join-team으로 보내지 않음
 *
 * `LOGIN_ONLY_WITHOUT_TEAM_ROUTES`는 현재 앱에 있는 페이지 위주의 **목록(문서·검색용)**이며,
 * 위 규칙으로 판별되는 **전체 private·비팀필수 경로**와 항상 1:1로 같지는 않을 수 있음(새 private 페이지 등).
 */
export function isLoginOnlyWithoutTeamPath(pathname: string): boolean {
  if (GUEST_ONLY_ROUTES.some((re) => re.test(pathname))) return false;
  if (PUBLIC_ROUTES.some((re) => re.test(pathname))) return false;
  return !requiresTeamMembershipForPath(pathname);
}

/**
 * 팀 멤버십을 layout에서 요구하지 않는 private 페이지 패턴(문서·검색용).
 * TEAM_REQUIRED가 아니므로 팀 미소속이라도 이 경로에 머물 수 있음(공개는 아님).
 * pending·약관 동의 등은 각 페이지/가드에서 별도 처리.
 *
 * `/onboarding`은 팀 조건과 별개로 pending 등 **플로우 전용**이라 이 목록에 넣지 않음.
 */
export const LOGIN_ONLY_WITHOUT_TEAM_ROUTES: RegExp[] = [
  /^\/create-team(\/.*)?$/,
  /^\/join-team(\/.*)?$/,
  /^\/privacy-consent(\/.*)?$/,
  /^\/mom(\/.*)?$/,
  /^\/profile(\/.*)?$/,
];
