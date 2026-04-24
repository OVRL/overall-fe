import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { StatusBar } from "react-native";

import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

// 네이티브 스플래시를 자동으로 숨기지 않고, WebView가 준비될 때까지 유지하기 위해
SplashScreen.preventAutoHideAsync();

// `(tabs)` 그룹이 없으면 anchor가 깨져 초기/딥링크 라우팅이 Unmatched로 떨어질 수 있음
export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="webview" options={{ headerShown: false }} />
      </Stack>
      {/* 네이티브 상단(상태바) 아이콘을 항상 흰색으로 고정 */}
      <StatusBar barStyle="light-content" />
    </ThemeProvider>
  );
}
