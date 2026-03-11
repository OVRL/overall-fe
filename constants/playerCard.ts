export type CardGrade =
  | "NORMAL_BLUE"
  | "NORMAL_GREEN"
  | "RARE"
  | "ELITE"
  | "LEGEND";

export interface CardThemeConfig {
  bgUrl: string;
  positionVariant?: "outline" | "filled";
  nameClassName?: string;
  numberClassName?: string;
  positionClassName?: string;
}

// 등급별 공통 베이스 스타일
const BASE_STYLES = {
  NORMAL: {
    positionVariant: "filled" as const,
    nameClassName: "text-white drop-shadow-md",
    numberClassName: "text-white drop-shadow-md",
    positionClassName: "", // 강제 배경색/글자색 제거 (PositionChip 고유 색상 유지)
  },
  RARE_ELITE: {
    positionVariant: "filled" as const,
    nameClassName: "text-Label-AccentPrimary drop-shadow-sm",
    numberClassName: "text-Label-AccentPrimary drop-shadow-sm",
    positionClassName: "", // 강제 배경색/글자색 제거
  },
};

export const CARD_THEME_MAP: Record<CardGrade, CardThemeConfig> = {
  NORMAL_BLUE: {
    bgUrl: "/images/card-bgs/normal-blue.webp",
    ...BASE_STYLES.NORMAL,
  },
  NORMAL_GREEN: {
    bgUrl: "/images/card-bgs/normal-green.webp",
    ...BASE_STYLES.NORMAL,
  },
  RARE: {
    bgUrl: "/images/card-bgs/normal-blue.webp",
    ...BASE_STYLES.RARE_ELITE,
  },
  ELITE: {
    bgUrl: "/images/card-bgs/normal-blue.webp",
    ...BASE_STYLES.RARE_ELITE,
    positionClassName: "shadow-sm", // Elite는 칩 강조 (색상 덮어쓰기 제외)
  },
  LEGEND: {
    bgUrl: "/images/bg_zlatan.webp",
    positionVariant: "filled" as const,
    nameClassName: "text-primary italic font-black drop-shadow-lg",
    numberClassName: "text-primary italic font-black drop-shadow-lg",
    positionClassName: "", // 강제 배경색 제거
  },
};
