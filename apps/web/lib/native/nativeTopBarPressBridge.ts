/**
 * 네이티브 탑바 버튼 탭 → 웹 콜백 (injectJavaScript의 window.postMessage 수신)
 */

type Handlers = {
  onLeft?: () => void;
  onRight?: () => void;
};

let handlers: Handlers = {};

export function setNativeTopBarPressHandlers(next: Handlers) {
  handlers = { ...next };
}

export function clearNativeTopBarPressHandlers() {
  handlers = {};
}

/** window / document message 이벤트에서 문자열 raw JSON 처리 */
export function tryHandleNativeTopBarPressFromMessageData(raw: unknown) {
  if (typeof raw !== "string" || raw.length === 0) return false;
  try {
    const data = JSON.parse(raw) as { type?: string; payload?: { side?: string } };
    if (data?.type !== "NATIVE_TOPBAR_PRESS") return false;
    const side = data.payload?.side;
    if (side === "left") {
      handlers.onLeft?.();
      return true;
    }
    if (side === "right") {
      handlers.onRight?.();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
