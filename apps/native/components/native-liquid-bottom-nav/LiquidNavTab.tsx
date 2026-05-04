import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import {
  ACCENT_HEX,
  INACTIVE_ICON_TINT,
  TAB_ICON_SIZE,
  TAB_SLOT_HEIGHT,
} from "./constants";
import type { NavItemConfig } from "./navConfig";
import { nativeLiquidBottomNavStyles } from "./nativeLiquidBottomNav.styles";

export type LiquidNavTabProps = {
  item: NavItemConfig;
  isActive: boolean;
  onTabPress: (href: string) => void;
};

/**
 * 단일 하단 탭(아이콘 + 라벨). 활성 상태는 부모에서 계산해 전달한다.
 */
export const LiquidNavTab = memo(function LiquidNavTab({
  item,
  isActive,
  onTabPress,
}: LiquidNavTabProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}
      hitSlop={6}
      onPress={() => onTabPress(item.href)}
      className="flex-1 flex-col items-center justify-center px-1"
      style={({ pressed }) => [
        {
          height: TAB_SLOT_HEIGHT,
          position: "relative",
        },
        pressed ? { opacity: isActive ? 0.92 : 0.88 } : null,
      ]}
    >
      <View
        className="w-full flex-col items-center justify-center gap-1"
        style={nativeLiquidBottomNavStyles.tabContentAbove}
      >
        <Image
          source={item.icon}
          style={{ width: TAB_ICON_SIZE, height: TAB_ICON_SIZE }}
          contentFit="contain"
          tintColor={isActive ? ACCENT_HEX : INACTIVE_ICON_TINT}
        />
        <Text
          className="w-full text-center font-sans text-[10px] font-medium leading-3"
          style={{ color: isActive ? ACCENT_HEX : INACTIVE_ICON_TINT }}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </View>
    </Pressable>
  );
});
