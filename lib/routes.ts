export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/$/, // 메인 페이지
  /^\/social\/callback(\/.*)?$/, // 소셜 로그인 콜백 (및 하위 경로)
];

// 로그인 없이 접근 가능한 공개 경로 (여기 있으면 x-is-private-route 미설정 → 레이아웃에서 initialUser 미조회)
export const PUBLIC_ROUTES = [
  /^\/onboarding(\/.*)?$/,
  /^\/team-data(\/.*)?$/,
  /^\/formation(\/.*)?$/,
  /^\/team-management(\/.*)?$/,
  /^\/create-team(\/.*)?$/,
  /^\/calculation(\/.*)?$/,
];
