import { useEffect } from "react";
import { Platform } from "react-native";
import { getApplovinMaxSdkKey } from "@/lib/applovinMaxConfig";

let moduleInitStarted = false;

/**
 * Axon(AppLovin) MAX SDK를 앱 수명 주기에서 한 번만 초기화합니다.
 * SDK 키가 없으면 호출하지 않습니다.
 *
 * `import` 대신 `require`를 쓰는 이유: 네이티브 바이너리에 모듈이 없을 때(Expo Go,
 * 패키지 추가 직후 미재빌드) 정적 import는 앱 기동 시점에 TurboModule 오류로 크래시합니다.
 */
export function useApplovinMaxBootstrap(): void {
  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    if (moduleInitStarted) return;

    const sdkKey = getApplovinMaxSdkKey();
    if (!sdkKey) return;

    type AppLovinModule = {
      initialize: (key: string) => Promise<{ countryCode?: string }>;
    };

    let AppLovinMAX: AppLovinModule;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- 네이티브 미포함 바이너리에서 정적 import 방지
      AppLovinMAX = require("react-native-applovin-max")
        .default as AppLovinModule;
    } catch (e: unknown) {
      if (__DEV__) {
        console.warn(
          "[AppLovinMAX] 네이티브 모듈을 찾을 수 없습니다. `pnpm exec expo prebuild` 후 `expo run:ios` / `expo run:android`로 재빌드했는지, Expo Go가 아닌 dev client인지 확인하세요.",
          e,
        );
      }
      return;
    }

    moduleInitStarted = true;
    void AppLovinMAX.initialize(sdkKey)
      .then((conf) => {
        if (__DEV__) {
          console.log("[AppLovinMAX] initialized", conf?.countryCode ?? "");
        }
      })
      .catch((e: unknown) => {
        moduleInitStarted = false;
        console.warn("[AppLovinMAX] initialize failed", e);
      });
  }, []);
}
