/**
 * 외부 OAuth 페이지는 우리 웹이 viewport meta / safe-area를 제어할 수 없어
 * 노치·상태바 영역에 제공자 UI(뒤로가기 등)가 겹칠 수 있다.
 * 해당 호스트일 때만 네이티브 상단 Safe Area(chrome safe)를 켠다.
 */
export function inferWebViewChromeModeFromUrl(
  url: string,
  appOrigin: string,
): "safe" | "fullscreen" {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return "fullscreen";
  }

  let appHost: string | null = null;
  try {
    appHost = new URL(appOrigin).hostname;
  } catch {
    appHost = null;
  }

  if (appHost && hostname === appHost) {
    return "fullscreen";
  }

  const oauthRoots = [
    "nid.naver.com",
    "kauth.kakao.com",
    "accounts.google.com",
    "appleid.apple.com",
  ] as const;

  for (const root of oauthRoots) {
    if (hostname === root || hostname.endsWith(`.${root}`)) {
      return "safe";
    }
  }

  return "fullscreen";
}
