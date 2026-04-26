import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** LinearGradient 는 cssInterop이 없을 수 있어, 전면 덮는 영역은 인라인 절대 배치로 둡니다. */
const ABSOLUTE_FILL = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/** apps/web `shared-tokens` primary-light / dark-olive / black 에 대응하는 근사 HEX */
const GRADIENT_COLORS = ["#E8FEB8", "#3A3F35", "#000000"] as const;
const OVERLAY_OLIVE = [
  "rgba(58, 63, 51, 0.4)",
  "transparent",
  "transparent",
] as const;
const OVERLAY_BLACK = [
  "rgba(0,0,0,0.7)",
  "rgba(0,0,0,0.5)",
  "rgba(0,0,0,0.3)",
] as const;

const KAKAO_BG = "#FDD835";
const KAKAO_TEXT = "#000000";
const NAVER_BG = "#02B350";
const NAVER_TEXT = "#000000";
const GOOGLE_BG = "#FFFFFF";
const GOOGLE_TEXT = "#000000";

const KAKAO_ICON = require("@/assets/login/kakao_logo.svg") as number;
const NAVER_ICON = require("@/assets/login/naver_logo.svg") as number;
const GOOGLE_ICON = require("@/assets/login/google_logo.svg") as number;
const FALLBACK_LOGO = require("@/assets/topbar/logo_OVR.svg") as number;

/** expo-image 는 NativeWind `className`이 항상 크기/absolute에 반영되지 않아 `style`로만 지정합니다. */
const LOGO_IMAGE_STYLE = { width: 220, height: 220, maxWidth: "100%" as const };
const SOCIAL_ICON_STYLE = {
  width: 24,
  height: 24,
};

export type NativeSocialProvider = "kakao" | "naver" | "google";

type Props = {
  webOrigin: string;
  onSelectProvider: (provider: NativeSocialProvider) => void;
};

function SocialButton({
  label,
  iconSource,
  backgroundColor,
  textColor,
  borderColor,
  onPress,
}: {
  label: string;
  iconSource: number;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="w-full overflow-hidden rounded-lg"
      style={({ pressed }) => (pressed ? { opacity: 0.88 } : { opacity: 1 })}
    >
      {/*
        NativeWind/Fabric 조합에서 Pressable 배경이 비는 사례가 있어,
        배경·테두리·라운드는 일반 View에만 둡니다.
      */}
      <View
        className="flex flex-row gap-2.5 w-full min-h-16 items-center justify-center rounded-lg px-4"
        style={[
          { backgroundColor },
          borderColor ? { borderColor, borderWidth: 1 } : null,
        ]}
      >
        <Image
          source={iconSource}
          style={SOCIAL_ICON_STYLE}
          contentFit="contain"
        />
        <Text
          className="text-center text-lg font-bold"
          style={{ color: textColor }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function NativeSocialLoginScreen({
  webOrigin,
  onSelectProvider,
}: Props) {
  const insets = useSafeAreaInsets();
  const logoUri = `${webOrigin.replace(/\/$/, "")}/videos/login_logo.webp`;
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  const logoBlock: ReactNode = (
    <View className="w-full flex-1 items-center justify-center px-8 py-8">
      <Image
        source={logoLoadFailed ? FALLBACK_LOGO : { uri: logoUri }}
        style={LOGO_IMAGE_STYLE}
        contentFit="contain"
        accessibilityLabel="Overall 로고"
        onError={() => setLogoLoadFailed(true)}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ABSOLUTE_FILL}
      />
      <LinearGradient
        colors={[...OVERLAY_OLIVE]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ABSOLUTE_FILL}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[...OVERLAY_BLACK]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={ABSOLUTE_FILL}
        pointerEvents="none"
      />

      <View className="z-10 w-full flex-1" style={{ paddingTop: insets.top }}>
        {logoBlock}
      </View>

      <View
        className="z-10 w-full px-4 self-center gap-2.5 px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 24) + 24 }}
      >
        <SocialButton
          label="카카오 로그인"
          iconSource={KAKAO_ICON}
          backgroundColor={KAKAO_BG}
          textColor={KAKAO_TEXT}
          onPress={() => onSelectProvider("kakao")}
        />
        <SocialButton
          label="네이버 로그인"
          iconSource={NAVER_ICON}
          backgroundColor={NAVER_BG}
          textColor={NAVER_TEXT}
          onPress={() => onSelectProvider("naver")}
        />
        <SocialButton
          label="구글 로그인"
          iconSource={GOOGLE_ICON}
          backgroundColor={GOOGLE_BG}
          textColor={GOOGLE_TEXT}
          borderColor="#E5E5E5"
          onPress={() => onSelectProvider("google")}
        />
      </View>
    </View>
  );
}
