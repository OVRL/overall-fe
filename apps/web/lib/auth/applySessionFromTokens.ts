/**
 * socialLogin / registerUser 성공 후 앱 세션(httpOnly 쿠키)을 설정합니다.
 * `app/social/callback/route.ts`의 쿠키 옵션과 동일한 정책을 따릅니다.
 */
export async function applySessionFromTokens(options: {
  accessToken: string;
  refreshToken?: string | null;
  userId: number;
}): Promise<void> {
  const res = await fetch("/api/auth/set-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      accessToken: options.accessToken,
      refreshToken: options.refreshToken ?? undefined,
      userId: options.userId,
    }),
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(j?.error ?? `HTTP ${res.status}`);
  }
}
