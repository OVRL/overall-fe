/**
 * 네이티브 글로벌 헤더(로고·팀 관리) 탭 → 웹 콜백
 */

type Handlers = {
  onLogo?: () => void;
  onTeamManagement?: () => void;
};

let handlers: Handlers = {};

export function setNativeGlobalHeaderPressHandlers(next: Handlers) {
  handlers = { ...next };
}

export function clearNativeGlobalHeaderPressHandlers() {
  handlers = {};
}

export function tryHandleNativeGlobalHeaderPressFromMessageData(
  raw: unknown,
): boolean {
  if (typeof raw !== "string" || raw.length === 0) return false;
  try {
    const data = JSON.parse(raw) as {
      type?: string;
      payload?: { action?: string };
    };
    if (data?.type !== "NATIVE_GLOBAL_HEADER_PRESS") return false;
    const action = data.payload?.action;
    if (action === "logo") {
      handlers.onLogo?.();
      return true;
    }
    if (action === "team_management") {
      handlers.onTeamManagement?.();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
