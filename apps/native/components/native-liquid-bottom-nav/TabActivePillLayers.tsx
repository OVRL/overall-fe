import { View } from "react-native";
import { nativeLiquidBottomNavStyles } from "./nativeLiquidBottomNav.styles";

/**
 * 활성 탭 배경 — 밝은 흰 필.
 */
export function TabActivePillLayers() {
  return (
    <View
      pointerEvents="none"
      style={nativeLiquidBottomNavStyles.tabActiveShadowHost}
    >
      <View style={nativeLiquidBottomNavStyles.tabActiveGlassClip}>
        <View
          style={nativeLiquidBottomNavStyles.tabActiveFill}
          accessibilityElementsHidden
        />
        <View
          style={nativeLiquidBottomNavStyles.tabActiveInsetStroke}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}
