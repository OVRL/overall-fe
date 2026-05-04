declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
  interface DocumentEventMap {
    message: MessageEvent;
  }
}

/** Web → Native 요청 타입 */
export type BridgeActionType =
  | "GET_PUSH_TOKEN"
  | "OPEN_CAMERA"
  | "REQUEST_PERMISSIONS"
  | "VIBRATE"
  | "OPEN_SETTINGS"
  | "GET_LOCATION"
  | "ROUTE_CHANGE"
  | "OPEN_PHOTO_PICKER"
  | "SET_WEBVIEW_CHROME"
  | "SET_NATIVE_TOPBAR"
  | "SET_NATIVE_GLOBAL_HEADER"
  /** WebView 인앱에서 구글 OAuth 등 — 임베디드 WebView는 Google 정책상 차단되므로 네이티브 SDK/ASWebAuthenticationSession으로 위임 */
  | "START_NATIVE_SOCIAL_LOGIN"
  /** 웹 모달(`useModalStore`) 열림 시 리퀴드 하단 네브바를 잠시 슬라이드 아웃 */
  | "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY"
  /**
   * Next.js 클라이언트 라우트의 `pathname`을 네이티브에 동기화.
   * WebView `onNavigationStateChange`만으로는 SPA 전환 후 URL이 갱신되지 않는 경우가 있어 하단 탭이 `/`로 오인되는 것을 막는다.
   */
  | "SYNC_WEBVIEW_CLIENT_PATHNAME";

export type WebViewChromeMode = "safe" | "fullscreen";

/** Native → Web 응답 타입 */
export type BridgeResponseType =
  | "PUSH_TOKEN_RESULT"
  | "LOCATION_RESULT"
  | "PERMISSIONS_RESULT"
  | "PHOTO_PICKER_RESULT"
  | "ERROR";

export interface BridgeMessage<T = unknown> {
  type: BridgeActionType | BridgeResponseType;
  payload?: T;
  reqId?: string;
}

export interface BridgeResponse<T = unknown> extends BridgeMessage<T> {
  error?: string;
}
