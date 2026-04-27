import Constants from "expo-constants";

/** WebView가 로드하는 웹 앱의 origin (스킴+호스트+포트). app.json extra.webOrigin 으로 덮어쓸 수 있음 */
export function getWebAppOrigin(): string {
  const fromExtra = Constants.expoConfig?.extra?.webOrigin;
  if (typeof fromExtra === "string" && fromExtra.length > 0) {
    return fromExtra.replace(/\/$/, "");
  }
  return "https://ovr-log.com";
}
