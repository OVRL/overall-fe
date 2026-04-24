import { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeGlobalHeaderState } from "@/types/nativeChrome";

/** `apps/web/public/icons/logo_OVR.svg` → `assets/topbar` 복사본 (expo-image로 디코딩) */
const LOGO_OVR = require("@/assets/topbar/logo_OVR.svg") as number;

type Props = {
  config: NativeGlobalHeaderState;
  chromeMode: "safe" | "fullscreen";
  onLogoPress: () => void;
  onHamburgerPress: () => void;
};

/**
 * 웹 `Header variant="global"` 상단 행과 유사 — 로고(SVG 에셋) + 햄버거.
 * SvgXml(RNSVGView)는 일부 iOS Fabric에서 "Unimplemented"가 나와 expo-image로 표시한다.
 */
function NativeWebGlobalHeaderInner({
  config,
  chromeMode,
  onLogoPress,
  onHamburgerPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const topInset = chromeMode === "fullscreen" ? insets.top : 0;

  return (
    <View style={[styles.root, styles.bgBar, { paddingTop: topInset }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="홈으로 가기"
          hitSlop={12}
          onPress={onLogoPress}
          style={({ pressed }) => [styles.logoBtn, pressed && styles.pressed]}
        >
          <Image
            source={LOGO_OVR}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </Pressable>
        <View style={styles.spacer} />
        {config.showHamburger ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="메뉴 열기"
            hitSlop={12}
            onPress={onHamburgerPress}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <Ionicons name="menu" size={24} color="#F8F8F9" />
          </Pressable>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

export const NativeWebGlobalHeader = memo(NativeWebGlobalHeaderInner);

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  bgBar: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  logoBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  logoImage: {
    width: 92,
    height: 48,
  },
  spacer: {
    flex: 1,
  },
  iconBtn: {
    padding: 12,
    borderRadius: 8,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
  },
  pressed: {
    opacity: 0.85,
  },
});
