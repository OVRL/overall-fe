import { memo } from "react";

type Props = {
  /** false이면 슬롯을 렌더하지 않습니다. */
  visible: boolean;
};

/**
 * 웹 번들에서는 `react-native-applovin-max`를 로드하지 않습니다.
 * iOS/Android 구현은 `NativeWebTopBannerSlot.native.tsx`입니다.
 */
function NativeWebTopBannerSlotInner({ visible }: Props) {
  if (!visible) return null;
  return null;
}

export const NativeWebTopBannerSlot = memo(NativeWebTopBannerSlotInner);
