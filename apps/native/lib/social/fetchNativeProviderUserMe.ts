import { fetchUserInfoAsync } from "expo-auth-session";
import { discovery as googleOidcDiscovery } from "expo-auth-session/providers/google";

/** 카카오·네이버는 Next `userme` 라우트로 동일 스키마 확보 (회원가입 프리필 정합) */
export async function fetchUserMeViaWebRoutes(
  webOrigin: string,
  provider: "kakao" | "naver",
  accessToken: string,
): Promise<unknown> {
  const path =
    provider === "kakao"
      ? "/api/auth/kakao/userme"
      : "/api/auth/naver/userme";
  const res = await fetch(`${webOrigin}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  const json = (await res.json()) as { ok?: boolean; data?: unknown; error?: unknown };
  if (__DEV__ && (!res.ok || !json.ok || json.data == null)) {
    console.warn(
      "[fetchUserMeViaWebRoutes]",
      provider,
      `${webOrigin}${path}`,
      "status=",
      res.status,
      "json.ok=",
      json.ok,
      "error=",
      json.error,
    );
  }
  if (!res.ok || !json.ok || json.data == null) {
    throw new Error(
      typeof json.error === "string" ? json.error : "프로필 조회에 실패했습니다.",
    );
  }
  return json.data;
}

/** 구글 OIDC UserInfo (`providers/google` 의 discovery 와 동일 엔드포인트) */
export async function fetchGoogleUserInfo(accessToken: string): Promise<unknown> {
  return fetchUserInfoAsync({ accessToken }, googleOidcDiscovery);
}
