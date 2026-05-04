/** Figma `fill_accentprimary` — 활성 아이콘·라벨·FAB(+). RN tint 안정성용 hex. */
export const ACCENT_HEX = "#B8FF12";
export const INACTIVE_ICON_TINT = "#FFFFFF";

/** Figma `bottom menu_manager` 프레임 높이(62) */
export const NAV_BAR_HEIGHT = 62;
/** Figma 탭 셀 높이 */
export const TAB_SLOT_HEIGHT = 54;
/** `LiquidNavTab` `px-1` 과 동일 — 활성 필을 탭 콘텐츠 박스에 맞춤 */
export const TAB_CELL_HORIZONTAL_INSET = 4;
/** Figma FAB(+) 원형 지름 */
export const FAB_SIZE = NAV_BAR_HEIGHT;
export const FAB_RADIUS = FAB_SIZE / 2;

export const TAB_ICON_SIZE = 24;
/** Figma `button_menu_selected` — 세로 54 → 반지름 27 */
export const TAB_ACTIVE_RADIUS = TAB_SLOT_HEIGHT / 2;

export const BLUR_INTENSITY_PILL = 38;
export const BLUR_INTENSITY_FAB = 44;

/**
 * 왼쪽 pill 배경 — Figma `background: linear-gradient(0deg, rgba(51,51,51,.3), rgba(51,51,51,.3)), #E6E6E6`
 * (동일 농도 그라데이션 = 단색 오버레이 + 베이스).
 */
export const PILL_FILL_BASE_HEX = "#E6E6E6";
export const PILL_FILL_OVERLAY_RGBA = "rgba(51, 51, 51, 0.30)";
