import { memo, useCallback } from "react";
import { Platform, StyleSheet, View, Pressable, Text } from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Figma보낸 SVG를 이 경로에 두고, 아래 `require` 파일명과 맞추면 된다.
 * 플레이스홀더는 교체해도 되고, 동일 파일명으로 덮어쓰면 된다.
 */
const ICON_HOME = require("@/assets/native-bottom-nav/nb-home.svg") as number;
const ICON_PLAYER_RECORDS =
  require("@/assets/native-bottom-nav/nb-player-records.svg") as number;
const ICON_MATCH_RECORDS =
  require("@/assets/native-bottom-nav/nb-match-records.svg") as number;
const ICON_PROFILE =
  require("@/assets/native-bottom-nav/nb-profile.svg") as number;
const ICON_PLUS = require("@/assets/native-bottom-nav/nb-plus.svg") as number;

/** `@overall/design-system` green.600 근사 — 아이콘·활성 라벨 */
const ACCENT_LIME_HEX = "#C8F254";
const INACTIVE_MUTED = "#F8F8F9";
/** gray.100 (토큰 근사) — 비활성 라벨 */
const LABEL_INACTIVE = "#F3F4F6";

/** FAB(+) 글래스 원형 — 지름 62 기준 완전 원 반지름 */
const FAB_PLUS_SIZE = 62;
const FAB_PLUS_RADIUS = FAB_PLUS_SIZE / 2;

const BLUR_INTENSITY_PILL = 38;
const BLUR_INTENSITY_FAB = 44;

/** 탭 아이콘 — Figma 기준 24×24 */
const TAB_ICON_SIZE = 24;

const styles = StyleSheet.create({
  /** 하단 오버레이 루트(바깥은 index에서 bottom 동적 적용) */
  floatingRoot: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
      default: {},
    }),
  },
  navPadding: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    height: 62,
  },
  /** 왼쪽 탭 pill — `expo-blur` (dev client / 프로덕션 네이티브 빌드에 모듈 포함 필요) */
  pill: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "transparent",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  pillBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
  },
  /** 블러 위 얇은 틴트 */
  pillFrostOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  /** 아이콘만 가로 중앙 고정 — Pressable 기본 축이 애매할 때 라벨 폭에 끌려가지 않도록 */
  tabIconWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabLabel: {
    marginTop: 4,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: ACCENT_LIME_HEX,
  },
  tabLabelInactive: {
    color: LABEL_INACTIVE,
  },
  tabIcon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
  },
  /**
   * FAB(+) — 그림자 전용 래퍼.
   * Pressable에 overflow:hidden + shadow를 동시에 두면 iOS/Android에서 클립·섀도 유실이 나므로 분리한다.
   */
  fabShadowWrap: {
    width: FAB_PLUS_SIZE,
    height: FAB_PLUS_SIZE,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  /** 터치 영역 — 크기 명시 (자식 absolute 레이어가 레이아웃 높이를 안 줄 때 대비) */
  fabPressable: {
    width: FAB_PLUS_SIZE,
    height: FAB_PLUS_SIZE,
  },
  fabPressed: {
    opacity: 0.92,
  },
  /** 글래스 레이어 클립 — 원형 마스크만 여기서 overflow hidden */
  fabGlassClip: {
    width: FAB_PLUS_SIZE,
    height: FAB_PLUS_SIZE,
    borderRadius: FAB_PLUS_RADIUS,
    overflow: "hidden",
  },
  fabBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FAB_PLUS_RADIUS,
  },
  fabFrostOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(230, 230, 230, 0.28)",
  },
  fabDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fabInsetStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FAB_PLUS_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(153, 153, 153, 0.38)",
  },
  fabInnerHighlight: {
    ...StyleSheet.absoluteFillObject,
    margin: 3,
    borderRadius: FAB_PLUS_RADIUS - 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.75)",
  },
  fabIconLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    width: 28,
    height: 28,
  },
});

export type NativeBottomNavTabId = "home" | "player" | "match" | "profile";

type NavItemConfig = {
  id: NativeBottomNavTabId;
  label: string;
  href: string;
  icon: number;
};

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", label: "홈", href: "/", icon: ICON_HOME },
  {
    id: "player",
    label: "선수 기록",
    href: "/team-data",
    icon: ICON_PLAYER_RECORDS,
  },
  {
    id: "match",
    label: "경기 기록",
    href: "/match-record",
    icon: ICON_MATCH_RECORDS,
  },
  { id: "profile", label: "내 정보", href: "/profile", icon: ICON_PROFILE },
];

type Props = {
  /** 현재 WebView 문서의 pathname (`/` 로 시작) */
  pathname: string;
  /** WebView 안에서 해당 경로로 이동 */
  onNavigateToPath: (path: string) => void;
  /**
   * FAB(+) 탭 시 이동할 경로. 제품 기본은 팀 허브로 두었으며 필요 시 변경하면 된다.
   */
  plusHref?: string;
};

function normalizePath(p: string): string {
  if (!p || p === "") return "/";
  const noTrail = p.replace(/\/+$/, "");
  return noTrail === "" ? "/" : noTrail;
}

/**
 * 탭 활성 여부 — 홈은 정확히 `/`, 나머지는 해당 세그먼트 prefix 로 매칭한다.
 */
function isTabActive(pathname: string, item: NavItemConfig): boolean {
  const p = normalizePath(pathname);
  if (item.id === "home") return p === "/";
  if (item.id === "player")
    return p === "/team-data" || p.startsWith("/team-data/");
  if (item.id === "match")
    return p === "/match-record" || p.startsWith("/match-record/");
  if (item.id === "profile")
    return p === "/profile" || p.startsWith("/profile/");
  return false;
}

function NativeLiquidBottomNavInner({
  pathname,
  onNavigateToPath,
  plusHref = "/team-management",
}: Props) {
  const insets = useSafeAreaInsets();

  const onTabPress = useCallback(
    async (href: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onNavigateToPath(href);
    },
    [onNavigateToPath]
  );

  const onPlus = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNavigateToPath(plusHref);
  }, [onNavigateToPath, plusHref]);

  /** 부모(웹뷰 래퍼) 하단 기준 — 세이프 에어리어 */
  const bottomOffset = insets.bottom;

  /** Android 네이티브 블러(실험). 재빌드 후에도 문제 시 `undefined` 로 두면 폴백. */
  const androidExperimentalBlur =
    Platform.OS === "android" ? "dimezisBlurView" : undefined;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.floatingRoot, { bottom: bottomOffset }]}
    >
      <View style={styles.navPadding}>
        <View style={styles.row}>
          <View style={styles.pill}>
            <BlurView
              intensity={BLUR_INTENSITY_PILL}
              tint="light"
              style={styles.pillBlur}
              experimentalBlurMethod={androidExperimentalBlur}
            />
            <View pointerEvents="none" style={styles.pillFrostOverlay} />
            {NAV_ITEMS.map((item) => {
              const active = isTabActive(pathname, item);
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: active }}
                  hitSlop={6}
                  onPress={() => onTabPress(item.href)}
                  style={({ pressed }) => [
                    styles.tabItem,
                    active ? styles.tabItemActive : null,
                    pressed ? { opacity: 0.9 } : null,
                  ]}
                >
                  <View style={styles.tabIconWrap}>
                    <Image
                      source={item.icon}
                      style={styles.tabIcon}
                      contentFit="contain"
                      tintColor={active ? ACCENT_LIME_HEX : INACTIVE_MUTED}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      active ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.fabShadowWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="빠른 메뉴"
              hitSlop={8}
              onPress={onPlus}
              style={({ pressed }) => [
                styles.fabPressable,
                pressed && styles.fabPressed,
              ]}
            >
              <View style={styles.fabGlassClip}>
                <BlurView
                  intensity={BLUR_INTENSITY_FAB}
                  tint="light"
                  style={styles.fabBlur}
                  experimentalBlurMethod={androidExperimentalBlur}
                />
                <View pointerEvents="none" style={styles.fabFrostOverlay} />
                <LinearGradient
                  pointerEvents="none"
                  colors={["rgba(51, 51, 51, 0.26)", "rgba(51, 51, 51, 0.3)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.fabDarkOverlay}
                />
                <View pointerEvents="none" style={styles.fabInsetStroke} />
                <View pointerEvents="none" style={styles.fabIconLayer}>
                  <Image
                    source={ICON_PLUS}
                    style={styles.fabIcon}
                    contentFit="contain"
                    tintColor={ACCENT_LIME_HEX}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export const NativeLiquidBottomNav = memo(NativeLiquidBottomNavInner);
