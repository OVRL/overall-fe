import { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeGlobalHeaderState } from "@/types/nativeChrome";
import { NativeWebTopBannerSlot } from "@/components/NativeWebTopBannerSlot";

/** `apps/web/public/icons/logo_OVR.svg` → `assets/topbar` 복사본 (expo-image로 디코딩) */
const LOGO_OVR = require("@/assets/topbar/logo_OVR.svg") as number;
const TEAM_MANAGEMENT_ICON = require("@/assets/topbar/team_management.svg") as number;

type Props = {
  config: NativeGlobalHeaderState;
  chromeMode: "safe" | "fullscreen";
  onLogoPress: () => void;
  onTeamManagementPress: () => void;
};

/**
 * 웹 `Header variant="global"` 상단 행과 유사 — 가운데 로고(SVG) + 우측 팀 관리 액션.
 * 하단에 Axon(AppLovin) MAX 배너 슬롯(`NativeWebTopBannerSlot`)을 붙인다.
 * SvgXml(RNSVGView)는 일부 iOS Fabric에서 "Unimplemented"가 나와 expo-image로 표시한다.
 */
function NativeWebGlobalHeaderInner({
  config,
  chromeMode,
  onLogoPress,
  onTeamManagementPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const topInset = chromeMode === "fullscreen" ? insets.top : 0;

  return (
    <View style={[styles.root, styles.bgBar, { paddingTop: topInset }]}>
      <View style={styles.row}>
        {/* 좌측 균형 슬롯(48x48) — 로고를 화면 정중앙에 맞추기 위함 */}
        <View style={styles.sideSlot} accessibilityElementsHidden />
        <View style={styles.centerSlot}>
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
        </View>
        <View style={styles.sideSlot}>
          {config.showTeamManagement ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="팀 관리로 이동"
              hitSlop={12}
              onPress={onTeamManagementPress}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <Image
                source={TEAM_MANAGEMENT_ICON}
                style={styles.teamManagementImage}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      </View>
      <NativeWebTopBannerSlot visible />
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
  /** 좌·우 동일 폭으로 가운데 로고 시각적 중앙 정렬 */
  sideSlot: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  centerSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  logoImage: {
    width: 92,
    height: 48,
  },
  iconBtn: {
    padding: 12,
    borderRadius: 8,
  },
  teamManagementImage: {
    width: 24,
    height: 24,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
  },
  pressed: {
    opacity: 0.85,
  },
});
