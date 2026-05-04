import { Platform, StyleSheet } from "react-native";
import {
  FAB_RADIUS,
  FAB_SIZE,
  PILL_FILL_BASE_HEX,
  PILL_FILL_OVERLAY_RGBA,
  TAB_ACTIVE_RADIUS,
  TAB_SLOT_HEIGHT,
} from "./constants";

/**
 * BlurView / LinearGradient 등 `className` 미연동 레이어용 스타일.
 */
export const nativeLiquidBottomNavStyles = StyleSheet.create({
  floatingRootAndroid: {
    elevation: 100,
  },
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },
  pillBlurRadius: {
    borderRadius: 9999,
  },
  fabBlurRadius: {
    borderRadius: FAB_RADIUS,
  },
  fabShadowWrap: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  fabPressable: {
    width: FAB_SIZE,
    height: FAB_SIZE,
  },
  fabPressed: {
    opacity: 0.92,
  },
  fabGlassClip: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
    overflow: "hidden",
  },
  pillBlurFallback: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    backgroundColor: "rgba(248, 250, 252, 0.78)",
  },
  /** Figma pill 베이스 — 블러 위에 얹어 디자인 톤과 맞춤 */
  pillSolidBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    backgroundColor: PILL_FILL_BASE_HEX,
  },
  pillSolidOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    backgroundColor: PILL_FILL_OVERLAY_RGBA,
  },
  /**
   * Figma composite box-shadow 중 바깥 2줄만 RN 단일 shadow 로 근사
   * (`0 0 2px rgba(0,0,0,.1)` + `0 1px 8px rgba(0,0,0,.12)`).
   * overflow 는 안쪽 pill 에만 두어 섀도가 잘리지 않게 한다.
   */
  pillTrackShadowWrap: {
    flex: 1,
    minWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.11,
        shadowRadius: 7,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  /** 인셋 섀도 그라데이션 다중 스택 대신 — 가장자리만 살짝 밝게(깨지지 않게 얇게) */
  pillInnerSoftRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  fabBlurFallback: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FAB_RADIUS,
    backgroundColor: "rgba(230, 230, 230, 0.82)",
  },
  fabDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fabInsetStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FAB_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(153, 153, 153, 0.38)",
  },
  fabInnerHighlight: {
    ...StyleSheet.absoluteFillObject,
    margin: 3,
    borderRadius: FAB_RADIUS - 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.75)",
  },
  fabIconLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    width: 24,
    height: 24,
  },
  tabActiveShadowHost: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: TAB_SLOT_HEIGHT,
    borderRadius: TAB_ACTIVE_RADIUS,
    zIndex: 0,
    /** 슬롯 안에서 필 광학 중앙 — 상단 여백과 대칭되게 살짝 올림 */
    transform: [{ translateY: -8 }],
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
        backgroundColor: "rgba(255, 255, 255, 0.94)",
      },
      default: {},
    }),
  },
  tabActiveGlassClip: {
    flex: 1,
    borderRadius: TAB_ACTIVE_RADIUS,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
  },
  tabActiveFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
  },
  tabActiveInsetStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: TAB_ACTIVE_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  tabContentAbove: {
    zIndex: 1,
  },
});
