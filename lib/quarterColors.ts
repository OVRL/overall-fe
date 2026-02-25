/**
 * 쿼터 번호별 Tailwind 색상 정의.
 * QuarterChip, QuarterDotsMobile 등에서 공통 사용.
 */

export const QUARTER_COLORS: Record<
  number,
  { border: string; bg: string; text?: string }
> = {
  1: {
    border: "border-Position-DF-Blue",
    bg: "bg-Position-DF-Blue",
    text: "text-Position-DF-Blue",
  },
  2: {
    border: "border-Position-MF-Green",
    bg: "bg-Position-MF-Green",
    text: "text-Position-MF-Green",
  },
  3: {
    border: "border-Position-GK-Yellow",
    bg: "bg-Position-GK-Yellow",
    text: "text-Position-GK-Yellow",
  },
  4: {
    border: "border-Position-FW-Red",
    bg: "bg-Position-FW-Red",
    text: "text-Position-FW-Red",
  },
  5: {
    border: "border-purple-500",
    bg: "bg-purple-500",
    text: "text-purple-500",
  },
  6: {
    border: "border-orange-500",
    bg: "bg-orange-500",
    text: "text-orange-500",
  },
  7: { border: "border-pink-500", bg: "bg-pink-500", text: "text-pink-500" },
  8: { border: "border-cyan-500", bg: "bg-cyan-500", text: "text-cyan-500" },
  9: { border: "border-teal-500", bg: "bg-teal-500", text: "text-teal-500" },
  10: {
    border: "border-indigo-500",
    bg: "bg-indigo-500",
    text: "text-indigo-500",
  },
};

const FALLBACK = { border: "border-gray-600", bg: "bg-gray-600" };

/** 쿼터 번호에 해당하는 배경 클래스 반환 (원·바 등에 사용) */
export function getQuarterColor(q: number): string {
  return QUARTER_COLORS[q]?.bg ?? FALLBACK.bg;
}

/** 쿼터 번호에 해당하는 border + bg 조합 클래스 문자열 (단일 칩 스타일) */
export function getQuarterChipStyle(q: number): string {
  const color = QUARTER_COLORS[q] ?? FALLBACK;
  return `border ${color.border} ${color.bg}`;
}
