import { LinearGradient } from "expo-linear-gradient";
import { type ColorValue, StyleSheet, View } from "react-native";

/** LinearGradient 는 cssInterop이 없을 수 있어, 전면 덮는 영역은 인라인 절대 배치로 둡니다. */
const ABSOLUTE_FILL = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/** apps/web `shared-tokens` primary-light / dark-olive / black 에 대응하는 근사 HEX */
const GRADIENT_COLORS = ["#E8FEB8", "#3A3F35", "#000000"] as const;
const OVERLAY_OLIVE = [
  "rgba(58, 63, 51, 0.4)",
  "transparent",
  "transparent",
] as const;
const OVERLAY_BLACK = [
  "rgba(0,0,0,0.7)",
  "rgba(0,0,0,0.5)",
  "rgba(0,0,0,0.3)",
] as const;

/** 렌더마다 배열을 새로 만들지 않도록, 튜플 형태로 한 번만 고정합니다. */
const LINEAR_GRADIENT_MAIN = [...GRADIENT_COLORS] as readonly [
  ColorValue,
  ColorValue,
  ColorValue,
];
const LINEAR_OVERLAY_OLIVE = [...OVERLAY_OLIVE] as readonly [
  ColorValue,
  ColorValue,
  ColorValue,
];
const LINEAR_OVERLAY_BLACK = [...OVERLAY_BLACK] as readonly [
  ColorValue,
  ColorValue,
  ColorValue,
];

/** 소셜 로그인 화면 전체 배경 그라데이션 레이어 */
export function NativeSocialLoginBackground() {
  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={LINEAR_GRADIENT_MAIN}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ABSOLUTE_FILL}
      />
      <LinearGradient
        colors={LINEAR_OVERLAY_OLIVE}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ABSOLUTE_FILL}
        pointerEvents="none"
      />
      <LinearGradient
        colors={LINEAR_OVERLAY_BLACK}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={ABSOLUTE_FILL}
        pointerEvents="none"
      />
    </View>
  );
}
