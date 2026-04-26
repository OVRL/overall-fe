import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
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
import {
  NativeSocialLoginScreen,
  type NativeSocialProvider,
} from "@/components/login/NativeSocialLoginScreen";
import type { NativeWebChrome } from "@/types/nativeChrome";
import { BridgeMessage } from "../types/bridge";
import { handleBridgeMessage } from "../utils/bridgeHandler";
import { useWebViewPreAuth } from "@/hooks/useWebViewPreAuth";
import { buildDevCookieHeader } from "@/lib/devWebViewCookies";
import InteractiveSplashScreen from "../components/InteractiveSplashScreen";
import { handleMainAppWebViewNavigationStateChange } from "@/lib/mainWebViewNavigationEffects";
import {
  hasNativeAuthSession,
  injectStoredAuthCookiesForWebView,
  persistAuthCookiesFromWebView,
  shouldClearNativeAuthFromNavigation,
} from "@/lib/nativeWebSession";
import { isPostAuthWebAppPath } from "@/lib/isPostAuthWebAppPath";
import {
  isSameWebAppOrigin,
  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
} from "@/lib/webViewViewportSync";
import { getWebAppOrigin } from "@/lib/webAuthConfig";
import { APPLICATION_NAME_FOR_USER_AGENT } from "../utils/webViewUserAgent";
import { useWebViewPhotoFlow } from "@/hooks/useWebViewPhotoFlow";

/** 앱 루트·웹뷰 뒤 캔버스 — 다크 bg-primary 와 동일 (스플래시 전환 시 색 튐 방지) */
const BACKGROUND = {
  light: "#131312",
  dark: "#131312",
} as const;

type AuthPhase = "checking" | "native_login" | "oauth" | "main";

/**
 * true: 앱 실행 시 세션을 보지 않고 항상 네이티브 소셜 로그인 UI만 표시(UI 확인용).
 * 실제 로그인 플로우(세션 분기 + OAuth 완료 처리)를 켤 때 false 로 바꿉니다.
 */
const FORCE_NATIVE_LOGIN_UI_PREVIEW = true;

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
  const colorScheme = useColorScheme() ?? "dark";
  const backgroundColor = BACKGROUND[colorScheme];
  const webOrigin = __DEV__
    ? Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000"
    : getWebAppOrigin();
  const isWebViewCookiePrepDone = useWebViewPreAuth(webOrigin);
  const webViewRef = useRef<WebView>(null);
  const oauthWebViewRef = useRef<WebView>(null);
  const oauthFinishLockRef = useRef(false);
  const syncViewportInjectTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [authPhase, setAuthPhase] = useState<AuthPhase>(
    FORCE_NATIVE_LOGIN_UI_PREVIEW ? "native_login" : "checking",
  );
  const [oauthStartUrl, setOauthStartUrl] = useState<string | null>(null);
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
    if (FORCE_NATIVE_LOGIN_UI_PREVIEW) return;
    let cancelled = false;
    void (async () => {
      try {
        const has = await hasNativeAuthSession();
        if (!cancelled) setAuthPhase(has ? "main" : "native_login");
      } catch {
        if (!cancelled) setAuthPhase("native_login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authPhase !== "main") {
      setNativeChrome(null);
      setChromeMode("fullscreen");
    }
  }, [authPhase]);

  useEffect(() => {
    if (authPhase === "oauth") {
      oauthFinishLockRef.current = false;
    }
  }, [authPhase]);

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

  useEffect(() => {
    const t = setTimeout(() => {
      setIsSplashTimedOut(true);
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  const splashContentReady =
    authPhase === "native_login" ||
    authPhase === "oauth" ||
    (authPhase === "main" && isWebViewFirstLoadDone);

  const isAppReadyForSplashHide =
    authPhase !== "checking" &&
    isRootLayoutDone &&
    isWebViewCookiePrepDone &&
    splashContentReady;

  const showBlockingCustomSplash =
    !isAppReadyForSplashHide && !isSplashTimedOut;

  // 정적 네이티브 스플래시를 곧바로 닫고, 애니 WebP가 있는 커스텀 스플래시로 전환합니다.
  useLayoutEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

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
      if (authPhase !== "main" || !webViewRef.current) return;
      const script = `
           window.dispatchEvent(new CustomEvent('message', { detail: { type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } } }));
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } }));
        `;
      webViewRef.current.injectJavaScript(script);
    };

    const subscribe = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscribe.remove();
  }, [authPhase]);

  useEffect(() => {
    const onBackPress = () => {
      if (authPhase === "oauth" && oauthWebViewRef.current) {
        oauthWebViewRef.current.goBack();
        return true;
      }
      if (authPhase === "main" && webViewRef.current) {
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
  }, [authPhase]);

  const onSelectSocialProvider = useCallback(
    (provider: NativeSocialProvider) => {
      const start = `${webOrigin}/api/auth/${provider}/callback`;
      setOauthStartUrl(start);
      setAuthPhase("oauth");
    },
    [webOrigin],
  );

  const onOAuthNavigationStateChange = useCallback(
    (navState: { url: string; loading?: boolean }) => {
      if (navState.loading) return;
      if (!isPostAuthWebAppPath(navState.url, webOrigin)) return;
      if (oauthFinishLockRef.current) return;
      oauthFinishLockRef.current = true;
      void (async () => {
        try {
          await persistAuthCookiesFromWebView(webOrigin);
          if (!(await hasNativeAuthSession())) {
            oauthFinishLockRef.current = false;
            return;
          }
          await injectStoredAuthCookiesForWebView(webOrigin);
          setOauthStartUrl(null);
          setAuthPhase("main");
        } catch (e) {
          console.warn("[Native] OAuth 완료 처리 실패:", e);
          oauthFinishLockRef.current = false;
        }
      })();
    },
    [webOrigin],
  );

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
      if (shouldClearNativeAuthFromNavigation(navState.url)) {
        setAuthPhase("native_login");
      }
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

  const showPrepFallback = isSplashTimedOut && !isWebViewCookiePrepDone;

  return (
    <View style={[styles.screenRoot, { backgroundColor }]} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <SafeAreaView
        edges={chromeMode === "safe" ? ["top"] : []}
        style={[styles.container, { backgroundColor }]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        {authPhase === "main" ? (
          <>
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
          </>
        ) : null}

        {authPhase === "checking" ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : null}

        {authPhase === "native_login" ? (
          <NativeSocialLoginScreen
            webOrigin={webOrigin}
            onSelectProvider={onSelectSocialProvider}
          />
        ) : null}

        {authPhase === "oauth" && oauthStartUrl ? (
          <WebView
            ref={oauthWebViewRef}
            source={{ uri: oauthStartUrl }}
            style={styles.oauthWebview}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onNavigationStateChange={onOAuthNavigationStateChange}
            injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
            applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
          />
        ) : null}

        {authPhase === "main" && isWebViewCookiePrepDone ? (
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
        ) : showPrepFallback ? (
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
      {showBlockingCustomSplash ? <InteractiveSplashScreen /> : null}
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
  oauthWebview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
