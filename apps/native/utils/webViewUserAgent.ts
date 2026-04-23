/**
 * WebView에서 기기 기본 User-Agent 뒤에 붙일 식별자.
 *
 * react-native-webview 공식 문서 권장: userAgent를 통째로 덮어쓰지 말고
 * applicationNameForUserAgent prop을 사용하면, 각 디바이스의 실제 시스템 UA에
 * 이 문자열만 덧붙여진다. 따라서 iOS/Android 버전·기기 종류가 고정되지 않고
 * 앱이 실행 중인 디바이스의 UA가 그대로 반영된다.
 *
 * 웹에서 SSR 시 navigator.userAgent.includes(' Overall_RN')으로
 * 네이티브 앱 환경을 딜레이 없이 판단할 수 있음.
 */
export const APPLICATION_NAME_FOR_USER_AGENT = " Overall_RN";
