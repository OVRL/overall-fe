/**
 * 네이티브 리퀴드 하단 네비 FAB(+) 탭 → 웹에서 REGISTER_GAME 모달 오픈 (injectJavaScript의 window.postMessage 수신)
 */

/** RN WebView `injectJavaScript` 페이로드와 동일한 문자열이어야 함 */
export const NATIVE_LIQUID_NAV_FAB_PRESS_TYPE =
  "NATIVE_LIQUID_NAV_FAB_PRESS" as const;

type Handlers = {
  onPress?: () => void;
};

let handlers: Handlers = {};

/**
 * 네이티브 FAB 메시지 수신 시 호출할 핸들러를 등록합니다.
 */
export function setNativeLiquidNavFabPressHandlers(next: Handlers) {
  handlers = { ...next };
}

/**
 * 등록된 FAB 핸들러를 제거합니다.
 */
export function clearNativeLiquidNavFabPressHandlers() {
  handlers = {};
}

/**
 * window / document message 이벤트의 raw 데이터를 파싱해 FAB 프레스를 처리합니다.
 */
export function tryHandleNativeLiquidNavFabPressFromMessageData(
  raw: unknown,
): boolean {
  if (typeof raw !== "string" || raw.length === 0) return false;
  try {
    const data = JSON.parse(raw) as { type?: string };
    if (data?.type !== NATIVE_LIQUID_NAV_FAB_PRESS_TYPE) return false;
    handlers.onPress?.();
    return true;
  } catch {
    return false;
  }
}
