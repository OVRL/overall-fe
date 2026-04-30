# 네이티브 리퀴드 하단 네브바 (NativeLiquidBottomNav)

인앱 풀 WebView 위에 올려 두는 **네이티브 전용** 하단 탭 바이다. 웹 `(main)` 레이아웃의 글로벌 헤더와 별개로, **탭 전환은 WebView 내부 라우팅**과 동기화된다.

## 목적

- 디자인: 글래스 모피즘 pill + 우측 FAB(`+`), 탭 아이콘·라벨은 Figma SVG 에셋 (`apps/native/assets/native-bottom-nav/`).
- 동작: **홈 / 선수 기록 / 경기 기록 / 내 정보** 네 구역을 오갈 때 하단 네브바가 **항상 보이도록** 한다 (해당 경로 트리 한정).
- 플랫폼: `expo-blur` 의 `BlurView` 사용 시 **네이티브 빌드(dev client / `expo run:ios|android`)** 에 `ExpoBlur` 모듈이 포함되어야 한다. Expo Go만으로는 환경에 따라 `Unimplemented: ExpoBlurView` 가 날 수 있다.

## 탭 ↔ 웹 경로 매핑

| 탭 라벨   | `pathname` (prefix)        | 웹 라우트 예                      |
|-----------|------------------------------|-----------------------------------|
| 홈        | `/`                          | `app/(main)/page.tsx`             |
| 선수 기록 | `/team-data`, `/team-data/*` | 팀 데이터 대시보드 및 하위        |
| 경기 기록 | `/match-record`, `…/*`       | 경기 기록 목록·상세 등            |
| 내 정보   | `/profile`, `/profile/*`     | 프로필 및 하위                    |

우측 **`+` FAB** 기본 이동: `/team-management` (`NativeLiquidBottomNav` 의 `plusHref`, 필요 시 props로 교체).

웹 헤더 메뉴와의 정합은 `apps/web/components/header/headerTypes.ts` 의 `defaultMenuItems` 와 같은 href 성격을 유지하는 것을 권장한다.

## 노출 조건 (pathname)

노출 여부는 **`lib/isNativeBottomNavVisiblePath.ts`** 의 단일 함수로 결정한다.

- 위 네 탭에 해당하는 경로(루트 및 하위 경로)이면 **`true`**.
- 그 외 로그인·온보딩·포메이션 전용 등에서는 **`false`** → 네이티브 네브바 숨김.

함수명·분기를 바꿀 때는 **`index.tsx`** 와 **`webview.tsx`** 두 군데에서 같은 헬퍼를 쓰므로 한 파일만 수정하면 된다.

## 코드 위치 (파일 맵)

| 역할 | 경로 |
|------|------|
| UI 컴포넌트 | `apps/native/components/NativeLiquidBottomNav.tsx` |
| 경로 노출 판별 | `apps/native/lib/isNativeBottomNavVisiblePath.ts` |
| 메인 WebView + 네브바 마운트 | `apps/native/app/index.tsx` |
| 브리지로 열리는 `/webview` 화면 | `apps/native/app/webview.tsx` |
| 탭 이동 | WebView `injectJavaScript` → `window.location.assign(absoluteUrl)` |
| pathname 동기화 | `onNavigationStateChange` + `handleMainAppWebViewNavigationStateChange` 의 `setWebPathname` (`apps/native/lib/mainWebViewNavigationEffects.ts`) |

## 데이터·네비게이션 흐름

1. **`webPathname`** 상태는 WebView의 `onNavigationStateChange` 에서 같은 오리진일 때 `URL.pathname` 으로 갱신된다.
2. **`isNativeBottomNavVisiblePath(webPathname)`** 가 true 이면 `NativeLiquidBottomNav` 렌더.
3. 탭/FAB 탭 시 **`navigateWebViewToPath`** 가 `webOrigin + path` 로 `location.assign` 한다 (SPA 클라이언트 라우팅이 아닌 풀 네비게이션).

## 스타일·에셋

- 레이아웃: pill + `gap` (FAB와 간격), 하단은 `absolute` + `useSafeAreaInsets` 로 오버레이.
- 탭 아이콘: `TAB_ICON_SIZE` (24) — `expo-image` + SVG `require`, 틴트로 활성/비활성 색.
- FAB: 그림자 래퍼 / `Pressable` / `fabGlassClip` 안에 `BlurView` + 그라데이션·테두리 레이어.

## 블러 (`expo-blur`)

- 패키지: `expo-blur` (앱 `package.json` 의존성).
- iOS: 기본 `BlurView`.
- Android: `experimentalBlurMethod="dimezisBlurView"` (실험·성능 이슈 가능).
- 네이티브 바이너리에 모듈이 없으면 빨간 화면 `Unimplemented: ExpoBlurView` — **`expo prebuild` 후 `expo run:ios` / `run:android`** 로 재빌드.

## 변경 시 체크리스트

- [ ] 새 “탭급” 섹션을 네브에 추가하면 `NAV_ITEMS`·`isTabActive`·`isNativeBottomNavVisiblePath`·문서 표를 같이 갱신.
- [ ] 웹만 바꾸고 네이티브 네브가 빠지면 pathname prefix 누락 여부 확인.
- [ ] iOS·Android WebView에서 탭 이동·뒤로가기 후 pathname 동기화.

## 관련 웹·브리지 문서

- 모노레포 브리지 개요: `.agents/skills/native-web-bridge/SKILL.md`
- 인앱 크롬(헤더) 경로: `apps/web/docs/NATIVE_WEB_VIEW_CHROME.md` (네이티브 네브바와 역할이 다름 — 헤더는 별도 브리지)
