import { type ReactNode, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NAV_BAR_HEIGHT } from "./constants";

/** 플로팅 그림자·여유를 위해 NAV_BAR_HEIGHT 외 추가 픽셀 */
const OFFSCREEN_BUFFER_PX = 20;

const SLIDE_DURATION_MS = 280;

type AnimatedLiquidBottomNavShellProps = {
  /** true면 아래 방향으로 슬라이드 아웃(모달이 웹에 열린 상태) */
  hidden: boolean;
  children: ReactNode;
};

/**
 * 웹 모달 오버레이 시 하단 리퀴드 네브바를 화면 아래로 내렸다가,
 * 모달 종료 시 아래에서 슬라이드 인한다.
 */
export function AnimatedLiquidBottomNavShell({
  hidden,
  children,
}: AnimatedLiquidBottomNavShellProps) {
  const insets = useSafeAreaInsets();
  const offscreenDistance =
    insets.bottom + NAV_BAR_HEIGHT + OFFSCREEN_BUFFER_PX;

  const translateY = useSharedValue(hidden ? offscreenDistance : 0);

  useEffect(() => {
    translateY.value = withTiming(hidden ? offscreenDistance : 0, {
      duration: SLIDE_DURATION_MS,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [hidden, offscreenDistance, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents={hidden ? "none" : "box-none"}
      style={animatedStyle}
    >
      {children}
    </Animated.View>
  );
}
