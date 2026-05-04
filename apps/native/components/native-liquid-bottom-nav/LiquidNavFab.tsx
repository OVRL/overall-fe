import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ACCENT_HEX, BLUR_INTENSITY_FAB } from "./constants";
import { ICON_PLUS } from "./navConfig";
import { GlassBackdrop } from "./GlassBackdrop";
import { nativeLiquidBottomNavStyles } from "./nativeLiquidBottomNav.styles";

type LiquidNavFabProps = {
  onPress: () => void;
};

/**
 * 우측 원형 FAB(+).
 */
export function LiquidNavFab({ onPress }: LiquidNavFabProps) {
  return (
    <View style={nativeLiquidBottomNavStyles.fabShadowWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="경기 등록"
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [
          nativeLiquidBottomNavStyles.fabPressable,
          pressed ? nativeLiquidBottomNavStyles.fabPressed : null,
        ]}
      >
        <View style={nativeLiquidBottomNavStyles.fabGlassClip}>
          <GlassBackdrop
            intensity={BLUR_INTENSITY_FAB}
            tint="light"
            variant="fab"
            fallbackStyle={nativeLiquidBottomNavStyles.fabBlurFallback}
          />
          <View className="pointer-events-none absolute inset-0 bg-gray-200/30" />
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(51, 51, 51, 0.26)", "rgba(51, 51, 51, 0.3)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={nativeLiquidBottomNavStyles.fabDarkOverlay}
          />
          <View
            pointerEvents="none"
            style={nativeLiquidBottomNavStyles.fabInsetStroke}
          />
          <View
            pointerEvents="none"
            style={nativeLiquidBottomNavStyles.fabInnerHighlight}
          />
          <View
            pointerEvents="none"
            style={nativeLiquidBottomNavStyles.fabIconLayer}
          >
            <Image
              source={ICON_PLUS}
              style={nativeLiquidBottomNavStyles.fabIcon}
              contentFit="contain"
              tintColor={ACCENT_HEX}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
