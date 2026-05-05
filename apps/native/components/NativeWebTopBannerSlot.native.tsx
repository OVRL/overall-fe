import { memo, type ComponentType } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  canRenderApplovinMaxBanner,
  getApplovinMaxBannerAdUnitId,
} from "@/lib/applovinMaxConfig";

type Props = {
  /** false이면 슬롯을 렌더하지 않습니다. */
  visible: boolean;
};

const BANNER_MIN_HEIGHT = 50;

/** MAX 리포트·대시보드용 placement(팀에서 지정한 플랫폼별 이름). */
const MAX_BANNER_PLACEMENT =
  Platform.select({
    ios: "IOS_BN_MAIN_Top",
    android: "AOS_BN_MAIN_Top",
    default: "AOS_BN_MAIN_Top",
  }) ?? "AOS_BN_MAIN_Top";

/**
 * `react-native-applovin-max`는 이 파일 상단에서 import하지 않습니다.
 * (번들 로드 시 TurboModule 등록 실패로 앱이 죽는 것을 막기 위함)
 */
function renderMaxAdView(adUnitId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AdView, AdFormat } = require("react-native-applovin-max") as {
      AdView: ComponentType<{
        adUnitId: string;
        adFormat: string;
        placement?: string;
        style?: object;
      }>;
      AdFormat: { BANNER: string };
    };
    return (
      <View style={styles.slot} accessibilityLabel="광고 배너">
        <AdView
          adUnitId={adUnitId}
          adFormat={AdFormat.BANNER}
          placement={MAX_BANNER_PLACEMENT}
          style={styles.adView}
        />
      </View>
    );
  } catch (e: unknown) {
    if (__DEV__) {
      return (
        <View
          style={styles.devPlaceholder}
          accessibilityLabel="MAX 네이티브 모듈 없음"
        >
          <Text style={styles.devPlaceholderText} numberOfLines={3}>
            AppLovin MAX 모듈 없음 — prebuild 후 dev client로 다시 빌드하세요
          </Text>
        </View>
      );
    }
    return null;
  }
}

/**
 * `NativeWebGlobalHeader` 바로 아래에 두는 MAX 배너 슬롯.
 * SDK 키·Ad Unit이 없고 `__DEV__`이면 동일 높이의 플레이스홀더로 레이아웃만 확인합니다.
 */
function NativeWebTopBannerSlotInner({ visible }: Props) {
  if (!visible) return null;
  if (Platform.OS !== "ios" && Platform.OS !== "android") return null;

  const adUnitId = getApplovinMaxBannerAdUnitId();

  if (canRenderApplovinMaxBanner()) {
    return renderMaxAdView(adUnitId);
  }

  if (__DEV__) {
    return (
      <View
        style={styles.devPlaceholder}
        accessibilityLabel="MAX 배너 자리(개발용)"
      >
        <Text style={styles.devPlaceholderText} numberOfLines={2}>
          MAX 배너 슬롯 (SDK 키·Ad Unit 설정 시 실제 광고)
        </Text>
      </View>
    );
  }

  return null;
}

export const NativeWebTopBannerSlot = memo(NativeWebTopBannerSlotInner);

const styles = StyleSheet.create({
  slot: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  adView: {
    width: "100%",
    minHeight: BANNER_MIN_HEIGHT,
  },
  devPlaceholder: {
    width: "100%",
    minHeight: BANNER_MIN_HEIGHT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    backgroundColor: "rgba(40, 40, 42, 0.95)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  devPlaceholderText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    textAlign: "center",
  },
});
