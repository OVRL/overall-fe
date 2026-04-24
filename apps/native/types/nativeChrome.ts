import type { NativeTopBarState } from "./nativeTopBar";

/** 인앱 글로벌 헤더(로고 + 햄버거) — 웹 `Header variant="global"` 대응 */
export type NativeGlobalHeaderState = {
  showHamburger: boolean;
};

/** WebView 상단 네이티브 크롬: 탑바 또는 메인 글로벌 헤더 */
export type NativeWebChrome =
  | { mode: "topbar"; topbar: NativeTopBarState }
  | { mode: "global"; global: NativeGlobalHeaderState };
