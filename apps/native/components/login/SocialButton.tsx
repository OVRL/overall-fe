import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

/** 소셜 아이콘은 expo-image `style`로 크기를 고정합니다. */
const SOCIAL_ICON_STYLE = {
  width: 24,
  height: 24,
};

export type SocialButtonProps = {
  label: string;
  iconSource: number;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  onPress: () => void;
};

export function SocialButton({
  label,
  iconSource,
  backgroundColor,
  textColor,
  borderColor,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
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
          accessible={false}
          source={iconSource}
          style={SOCIAL_ICON_STYLE}
          contentFit="contain"
        />
        <Text
          accessible={false}
          className="text-center text-xl font-bold font-sans"
          style={{ color: textColor }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
