import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { StatusBar } from "react-native";

import "../global.css";

import InteractiveSplashScreen from "@/components/InteractiveSplashScreen";
import { useColorScheme } from "@/hooks/use-color-scheme";

// 네이티브 스플래시를 자동으로 숨기지 않고, 인터랙티브 스플래시 후에 숨기기 위해
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showInteractiveSplash, setShowInteractiveSplash] = useState(true);

  // 인터랙티브 스플래시를 보여줄 때 네이티브 스플래시를 숨겨 우리 화면이 보이게 함
  useEffect(() => {
    if (showInteractiveSplash) {
      SplashScreen.hideAsync();
    }
  }, [showInteractiveSplash]);

  const handleSplashFinish = () => {
    setShowInteractiveSplash(false);
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {showInteractiveSplash ? (
        <InteractiveSplashScreen onFinish={handleSplashFinish} />
      ) : (
        <>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="webview" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          {/* 네이티브 상단(상태바) 아이콘을 항상 흰색으로 고정 */}
          <StatusBar barStyle="light-content" />
        </>
      )}
    </ThemeProvider>
  );
}
