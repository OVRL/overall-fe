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
- `tryHandleNativeLiquidNavFabPressFromMessageData` — `nativeLiquidNavFabPressBridge` (`NATIVE_LIQUID_NAV_FAB_PRESS`)

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
| `useNativeChromePressMessageBridge` | RN에서 온 탑바/글로벌 탭·리퀴드 FAB 메시지를 웹 핸들러로 연결 |

## 하단 리퀴드 네브바 예약 패딩 (웹 레이아웃)

### 배경

WebView는 상단 네이티브 헤더 아래 **가능한 한 큰 세로 공간**을 쓰고, 그 위에 **네이티브** `NativeLiquidBottomNav`(플로팅 탭 + FAB)가 얹혀 있다. 이때 웹이 뷰포트 전체를 “내 영역”처럼 그리면 **페이지 푸터·하단 CTA·모달 하단 버튼**이 네브바에 가려진다. WebView의 물리 높이를 줄이는 대신, **네이티브 탭이 떠 있는 URL 구간에서만** 웹 본문에 `padding-bottom`을 주어 스크롤 끝까지 콘텐츠가 네브바 **위**로 오게 한다.

### 정책: `@/components/Header` 글로벌 행 숨김과 동일한 “인앱” 식별

| 환경 | `(main)` 글로벌 헤더 웹 행 | 하단 예약 패딩 (`pb-app-native-liquid-nav`) |
|------|---------------------------|---------------------------------------------|
| PC 웹 | 표시 | **없음** |
| 모바일 브라우저(사파리·크롬 등) | 표시 | **없음** |
| **인앱 WebView** (`Overall_RN` UA, 루트 `data-native-webview`와 동일 계열) | 숨김 (`hideWebGlobalChrome`) | **리퀴드 탭 셸 경로에서만 적용** |

- **서버**: `app/(main)/layout.tsx`에서 `isNativeWebViewUserAgent(user-agent)`로 `Header`와 같은 기준을 쓴다.
- **클라이언트**: `MainNativeBottomNavReserve`에서 `useBridge().isNativeApp`으로 라우트 전환 후에도 동일하게 맞춘다(UA만 있고 `ReactNativeWebView`가 늦게 붙는 경우 등은 `useBridge`와 동일).

모바일 웹은 UA에 `Overall_RN`이 없으므로 **패딩이 붙지 않는다**. PC도 동일하다.

### 적용 경로 (홈·선수 기록·경기 기록·내 정보)

네이티브 `apps/native/lib/isNativeBottomNavVisiblePath.ts`와 **같은 트리**만 대상으로 한다. 웹 판별 함수는 `apps/web/lib/native/nativeLiquidBottomNavShellPaths.ts`의 `isNativeLiquidBottomNavShellPath`이다.

| 탭 | URL 패턴 |
|----|-----------|
| 홈 | `/` |
| 선수 기록 | `/team-data`, `/team-data/...` |
| 경기 기록 | `/match-record`, `/match-record/...` |
| 내 정보 | `/profile`, `/profile/...` |

`(main)`이지만 위에 해당하지 않는 경로(예: `/team-management`, `/player/...`, `/formation/...`)는 **패딩을 넣지 않는다**. 네이티브에서도 이 구간에는 리퀴드 하단 탭이 **표시되지 않는다**는 전제와 맞춘다.

**동기화**: 탭 노출 범위를 바꿀 때는 반드시 `isNativeBottomNavVisiblePath`(네이티브)와 `isNativeLiquidBottomNavShellPath`(웹)를 **함께** 수정한다.

### 구현 단계 (데이터 흐름)

1. **`app/(main)/layout.tsx` (서버 컴포넌트)**  
   - `hideWebGlobalChrome = isNativeWebViewUserAgent(ua)` — 기존 `Header`와 동일.  
   - `pathname = headers().get("x-pathname") ?? ""` — 인증된 private 페이지 요청에서 `proxy.ts`가 설정한다.  
   - `ssrNativeBottomNavPad = hideWebGlobalChrome && isNativeLiquidBottomNavShellPath(pathname)`  
   - 자식을 `<MainNativeBottomNavReserve ssrShouldPad={ssrNativeBottomNavPad}>`로 감싼다.

2. **`MainNativeBottomNavReserve` (클라이언트)**  
   - `useBridge().isNativeApp`와 `usePathname()`으로 `clientShouldPad` 계산.  
   - **하이드레이션 불일치 방지**: `useEffect`로 `hydrated`를 켜기 전까지는 **서버에서 계산한 `ssrShouldPad`만** 사용한다. `useBridge`의 초기 `isNativeApp`은 서버 사전 렌더에서 `window`가 없어 `false`가 될 수 있기 때문이다.  
   - `shouldPad === true`일 때 자식 래퍼에 `pb-app-native-liquid-nav` 클래스를 붙인다.

3. **CSS (`packages/design-system/styles/globals.web.css`)**  
   - `:root { --native-liquid-bottom-nav-bar-height: 3.875rem; }` — 네이티브 `NAV_BAR_HEIGHT`(62px)와 동일 의미.  
   - `@utility pb-app-native-liquid-nav`: `padding-bottom: calc(env(safe-area-inset-bottom, 0px) + var(--native-liquid-bottom-nav-bar-height))`  
   - 홈 인디케이터 영역은 `env(safe-area-inset-bottom)`으로 포함한다(네이티브에서 `NativeLiquidBottomNav`가 `useSafeAreaInsets().bottom`만큼 올려 둔 배치와 대응).

### `x-pathname`이 비어 있는 경우

`x-pathname`은 private 라우트 통과 시 `proxy.ts`에서만 주입된다. 비어 있으면 `isNativeLiquidBottomNavShellPath("")`는 false이므로 **SSR 패딩은 꺼진다**. 클라이언트 네비게이션 후에는 `usePathname()`으로 경로가 맞으면 패딩이 켜진다. 인앱 메인 사용 경로에서는 대부분 private이므로 실사용 영향은 작다.

### 한계·후속

- **전역 패딩은 `(main)` 콘텐츠 영역**에만 적용된다. **풀스크린 모달**(`Modals` 포털 등) 하단이 여전히 가리는 경우는 별도로 모달 컨테이너에 동일 inset을 주는 식의 후속이 필요할 수 있다.  
- 네이티브 바 **시각적 높이·플로팅 여백**을 디자인에서 바꾸면 `--native-liquid-bottom-nav-bar-height`와 `apps/native/components/native-liquid-bottom-nav/constants.ts`의 `NAV_BAR_HEIGHT`를 **함께** 맞출 것.

## 네이티브 UI 컴포넌트

- `NativeWebGlobalHeader` — 로고(expo-image) + 햄버거(Ionicons). `SvgXml` 미사용(iOS Fabric 이슈 회피).
- `NativeWebTopBar` — 뒤로(Ionicons), 중앙 타이틀/매치라인업 등.
- `NativeLiquidBottomNav` — 홈·선수/경기 기록·내 정보 탭 + FAB. 웹은 동일 경로에서 `pb-app-native-liquid-nav`로 하단을 예약한다.

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
| 리퀴드 탭 셸 경로(웹) | `apps/web/lib/native/nativeLiquidBottomNavShellPaths.ts` |
| `(main)` 하단 패딩 래퍼 | `apps/web/components/providers/MainNativeBottomNavReserve.tsx` |
| 리퀴드 탭 노출 경로(네이티브) | `apps/native/lib/isNativeBottomNavVisiblePath.ts` |

## 향후: 포메이션 모바일

`FormationHeader` 가 로컬 `Header` 를 쓰므로, 인앱에서 포메이션 상단을 네이티브로 맞추려면 **`@/components/Header` 와 동일한 브리지 계약**으로 로컬 컴포넌트를 바꾸거나, `isSharedHeaderTopbarPath` 에 `/formation` 규칙을 추가하고 전용 페이로드를 설계하면 된다.
