---
name: native-web-bridge
description: >-
  Guides monorepo work across Expo WebView (apps/native) and Next.js (apps/web): bridge
  messages, User-Agent Overall_RN, postMessage/ReactNativeWebView, SSR-safe detection,
  native handlers, and avoiding duplicated contracts. Covers web app shell UX: page
  transitions via @ssgoi/react (Ssgoi / SsgoiTransition), TransitionProvider platform
  (APP vs mobile web vs PC). Use when wiring WebView↔web, useBridge, route transitions,
  bridgeHandler, or native-feel UI (user-select, safe area).

---

# 네이티브 ↔ 웹(WebView) 브리지 팀플레이

모노레포에서 **`apps/native`(Expo 풀 WebView)** 와 **`apps/web`(Next.js)** 가 나뉘어 있어도, 사용자 경험은 하나의 앱처럼 보여야 한다. 이 스킬은 에이전트가 양쪽을 동시에 건드릴 때 **계약 일관성·SSR·실패 처리**를 놓치지 않도록 한다.

## 언제 이 스킬을 쓰는가

- WebView 안에서 동작하는 웹 기능 추가/변경 (`postMessage`, 파일 업로드, 카메라, 위치 등)
- `Overall_RN`, `window.isNativeApp`, `ReactNativeWebView` 관련 디버깅
- 인앱 전용 스타일·동작(CSS `user-select`, 레이아웃, 브리지 플래그)
- **라우트 전환·애니메이션** (`@ssgoi/react`, `TransitionProvider`, `PageTransition`, `lib/transitions/config`)
- 네이티브 쪽 새 메시지 타입 추가 또는 `bridgeHandler.ts` 수정
- “쿠키로 앱 여부 구분” 같은 **코드베이스와 맞지 않는 가정** 정정

## WebView·앱처럼 보이는 페이지 전환 (`@ssgoi/react`)

풀 스크린 WebView 안에서는 **전통적인 “웹페이지 넘김” 느낌**이 나면 앱이 아닌 것처럼 보인다. 그래서 **`apps/web`에서는 `@ssgoi/react`** 로 페이지 전환 애니메이션을 통일해 관리한다(의존성: `apps/web/package.json` 의 `@ssgoi/react`).

- **의도**: 인앱에서 라우트가 바뀔 때도 **네이티브 앱에 가깝게** 자연스러운 전환을 유지한다.
- **구성 요약**
  - `TransitionProvider`: `useBridge().isNativeApp` 으로 플랫폼을 `APP` / `MOBILE_WEB` / `PC_WEB` 으로 나누고, `getTransitionConfig(platform)` 에 맞는 트랜지션 설정을 `Ssgoi` 에 넘긴다.
  - `PageTransition`: `SsgoiTransition` + `usePathname()` 의 `id`/`key` 로 **경로별 전환**을 건다.
  - `lib/transitions/config.ts`: `@ssgoi/react/view-transitions` 의 `drill` 등과 함께 **플랫폼별 전환 프로필**을 정의한다.
  - `components/Link.tsx`: 동일 웹뷰·Next 라우터 전제에서 ssgoi와 맞춘 링크 동작(파일 주석 참고).

라우트·전환 동작을 바꿀 때는 **브라우저(PC/모바일 웹)와 인앱(APP) 분기**가 깨지지 않았는지, 그리고 WebView 첫 로드·뒤로 가기까지 함께 확인한다.

## 단일 진실 원천 (코드 매핑)

| 관심사 | 네이티브 | 웹 |
|--------|---------|-----|
| UA 접미사 | `apps/native/utils/webViewUserAgent.ts` → `APPLICATION_NAME_FOR_USER_AGENT` (`" Overall_RN"`) | `apps/web/lib/native/webViewUserAgent.ts` → `isNativeWebViewUserAgent()` · `OVERALL_RN_USER_AGENT_MARKER` |
| 브리지 메시지 타입 | `apps/native/types/bridge.ts` 등 | `apps/web/hooks/bridge/useBridge.tsx` 의 `BridgeActionType` 등 |
| Native 핸들러 | `apps/native/utils/bridgeHandler.ts` 및 하위 핸들러 | 웹에서는 `sendToNative` / `requestWithResponse` |
| 초기 플래그 주입 | `injectedJavaScriptBeforeContentLoaded` (`window.isNativeApp = true`) — `webview.tsx`, `index.tsx` | 브라우저 탭에서는 없음 · 클라이언트에서만 의미 있음 |
| 페이지 전환(앱 느낌) | (웹 번들) `@ssgoi/react` | `TransitionProvider`, `PageTransition`, `lib/transitions/config.ts`; 플랫폼 분기에 `useBridge` 사용 |
| 네이티브 헤더 노출 URL | `apps/native/lib/nativeWebChromePaths.ts` | `apps/web/lib/native/nativeWebChromePaths.ts` — `(main)` 글로벌 / 온보딩·팀 생성 Topbar |

**중요:** 앱 여부 판별에 **`Overall_RN` 이름의 전용 쿠키는 사용하지 않는다.** 인증·팀 선택 등은 일반 HTTP 쿠키이며, **WebView 식별은 UA 마커와 브리지**가 표준 패턴이다.

## 작업 순서 (새 브리지 기능)

1. **계약부터**: 웹에서 보낼 JSON `{ type, payload?, reqId? }` 과 네이티브가 돌려줄 응답 타입을 양쪽 타입 정의와 맞춘다.
2. **네이티브 구현**: `bridgeHandler.ts` 의 `switch` 에 케이스 추가. 요청/응답이 있으면 기존처럼 `injectJavaScript` 로 `window.postMessage` 또는 동일 패턴 유지.
3. **웹 구현**: `useBridge` 에 액션 추가 또는 기존 `sendToNative` / `requestWithResponse` 재사용. Android 호환을 위해 `document.addEventListener("message", …)` 패턴을 깨지 않는다.
4. **SSR·첫 페인트**: 인앱 전용 CSS/HTML 속성은 **`headers().get("user-agent")`** 로 서버에서도 설정 가능(WebView 첫 요청 UA에 `Overall_RN` 포함). 클라이언트만의 플래그만으로는 깜빡임이 생길 수 있다.
5. **실패 UX**: 브리지 타임아웃·브라우저 탭(웹 전용) 분기 시 사용자에게 무엇을 보여줄지 명시(`lib/toast` 등 프로젝트 표준 준수).

## 흔한 실수

- **UA 문자열만 복사**: 네이티브는 앞에 공백이 있는 `" Overall_RN"` 전체를 붙인다. 웹은 부분 문자열 `Overall_RN` 으로 `includes` 검사한다 — **합의된 마커는 `apps/web/lib/native/webViewUserAgent.ts`** 하나로 맞춘다.
- **전역 상태 남발**: 가능하면 `useBridge()` 와 명시적 메시지 타입으로 통신한다.
- **서버에서는 `window` 없음**: 인앱 감지가 필요하면 **UA 또는 쿠키(도메인·SSR 타이밍 고려)** 를 선택한다.

## 검증 체크리스트

- [ ] iOS·Android WebView 각각에서 동작
- [ ] **라우트 전환**: 인앱(`APP`)·모바일 웹·PC에서 의도한 `@ssgoi/react` 전환이 각각 적용되는지 (`TransitionProvider` 플랫폼 분기)
- [ ] 동일 페이지를 **모바일 브라우저(사파리/크롬)** 에서 열었을 때 웹 전용 동작 유지 (필요 시 `isNativeApp` 분기)
- [ ] 새 탭/외부 브라우저로 공유했을 때 불필요한 네이티브 분기 없음
- [ ] 타입스크립트: 네이티브·웹 타입 이름 충돌 없음

## 참고 문서·파일

- **인앱 상단 크롬(글로벌/탑바) 경로·브리지**: `apps/web/docs/NATIVE_WEB_VIEW_CHROME.md`
- 네이티브 스펙 초안: `apps/native/docs/RNWebView_Auth_Implementation_Spec.md`
- 웹 브리지 예시(STT 등): `apps/web/docs/STT_Bridge_Spec.md` (해당 기능이 있을 때)
