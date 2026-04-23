import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const BACKGROUND = {
  light: "#ffffff",
  dark: "#000000",
} as const;

const SPLASH_DURATION_MS = 2200;

type Props = {
  onFinish: () => void;
};

export default function InteractiveSplashScreen({ onFinish }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor = BACKGROUND[colorScheme];

  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // 로고: 페이드인 + 살짝 스케일 업
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 120,
    });

    // 하단 프로그레스 바: 일정 시간 동안 채워짐
    progressWidth.value = withDelay(
      300,
      withTiming(1, { duration: SPLASH_DURATION_MS - 500 })
    );
  }, [opacity, scale, progressWidth]);

  useEffect(() => {
    const t = setTimeout(() => {
      onFinish();
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [onFinish]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.logoWrap, logoAnimatedStyle]}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: colorScheme === "dark" ? "#fff" : "#000" },
            progressAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  progressTrack: {
    position: "absolute",
    bottom: 80,
    left: 48,
    right: 48,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "rgba(128,128,128,0.3)",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
