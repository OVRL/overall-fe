import Constants from "expo-constants";
import { Platform } from "react-native";

export type ApplovinMaxExtra = {
  sdkKey?: string;
  bannerAdUnitIdIos?: string;
  bannerAdUnitIdAndroid?: string;
};

/**
 * `app.config.ts` → `extra.applovinMax` 및 EXPO_PUBLIC_* 환경 변수에서 MAX 설정을 읽습니다.
 * 런타임에는 `expo-constants`의 `extra`가 기준이며, 로컬 개발 시 `.env`의 EXPO_PUBLIC_* 가 주입됩니다.
 */
export function getApplovinMaxExtra(): ApplovinMaxExtra {
  const root = Constants.expoConfig?.extra as
    | { applovinMax?: ApplovinMaxExtra }
    | undefined;
  return root?.applovinMax ?? {};
}

/**
 * SDK 초기화에 사용할 키를 반환합니다.
 * 비어 있으면 `useApplovinMaxBootstrap`에서 초기화를 생략합니다.
 */
export function getApplovinMaxSdkKey(): string {
  return (getApplovinMaxExtra().sdkKey ?? "").trim();
}

/** iOS/Android에 맞는 배너 Ad Unit ID를 반환합니다. */
export function getApplovinMaxBannerAdUnitId(): string {
  const { bannerAdUnitIdIos = "", bannerAdUnitIdAndroid = "" } =
    getApplovinMaxExtra();
  if (Platform.OS === "ios") return bannerAdUnitIdIos.trim();
  if (Platform.OS === "android") return bannerAdUnitIdAndroid.trim();
  return "";
}

/**
 * 실제 MAX 배너를 그릴 수 있는지 (SDK 키 + 플랫폼 Ad Unit).
 * 키가 없을 때는 `__DEV__` 플레이스홀더만 사용합니다.
 */
export function canRenderApplovinMaxBanner(): boolean {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return false;
  return Boolean(getApplovinMaxSdkKey() && getApplovinMaxBannerAdUnitId());
}
