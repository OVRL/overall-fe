import { useLocalSearchParams, Stack, useNavigation } from "expo-router";
import { WebView } from "react-native-webview";
import { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeWebTopBar } from "@/components/NativeWebTopBar";
import { NativeWebGlobalHeader } from "@/components/NativeWebGlobalHeader";
import type { NativeWebChrome } from "@/types/nativeChrome";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { handleBridgeMessage } from "../utils/bridgeHandler";
import { decrementStackDepth } from "../utils/navigationStack";
import { inferWebViewChromeModeFromUrl } from "@/lib/inferWebViewChromeModeFromUrl";
import {
  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
  isSameWebAppOrigin,
} from "@/lib/webViewViewportSync";
import { getWebAppOrigin } from "@/lib/webAuthConfig";
import { reduceNativeChromeForPathname } from "@/lib/reduceNativeChromeForPathname";
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
  const webOrigin = getWebAppOrigin();
  const [chromeMode, setChromeMode] = useState<"safe" | "fullscreen">(
    "fullscreen"
  );
  const [nativeChrome, setNativeChrome] = useState<NativeWebChrome | null>(
    null
  );

  const injectWebChromeMessage = useCallback((message: object) => {
    const payload = JSON.stringify(message);
    const js = `window.postMessage(${JSON.stringify(payload)}, '*'); true;`;
    webViewRef.current?.injectJavaScript(js);
  }, []);

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
        {nativeChrome?.mode === "topbar" ? (
          <NativeWebTopBar
            config={nativeChrome.topbar}
            chromeMode={chromeMode}
            onLeftPress={() =>
              injectWebChromeMessage({
                type: "NATIVE_TOPBAR_PRESS",
                payload: { side: "left" },
              })
            }
            onRightPress={() =>
              injectWebChromeMessage({
                type: "NATIVE_TOPBAR_PRESS",
                payload: { side: "right" },
              })
            }
          />
        ) : null}
        {nativeChrome?.mode === "global" ? (
          <NativeWebGlobalHeader
            config={nativeChrome.global}
            chromeMode={chromeMode}
            onLogoPress={() =>
              injectWebChromeMessage({
                type: "NATIVE_GLOBAL_HEADER_PRESS",
                payload: { action: "logo" },
              })
            }
            onHamburgerPress={() =>
              injectWebChromeMessage({
                type: "NATIVE_GLOBAL_HEADER_PRESS",
                payload: { action: "hamburger" },
              })
            }
          />
        ) : null}
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
                onSetNativeWebChrome: setNativeChrome,
                onClearNativeWebChromeIfMode: (mode) => {
                  setNativeChrome((prev) => (prev?.mode === mode ? null : prev));
                },
              });
            } catch (e) {
              console.error("Failed to parse bridge message", e);
            }
          }}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          contentInsetAdjustmentBehavior="never"
          onLoadEnd={(e) => {
            const loaded = e.nativeEvent.url;
            if (!isSameWebAppOrigin(loaded, webOrigin)) return;
            webViewRef.current?.injectJavaScript(
              INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
            );
          }}
          injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          cacheEnabled={true}
          applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
          onNavigationStateChange={(navState) => {
            const navUrl = navState.url;
            setChromeMode(
              inferWebViewChromeModeFromUrl(navUrl, webOrigin),
            );
            if (isSameWebAppOrigin(navUrl, webOrigin)) {
              try {
                const path = new URL(navUrl).pathname;
                setNativeChrome((prev) =>
                  reduceNativeChromeForPathname(prev, path),
                );
              } catch {
                /* 잘못된 URL 무시 */
              }
            }
          }}
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
