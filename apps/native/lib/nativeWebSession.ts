import CookieManager from "@react-native-cookies/cookies";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/** RNWebView_Auth_Implementation_Spec: SecureStore 키와 동일한 이름 사용 */
export const SECURE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userId: "userId",
} as const;

/** 네이티브 로그인 셸 등에서 세션 존재 여부 판별 */
export async function hasNativeAuthSession(): Promise<boolean> {
  const refresh = await SecureStore.getItemAsync(SECURE_KEYS.refreshToken);
  return Boolean(refresh && refresh.length > 0);
}

/** iOS WKWebView 쿠키 저장소와 맞추기 위해 WebKit API 사용 (README useWebKit) */
function useWebKitCookieStore(): boolean {
  return Platform.OS === "ios";
}

function farFutureExpires(): string {
  return "2030-01-01T00:00:00.000Z";
}

function buildSetCookieFields(webOrigin: string) {
  const https = webOrigin.startsWith("https:");
  return {
    path: "/",
    version: "1",
    expires: farFutureExpires(),
    secure: https,
    httpOnly: true,
  } as const;
}

/**
 * WebView 쿠키 항아리에서 관측된 토큰을 SecureStore로 이관 (스펙 Step 1).
 * HttpOnly 쿠키는 JS에서는 못 읽지만, 네이티브 CookieManager.get 은 WK/쿠키저장소에 따라 읽을 수 있음.
 */
export async function persistAuthCookiesFromWebView(
  webOrigin: string
): Promise<void> {
  const useWebKit = useWebKitCookieStore();
  const jar = await CookieManager.get(webOrigin, useWebKit);
  const access = jar.accessToken?.value;
  const refresh = jar.refreshToken?.value;
  if (!access || !refresh) return;

  await SecureStore.setItemAsync(SECURE_KEYS.accessToken, access);
  await SecureStore.setItemAsync(SECURE_KEYS.refreshToken, refresh);
  const uid = jar.userId?.value;
  if (uid) await SecureStore.setItemAsync(SECURE_KEYS.userId, uid);
}

/** 로그아웃·비회원 랜딩 감지 시 네이티브 금고 비우기 (스펙 Step 3) */
export async function clearNativeAuthStorage(): Promise<void> {
  await Promise.all(
    (Object.keys(SECURE_KEYS) as (keyof typeof SECURE_KEYS)[]).map((k) =>
      SecureStore.deleteItemAsync(SECURE_KEYS[k]).catch(() => undefined)
    )
  );
}

/**
 * WebView 마운트 전에 저장된 토큰을 도메인 쿠키로 주입 (스펙 Step 2).
 * WebView 캐시가 날아가도 앱 재실행 시 세션 복구에 사용.
 */
/** 소셜 로그인 뮤테이션 성공 직후: 금고·WKWebView 쿠키를 한 번에 기록 */
export async function persistNativeAuthSession(
  webOrigin: string,
  tokens: {
    accessToken: string;
    refreshToken?: string | null;
    userId: string | number;
  },
): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS.accessToken, tokens.accessToken);
  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(SECURE_KEYS.refreshToken, tokens.refreshToken);
  }
  await SecureStore.setItemAsync(SECURE_KEYS.userId, String(tokens.userId));
  await injectStoredAuthCookiesForWebView(webOrigin);
}

export async function injectStoredAuthCookiesForWebView(
  webOrigin: string
): Promise<void> {
  const useWebKit = useWebKitCookieStore();
  const fields = buildSetCookieFields(webOrigin);
  const refresh = await SecureStore.getItemAsync(SECURE_KEYS.refreshToken);
  const access = await SecureStore.getItemAsync(SECURE_KEYS.accessToken);

  if (refresh) {
    await CookieManager.set(
      webOrigin,
      { name: "refreshToken", value: refresh, ...fields },
      useWebKit
    );
  }
  if (access) {
    await CookieManager.set(
      webOrigin,
      { name: "accessToken", value: access, ...fields },
      useWebKit
    );
  }

  const userId = await SecureStore.getItemAsync(SECURE_KEYS.userId);
  if (userId) {
    await CookieManager.set(
      webOrigin,
      { name: "userId", value: userId, ...fields },
      useWebKit
    );
  }

  if (Platform.OS === "android") {
    await CookieManager.flush();
  }
}

/** 내비게이션 URL이 로그인 완료 후 동기화를 시도해도 되는 랜딩인지 */
export function shouldSyncCookiesFromWebView(
  url: string,
  webOrigin: string
): boolean {
  try {
    const u = new URL(url);
    if (u.origin !== webOrigin) return false;
    const p = u.pathname;
    return p === "/" || p.startsWith("/home");
  } catch {
    return false;
  }
}

/**
 * 웹에서 로그아웃·비로그인 랜딩으로 보일 때 네이티브 저장소·로그인 셸 동기화 여부.
 * 반드시 **우리 웹 앱 origin** 일 때만 판별한다.
 * (nid.naver.com 의 `/login/noauth/...` 처럼 외부 OAuth 페이지도 경로가 `/login` 으로 시작해 오탐하면 안 됨.)
 */
export function shouldClearNativeAuthFromNavigation(
  url: string,
  webAppOrigin: string,
): boolean {
  try {
    const u = new URL(url);
    const appOrigin = new URL(webAppOrigin).origin;
    if (u.origin !== appOrigin) return false;

    const p = u.pathname;
    // 네이티브 소셜 미가입 핸드오프: `/login/social` 등 제외
    if (p.startsWith("/login/social")) return false;
    if (p.startsWith("/privacy-consent")) return false;
    if (p.startsWith("/social/")) return false;
    return (
      p.startsWith("/login") ||
      p.includes("auth/logout") ||
      p.includes("/api/auth/logout")
    );
  } catch {
    return false;
  }
}
