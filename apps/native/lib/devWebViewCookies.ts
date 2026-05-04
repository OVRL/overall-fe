/**
 * 로컬에서 **수동**으로 Cookie 헤더 문자열이 필요할 때만 사용 (예: curl·별도 스크립트).
 * 메인 앱 WebView는 `useWebViewPreAuth` → `injectStoredAuthCookiesForWebView` 만 쓰고,
 * 여기 값을 첫 요청 헤더로 붙이면 만료 토큰으로 Next `proxy` 가 세션을 버리고 `/login/social` 로 보낼 수 있음.
 */
export const DEV_COOKIE_JSON = [
  {
    domain: "ovr-log.com",
    expirationDate: 1808390396.933353,
    hostOnly: true,
    httpOnly: false,
    name: "selectedTeamId",
    path: "/",
    sameSite: "lax",
    secure: false,
    session: false,
    storeId: "0",
    value: "TeamModel%3A3",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "userId",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value: "14",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "accessToken",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJlbWFpbCI6InN1bnBsMDcxOEBuYXZlci5jb20iLCJpYXQiOjE3NzcwMDg1MTgsImV4cCI6MTc3NzAxNTcxOH0.0oflvX1KnHdcLTOyVn3EJ0IfR-vHC4WHbFdMM7I8bj8",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "refreshToken",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJlbWFpbCI6InN1bnBsMDcxOEBuYXZlci5jb20iLCJpYXQiOjE3NzY4NTI0OTcsImV4cCI6MTc3NzQ1NzI5N30.Di4e2IX1jx1mk6LIIFy_IO5MRn1YWiKISIMAWK9TQc8",
  },
] as const;

export function buildDevCookieHeader() {
  return DEV_COOKIE_JSON.map((c) => `${c.name}=${c.value}`).join("; ");
}
