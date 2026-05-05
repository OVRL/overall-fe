import Constants from "expo-constants";

/**
 * `[SplashBoot]` 타임라인 로그 활성 여부.
 * - 개발: `__DEV__` 이면 항상 true
 * - 릴리스: `app.json` / `app.config` 의 `extra.splashBootTimelineLog === true` 이거나
 *   빌드 시점 환경 변수 `SPLASH_BOOT_TIMELINE_LOG=1|true|yes` (또는 `EXPO_PUBLIC_` 동일)
 */
export function isSplashBootTimelineLogEnabled(): boolean {
  if (__DEV__) return true;
  const extra = Constants.expoConfig?.extra as
    | { splashBootTimelineLog?: boolean }
    | undefined;
  return extra?.splashBootTimelineLog === true;
}

/**
 * 앱 콜드 스타트·스플래시·WebView 게이트 디버깅용.
 * 릴리스에서는 `extra.splashBootTimelineLog` 또는 빌드 env로만 켜집니다.
 */
const bootWallMs = Date.now();

if (isSplashBootTimelineLogEnabled()) {
  console.log("[SplashBoot +0ms] splashBootDebug_module_import");
}

/** 앱 모듈 로드 이후 경과(ms). */
export function splashBootElapsedMs(): number {
  return Date.now() - bootWallMs;
}

type SplashBootExtra = Record<string, unknown>;

/**
 * 스플래시·인증·WebView 부트 타임라인 로그.
 * `isSplashBootTimelineLogEnabled()` 가 false이면 무시한다.
 */
export function splashBootLog(event: string, extra?: SplashBootExtra): void {
  if (!isSplashBootTimelineLogEnabled()) return;
  const ts = splashBootElapsedMs();
  if (extra && Object.keys(extra).length > 0) {
    console.log(`[SplashBoot +${ts}ms] ${event}`, extra);
  } else {
    console.log(`[SplashBoot +${ts}ms] ${event}`);
  }
}
