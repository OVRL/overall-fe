import { useLocalSearchParams, Stack, useNavigation } from "expo-router";
import { WebView } from "react-native-webview";
import { useRef, useEffect, useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { handleBridgeMessage } from "../utils/bridgeHandler";
import { decrementStackDepth } from "../utils/navigationStack";
import { APPLICATION_NAME_FOR_USER_AGENT } from "../utils/webViewUserAgent";

const BACKGROUND = {
  // WebView(웹)이 다크 테마 기준이어서 네이티브 배경도 동일하게 맞춘다.
  light: "#010101",
  dark: "#010101",
} as const;

export default function WebViewScreen() {
  const navigation = useNavigation();
  const { url } = useLocalSearchParams<{ url: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor = BACKGROUND[colorScheme];
  const webViewRef = useRef<WebView>(null);
  const [chromeMode, setChromeMode] = useState<"safe" | "fullscreen">(
    "fullscreen"
  );

  useEffect(() => {
    return () => {
      decrementStackDepth();
    };
  }, []);

  return (
    <View style={[styles.screenRoot, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <SafeAreaView
        edges={chromeMode === "safe" ? ["top"] : []}
        style={[styles.container, { backgroundColor }]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <WebView
          ref={webViewRef as any}
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          onMessage={async (event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              await handleBridgeMessage(webViewRef as any, data, navigation, {
                onSetWebViewChrome: setChromeMode,
              });
            } catch (e) {
              console.error("Failed to parse bridge message", e);
            }
          }}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          cacheEnabled={true}
          applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
