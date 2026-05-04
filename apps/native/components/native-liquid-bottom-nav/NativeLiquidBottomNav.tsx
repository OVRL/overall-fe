import { memo, useCallback, useState } from "react";
import { Platform, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BLUR_INTENSITY_PILL, NAV_BAR_HEIGHT } from "./constants";
import { GlassBackdrop } from "./GlassBackdrop";
import { LiquidNavFab } from "./LiquidNavFab";
import { LiquidNavTab } from "./LiquidNavTab";
import { NAV_ITEMS } from "./navConfig";
import { nativeLiquidBottomNavStyles } from "./nativeLiquidBottomNav.styles";
import { getActiveTabIndex, isTabActive } from "./navPathUtils";
import { TabActiveSlidingHighlight } from "./TabActiveSlidingHighlight";

type Props = {
  pathname: string;
  onNavigateToPath: (path: string) => void;
  plusHref?: string;
};

function NativeLiquidBottomNavInner({
  pathname,
  onNavigateToPath,
  plusHref = "/team-management",
}: Props) {
  const insets = useSafeAreaInsets();
  const [tabRowWidth, setTabRowWidth] = useState(0);
  const activeTabIndex = getActiveTabIndex(pathname);
  const slotWidth =
    tabRowWidth > 0 ? tabRowWidth / NAV_ITEMS.length : 0;

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

  const bottomOffset = insets.bottom;

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-[100]"
      style={[
        { bottom: bottomOffset },
        Platform.OS === "android"
          ? nativeLiquidBottomNavStyles.floatingRootAndroid
          : null,
      ]}
    >
      <View className="w-full px-4">
        <View
          className="flex-row items-center gap-3"
          style={{ height: NAV_BAR_HEIGHT }}
        >
          <View style={nativeLiquidBottomNavStyles.pillTrackShadowWrap}>
            <View
              className="relative min-w-0 flex-1 flex-row items-center justify-between overflow-hidden rounded-full border border-white/20 bg-transparent py-1 pl-1 pr-1.5"
              style={{ height: NAV_BAR_HEIGHT }}
            >
              <GlassBackdrop
                intensity={BLUR_INTENSITY_PILL}
                tint="light"
                variant="pill"
                fallbackStyle={nativeLiquidBottomNavStyles.pillBlurFallback}
              />
              <View
                pointerEvents="none"
                style={nativeLiquidBottomNavStyles.pillSolidBase}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
              <View
                pointerEvents="none"
                style={nativeLiquidBottomNavStyles.pillSolidOverlay}
              />
              <View
                pointerEvents="none"
                style={nativeLiquidBottomNavStyles.pillInnerSoftRim}
              />
              <View
                className="relative min-h-0 min-w-0 flex-1 flex-row items-center"
                onLayout={(e) => setTabRowWidth(e.nativeEvent.layout.width)}
              >
                <TabActiveSlidingHighlight
                  activeIndex={activeTabIndex}
                  slotWidth={slotWidth}
                />
                {NAV_ITEMS.map((item) => (
                  <LiquidNavTab
                    key={item.id}
                    item={item}
                    isActive={isTabActive(pathname, item)}
                    onTabPress={onTabPress}
                  />
                ))}
              </View>
            </View>
          </View>

          <LiquidNavFab onPress={onPlus} />
        </View>
      </View>
    </View>
  );
}

export const NativeLiquidBottomNav = memo(NativeLiquidBottomNavInner);
