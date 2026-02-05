export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/$/, // 메인 페이지
];

export const PUBLIC_ROUTES = [
  /^\/social\/callback(\/.*)?$/, // 소셜 로그인 콜백 (및 하위 경로)
  /^\/onboarding(\/.*)?$/,
  /^\/home(\/.*)?$/,
  /^\/team-data(\/.*)?$/,
  /^\/formation(\/.*)?$/,
  /^\/team-management(\/.*)?$/,
];
