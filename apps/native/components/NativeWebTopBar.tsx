import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeTopBarState } from "@/types/nativeTopBar";

export type { NativeTopBarState };

type Props = {
  config: NativeTopBarState;
  /** WebView가 상단까지 확장(fullscreen)일 때 노치 여백 */
  chromeMode: "safe" | "fullscreen";
  onLeftPress: () => void;
  onRightPress: () => void;
};

/**
 * 웹 `Header` TopbarHeader와 유사한 인앱 전용 상단 바.
 * SvgXml(RNSVGView)는 일부 iOS Fabric 조합에서 "Unimplemented"가 나와 벡터는 Ionicons로 표시한다.
 */
function NativeWebTopBarInner({
  config,
  chromeMode,
  onLeftPress,
  onRightPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const topInset = chromeMode === "fullscreen" ? insets.top : 0;

  return (
    <View
      style={[
        styles.root,
        config.transparent ? styles.bgTransparent : styles.bgSolid,
        { paddingTop: topInset },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.side}>
          {config.showLeft ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={12}
              onPress={onLeftPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="chevron-back" size={26} color="#F8F8F9" />
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>

        <View style={styles.center}>
          {config.centerMatchLineupLogo ? (
            <Text style={styles.centerLogoText} numberOfLines={1}>
              매치 라인업
            </Text>
          ) : config.title ? (
            <Text style={styles.title} numberOfLines={1}>
              {config.title}
            </Text>
          ) : null}
        </View>

        <View style={[styles.side, styles.sideEnd]}>
          {config.rightMode === "label" && config.rightLabel ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={12}
              disabled={config.rightDisabled}
              onPress={onRightPress}
              style={({ pressed }) => [
                styles.rightLabelBtn,
                config.rightDisabled && styles.disabled,
                pressed && !config.rightDisabled && styles.pressed,
              ]}
            >
              <Text style={styles.rightLabelText}>{config.rightLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      </View>
    </View>
  );
}

export const NativeWebTopBar = memo(NativeWebTopBarInner);

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  bgSolid: {
    backgroundColor: "rgba(1, 1, 1, 0.82)",
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sideEnd: {
    justifyContent: "flex-end",
  },
  center: {
    flexShrink: 1,
    flexGrow: 0,
    maxWidth: "52%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  centerLogoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 12,
    borderRadius: 8,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
  },
  rightLabelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rightLabelText: {
    color: "#F7F8F8",
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});
