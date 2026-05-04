import { Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { CAN_USE_NATIVE_BLUR } from "./expoBlurAvailable";
import { nativeLiquidBottomNavStyles } from "./nativeLiquidBottomNav.styles";

export type GlassBackdropProps = {
  intensity: number;
  tint: "light" | "dark" | "default";
  fallbackStyle:
    | typeof nativeLiquidBottomNavStyles.pillBlurFallback
    | typeof nativeLiquidBottomNavStyles.fabBlurFallback;
  variant: "pill" | "fab";
};

/**
 * 네이티브에 `ExpoBlurView`가 있을 때만 `BlurView`, 없으면 반투명 `View`.
 */
export function GlassBackdrop({
  intensity,
  tint,
  fallbackStyle,
  variant,
}: GlassBackdropProps) {
  const radiusStyle =
    variant === "pill"
      ? nativeLiquidBottomNavStyles.pillBlurRadius
      : nativeLiquidBottomNavStyles.fabBlurRadius;
  if (!CAN_USE_NATIVE_BLUR) {
    return (
      <View
        style={[
          nativeLiquidBottomNavStyles.blurFill,
          radiusStyle,
          fallbackStyle,
        ]}
        pointerEvents="none"
      />
    );
  }
  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      experimentalBlurMethod={
        Platform.OS === "android" ? "dimezisBlurView" : undefined
      }
      style={[nativeLiquidBottomNavStyles.blurFill, radiusStyle]}
      pointerEvents="none"
    />
  );
}
