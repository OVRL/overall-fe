import type { NativeSocialProvider } from "@/components/login/NativeSocialLoginScreen";

export type NativeSocialExtra = {
  /** 카카오 네이티브 앱 키 (개발자 콘솔) */
  kakaoNativeAppKey?: string;
  naverConsumerKey?: string;
  naverConsumerSecret?: string;
  /** iOS 네아로 URL 스킴 (앱 scheme 과 통일 권장) */
  naverServiceUrlSchemeIOS?: string;
  googleIosClientId?: string;
  googleAndroidClientId?: string;
};

export type NativeSocialLoginDeps = {
  webOrigin: string;
  extra: NativeSocialExtra | undefined;
};

/** 웹 `SocialOauthSnapshot` 과 동일 키·형태 (회원가입 퍼널 프리필용) */
export const SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY = "overall_social_oauth_snapshot";

export type SocialOauthSnapshotPayload = {
  provider: NativeSocialProvider;
  accessToken: string;
  email: string | null;
  userMe: unknown | null;
  savedAt: string;
};
