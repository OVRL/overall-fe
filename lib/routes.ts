export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/$/, // 메인 페이지
  /^\/social\/callback(\/.*)?$/, // 소셜 로그인 콜백 (및 하위 경로)
];

// 로그인 없이 접근 가능한 공개 경로 (여기 있으면 x-is-private-route 미설정 → 레이아웃에서 initialUser 미조회)
export const PUBLIC_ROUTES = [/^\/calculation(\/.*)?$/, /^\/player(\/.*)?$/];

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
