/**
 * 브라우저에서 OAuth state·PKCE verifier를 httpOnly 쿠키에 저장하기 위한 Same-Origin POST.
 */
export function createOAuthState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function postOAuthState(
  body: Record<string, unknown>,
): Promise<void> {
  const res = await fetch("/api/auth/oauth/state", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(j?.error ?? `HTTP ${res.status}`);
  }
}
