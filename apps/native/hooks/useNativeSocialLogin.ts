import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { login as kakaoSdkLogin } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, Platform } from "react-native";

import type { NativeSocialProvider } from "@/components/login/NativeSocialLoginScreen";
import {
  buildPrivacyConsentHandoffScript,
  completeNativeSocialLogin,
} from "@/lib/social/completeNativeSocialLogin";
import { extractEmailFromUserMe } from "@/lib/social/extractEmailFromUserMe";
import {
  fetchGoogleUserInfo,
  fetchUserMeViaWebRoutes,
} from "@/lib/social/fetchNativeProviderUserMe";
import type { NativeSocialExtra } from "@/lib/social/nativeSocialTypes";

WebBrowser.maybeCompleteAuthSession();

type Options = {
  /** 로그인 성공 후 (세션 저장까지 완료) */
  onSessionReady: () => void;
  /** 미가입 — 메인 WebView 로드 시 주입할 스냅샷 핸드오프 */
  onNeedsPrivacyConsent: (injectScript: string) => void;
};

export function useNativeSocialLogin(webOrigin: string, options: Options) {
  const { onSessionReady, onNeedsPrivacyConsent } = options;
  const busyRef = useRef(false);
  const naverInitedRef = useRef(false);
  const processedGoogleTokenRef = useRef<string | null>(null);

  const nativeExtra = useMemo(
    () =>
      (
        Constants.expoConfig?.extra as
          | { nativeSocialLogin?: NativeSocialExtra }
          | undefined
      )?.nativeSocialLogin,
    [],
  );

  const [googleRequest, googleResult, promptGoogle] = Google.useAuthRequest({
    iosClientId: nativeExtra?.googleIosClientId ?? "",
    androidClientId: nativeExtra?.googleAndroidClientId ?? "",
  });

  const ensureNaverInit = useCallback(() => {
    if (naverInitedRef.current) return true;
    const k = nativeExtra?.naverConsumerKey;
    const s = nativeExtra?.naverConsumerSecret;
    if (!k || !s) {
      Alert.alert(
        "설정 필요",
        "apps/native app.json 의 extra.nativeSocialLogin 에 네이버 consumer 정보를 넣어 주세요.",
      );
      return false;
    }
    NaverLogin.initialize({
      appName: "Overall",
      consumerKey: k,
      consumerSecret: s,
      serviceUrlSchemeIOS: nativeExtra?.naverServiceUrlSchemeIOS ?? "ovr-log",
    });
    naverInitedRef.current = true;
    return true;
  }, [nativeExtra]);

  const finishSocialPipeline = useCallback(
    async (provider: NativeSocialProvider, accessToken: string, userMe: unknown) => {
      const email = extractEmailFromUserMe(provider, userMe);
      const result = await completeNativeSocialLogin({
        webOrigin,
        provider,
        providerAccessToken: accessToken,
        email,
        userMe,
      });
      if (result.kind === "ok") {
        onSessionReady();
        return;
      }
      if (result.kind === "not_registered") {
        onNeedsPrivacyConsent(buildPrivacyConsentHandoffScript(result.snapshot));
        return;
      }
      Alert.alert("로그인 실패", result.message);
    },
    [webOrigin, onSessionReady, onNeedsPrivacyConsent],
  );

  useEffect(() => {
    if (!googleResult || googleResult.type !== "success") return;
    const auth = googleResult.authentication;
    const at = auth?.accessToken;
    if (!at) return;
    if (processedGoogleTokenRef.current === at) return;
    processedGoogleTokenRef.current = at;
    if (busyRef.current) return;
    busyRef.current = true;
    void (async () => {
      try {
        const userMe = await fetchGoogleUserInfo(at);
        await finishSocialPipeline("google", at, userMe);
      } catch (e) {
        Alert.alert(
          "구글 로그인",
          e instanceof Error ? e.message : "처리 중 오류가 났습니다.",
        );
      } finally {
        busyRef.current = false;
      }
    })();
  }, [googleResult, finishSocialPipeline]);

  const runProvider = useCallback(
    async (provider: NativeSocialProvider) => {
      if (busyRef.current) return;
      if (provider === "google") {
        if (
          Platform.OS === "ios"
            ? !nativeExtra?.googleIosClientId
            : !nativeExtra?.googleAndroidClientId
        ) {
          Alert.alert(
            "설정 필요",
            "Google OAuth 클라이언트 ID(extra.nativeSocialLogin)를 설정해 주세요.",
          );
          return;
        }
        if (!googleRequest) {
          Alert.alert("구글 로그인", "인증 요청을 준비하는 중입니다.");
          return;
        }
        busyRef.current = true;
        try {
          await promptGoogle();
        } finally {
          busyRef.current = false;
        }
        return;
      }

      busyRef.current = true;
      try {
        if (provider === "kakao") {
          const token = await kakaoSdkLogin();
          const userMe = await fetchUserMeViaWebRoutes(
            webOrigin,
            "kakao",
            token.accessToken,
          );
          await finishSocialPipeline("kakao", token.accessToken, userMe);
          return;
        }
        if (!ensureNaverInit()) return;
        const nv = await NaverLogin.login();
        if (!nv.isSuccess || !nv.successResponse?.accessToken) {
          const msg =
            nv.failureResponse?.message ?? "네이버 로그인에 실패했습니다.";
          if (!nv.failureResponse?.isCancel) Alert.alert("네이버 로그인", msg);
          return;
        }
        const accessToken = nv.successResponse.accessToken;
        const userMe = await fetchUserMeViaWebRoutes(
          webOrigin,
          "naver",
          accessToken,
        );
        await finishSocialPipeline("naver", accessToken, userMe);
      } catch (e) {
        Alert.alert(
          "소셜 로그인",
          e instanceof Error ? e.message : "알 수 없는 오류입니다.",
        );
      } finally {
        busyRef.current = false;
      }
    },
    [
      webOrigin,
      nativeExtra,
      googleRequest,
      promptGoogle,
      finishSocialPipeline,
      ensureNaverInit,
    ],
  );

  return { runProvider };
}
