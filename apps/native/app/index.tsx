import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import CameraModal from "../components/CameraModal";
import PhotoPickerBottomSheet from "../components/PhotoPickerBottomSheet";
import { NativeWebTopBar } from "@/components/NativeWebTopBar";
import { NativeWebGlobalHeader } from "@/components/NativeWebGlobalHeader";
import type { NativeWebChrome } from "@/types/nativeChrome";
import { BridgeMessage } from "../types/bridge";
import { handleBridgeMessage } from "../utils/bridgeHandler";
import { useWebViewPreAuth } from "@/hooks/useWebViewPreAuth";
import { buildDevCookieHeader } from "@/lib/devWebViewCookies";
import { handleMainAppWebViewNavigationStateChange } from "@/lib/mainWebViewNavigationEffects";
import { isSameWebAppOrigin, INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT } from "@/lib/webViewViewportSync";
import { getWebAppOrigin } from "@/lib/webAuthConfig";
import { APPLICATION_NAME_FOR_USER_AGENT } from "../utils/webViewUserAgent";
import { useWebViewPhotoFlow } from "@/hooks/useWebViewPhotoFlow";

const BACKGROUND = {
  light: "#010101",
  dark: "#010101",
} as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor = BACKGROUND[colorScheme];
  const webOrigin = __DEV__
    ? Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000"
    : getWebAppOrigin();
  const isWebViewCookiePrepDone = useWebViewPreAuth(webOrigin);
  const webViewRef = useRef<WebView>(null);
  const syncViewportInjectTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [isRootLayoutDone, setIsRootLayoutDone] = useState(false);
  const [isWebViewFirstLoadDone, setIsWebViewFirstLoadDone] = useState(false);
  const [isSplashTimedOut, setIsSplashTimedOut] = useState(false);
  const [chromeMode, setChromeMode] = useState<"safe" | "fullscreen">(
    "fullscreen",
  );
  const [nativeChrome, setNativeChrome] = useState<NativeWebChrome | null>(null);

  const {
    isCameraVisible,
    setIsCameraVisible,
    isPhotoPickerVisible,
    cameraOpenedFromFileInput,
    tryConsumePhotoBridgeMessage,
    handlePhotoTaken,
    handlePhotoPickerSelect,
    closePhotoPickerSheet,
  } = useWebViewPhotoFlow(webViewRef);

  const injectWebChromeMessage = useCallback((message: object) => {
    const payload = JSON.stringify(message);
    const js = `window.postMessage(${JSON.stringify(payload)}, '*'); true;`;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }, []);

  useEffect(
    () => () => {
      if (syncViewportInjectTimerRef.current != null) {
        clearTimeout(syncViewportInjectTimerRef.current);
      }
    },
    [],
  );

  // WebView 준비가 길어질 때 스플래시가 영원히 고정되는 상황을 방지
  useEffect(() => {
    const t = setTimeout(() => {
      setIsSplashTimedOut(true);
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  const isAppReadyForSplashHide =
    isRootLayoutDone && isWebViewCookiePrepDone && isWebViewFirstLoadDone;

  const onLayoutRootView = useCallback(() => {
    setIsRootLayoutDone(true);
    if (isAppReadyForSplashHide) {
      void SplashScreen.hideAsync();
    }
  }, [isAppReadyForSplashHide]);

  useEffect(() => {
    if (isAppReadyForSplashHide) {
      void SplashScreen.hideAsync();
    }
  }, [isAppReadyForSplashHide]);

  useEffect(() => {
    if (isSplashTimedOut) {
      void SplashScreen.hideAsync();
    }
  }, [isSplashTimedOut]);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (webViewRef.current) {
        const script = `
           window.dispatchEvent(new CustomEvent('message', { detail: { type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } } }));
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } }));
        `;
        webViewRef.current.injectJavaScript(script);
      }
    };

    const subscribe = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscribe.remove();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    if (Platform.OS === "android") {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }
  }, []);

  const onMessage = useCallback(
    async (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as BridgeMessage;
        if (tryConsumePhotoBridgeMessage(data)) {
          return;
        }
        await handleBridgeMessage(
          webViewRef as RefObject<WebView>,
          data,
          navigation,
          {
            onSetWebViewChrome: setChromeMode,
            onSetNativeWebChrome: setNativeChrome,
            onClearNativeWebChromeIfMode: (mode: "global" | "topbar") => {
              setNativeChrome((prev) => (prev?.mode === mode ? null : prev));
            },
          },
        );
      } catch (e) {
        console.error("Failed to parse bridge message", e);
      }
    },
    [navigation, tryConsumePhotoBridgeMessage],
  );

  const onNavigationStateChange = useCallback(
    (navState: { url: string; loading?: boolean }) => {
      handleMainAppWebViewNavigationStateChange(
        {
          webOrigin,
          setChromeMode,
          setNativeChrome,
          syncViewportInjectTimerRef,
          getWebView: () => webViewRef.current,
        },
        navState,
      );
    },
    [webOrigin],
  );

  const onLoadEnd = useCallback(
    (e: { nativeEvent: { url: string } }) => {
      const url = e.nativeEvent.url;
      if (!isSameWebAppOrigin(url, webOrigin)) return;
      setIsWebViewFirstLoadDone(true);
      webViewRef.current?.injectJavaScript(
        INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
      );
    },
    [webOrigin],
  );

  return (
    <View style={[styles.screenRoot, { backgroundColor }]} onLayout={onLayoutRootView}>
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

        {isWebViewCookiePrepDone ? (
          <WebView
            ref={webViewRef}
            source={
              __DEV__
                ? {
                    uri: webOrigin,
                    headers: {
                      Cookie: buildDevCookieHeader(),
                    },
                  }
                : { uri: webOrigin }
            }
            style={styles.webview}
            javaScriptEnabled={true}
            onMessage={onMessage}
            onNavigationStateChange={onNavigationStateChange}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            contentInsetAdjustmentBehavior="never"
            onLoadEnd={onLoadEnd}
            injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
            applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
          />
        ) : isSplashTimedOut ? (
          <View style={styles.prepFallback}>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.prepFallbackTitle}>웹을 불러오는 중입니다…</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setIsSplashTimedOut(false);
                setIsWebViewFirstLoadDone(false);
                void SplashScreen.preventAutoHideAsync();
              }}
              style={styles.prepFallbackButton}
            >
              <Text style={styles.prepFallbackButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : null}

        <CameraModal
          visible={isCameraVisible}
          onClose={() => setIsCameraVisible(false)}
          onPhotoTaken={handlePhotoTaken}
          returnBase64={cameraOpenedFromFileInput}
        />
        <PhotoPickerBottomSheet
          visible={isPhotoPickerVisible}
          onClose={closePhotoPickerSheet}
          onSelect={handlePhotoPickerSelect}
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
  prepFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  prepFallbackTitle: {
    color: "#ffffff",
    fontSize: 14,
  },
  prepFallbackButton: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  prepFallbackButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
