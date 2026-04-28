/** schema.graphql SocialLoginInput.email 과 매핑되는 값 추출 */

export type CallbackProvider = "kakao" | "naver" | "google";

export function extractEmailFromSocialProfile(
  provider: CallbackProvider,
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
