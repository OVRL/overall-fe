import { Platform, UIManager } from "react-native";

/**
 * `expo-blur` JS만 있고 네이티브에 `ExpoBlurView`가 없으면 런타임 오류가 난다.
 */
export function isExpoBlurViewRegisteredInNative(): boolean {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return false;
  }
  try {
    const um = UIManager as unknown as {
      getViewManagerConfig?: (name: string) => object | null | undefined;
      hasViewManagerConfig?: (name: string) => boolean;
    };
    if (typeof um.hasViewManagerConfig === "function") {
      return um.hasViewManagerConfig("ExpoBlurView");
    }
    return um.getViewManagerConfig?.("ExpoBlurView") != null;
  } catch {
    return false;
  }
}

export const CAN_USE_NATIVE_BLUR = isExpoBlurViewRegisteredInNative();
