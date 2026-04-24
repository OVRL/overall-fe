export type BridgeActionType =
  | "GET_PUSH_TOKEN"
  | "OPEN_CAMERA"
  | "OPEN_PHOTO_PICKER"
  | "REQUEST_PERMISSIONS"
  | "VIBRATE"
  | "OPEN_SETTINGS"
  | "GET_LOCATION"
  | "ROUTE_CHANGE"
  | "SET_WEBVIEW_CHROME"
  | "SET_NATIVE_TOPBAR"
  | "SET_NATIVE_GLOBAL_HEADER";

export interface BridgePayload {
  url?: string;
  action?: "PUSH" | "REPLACE" | "BACK";
  /**
   * WebView(네이티브 크롬) 표시 모드
   * - safe: 상태바 아래부터 렌더(상단 Safe Area 적용)
   * - fullscreen: 상태바 아래 여백 없이 상단까지 확장(언더 상태바)
   */
  chromeMode?: "safe" | "fullscreen";
  /** 인앱 상단 네이티브 탑바(웹 TopbarHeader 대체) */
  visible?: boolean;
  transparent?: boolean;
  title?: string | null;
  centerMatchLineupLogo?: boolean;
  showLeft?: boolean;
  rightMode?: "none" | "label";
  rightLabel?: string | null;
  rightDisabled?: boolean;
  /** 글로벌 헤더 전용 */
  showHamburger?: boolean;
  [key: string]: any;
}

export interface BridgeMessage {
  type: BridgeActionType;
  payload?: BridgePayload;
  reqId?: string;
}

export interface BridgeResponse {
  type: string;
  payload?: any;
  reqId?: string;
}
