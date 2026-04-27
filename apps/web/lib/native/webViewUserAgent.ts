/**
 * 네이티브 WebView가 `applicationNameForUserAgent`로 붙이는 값과 동일한 부분 문자열.
 * apps/native/utils/webViewUserAgent.ts 의 APPLICATION_NAME_FOR_USER_AGENT 와 페어.
 */
export const OVERALL_RN_USER_AGENT_MARKER = "Overall_RN";

/** 서버·클라이언트 공통: 인앱 WebView 여부를 User-Agent 문자열로 판별 */
export function isNativeWebViewUserAgent(
  userAgent: string | null | undefined,
): boolean {
  if (!userAgent) return false;
  return userAgent.includes(OVERALL_RN_USER_AGENT_MARKER);
}
