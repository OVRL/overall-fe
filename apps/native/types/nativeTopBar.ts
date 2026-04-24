/** 웹 `SET_NATIVE_TOPBAR` 페이로드 정규화 결과 */
export type NativeTopBarState = {
  transparent: boolean;
  title: string | null;
  centerMatchLineupLogo: boolean;
  showLeft: boolean;
  rightMode: "none" | "label";
  rightLabel: string | null;
  rightDisabled: boolean;
};
