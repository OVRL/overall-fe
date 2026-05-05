import type { ExpoConfig } from "expo/config";

const KAKAO_LOGIN_PLUGIN = "@react-native-seoul/kakao-login";

/**
 * Kakao Developers 콘솔의 네이티브 앱 키를 prebuild 시 플러그인에 주입합니다.
 * 로컬: apps/native/.env 에 KAKAO_NATIVE_APP_KEY 설정 (Expo가 app.config 로드 시 읽음)
 * EAS: eas secret create --name KAKAO_NATIVE_APP_KEY --value ...
 */
function getKakaoKeyFromPlugins(
  plugins: ExpoConfig["plugins"] | undefined,
): string {
  if (!plugins) return "";
  for (const entry of plugins) {
    if (Array.isArray(entry) && entry[0] === KAKAO_LOGIN_PLUGIN) {
      const opts = entry[1] as { kakaoAppKey?: string } | undefined;
      return (opts?.kakaoAppKey ?? "").trim();
    }
  }
  return "";
}

/**
 * 카카오 로그인 플러그인 옵션에 주입된 `kakaoAppKey`만 갱신하고,
 * `kotlinVersion` 등 나머지 필드는 유지한다(덮어쓰면 EAS Android Gradle이 실패할 수 있음).
 */
function withKakaoNativeAppKey(
  plugins: ExpoConfig["plugins"] | undefined,
  kakaoAppKey: string,
): ExpoConfig["plugins"] {
  if (!plugins) return plugins;
  return plugins.map((entry) => {
    if (Array.isArray(entry) && entry[0] === KAKAO_LOGIN_PLUGIN) {
      const prev =
        (entry[1] as Record<string, unknown> | undefined) ?? {};
      return [KAKAO_LOGIN_PLUGIN, { ...prev, kakaoAppKey }] as const;
    }
    return entry;
  });
}

export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
  const fromEnv = (
    process.env.KAKAO_NATIVE_APP_KEY ??
    process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ??
    ""
  ).trim();
  const fromStatic = getKakaoKeyFromPlugins(config.plugins);
  const kakaoAppKey = fromEnv || fromStatic;

  if (!kakaoAppKey) {
    console.warn(
      "[app.config] Kakao 네이티브 앱 키가 없습니다. app.json 플러그인 또는 KAKAO_NATIVE_APP_KEY 환경 변수를 설정한 뒤 `pnpm exec expo prebuild -p ios` 로 Info.plist를 갱신하세요.",
    );
  }

  const extra = config.extra as Record<string, unknown> | undefined;
  const nativeSocial =
    (extra?.nativeSocialLogin as Record<string, string> | undefined) ?? {};

  /**
   * 릴리스에서 `[SplashBoot]` 콘솔 로그를 켤 때 사용.
   * - `app.json` extra.splashBootTimelineLog: true
   * - 또는 EAS/로컬 빌드 시 env: SPLASH_BOOT_TIMELINE_LOG=1 (또는 EXPO_PUBLIC_ 동일)
   * - env 가 0|false|no 이면 extra 가 true여도 끔
   */
  const splashBootEnv = (
    process.env.SPLASH_BOOT_TIMELINE_LOG ??
    process.env.EXPO_PUBLIC_SPLASH_BOOT_TIMELINE_LOG ??
    ""
  )
    .trim()
    .toLowerCase();
  let splashBootTimelineLog = extra?.splashBootTimelineLog === true;
  if (
    splashBootEnv === "1" ||
    splashBootEnv === "true" ||
    splashBootEnv === "yes"
  ) {
    splashBootTimelineLog = true;
  }
  if (
    splashBootEnv === "0" ||
    splashBootEnv === "false" ||
    splashBootEnv === "no"
  ) {
    splashBootTimelineLog = false;
  }

  return {
    ...config,
    plugins: withKakaoNativeAppKey(config.plugins, kakaoAppKey),
    extra: {
      ...extra,
      splashBootTimelineLog,
      nativeSocialLogin: {
        ...nativeSocial,
        kakaoNativeAppKey: kakaoAppKey,
      },
    },
  };
};
