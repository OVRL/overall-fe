export const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/$/, // 메인 페이지
  /^\/onboarding(\/.*)?$/, // 온보딩 (및 하위 경로)
];

export const PUBLIC_ROUTES = [
  /^\/social\/callback(\/.*)?$/, // 소셜 로그인 콜백 (및 하위 경로)
];
