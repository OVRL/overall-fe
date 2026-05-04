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
| `SET_NATIVE_GLOBAL_HEADER` | 글로벌 헤더 표시/숨김. `visible: true` 일 때 `showTeamManagement`(우측 팀 관리 아이콘) 등 |
| `SET_NATIVE_TOPBAR` | 탑바 표시/숨김. 제목·좌측 뒤로·우측 라벨 등 |
| `SET_WEBVIEW_CHROME` | `safe` / `fullscreen` 등 웹뷰 크롬 모드 |
| `SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY` | payload `hidden: boolean`. 웹 [`Modals`](components/modals/Modals.tsx) / `useModalStore`에 모달이 열려 있고 **리퀴드 탭 셸 경로**일 때 `true` → 네이티브가 하단 네브바를 아래로 슬라이드 아웃. 탭 셸이 아니거나 모달이 없으면 `false`(네이티브 상태 리셋 포함) |
| `SYNC_WEBVIEW_CLIENT_PATHNAME` | payload `pathname` 문자열. [`PageTransition`](components/providers/PageTransition.tsx)의 `useNativeWebViewClientPathnameSync`가 인앱에서만 전송. Next **클라이언트 라우팅**만 일어날 때 WebView `onNavigationStateChange`의 URL이 갱신되지 않아 `webPathname`이 `/`에 남고 하단 탭이 뜨는 문제를 막는다. |

숨김(`visible: false`) 시 네이티브에서는 **`onClearNativeWebChromeIfMode`** 로 글로벌/탑바 중 **해당 모드만** 제거해, 한쪽 숨김이 다른 쪽(예: 탑바만 있는 화면)을 지우지 않도록 한다.

**리퀴드 탭 제외 경로**: `/login`, `/login/...`, `/social/...`, `/join-team`, `/create-team`, `/onboarding` 등은 `isNativeLiquidNavTabExcludedPath`로 통일한다(`apps/web/lib/native/nativeLiquidNavTabExcludedPaths.ts`, `apps/native/lib/nativeLiquidNavTabExcludedPaths.ts` 동기화).

### 웹 모달 시 네이티브 리퀴드 네브바 슬라이드 숨김

- **트리거**: `modals.length > 0 && isNativeLiquidBottomNavShellPath(pathname) && useBridge().isNativeApp` 일 때만 `hidden: true`를 보낸다. PC·모바일 브라우저에서는 **`isNativeApp`이 false**이므로 브리지를 쏘지 않는다.
- **구현**: [`components/providers/NativeLiquidNavModalOverlayBridge.tsx`](components/providers/NativeLiquidNavModalOverlayBridge.tsx)를 [`app/layout.tsx`](app/layout.tsx)의 `TransitionProvider` 아래에 마운트. 동일 `hidden` 값으로의 중복 전송은 `useRef`로 스킵한다.
- **네이티브**: [`AnimatedLiquidBottomNavShell.tsx`](../../native/components/native-liquid-bottom-nav/AnimatedLiquidBottomNavShell.tsx)(`apps/native/...`)가 `react-native-reanimated`의 `withTiming`(약 280ms, cubic in-out)으로 `translateY`를 **화면 아래 방향**으로 옮겨 숨기고, 복귀 시 아래에서 올라온다. 이동 거리는 `useSafeAreaInsets().bottom + NAV_BAR_HEIGHT(62) + 20px` 버퍼.
- **상태**: [`apps/native/app/index.tsx`](../../native/app/index.tsx), [`apps/native/app/webview.tsx`](../../native/app/webview.tsx)에서 `liquidNavModalOverlayHidden` state + `handleBridgeMessage` 옵션 `onSetLiquidNavModalOverlay`. 리퀴드 탭이 **경로상 미노출**이 되면 `useEffect`로 `hidden`을 false로 리셋한다.
- **테스트**: [`components/providers/__tests__/NativeLiquidNavModalOverlayBridge.test.tsx`](components/providers/__tests__/NativeLiquidNavModalOverlayBridge.test.tsx)에서 비인앱 시 브리지 미전송·탭 셸·모달 유무를 검증한다.

## 웹 → 네이티브 버튼 이벤트 (Native → Web)

RN이 `injectJavaScript` 로 `window.postMessage` 하면, 웹은 `useNativeChromePressMessageBridge` (`hooks/bridge/useNativeChromePressMessageBridge.ts`) 로 수신해 다음으로 위임한다.

- `tryHandleNativeTopBarPressFromMessageData` — `nativeTopBarPressBridge`
- `tryHandleNativeGlobalHeaderPressFromMessageData` — `nativeGlobalHeaderPressBridge`
- `tryHandleNativeLiquidNavFabPressFromMessageData` — `nativeLiquidNavFabPressBridge` (`NATIVE_LIQUID_NAV_FAB_PRESS`)

`NATIVE_GLOBAL_HEADER_PRESS` 페이로드 `action`: `"logo"`(홈), `"team_management"`(팀 관리 페이지). PC·모바일 웹의 `GlobalHeader` 햄버거 드롭다운은 그대로 두고, 인앱에서만 네이티브 헤더 우측 아이콘이 팀 관리로 동작한다.

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
| `useNativeWebViewClientPathnameSync` | 인앱에서 Next `pathname` → `SYNC_WEBVIEW_CLIENT_PATHNAME` |

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

- `NativeWebGlobalHeader` — 가운데 로고(expo-image) + 우측 팀 관리 아이콘(`team_management.svg`, expo-image). 탭 시 웹에서 `NATIVE_GLOBAL_HEADER_PRESS` `action: "team_management"` → `/team-management` 라우팅. `SvgXml` 미사용(iOS Fabric 이슈 회피).
- `NativeWebTopBar` — 뒤로(Ionicons), 중앙 타이틀/매치라인업 등.
- `NativeLiquidBottomNav` — 홈·선수/경기 기록·내 정보 탭 + FAB. 웹은 동일 경로에서 `pb-app-native-liquid-nav`로 하단을 예약한다. 웹 모달이 열리면 `AnimatedLiquidBottomNavShell`로 슬라이드 아웃한다.

## 네이티브 리퀴드 하단 네비: 탭 프레스·네비게이션 쿨다운 (2026-05-04)

**키워드(grep)**: `NativeLiquidBottomNav`, `LiquidNavTab`, `useLiquidNavTabNavigation`, `NAV_TAB_NAV_COOLDOWN_MS`, `TAB_PRESS_SCALE`, `onNavigateRef`, 트레일링 큐, WebView pathname 싱크, `expo-haptics`

기획·구현 히스토리는 planning-implementation-chronicler 규격으로 남긴다. 이후 탭·쿨다운·FAB 경계를 바꿀 때 아래 **불변조건**을 우선 확인한다.

### 1) 기획·정책 스냅샷

| 구분 | 내용 |
|------|------|
| **목표** | 인앱 하단 리퀴드 네비에서 탭을 눌렀을 때 **반응감은 유지**하면서, **활성 하이라이트·아이콘 상태는 pathname과 동기화**(낙관적 “가짜 활성”으로 필·콘텐츠 어긋남을 피함). |
| **범위** | `apps/native/components/native-liquid-bottom-nav/`(탭 셀 + FAB). 웹 라우팅 계약·GraphQL·Relay 비대상. |
| **선택안** | 낙관적 아이콘/필 분리(B안) 대신 **C안 계열**: **프레스 피드백 강화** + **연속 탭 시 네비 쿨다운 + 마지막 `href`만 트레일링 실행**. |
| **비기능** | 짧은 연속 탭으로 `injectJavaScript` 기반 네비 호출이 겹치지 않게 완충; 언마운트 시 타이머 정리; 햅틱은 탭마다 제공. |

### 2) 구현 매핑

| 영역 | 위치·역할 |
|------|-----------|
| **상수** | `constants.ts` — `NAV_TAB_NAV_COOLDOWN_MS`(320ms), `TAB_PRESS_SCALE`(0.94). |
| **탭 UI** | `LiquidNavTab.tsx` — `Pressable`의 `pressed` 시 `TAB_PRESS_SCALE` 스케일; 활성/비활성에 따라 눌림 시 opacity 차등. |
| **탭 네비** | `useLiquidNavTabNavigation.ts` — 쿨다운 밖이면 즉시 `onNavigateToPath`; 쿨다운 안이면 `queuedHrefRef`만 갱신하고 쿨다운 종료 시 `setTimeout`으로 **한 번** 플러시. `onNavigateRef`로 콜백 최신화. 클린업에서 타임아웃·큐 초기화. 각 탭 프레스마다 Light 햅틱. |
| **조립** | `NativeLiquidBottomNav.tsx` — `isTabActive(pathname, item)` 등으로 활성 상태 전달. 탭에는 `useLiquidNavTabNavigation` 반환 핸들러만 연결. |
| **FAB(+)** | `onPlus`만 별도 — Medium 햅틱 후 `onLiquidNavFabPress` 또는 `onNavigateToPath(plusHref)`. **쿨다운·큐 미적용**. |

**활성 표시 소스**: `pathname` + `navPathUtils`(기존). 낙관적 활성 색 없음.

### 3) 검증·잔여 리스크

- **수동 확인 권장**: 동일 탭·다른 탭을 빠르게 연타했을 때 **마지막 목적지만** 따라가는지; 느린 기기·WebView 지연 시 체감 지연 가능성.
- **트레이드오프**: 쿨다운 구간 내 **첫 탭은 즉시**, 이후 탭은 **최대 약 `NAV_TAB_NAV_COOLDOWN_MS` 뒤**로 미뤄질 수 있음. 플러시 후 다시 쿨다운이 적용되어 연속 라우팅이 **일정 간격으로 제한**됨.
- **튜닝**: 동작 규칙을 바꾸지 않고 수치만 조정할 때는 `NAV_TAB_NAV_COOLDOWN_MS`·`TAB_PRESS_SCALE` 중심으로 조정하고, 본 섹션·주석을 함께 갱신할지 검토.

### 4) 후속 수정 시 불변조건·주의점

- **활성 UI는 pathname과만 일치**시키고, 빠른 연속 입력은 **쿨다운 + 단일 트레일링 `href`**로 WebView 네비 중첩을 막을 것.
- **FAB는 `useLiquidNavTabNavigation`에 넣지 말 것** — 쿨다운 적용 범위를 탭으로 한정한 계약.
- **`onNavigateToPath` 변경**: ref(`onNavigateRef`) 패턴을 깨면 큐 플러시 시 stale closure 가능.
- **언마운트**: 타이머·큐 정리 로직을 제거하면 백그라운드 플러시·누적 위험.
- **플랫폼**: 본 패치는 **`apps/native` 전용**. 브리지·UA·`SYNC_WEBVIEW_CLIENT_PATHNAME` 등과 혼동하지 말 것. 상위 맥락은 `.agents/skills/native-web-bridge/SKILL.md` 및 본 문서 브리지 절.

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
| 웹 모달 시 네브바 브리지 | `apps/web/components/providers/NativeLiquidNavModalOverlayBridge.tsx` |
| 네이티브 네브 슬라이드 래퍼 | `apps/native/components/native-liquid-bottom-nav/AnimatedLiquidBottomNavShell.tsx` |
| 클라이언트 pathname 동기화(웹) | `apps/web/hooks/bridge/useNativeWebViewClientPathnameSync.tsx` |
| 리퀴드 탭 제외 경로(웹) | `apps/web/lib/native/nativeLiquidNavTabExcludedPaths.ts` |
| 리퀴드 탭 제외 경로(네이티브) | `apps/native/lib/nativeLiquidNavTabExcludedPaths.ts` |
| 리퀴드 탭 네비 쿨다운 훅 | `apps/native/components/native-liquid-bottom-nav/useLiquidNavTabNavigation.ts` |
| 리퀴드 탭 셀(`Pressable`) | `apps/native/components/native-liquid-bottom-nav/LiquidNavTab.tsx` |
| 리퀴드 네비 상수(쿨다운·스케일) | `apps/native/components/native-liquid-bottom-nav/constants.ts` |

## 향후: 포메이션 모바일

`FormationHeader` 가 로컬 `Header` 를 쓰므로, 인앱에서 포메이션 상단을 네이티브로 맞추려면 **`@/components/Header` 와 동일한 브리지 계약**으로 로컬 컴포넌트를 바꾸거나, `isSharedHeaderTopbarPath` 에 `/formation` 규칙을 추가하고 전용 페이로드를 설계하면 된다.
