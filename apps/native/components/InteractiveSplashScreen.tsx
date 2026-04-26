import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/** 다크 모드 메인 캔버스 bg-primary (RN에서 oklch 미지원 시 밝게 깨지는 이슈 방지 — hex 고정) */
const BG_BG_PRIMARY = "#131312";

const LOGO_SIZE = 240;

/**
 * 커스텀 전면 스플래시: 애니메이션 WebP 로고 + bg-bg-primary 배경.
 * 표시 여부는 부모가 마운트/언마운트로 제어합니다.
 */
export default function InteractiveSplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.94);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 380 });
    scale.value = withSpring(1, { damping: 16, stiffness: 140 });
  }, [opacity, scale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={styles.root}
      accessibilityLabel="Overall 스플래시"
    >
      <Animated.View style={[styles.logoWrap, logoAnimatedStyle]}>
        <Image
          source={require("../assets/images/login_logo.webp")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG_BG_PRIMARY,
  },
  logoWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
