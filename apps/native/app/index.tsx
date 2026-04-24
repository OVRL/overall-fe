import { useColorScheme } from "@/hooks/use-color-scheme";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Stack, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import CameraModal from "../components/CameraModal";
import PhotoPickerBottomSheet, {
  PhotoPickerAction,
} from "../components/PhotoPickerBottomSheet";
import { BridgeMessage } from "../types/bridge";
import { handleBridgeMessage } from "../utils/bridgeHandler";
import { useWebViewPreAuth } from "@/hooks/useWebViewPreAuth";
import {
  clearNativeAuthStorage,
  persistAuthCookiesFromWebView,
  shouldClearNativeAuthFromNavigation,
  shouldSyncCookiesFromWebView,
} from "@/lib/nativeWebSession";
import { inferWebViewChromeModeFromUrl } from "@/lib/inferWebViewChromeModeFromUrl";
import {
  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
  isSameWebAppOrigin,
} from "@/lib/webViewViewportSync";
import { getWebAppOrigin } from "@/lib/webAuthConfig";
import { APPLICATION_NAME_FOR_USER_AGENT } from "../utils/webViewUserAgent";

const BACKGROUND = {
  // WebView(웹)이 다크 테마 기준이어서 네이티브 배경도 동일하게 맞춘다.
  light: "#010101",
  dark: "#010101",
} as const;

const DEV_COOKIE_JSON = [
  {
    domain: "ovr-log.com",
    expirationDate: 1808390396.933353,
    hostOnly: true,
    httpOnly: false,
    name: "selectedTeamId",
    path: "/",
    sameSite: "lax",
    secure: false,
    session: false,
    storeId: "0",
    value: "TeamModel%3A3",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "userId",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value: "14",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "accessToken",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJlbWFpbCI6InN1bnBsMDcxOEBuYXZlci5jb20iLCJpYXQiOjE3NzY4NTI0OTcsImV4cCI6MTc3Njg1OTY5N30.F7GwpIO5gqWYk5i1R0UhR5s967hU0aJBzyWInc5AQxU",
  },
  {
    domain: "ovr-log.com",
    hostOnly: true,
    httpOnly: false,
    name: "refreshToken",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: true,
    storeId: "0",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJlbWFpbCI6InN1bnBsMDcxOEBuYXZlci5jb20iLCJpYXQiOjE3NzY4NTI0OTcsImV4cCI6MTc3NzQ1NzI5N30.Di4e2IX1jx1mk6LIIFy_IO5MRn1YWiKISIMAWK9TQc8",
  },
] as const;

function buildDevCookieHeader() {
  return DEV_COOKIE_JSON.map((c) => `${c.name}=${c.value}`).join("; ");
}

// Push Notification Handler Setup
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
  const webOrigin = getWebAppOrigin();
  const isWebViewCookiePrepDone = useWebViewPreAuth(webOrigin);
  const webViewRef = useRef<WebView>(null);
  const syncViewportInjectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [chromeMode, setChromeMode] = useState<"safe" | "fullscreen">(
    "fullscreen"
  );
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);
  const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);
  const [fileInputReqId, setFileInputReqId] = useState<string | null>(null);
  const [cameraOpenedFromFileInput, setCameraOpenedFromFileInput] =
    useState(false);

  // Android 8+ 기본 알림 채널 (푸시 표시에 필요)
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

  // Deep Link Handling
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      // Send Deep Link Event to Web
      if (webViewRef.current) {
        const script = `
           window.dispatchEvent(new CustomEvent('message', { detail: { type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } } }));
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEEP_LINK_RECEIVED', payload: { url: "${url}" } }));
        `;
        webViewRef.current.injectJavaScript(script);
      }
    };

    const subscribe = Linking.addEventListener("url", handleDeepLink);

    // Check initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscribe.remove();
  }, []);

  // Back Button Handling (Android)
  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent default behavior
      }
      return false;
    };

    if (Platform.OS === "android") {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }
  }, []);

  const onMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as BridgeMessage;

      if (data.type === "OPEN_CAMERA") {
        setCameraOpenedFromFileInput(false);
        setCurrentReqId(data.reqId || null);
        setIsCameraVisible(true);
        return;
      }

      if (data.type === "OPEN_PHOTO_PICKER") {
        setFileInputReqId(data.reqId ?? null);
        setIsPhotoPickerVisible(true);
        return;
      }

      // Handle other standard actions
      await handleBridgeMessage(webViewRef as any, data, navigation, {
        onSetWebViewChrome: setChromeMode,
      });
    } catch (e) {
      console.error("Failed to parse bridge message", e);
    }
  };

  /** 웹 브릿지 requestWithResponse용 응답 전달 (PHOTO_PICKER_RESULT) */
  const sendPhotoPickerResultToWeb = (
    reqId: string,
    base64: string,
    mimeType: string
  ) => {
    if (!webViewRef.current) return;
    const response = {
      type: "PHOTO_PICKER_RESULT",
      reqId,
      payload: { base64, mimeType },
    };
    const script = `
      window.postMessage(JSON.stringify(${JSON.stringify(response)}), '*');
    `;
    webViewRef.current.injectJavaScript(script);
  };

  /** 갤러리 권한 거부 등 실패 시 웹에 ERROR 응답 전달 (requestWithResponse가 reject 하도록) */
  const sendPhotoPickerErrorToWeb = (reqId: string, errorMessage: string) => {
    if (!webViewRef.current) return;
    const response = {
      type: "ERROR",
      reqId,
      payload: null,
      error: errorMessage,
    };
    webViewRef.current.injectJavaScript(
      `window.postMessage(JSON.stringify(${JSON.stringify(response)}), '*');`
    );
  };

  const handlePhotoTaken = (uri: string, base64?: string) => {
    setIsCameraVisible(false);
    if (webViewRef.current && currentReqId) {
      if (cameraOpenedFromFileInput && base64) {
        sendPhotoPickerResultToWeb(currentReqId, base64, "image/jpeg");
        setCameraOpenedFromFileInput(false);
        setFileInputReqId(null);
      } else {
        const response = {
          type: "CAMERA_RESULT",
          payload: { uri },
          reqId: currentReqId,
        };
        webViewRef.current.injectJavaScript(
          `window.postMessage(JSON.stringify(${JSON.stringify(
            response
          )}), '*');`
        );
      }
      setCurrentReqId(null);
    }
  };

  const handlePhotoPickerSelect = async (action: PhotoPickerAction) => {
    if (action === "cancel" || !fileInputReqId) return;

    if (action === "camera") {
      if (!fileInputReqId) return;
      const reqId = fileInputReqId;
      setIsPhotoPickerVisible(false);

      // 카메라 권한 먼저 요청 (CameraModal의 권한 UI 대신 여기서 처리)
      const { status, canAskAgain } =
        await Camera.requestCameraPermissionsAsync();

      if (status !== "granted") {
        setFileInputReqId(null);
        if (canAskAgain === false) {
          sendPhotoPickerErrorToWeb(
            reqId,
            "카메라 접근 권한이 거부되었습니다. 설정에서 카메라 접근을 허용해 주세요."
          );
          Alert.alert(
            "카메라 권한 필요",
            "사진을 촬영하려면 설정에서 카메라 접근을 허용해 주세요.",
            [
              { text: "취소", style: "cancel" },
              { text: "설정 열기", onPress: () => Linking.openSettings() },
            ]
          );
        } else {
          sendPhotoPickerErrorToWeb(
            reqId,
            "카메라 접근 권한이 필요합니다. 권한을 허용해 주세요."
          );
        }
        return;
      }

      setCurrentReqId(reqId);
      setCameraOpenedFromFileInput(true);
      setIsCameraVisible(true);
      return;
    }

    if (action === "gallery") {
      if (!fileInputReqId) return;
      const reqId: string = fileInputReqId;

      try {
        // 1) 권한 먼저 요청 (바텀시트가 열린 상태에서 하면 iOS에서 시스템 팝업이 잘 뜸)
        const { status, canAskAgain } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        setIsPhotoPickerVisible(false);

        if (status !== "granted") {
          setFileInputReqId(null);
          if (canAskAgain === false) {
            sendPhotoPickerErrorToWeb(
              reqId,
              "갤러리 접근 권한이 거부되었습니다. 설정에서 사진 접근을 허용해 주세요."
            );
            Alert.alert(
              "사진 접근 권한 필요",
              "사진을 선택하려면 설정에서 사진 접근을 허용해 주세요.",
              [
                { text: "취소", style: "cancel" },
                { text: "설정 열기", onPress: () => Linking.openSettings() },
              ]
            );
          } else {
            sendPhotoPickerErrorToWeb(
              reqId,
              "갤러리 접근 권한이 필요합니다. 권한을 허용해 주세요."
            );
          }
          return;
        }

        // 2) 권한 허용됨 → 갤러리 열기 (바텀시트 닫힌 뒤 호출)
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          base64: true,
          quality: 0.9,
        });
        if (
          !result.canceled &&
          result.assets[0]?.base64 &&
          webViewRef.current
        ) {
          const asset = result.assets[0];
          const mimeType = asset.mimeType ?? "image/jpeg";
          sendPhotoPickerResultToWeb(reqId, asset.base64 as string, mimeType);
        } else {
          sendPhotoPickerErrorToWeb(reqId, "사진 선택이 취소되었습니다.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "갤러리를 열 수 없습니다.";
        sendPhotoPickerErrorToWeb(reqId, message);
      } finally {
        setFileInputReqId(null);
      }
    }
  };

  return (
    <View style={[styles.screenRoot, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <SafeAreaView
        edges={chromeMode === "safe" ? ["top"] : []}
        style={[styles.container, { backgroundColor }]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        {!isWebViewCookiePrepDone ? (
          <View style={styles.prepFallback}>
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : (
        <WebView
          ref={webViewRef}
          source={
            // __DEV__
            //   ? {
            //       uri: "http://localhost:3000",
            //       headers: {
            //         Cookie: buildDevCookieHeader(),
            //       },
            //     }
            //   : { uri: "http://localhost:3000" }
            { uri: webOrigin }
          }
          style={styles.webview}
          javaScriptEnabled={true}
          onMessage={onMessage}
          onNavigationStateChange={(navState) => {
            const url = navState.url;
            setChromeMode(inferWebViewChromeModeFromUrl(url, webOrigin));
            if (
              isSameWebAppOrigin(url, webOrigin) &&
              !navState.loading &&
              webViewRef.current
            ) {
              if (syncViewportInjectTimerRef.current != null) {
                clearTimeout(syncViewportInjectTimerRef.current);
              }
              syncViewportInjectTimerRef.current = setTimeout(() => {
                syncViewportInjectTimerRef.current = null;
                webViewRef.current?.injectJavaScript(
                  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
                );
              }, 80);
            }
            if (shouldClearNativeAuthFromNavigation(url)) {
              void (async () => {
                try {
                  await clearNativeAuthStorage();
                } catch (e) {
                  console.warn("[Native] 로그아웃 동기화(저장소 비우기) 실패:", e);
                }
              })();
              return;
            }
            if (shouldSyncCookiesFromWebView(url, webOrigin)) {
              void (async () => {
                try {
                  await persistAuthCookiesFromWebView(webOrigin);
                } catch (e) {
                  console.warn("[Native] 쿠키→SecureStore 동기화 실패:", e);
                }
              })();
            }
          }}
          // Essential for some OAuth flows or heavy sites
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          // iOS: 스크롤뷰가 safe area로 contentInset 을 붙이면 복귀 후 높이가 어긋날 수 있음
          contentInsetAdjustmentBehavior="never"
          onLoadEnd={(e) => {
            const url = e.nativeEvent.url;
            if (!isSameWebAppOrigin(url, webOrigin)) return;
            webViewRef.current?.injectJavaScript(
              INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
            );
          }}
          // Inject a flag so web knows it's in RN
          injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true;`}
          applicationNameForUserAgent={APPLICATION_NAME_FOR_USER_AGENT}
        />
        )}

        <CameraModal
          visible={isCameraVisible}
          onClose={() => setIsCameraVisible(false)}
          onPhotoTaken={handlePhotoTaken}
          returnBase64={cameraOpenedFromFileInput}
        />
        <PhotoPickerBottomSheet
          visible={isPhotoPickerVisible}
          onClose={() => {
            setIsPhotoPickerVisible(false);
            setFileInputReqId(null);
          }}
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
  },
});
