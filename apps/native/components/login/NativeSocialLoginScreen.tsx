import { useCallback } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeSocialLoginBackground } from "./NativeSocialLoginBackground";
import { NativeSocialLoginLogo } from "./NativeSocialLoginLogo";
import { SocialButton } from "./SocialButton";

const KAKAO_BG = "#FDD835";
const KAKAO_TEXT = "#000000";
const NAVER_BG = "#02B350";
const NAVER_TEXT = "#FFFFFF";
const GOOGLE_BG = "#FFFFFF";
const GOOGLE_TEXT = "#000000";

const KAKAO_ICON = require("@/assets/login/kakao_logo.svg") as number;
const NAVER_ICON = require("@/assets/login/naver_logo.svg") as number;
const GOOGLE_ICON = require("@/assets/login/google_logo.svg") as number;

export type NativeSocialProvider = "kakao" | "naver" | "google";

type Props = {
  webOrigin: string;
  onSelectProvider: (provider: NativeSocialProvider) => void;
};

export function NativeSocialLoginScreen({
  webOrigin,
  onSelectProvider,
}: Props) {
  const insets = useSafeAreaInsets();

  const onKakao = useCallback(
    () => onSelectProvider("kakao"),
    [onSelectProvider]
  );
  const onNaver = useCallback(
    () => onSelectProvider("naver"),
    [onSelectProvider]
  );
  const onGoogle = useCallback(
    () => onSelectProvider("google"),
    [onSelectProvider]
  );

  return (
    <View className="flex-1 bg-black">
      <NativeSocialLoginBackground />

      <View className="z-10 w-full flex-1" style={{ paddingTop: insets.top }}>
        <NativeSocialLoginLogo
          webOrigin={webOrigin}
          paddingHorizontal={{
            paddingLeft: 32 + insets.left,
            paddingRight: 32 + insets.right,
          }}
        />
      </View>

      <View
        className="z-10 w-full self-center gap-2.5"
        style={{
          paddingBottom: Math.max(insets.bottom, 24) + 24,
          paddingLeft: 24 + insets.left,
          paddingRight: 24 + insets.right,
        }}
      >
        <SocialButton
          label="카카오 로그인"
          iconSource={KAKAO_ICON}
          backgroundColor={KAKAO_BG}
          textColor={KAKAO_TEXT}
          onPress={onKakao}
        />
        <SocialButton
          label="네이버 로그인"
          iconSource={NAVER_ICON}
          backgroundColor={NAVER_BG}
          textColor={NAVER_TEXT}
          onPress={onNaver}
        />
        <SocialButton
          label="구글 로그인"
          iconSource={GOOGLE_ICON}
          backgroundColor={GOOGLE_BG}
          textColor={GOOGLE_TEXT}
          borderColor="#E5E5E5"
          onPress={onGoogle}
        />
      </View>
    </View>
  );
}
