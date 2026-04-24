# 인앱 WebView ↔ 네이티브 상단 크롬(헤더) 연동

Expo(`apps/native`) 단일 WebView로 Next.js(`apps/web`)를 띄울 때, **웹에서 헤더가 보이는 페이지와 동일한 조건**으로 React Native 상단 UI(글로벌 헤더 / 탑바)를 보이거나 숨기기 위한 설계와 파일 맵이다.

## 식별 방식

- **User-Agent**: 웹 서버·클라이언트는 `Overall_RN`(또는 프로젝트 상수) 포함 UA로 인앱을 판별한다. 인앱 전용 쿠키는 사용하지 않는다.
- **`window.ReactNativeWebView`**: 브리지 `postMessage` 전송에 사용. `useBridge`는 UA만 있고 객체가 늦게 붙는 경우 메시지를 큐에 쌓았다가 플러시한다.

## 웹에서 `@/components/Header` 가 쓰이는 위치

| 구분 | 경로(요약) | Header 종류 | 네이티브 연동 |
|------|----------------|---------------|----------------|
| 메인 앱 셸 | `app/(main)/layout.tsx` 이 감싸는 전체 URL (`/`, `/team-data`, `/profile`, …) | `variant="global"` | `SET_NATIVE_GLOBAL_HEADER` → `NativeWebGlobalHeader` |
| 온보딩 | `/onboarding`, `/onboarding/...` | 기본 Topbar (`leftAction` 등) | `SET_NATIVE_TOPBAR` → `NativeWebTopBar` |
| 팀 생성 | `/create-team`, `/create-team/...` | 기본 Topbar | 동일 |
| 포메이션 | `/formation/...` | **`app/formation/_components/Header.tsx` (로컬)** | 현재 브리지 미연동. 웹 전용 UI. |
| 팀 가입 랜딩 | `/join-team` | `@/components/landing/Header` | 공유 `Header` 아님 → 네이티브 공유 크롬 없음 |
| 로그인 등 | `/login`, `/login/social`, … | 로그인 전용 UI | 공유 `Header` 없음 |

경로 판별 함수는 **`apps/web/lib/native/nativeWebChromePaths.ts`** 에 모아 두었다.

- `isMainAppShellPath(pathname)` — 글로벌 헤더가 정의된 `(main)` 구간
- `isSharedHeaderTopbarPath(pathname)` — `@/components/Header` Topbar 만 쓰는 온보딩·팀 생성

`(main)` 아래에 **새 루트 라우트**를 추가하면 `nativeWebChromePaths.ts` 의 `isMainAppShellPath` 와 **`apps/native/lib/nativeWebChromePaths.ts`** 를 **같이** 수정해야 한다.

## 브리지 메시지 (Web → Native)

| 타입 | 용도 |
|------|------|
| `SET_NATIVE_GLOBAL_HEADER` | 글로벌 헤더 표시/숨김. `visible: true` 일 때 `showHamburger` 등 |
| `SET_NATIVE_TOPBAR` | 탑바 표시/숨김. 제목·좌측 뒤로·우측 라벨 등 |
| `SET_WEBVIEW_CHROME` | `safe` / `fullscreen` 등 웹뷰 크롬 모드 |

숨김(`visible: false`) 시 네이티브에서는 **`onClearNativeWebChromeIfMode`** 로 글로벌/탑바 중 **해당 모드만** 제거해, 한쪽 숨김이 다른 쪽(예: 탑바만 있는 화면)을 지우지 않도록 한다.

## 웹 → 네이티브 버튼 이벤트 (Native → Web)

RN이 `injectJavaScript` 로 `window.postMessage` 하면, 웹은 `useNativeChromePressMessageBridge` (`hooks/bridge/useNativeChromePressMessageBridge.ts`) 로 수신해 다음으로 위임한다.

- `tryHandleNativeTopBarPressFromMessageData` — `nativeTopBarPressBridge`
- `tryHandleNativeGlobalHeaderPressFromMessageData` — `nativeGlobalHeaderPressBridge`

`TransitionProvider` 는 트랜지션(Ssgoi)만 담당하고, 위 훅으로 인앱 메시지 구독을 분리했다.

## 경로 가드 (잔류 방지)

라우트 전환 순서 때문에 언마운트 cleanup 이 늦으면 네이티브 헤더가 남을 수 있다.

1. **`PageTransition`** (`components/providers/PageTransition.tsx`)  
   - `(main)` 이 아니면 `SET_NATIVE_GLOBAL_HEADER` `visible: false`  
   - 공유 Topbar 경로가 아니면 `SET_NATIVE_TOPBAR` `visible: false`

2. **Native `WebView` `onNavigationStateChange`** (`apps/native/app/index.tsx`, `webview.tsx`)  
   - 같은 앱 오리진일 때 URL `pathname` 으로 위와 동일한 규칙으로 `nativeChrome` 상태를 직접 정리

## 웹 쪽 동기화 훅

| 훅 | 역할 |
|----|------|
| `useNativeGlobalHeaderSync` | `Header variant="global"` + 인앱일 때 글로벌 헤더 브리지 |
| `useNativeTopBarSync` | `TopbarHeader` + 인앱일 때 탑바 브리지. 우측이 **아이콘만**(`rightAction`)인 구성은 페이로드 한계로 **웹 탑바 유지** |
| `useNativeChromePressMessageBridge` | RN에서 온 탑바/글로벌 탭 메시지를 웹 핸들러로 연결 |

## 네이티브 UI 컴포넌트

- `NativeWebGlobalHeader` — 로고(expo-image) + 햄버거(Ionicons). `SvgXml` 미사용(iOS Fabric 이슈 회피).
- `NativeWebTopBar` — 뒤로(Ionicons), 중앙 타이틀/매치라인업 등.

## 타입·핸들러 위치 (빠른 참조)

| 영역 | 경로 |
|------|------|
| 공유 `Header` UI | `apps/web/components/header/` (`GlobalHeader`, `TopbarHeader`, `headerTypes`) — 엔트리는 `components/Header.tsx` |
| 경로 가드 훅 | `apps/web/hooks/bridge/useNativeWebChromePathGuard.ts` |
| 경로 규칙(웹) | `apps/web/lib/native/nativeWebChromePaths.ts` |
| 경로 규칙(네이티브, 동일 로직) | `apps/native/lib/nativeWebChromePaths.ts` |
| 브리지 처리 | `apps/native/utils/bridgeHandler.ts` |
| 메인 WebView 화면 | `apps/native/app/index.tsx` |
| 스택 WebView 화면 | `apps/native/app/webview.tsx` |
| 웹 브리지 훅 | `apps/web/hooks/bridge/useBridge.tsx` |

## 향후: 포메이션 모바일

`FormationHeader` 가 로컬 `Header` 를 쓰므로, 인앱에서 포메이션 상단을 네이티브로 맞추려면 **`@/components/Header` 와 동일한 브리지 계약**으로 로컬 컴포넌트를 바꾸거나, `isSharedHeaderTopbarPath` 에 `/formation` 규칙을 추가하고 전용 페이로드를 설계하면 된다.
