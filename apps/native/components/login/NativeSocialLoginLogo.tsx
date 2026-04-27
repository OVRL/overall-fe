import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { View } from "react-native";

const FALLBACK_LOGO = require("@/assets/topbar/logo_OVR.svg") as number;

/** expo-image 는 NativeWind `className`이 항상 크기/absolute에 반영되지 않아 `style`로만 지정합니다. */
const LOGO_IMAGE_STYLE = { width: 220, height: 220, maxWidth: "100%" as const };

type Props = {
  webOrigin: string;
  /** 로고 영역 좌우 패딩 (세이프 에리어 포함) */
  paddingHorizontal: { paddingLeft: number; paddingRight: number };
};

/** 원격 로고 실패 시 번들 SVG로 폴백하는 로그인 로고 블록 */
export function NativeSocialLoginLogo({
  webOrigin,
  paddingHorizontal,
}: Props) {
  const logoUri = `${webOrigin.replace(/\/$/, "")}/videos/login_logo.webp`;
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [webOrigin]);

  return (
    <View
      className="w-full flex-1 items-center justify-center py-8"
      style={paddingHorizontal}
    >
      <Image
        recyclingKey={logoLoadFailed ? "fallback" : logoUri}
        source={logoLoadFailed ? FALLBACK_LOGO : { uri: logoUri }}
        style={LOGO_IMAGE_STYLE}
        contentFit="contain"
        accessibilityLabel="Overall 로고"
        onError={() => setLogoLoadFailed(true)}
      />
    </View>
  );
}
