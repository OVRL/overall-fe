import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  TAB_CELL_HORIZONTAL_INSET,
  TAB_SLOT_HEIGHT,
} from "./constants";
import { TabActivePillLayers } from "./TabActivePillLayers";

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 260,
  mass: 0.85,
} as const;

const HALF_TAB_SLOT_HEIGHT = TAB_SLOT_HEIGHT / 2;

type Props = {
  /** 활성 탭 인덱스 */
  activeIndex: number;
  /** 단일 슬롯 너비(px). 0이면 렌더 생략 */
  slotWidth: number;
};

/**
 * 활성 필 배경을 단일 레이어로 두고 `translateX`로 슬라이드한다.
 */
export function TabActiveSlidingHighlight({ activeIndex, slotWidth }: Props) {
  const translateX = useSharedValue(0);
  const prevSlotWidthRef = useRef(0);

  useEffect(() => {
    if (slotWidth <= 0) return;
    const inset = TAB_CELL_HORIZONTAL_INSET;
    const targetX = activeIndex * slotWidth + inset;
    const wasUnmeasured = prevSlotWidthRef.current === 0;
    prevSlotWidthRef.current = slotWidth;

    if (wasUnmeasured) {
      translateX.value = targetX;
      return;
    }
    translateX.value = withSpring(targetX, SPRING_CONFIG);
  }, [activeIndex, slotWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const inset = TAB_CELL_HORIZONTAL_INSET;
  const innerWidth = Math.max(0, slotWidth - inset * 2);

  if (slotWidth <= 0 || innerWidth <= 0) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          top: "50%",
          marginTop: -HALF_TAB_SLOT_HEIGHT,
          width: innerWidth,
          height: TAB_SLOT_HEIGHT,
          zIndex: 0,
        },
        animatedStyle,
      ]}
    >
      <TabActivePillLayers />
    </Animated.View>
  );
}
