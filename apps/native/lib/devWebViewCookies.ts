/**
 * 로컬(`__DEV__` + localhost/10.0.2.2)에서 WebView **첫 요청**에 붙일 Cookie.
 * `buildDevCookieHeader()`는 `name=value`만 사용합니다. 토큰·팀 ID는 여기서 갱신하세요.
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
