import type { NativeSocialProvider } from "@/components/login/NativeSocialLoginScreen";

/** 웹 `extractSocialEmail.ts` 와 동일 규칙 (네이티브 번들 단일화) */
export function extractEmailFromUserMe(
  provider: NativeSocialProvider,
  userMe: unknown,
): string | null {
  if (!userMe || typeof userMe !== "object") return null;
  const o = userMe as Record<string, unknown>;

  if (provider === "google") {
    const email = o.email;
    return typeof email === "string" && email.length > 0 ? email : null;
  }

  if (provider === "naver") {
    const response = o.response;
    if (response && typeof response === "object") {
      const email = (response as Record<string, unknown>).email;
      return typeof email === "string" && email.length > 0 ? email : null;
    }
    return null;
  }

  const ka = o.kakao_account;
  if (ka && typeof ka === "object") {
    const email = (ka as Record<string, unknown>).email;
    return typeof email === "string" && email.length > 0 ? email : null;
  }

  return null;
}
