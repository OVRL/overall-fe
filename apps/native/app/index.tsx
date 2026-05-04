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
import InteractiveSplashScreen from "../components/InteractiveSplashScreen";
import { handleMainAppWebViewNavigationStateChange } from "@/lib/mainWebViewNavigationEffects";
import {
  hasNativeAuthSession,
  shouldClearNativeAuthFromNavigation,
} from "@/lib/nativeWebSession";
import { useNativeSocialLogin } from "@/hooks/useNativeSocialLogin";
import {
  isSameWebAppOrigin,
  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
} from "@/lib/webViewViewportSync";
import { getWebAppOrigin } from "@/lib/webAuthConfig";
import { APPLICATION_NAME_FOR_USER_AGENT } from "../utils/webViewUserAgent";
import { useWebViewPhotoFlow } from "@/hooks/useWebViewPhotoFlow";
import { NativeLiquidBottomNav } from "@/components/NativeLiquidBottomNav";
import { AnimatedLiquidBottomNavShell } from "@/components/native-liquid-bottom-nav/AnimatedLiquidBottomNavShell";
import { isNativeBottomNavVisiblePath } from "@/lib/isNativeBottomNavVisiblePath";

/** 앱 루트·웹뷰 뒤 캔버스 — 다크 bg-primary 와 동일 (스플래시 전환 시 색 튐 방지) */
const BACKGROUND = {
  light: "#131312",
  dark: "#131312",
} as const;

type AuthPhase = "checking" | "native_login" | "main";

/**
 * true: 앱 실행 시 세션을 건너뛰고 로그인 UI만 표시(UI 확인용).
 * 실제 배포·통합 테스트에서는 false 로 두고 SecureStore 세션 분기 + 네이티브 SDK 로그인을 사용합니다.
 */
const FORCE_NATIVE_LOGIN_UI_PREVIEW = false;

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

  const webViewRef = useRef<WebView>(null);
  const pendingPrivacyHandoffRef = useRef<string | null>(null);

  const onNativeSessionReady = useCallback(() => {
    if (__DEV__) {
      console.log("[App] social ok → main (session ready)");
    }
    setAuthPhase("main");
  }, []);

  const onNativeNeedsPrivacyConsent = useCallback((injectScript: string) => {
    if (__DEV__) {
      console.log(
        "[App] not_registered → main, handoff script len=",
        injectScript.length,
      );
    }
    pendingPrivacyHandoffRef.current = injectScript;
    setAuthPhase("main");
    // 이미 동일 URL에 머물면 onLoadEnd가 다시 오지 않아 핸드오프가 막힘 → 즉시 주입
    const flush = () => {
      const wv = webViewRef.current;
      const pending = pendingPrivacyHandoffRef.current;
      if (!wv || !pending || pending !== injectScript) return;
      pendingPrivacyHandoffRef.current = null;
      wv.injectJavaScript(injectScript);
    };
    queueMicrotask(flush);
    setTimeout(flush, 0);
    setTimeout(flush, 120);
  }, []);

  const { runProvider } = useNativeSocialLogin(webOrigin, {
    onSessionReady: onNativeSessionReady,
    onNeedsPrivacyConsent: onNativeNeedsPrivacyConsent,
  });

  const isWebViewCookiePrepDone = useWebViewPreAuth(webOrigin);
  const syncViewportInjectTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [authPhase, setAuthPhase] = useState<AuthPhase>(
    FORCE_NATIVE_LOGIN_UI_PREVIEW ? "native_login" : "checking",
  );
  const [isRootLayoutDone, setIsRootLayoutDone] = useState(false);
  const [isWebViewFirstLoadDone, setIsWebViewFirstLoadDone] = useState(false);
  const [isSplashTimedOut, setIsSplashTimedOut] = useState(false);
  const [chromeMode, setChromeMode] = useState<"safe" | "fullscreen">(
    "fullscreen",
  );
  const [nativeChrome, setNativeChrome] = useState<NativeWebChrome | null>(null);
  const [webPathname, setWebPathname] = useState("");
  const [liquidNavModalOverlayHidden, setLiquidNavModalOverlayHidden] =
    useState(false);

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
    if (!isNativeBottomNavVisiblePath(webPathname)) {
      setLiquidNavModalOverlayHidden(false);
    }
  }, [webPathname]);

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
      setWebPathname("");
    }
  }, [authPhase]);

  const navigateWebViewToPath = useCallback(
    (path: string) => {
      const base = webOrigin.replace(/\/$/, "");
      const normalized = path.startsWith("/") ? path : `/${path}`;
      const nextUrl = `${base}${normalized}`;
      webViewRef.current?.injectJavaScript(
        `window.location.assign(${JSON.stringify(nextUrl)}); true;`,
      );
    },
    [webOrigin],
  );

  useEffect(() => {
    if (!__DEV__) return;
    const mountWebView = authPhase === "main" && isWebViewCookiePrepDone;
    console.log(
      "[App WebView gate] authPhase=",
      authPhase,
      "cookiePrepDone=",
      isWebViewCookiePrepDone,
      "=> mountWebView=",
      mountWebView,
    );
  }, [authPhase, isWebViewCookiePrepDone]);

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
      // 카카오/네이버 OAuth 복귀 직후에는 WK가 아직 window.ReactNativeWebView를 주입하지 않은 경우가 있어
      // postMessage 없이 호출하면 TypeError → WKErrorDomain Code=4. 가드 + IIFE 끝에 true 로 WK 요구사항 충족.
      const safeUrl = JSON.stringify(url);
      const script = `(function(){
        try {
          var d = { type: 'DEEP_LINK_RECEIVED', payload: { url: ${safeUrl} } };
          window.dispatchEvent(new CustomEvent('message', { detail: d }));
          var rw = window.ReactNativeWebView;
          if (rw != null && typeof rw.postMessage === 'function') {
            rw.postMessage(JSON.stringify(d));
          }
        } catch (e) {}
        true;
      })();`;
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
      void runProvider(provider);
    },
    [runProvider],
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
            onStartNativeSocialLogin: (provider) => {
              void runProvider(provider);
            },
            onSetLiquidNavModalOverlay: setLiquidNavModalOverlayHidden,
            onSyncWebClientPathname: setWebPathname,
          },
        );
      } catch (e) {
        console.error("Failed to parse bridge message", e);
      }
    },
    [navigation, tryConsumePhotoBridgeMessage, runProvider],
  );

  const onNavigationStateChange = useCallback(
    (navState: { url: string; loading?: boolean }) => {
      handleMainAppWebViewNavigationStateChange(
        {
          webOrigin,
          setChromeMode,
          setNativeChrome,
          setWebPathname,
          syncViewportInjectTimerRef,
          getWebView: () => webViewRef.current,
        },
        navState,
      );
      if (shouldClearNativeAuthFromNavigation(navState.url, webOrigin)) {
        setAuthPhase("native_login");
      }
    },
    [webOrigin],
  );

  const onLoadEnd = useCallback(
    (e: { nativeEvent: { url: string } }) => {
      const url = e.nativeEvent.url;
      const sameOrigin = isSameWebAppOrigin(url, webOrigin);
      if (__DEV__) {
        // nid.naver.com·kauth.kakao.com 등 OAuth 호스트는 당연히 sameOrigin=false (외부 도메인).
        // console.warn 만 쓰면 LogBox가 스택처럼 붙어 혼동되므로 log 한 줄만 사용.
        console.log(
          `[WebView onLoadEnd] url=${url} | webOrigin=${webOrigin} | sameOrigin=${sameOrigin} | pendingHandoff=${String(pendingPrivacyHandoffRef.current != null)}`,
        );
      }
      if (!sameOrigin) return;
      try {
        setWebPathname(new URL(url).pathname);
      } catch {
        /* 무시 */
      }
      setIsWebViewFirstLoadDone(true);
      webViewRef.current?.injectJavaScript(
        INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
      );
      const handoff = pendingPrivacyHandoffRef.current;
      if (handoff) {
        pendingPrivacyHandoffRef.current = null;
        webViewRef.current?.injectJavaScript(handoff);
      }
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
                onTeamManagementPress={() =>
                  injectWebChromeMessage({
                    type: "NATIVE_GLOBAL_HEADER_PRESS",
                    payload: { action: "team_management" },
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

        {authPhase === "main" && isWebViewCookiePrepDone ? (
          <View style={styles.webviewColumn}>
          <WebView
            ref={webViewRef}
            /* 첫 요청에 `buildDevCookieHeader()` 를 붙이면 만료·도메인 불일치 토큰이 proxy를 깨고
             * `/api/auth/clear-session?redirect=/login/social` 로 떨어짐. 세션은 `useWebViewPreAuth` 주입만 사용. */
            source={{ uri: webOrigin }}
            style={styles.webview}
            javaScriptEnabled={true}
            onMessage={onMessage}
            onNavigationStateChange={onNavigationStateChange}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            contentInsetAdjustmentBehavior="never"
            onLoadStart={(e) => {
              if (__DEV__) {
                console.log("[WebView onLoadStart]", e.nativeEvent.url);
              }
            }}
            onError={(e) => {
              if (__DEV__) {
                const d = e.nativeEvent as {
                  description?: string;
                  domain?: string;
                  code?: number;
                };
                console.warn(
                  "[WebView onError]",
                  d.description ?? d,
                  d.domain,
                  d.code,
                );
              }
            }}
            onHttpError={(e) => {
              if (__DEV__) {
                console.warn(
                  "[WebView onHttpError]",
                  e.nativeEvent.statusCode,
                  e.nativeEvent.url,
                );
              }
            }}
            onLoadEnd={onLoadEnd}
            injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
            applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
          />
          {isNativeBottomNavVisiblePath(webPathname) ? (
            <AnimatedLiquidBottomNavShell hidden={liquidNavModalOverlayHidden}>
              <NativeLiquidBottomNav
                pathname={webPathname}
                onNavigateToPath={navigateWebViewToPath}
                onLiquidNavFabPress={() =>
                  injectWebChromeMessage({
                    type: "NATIVE_LIQUID_NAV_FAB_PRESS",
                  })
                }
              />
            </AnimatedLiquidBottomNavShell>
          ) : null}
          </View>
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
  webviewColumn: {
    flex: 1,
    flexDirection: "column",
  },
  webview: {
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
